import { describe, it, expect } from 'vitest'
import { createRoutingService } from '@/services/RoutingService'
import { createDeliveryService } from '@/services/DeliveryService'
import { createWalletService } from '@/services/WalletService'
import { createOutcomeService } from '@/services/OutcomeService'
import { createIntelligenceService } from '@/services/IntelligenceService'
import { createAgentService } from '@/services/AgentService'
import { createDeliveryHarness, deliveryDepsFrom } from '@/services/fakes/deliveryInMemory'
import type { AttributionTuple } from '@/services/ports'
import type {
  IntelligenceDeps,
  OutcomeRepository,
  ScpsModelRepository,
  StoredOutcome,
  TraceReader,
} from '@/services/intelligencePorts'
import type { ScpsModel } from '@/services/scps'
import type { AgentDeliveryStore, DeliveryForAgent, FirmContact, FirmContactRepository, Notifier, OutcomeLookup } from '@/services/agentPorts'

/**
 * The whole pipeline, wired end to end over one shared in memory world. This is
 * the seam proof: a claimant's exact keyword flows all the way to a delivered,
 * billed, agent notified case, and the attribution trace returns that same
 * keyword back from the signed outcome. Every service is the real one; only the
 * ports are in memory.
 *
 *   attribution + session -> dossier (carries the session) -> geographic route
 *   -> deliver as a closing kit -> ACID debit, exactly once -> speed callback
 *   -> firm reports signed -> attribution trace returns the originating tuple
 *   -> recalibrate a new SCPS version, touching no fee
 */

const tuple: AttributionTuple = {
  source: 'google',
  keyword: 'atlanta truck accident lawyer',
  referringSurface: '/checkmycase',
  sessionBehavior: { device: 'mobile' },
  firstTouchAt: '2026-07-01T09:00:00.000Z',
}

