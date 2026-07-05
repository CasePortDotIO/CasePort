import { describe, it, expect } from 'vitest'
import { createWalletService } from '@/services/WalletService'
import { createRoutingService } from '@/services/RoutingService'
import { createDeliveryService } from '@/services/DeliveryService'
import { createDeliveryHarness, deliveryDepsFrom, type DeliveryHarness } from '@/services/fakes/deliveryInMemory'
import type { StepRunner, WorkflowDeps, WorkflowEvent } from '@/inngest/stepPort'
import {
  deliverDossierWorkflow,
  reconcileWalletsWorkflow,
  releaseHeldWorkflow,
} from '@/inngest/workflows'

/**
 * The durable layer is thin because the services it calls are idempotent. These
 * tests prove the workflows over a fake step runner, and prove Inngest's core
 * durability contract with a memoizing runner: a completed step is never re run
 * on retry, so a resumed workflow does not double charge.
 */

const MVA = 'motor-vehicle-accident' as const

/** A step runner that executes steps directly and records fanned out events. */
function fakeStep() {
  const events: WorkflowEvent[] = []
  const runner: StepRunner = {
    run: (_id, fn) => fn(),
    sendEvent: async (_id, evs) => {
      events.push(...(Array.isArray(evs) ? evs : [evs]))
    },
  }
  return { runner, events }
}

/** A step runner that memoizes by step id, modelling Inngest durable execution. */
function memoizingStep(store: Map<string, unknown> = new Map()) {
  const events: WorkflowEvent[] = []
  const runner: StepRunner = {
    run: async (id, fn) => {
      if (store.has(id)) return store.get(id) as never
      const r = await fn()
      store.set(id, r)
      return r
    },
    sendEvent: async (_id, evs) => {
      events.push(...(Array.isArray(evs) ? evs : [evs]))
    },
  }
  return { runner, store, events }
}

function workflowDepsFrom(h: DeliveryHarness): WorkflowDeps {
  return {
    routing: createRoutingService({ markets: h.markets, audit: h.audit, events: h.wallet.events, clock: h.wallet.clock }),
    delivery: createDeliveryService(deliveryDepsFrom(h)),
    wallet: createWalletService(h.wallet),
    loadDossier: (id) => h.dossiers.get(id),
  }
}

describe('deliverDossierWorkflow', () => {
  it('routes and delivers a funded dossier, charging once', async () => {
    const h = createDeliveryHarness()
    const deps = workflowDepsFrom(h)
    h.addDossier({ id: 'CP-1', market: 'mkt_atlanta', caseType: MVA })
    await deps.wallet.topUp({ firmId: 'firm_a', amountCents: 200000, idempotencyKey: 'seed' })

    const { runner } = fakeStep()
    const res = await deliverDossierWorkflow(deps, runner, { dossierId: 'CP-1' })

    expect(res.status).toBe('delivered')
    expect(h.wallet.ledgerRows.filter((r) => r.reason === 'delivery-debit')).toHaveLength(1)
    expect(h.wallet.log.filter((e) => e.eventType === 'GeographicRouteResolved')).toHaveLength(1)
    expect(h.wallet.log.filter((e) => e.eventType === 'DossierDelivered')).toHaveLength(1)
  })

  it('holds a dry dossier and fans out a low balance event', async () => {
    const h = createDeliveryHarness()
    const deps = workflowDepsFrom(h)
    h.addDossier({ id: 'CP-2', market: 'mkt_atlanta', caseType: MVA })
    // No top up.

    const { runner, events } = fakeStep()
    const res = await deliverDossierWorkflow(deps, runner, { dossierId: 'CP-2' })

    expect(res.status).toBe('held')
    expect(events.map((e) => e.name)).toContain('wallet/low-balance')
    expect(h.wallet.ledgerRows.filter((r) => r.reason === 'delivery-debit')).toHaveLength(0)
  })

  it('reports no-firm when the market has no assigned firm', async () => {
    const h = createDeliveryHarness({})
    const deps = workflowDepsFrom(h)
    h.addDossier({ id: 'CP-3', market: 'mkt_ghost', caseType: MVA })
    const { runner } = fakeStep()
    const res = await deliverDossierWorkflow(deps, runner, { dossierId: 'CP-3' })
    expect(res.status).toBe('no-firm')
  })

  it('durability: a completed deliver step is not re run on resume, so no double charge', async () => {
    const h = createDeliveryHarness()
    const deliveryDeps = deliveryDepsFrom(h)
    const base = createDeliveryService(deliveryDeps)
    let deliverCalls = 0
    const deps: WorkflowDeps = {
      routing: createRoutingService({ markets: h.markets, audit: h.audit, events: h.wallet.events, clock: h.wallet.clock }),
      delivery: {
        deliver: (input) => {
          deliverCalls += 1
          return base.deliver(input)
        },
        releaseHeld: base.releaseHeld,
      },
      wallet: createWalletService(h.wallet),
      loadDossier: (id) => h.dossiers.get(id),
    }
    h.addDossier({ id: 'CP-4', market: 'mkt_atlanta', caseType: MVA })
    await deps.wallet.topUp({ firmId: 'firm_a', amountCents: 200000, idempotencyKey: 'seed' })

    const { runner, store } = memoizingStep()
    // First run completes and memoizes every step.
    await deliverDossierWorkflow(deps, runner, { dossierId: 'CP-4' })
    // A resume re invokes the function with the same memo: completed steps are
    // returned from the store and the deliver step is never called again.
    await deliverDossierWorkflow(deps, runner, { dossierId: 'CP-4' })

    expect(deliverCalls).toBe(1)
    expect(store.has('deliver')).toBe(true)
    expect(h.wallet.ledgerRows.filter((r) => r.reason === 'delivery-debit')).toHaveLength(1)
  })
})

