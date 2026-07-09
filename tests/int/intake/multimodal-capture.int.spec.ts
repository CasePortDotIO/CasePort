import { describe, it, expect } from 'vitest'
import { createIntakeService } from '@/services/IntakeService'
import { DossierService } from '@/services/DossierService'
import { findEvaluativeLeaks } from '@/lib/compliance/assertNoEvaluativeLeak'
import { findClaimantLanguageViolations } from '@/lib/compliance/claimantLanguage'
import { createInMemoryHarness } from '@/services/fakes/inMemory'
import type { AttributionTuple } from '@/services/ports'

/**
 * The B2C multimodal capture flow, end to end through the domain service
 * (Section 6 step 2 and step 4). The claimant photographs their insurance card,
 * photographs the scene, records their statement, and confirms the reflective
 * playback. Every capture must land on the immutable event log so the dossier can
 * be assembled from the log alone (Section 4), and nothing produced along the way
 * may carry an evaluative signal to the claimant (W2, W6).
 */

const attribution: AttributionTuple = {
  source: 'google-organic',
  keyword: 'atlanta truck accident lawyer',
  referringSurface: 'caseport.io/checkmycase',
  firstTouchAt: '2026-07-06T09:00:00.000Z',
}

async function runMultimodalIntake(harness = createInMemoryHarness()) {
  const svc = createIntakeService(harness)

  const { sessionId } = await svc.beginIntake({
    attribution,
    contact: {
      firstName: 'Sam',
      lastName: 'Ellis',
      phone: '(404) 555-0142',
      location: { state: 'GA', city: 'Atlanta', zip: '30303' },
    },
  })

  // Multimodal intake: the card is read for the claimant, the scene photographed,
  // the statement recorded and reflected back.
  const card = await svc.parseInsuranceCard(sessionId, 'clm/card/1.jpg')
  await svc.recordPhoto(sessionId, 'clm/scene/1.jpg', 'wide')
  await svc.recordPhoto(sessionId, 'clm/damage/1.jpg', 'damage')
  await svc.recordDocument(sessionId, 'clm/police/1.pdf', 'police-report')
  const { transcript } = await svc.recordVoice(sessionId, 'clm/voice/1.wav')
  const playback = await svc.showPlayback(sessionId, transcript)
  await svc.confirmPlayback(sessionId)

  await svc.captureConsent(sessionId, { ipAddress: '203.0.113.9', userAgent: 'test-agent' })
  await svc.signHipaaTemplate(sessionId, 'hipaa-v1')
  const validation = await svc.validateIntake(sessionId)
  const protectionPlan = await svc.generateProtectionPlan(sessionId, {
    summary: playback.summary,
    caseType: 'commercial-trucking-accident',
  })
  const dossier = await svc.assembleDossier(sessionId, {
    caseType: 'commercial-trucking-accident',
    marketSlug: 'atlanta-ga',
    playback,
    protectionPlan,
  })

  return { harness, sessionId, card, playback, dossier, validation }
}

describe('B2C multimodal capture, end to end', () => {
  it('emits an event for every capture, so the dossier is rebuildable from the log', async () => {
    const { harness } = await runMultimodalIntake()
    const types = harness.log.map((e) => e.eventType)

    // Insurance card: stored as a photo, then parsed into fields.
    expect(types).toContain('PhotoUploaded')
    expect(types).toContain('VisionParsed')
    // Scene documentation and the police report.
    expect(types).toContain('DocumentParsed')
    // Voice statement and its transcription.
    expect(types).toContain('VoiceCaptured')
    expect(types).toContain('VoiceTranscribed')
    // The I heard you moment and its confirmation.
    expect(types).toContain('PlaybackShown')
    expect(types).toContain('PlaybackConfirmed')
    // Attribution is still first, before any capture (Section 6).
    expect(types[0]).toBe('AttributionCaptured')
  })

  it('reads the insurance card into structured fields for the claimant to confirm', async () => {
    const { card } = await runMultimodalIntake()
    expect(card.fields.carrier).toBe('Example Mutual')
    // The parsed card carries no evaluative signal.
    expect(findEvaluativeLeaks(card.fields)).toHaveLength(0)
  })

  it('records the insurance card as a PhotoUploaded with kind insurance-card before parsing', async () => {
    const { harness } = await runMultimodalIntake()
    const photoKinds = harness.log
      .filter((e) => e.eventType === 'PhotoUploaded')
      .map((e) => (e.payload as { kind?: string } | undefined)?.kind)
    expect(photoKinds).toContain('insurance-card')
    expect(photoKinds).toContain('wide')
    expect(photoKinds).toContain('damage')

    // The card photo event precedes its VisionParsed event on the ordered log.
    const cardPhotoIdx = harness.log.findIndex(
      (e) => e.eventType === 'PhotoUploaded' && (e.payload as { kind?: string })?.kind === 'insurance-card',
    )
    const visionIdx = harness.log.findIndex((e) => e.eventType === 'VisionParsed')
    expect(cardPhotoIdx).toBeGreaterThanOrEqual(0)
    expect(visionIdx).toBeGreaterThan(cardPhotoIdx)
  })

  it('never stores raw media in the event payload, only the key', async () => {
    const { harness } = await runMultimodalIntake()
    for (const e of harness.log) {
      const payload = (e.payload ?? {}) as Record<string, unknown>
      // Media events carry a key, never bytes or a base64 blob.
      if ('mediaKey' in payload) {
        expect(typeof payload.mediaKey).toBe('string')
        expect(String(payload.mediaKey).length).toBeLessThan(256)
      }
      expect('bytes' in payload).toBe(false)
      expect('data' in payload).toBe(false)
    }
  })

  it('produces a reflective playback that reads as organization, never legal evaluation', async () => {
    const { playback } = await runMultimodalIntake()
    expect(playback.summary.length).toBeGreaterThan(0)
    // The playback is claimant facing prose: it must be compliant (W2, W6).
    expect(findClaimantLanguageViolations(playback.summary)).toHaveLength(0)
    for (const point of playback.points) {
      expect(findClaimantLanguageViolations(point)).toHaveLength(0)
    }
  })

  it('assembles a dossier with the audience split intact and no claimant leak', async () => {
    const { dossier } = await runMultimodalIntake()
    const claimantView = DossierService.claimantProjection(dossier)
    expect(findEvaluativeLeaks(claimantView)).toHaveLength(0)
    expect('evaluation' in claimantView).toBe(false)
    // The firm half is physically present.
    expect(DossierService.firmProjection(dossier).evaluation).toBeDefined()
  })

  it('degrades cleanly when Vision cannot read the card: empty fields, never a throw', async () => {
    const harness = createInMemoryHarness()
    // Simulate a Vision outage on this one capture.
    harness.vision.parseInsuranceCard = async () => {
      throw new Error('vision down')
    }
    const svc = createIntakeService(harness)
    const { sessionId } = await svc.beginIntake({
      attribution,
      contact: { firstName: 'A', lastName: 'B', location: { state: 'GA', city: 'Atlanta', zip: '30303' } },
    })
    const card = await svc.parseInsuranceCard(sessionId, 'clm/card/bad.jpg')
    expect(card.fields).toEqual({})
    // The capture is still logged: the photo landed, parsing yielded nothing.
    const types = harness.log.map((e) => e.eventType)
    expect(types).toContain('PhotoUploaded')
    expect(types).toContain('VisionParsed')
  })

  it('validation stays a completeness gate, unaffected by what was captured (W1)', async () => {
    const { validation } = await runMultimodalIntake()
    expect(validation.passed).toBe(true)
    expect(validation.reasons).toEqual([])
  })
})
