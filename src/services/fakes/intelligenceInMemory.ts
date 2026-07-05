import type { AttributionTuple, EventStore, IdGenerator, StoredEvent } from '../ports'
import type { ScpsFactors, ScpsModel, ScpsSample } from '../scps'
import type {
  IntelligenceDeps,
  OutcomeDeps,
  OutcomeRepository,
  RecalibrationReader,
  ScpsModelRepository,
  ScpsScoreRepository,
  StoredOutcome,
  TraceReader,
} from '../intelligencePorts'
import type { LedgerRepository, StoredLedgerEntry } from '../walletPorts'

/**
 * In memory harness for the outcome loop and the intelligence layer. It models
 * the full trace chain (session, dossier, delivery, outcome) so the attribution
 * trace can be proven end to end, and it joins outcomes to dossier factors so
 * the recalibration loop has real samples. Nothing here runs in production.
 */

interface TraceSessionRow {
  id: string
  marketId: string | null
  attribution: AttributionTuple
}
interface TraceDossierRow {
  id: string
  market: string
  caseType: string
  intakeSessionId: string | null
  factors: ScpsFactors
}
interface TraceDeliveryRow {
  id: string
  dossierId: string
  firmId: string
}

export interface IntelligenceHarness {
  log: StoredEvent[]
  outcomeRows: StoredOutcome[]
  modelRows: Map<string, ScpsModel>
  scoreRows: Array<{ id: string; dossierId: string; modelVersion: string; score: number; factors: ScpsFactors; computedAt: string }>
  ledgerRows: StoredLedgerEntry[]
  outcomes: OutcomeRepository
  models: ScpsModelRepository
  scores: ScpsScoreRepository
  samples: RecalibrationReader
  trace: TraceReader
  events: EventStore
  ids: IdGenerator
  clock: { nowIso: () => string }
  ledger: Pick<LedgerRepository, 'listByFirm'>
  /** Seed a full trace chain and return its ids. */
  seedChain(input: {
    firmId: string
    market: string
    caseType: string
    attribution: AttributionTuple
    factors: ScpsFactors
  }): { sessionId: string; dossierId: string; deliveryId: string }
  /** Seed a delivery-debit ledger entry so ACER has fees to read. */
  seedFee(firmId: string, feeCents: number): void
}