describe('releaseHeldWorkflow', () => {
  it('drains the held queue after a top up, charging each covered delivery once', async () => {
    const h = createDeliveryHarness()
    const deps = workflowDepsFrom(h)
    h.addDossier({ id: 'CP-5', market: 'mkt_atlanta', caseType: MVA })

    // Held first (no funds).
    const held = await deps.delivery.deliver({ dossierId: 'CP-5', firmId: 'firm_a' })
    expect(held.status).toBe('held')

    await deps.wallet.topUp({ firmId: 'firm_a', amountCents: 100000, idempotencyKey: 'topup' })
    const { runner } = fakeStep()
    const res = await releaseHeldWorkflow(deps, runner, { firmId: 'firm_a' })

    expect(res.delivered).toBe(1)
    expect(res.stillHeld).toBe(0)
    expect(h.wallet.ledgerRows.filter((r) => r.reason === 'delivery-debit')).toHaveLength(1)

    // Idempotent: a duplicate wallet/funded does not double charge.
    await releaseHeldWorkflow(deps, runner, { firmId: 'firm_a' })
    expect(h.wallet.ledgerRows.filter((r) => r.reason === 'delivery-debit')).toHaveLength(1)
  })

  it('leaves still dry deliveries held when the top up is too small', async () => {
    const h = createDeliveryHarness()
    const deps = workflowDepsFrom(h)
    h.addDossier({ id: 'CP-6', market: 'mkt_atlanta', caseType: MVA })
    await deps.delivery.deliver({ dossierId: 'CP-6', firmId: 'firm_a' })

    await deps.wallet.topUp({ firmId: 'firm_a', amountCents: 1000, idempotencyKey: 'tiny' })
    const { runner } = fakeStep()
    const res = await releaseHeldWorkflow(deps, runner, { firmId: 'firm_a' })
    expect(res.delivered).toBe(0)
    expect(res.stillHeld).toBe(1)
  })
})

describe('reconcileWalletsWorkflow', () => {
  it('flags drift for human review instead of silently healing', async () => {
    const h = createDeliveryHarness()
    const deps = workflowDepsFrom(h)
    await deps.wallet.topUp({ firmId: 'firm_a', amountCents: 500000, idempotencyKey: 'seed' })
    // Corrupt the snapshot to simulate drift.
    const snap = h.wallet.snapshotRows.get('firm_a')!
    h.wallet.snapshotRows.set('firm_a', { ...snap, balanceCents: 400000 })

    const { runner, events } = fakeStep()
    const res = await reconcileWalletsWorkflow(deps, runner, { firmIds: ['firm_a'] })

    expect(res[0].inSync).toBe(false)
    expect(res[0].driftCents).toBe(100000)
    expect(events.map((e) => e.name)).toContain('wallet/drift-detected')
    // Not silently healed: the snapshot still reads the drifted value.
    expect(h.wallet.snapshotRows.get('firm_a')!.balanceCents).toBe(400000)
  })
})
