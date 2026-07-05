import { describe, it, expect } from 'vitest'
import { createOutcomeService } from '@/services/OutcomeService'
import { createIntelligenceService } from '@/services/IntelligenceService'
import {
  createIntelligenceHarness,
  intelligenceDepsFrom,
  outcomeDepsFrom,
} from '@/services/fakes/intelligenceInMemory'
import type { AttributionTuple } from '@/services/ports'
import type { ScpsFactors } from '@/services/scps'

/**
 * Phase 4 checkpoint (Section 13, Section 11). The full attribution trace from a
 * signed case back to the originating tuple returns correctly. This is the
 * Answer to Wallet moat: given a firm reported signed case, return the exact
 * source, keyword, and intake behavior that produced it, end to end.
 */

const tuple: AttributionTuple = {
  source: 'google',
  keyword: 'atlanta car accident lawyer',
  referringSurface: '/checkmycase',
  sessionBehavior: { device: 'mobile', dwellSeconds: 214 },
  firstTouchAt: '2026-07-01T09:14:00.000Z',
}

const factors: ScpsFactors = {
  injuryVerification: 0.9,
  liabilityClarity: 0.8,
  statuteStatus: 1,
  caseTypeMatch: 1,
  firmResponseCapacity: 0.7,
}

describe('attribution trace (W the moat, Section 11)', () => {
  it('traces a signed case back to the exact originating tuple', async () => {
    const h = createIntelligenceHarness()
    const outcomeSvc = createOutcomeService(outcomeDepsFrom(h))
    const intel = createIntelligenceService(intelligenceDepsFrom(h))

    // A claimant arrives from a specific keyword, becomes a dossier, is delivered.
    const chain = h.seedChain({ firmId: 'firm_a', market: 'atlanta-ga', caseType: 'motor-vehicle-accident', attribution: tuple, factors })

    // The firm reports the case signed.
    const outcome = await outcomeSvc.reportOutcome({ deliveryId: chain.deliveryId, firmId: 'firm_a', result: 'retained' })

    // The trace returns the exact first touch tuple.
    const trace = await intel.attributionTrace(outcome.id)
    expect(trace.complete).toBe(true)
    expect(trace.brokenAt).toBeNull()
    expect(trace.market).toBe('atlanta-ga')
    expect(trace.caseType).toBe('motor-vehicle-accident')
    expect(trace.tuple?.source).toBe('google')
    expect(trace.tuple?.keyword).toBe('atlanta car accident lawyer')
    expect(trace.tuple?.firstTouchAt).toBe('2026-07-01T09:14:00.000Z')
    expect(trace.tuple?.sessionBehavior).toEqual({ device: 'mobile', dwellSeconds: 214 })
  })

  it('names exactly where a trace breaks when a link is missing', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    const trace = await intel.attributionTrace('out_does_not_exist')
    expect(trace.complete).toBe(false)
    expect(trace.brokenAt).toBe('outcome')
  })
})

describe('OutcomeService never touches billing (W4)', () => {
  it('records an outcome and emits OutcomeReported, with no ledger effect', async () => {
    const h = createIntelligenceHarness()
    const outcomeSvc = createOutcomeService(outcomeDepsFrom(h))
    const chain = h.seedChain({ firmId: 'firm_a', market: 'atlanta-ga', caseType: 'motor-vehicle-accident', attribution: tuple, factors })

    const ledgerBefore = h.ledgerRows.length
    const outcome = await outcomeSvc.reportOutcome({
      deliveryId: chain.deliveryId,
      firmId: 'firm_a',
      result: 'settled',
      settlementValueCents: 12500000,
    })

    expect(outcome.result).toBe('settled')
    expect(outcome.settlementValueCents).toBe(12500000)
    expect(h.log.filter((e) => e.eventType === 'OutcomeReported')).toHaveLength(1)
    // W4: a huge settlement value moved no money. The ledger is untouched.
    expect(h.ledgerRows.length).toBe(ledgerBefore)
    // Structural: OutcomeDeps exposes no ledger or wallet port at all.
    expect(Object.keys(outcomeDepsFrom(h))).toEqual(['outcomes', 'events', 'ids', 'clock'])
  })
})
