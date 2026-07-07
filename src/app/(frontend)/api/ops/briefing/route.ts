import { createBriefingService } from '@/services/BriefingService'
import { createPayloadBriefingDeps } from '@/services/adapters/payloadBriefing'
import { createAnthropicQueryResponder } from '@/services/adapters/liveAgents'
import { resolveOperator, unauthorized } from '../_operator'

/**
 * Run the fused intelligence briefing on demand, as the authenticated operator.
 * Assembles the ranked briefing and delivers it through the internal channels
 * (dry running cleanly when no channel keys are set). The query responder is the
 * live Claude adapter, which falls back to a non asserting answer when no model
 * key is set; it never asserts an unverified figure.
 */
export async function POST(req: Request) {
  const ctx = await resolveOperator(req)
  if (!ctx) return unauthorized()
  const briefing = createBriefingService(createPayloadBriefingDeps(ctx.payload, createAnthropicQueryResponder()))
  const result = await briefing.runBriefing()
  return Response.json({ ok: true, briefingId: result.id, channels: result.deliveredChannels })
}
