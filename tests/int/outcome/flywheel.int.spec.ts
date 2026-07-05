import { describe, it, expect } from 'vitest'
import { signOutcome, verifyOutcome, outcomeCaptureUrl } from '@/lib/outcomeLink'
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
 * The signed case feedback loop's acquisition mechanics: one tap outcome links
 * that cannot be forged, and the reciprocity gate that makes reporting unlock
 * the firm's own true cost per signed case.
 */

describe('one tap outcome links', () => {
  it('verifies a genuine link and rejects a forged or tampered one', () => {
    const sig = signOutcome('del_1', 'retained')
    expect(verifyOutcome('del_1', 'retained', sig)).toBe(true)
    // Tampered result: the signature no longer matches.
    expect(verifyOutcome('del_1', 'not-retained', sig)).toBe(false)
    // Tampered delivery id.
    expect(verifyOutcome('del_2', 'retained', sig)).toBe(false)
    // Forged signature.
    expect(verifyOutcome('del_1', 'retained', 'deadbeef'.repeat(4))).toBe(false)
  })

  it('builds an absolute capture url carrying the signature', () => {
    const url = outcomeCaptureUrl('https://caseport.io', 'del_9', 'retained')
    expect(url).toContain('/api/delivery/del_9/outcome/capture')
    expect(url).toContain('result=retained')
    expect(url).toMatch(/sig=[a-f0-9]{32}/)
  })
})

const tuple: AttributionTuple = { source: 'google', keyword: 'k', firstTouchAt: '2026-07-01T00:00:00.000Z' }
const factors: ScpsFactors = { injuryVerification: 0.9, liabilityClarity: 0.9, statuteStatus: 1, caseTypeMatch: 1, firmResponseCapacity: 0.8 }

describe('reciprocity gate: cost per signed case is locked until the firm reports', () => {
  it('locks the number when fees are paid but no outcome is reported', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    h.seedFee('firm_a', 75000)
    h.seedFee('firm_a', 75000)

    const before = await intel.acer('firm_a')
    expect(before.reported).toBe(false)
    expect(before.locked).toBe(true)
    expect(before.costPerSignedCaseCents).toBeNull()
  })

  it('unlocks the moment the firm reports an outcome', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    const outcomeSvc = createOutcomeService(outcomeDepsFrom(h))
    h.seedFee('firm_a', 75000)
    h.seedFee('firm_a', 75000)
    const chain = h.seedChain({ firmId: 'firm_a', market: 'atlanta-ga', caseType: 'motor-vehicle-accident', attribution: tuple, factors })

    await outcomeSvc.reportOutcome({ deliveryId: chain.deliveryId, firmId: 'firm_a', result: 'retained' })

    const after = await intel.acer('firm_a')
    expect(after.reported).toBe(true)
    expect(after.locked).toBe(false)
    expect(after.signedCases).toBe(1)
    expect(after.costPerSignedCaseCents).toBe(150000) // 2 fees of 75000, one signed
  })
})
