import config from '@payload-config'
import { getPayload } from 'payload'
import { createOutcomeService } from '@/services/OutcomeService'
import { createIntelligenceService } from '@/services/IntelligenceService'
import { createPayloadOutcomeDeps, createPayloadIntelligenceDeps } from '@/services/adapters/payloadIntelligence'
import { createPayloadAgentDeps } from '@/services/adapters/payloadAgents'
import { guardFirmAccess } from '@/lib/firmAuth'
import type { OutcomeResult } from '@/services/intelligencePorts'

/**
 * The firm reports the outcome of a delivered case from its dashboard (Section 7
 * step 8, W4). This is the moat's ignition: a reported outcome feeds the SCPS
 * feedback loop and the attribution intelligence, and unlocks the firm's true
 * cost per signed case. It never touches the fee, which was fixed and charged on
 * delivery regardless of outcome (W3, W4): OutcomeService carries no ledger port,
 * so there is no code path from here to money.
 *
 * Firm scoped: the delivery must belong to the requesting firm, so a firm can
 * never report an outcome on another firm's case. Idempotent: reporting twice
 * does not create a second outcome.
 */
export const dynamic = 'force-dynamic'

const VALID: OutcomeResult[] = ['retained', 'not-retained', 'still-evaluating', 'settled']

export async function POST(
  req: Request,
  { params }: { params: Promise<{ firmId: string; deliveryId: string }> },
) {
  const { firmId, deliveryId } = await params

  let body: { result?: unknown; reasonCode?: unknown; settlementValueCents?: unknown }
  try {
    body = (await req.json()) ?? {}
  } catch {
    return Response.json({ error: 'invalid payload' }, { status: 400 })
  }

  const result = body.result as OutcomeResult
  if (!VALID.includes(result)) {
    return Response.json({ error: 'invalid result' }, { status: 400 })
  }
  const settlementValueCents =
    typeof body.settlementValueCents === 'number' && body.settlementValueCents >= 0 ? body.settlementValueCents : undefined
  const reasonCode = typeof body.reasonCode === 'string' ? body.reasonCode : undefined

  try {
    const payload = await getPayload({ config })
    const denied = await guardFirmAccess(payload, req, firmId)
    if (denied) return denied
    const agentDeps = createPayloadAgentDeps(payload)

    // Firm scoping: the delivery must be this firm's.
    const delivery = await agentDeps.deliveries.get(deliveryId)
    if (!delivery || delivery.firmId !== firmId) {
      return Response.json({ error: 'not found' }, { status: 404 })
    }

    const intel = createIntelligenceService(createPayloadIntelligenceDeps(payload))

    // Idempotent: do not record a second outcome for the same delivery.
    if (await agentDeps.outcomes.hasOutcome(deliveryId)) {
      const acer = await intel.acer(firmId)
      return Response.json({ recorded: false, reason: 'already-recorded', acer })
    }

    const outcomeSvc = createOutcomeService(createPayloadOutcomeDeps(payload))
    const outcome = await outcomeSvc.reportOutcome({ deliveryId, firmId, result, reasonCode, settlementValueCents })

    // Reporting is what unlocks the true cost per signed case (the reciprocity
    // gate). Return the freshly unlocked ACER so the dashboard can reflect it.
    const acer = await intel.acer(firmId)
    return Response.json({ recorded: true, outcomeId: outcome.id, result, acer })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
