import { describe, it, expect } from 'vitest'
import { buildClaimantTimeline } from '@/lib/claimant/statusTimeline'
import { buildConfirmationMessages } from '@/lib/claimant/confirmation'
import { signStatus, verifyStatus, statusPath } from '@/lib/statusLink'
import { findEvaluativeLeaks } from '@/lib/compliance/assertNoEvaluativeLeak'
import { findClaimantLanguageViolations } from '@/lib/compliance/claimantLanguage'

/**
 * The living status page and the claimant confirmation touch (Section 6 step 8,
 * the anti black hole promise). Everything a claimant sees or is sent here is
 * geographic and procedural only. These pin that: the timeline and the messages
 * carry no evaluative signal and no non compliant language, the link cannot be
 * forged, and the motion advances only on real procedural status.
 */

describe('claimant status timeline', () => {
  it('shows a received case as in motion, with review active and contact pending', () => {
    const view = buildClaimantTimeline({ status: 'received', receivedAt: '2026-07-06T12:00:00.000Z', caseType: 'motor-vehicle-accident' })
    const byKey = Object.fromEntries(view.steps.map((s) => [s.key, s]))
    expect(byKey.received.state).toBe('done')
    expect(byKey.organized.state).toBe('done')
    expect(byKey.reviewing.state).toBe('active')
    expect(byKey.contact.state).toBe('pending')
  })

  it('advances review to done and contact to active once delivered to a firm', () => {
    const view = buildClaimantTimeline({ status: 'delivered', receivedAt: '2026-07-06T12:00:00.000Z', caseType: 'motor-vehicle-accident' })
    const byKey = Object.fromEntries(view.steps.map((s) => [s.key, s]))
    expect(byKey.reviewing.state).toBe('done')
    expect(byKey.contact.state).toBe('active')
  })

  it('spells personal injury out in full and never abbreviates the case type', () => {
    const view = buildClaimantTimeline({ status: 'received', caseType: 'not-a-real-slug' })
    const text = JSON.stringify(view)
    expect(text).toContain('personal injury')
    expect(text).not.toMatch(/\bPI\b/)
  })

  it('never leaks an evaluative field or non compliant language', () => {
    for (const status of ['received', 'delivered']) {
      const view = buildClaimantTimeline({ status, receivedAt: '2026-07-06T12:00:00.000Z', caseType: 'commercial-trucking-accident' })
      expect(findEvaluativeLeaks(view)).toHaveLength(0)
      const prose = [view.headline, view.subhead, ...view.steps.flatMap((s) => [s.label, s.detail])]
      for (const line of prose) {
        expect(findClaimantLanguageViolations(line)).toHaveLength(0)
      }
    }
  })
})

describe('claimant confirmation messages', () => {
  const messages = buildConfirmationMessages({
    firstName: 'Jordan',
    reference: 'CP-ABC123',
    statusUrl: 'https://caseport.io/checkmycase/status/abc123?sig=deadbeef',
  })

  it('carries the reference and the status link, and spells personal injury out', () => {
    expect(messages.sms).toContain('CP-ABC123')
    expect(messages.sms).toContain('https://caseport.io/checkmycase/status/abc123?sig=deadbeef')
    expect(messages.sms).toContain('personal injury')
    expect(messages.emailBody).toContain('CP-ABC123')
    expect(messages.emailBody).toContain('personal injury')
  })

  it('makes no evaluative claim: no value, strength, or forbidden language', () => {
    for (const text of [messages.sms, messages.emailSubject, messages.emailBody]) {
      expect(findClaimantLanguageViolations(text)).toHaveLength(0)
      expect(findEvaluativeLeaks({ text })).toHaveLength(0)
    }
  })
})

describe('signed status link', () => {
  it('verifies a correct signature and rejects a forged or missing one', () => {
    const id = '507f1f77bcf86cd799439011'
    const sig = signStatus(id)
    expect(verifyStatus(id, sig)).toBe(true)
    expect(verifyStatus(id, 'x'.repeat(sig.length))).toBe(false)
    expect(verifyStatus(id, null)).toBe(false)
    expect(verifyStatus(id, '')).toBe(false)
    // A different id's signature does not validate this id (no enumeration).
    expect(verifyStatus(id, signStatus('different-id'))).toBe(false)
  })

  it('builds a same origin status path carrying the signature', () => {
    const id = 'abc123def456'
    const path = statusPath(id)
    expect(path.startsWith(`/checkmycase/status/${id}?sig=`)).toBe(true)
    const sig = new URLSearchParams(path.split('?')[1]).get('sig')
    expect(verifyStatus(id, sig)).toBe(true)
  })
})
