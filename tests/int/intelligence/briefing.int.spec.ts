import { describe, it, expect } from 'vitest'
import { createBriefingService } from '@/services/BriefingService'
import {
  createBriefingHarness,
  briefingDepsFrom,
  createGroundedResponder,
} from '@/services/fakes/briefingInMemory'
import type { BriefingArtifact, BriefingRecommendation } from '@/services/briefingPorts'

/**
 * CIC Phase D checkpoint (INTELLIGENCE_CORE.md Section 12). A principal receives
 * a ranked briefing in CasePort numbers and can query it in natural language.
 */

const artifacts: BriefingArtifact[] = [
  { domain: 'demand', title: 'Demand brief', summary: 'Answer engine question clusters growing in Virginia.', generatedAt: '2026-07-06T09:00:00.000Z' },
  { domain: 'supply', title: 'Supply brief', summary: 'Firms with intake directors convert better.', generatedAt: '2026-07-06T09:00:00.000Z' },
  { domain: 'regulatory', title: 'Regulatory brief', summary: 'Georgia advertising opinion published.', generatedAt: '2026-07-06T09:00:00.000Z' },
]

const recommendations: BriefingRecommendation[] = [
  { id: 'rec_low', domain: 'demand', action: 'Publish a DC pedestrian carve out asset.', expectedValue: '+4 percent conversion', rationale: '...' },
  { id: 'rec_high', domain: 'supply', action: 'Move MVA in Atlanta to the higher flat price tier.', expectedValue: '+18 percent margin', rationale: '...' },
  { id: 'rec_mid', domain: 'market', action: 'Refresh the benchmark reference.', expectedValue: '+9 percent citation share', rationale: '...' },
]

function setup(opts?: { emailSends?: boolean; messageSends?: boolean }) {
  const h = createBriefingHarness({ artifacts, recommendations, ...opts })
  const svc = createBriefingService(briefingDepsFrom(h, createGroundedResponder()))
  return { h, svc }
}

describe('fused briefing: ranked by expected value (Section 8)', () => {
  it('fuses the domain briefs and ranks recommendations highest expected value first', async () => {
    const { h, svc } = setup()
    const briefing = await svc.assembleBriefing()

    expect(briefing.domainSummaries).toHaveLength(3)
    expect(briefing.ranked[0]?.recommendationId).toBe('rec_high') // +18 outranks +9 and +4
    expect(briefing.ranked[0]?.rank).toBe(1)
    expect(briefing.ranked[1]?.recommendationId).toBe('rec_mid')
    expect(briefing.ranked[2]?.recommendationId).toBe('rec_low')
    expect(h.log.map((e) => e.eventType)).toContain('BriefingAssembled')
  })

  it('delivers the briefing through the internal channels and records them', async () => {
    const { h, svc } = setup()
    const briefing = await svc.assembleBriefing()
    const delivered = await svc.deliverBriefing(briefing)

    expect(delivered.deliveredChannels).toEqual(['email', 'message'])
    expect(h.emails).toHaveLength(1)
    expect(h.messages).toHaveLength(1)
    expect(h.emails[0]?.body).toMatch(/higher flat price tier/) // the ranked briefing content
    expect(h.log.map((e) => e.eventType)).toContain('BriefingDelivered')
  })

  it('records only the channels that actually delivered', async () => {
    const { svc } = setup({ messageSends: false })
    const delivered = await svc.deliverBriefing(await svc.assembleBriefing())
    expect(delivered.deliveredChannels).toEqual(['email'])
  })
})

describe('on demand query: natural language, cited, internal (Section 8)', () => {
  it('answers a question in CasePort numbers with citations', async () => {
    const { h, svc } = setup()
    const answer = await svc.answerQuery('What should we prioritize in supply this week?')

    expect(answer.answer).toMatch(/higher flat price tier/)
    expect(answer.citations.length).toBeGreaterThan(0)
    expect(answer.confidence).toBe('high')
    expect(h.log.map((e) => e.eventType)).toContain('IntelligenceQueried')
  })

  it('flags low confidence and does not assert when the intelligence is thin', async () => {
    const h = createBriefingHarness({ artifacts: [], recommendations: [] })
    const svc = createBriefingService(briefingDepsFrom(h, createGroundedResponder()))
    const answer = await svc.answerQuery('What should we price slip and fall in Atlanta?')
    expect(answer.confidence).toBe('low')
    expect(answer.answer).toMatch(/not enough current intelligence|human verification/)
  })
})

describe('real time alerts: internal, cited (Section 8)', () => {
  it('raises a regulatory alert through the messaging channel with its citation', async () => {
    const { h, svc } = setup()
    const res = await svc.raiseAlert({
      kind: 'regulatory-change',
      market: 'ga',
      message: 'Georgia advertising opinion may affect referral language.',
      citation: 'signal:ga-bar-ethics',
    })
    expect(res.delivered).toBe(true)
    expect(h.messages[0]?.body).toMatch(/regulatory-change/)
    expect(h.log.map((e) => e.eventType)).toContain('IntelligenceAlertRaised')
  })
})