describe('end to end pipeline', () => {
  it('carries a keyword from intake to a billed, worked case and back through the trace', async () => {
    // ---- one shared world -------------------------------------------------
    const h = createDeliveryHarness()
    const events = h.wallet.events
    const clock = h.wallet.clock

    // A claimant session with the first touch tuple, and the dossier that
    // carries it (the delivery harness stamps intakeSessionId = sess_<id>).
    const sessions = new Map<string, { attribution: AttributionTuple; marketId: string }>()
    const dossier = h.addDossier({ id: 'CP-777', market: 'mkt_atlanta', caseType: 'motor-vehicle-accident', scpsScore: 84 })
    sessions.set(dossier.intakeSessionId!, { attribution: tuple, marketId: 'mkt_atlanta' })

    // Firm funds its wallet for exactly one fee.
    const wallet = createWalletService(h.wallet)
    await wallet.topUp({ firmId: 'firm_a', amountCents: 75000, idempotencyKey: 'seed' })

    // ---- route + deliver + debit -----------------------------------------
    const routing = createRoutingService({ markets: h.markets, audit: h.audit, events, clock })
    const decision = await routing.route({ dossierId: 'CP-777', market: 'mkt_atlanta', validationPassed: true })
    expect(decision.reason).toBe('geographic')
    expect(decision.firmId).toBe('firm_a')

    const delivery = createDeliveryService(deliveryDepsFrom(h))
    const delivered = await delivery.deliver({ dossierId: 'CP-777', firmId: 'firm_a' })
    expect(delivered.status).toBe('delivered')
    expect(await wallet.balance('firm_a')).toBe(0) // charged exactly one fee
    expect(h.wallet.ledgerRows.filter((r) => r.reason === 'delivery-debit')).toHaveLength(1)
    const deliveryId = delivered.deliveryId

    // ---- speed callback agent (gated on the live callback SLA) ------------
    const sent: Array<{ channel: string; body: string }> = []
    const notify: Notifier = {
      sms: async ({ body }) => (sent.push({ channel: 'sms', body }), { sent: true, channel: 'sms', dryRun: true }),
      email: async ({ body }) => (sent.push({ channel: 'email', body }), { sent: true, channel: 'email', dryRun: true }),
    }
    const firmContact: FirmContact = { id: 'firm_a', name: 'Peachtree', phone: '+1404', email: 'p@x.example', slaCallbackMinutes: 15, callbackSlaActive: true }
    const firms: FirmContactRepository = { get: async () => firmContact }
    const respState = new Map<string, { firmRespondedAt: string | null; responseTimeSeconds: number | null; slaBreached: boolean }>()
    const agentDeliveries: AgentDeliveryStore = {
      get: async (id): Promise<DeliveryForAgent | null> => {
        const d = h.deliveryRows.find((r) => r.id === id)
        if (!d) return null
        const rs = respState.get(id) ?? { firmRespondedAt: null, responseTimeSeconds: null, slaBreached: false }
        return { id: d.id, firmId: d.firmId, dossierId: d.dossierId, status: d.status, deliveredAt: d.deliveredAt, ...rs }
      },
      recordResponse: async (id, at, secs) => {
        respState.set(id, { firmRespondedAt: at, responseTimeSeconds: secs, slaBreached: false })
      },
      markSlaBreached: async (id) => {
        const cur = respState.get(id) ?? { firmRespondedAt: null, responseTimeSeconds: null, slaBreached: false }
        respState.set(id, { ...cur, slaBreached: true })
      },
    }

    // ---- shared outcome + intelligence stores ----------------------------
    const outcomeRows: StoredOutcome[] = []
    const outcomes: OutcomeRepository = {
      create: async (input) => {
        const row = { id: `out_${outcomeRows.length + 1}`, ...input }
        outcomeRows.push(row)
        return row
      },
      get: async (id) => outcomeRows.find((o) => o.id === id) ?? null,
      listByFirm: async (firmId) => outcomeRows.filter((o) => o.firmId === firmId),
      listAll: async () => [...outcomeRows],
    }
    const outcomeLookup: OutcomeLookup = { hasOutcome: async (id) => outcomeRows.some((o) => o.deliveryId === id) }

    const agents = createAgentService({ deliveries: agentDeliveries, firms, outcomes: outcomeLookup, notify, events, clock })
    const speed = await agents.notifyOnDelivery({ deliveryId })
    expect(speed.activated).toBe(true)
    expect(sent.length).toBe(2)
    expect(sent.every((m) => m.body.includes('personal injury'))).toBe(true)

    // Decay interrupt should NOT fire yet: the case has no outcome, so it re engages.
    expect((await agents.checkDecay({ deliveryId })).reengaged).toBe(true)

    // ---- firm reports the case signed ------------------------------------
    const outcomeSvc = createOutcomeService({ outcomes, events, ids: h.wallet.ids, clock })
    const balanceBefore = await wallet.balance('firm_a')
    const outcome = await outcomeSvc.reportOutcome({ deliveryId, firmId: 'firm_a', result: 'retained' })
    // W4: reporting the outcome moved no money.
    expect(await wallet.balance('firm_a')).toBe(balanceBefore)

    // Now that an outcome exists, the decay interrupt leaves it alone.
    expect((await agents.checkDecay({ deliveryId })).reengaged).toBe(false)

    // ---- attribution trace: signed case -> originating keyword -----------
    const models = new Map<string, ScpsModel>()
    const modelRepo: ScpsModelRepository = {
      active: async () =>
        [...models.values()]
          .filter((m) => m.status === 'active')
          .sort((a, b) => Number(b.version.slice(1)) - Number(a.version.slice(1)))[0] ?? null,
      get: async (v) => models.get(v) ?? null,
      save: async (m) => void models.set(m.version, m),
      list: async () => [...models.values()],
      promote: async (v) => {
        const m = models.get(v)
        if (!m) return null
        const promoted = { ...m, status: 'active' as const }
        models.set(v, promoted)
        return promoted
      },
    }
    const trace: TraceReader = {
      outcome: async (id) => {
        const o = outcomeRows.find((r) => r.id === id)
        return o ? { id: o.id, deliveryId: o.deliveryId, firmId: o.firmId, result: o.result, settlementValueCents: o.settlementValueCents } : null
      },
      delivery: async (id) => {
        const d = h.deliveryRows.find((r) => r.id === id)
        return d ? { id: d.id, dossierId: d.dossierId, firmId: d.firmId } : null
      },
      dossier: async (id) => (id === 'CP-777' ? { id, market: 'mkt_atlanta', caseType: 'motor-vehicle-accident', intakeSessionId: dossier.intakeSessionId } : null),
      intakeSession: async (id) => {
        const s = sessions.get(id)
        return s ? { id, marketId: s.marketId, attribution: s.attribution } : null
      },
    }
    const intelDeps: IntelligenceDeps = {
      outcomes,
      models: modelRepo,
      scores: { append: async () => ({ id: 'x' }), latestForDossier: async () => null },
      samples: { signedCaseSamples: async () => [] },
      trace,
      events,
      ids: h.wallet.ids,
      clock,
      ledger: { listByFirm: h.wallet.ledger.listByFirm },
    }
    const intel = createIntelligenceService(intelDeps)

    const traced = await intel.attributionTrace(outcome.id)
    expect(traced.complete).toBe(true)
    expect(traced.tuple?.keyword).toBe('atlanta truck accident lawyer')
    expect(traced.market).toBe('mkt_atlanta')

    // ---- recalibrate: a new versioned model, touching no fee -------------
    const ledgerBefore = h.wallet.ledgerRows.length
    const model = await intel.recalibrateScps()
    expect(model.version).toBe('v2')
    expect(h.wallet.ledgerRows.length).toBe(ledgerBefore) // W4: no fee moved

    // ---- the event log tells the whole story -----------------------------
    const types = h.wallet.log.map((e) => e.eventType)
    expect(types).toEqual(
      expect.arrayContaining([
        'GeographicRouteResolved',
        'DossierDelivered',
        'WalletDebited',
        'SpeedCallbackNotified',
        'DecayInterrupt',
        'OutcomeReported',
        'SCPSRecalibrated',
      ]),
    )
  })
})
