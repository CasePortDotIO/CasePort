import config from '@payload-config'
import { getPayload } from 'payload'
import { createRoutingService } from '@/services/RoutingService'
import { createDeliveryService } from '@/services/DeliveryService'
import { createPayloadRoutingDeps, createPayloadDeliveryDeps } from '@/services/adapters/payloadDelivery'

/**
 * The money moving slice, end to end (Phase 3). Given a validated dossier this
 * route resolves the geographic firm, delivers the dossier as a closing kit,
 * and settles the fixed fee with an atomic, idempotent debit, or holds the
 * dossier in the queue when the wallet is dry. Routing cause (geographic) and
 * triage (SCPS) stay physically separate: routing never sees a quality signal,
 * and the SCPS number is attached only after delivery.
 *
 * This is a system action. A real deployment runs it from an Inngest function
 * with durable retries; the debit's unique idempotency key makes those retries
 * safe. Guarded to non production or a shared secret, like the other dev routes.
 */
export async function POST(req: Request, { params }: { params: Promise<{ dossierId: string }> }) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  const allowed =
    process.env.NODE_ENV !== 'production' ||
    (process.env.SEED_SECRET && secret === process.env.SEED_SECRET)
  if (!allowed) {
    return Response.json({ error: 'not allowed' }, { status: 403 })
  }

  const { dossierId } = await params
  const payload = await getPayload({ config })

  const deliveryDeps = createPayloadDeliveryDeps(payload)
  const dossier = await deliveryDeps.dossiers.get(dossierId)
  if (!dossier) {
    return Response.json({ error: 'dossier not found' }, { status: 404 })
  }

  // Routing is geographic only (W1). It sees the market and the validation
  // boolean, nothing evaluative. A dossier that reached delivery has passed
  // basic intake validation.
  const routing = createRoutingService(createPayloadRoutingDeps(payload))
  const decision = await routing.route({
    dossierId,
    market: dossier.market,
    validationPassed: true,
  })

  if (!decision.routed || !decision.firmId) {
    return Response.json({
      routing: decision,
      delivery: null,
      note: 'No live firm assigned to this market. The dossier is not delivered.',
    })
  }

  const delivery = createDeliveryService(deliveryDeps)
  const outcome = await delivery.deliver({ dossierId, firmId: decision.firmId })

  return Response.json({ routing: decision, delivery: outcome })
}
