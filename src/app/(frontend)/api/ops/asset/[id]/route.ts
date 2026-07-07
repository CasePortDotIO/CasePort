import { createDemandCaptureService } from '@/services/DemandCaptureService'
import { demandCaptureDepsForPayload } from '@/services/adapters/payloadDemandCapture'
import { resolveOperator, unauthorized } from '../../_operator'

/**
 * Approve and publish a pending capture asset, as the authenticated operator
 * (HL4). The operator is the human publisher of record. Publication still runs
 * the full pre publish gate (pursued cell, compliant structure and copy,
 * canonical ownership), so an operator cannot push a non compliant asset live.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await resolveOperator(req)
  if (!ctx) return unauthorized()
  const { id } = await params
  const demand = createDemandCaptureService(demandCaptureDepsForPayload(ctx.payload))
  const result = await demand.publishAsset(id, ctx.operator)
  return Response.json({ ok: result.published, reasons: result.reasons })
}
