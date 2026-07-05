import { describe, it, expect } from 'vitest'
import { buildOpportunityDetail } from '@/services/GlassBoxService'

/**
 * The firm facing closing kit builder. Two things must hold: a firm can only ever
 * read its own case (the Glass Box invariant), and the firm facing triage (SCPS
 * and its factors) is surfaced faithfully, with no fabricated case value.
 */

const delivery = {
  id: 'del_1',
  firmId: 'firm_a',
  dossierId: 'abc123def456',
  deliveredAt: '2026-07-01T00:00:00.000Z',
  firmRespondedAt: null,
  slaBreached: false,
}

const dossier = {
  market: 'atlanta-ga',
  caseType: 'motor-vehicle-accident',
  plainLanguageSummary: 'Rear ended at a stop light. Neck pain the next morning.',
  statuteOfLimitationsDate: '2028-01-01T00:00:00.000Z',
  evaluation: {
    scpsScore: 82,
    scpsVersion: 'v1',
    qualificationTier: 'A',
    injurySeverity: 'documented via photo and spoken account',
    liabilityAssessment: 'documented via police report',
    statuteStatus: '548 days of statute headroom',
    qualificationBreakdown: [
      { layer: 'injuryVerification', score: 90, max: 100 },
      { layer: 'liabilityClarity', score: 95, max: 100 },
      { layer: 'statuteStatus', score: 100, max: 100 },
      { layer: 'caseTypeMatch', score: 88, max: 100 },
      { layer: 'firmResponseCapacity', score: 75, max: 100 },
    ],
  },
}

const claimant = { firstName: 'Jordan', lastName: 'Rivera', phone: '+14045550100', email: 'jordan@example.com', location: '30303' }

describe('opportunity detail: firm scoping (the Glass Box invariant)', () => {
  it('returns null when the delivery belongs to another firm', () => {
    const detail = buildOpportunityDetail({ firmId: 'firm_other', delivery, dossier, claimant })
    expect(detail).toBeNull()
  })

  it('returns null when the dossier is missing', () => {
    const detail = buildOpportunityDetail({ firmId: 'firm_a', delivery, dossier: null, claimant })
    expect(detail).toBeNull()
  })

  it('builds the kit for the owning firm with real SCPS triage', () => {
    const detail = buildOpportunityDetail({ firmId: 'firm_a', delivery, dossier, claimant })!
    expect(detail).not.toBeNull()
    expect(detail.reference).toBe('CP-DEF456')
    expect(detail.claimant.name).toBe('Jordan Rivera')
    expect(detail.claimant.phone).toBe('+14045550100')
    expect(detail.evaluation.scpsScore).toBe(82)
    expect(detail.evaluation.qualificationTier).toBe('A')
    expect(detail.hipaaExecutedInFirmName).toBe(true)
  })

  it('maps the SCPS factor keys to human labels for the triage bars', () => {
    const detail = buildOpportunityDetail({ firmId: 'firm_a', delivery, dossier, claimant })!
    expect(detail.evaluation.factors).toEqual([
      { label: 'Injury verification', value: 90 },
      { label: 'Liability clarity', value: 95 },
      { label: 'Statute headroom', value: 100 },
      { label: 'Case type match', value: 88 },
      { label: 'Firm response capacity', value: 75 },
    ])
  })

  it('carries no fabricated case value', () => {
    const detail = buildOpportunityDetail({ firmId: 'firm_a', delivery, dossier, claimant })!
    expect(JSON.stringify(detail)).not.toContain('estValue')
    expect(JSON.stringify(detail)).not.toContain('estimatedValue')
  })

  it('tolerates a missing claimant record', () => {
    const detail = buildOpportunityDetail({ firmId: 'firm_a', delivery, dossier, claimant: null })!
    expect(detail.claimant.name).toBe('Claimant')
    expect(detail.claimant.phone).toBeNull()
  })
})
