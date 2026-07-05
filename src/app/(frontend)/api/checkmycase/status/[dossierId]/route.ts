import config from '@payload-config'
import { getPayload } from 'payload'
import { ComplianceService } from '@/services/ComplianceService'

/**
 * Claimant facing living status page data (Section 6 step 8). No black hole:
 * the claimant returns to a page showing motion on their behalf. Status
 * language is geographic and procedural only (W2, W6).
 *
 * Three layers of the audience split protect this endpoint:
 *   1. The dossier is fetched with overrideAccess false and no user, so Payload
 *      field level access strips the firm only evaluation group.
 *   2. The response is built from an explicit claimant safe whitelist, so a new
 *      evaluative field cannot ride along even if the fetch returned it.
 *   3. ComplianceService.guardClaimantPayload scans the response and throws on
 *      any evaluative field before it is serialized to the claimant.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ dossierId: string }> },
) {
  const { dossierId } = await params
  const payload = await getPayload({ config })

  const dossier = await payload.findByID({
    collection: 'dossiers',
    id: dossierId,
    depth: 0,
    overrideAccess: false,
  })

  if (!dossier) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  // Explicit claimant safe whitelist. Never spread the dossier.
  const body = {
    id: dossier.id,
    status: dossier.status ?? 'received',
    caseType: dossier.caseType ?? null,
    plainLanguageSummary: dossier.plainLanguageSummary ?? '',
    protectionPlan: (dossier.protectionPlan ?? []).map((p) => p.step),
    statuteOfLimitationsDate: dossier.statuteOfLimitationsDate ?? null,
    receivedAt: dossier.receivedAt ?? null,
  }

  // Final structural guard. Throws EvaluativeLeakError if anything slipped in.
  ComplianceService.guardClaimantPayload(body)

  return Response.json(body)
}
