import type { Dossier } from '@/lib/compliance/dossierProjections'
import { findClaimantLanguageViolations } from '@/lib/compliance/claimantLanguage'
import { nextEssentialCapture } from '@/lib/domain/captureChecklist'
import type { EventType } from '@/lib/domain/constants'
import type {
  AttributionTuple,
  CaptureDirection,
  CaptureInventory,
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
  }): Promise<{
    sessionId: string
    claimantId: string
    marketId: string | null
    marketSlug: string | null
  }> {
    const claimant = await deps.claimants.create(input.contact)
    const market = await deps.markets.resolveByLocation(input.contact.location)
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
    return {
      sessionId: session.id,
      claimantId: claimant.id,
      marketId: market?.id ?? null,
      marketSlug: market?.slug ?? null,
    }
  }

  /**
   * The single guarded action of the Evidence and Intake Coaching Agent
   * (AGENTS.md Section 4.1). Given everything captured so far, ask the narrative
   * client for the next photographic or factual direction, then hold it to the
   * Wall before it can reach the claimant.
   *
   * This is the compliance boundary, tested not trusted (W2, W6). Every
   * generated direction is scanned for legal evaluation and non recommendation
   * language. If the model drifts even once, the violating text is never
   * surfaced: it is replaced with the next deterministic, compliant checklist
   * direction, and the substitution is recorded on the event so the drift is
   * auditable. The claimant only ever sees procedural direction.
   *
   * The action space of the agent is exactly this method (and the other
   * IntakeService methods). It has no raw model, database, or network access.
   */
  async function coachNextCapture(
    sessionId: string,
    inventory: CaptureInventory,
  ): Promise<CaptureDirection & { substituted: boolean }> {
    let proposed: CaptureDirection
    try {
      proposed = await deps.narrative.nextCaptureDirection({ inventory })
    } catch {
      // Narrative outage: fall straight to the compliant checklist floor.
      proposed = nextEssentialCapture(inventory)
    }

    const violations = findClaimantLanguageViolations(proposed.direction)
    let direction = proposed
    let substituted = false
    if (violations.length > 0 || !proposed.direction.trim()) {
      // Never surface a violating or empty direction. Substitute the safe floor.
      direction = nextEssentialCapture(inventory)
      substituted = true
    }

    await emit(sessionId, 'EvidenceCoachingShown', 'intakeSession', sessionId, {
      direction: direction.direction,
      focus: direction.focus ?? null,
      done: direction.done,
      substituted,
      // What the drift was, so a substitution is auditable without storing the
      // violating text itself.
      violationKinds: violations.map((v) => v.kind),
    })

    return { ...direction, substituted }
  }

  /**
   * A photo captured and stored (Section 6 step 2). The claimant photographs the
   * scene, the vehicles, the plates, the damage, the injury. Each shot appends an
   * immutable PhotoUploaded event carrying only the media key and its kind, so the
   * dossier can later be assembled from the log alone (Section 4). The photo bytes
   * live in signed, expiring storage; the event holds the key, never the image.
   * No evaluation happens here (W2): a photo is documentation, not a score.
   */
  async function recordPhoto(
    sessionId: string,
    mediaKey: string,
    kind: string,
  ): Promise<void> {
    await emit(sessionId, 'PhotoUploaded', 'intakeSession', sessionId, { mediaKey, kind })
  }

  /**
   * The insurance card photographed and parsed by Claude Vision so the claimant
   * writes nothing down (Section 6 step 2). The card is a photo like any other
   * (PhotoUploaded, kind insurance-card) and is then read into structured fields
   * (VisionParsed). The parsed fields are firm facing case material and are never
   * surfaced to the claimant as any kind of evaluation (W2). Resilient: if Vision
   * is unavailable it returns an empty field set and the claimant can still type
   * the details, the intake is never blocked on a paid AI call.
   */
  async function parseInsuranceCard(
    sessionId: string,
    mediaKey: string,
  ): Promise<{ fields: Record<string, string> }> {
    await emit(sessionId, 'PhotoUploaded', 'intakeSession', sessionId, {
      mediaKey,
      kind: 'insurance-card',
    })
    let fields: Record<string, string> = {}
    try {
      fields = await deps.vision.parseInsuranceCard({ mediaKey })
    } catch {
      fields = {}
    }
    await emit(sessionId, 'VisionParsed', 'intakeSession', sessionId, {
      mediaKey,
      kind: 'insurance-card',
      fieldCount: Object.keys(fields).length,
    })
    return { fields }
  }

  /**
   * A document captured and stored, for example the police report (Section 6
   * step 2). Appends an immutable DocumentParsed event carrying the media key and
   * kind. Like every intake step it is documentation of fact, carrying no
   * evaluative signal (W2). The bytes live in signed storage; the event holds the
   * key.
   */
  async function recordDocument(
    sessionId: string,
    mediaKey: string,
    kind: string,
  ): Promise<void> {
    await emit(sessionId, 'DocumentParsed', 'intakeSession', sessionId, { mediaKey, kind })
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
    meta: { ipAddress?: string; userAgent?: string; trustedFormCertUrl?: string | null },
  ): Promise<void> {
    const submissionId = deps.ids.submissionId()
    const cert = await deps.consent.certify({
      submissionId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      providedCertUrl: meta.trustedFormCertUrl,
    })
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
   * Record the raw structured intake as an immutable IntakeSubmitted event. This
   * is the moat: the append only log holds the complete first party case facts,
   * tied to the attribution tuple through the session. If the intelligence layer
   * were deleted, SCPS and every downstream metric could be rebuilt from here
   * (Section 4). These raw facts are firm facing material, never scored or shown
   * to the claimant on the way in (W1, W2).
   */
  async function recordStructuredIntake(
    sessionId: string,
    caseFacts: Record<string, unknown>,
  ): Promise<void> {
    await emit(sessionId, 'IntakeSubmitted', 'intakeSession', sessionId, caseFacts)
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

  /** Protection plan (Section 6 step 7). They walk out armed. Resilient: if the
   * narrative call fails or returns nothing, the fallback plan is used so the
   * claimant is never left without protective guidance. */
  async function generateProtectionPlan(
    sessionId: string,
    input: { summary: string; caseType: string },
    fallback: string[] = [],
  ): Promise<string[]> {
    let plan: string[]
    try {
      plan = await deps.narrative.protectionPlan(input)
      if (!plan || plan.length === 0) plan = fallback
    } catch {
      plan = fallback
    }
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
      intakeSessionId: session.id,
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
    coachNextCapture,
    recordPhoto,
    parseInsuranceCard,
    recordDocument,
    recordVoice,
    showPlayback,
    confirmPlayback,
    captureConsent,
    signHipaaTemplate,
    recordStructuredIntake,
    validateIntake,
    generateProtectionPlan,
    assembleDossier,
  }
}

export type IntakeService = ReturnType<typeof createIntakeService>
