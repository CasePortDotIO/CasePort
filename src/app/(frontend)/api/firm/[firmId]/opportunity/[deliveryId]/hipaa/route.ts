import config from '@payload-config'
import { getPayload } from 'payload'
import { createGlassBoxService } from '@/services/GlassBoxService'
import { createPayloadGlassBoxDeps } from '@/services/adapters/payloadWallet'
import { guardFirmAccess } from '@/lib/firmAuth'
import { renderHipaaAuthorization } from '@/lib/claimant/hipaaAuthorization'

/**
 * The executed HIPAA authorization for one delivered opportunity, as a real
 * downloadable document (Section 7 step 5, W5). The authorization was executed by
 * the claimant and populated with this firm's name at routing; the firm requests
 * records directly from providers. This returns the authorization document
 * itself, never any medical record, which CasePort does not hold.
 *
 * Firm scoped through the same invariant as the closing kit: the opportunity read
 * returns null for a delivery that is not this firm's, so a firm can only ever
 * download the authorization for its own case.
 */
export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ firmId: string; deliveryId: string }> },
) {
  const { firmId, deliveryId } = await params
  try {
    const payload = await getPayload({ config })
    const denied = await guardFirmAccess(payload, req, firmId)
    if (denied) return denied

    const glass = createGlassBoxService(createPayloadGlassBoxDeps(payload))
    // The firm scoping invariant: null for a delivery that is not this firm's.
    const detail = await glass.opportunityDetail(firmId, deliveryId)
    if (!detail) return Response.json({ error: 'not found' }, { status: 404 })

    const firm = (await payload
      .findByID({ collection: 'firms', id: firmId, depth: 0 })
      .catch(() => null)) as { name?: string } | null

    const html = renderHipaaAuthorization({
      claimantName: detail.claimant.name,
      firmName: firm?.name || 'your firm',
      // The template is populated with the firm name at routing, so the delivery
      // time is when the named authorization was produced.
      executedDate: detail.deliveredAt,
      market: detail.market,
      reference: detail.reference,
    })

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'content-disposition': `attachment; filename="hipaa-authorization-${detail.reference}.html"`,
      },
    })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
