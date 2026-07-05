import { describe, it, expect } from 'vitest'
import {
  toClaimantDossier,
  type Dossier,
} from '@/lib/compliance/dossierProjections'
import {
  assertNoEvaluativeLeak,
  findEvaluativeLeaks,
  EvaluativeLeakError,
} from '@/lib/compliance/assertNoEvaluativeLeak'
import { ComplianceService } from '@/services/ComplianceService'

/**
 * Phase 0 checkpoint. Compliance rule W2.
 *
 * The evaluative field leak test must fail a deliberately wrong claimant
 * endpoint and pass a correct one. This file proves both directions.
 */

const dossierFixture: Dossier = {
  id: 'CP-2026-000089',
  claimantId: 'claimant_abc',
  intakeSessionId: 'sess_abc',
  market: 'atlanta-ga',
  caseType: 'motor-vehicle-accident',
  status: 'received, pending firm contact',
  plainLanguageSummary:
    'You were rear ended at an intersection. We organized what you told us.',
  protectionPlan: [
    'Keep every medical appointment.',
    'Do not post about the accident.',
    'Photograph any bruising again in two days.',
  ],
  statuteOfLimitationsDate: '2028-03-01',
  receivedAt: '2026-07-05T12:00:00.000Z',
  evaluation: {
    scpsScore: 82,
    scpsVersion: 'v1',
    qualificationTier: 'B',
    qualificationScore: 82,
    qualificationBreakdown: [
      { layer: 'Signal Integrity', score: 18, max: 20 },
      { layer: 'Geographic Fit', score: 20, max: 20 },
    ],
    estimatedValue: 65000,
    injurySeverity: 'moderate soft tissue',
    liabilityAssessment: 'clear liability, rear end',
    statuteStatus: 'well within statute',
    signedCaseProbability: 0.41,
  },
}

/**
 * A deliberately wrong claimant projection. It spreads the full dossier and so
 * carries the entire firm only evaluation onto a claimant surface. This exists
 * only in the test to prove the harness catches a violating endpoint. App code
 * must never do this.
 */
function toClaimantDossier_WRONG(dossier: Dossier): unknown {
  return {
    id: dossier.id,
    status: dossier.status,
    // The violation: spreading the evaluation half leaks scpsScore,
    // estimatedValue, injurySeverity, and every other firm only field.
    ...dossier.evaluation,
  }
}

describe('W2 evaluative field leak wall', () => {
  it('passes the correct claimant projection', () => {
    const claimantView = toClaimantDossier(dossierFixture)

    // The correct projection carries no evaluative field.
    expect(findEvaluativeLeaks(claimantView)).toHaveLength(0)
    expect(() => assertNoEvaluativeLeak(claimantView)).not.toThrow()
    expect(() => ComplianceService.guardClaimantPayload(claimantView)).not.toThrow()

    // And it still carries the claimant safe fields the surface needs.
    expect(claimantView.status).toBe('received, pending firm contact')
    expect(claimantView.protectionPlan.length).toBeGreaterThan(0)
    // The evaluation half is structurally absent.
    expect('evaluation' in claimantView).toBe(false)
    expect('scpsScore' in claimantView).toBe(false)
  })

  it('fails a deliberately wrong claimant projection that leaks SCPS', () => {
    const leaking = toClaimantDossier_WRONG(dossierFixture)

    const leaks = findEvaluativeLeaks(leaking)
    expect(leaks.length).toBeGreaterThan(0)

    const leakedFields = leaks.map((l) => l.field)
    expect(leakedFields).toContain('scpsScore')
    expect(leakedFields).toContain('estimatedValue')
    expect(leakedFields).toContain('injurySeverity')

    expect(() => assertNoEvaluativeLeak(leaking)).toThrow(EvaluativeLeakError)
    expect(() => ComplianceService.guardClaimantPayload(leaking)).toThrow(
      /Evaluative field leak on claimant surface/,
    )
  })

  it('detects evaluative fields nested at any depth', () => {
    const nested = {
      case: { detail: { meta: [{ conversionProbability: 0.9 }] } },
    }
    const leaks = findEvaluativeLeaks(nested)
    expect(leaks).toHaveLength(1)
    expect(leaks[0].field).toBe('conversionProbability')
    expect(leaks[0].path).toBe('$.case.detail.meta[0].conversionProbability')
  })

  it('normalizes key variants so snake case and spacing cannot slip through', () => {
    expect(findEvaluativeLeaks({ scps_score: 80 })).toHaveLength(1)
    expect(findEvaluativeLeaks({ 'SCPS Score': 80 })).toHaveLength(1)
    expect(findEvaluativeLeaks({ estimated_value: 1 })).toHaveLength(1)
  })
})
