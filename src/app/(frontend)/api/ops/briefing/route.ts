import { createBriefingService } from '@/services/BriefingService'
import { createPayloadBriefingDeps } from '@/services/adapters/payloadBriefing'
import { createGroundedResponder } from '@/services/fakes/briefingInMemory'
import { resolveOperator, unauthorized } from '../_operator'

/**
 * Run the fused intelligence briefing on demand, as the authenticated operator.
 * Assembles the ranked briefing and delivers it through the internal channels
 * (dry running cleanly when no channel keys are set). The responder is the
 * grounded default until a production agent is wired; it never asserts an
 * unverified figure.
 */
export async function POST(req: Request) {
  const ctx = await resolveOperator(req)
  if (!ctx) return unauthorized()
  const briefing = createBriefingService(createPayloadBriefingDeps(ctx.payload, createGroundedResponder()))
  const result = await briefing.runBriefing()
  return Response.json({ ok: true, briefingId: result.id, channels: result.deliveredChannels })
}