export function createIntelligenceHarness(): IntelligenceHarness {
  const log: StoredEvent[] = []
  const outcomeRows: StoredOutcome[] = []
  const modelRows = new Map<string, ScpsModel>()
  const scoreRows: IntelligenceHarness['scoreRows'] = []
  const ledgerRows: StoredLedgerEntry[] = []
  const sessions: TraceSessionRow[] = []
  const dossiers: TraceDossierRow[] = []
  const deliveries: TraceDeliveryRow[] = []

  let n = 0
  const next = (p: string) => `${p}_${(n += 1)}`
  const ids: IdGenerator = {
    sessionId: () => next('sess'),
    claimantId: () => next('clm'),
    dossierId: () => next('CP'),
    eventId: () => next('evt'),
    submissionId: () => next('sub'),
  }
  const clock = { nowIso: () => '2026-07-05T12:00:00.000Z' }

  const events: EventStore = {
    append: async (event) => {
      const stored: StoredEvent = { id: ids.eventId(), ...event }
      log.push(stored)
      return stored
    },
  }

  const outcomes: OutcomeRepository = {
    create: async (input) => {
      const row: StoredOutcome = { id: next('out'), ...input }
      outcomeRows.push(row)
      return row
    },
    get: async (id) => outcomeRows.find((o) => o.id === id) ?? null,
    listByFirm: async (firmId) => outcomeRows.filter((o) => o.firmId === firmId),
    listAll: async () => [...outcomeRows],
  }

  const models: ScpsModelRepository = {
    active: async () => {
      // The highest version number is active.
      const all = [...modelRows.values()]
      if (all.length === 0) return null
      return all.sort((a, b) => versionNum(b.version) - versionNum(a.version))[0]
    },
    get: async (version) => modelRows.get(version) ?? null,
    save: async (model) => {
      modelRows.set(model.version, model)
    },
    list: async () => [...modelRows.values()],
  }

  const scores: ScpsScoreRepository = {
    append: async (input) => {
      const id = next('score')
      scoreRows.push({ id, ...input })
      return { id }
    },
    latestForDossier: async (dossierId) => {
      const rows = scoreRows.filter((s) => s.dossierId === dossierId)
      const last = rows[rows.length - 1]
      return last ? { score: last.score, modelVersion: last.modelVersion, factors: last.factors } : null
    },
  }

  const samples: RecalibrationReader = {
    signedCaseSamples: async (): Promise<ScpsSample[]> => {
      const out: ScpsSample[] = []
      for (const o of outcomeRows) {
        const delivery = deliveries.find((d) => d.id === o.deliveryId)
        if (!delivery) continue
        const dossier = dossiers.find((d) => d.id === delivery.dossierId)
        if (!dossier) continue
        out.push({ factors: dossier.factors, signed: o.result === 'retained' || o.result === 'settled' })
      }
      return out
    },
  }

  const trace: TraceReader = {
    outcome: async (id) => {
      const o = outcomeRows.find((r) => r.id === id)
      return o ? { id: o.id, deliveryId: o.deliveryId, firmId: o.firmId, result: o.result, settlementValueCents: o.settlementValueCents } : null
    },
    delivery: async (id) => {
      const d = deliveries.find((r) => r.id === id)
      return d ? { id: d.id, dossierId: d.dossierId, firmId: d.firmId } : null
    },
    dossier: async (id) => {
      const d = dossiers.find((r) => r.id === id)
      return d ? { id: d.id, market: d.market, caseType: d.caseType, intakeSessionId: d.intakeSessionId } : null
    },
    intakeSession: async (id) => {
      const s = sessions.find((r) => r.id === id)
      return s ? { id: s.id, marketId: s.marketId, attribution: s.attribution } : null
    },
  }

  const ledger: Pick<LedgerRepository, 'listByFirm'> = {
    listByFirm: async (firmId) => ledgerRows.filter((r) => r.firmId === firmId),
  }

  return {
    log,
    outcomeRows,
    modelRows,
    scoreRows,
    ledgerRows,
    outcomes,
    models,
    scores,
    samples,
    trace,
    events,
    ids,
    clock,
    ledger,
    seedChain: ({ firmId, market, caseType, attribution, factors }) => {
      const sessionId = ids.sessionId()
      const dossierId = ids.dossierId()
      const deliveryId = next('del')
      sessions.push({ id: sessionId, marketId: market, attribution })
      dossiers.push({ id: dossierId, market, caseType, intakeSessionId: sessionId, factors })
      deliveries.push({ id: deliveryId, dossierId, firmId })
      return { sessionId, dossierId, deliveryId }
    },
    seedFee: (firmId, feeCents) => {
      ledgerRows.push({
        id: next('led'),
        firmId,
        entryType: 'debit',
        reason: 'delivery-debit',
        amountCents: -Math.abs(feeCents),
        idempotencyKey: next('key'),
        occurredAt: clock.nowIso(),
        balanceAfterCents: 0,
      })
    },
  }
}

function versionNum(v: string): number {
  const n = Number.parseInt(v.replace(/^v/, ''), 10)
  return Number.isFinite(n) ? n : 0
}

/** Build OutcomeDeps from the harness. Note: no ledger, by design (W4). */
export function outcomeDepsFrom(h: IntelligenceHarness): OutcomeDeps {
  return { outcomes: h.outcomes, events: h.events, ids: h.ids, clock: h.clock }
}

/** Build IntelligenceDeps from the harness. */
export function intelligenceDepsFrom(h: IntelligenceHarness): IntelligenceDeps {
  return {
    outcomes: h.outcomes,
    models: h.models,
    scores: h.scores,
    samples: h.samples,
    trace: h.trace,
    events: h.events,
    ids: h.ids,
    clock: h.clock,
    ledger: h.ledger,
  }
}
