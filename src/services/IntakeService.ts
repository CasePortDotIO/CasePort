import type { Dossier } from '@/lib/compliance/dossierProjections'
import type { EventType } from '@/lib/domain/constants'
import type {
  AttributionTuple,
  ClaimantContact,
  IntakeDeps,
  PlaybackResult,
} from './ports'
import { DossierService } from './DossierService'

/**
 * IntakeService. Section 4, Section 6. Owns the claimant journey and the
 * production of the claimant safe side of the dossier plus the raw material for
 * the firm only side. Every step emits an immutable event to the global log,
 * so current state is always a projection of events (Section 4). Nothing in
 * this journey ever exposes an evaluative signal to the claimant (W2).
 *
 * Constructed with a dependency set (ports) so the full pipeline runs against
 * real adapters in production and in memory fakes in tests.
 */
export function createIntakeService(deps: IntakeDeps) {
  /* Append an event and thread its id onto the session in one step. */
  async function emit(
    sessionId: string | null,
    eventType: EventType,
    aggregateType: string,
    aggregateId: string,
    payload?: Record<string, unknown>,
  ): Promise<void> {
    const event = await deps.events.append({
      eventType,
      aggregateType,
      aggregateId,
      intakeSessionId: sessionId ?? undefined,
      actor: 'claimant',
      occurredAt: deps.clock.nowIso(),
      payload,
    })
    if (sessionId) {
      const session = await deps.intake.getSession(sessionId)
      if (session) {
        await deps.intake.updateSession(sessionId, {
          eventIds: [...session.eventIds, event.id],
        })
      }
    }
  }

  /**
   * Attribution captured. The tuple is written immutably before anything else
   * (Section 6 step 1, Section 11). Resolves the market geographically from the
   * claimant ZIP (W1: geography only).
   */
  async function beginIntake(input: {
    attribution: AttributionTuple
    contact: ClaimantContact
  }): Promise<{ sessionId: string; claimantId: string; marketId: string | null }> {
    const claimant = await deps.claimants.create(input.contact)
    const market = await deps.markets.resolveByZip(input.contact.marketZip)
    const session = await deps.intake.createSession({
      claimantId: claimant.id,
      marketId: market?.id ?? null,
      attribution: input.attribution,
    })
    await emit(session.id, 'AttributionCaptured', 'intakeSession', session.id, {
      source: input.attribution.source,
      keyword: input.attribution.keyword,
      market: market?.slug ?? null,
    })
    return { sessionId: session.id, claimantId: claimant.id, marketId: market?.id ?? null }
  }

  /** Voice captured and transcribed by Deepgram (Section 6 step 2). */
  async function recordVoice(sessionId: string, mediaKey: string): Promise<{ transcript: string }> {
    await emit(sessionId, 'VoiceCaptured', 'intakeSession', sessionId, { mediaKey })
    const { transcript } = await deps.transcription.transcribe({ mediaKey })
    await emit(sessionId, 'VoiceTranscribed', 'intakeSession', sessionId, {
      length: transcript.length,
    })
    return { transcript }
  }

  /**
   * The I heard you moment (Section 6 step 4). One Claude call returns a warm,
   * plain English structured summary. It reflects the claimant words back as
   * organization, never as legal evaluation. A court reporter, not a judge.
   */
  async function showPlayback(sessionId: string, transcript: string): Promise<PlaybackResult> {
    const playback = await deps.narrative.reflectivePlayback({ transcript })
    await emit(sessionId, 'PlaybackShown', 'intakeSession', sessionId)
    return playback
  }

  async function confirmPlayback(sessionId: string): Promise<void> {
    await emit(sessionId, 'PlaybackConfirmed', 'intakeSession', sessionId)
  }

  /** Consent and TrustedForm (Section 6 step 5, W7). */
  async function captureConsent(
    sessionId: string,
    meta: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
    const submissionId = deps.ids.submissionId()
    const cert = await deps.consent.certify({ submissionId, ...meta })
    await emit(sessionId, 'ConsentCaptured', 'intakeSession', sessionId, {
      submissionId,
      consentLanguageVersion: cert.consentLanguageVersion,
    })
    await emit(sessionId, 'TrustedFormCertified', 'intakeSession', sessionId, {
      trustedFormUrl: cert.trustedFormUrl,
    })
  }

  /** HIPAA template pre signed, firm name blank until routing (Section 6, W5). */
  async function signHipaaTemplate(sessionId: string, templateVersion: string): Promise<void> {
    await emit(sessionId, 'HIPAATemplateSigned', 'intakeSession', sessionId, { templateVersion })
  }

  /**
   * Basic intake validation (Section 6 step 6). A completeness gate and a live
   * market check only. It has nothing to do with SCPS (W1). Writes the boolean
   * onto the session for the routing engine to read later.
   */
  async function validateIntake(
    sessionId: string,
  ): Promise<{ passed: boolean; reasons: string[] }> {
    const session = await deps.intake.getSession(sessionId)
    const reasons: string[] = []
    if (!session) return { passed: false, reasons: ['session not found'] }
    if (!session.marketId) reasons.push('not in a live market')
    if (session.eventIds.length === 0) reasons.push('no intake events')
    const passed = reasons.length === 0
    await deps.intake.updateSession(sessionId, { validationPassed: passed })
    await emit(sessionId, 'IntakeValidated', 'intakeSession', sessionId, { passed, reasons })
    return { passed, reasons }
  }

  /** Protection plan (Section 6 step 7). They walk out armed. */
  async function generateProtectionPlan(
    sessionId: string,
    input: { summary: string; caseType: string },
  ): Promise<string[]> {
    const plan = await deps.narrative.protectionPlan(input)
    await emit(sessionId, 'ProtectionPlanGenerated', 'intakeSession', sessionId, {
      steps: plan.length,
    })
    return plan
  }

  /**
   * Assemble the dossier from the session material and persist it. The audience
   * split is produced by DossierService.assemble and enforced downstream by the
   * projection layer and Payload field access (W2). SCPS and the qualification
   * factors are firm only and are computed and attached after routing (Section
   * 8, Phase 3), so the intake time evaluation half carries no SCPS yet.
   */
  async function assembleDossier(
    sessionId: string,
    input: {
      caseType: string
      marketSlug: string
      playback: PlaybackResult
      protectionPlan: string[]
      statuteOfLimitationsDate?: string | null
    },
  ): Promise<Dossier> {
    const session = await deps.intake.getSession(sessionId)
    if (!session) throw new Error(`intake session ${sessionId} not found`)
    const dossier = DossierService.assemble({
      id: deps.ids.dossierId(),
      claimantId: session.claimantId,
      market: input.marketSlug,
      caseType: input.caseType,
      plainLanguageSummary: input.playback.summary,
      protectionPlan: input.protectionPlan,
      statuteOfLimitationsDate: input.statuteOfLimitationsDate ?? null,
      receivedAt: deps.clock.nowIso(),
    })
    return deps.dossiers.create(dossier)
  }

  return {
    beginIntake,
    recordVoice,
    showPlayback,
    confirmPlayback,
    captureConsent,
    signHipaaTemplate,
    validateIntake,
    generateProtectionPlan,
    assembleDossier,
  }
}

export type IntakeService = ReturnType<typeof createIntakeService>
