import { describe, it, expect } from 'vitest'
import { createIntakeService } from '@/services/IntakeService'
import { DossierService } from '@/services/DossierService'
import { ComplianceService } from '@/services/ComplianceService'
import { findEvaluativeLeaks } from '@/lib/compliance/assertNoEvaluativeLeak'
import { createInMemoryHarness } from '@/services/fakes/inMemory'
import type { AttributionTuple } from '@/services/ports'

/**
 * Phase 1 checkpoint. A full intake produces an assembled dossier with the
 * audience split intact and the attribution tuple recorded, and no claimant
 * facing projection can leak an evaluative field (W2, Section 11).
 */

const attribution: AttributionTuple = {
  source: 'google-organic',
  keyword: 'atlanta car accident lawyer',
  referringSurface: 'caseport.io/checkmycase',
  firstTouchAt: '2026-07-05T11:59:00.000Z',
}

async function runFullIntake(harness = createInMemoryHarness()) {
  const svc = createIntakeService(harness)

  const { sessionId } = await svc.beginIntake({
    attribution,
    contact: {
      firstName: 'Jordan',
      lastName: 'Rivera',
      phone: '(404) 555-0100',
      location: { state: 'GA', city: 'Atlanta', zip: '30303' },
    },
  })

  const { transcript } = await svc.recordVoice(sessionId, 'clm/voice/1.wav')
  const playback = await svc.showPlayback(sessionId, transcript)
  await svc.confirmPlayback(sessionId)
  await svc.captureConsent(sessionId, { ipAddress: '203.0.113.7', userAgent: 'test-agent' })
  await svc.signHipaaTemplate(sessionId, 'hipaa-v1')
  const validation = await svc.validateIntake(sessionId)
  const protectionPlan = await svc.generateProtectionPlan(sessionId, {
    summary: playback.summary,
    caseType: 'motor-vehicle-accident',
  })
  const dossier = await svc.assembleDossier(sessionId, {
    caseType: 'motor-vehicle-accident',
    marketSlug: 'atlanta-ga',
    playback,
    protectionPlan,
  })

  return { harness, sessionId, dossier, validation }
}

describe('Phase 1 full intake pipeline', () => {
  it('records the immutable attribution tuple and threads events onto the session', async () => {
    const { harness, sessionId } = await runFullIntake()
    const session = harness.sessions.get(sessionId)!

    expect(session.attribution.source).toBe('google-organic')
    expect(session.attribution.keyword).toBe('atlanta car accident lawyer')
    // The tuple is referenced by the ordered event stream for this session.
    expect(session.eventIds.length).toBeGreaterThan(0)

    const types = harness.log.map((e) => e.eventType)
    expect(types).toContain('AttributionCaptured')
    expect(types).toContain('VoiceTranscribed')
    expect(types).toContain('PlaybackConfirmed')
    expect(types).toContain('TrustedFormCertified')
    expect(types).toContain('HIPAATemplateSigned')
    expect(types).toContain('IntakeValidated')
    expect(types).toContain('ProtectionPlanGenerated')
    // AttributionCaptured is first, before any evidence or evaluation (Section 6).
    expect(types[0]).toBe('AttributionCaptured')
  })

  it('passes basic validation in a live market as a completeness gate only', async () => {
    const { validation } = await runFullIntake()
    expect(validation.passed).toBe(true)
    expect(validation.reasons).toEqual([])
  })

  it('holds validation when the ZIP is not in a live market', async () => {
    const harness = createInMemoryHarness()
    const svc = createIntakeService(harness)
    const { sessionId } = await svc.beginIntake({
      attribution,
      contact: { firstName: 'A', lastName: 'B', location: { state: 'CA', city: 'Fresno', zip: '93701' } },
    })
    const validation = await svc.validateIntake(sessionId)
    expect(validation.passed).toBe(false)
    expect(validation.reasons).toContain('not in a live market')
  })

  it('assembles a dossier with the audience split intact', async () => {
    const { dossier } = await runFullIntake()

    // Claimant safe half is populated.
    expect(dossier.status).toBe('received')
    expect(dossier.plainLanguageSummary.length).toBeGreaterThan(0)
    expect(dossier.protectionPlan.length).toBeGreaterThan(0)
    expect(dossier.market).toBe('atlanta-ga')

    // Firm only evaluation half is physically present but carries no SCPS yet
    // (attached after routing, Phase 3).
    expect(dossier.evaluation).toBeDefined()
    expect(dossier.evaluation.scpsVersion).toBe('v1')
  })

  it('never leaks an evaluative field through the claimant projection', async () => {
    const { dossier } = await runFullIntake()
    const claimantView = DossierService.claimantProjection(dossier)

    expect(findEvaluativeLeaks(claimantView)).toHaveLength(0)
    expect(() => ComplianceService.guardClaimantPayload(claimantView)).not.toThrow()
    expect('evaluation' in claimantView).toBe(false)

    // The firm projection does carry the evaluation half.
    const firmView = DossierService.firmProjection(dossier)
    expect(firmView.evaluation).toBeDefined()
  })

  it('traces the assembled dossier back to its originating attribution tuple', async () => {
    const { harness, dossier } = await runFullIntake()
    // Given the dossier claimant, find the session that produced it, then the tuple.
    const session = [...harness.sessions.values()].find(
      (s) => s.claimantId === dossier.claimantId,
    )
    expect(session).toBeDefined()
    expect(session!.attribution.keyword).toBe('atlanta car accident lawyer')
  })
})
