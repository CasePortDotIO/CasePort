import { describe, it, expect } from 'vitest'
import {
  handleIntakeSubmit,
  buildAttributionTuple,
  summarizeIntake,
  DEFAULT_PROTECTION_PLAN,
  type IntakeSubmission,
} from '@/services/intakeSubmission'
import { DossierService } from '@/services/DossierService'
import { findEvaluativeLeaks } from '@/lib/compliance/assertNoEvaluativeLeak'
import { createInMemoryHarness } from '@/services/fakes/inMemory'

/**
 * The Answer to Wallet moat (Section 11). A structured intake submission must
 * capture the full attribution tuple and the raw case facts into the immutable
 * event log, so a signed case can later be traced back to the exact keyword,
 * source, and intake behavior that produced it. No scoring, no quality routing.
 */

function sampleSubmission(overrides: Partial<IntakeSubmission> = {}): IntakeSubmission {
  return {
    contact: { firstName: 'Jordan', phone: '(404) 555-0100' },
    location: { state: 'GA', city: 'Atlanta' },
    caseType: 'motor-vehicle-accident',
    incidentDate: '2026-07-01',
    statuteOfLimitationsDate: null,
    consent: { given: true, timestamp: '2026-07-05T12:00:00.000Z', trustedFormCertUrl: 'https://cert.trustedform.com/abc', consentLanguageVersion: 'v1' },
    hipaa: { signatureMode: 'draw', signedAt: '2026-07-05T12:00:00.000Z', templateVersion: 'hipaa-v1' },
    attribution: {
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'atl-mva',
      utmContent: 'atlanta car accident lawyer',
      referrerSource: 'https://www.google.com/',
      landingPath: '/checkmycase?utm_source=google',
      firstTouchAt: '2026-07-05T11:59:00.000Z',
      sessionBehavior: { steps: [{ screen: 's1', at: 1 }], totalSteps: 1 },
    },
    meta: { submissionId: 'CP-20260705-AB12', phoneVerified: true, uploadedFileCount: 2 },
    caseFacts: {
      liabilityStatus: 'The other driver was cited',
      medicalTreatment: 'Emergency room visit',
      providerName: 'Grady Memorial',
      atFaultInsurance: 'Yes, they had insurance',
    },
    ...overrides,
  }
}

describe('buildAttributionTuple', () => {
  it('falls back source through utm to direct and merges marketing into behavior', () => {
    const tuple = buildAttributionTuple({ utmSource: 'bing', utmContent: 'kw' }, '2026-07-05T12:00:00.000Z')
    expect(tuple.source).toBe('bing')
    expect(tuple.keyword).toBe('kw')
    expect(tuple.sessionBehavior?.utmSource).toBe('bing')

    const direct = buildAttributionTuple({}, '2026-07-05T12:00:00.000Z')
    expect(direct.source).toBe('direct')
    expect(direct.firstTouchAt).toBe('2026-07-05T12:00:00.000Z')
  })
})

describe('summarizeIntake', () => {
  it('produces a factual, non evaluative summary', () => {
    const summary = summarizeIntake(sampleSubmission())
    expect(summary).toContain('Motor Vehicle Accident')
    expect(summary).toContain('Atlanta, GA')
    // No evaluative or forbidden language.
    expect(summary.toLowerCase()).not.toMatch(/strong|weak|excellent|best|qualified|score|tier|value/)
  })
})

describe('handleIntakeSubmit (moat write path)', () => {
  it('captures the attribution tuple and the raw case facts into the immutable log', async () => {
    const harness = createInMemoryHarness()
    const result = await handleIntakeSubmit(harness, sampleSubmission())

    expect(result.status).toBe('received')
    expect(result.validationPassed).toBe(true)
    expect(result.submissionId).toBe('CP-20260705-AB12')

    // The tuple is on the session, sourced from the marketing attribution.
    const session = harness.sessions.get(result.sessionId)!
    expect(session.attribution.source).toBe('google')
    expect(session.attribution.keyword).toBe('atlanta car accident lawyer')
    expect(session.attribution.sessionBehavior?.utmCampaign).toBe('atl-mva')

    // Event stream, attribution first.
    const types = harness.log.map((e) => e.eventType)
    expect(types[0]).toBe('AttributionCaptured')
    expect(types).toContain('IntakeSubmitted')
    expect(types).toContain('TrustedFormCertified')
    expect(types).toContain('HIPAATemplateSigned')
    expect(types).toContain('IntakeValidated')
    expect(types).toContain('ProtectionPlanGenerated')

    // The raw case facts live immutably in the IntakeSubmitted event payload.
    const submitted = harness.log.find((e) => e.eventType === 'IntakeSubmitted')!
    expect(submitted.payload?.caseType).toBe('motor-vehicle-accident')
    expect(submitted.payload?.liabilityStatus).toBe('The other driver was cited')
    expect(submitted.payload?.medicalTreatment).toBe('Emergency room visit')
  })

  it('assembles a dossier that leaks no evaluative field to the claimant', async () => {
    const harness = createInMemoryHarness()
    await handleIntakeSubmit(harness, sampleSubmission())
    const dossier = harness.createdDossiers[0]
    expect(dossier).toBeDefined()
    const claimantView = DossierService.claimantProjection(dossier)
    expect(findEvaluativeLeaks(claimantView)).toHaveLength(0)
  })

  it('traces a dossier back to its originating keyword (Answer to Wallet)', async () => {
    const harness = createInMemoryHarness()
    const result = await handleIntakeSubmit(harness, sampleSubmission())
    const dossier = harness.createdDossiers.find((d) => d.id === result.dossierId)!
    const session = [...harness.sessions.values()].find((s) => s.claimantId === dossier.claimantId)!
    expect(session.attribution.keyword).toBe('atlanta car accident lawyer')
    expect(session.attribution.source).toBe('google')
  })

  it('falls back to the default protection plan when the narrative service fails', async () => {
    const harness = createInMemoryHarness()
    harness.narrative = {
      reflectivePlayback: async () => ({ summary: '', points: [] }),
      evidenceCoaching: async () => '',
      protectionPlan: async () => {
        throw new Error('narrative outage')
      },
    }
    await handleIntakeSubmit(harness, sampleSubmission())
    const dossier = harness.createdDossiers[0]
    expect(dossier.protectionPlan).toEqual(DEFAULT_PROTECTION_PLAN)
  })

  it('holds validation when the location is not a live market', async () => {
    const harness = createInMemoryHarness()
    const result = await handleIntakeSubmit(
      harness,
      sampleSubmission({ location: { state: 'CA', city: 'Fresno' } }),
    )
    expect(result.validationPassed).toBe(false)
    expect(result.validationReasons).toContain('not in a live market')
  })
})
