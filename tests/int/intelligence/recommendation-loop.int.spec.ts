import { describe, it, expect } from 'vitest'
import { createRecommendationLoopService } from '@/services/RecommendationLoopService'
import {
  createRecommendationLoopHarness,
  recommendationLoopDepsFrom,
} from '@/services/fakes/recommendationLoopInMemory'

/**
 * CIC Phase E checkpoint (INTELLIGENCE_CORE.md Section 12). The CIC grades a past
 * recommendation against its real outcome and adjusts confidence. The engine
 * that grades its own advice against outcomes is the top of the compounding
 * stack.
 */

describe('CIC recommendation self scoring loop (Section 9)', () => {
  it('grades a recommendation against its outcome and calibrates confidence by type', async () => {
    const h = createRecommendationLoopHarness()
    h.seedRecommendation({ id: 'rec_1', domain: 'supply', expectedValue: '+12 percent margin', status: 'executed' })
    h.seedRecommendation({ id: 'rec_2', domain: 'supply', expectedValue: '+8 percent margin', status: 'executed' })
    const svc = createRecommendationLoopService(recommendationLoopDepsFrom(h))

    // Before any measurement, confidence is unknown.
    const before = await svc.calibrationFor('supply')
    expect(before.confidence).toBeNull()

    // One recommendation paid off, one did not.
    const graded = await svc.recordOutcome({ recommendationId: 'rec_1', actualValue: 14, paidOff: true })
    await svc.recordOutcome({ recommendationId: 'rec_2', actualValue: -2, paidOff: false })

    expect(graded?.predicted).toBe('+12 percent margin')
    expect(graded?.actualValue).toBe(14)
    expect(h.log.map((e) => e.eventType)).toContain('RecommendationOutcomeMeasured')

    // Confidence in supply recommendations is now measured: one of two paid off.
    const after = await svc.calibrationFor('supply')
    expect(after.measured).toBe(2)
    expect(after.paidOff).toBe(1)
    expect(after.confidence).toBe(0.5)
  })

  it('returns null for a recommendation that does not exist', async () => {
    const h = createRecommendationLoopHarness()
    const svc = createRecommendationLoopService(recommendationLoopDepsFrom(h))
    expect(await svc.recordOutcome({ recommendationId: 'nope', actualValue: 1, paidOff: true })).toBeNull()
  })

  it('reports calibration across every recommendation type', async () => {
    const h = createRecommendationLoopHarness()
    h.seedRecommendation({ id: 'r', domain: 'regulatory', expectedValue: 'market timing edge', status: 'executed' })
    const svc = createRecommendationLoopService(recommendationLoopDepsFrom(h))
    await svc.recordOutcome({ recommendationId: 'r', actualValue: 1, paidOff: true })
    const all = await svc.calibration()
    const reg = all.find((c) => c.domain === 'regulatory')
    expect(reg?.confidence).toBe(1)
    expect(all.find((c) => c.domain === 'demand')?.confidence).toBeNull()
  })
})
