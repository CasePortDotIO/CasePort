import config from '@payload-config'
import { getPayload } from 'payload'
import Stripe from 'stripe'
import { createWalletService } from '@/services/WalletService'
import { createPayloadWalletDeps } from '@/services/adapters/payloadWallet'

/**
 * Stripe webhook. Money in only (Section 3, Section 10). Stripe is the rail; the
 * ledger is the truth. On a verified successful payment, we append a credit
 * ledger entry keyed by the Stripe event id, so the same event credits exactly
 * once no matter how many times Stripe retries the webhook. Fees are never
 * derived from an outcome (W3); this path only adds funds.
 *
 * The firm is identified by metadata.firmId on the Checkout Session or Payment
 * Intent. The amount is taken from Stripe, in cents.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!secret || !apiKey) {
    return Response.json({ error: 'stripe not configured' }, { status: 503 })
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) return Response.json({ error: 'missing signature' }, { status: 400 })

  const raw = await req.text()
  const stripe = new Stripe(apiKey)

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, secret)
  } catch {
    return Response.json({ error: 'invalid signature' }, { status: 400 })
  }

  // We only credit on a completed, paid money-in event.
  let firmId: string | undefined
  let amountCents: number | undefined

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status === 'paid') {
      firmId = session.metadata?.firmId ?? undefined
      amountCents = session.amount_total ?? undefined
    }
  } else if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent
    firmId = intent.metadata?.firmId ?? undefined
    amountCents = intent.amount_received ?? intent.amount ?? undefined
  } else {
    // Acknowledge other events without acting.
    return Response.json({ received: true, ignored: event.type })
  }

  if (!firmId || !amountCents || amountCents <= 0) {
    return Response.json({ received: true, note: 'no firm or amount to credit' })
  }

  const payload = await getPayload({ config })
  const wallet = createWalletService(createPayloadWalletDeps(payload))

  // Idempotency key is the Stripe event id: exactly once, retries safe.
  const result = await wallet.topUp({
    firmId,
    amountCents,
    idempotencyKey: `stripe_${event.id}`,
    stripeRef: event.id,
  })

  return Response.json({ received: true, credited: result.credited, balanceCents: result.balanceCents })
}
