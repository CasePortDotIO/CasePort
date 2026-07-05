import config from '@payload-config'
import { getPayload } from 'payload'
import { createOutcomeService } from '@/services/OutcomeService'
import { createPayloadOutcomeDeps } from '@/services/adapters/payloadIntelligence'
import { createPayloadAgentDeps } from '@/services/adapters/payloadAgents'
import { verifyOutcome } from '@/lib/outcomeLink'
import type { OutcomeResult } from '@/services/intelligencePorts'

/**
 * One tap outcome capture (Section 7 step 8, W4). The firm reports what happened
 * to a delivered case with a single tap from a message, no login. The link is
 * HMAC signed so it cannot be forged. Feeds intelligence only, never billing.
 * Returns a plain confirmation page, since it is opened from an email or a text.
 */
const LABEL: Record<OutcomeResult, string> = {
  retained: 'signed',
  'not-retained': 'not signed',
  'still-evaluating': 'still being worked',
  settled: 'settled',
}

function page(title: string, body: string) {
  return new Response(
    `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
     <div style="min-height:100vh;display:grid;place-items:center;background:#0a0a0a;color:#e8f1ef;font-family:system-ui,sans-serif;margin:0">
       <div style="max-width:420px;text-align:center;padding:32px">
         <div style="width:44px;height:44px;border-radius:50%;background:rgba(34,197,141,.14);display:grid;place-items:center;margin:0 auto 18px;color:#34d39a;font-size:22px">&#10003;</div>
         <h1 style="font-family:Georgia,serif;font-weight:600;font-size:22px;margin:0 0 10px;color:#fff">${title}</h1>
         <p style="color:#9fb6b1;line-height:1.6;margin:0">${body}</p>
       </div>
     </div>`,
    { headers: { 'content-type': 'text/html; charset=utf-8' } },
  )
}

export async function GET(req: Request, { params }: { params: Promise<{ deliveryId: string }> }) {
  const { deliveryId } = await params
  const url = new URL(req.url)
  const result = url.searchParams.get('result') as OutcomeResult | null
  const sig = url.searchParams.get('sig') || ''

  const valid: OutcomeResult[] = ['retained', 'not-retained', 'still-evaluating', 'settled']
  if (!result || !valid.includes(result) || !verifyOutcome(deliveryId, result, sig)) {
    return page('Link not valid', 'This outcome link is invalid or has expired. Please report the outcome from your dashboard instead.')
  }

  const payload = await getPayload({ config })
  const agentDeps = createPayloadAgentDeps(payload)
  const delivery = await agentDeps.deliveries.get(deliveryId)
  if (!delivery) {
    return page('Delivery not found', 'We could not find that delivery. Please report the outcome from your dashboard instead.')
  }

  // Idempotent: if the firm already reported, do not record a second outcome.
  if (await agentDeps.outcomes.hasOutcome(deliveryId)) {
    return page('Already recorded', 'Thank you, the outcome for this case was already recorded. Nothing more to do.')
  }

  const outcomeSvc = createOutcomeService(createPayloadOutcomeDeps(payload))
  await outcomeSvc.reportOutcome({ deliveryId, firmId: delivery.firmId, result })

  return page(
    'Thank you',
    `Recorded as <b style="color:#e8f1ef">${LABEL[result]}</b>. This sharpens your cost per signed case and tunes your market intelligence. Nothing else is needed.`,
  )
}
