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

/**
 * AGENTS.md Section 3 and Section 4.6: promoting an SCPS model version is human
 * in the loop. Recalibration proposes a new version; it scores nothing until a
 * human promotes it. A scorer that silently rewrites itself breaks auditability
 * and the trust the feedback loop depends on. These tests prove the gate:
 *   - recalibration produces a proposed version, and scoring still uses v1
 *   - a human promotion flips it to active, and scoring then uses it
 *   - promotion is audited (SCPSPromoted) and never touches any weight
 *   - promoting a missing or already active version is a guarded no op
 */

const tuple: AttributionTuple = { source: 'google', keyword: 'k', firstTouchAt: '2026-07-01T00:00:00.000Z' }
const strong: ScpsFactors = { injuryVerification: 0.95, liabilityClarity: 0.95, statuteStatus: 1, caseTypeMatch: 1, firmResponseCapacity: 0.9 }
const weak: ScpsFactors = { injuryVerification: 0.2, liabilityClarity: 0.2, statuteStatus: 0.3, caseTypeMatch: 0.4, firmResponseCapacity: 0.3 }

async function seedAndReport(h: IntelligenceHarness, factors: ScpsFactors, result: 'retained' | 'not-retained') {
  const chain = h.seedChain({ firmId: 'firm_a', market: 'atlanta-ga', caseType: 'motor-vehicle-accident', attribution: tuple, factors })
  const outcomeSvc = createOutcomeService(outcomeDepsFrom(h))
  await outcomeSvc.reportOutcome({ deliveryId: chain.deliveryId, firmId: 'firm_a', result })
}

/** Enough separated data that recalibration actually shifts weights. */
async function seedLearnableOutcomes(h: IntelligenceHarness) {
  for (let i = 0; i < 3; i++) await seedAndReport(h, strong, 'retained')
  for (let i = 0; i < 3; i++) await seedAndReport(h, weak, 'not-retained')
}

describe('SCPS promotion is human in the loop (AGENTS.md 4.6)', () => {
  it('recalibration proposes a version that does not score until promoted', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))

    // Seed v1 as the active scoring model, then recalibrate.
    await intel.scoreDossier('CP-seed', strong)
    await seedLearnableOutcomes(h)
    const proposed = await intel.recalibrateScps()

    expect(proposed.version).toBe('v2')
    expect(proposed.status).toBe('proposed')

    // The active scoring model is still v1: the proposal scores nothing.
    const scored = await intel.scoreDossier('CP-after-recalibrate', strong)
    expect(scored.modelVersion).toBe('v1')
  })

  it('a human promotion activates the version and it then scores', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    await intel.scoreDossier('CP-seed', strong)
    await seedLearnableOutcomes(h)
    await intel.recalibrateScps()

    const result = await intel.promoteScpsModel({ version: 'v2', approvedBy: 'founder@caseport.io' })
    expect(result.promoted).toBe(true)
    expect(result.reason).toBe('promoted')
    expect(result.model?.status).toBe('active')

    // Scoring now uses the promoted version.
    const scored = await intel.scoreDossier('CP-after-promote', strong)
    expect(scored.modelVersion).toBe('v2')

    // The promotion is audited with who approved it.
    const promoted = h.log.filter((e) => e.eventType === 'SCPSPromoted')
    expect(promoted).toHaveLength(1)
    expect(promoted[0].actor).toBe('founder@caseport.io')
    expect(promoted[0].payload?.fromActiveVersion).toBe('v1')
  })

  it('promotion flips status only and never mutates weights (scores stay reproducible)', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    await intel.scoreDossier('CP-seed', strong)
    await seedLearnableOutcomes(h)
    const proposed = await intel.recalibrateScps()
    const weightsBefore = { ...proposed.weights }

    await intel.promoteScpsModel({ version: 'v2', approvedBy: 'founder@caseport.io' })

    const afterPromote = await h.models.get('v2')
    expect(afterPromote?.weights).toEqual(weightsBefore)
  })

  it('guards promotion of a missing or already active version', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    await intel.scoreDossier('CP-seed', strong)

    const missing = await intel.promoteScpsModel({ version: 'v9', approvedBy: 'founder@caseport.io' })
    expect(missing.promoted).toBe(false)
    expect(missing.reason).toBe('not-found')

    // v1 is already active. Re promoting is a guarded no op, not a duplicate event.
    const already = await intel.promoteScpsModel({ version: 'v1', approvedBy: 'founder@caseport.io' })
    expect(already.promoted).toBe(false)
    expect(already.reason).toBe('already-active')
    expect(h.log.filter((e) => e.eventType === 'SCPSPromoted')).toHaveLength(0)
  })

  it('lists the model lineage with the active one flagged, newest first', async () => {
    const h = createIntelligenceHarness()
    const intel = createIntelligenceService(intelligenceDepsFrom(h))
    await intel.scoreDossier('CP-seed', strong)
    await seedLearnableOutcomes(h)
    await intel.recalibrateScps()

    const before = await intel.listScpsModels()
    expect(before.map((m) => m.version)).toEqual(['v2', 'v1'])
    expect(before.find((m) => m.version === 'v1')?.isActive).toBe(true)
    expect(before.find((m) => m.version === 'v2')?.isActive).toBe(false)

    await intel.promoteScpsModel({ version: 'v2', approvedBy: 'founder@caseport.io' })
    const after = await intel.listScpsModels()
    expect(after.find((m) => m.version === 'v2')?.isActive).toBe(true)
    expect(after.find((m) => m.version === 'v1')?.isActive).toBe(false)
  })
})
