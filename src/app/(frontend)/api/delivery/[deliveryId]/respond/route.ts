import config from '@payload-config'
import { getPayload } from 'payload'
import { createAgentService } from '@/services/AgentService'
import { createPayloadAgentDeps } from '@/services/adapters/payloadAgents'

/**
 * The firm records that it made contact with the claimant (Section 6 step 9,
 * Section 7 step 9). The response time is computed against the callback SLA, so
 * the SLA watchdog sees the delivery as answered and does not flag a breach.
 * Guarded like the other system routes; a firm session binds firmId in
 * production.
 */
export async function POST(req: Request, { params }: { params: Promise<{ deliveryId: string }> }) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  const allowed =
    process.env.NODE_ENV !== 'production' || (process.env.SEED_SECRET && secret === process.env.SEED_SECRET)
  if (!allowed) return Response.json({ error: 'not allowed' }, { status: 403 })

  const { deliveryId } = await params
  const body = (await req.json().catch(() => ({}))) as { respondedAt?: string }

  const payload = await getPayload({ config })
  const agents = createAgentService(createPayloadAgentDeps(payload))
  const result = await agents.recordFirmResponse({ deliveryId, respondedAt: body.respondedAt })

  if (!result.recorded) return Response.json({ error: 'delivery not found or not delivered' }, { status: 404 })
  return Response.json(result)
}
