import config from '@payload-config'
import { getPayload } from 'payload'
import { createOutcomeService } from '@/services/OutcomeService'
import { createPayloadOutcomeDeps } from '@/services/adapters/payloadIntelligence'
import { inngest } from '@/inngest/client'
import type { OutcomeResult } from '@/services/intelligencePorts'

/**
 * A firm reports the outcome of a delivered case (Section 7 step 8, W4). This
 * feeds intelligence and the SCPS feedback loop only. It never touches the fee,
 * which was fixed and charged on delivery regardless of outcome. The settlement
 * value is recorded as intelligence and can never become a fee (W3, W4).
 *
 * In production a firm session binds firmId from auth. For now it is supplied in
 * the body and the route is guarded like the other system routes.
 */
const VALID: OutcomeResult[] = ['retained', 'not-retained', 'still-evaluating', 'settled']

export async function POST(req: Request, { params }: { params: Promise<{ deliveryId: string }> }) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  const allowed =
    process.env.NODE_ENV !== 'production' || (process.env.SEED_SECRET && secret === process.env.SEED_SECRET)
  if (!allowed) return Response.json({ error: 'not allowed' }, { status: 403 })

  const { deliveryId } = await params
  const body = (await req.json().catch(() => ({}))) as {
    firmId?: string
    result?: string
    reasonCode?: string
    settlementValueCents?: number
  }

  if (!body.firmId) return Response.json({ error: 'firmId required' }, { status: 400 })
  if (!body.result || !VALID.includes(body.result as OutcomeResult)) {
    return Response.json({ error: `result must be one of ${VALID.join(', ')}` }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const outcomeSvc = createOutcomeService(createPayloadOutcomeDeps(payload))

  const outcome = await outcomeSvc.reportOutcome({
    deliveryId,
    firmId: body.firmId,
    result: body.result as OutcomeResult,
    reasonCode: body.reasonCode,
    settlementValueCents: body.settlementValueCents,
  })

  // Fan out for observability and downstream intelligence. Guarded so a missing
  // Inngest config never breaks outcome reporting.
  try {
    await inngest.send({ name: 'outcome/reported', data: { outcomeId: outcome.id, firmId: body.firmId, result: outcome.result } })
  } catch (err) {
    console.error('failed to emit outcome/reported', err)
  }

  return Response.json({ outcome })
}
