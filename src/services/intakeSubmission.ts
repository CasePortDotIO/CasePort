import type { AttributionTuple, GeographicLocation, IntakeDeps } from './ports'
import { createIntakeService } from './IntakeService'

/**
 * The intake submission handler. This is the single write path from the
 * claimant intake surface into the system of record, and it is where the data
 * moat is poured on day one.
 *
 * The Answer to Wallet Engine (Section 4, Section 11) depends on capturing the
 * full attribution tuple at first touch and carrying it immutably. Here the
 * tuple and the complete raw case facts are written into the append only event
 * log and the intake session, so a signed case reported months later traces
 * back to the exact keyword, source, and intake behavior that produced it. A
 * competitor cannot reconstruct that trace after the fact. If we do not capture
 * it at creation, the moat is not real.
 *
 * Nothing here scores the case or routes on quality. Routing is geographic only
 * (W1); SCPS is computed server side, firm facing, after routing (W2).
 */

/** Attribution inputs collected on the claimant surface at first touch. */
export interface IntakeAttributionInput {
  source?: string | null
  keyword?: string | null
  referringSurface?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmContent?: string | null
  referrerSource?: string | null
  landingPath?: string | null
  firstTouchAt?: string | null
  /** Behavioral signals: per step timings, corrections, device. First party moat data. */
  sessionBehavior?: Record<string, unknown>
}

/** The submission payload posted by the claimant intake surface. */
export interface IntakeSubmission {
  contact: { firstName: string; lastName?: string; phone?: string; email?: string }
  location: GeographicLocation
  caseType: string
  incidentDate?: string | null
  statuteOfLimitationsDate?: string | null
  consent: {
    given: boolean
    timestamp?: string | null
    trustedFormCertUrl?: string | null
    consentLanguageVersion?: string | null
  }
  hipaa: { signatureMode?: string | null; signedAt?: string | null; templateVersion?: string | null }
  attribution: IntakeAttributionInput
  meta?: { submissionId?: string | null; phoneVerified?: boolean; uploadedFileCount?: number }
  /** The full raw firm facing case facts (liability, treatment, insurance, injury). Moat data. */
  caseFacts: Record<string, unknown>
}

export interface IntakeSubmissionResult {
  sessionId: string
  dossierId: string
  submissionId: string
  market: string | null
  status: 'received'
  validationPassed: boolean
  validationReasons: string[]
}

/**
 * The claimant safe default protection plan. Used when the narrative service is
 * unavailable, so the claimant always walks out with concrete guidance. Facts
 * and protective steps only, never a case assessment (W2).
 */
export const DEFAULT_PROTECTION_PLAN: string[] = [
  'Keep every medical appointment. Gaps in care are the most common reason an injury is undervalued later.',
  'Do not post about the accident. Not the crash, not your injuries, not how you feel.',
  'Photograph any bruising again in two days. Injuries often develop and look worse over time.',
  'If an insurance adjuster calls, you can say: I am not ready to give a statement, please contact my attorney.',
]

/**
 * Build the immutable attribution tuple from the first touch inputs. Marketing
 * attribution and behavioral signals are folded into sessionBehavior so the
 * whole tuple travels together and can be traced end to end. source falls back
 * through utm to direct so it is never empty.
 */
export function buildAttributionTuple(
  input: IntakeAttributionInput,
  nowIso: string,
): AttributionTuple {
  const source = input.source || input.utmSource || 'direct'
  const keyword = input.keyword || input.utmContent || input.utmCampaign || undefined
  const referringSurface = input.referringSurface || input.referrerSource || input.landingPath || undefined
  return {
    source,
    keyword: keyword ?? undefined,
    referringSurface: referringSurface ?? undefined,
    firstTouchAt: input.firstTouchAt || nowIso,
    sessionBehavior: {
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
      utmContent: input.utmContent ?? null,
      referrerSource: input.referrerSource ?? null,
      landingPath: input.landingPath ?? null,
      ...(input.sessionBehavior ?? {}),
    },
  }
}

/**
 * A compliant, factual plain language summary built from the structured intake.
 * Organization of the facts the claimant provided, never a legal evaluation and
 * never a case assessment (Section 6 step 4, W2). No strong or weak, no value.
 */
export function summarizeIntake(submission: IntakeSubmission): string {
  const parts: string[] = []
  const place = [submission.location.city, submission.location.state].filter(Boolean).join(', ')
  const when = submission.incidentDate ? ` on ${submission.incidentDate}` : ''
  parts.push(`${humanizeCaseType(submission.caseType)}${place ? ` reported in ${place}` : ''}${when}.`)

  const facts = submission.caseFacts
  const treatment = typeof facts.medicalTreatment === 'string' ? facts.medicalTreatment : null
  if (treatment) parts.push(`Claimant reports medical treatment: ${treatment}.`)
  const provider = typeof facts.providerName === 'string' ? facts.providerName : null
  if (provider) parts.push(`Treating provider on record: ${provider}.`)

  parts.push('Organized from what the claimant told us, for a firm in their area to review.')
  return parts.join(' ')
}

function humanizeCaseType(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

/**
 * Orchestrate a full structured intake submission. Testable with any IntakeDeps,
 * so the moat write path is proven end to end without a live database.
 */
export async function handleIntakeSubmit(
  deps: IntakeDeps,
  submission: IntakeSubmission,
  context: { ipAddress?: string; userAgent?: string } = {},
): Promise<IntakeSubmissionResult> {
  const svc = createIntakeService(deps)
  const nowIso = deps.clock.nowIso()
  const tuple = buildAttributionTuple(submission.attribution, nowIso)

  // 1. Attribution captured first and immutable, market resolved geographically.
  const { sessionId, marketId, marketSlug } = await svc.beginIntake({
    attribution: tuple,
    contact: {
      firstName: submission.contact.firstName,
      lastName: submission.contact.lastName,
      phone: submission.contact.phone,
      email: submission.contact.email,
      location: submission.location,
    },
  })

  // 2. The complete raw case facts into the append only log (the moat).
  await svc.recordStructuredIntake(sessionId, {
    caseType: submission.caseType,
    incidentDate: submission.incidentDate ?? null,
    ...submission.caseFacts,
  })

  // 3. Consent and TrustedForm, then the HIPAA template (firm name blank, W5).
  await svc.captureConsent(sessionId, {
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    trustedFormCertUrl: submission.consent.trustedFormCertUrl,
  })
  await svc.signHipaaTemplate(sessionId, submission.hipaa.templateVersion || 'hipaa-v1')

  // 4. Basic completeness and live market validation (never SCPS, W1).
  const validation = await svc.validateIntake(sessionId)

  // 5. Protection plan, resilient to a narrative outage.
  const summary = summarizeIntake(submission)
  const protectionPlan = await svc.generateProtectionPlan(
    sessionId,
    { summary, caseType: submission.caseType },
    DEFAULT_PROTECTION_PLAN,
  )

  // 6. Assemble the dossier with the audience split intact.
  const dossier = await svc.assembleDossier(sessionId, {
    caseType: submission.caseType,
    marketSlug: marketSlug ?? 'unresolved',
    playback: { summary, points: [] },
    protectionPlan,
    statuteOfLimitationsDate: submission.statuteOfLimitationsDate ?? null,
  })

  return {
    sessionId,
    dossierId: dossier.id,
    submissionId: submission.meta?.submissionId || sessionId,
    market: marketId,
    status: 'received',
    validationPassed: validation.passed,
    validationReasons: validation.reasons,
  }
}
