import { createPromotionService } from '@/services/PromotionService'
import { createPayloadPromotionDeps } from '@/services/adapters/payloadPromotion'
import { resolveOperator, unauthorized } from '../../_operator'

/**
 * Approve or reject a pending promotion, as the authenticated operator (H1). The
 * operator's identity is the logged human approver. A market action still needs a
 * second distinct approver; this route enforces nothing extra, it just records
 * one operator's decision through the gate.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await resolveOperator(req)
  if (!ctx) return unauthorized()
  const { id } = await params
  const body = (await req.json().catch(() => ({}))) as { decision?: 'approve' | 'reject'; reason?: string }
  const promotions = createPromotionService(createPayloadPromotionDeps(ctx.payload))

  const result =
    body.decision === 'reject'
      ? await promotions.reject(id, ctx.operator, body.reason ?? 'rejected by operator')
      : await promotions.approve(id, ctx.operator)

  return Response.json({
    ok: Boolean(result.promotion),
    promoted: result.promoted,
    status: result.promotion?.status ?? null,
    reasons: result.reasons,
  })
}
