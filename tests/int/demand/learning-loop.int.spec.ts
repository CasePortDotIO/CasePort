import { describe, it, expect } from 'vitest'
import { createLearningLoopService, surfaceBoosts } from '@/services/LearningLoopService'
import { createLearningHarness, learningDepsFrom } from '@/services/fakes/learningInMemory'
import { createDemandCaptureService } from '@/services/DemandCaptureService'
import { createDemandCaptureAgentService } from '@/services/DemandCaptureAgentService'
import { createDemandCaptureHarness, demandCaptureDepsFrom } from '@/services/fakes/demandCaptureInMemory'
import { createCompliantDrafter, createFakeSensor, demandAgentDepsFrom } from '@/services/fakes/demandAgentInMemory'
import type { ResolvedAttribution } from '@/services/learningPorts'
import type { SensedQuestion } from '@/services/demandAgentPorts'

/**
 * Demand Capture Phase E checkpoint (DEMAND_CAPTURE.md Section 12). A signed case
 * traces back to its originating surface and phrasing, and the CIC reallocates
 * the engine's next cycle toward what converts.
 */

const trace = (o: Partial<ResolvedAttribution> & { outcomeId: string }): ResolvedAttribution => ({
  complete: true,
  signed: true,
  valueCents: 0,
  surface: null,
  keyword: null,
  market: null,
  caseType: null,
  ...o,
})

describe('learning loop: a signed case traces to surface and phrasing (Section 9)', () => {
  it('links a signed outcome back to the exact surface and keyword that produced it', async () => {
    const h = createLearningHarness({
      traces: {
        out_1: trace({
          outcomeId: 'out_1',
          signed: true,
          valueCents: 4200000,
          surface: 'answer-engine',
          keyword: 'virginia contributory negligence',
          market: 'va',
          caseType: 'motor-vehicle-accident',
        }),
      },
    })
    const loop = createLearningLoopService(learningDepsFrom(h))

    const link = await loop.linkOutcome('out_1')
    expect(link?.signed).toBe(true)
    expect(link?.surface).toBe('answer-engine')
    expect(link?.keyword).toBe('virginia contributory negligence')
    expect(link?.market).toBe('va')
    expect(h.log.map((e) => e.eventType)).toContain('CaptureAttributionLinked')
  })

  it('records a broken trace as incomplete rather than dropping it', async () => {
    const h = createLearningHarness({
      traces: { out_x: trace({ outcomeId: 'out_x', complete: false, signed: false, surface: null }) },
    })
    const loop = createLearningLoopService(learningDepsFrom(h))
    const link = await loop.linkOutcome('out_x')
    expect(link?.complete).toBe(false)
  })
})

describe('learning loop: reallocation toward what converts (Section 9)', () => {
  it('weights converting surfaces highest and reranks the next cycle', async () => {
    const h = createLearningHarness({
      traces: {
        // Answer engine produced two large signed cases; search produced one small.
        a1: trace({ outcomeId: 'a1', signed: true, valueCents: 5000000, surface: 'answer-engine', market: 'va' }),
        a2: trace({ outcomeId: 'a2', signed: true, valueCents: 3000000, surface: 'answer-engine', market: 'va' }),
        s1: trace({ outcomeId: 's1', signed: true, valueCents: 500000, surface: 'search', market: 'va' }),
        // An unsigned case does not count toward the aim.
        u1: trace({ outcomeId: 'u1', signed: false, valueCents: 0, surface: 'search', market: 'va' }),
      },
    })
    const loop = createLearningLoopService(learningDepsFrom(h))
    await loop.linkAll()

    const weights = await loop.reallocation()
    expect(weights[0]?.surface).toBe('answer-engine') // converts most, ranked first
    expect(weights[0]?.signed).toBe(2)
    expect(weights[0]?.weight).toBeGreaterThan(weights[1]?.weight ?? 0)

    // The reallocation reranks the next sensing cycle across surfaces.
    const boosts = surfaceBoosts(weights)
    const dh = createDemandCaptureHarness()
    dh.fund('va')
    const demand = createDemandCaptureService(demandCaptureDepsFrom(dh))
    const questions: SensedQuestion[] = [
      // Search question has a slightly higher base score, but answer engine converts.
      { canonicalQuestion: 'q-search', market: 'va', caseType: 'motor-vehicle-accident', legalConcept: 'a', cellKey: 'va:mva:a', surface: 'search', uniqueness: 0.9, intent: 0.85 },
      { canonicalQuestion: 'q-aeo', market: 'va', caseType: 'motor-vehicle-accident', legalConcept: 'b', cellKey: 'va:mva:b', surface: 'answer-engine', uniqueness: 0.85, intent: 0.85 },
    ]
    const agent = createDemandCaptureAgentService(
      demandAgentDepsFrom(demand, dh.registry, createFakeSensor(questions), createCompliantDrafter()),
    )

    // Without the boost, the higher scored search question ranks first.
    const plain = await agent.surfaceOpportunities({ market: 'va', surface: 'answer-engine', limit: 5 })
    expect(plain[0]?.surface).toBe('search')

    // With the learning loop boost, the converting answer engine surface wins.
    const reallocated = await agent.surfaceOpportunities({ market: 'va', surface: 'answer-engine', limit: 5 }, { boosts })
    expect(reallocated[0]?.surface).toBe('answer-engine')
  })
})

describe('learning loop: citation ownership is measured, not assumed (Section 9)', () => {
  it('records whether answer engines cite CasePort for a target question', async () => {
    const h = createLearningHarness({
      traces: {},
      cited: { 'What is contributory negligence in Virginia?': ['perplexity', 'chatgpt'] },
    })
    const loop = createLearningLoopService(learningDepsFrom(h))
    await loop.trackCitation('What is contributory negligence in Virginia?', 'answer-engine', 'va')
    await loop.trackCitation('An unowned question', 'answer-engine', 'va')

    expect(h.presenceRows.find((p) => p.cited)?.engines).toEqual(['perplexity', 'chatgpt'])
    expect(h.presenceRows.find((p) => !p.cited)?.question).toBe('An unowned question')
    expect(h.log.map((e) => e.eventType)).toContain('CitationTracked')
  })
})
