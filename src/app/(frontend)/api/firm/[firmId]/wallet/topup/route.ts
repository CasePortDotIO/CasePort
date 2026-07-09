import Stripe from 'stripe'
import config from '@payload-config'
import { getPayload } from 'payload'
import { guardFirmAccess } from '@/lib/firmAuth'

/**
 * Create a Stripe Checkout Session to fund a firm's wallet (Section 10, money in
 * only). This is the front door for money in: it returns a hosted checkout URL
 * the partner is redirected to. On successful payment Stripe fires the webhook,
 * which appends a credit to the authoritative ledger, keyed by the Stripe event
 * id, so the same payment credits exactly once. Stripe is the rail; the ledger
 * is the truth.
 *
 * Firm scoped: a partner can only fund their own firm's wallet (the firmId comes
 * from the session, and the path must match). The amount bounds guard against a
 * fat finger and against abuse of an authenticated endpoint.
 */
export const dynamic = 'force-dynamic'

const MIN_CENTS = 50_000 // $500 minimum top up
const MAX_CENTS = 50_000_000 // $500,000 maximum per transaction

export async function POST(req: Request, { params }: { params: Promise<{ firmId: string }> }) {
  const { firmId } = await params

  let body: { amountCents?: unknown }
  try {
    body = (await req.json()) ?? {}
  } catch {
    return Response.json({ error: 'invalid payload' }, { status: 400 })
  }
  const amountCents = typeof body.amountCents === 'number' ? Math.round(body.amountCents) : NaN
  if (!Number.isFinite(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) {
    return Response.json({ error: `amount must be between $${MIN_CENTS / 100} and $${MAX_CENTS / 100}` }, { status: 400 })
  }

  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) return Response.json({ error: 'payments not configured' }, { status: 503 })

  try {
    const payload = await getPayload({ config })
    const denied = await guardFirmAccess(payload, req, firmId)
    if (denied) return denied

    const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
    const stripe = new Stripe(apiKey)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // The webhook reads firmId from metadata to credit the right ledger.
      metadata: { firmId },
      payment_intent_data: { metadata: { firmId } },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amountCents,
            product_data: {
              name: 'CasePort wallet top-up',
              description: 'Pre-funded balance for delivered personal injury opportunities.',
            },
          },
        },
      ],
      success_url: `${base}/firm/wallet?funded=1`,
      cancel_url: `${base}/firm/wallet`,
    })

    return Response.json({ url: session.url })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
