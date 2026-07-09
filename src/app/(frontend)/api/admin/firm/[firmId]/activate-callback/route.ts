import config from '@payload-config'
import { getPayload } from 'payload'
import { requireInternal } from '@/lib/adminAuth'
import { payloadEventStoreFor } from '@/services/adapters/payloadEvents'

/**
 * Activate (or deactivate) a firm's contractual callback SLA: the firm one
 * switch. The speed callback loop and the SLA watchdog are dormant until a firm
 * has a live callback SLA (AGENTS.md Section 4, Section 7 step 9). Flipping that
 * gate is a deliberate, audited act tied to a signed Founding Partner agreement,
 * so it is ADMIN gated and every change writes an audit event with the approver.
 *
 * This is the only path that arms the speed loop for a firm. It never touches
 * billing, routing, or scoring: it sets the callback window and the gate, and
 * nothing else.
 */
export const dynamic = 'force-dynamic'

export async function POST(req: Request, { params }: { params: Promise<{ firmId: string }> }) {
  const { firmId } = await params

  let body: { active?: unknown; slaCallbackMinutes?: unknown }
  try {
    body = (await req.json()) ?? {}
  } catch {
    return Response.json({ error: 'invalid payload' }, { status: 400 })
  }

  const active = body.active !== false // default to activating; pass active:false to disarm
  const minutes =
    typeof body.slaCallbackMinutes === 'number' && body.slaCallbackMinutes > 0
      ? Math.round(body.slaCallbackMinutes)
      : undefined

  try {
    const payload = await getPayload({ config })
    const auth = await requireInternal(payload, req, { admin: true })
    if ('response' in auth) return auth.response

    const firm = await payload.findByID({ collection: 'firms', id: firmId, depth: 0 }).catch(() => null)
    if (!firm) return Response.json({ error: 'firm not found' }, { status: 404 })

    const data: Record<string, unknown> = { callbackSlaActive: active }
    if (minutes != null) data.slaCallbackMinutes = minutes

    await payload.update({ collection: 'firms', id: firmId, data })

    // Audit the arming of the speed loop, with the approver, onto the event log.
    await payloadEventStoreFor(payload).append({
      eventType: 'FirmCallbackSlaActivated',
      aggregateType: 'firm',
      aggregateId: String(firmId),
      actor: auth.user.email || 'admin',
      occurredAt: new Date().toISOString(),
      payload: {
        active,
        slaCallbackMinutes: minutes ?? (firm as { slaCallbackMinutes?: number }).slaCallbackMinutes ?? null,
        approvedBy: auth.user.email,
      },
    })

    return Response.json({
      firmId: String(firmId),
      callbackSlaActive: active,
      slaCallbackMinutes: minutes ?? (firm as { slaCallbackMinutes?: number }).slaCallbackMinutes ?? null,
    })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
