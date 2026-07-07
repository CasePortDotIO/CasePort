import { describe, it, expect } from 'vitest'
import { createDemandCaptureService } from '@/services/DemandCaptureService'
import { createDemandCaptureAgentService } from '@/services/DemandCaptureAgentService'
import {
  createDemandCaptureHarness,
  demandCaptureDepsFrom,
} from '@/services/fakes/demandCaptureInMemory'
import {
  createAdversarialDrafter,
  createFakeSensor,
  demandAgentDepsFrom,
  type AdversarialKind,
} from '@/services/fakes/demandAgentInMemory'
import type { SensedQuestion } from '@/services/demandAgentPorts'

/**
 * The drafting compliance adversarial suite (DEMAND_CAPTURE.md Section 11). Every
 * drafting agent ships an eval that tries to make it produce legal advice,
 * evaluative language, a guarantee, a prohibited call to action, an em dash, or
 * a PI abbreviation, and the pre publish gate must reject every attempt. A non
 * compliant draft can never reach a public surface no matter what the drafter
 * produces. This is the structural proof of HL5, HL6, and HL7.
 */

const question: SensedQuestion = {
  canonicalQuestion: 'What is contributory negligence in Virginia personal injury cases?',
  market: 'va',
  caseType: 'motor-vehicle-accident',
  legalConcept: 'contributory-negligence',
  cellKey: 'va:mva:contributory-negligence',
  uniqueness: 0.95,
  intent: 0.9,
}

function setupWith(kind: AdversarialKind) {
  const h = createDemandCaptureHarness()
  h.fund('va')
  const demand = createDemandCaptureService(demandCaptureDepsFrom(h))
  const agent = createDemandCaptureAgentService(
    demandAgentDepsFrom(demand, h.registry, createFakeSensor([question]), createAdversarialDrafter(kind)),
  )
  return { h, demand, agent }
}

const ATTACKS: AdversarialKind[] = ['legal-advice', 'evaluative', 'guarantee', 'prohibited-cta', 'em-dash', 'abbreviation']

describe('drafting adversarial suite: the gate defeats every attack', () => {
  for (const kind of ATTACKS) {
    it(`blocks a "${kind}" draft at the pre publish gate`, async () => {
      const { h, demand, agent } = setupWith(kind)
      const [top] = await agent.surfaceOpportunities({ market: 'va', surface: 'answer-engine', limit: 1 })
      const draft = await agent.draftForOpportunity(top, 'Martha')

      // Even with a human approver, a non compliant draft cannot publish.
      const res = await demand.publishAsset(draft.id, 'Martha')
      expect(res.published).toBe(false)
      expect(res.reasons.join(' ')).toMatch(/structure|public-copy|intake-cta/)

      // Nothing reached a public surface.
      expect(h.log.map((e) => e.eventType)).not.toContain('CaptureAssetPublished')
      expect(h.log.map((e) => e.eventType)).toContain('CaptureAssetRejected')
    })
  }
})

describe('the engine harvests, never intercepts (HL1)', () => {
  it('produces public assets that route to self initiation and carry no recipient', async () => {
    const h = createDemandCaptureHarness()
    h.fund('va')
    const demand = createDemandCaptureService(demandCaptureDepsFrom(h))
    const { createCompliantDrafter } = await import('@/services/fakes/demandAgentInMemory')
    const agent = createDemandCaptureAgentService(
      demandAgentDepsFrom(demand, h.registry, createFakeSensor([question]), createCompliantDrafter()),
    )
    const [top] = await agent.surfaceOpportunities({ market: 'va', surface: 'answer-engine', limit: 1 })
    const draft = await agent.draftForOpportunity(top, 'Martha')

    // The asset is a public answer routed to self initiation, never a message.
    expect(draft.structure.intakeCtaHref).toContain('/checkmycase')
    expect(draft.structure.intakeCtaText).toBe('Send my information')
    expect(draft).not.toHaveProperty('recipient')
    expect(draft.structure).not.toHaveProperty('to')
  })
})
