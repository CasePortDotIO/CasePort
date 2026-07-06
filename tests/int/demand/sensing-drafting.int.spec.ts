import { describe, it, expect } from 'vitest'
import { createDemandCaptureService } from '@/services/DemandCaptureService'
import { createDemandCaptureAgentService } from '@/services/DemandCaptureAgentService'
import {
  createDemandCaptureHarness,
  demandCaptureDepsFrom,
} from '@/services/fakes/demandCaptureInMemory'
import {
  createCompliantDrafter,
  createFakeSensor,
  demandAgentDepsFrom,
} from '@/services/fakes/demandAgentInMemory'
import type { SensedQuestion } from '@/services/demandAgentPorts'

/**
 * Demand Capture Phase B checkpoint (DEMAND_CAPTURE.md Section 12). The engine
 * surfaces a ranked list of unowned high intent questions in a funded market and
 * drafts a compliant, citable answer that a human approves and posts. Nothing
 * here contacts an injured person; the engine works with questions, never people.
 */

const questions: SensedQuestion[] = [
  // Strong, unique, high intent. Should be pursued and ranked first.
  { canonicalQuestion: 'What is contributory negligence in Virginia personal injury cases?', market: 'va', caseType: 'motor-vehicle-accident', legalConcept: 'contributory-negligence', cellKey: 'va:mva:contributory-negligence', uniqueness: 0.95, intent: 0.9 },
  // Funded and pursued but lower score. Ranked second.
  { canonicalQuestion: 'How long do I have to file a personal injury claim in Virginia?', market: 'va', caseType: 'motor-vehicle-accident', legalConcept: 'statute-of-limitations', cellKey: 'va:mva:statute', uniqueness: 0.7, intent: 0.6 },
  // Nothing unique to say. Ignored, never surfaced.
  { canonicalQuestion: 'What is a personal injury lawyer?', market: 'va', caseType: 'motor-vehicle-accident', legalConcept: 'generic', cellKey: 'va:mva:generic', uniqueness: 0.2, intent: 0.9 },
]

function setup() {
  const h = createDemandCaptureHarness()
  h.fund('va')
  const demand = createDemandCaptureService(demandCaptureDepsFrom(h))
  const agent = createDemandCaptureAgentService(
    demandAgentDepsFrom(demand, h.registry, createFakeSensor(questions), createCompliantDrafter()),
  )
  return { h, demand, agent }
}

describe('demand sensing: ranked, unowned, funded (Section 6, HL3)', () => {
  it('surfaces only pursued unowned questions, ranked by score', async () => {
    const { agent } = setup()
    const opps = await agent.surfaceOpportunities({ market: 'va', surface: 'answer-engine', limit: 10 })

    expect(opps).toHaveLength(2) // the generic vanity question is dropped
    expect(opps[0]?.cellKey).toBe('va:mva:contributory-negligence') // highest score first
    expect(opps[1]?.cellKey).toBe('va:mva:statute')
    expect(opps.every((o) => o.score > 0)).toBe(true)
  })

  it('surfaces nothing in an unfunded market (HL3)', async () => {
    const h = createDemandCaptureHarness()
    // Note: no h.fund('va').
    const demand = createDemandCaptureService(demandCaptureDepsFrom(h))
    const agent = createDemandCaptureAgentService(
      demandAgentDepsFrom(demand, h.registry, createFakeSensor(questions), createCompliantDrafter()),
    )
    const opps = await agent.surfaceOpportunities({ market: 'va', surface: 'answer-engine', limit: 10 })
    expect(opps).toHaveLength(0)
  })
})

describe('demand drafting: compliant, human approved and posted (HL4)', () => {
  it('drafts an answer, queues it for approval, and a human publishes it', async () => {
    const { h, demand, agent } = setup()
    const [top] = await agent.surfaceOpportunities({ market: 'va', surface: 'answer-engine', limit: 1 })

    const draft = await agent.draftForOpportunity(top, 'Martha')
    expect(draft.status).toBe('draft')

    const submitted = await agent.submitForApproval(draft.id)
    expect(submitted?.status).toBe('pending-approval')

    // The agent never publishes. A human does, through the pre publish gate.
    const res = await demand.publishAsset(draft.id, 'Martha')
    expect(res.published).toBe(true)
    expect(res.asset?.approvedBy).toBe('Martha')

    const types = h.log.map((e) => e.eventType)
    expect(types).toContain('CaptureAssetDrafted')
    expect(types).toContain('CaptureAssetSubmitted')
    expect(types).toContain('CaptureAssetPublished')
  })

  it('senseAndDraft leaves each top opportunity queued for a human, never published', async () => {
    const { h, agent } = setup()
    const { opportunities, drafts } = await agent.senseAndDraft({
      market: 'va',
      surface: 'answer-engine',
      limit: 2,
      owningIdentity: 'Martha',
    })
    expect(opportunities).toHaveLength(2)
    expect(drafts.every((d) => d.status === 'pending-approval')).toBe(true)
    // Nothing was published without a human.
    expect(h.log.map((e) => e.eventType)).not.toContain('CaptureAssetPublished')
  })
})
