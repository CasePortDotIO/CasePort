import type { CaseTypeValue } from '@/lib/domain/constants'
import type { WalletDeps, WalletSnapshot } from './walletPorts'

/** The outcome of a debit attempt. Never derived from a case outcome (W4). */
export type DebitResult =
  | { debited: true; reason: 'ok'; feeCents: number; balanceCents: number; created: boolean }
  | { debited: false; reason: 'insufficient-funds'; feeCents: number; balanceCents: number; created: false }
  | { debited: false; reason: 'no-price'; feeCents: null; balanceCents: number; created: false }

/**
 * WalletService. Section 4, Section 10. Life critical. Correctness beats every
 * other consideration here.
 *
 * The authoritative balance is the sum of ledger entries in the ledger, always.
 * The wallet snapshot is a derived cache, rebuildable at any time. Money in is a
 * Stripe top up that appends a credit ledger entry, keyed by an idempotency key
 * derived from the Stripe event id and protected by a unique index, so the same
 * event can never credit twice. Fees are never derived from an outcome (W3); the
 * debit path (Phase 3) reads the fixed fee from the firm price table.
 */
export function createWalletService(deps: WalletDeps) {
  const LOW_BALANCE_DEFAULT_CENTS = 200000

  /** The authoritative balance: the sum of ledger entries for the firm. */
  async function balance(firmId: string): Promise<number> {
    return deps.ledger.sumByFirm(firmId)
  }

  /** Rebuild the derived snapshot from the ledger. Self healing by design. */
  async function rebuildSnapshot(firmId: string): Promise<WalletSnapshot> {
    const balanceCents = await deps.ledger.sumByFirm(firmId)
    const existing = await deps.snapshots.get(firmId)
    const snapshot: WalletSnapshot = {
      firmId,
      balanceCents,
      lowBalanceThresholdCents: existing?.lowBalanceThresholdCents ?? LOW_BALANCE_DEFAULT_CENTS,
      lastRebuiltAt: deps.clock.nowIso(),
    }
    await deps.snapshots.upsert(snapshot)
    return snapshot
  }

  /**
   * Money in. A successful Stripe top up appends a credit ledger entry and
   * updates the snapshot. Idempotent on idempotencyKey: firing the same Stripe
   * event twice credits exactly once. Emits WalletFunded only on the first,
   * real credit. Returns the resulting authoritative balance.
   */
  async function topUp(input: {
    firmId: string
    amountCents: number
    idempotencyKey: string
    stripeRef?: string
  }): Promise<{ balanceCents: number; credited: boolean }> {
    if (input.amountCents <= 0) {
      throw new Error('top up amount must be positive')
    }

    const priorBalance = await deps.ledger.sumByFirm(input.firmId)
    const balanceAfterCents = priorBalance + input.amountCents

    const { created } = await deps.ledger.append(
      {
        firmId: input.firmId,
        entryType: 'credit',
        reason: 'topup',
        amountCents: input.amountCents,
        idempotencyKey: input.idempotencyKey,
        stripeRef: input.stripeRef,
        occurredAt: deps.clock.nowIso(),
      },
      balanceAfterCents,
    )

    const snapshot = await rebuildSnapshot(input.firmId)

    if (created) {
      await deps.events.append({
        eventType: 'WalletFunded',
        aggregateType: 'wallet',
        aggregateId: input.firmId,
        actor: 'stripe',
        occurredAt: deps.clock.nowIso(),
        payload: {
          amountCents: input.amountCents,
          stripeRef: input.stripeRef ?? null,
          balanceCents: snapshot.balanceCents,
        },
      })
    }

    return { balanceCents: snapshot.balanceCents, credited: created }
  }

  /**
   * The debit, on verified delivery (Section 10, W3, W4). Life critical.
   *
   * The fee is read from the firm's fixed price table by case type. It is never
   * derived from a case outcome (W3), and the debit fires on delivery regardless
   * of whether the case ever signs (W4). Idempotent on idempotencyKey (the
   * delivery id): a retry recognizes the existing charge and returns it rather
   * than charging again, so the same delivery can never debit twice. If the
   * balance cannot cover the fee, nothing is written and the caller holds the
   * delivery. There is no partial state.
   *
   * The atomic boundary that also marks the delivery billed is owned by the
   * caller (DeliveryService runs this and the delivery write inside one
   * transaction). The unique idempotency index is the ultimate guard: even
   * without a transaction the same delivery cannot charge twice.
   */
  async function debit(input: {
    firmId: string
    caseType: CaseTypeValue
    deliveryId: string
    idempotencyKey: string
  }): Promise<DebitResult> {
    // W3: fixed fee from the price table, keyed by case type. Never from an outcome.
    const feeCents = await deps.firms.priceFor(input.firmId, input.caseType)
    if (feeCents == null || feeCents <= 0) {
      const balanceCents = await deps.ledger.sumByFirm(input.firmId)
      return { debited: false, reason: 'no-price', feeCents: null, balanceCents, created: false }
    }

    // Replay guard: if this delivery already charged, return the original result
    // without touching the balance. This is what makes forced retries safe.
    const existing = await deps.ledger.findByIdempotencyKey(input.idempotencyKey)
    if (existing) {
      const balanceCents = await deps.ledger.sumByFirm(input.firmId)
      return { debited: true, reason: 'ok', feeCents, balanceCents, created: false }
    }

    const priorBalance = await deps.ledger.sumByFirm(input.firmId)
    if (priorBalance < feeCents) {
      // Wallet dry: no ledger write, no partial state. The caller holds.
      return { debited: false, reason: 'insufficient-funds', feeCents, balanceCents: priorBalance, created: false }
    }

    const balanceAfterCents = priorBalance - feeCents
    const { created } = await deps.ledger.append(
      {
        firmId: input.firmId,
        entryType: 'debit',
        reason: 'delivery-debit',
        amountCents: -feeCents,
        idempotencyKey: input.idempotencyKey,
        deliveryId: input.deliveryId,
        occurredAt: deps.clock.nowIso(),
      },
      balanceAfterCents,
    )

    const snapshot = await rebuildSnapshot(input.firmId)

    if (created) {
      await deps.events.append({
        eventType: 'WalletDebited',
        aggregateType: 'wallet',
        aggregateId: input.firmId,
        actor: 'system',
        occurredAt: deps.clock.nowIso(),
        payload: {
          feeCents,
          deliveryId: input.deliveryId,
          caseType: input.caseType,
          balanceCents: snapshot.balanceCents,
        },
      })
    }

    return { debited: true, reason: 'ok', feeCents, balanceCents: snapshot.balanceCents, created }
  }

  /**
   * Reconciliation (Section 10). Compares the derived snapshot against the
   * authoritative ledger sum and reports any drift for human review. The ledger
   * and the snapshot must agree.
   */
  async function reconcile(firmId: string): Promise<{
    ledgerBalanceCents: number
    snapshotBalanceCents: number | null
    driftCents: number
    inSync: boolean
  }> {
    const ledgerBalanceCents = await deps.ledger.sumByFirm(firmId)
    const snapshot = await deps.snapshots.get(firmId)
    const snapshotBalanceCents = snapshot?.balanceCents ?? null
    const driftCents = snapshotBalanceCents == null ? ledgerBalanceCents : ledgerBalanceCents - snapshotBalanceCents
    return {
      ledgerBalanceCents,
      snapshotBalanceCents,
      driftCents,
      inSync: driftCents === 0,
    }
  }

  return { balance, rebuildSnapshot, topUp, debit, reconcile }
}

export type WalletService = ReturnType<typeof createWalletService>
