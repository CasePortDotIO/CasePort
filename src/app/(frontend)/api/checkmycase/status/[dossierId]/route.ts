import config from '@payload-config'
import { getPayload } from 'payload'
import type { Dossier } from '@/payload-types'
import { ComplianceService } from '@/services/ComplianceService'
import { buildClaimantTimeline } from '@/lib/claimant/statusTimeline'
import { verifyStatus } from '@/lib/statusLink'
import { deriveReference, isReference, normalizeReference } from '@/lib/domain/reference'

/**
 * Claimant facing living status page data (Section 6 step 8). No black hole:
 * the claimant returns to a page showing motion on their behalf. Status
 * language is geographic and procedural only (W2, W6).
 *
 * Four layers protect this endpoint:
 *   0. The request must carry a valid HMAC signature for this dossier id, so the
 *      status surface cannot be enumerated with guessed ids.
 *   1. The dossier is fetched with overrideAccess false and no user, so Payload
 *      field level access strips the firm only evaluation group.
 *   2. The response is built from an explicit claimant safe whitelist, so a new
 *      evaluative field cannot ride along even if the fetch returned it.
 *   3. ComplianceService.guardClaimantPayload scans the response and throws on
 *      any evaluative field before it is serialized to the claimant.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ dossierId: string }> },
) {
  const { dossierId } = await params
  const sig = new URL(req.url).searchParams.get('sig')

  // Layer 0: a valid signature is required. Without it the id is unusable, so a
  // 404 is returned rather than confirming the dossier exists.
  if (!verifyStatus(dossierId, sig)) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  let dossier: Dossier | null = null
  try {
    const payload = await getPayload({ config })
    // The URL carries the human case reference (CP-XXXXXX). Resolve it, and fall
    // back to a raw id for any old link that still carries one.
    if (isReference(dossierId)) {
      const found = await payload.find({
        collection: 'dossiers',
        where: { reference: { equals: normalizeReference(dossierId) } },
        depth: 0,
        limit: 1,
        overrideAccess: false,
      })
      dossier = (found.docs[0] as Dossier | undefined) ?? null
    }
    if (!dossier) {
      dossier = await payload.findByID({
        collection: 'dossiers',
        id: dossierId,
        depth: 0,
        overrideAccess: false,
      })
    }
  } catch {
    // A missing dossier or an unavailable backend both resolve to not found; the
    // status page renders a calm, reassuring message rather than an error.
    dossier = null
  }

  if (!dossier) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  const status = (dossier.status as string) ?? 'received'
  const caseType = (dossier.caseType as string) ?? null
  const receivedAt = (dossier.receivedAt as string) ?? null

  // Explicit claimant safe whitelist. Never spread the dossier. The timeline is
  // built from procedural status only, so it can carry no evaluative signal.
  const body = {
    id: dossier.id,
    reference: (dossier.reference as string) || deriveReference(String(dossier.id)),
    status,
    caseType,
    plainLanguageSummary: (dossier.plainLanguageSummary as string) ?? '',
    protectionPlan: ((dossier.protectionPlan as { step: string }[]) ?? []).map((p) => p.step),
    statuteOfLimitationsDate: (dossier.statuteOfLimitationsDate as string) ?? null,
    receivedAt,
    timeline: buildClaimantTimeline({ status, receivedAt, caseType }),
  }

  // Final structural guard. Throws EvaluativeLeakError if anything slipped in.
  ComplianceService.guardClaimantPayload(body)

  return Response.json(body)
}
