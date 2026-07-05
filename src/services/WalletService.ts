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

  // How many times a guarded balance change re-reads and retries after losing a
  // compare-and-swap race before giving up. Contention past this is pathological.
  const MAX_CAS_ATTEMPTS = 16

  /**
   * Rebuild the snapshot from the ledger. Self healing by design: the ledger is
   * the durable truth, so this recomputes the balance and writes it
   * unconditionally, preserving the version so an in flight compare-and-swap is
   * not silently defeated. Also seeds the snapshot the first time it is touched.
   */
  async function rebuildSnapshot(firmId: string): Promise<WalletSnapshot> {
    const balanceCents = await deps.ledger.sumByFirm(firmId)
    const existing = await deps.snapshots.get(firmId)
    const snapshot: WalletSnapshot = {
      firmId,
      balanceCents,
      lowBalanceThresholdCents: existing?.lowBalanceThresholdCents ?? LOW_BALANCE_DEFAULT_CENTS,
      version: existing?.version ?? 0,
      lastRebuiltAt: deps.clock.nowIso(),
    }
    await deps.snapshots.upsert(snapshot)
    return snapshot
  }

  /** Ensure a snapshot exists so the compare-and-swap loop has a version to race on. */
  async function ensureSnapshot(firmId: string): Promise<WalletSnapshot> {
    return (await deps.snapshots.get(firmId)) ?? (await rebuildSnapshot(firmId))
  }

  /**
   * The single overdraw guard. decide sees the current authoritative balance and
   * returns either the new balance to commit or a reject. The commit is applied
   * with a compare-and-swap on the snapshot version, so two concurrent changes
   * that read the same version cannot both win: exactly one swaps, the loser
   * re-reads the updated balance and decides again. A reject writes nothing.
   */
  async function guardedBalanceChange(
    firmId: string,
    decide: (currentBalanceCents: number) => { commit: number } | { reject: true },
  ): Promise<{ committed: boolean; balanceCents: number }> {
    for (let attempt = 0; attempt < MAX_CAS_ATTEMPTS; attempt++) {
      const snap = await ensureSnapshot(firmId)
      const d = decide(snap.balanceCents)
      if ('reject' in d) return { committed: false, balanceCents: snap.balanceCents }
      const res = await deps.snapshots.compareAndSwap({
        firmId,
        expectedVersion: snap.version,
        newBalanceCents: d.commit,
        lowBalanceThresholdCents: snap.lowBalanceThresholdCents,
        at: deps.clock.nowIso(),
      })
      if (res.ok) return { committed: true, balanceCents: d.commit }
      // Lost the race. Re-read and decide again against the fresh balance.
    }
    throw new Error(`wallet ${firmId} snapshot contention exceeded retry budget`)
  }

  /**
   * Money in. A successful Stripe top up appends a credit ledger entry and moves
   * the snapshot by the credit amount under a compare-and-swap, so a concurrent
   * debit can never clobber it. Idempotent on idempotencyKey: firing the same
   * Stripe event twice credits exactly once, and a replay does not move the
   * balance again. Emits WalletFunded only on the first real credit.
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

    // Ensure the snapshot exists (and reflects any prior entries) before we read
    // a balance to move, so the first ever top up does not miss existing credits.
    await ensureSnapshot(input.firmId)

    const priorLedger = await deps.ledger.sumByFirm(input.firmId)
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
      priorLedger + input.amountCents,
    )

    if (!created) {
      // Replay: the credit already landed. Do not move the balance again.
      const snap = await ensureSnapshot(input.firmId)
      return { balanceCents: snap.balanceCents, credited: false }
    }

    // Apply the credit as a delta under the guard so a concurrent debit is not lost.
    const { balanceCents } = await guardedBalanceChange(input.firmId, (b) => ({ commit: b + input.amountCents }))

    await deps.events.append({
      eventType: 'WalletFunded',
      aggregateType: 'wallet',
      aggregateId: input.firmId,
      actor: 'stripe',
      occurredAt: deps.clock.nowIso(),
      payload: {
        amountCents: input.amountCents,
        stripeRef: input.stripeRef ?? null,
        balanceCents,
      },
    })

    return { balanceCents, credited: true }
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
   * Concurrency safety: the balance is reserved with a compare-and-swap on the
   * snapshot before the ledger entry is written, so two simultaneous debits can
   * never both spend the same balance. Exactly one reserves, the other re-reads
   * the reduced balance and holds. The reservation plus the ledger append are
   * run inside the caller's transaction (DeliveryService) so they commit
   * together; even without a transaction the atomic single document CAS prevents
   * overdraw, and the unique idempotency index prevents a double charge.
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
    // without reserving again. This is what makes forced retries safe.
    const existing = await deps.ledger.findByIdempotencyKey(input.idempotencyKey)
    if (existing) {
      const balanceCents = await deps.ledger.sumByFirm(input.firmId)
      return { debited: true, reason: 'ok', feeCents, balanceCents, created: false }
    }

    // Reserve the fee under the overdraw guard. A reject means the wallet cannot
    // cover it: nothing is written, no partial state, the caller holds.
    const reservation = await guardedBalanceChange(input.firmId, (b) =>
      b < feeCents ? { reject: true } : { commit: b - feeCents },
    )
    if (!reservation.committed) {
      return { debited: false, reason: 'insufficient-funds', feeCents, balanceCents: reservation.balanceCents, created: false }
    }

    // Record the reserved debit on the authoritative ledger. Idempotent on the key.
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
      reservation.balanceCents,
    )

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
          balanceCents: reservation.balanceCents,
        },
      })
    }

    return { debited: true, reason: 'ok', feeCents, balanceCents: reservation.balanceCents, created }
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
