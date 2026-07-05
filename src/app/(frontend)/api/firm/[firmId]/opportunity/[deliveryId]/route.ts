import config from '@payload-config'
import { getPayload } from 'payload'
import { createGlassBoxService } from '@/services/GlassBoxService'
import { createPayloadGlassBoxDeps } from '@/services/adapters/payloadWallet'
import { guardFirmAccess } from '@/lib/firmAuth'

/**
 * The full closing kit for one delivered opportunity, scoped to the firm
 * (Section 7 step 5). It carries the firm facing triage: the SCPS number, the
 * qualification factors, the organized statement, the statute status, and the
 * claimant contact so the partner can call. Firm scoping is the invariant: the
 * read returns null for a delivery that is not this firm's, and this route turns
 * that into a 404, so a firm can never open another firm's case.
 *
 * A real firm session will bind firmId from auth; for now it is the path param.
 */
export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ firmId: string; deliveryId: string }> },
) {
  const { firmId, deliveryId } = await params
  try {
    const payload = await getPayload({ config })
    const denied = await guardFirmAccess(payload, _req, firmId)
    if (denied) return denied
    const glass = createGlassBoxService(createPayloadGlassBoxDeps(payload))
    const detail = await glass.opportunityDetail(firmId, deliveryId)
    if (!detail) return Response.json({ error: 'not found' }, { status: 404 })
    return Response.json(detail)
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
