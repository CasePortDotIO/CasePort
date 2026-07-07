import config from '@payload-config'
import { getPayload } from 'payload'
import { handleIntakeSubmit, type IntakeSubmission } from '@/services/intakeSubmission'
import { createPayloadIntakeDeps } from '@/services/adapters/payload'
import { ComplianceService } from '@/services/ComplianceService'
import { enforceRateLimit } from '@/lib/rateLimit'
import { inngest } from '@/inngest/client'
import { httpNotifier } from '@/services/adapters/notifier'
import { statusPath, statusUrl } from '@/lib/statusLink'
import { buildConfirmationMessages } from '@/lib/claimant/confirmation'

/** The absolute origin to build outbound links from: an explicit site URL if
 * configured, else the request origin. Never a hardcoded host. */
function originFor(req: Request): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    new URL(req.url).origin
  )
}


/**
 * Claimant intake submission. The single write path from the CheckMyCase surface
 * into the system of record. Captures the attribution tuple and the raw case
 * facts into the append only event log (the moat, Section 11), resolves the
 * market geographically (W1), and assembles the dossier with the audience split.
 *
 * The response is claimant safe: a reference number and a procedural status
 * only, never a score or a case assessment (W2). It is guarded before it is
 * serialized.
 */
export async function POST(req: Request) {
  // The submit path writes to the database and triggers the durable pipeline, so
  // it is rate limited per IP. A real claimant submits once; this stops a flood.
  const limited = enforceRateLimit(req, 'submit', { limit: 8, windowMs: 60_000 })
  if (limited) return limited

  let submission: IntakeSubmission
  try {
    submission = (await req.json()) as IntakeSubmission
  } catch {
    return Response.json({ error: 'invalid payload' }, { status: 400 })
  }

  if (!submission?.contact?.firstName || !submission?.caseType) {
    return Response.json({ error: 'missing required fields' }, { status: 400 })
  }

  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
  const userAgent = req.headers.get('user-agent') || undefined

  const payload = await getPayload({ config })
  const deps = createPayloadIntakeDeps(payload)

  const result = await handleIntakeSubmit(deps, submission, { ipAddress, userAgent })

  // Close the pipeline: a validated dossier in a live market is handed to the
  // durable delivery pipeline (geographic route, deliver as a closing kit, ACID
  // debit, then the speed and SLA agents). Guarded so a missing Inngest config
  // never breaks intake. The claimant response is unaffected either way.
  if (result.validationPassed && result.market) {
    try {
      await inngest.send({ name: 'dossier/deliver.requested', data: { dossierId: result.dossierId } })
    } catch (err) {
      console.error('failed to trigger delivery pipeline for dossier', result.dossierId, err)
    }
  }

  // The confirmation touch: no black hole. The claimant is sent a link back to
  // their living status page the moment the file is received (Section 6 step 8).
  // Best effort and guarded: it no ops without Twilio or Resend keys, and a send
  // failure never affects the claimant response. The copy is guarded as claimant
  // facing text before it can leave the server (W2, W6).
  const absStatusUrl = statusUrl(originFor(req), result.reference)
  const reference = result.reference
  try {
    const messages = buildConfirmationMessages({
      firstName: submission.contact.firstName,
      reference,
      statusUrl: absStatusUrl,
    })
    ComplianceService.guardClaimantText(messages.sms)
    ComplianceService.guardClaimantText(messages.emailBody)
    const notifier = httpNotifier()
    if (submission.contact.phone) {
      await notifier.sms({ to: submission.contact.phone, body: messages.sms })
    }
    if (submission.contact.email) {
      await notifier.email({
        to: submission.contact.email,
        subject: messages.emailSubject,
        body: messages.emailBody,
      })
    }
  } catch (err) {
    console.error('claimant confirmation notify failed for dossier', result.dossierId, err)
  }

  // Claimant safe response only. Geographic and procedural, never evaluative.
  // sessionId is an opaque handle the confirmation surface uses to tie any
  // after the fact captures (insurance card, voice statement) to this intake.
  // statusPath is the signed, same origin link to the living status page.
  const body = {
    sessionId: result.sessionId,
    submissionId: result.submissionId,
    dossierId: result.dossierId,
    reference,
    statusPath: statusPath(result.reference),
    status: 'received' as const,
    message: 'Your case file has been received. A firm in your area is reviewing it.',
  }
  ComplianceService.guardClaimantPayload(body)
  return Response.json(body, { status: 201 })
}
