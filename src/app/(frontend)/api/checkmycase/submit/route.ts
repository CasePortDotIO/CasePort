import config from '@payload-config'
import { getPayload } from 'payload'
import { handleIntakeSubmit, type IntakeSubmission } from '@/services/intakeSubmission'
import { createPayloadIntakeDeps } from '@/services/adapters/payload'
import { ComplianceService } from '@/services/ComplianceService'
import { inngest } from '@/inngest/client'

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

  // Claimant safe response only. Geographic and procedural, never evaluative.
  const body = {
    submissionId: result.submissionId,
    status: 'received' as const,
    message: 'Your case file has been received. A firm in your area is reviewing it.',
  }
  ComplianceService.guardClaimantPayload(body)
  return Response.json(body, { status: 201 })
}
