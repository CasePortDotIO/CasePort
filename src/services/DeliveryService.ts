import type { CaseTypeValue } from '@/lib/domain/constants'
import type { DeliveryDeps, DeliveryRecord } from './deliveryPorts'

/**
 * DeliveryService. Section 7 step 5 and 6, Section 8, Section 10. This is the
 * money moving slice, assembled precept upon precept:
 *
 *   routing (geographic, elsewhere) has already resolved the firm
 *   -> deliver attaches the firm facing triage that already lives on the dossier
 *   -> attempts the atomic, idempotent debit of the fixed fee
 *   -> on a covered debit the dossier is delivered and the delivery billed, once
 *   -> on a dry wallet the dossier holds in the queue, the firm is alerted, and
 *      there is no partial state, no silent drop, and no re routing
 *
 * The SCPS number rides along as firm facing triage (W2). It is attached to the
 * delivered dossier so the partner can prioritize what they already received; it
 * never gated which dossiers deliver. Routing cause and triage are two different
 * things at two different times.
 */

export type DeliveryOutcome =
  | { status: 'delivered'; deliveryId: string; feeCents: number; balanceCents: number }
  | { status: 'held'; deliveryId: string; reason: 'insufficient-funds' | 'no-price'; feeCents: number | null; balanceCents: number }

export function createDeliveryService(deps: DeliveryDeps) {
  /** The idempotency anchor for a delivery's debit. Stable per delivery record. */
  const debitKey = (deliveryId: string) => `delivery-debit:${deliveryId}`

  /**
   * Deliver a routed dossier to its market's firm as a closing kit and settle
   * the fee. Idempotent per (dossier, firm): a held delivery is reused rather
   * than duplicated, and the debit cannot fire twice for the same delivery.
   */
  async function deliver(input: { dossierId: string; firmId: string }): Promise<DeliveryOutcome> {
    const dossier = await deps.dossiers.get(input.dossierId)
    if (!dossier) throw new Error(`dossier ${input.dossierId} not found`)

    // Reuse any existing delivery for this dossier and firm so a retry, whether
    // after a top up or a transient failure, does not create a second queue
    // entry or a second charge. The debit is anchored to this stable id.
    const existing = await deps.deliveries.findForDossierFirm(input.dossierId, input.firmId)
    const delivery: DeliveryRecord =
      existing ?? (await deps.deliveries.create({ dossierId: input.dossierId, firmId: input.firmId, status: 'held' }))

    const occurredAt = deps.clock.nowIso()
    const caseType = dossier.caseType as CaseTypeValue

    // The atomic boundary: the ledger debit and the delivery billed write commit
    // together or not at all. The debit is idempotent on the delivery id.
    const result = await deps.tx.run(async () => {
      const debit = await deps.wallet.debit({
        firmId: input.firmId,
        caseType,
        deliveryId: delivery.id,
        idempotencyKey: debitKey(delivery.id),
      })
      if (debit.debited) {
        await deps.deliveries.markDelivered(delivery.id, occurredAt)
        await deps.deliveries.markBilled(delivery.id)
      }
      return debit
    })

    if (result.debited) {
      // Emit the delivered event and audit only on the real, first charge
      // (result.created). A covered retry recognizes the existing charge and
      // returns delivered without emitting a second DossierDelivered. The debit
      // already emitted WalletDebited, gated the same way.
      if (result.created) {
        await deps.events.append({
          eventType: 'DossierDelivered',
          aggregateType: 'delivery',
          aggregateId: delivery.id,
          actor: 'system',
          occurredAt,
          payload: {
            dossierId: input.dossierId,
            firmId: input.firmId,
            caseType,
            feeCents: result.feeCents,
            scpsScore: dossier.evaluation.scpsScore,
            scpsVersion: dossier.evaluation.scpsVersion,
          },
        })
        await deps.audit.record({
          decisionType: 'delivery',
          reason: 'delivered',
          aggregateId: delivery.id,
          firmId: input.firmId,
          actor: 'system',
          details: { dossierId: input.dossierId, feeCents: result.feeCents },
          occurredAt,
        })
      }
      return { status: 'delivered', deliveryId: delivery.id, feeCents: result.feeCents, balanceCents: result.balanceCents }
    }

    // Wallet dry, or no price for this case type. Hold in the queue, alert the
    // firm to top up, and leave no partial state. The claimant status stays
    // received and pending firm contact. This is a commercial hold, never a
    // quality filter (Section 8).
    await deps.audit.record({
      decisionType: 'delivery',
      reason: 'held',
      aggregateId: delivery.id,
      firmId: input.firmId,
      actor: 'system',
      details: { dossierId: input.dossierId, reason: result.reason, feeCents: result.feeCents },
      occurredAt,
    })
    await deps.events.append({
      eventType: 'DeliveryHeld',
      aggregateType: 'delivery',
      aggregateId: delivery.id,
      actor: 'system',
      occurredAt,
      payload: { dossierId: input.dossierId, firmId: input.firmId, reason: result.reason },
    })
    await deps.events.append({
      eventType: 'LowBalanceAlerted',
      aggregateType: 'wallet',
      aggregateId: input.firmId,
      actor: 'system',
      occurredAt,
      payload: { requiredCents: result.feeCents, balanceCents: result.balanceCents, deliveryId: delivery.id },
    })
    return { status: 'held', deliveryId: delivery.id, reason: result.reason, feeCents: result.feeCents, balanceCents: result.balanceCents }
  }

  /**
   * Release a firm's held queue after a top up. Re runs deliver for each held
   * delivery; those the wallet can now cover settle, the rest stay held. Safe to
   * call repeatedly: reuse plus idempotent debit means no double charge.
   */
  async function releaseHeld(firmId: string): Promise<DeliveryOutcome[]> {
    const held = await deps.deliveries.listHeldByFirm(firmId)
    const settled: DeliveryOutcome[] = []
    for (const d of held) {
      settled.push(await deliver({ dossierId: d.dossierId, firmId }))
    }
    return settled
  }

  return { deliver, releaseHeld }
}

export type DeliveryService = ReturnType<typeof createDeliveryService>
