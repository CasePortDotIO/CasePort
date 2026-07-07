import { describe, it, expect } from 'vitest'
import { createB2BCaptureService } from '@/services/B2BCaptureService'
import {
  createB2BHarness,
  b2bDepsFrom,
  createFakeResearcher,
  createCompliantOutboundDrafter,
  createAdversarialOutboundDrafter,
  type OutboundAttack,
} from '@/services/fakes/b2bInMemory'
import { findRule71Violations } from '@/lib/compliance/rule71'

/**
 * Demand Capture Phase C checkpoint (DEMAND_CAPTURE.md Section 12). An outbound
 * draft carries accurate, redacted market proof and passes the Rule 7.1
 * adversarial suite. Outbound is human sent (HL4, HL6); the service never sends.
 */

function setup(drafter = createCompliantOutboundDrafter()) {
  const h = createB2BHarness()
  const svc = createB2BCaptureService(b2bDepsFrom(h, createFakeResearcher(), drafter))
  return { h, svc }
}

describe('B2B outbound: redacted market proof, human sent (Section 5.2, HL6)', () => {
  it('drafts a compliant outreach with redacted proof, queued for a human send', async () => {
    const { h, svc } = setup()
    const target = await svc.addTarget({ firmName: 'Smith and Partners', market: 'va', partnerName: 'Ms. Smith' })

    const res = await svc.draftOutbound(target.id)
    expect(res.ok).toBe(true)
    expect(res.target?.status).toBe('drafted')
    expect(res.target?.outbound?.status).toBe('pending-send')
    // Proof of reality is present and carries no claimant PII.
    expect(res.target?.outbound?.proof.length).toBeGreaterThan(0)
    const proofText = res.target?.outbound?.proof.map((p) => p.summary).join(' ') ?? ''
    expect(findRule71Violations(proofText)).toEqual([])

    const types = h.log.map((e) => e.eventType)
    expect(types).toContain('B2BTargetAdded')
    expect(types).toContain('OutboundDrafted')
  })

  it('does not send autonomously; a human send is required (HL4, HL6)', async () => {
    const { h, svc } = setup()
    const target = await svc.addTarget({ firmName: 'Smith and Partners', market: 'va' })
    await svc.draftOutbound(target.id)

    // No sender: nothing is sent.
    expect(await svc.markSent(target.id, '')).toBeNull()
    expect(h.log.map((e) => e.eventType)).not.toContain('OutboundSent')

    // A named human sends.
    const sent = await svc.markSent(target.id, 'a-principal')
    expect(sent?.outbound?.status).toBe('sent')
    expect(sent?.outbound?.sentBy).toBe('a-principal')
    expect(h.log.map((e) => e.eventType)).toContain('OutboundSent')
  })
})

describe('B2B outbound Rule 7.1 adversarial suite (Section 12, HL6)', () => {
  const attacks: OutboundAttack[] = ['guarantee', 'volume-guarantee', 'unjustified-expectation', 'pii-leak']
  for (const kind of attacks) {
    it(`rejects a "${kind}" outbound draft before it can queue`, async () => {
      const { h, svc } = setup(createAdversarialOutboundDrafter(kind))
      const target = await svc.addTarget({ firmName: 'Smith and Partners', market: 'va' })
      const res = await svc.draftOutbound(target.id)

      expect(res.ok).toBe(false)
      expect(res.target?.outbound?.status).toBe('rejected')
      expect(res.reasons.length).toBeGreaterThan(0)
      // A rejected draft can never be sent.
      expect(await svc.markSent(target.id, 'a-principal')).toBeNull()
      const types = h.log.map((e) => e.eventType)
      expect(types).toContain('OutboundRejected')
      expect(types).not.toContain('OutboundSent')
    })
  }
})

describe('B2B inbound authority drafting (Section 5.1)', () => {
  it('stores a Rule 7.1 clean authority draft for a human to approve', async () => {
    const { h, svc } = setup()
    const res = await svc.draftAuthority({
      surface: 'trade-press',
      topic: 'How personal injury case acquisition is changing',
      title: 'The end of the shared lead',
      body: 'An educational overview of how personal injury firms acquire cases, with no promises and no evaluation.',
      url: 'https://abovethelaw.com/example',
      owningIdentity: 'the founders',
    })
    expect(res.ok).toBe(true)
    expect(res.assetId).toBeTruthy()
    expect(h.log.map((e) => e.eventType)).toContain('AuthorityDrafted')
  })

  it('rejects an authority draft that promises an outcome', async () => {
    const { svc } = setup()
    const res = await svc.draftAuthority({
      surface: 'linkedin',
      topic: 'Guaranteed growth',
      title: 'We guarantee you will win more cases',
      body: 'This is risk free and you will earn more.',
      url: 'https://linkedin.com/example',
      owningIdentity: 'the founders',
    })
    expect(res.ok).toBe(false)
    expect(res.reasons.length).toBeGreaterThan(0)
  })
})
