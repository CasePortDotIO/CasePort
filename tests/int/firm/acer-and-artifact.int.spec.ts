import { describe, it, expect } from 'vitest'
import { computeAcer, isSignedOutcome } from '@/lib/domain/acer'
import { renderHipaaAuthorization } from '@/lib/claimant/hipaaAuthorization'
import { buildOpportunityDetail } from '@/services/GlassBoxService'

/**
 * ACER locked, the executed HIPAA authorization document, and categorized
 * evidence in the closing kit. Three artifacts that make a delivered case feel
 * like a worked-up file the partner could sign on the first call.
 */

describe('ACER, locked (docs/ACER.md)', () => {
  it('is true cost per signed case: fees paid divided by signed cases', () => {
    const a = computeAcer({ feesPaidCents: 900_00, outcomeResults: ['retained', 'declined', 'settled'] })
    expect(a.signedCases).toBe(2) // retained + settled
    expect(a.costPerSignedCaseCents).toBe(45_000) // 90000 / 2
    expect(a.reported).toBe(true)
    expect(a.locked).toBe(false)
  })

  it('only retained and settled count as signed', () => {
    expect(isSignedOutcome('retained')).toBe(true)
    expect(isSignedOutcome('settled')).toBe(true)
    expect(isSignedOutcome('declined')).toBe(false)
    expect(isSignedOutcome('still-evaluating')).toBe(false)
  })

  it('locks the number when fees were paid but no outcome reported: never estimated', () => {
    const a = computeAcer({ feesPaidCents: 180_000, outcomeResults: [] })
    expect(a.locked).toBe(true)
    expect(a.reported).toBe(false)
    expect(a.costPerSignedCaseCents).toBeNull()
  })

  it('reports honestly when outcomes exist but none signed: cost per signed case is null, not zero', () => {
    const a = computeAcer({ feesPaidCents: 90_000, outcomeResults: ['declined', 'still-evaluating'] })
    expect(a.reported).toBe(true)
    expect(a.locked).toBe(false)
    expect(a.signedCases).toBe(0)
    expect(a.costPerSignedCaseCents).toBeNull()
  })

  it('never derives a fee from an outcome (W4): fees paid are an input only', () => {
    // Same fees, different outcomes, the fee total is unchanged by the result.
    const signed = computeAcer({ feesPaidCents: 90_000, outcomeResults: ['retained'] })
    const declined = computeAcer({ feesPaidCents: 90_000, outcomeResults: ['declined'] })
    expect(signed.feesPaidCents).toBe(90_000)
    expect(declined.feesPaidCents).toBe(90_000)
  })
})

describe('executed HIPAA authorization document (W5)', () => {
  const html = renderHipaaAuthorization({
    claimantName: 'Jordan Rivera',
    firmName: 'Peachtree Injury Partners',
    executedDate: '2026-07-06T12:00:00.000Z',
    market: 'atlanta-ga',
    reference: 'CP-ABC123',
  })

  it('names the claimant and the specific firm as the authorized recipient', () => {
    expect(html).toContain('Jordan Rivera')
    expect(html).toContain('Peachtree Injury Partners')
    expect(html).toContain('Authorized recipient firm')
  })

  it('is an authorization, and states plainly it is not a medical record and CasePort stores no records', () => {
    const flat = html.toLowerCase().replace(/\s+/g, ' ')
    expect(flat).toContain('authorization')
    expect(flat).toContain('not itself a medical record')
    expect(flat).toContain('never receives, transmits, or stores medical records')
  })

  it('escapes untrusted names so the document cannot be injected', () => {
    const evil = renderHipaaAuthorization({ claimantName: '<script>x</script>', firmName: 'A & B', executedDate: null })
    expect(evil).not.toContain('<script>x</script>')
    expect(evil).toContain('&lt;script&gt;')
    expect(evil).toContain('A &amp; B')
  })
})

describe('categorized evidence in the closing kit', () => {
  const base = {
    firmId: 'firm_a',
    delivery: { id: 'del_1', firmId: 'firm_a', dossierId: 'abc123def456', deliveredAt: '2026-07-01T00:00:00.000Z', firmRespondedAt: null, slaBreached: false },
    dossier: {
      market: 'atlanta-ga', caseType: 'motor-vehicle-accident', plainLanguageSummary: 'Rear ended at a light.',
      statuteOfLimitationsDate: null,
      evaluation: { scpsScore: 80, scpsVersion: 'v1', qualificationTier: 'A', injurySeverity: 'moderate', liabilityAssessment: 'clear', statuteStatus: 'ok', qualificationBreakdown: [] },
    },
    claimant: { firstName: 'Jordan', lastName: 'Rivera', phone: '404', email: null, location: '30303' },
  }

  it('surfaces the captured photos and documents with their kinds and urls', () => {
    const detail = buildOpportunityDetail({
      ...base,
      evidence: {
        photos: [{ kind: 'wide', url: 'https://blob/wide.jpg' }, { kind: 'insurance-card', url: 'https://blob/card.jpg' }],
        documents: [{ kind: 'police-report', url: 'https://blob/report.pdf' }],
      },
    })!
    expect(detail.evidence.photos).toHaveLength(2)
    expect(detail.evidence.photos[0]).toEqual({ kind: 'wide', url: 'https://blob/wide.jpg' })
    expect(detail.evidence.documents[0].kind).toBe('police-report')
  })

  it('defaults to empty evidence rather than mocking when none was captured', () => {
    const detail = buildOpportunityDetail(base)!
    expect(detail.evidence).toEqual({ photos: [], documents: [] })
  })

  it('still enforces the firm-scoping invariant: another firm gets null', () => {
    const detail = buildOpportunityDetail({ ...base, firmId: 'firm_b' })
    expect(detail).toBeNull()
  })
})
