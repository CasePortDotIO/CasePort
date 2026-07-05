import { describe, it, expect } from 'vitest'
import { createOutcomeService } from '@/services/OutcomeService'
import { createIntelligenceService } from '@/services/IntelligenceService'
import {
  createIntelligenceHarness,
  intelligenceDepsFrom,
  outcomeDepsFrom,
  type IntelligenceHarness,
} from '@/services/fakes/intelligenceInMemory'
import type { AttributionTuple } from '@/services/ports'
import type { ScpsFactors } from '@/services/scps'
import { scpsScore, defaultV1Model } from '@/services/scps'

/**
 * Phase 4 checkpoint (Section 13, Section 9). An outcome recalibrates a versioned
 * score without touching any fee. Plus SCPS versioning: every score records the
 * model that produced it, recalibration writes a new version, and the loop is
 * wired from day one even before there is data to learn from.
 */

const tuple: AttributionTuple = {
  source: 'google',
  keyword: 'k',
  firstTouchAt: '2026-07-01T00:00:00.000Z',
}

const strong: ScpsFactors = { injuryVerification: 0.95, liabilityClarity: 0.95, statuteStatus: 1, caseTypeMatch: 1, firmResponseCapacity: 0.9 }
const weak: ScpsFactors = { injuryVerification: 0.2, liabilityClarity: 0.2, statuteStatus: 0.3, caseTypeMatch: 0.4, firmResponseCapacity: 0.3 }

/** Seed a delivered dossier with given factors, then report its outcome. */
async function seedAndReport(h: IntelligenceHarness, factors: ScpsFactors, result: 'retained' | 'not-retained') {
  const chain = h.seedChain({ firmId: 'firm_a', market: 'atlanta-ga', caseType: 'motor-vehicle-accident', attribution: tuple, factors })
  const outcomeSvc = createOutcomeService(outcomeDepsFrom(h))
  await outcomeSvc.reportOutcome({ deliveryId: chain.deliveryId, firmId: 'firm_a', result })
}

describe('SCPS scoring is versioned (Section 9, W2)', () => {
  it('scores a dossier against the active model and records the model version', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    const res = await intel.scoreDossier('CP-1', strong)
    expect(res.modelVersion).toBe('v1')
    expect(res.score).toBe(scpsScore(defaultV1Model('t'), strong))
    // The stored score carries its model version.
    expect(h.scoreRows[0].modelVersion).toBe('v1')
  })
})

describe('Signed Case Feedback Loop (Section 9)', () => {
  it('recalibrates to a new version without touching any fee (checkpoint)', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    // Some real fees exist on the ledger.
    h.seedFee('firm_a', 75000)
    h.seedFee('firm_a', 75000)
    const feeRowsBefore = h.ledgerRows.length

    // Outcomes accumulate: strong factors sign, weak factors decline.
    await seedAndReport(h, strong, 'retained')
    await seedAndReport(h, strong, 'retained')
    await seedAndReport(h, strong, 'retained')
    await seedAndReport(h, weak, 'not-retained')
    await seedAndReport(h, weak, 'not-retained')
    await seedAndReport(h, weak, 'not-retained')

    const model = await intel.recalibrateScps()

    // A new, versioned model exists.
    expect(model.version).toBe('v2')
    expect(model.basis.sampleCount).toBe(6)
    expect(model.basis.signedCount).toBe(3)
    expect(await h.models.get('v2')).not.toBeNull()
    // The recalibration emitted its audit event.
    expect(h.log.filter((e) => e.eventType === 'SCPSRecalibrated')).toHaveLength(1)
    // The checkpoint: no fee was touched. No ledger rows added or changed.
    expect(h.ledgerRows.length).toBe(feeRowsBefore)
    expect(h.ledgerRows.every((r) => Math.abs(r.amountCents) === 75000)).toBe(true)
    // Old v1 model is untouched and still retrievable (append only versioning).
    expect(await h.models.get('v1')).not.toBeNull()
  })

  it('carries weights forward when there is not enough data to learn from', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    // Only two outcomes: below the learning threshold.
    await seedAndReport(h, strong, 'retained')
    await seedAndReport(h, weak, 'not-retained')

    const model = await intel.recalibrateScps()
    expect(model.version).toBe('v2')
    expect(model.basis.sampleCount).toBe(2)
    // Weights unchanged from v1 (carried forward), sum to one.
    const v1 = defaultV1Model('t')
    const sum = Object.values(model.weights).reduce((s, w) => s + w, 0)
    expect(sum).toBeCloseTo(1, 6)
    expect(model.weights.injuryVerification).toBeCloseTo(v1.weights.injuryVerification, 6)
  })

  it('shifts weight toward factors that separate signed from declined cases', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    // Signed cases have high liability clarity; declined ones low. Other factors flat.
    const flat = 0.5
    const signedF: ScpsFactors = { injuryVerification: flat, liabilityClarity: 0.95, statuteStatus: flat, caseTypeMatch: flat, firmResponseCapacity: flat }
    const declinedF: ScpsFactors = { injuryVerification: flat, liabilityClarity: 0.1, statuteStatus: flat, caseTypeMatch: flat, firmResponseCapacity: flat }
    for (let i = 0; i < 3; i++) await seedAndReport(h, signedF, 'retained')
    for (let i = 0; i < 3; i++) await seedAndReport(h, declinedF, 'not-retained')

    const v1 = defaultV1Model('t')
    const model = await intel.recalibrateScps()
    // Liability clarity separated the classes, so its weight rose vs v1.
    expect(model.weights.liabilityClarity).toBeGreaterThan(v1.weights.liabilityClarity)
    // Weights still normalized.
    const sum = Object.values(model.weights).reduce((s, w) => s + w, 0)
    expect(sum).toBeCloseTo(1, 6)
  })
})

describe('ACER cost per signed case (decision D1)', () => {
  it('divides fees paid by signed cases, reading billing into intelligence', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    h.seedFee('firm_a', 75000)
    h.seedFee('firm_a', 75000)
    h.seedFee('firm_a', 75000)
    await seedAndReport(h, strong, 'retained')
    await seedAndReport(h, weak, 'not-retained')

    const acer = await intel.acer('firm_a')
    expect(acer.feesPaidCents).toBe(225000)
    expect(acer.signedCases).toBe(1)
    expect(acer.costPerSignedCaseCents).toBe(225000)
  })
})
