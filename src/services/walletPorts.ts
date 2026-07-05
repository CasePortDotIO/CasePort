import type { Clock, EventStore, IdGenerator } from './ports'
import type { CaseTypeValue } from '@/lib/domain/constants'

/**
 * Ports for the wallet system (Section 10). The wallet is life critical, so the
 * design puts correctness first: the ledger is the single source of truth, the
 * balance is always the sum of ledger entries, and the wallet snapshot is a
 * rebuildable cache. Idempotency is enforced by a unique key so a retry can
 * never double credit. Fees are never derived from an outcome (W3).
 */

export type LedgerEntryType = 'credit' | 'debit'
export type LedgerReason = 'topup' | 'delivery-debit' | 'adjustment'

/** An entry to append. amountCents is positive for a credit, negative for a debit. */
export interface LedgerEntryInput {
  firmId: string
  entryType: LedgerEntryType
  reason: LedgerReason
  amountCents: number
  idempotencyKey: string
  stripeRef?: string
  deliveryId?: string
  occurredAt: string
}

export interface StoredLedgerEntry extends LedgerEntryInput {
  id: string
  balanceAfterCents: number
}

/**
 * Append only, authoritative ledger. append is idempotent on idempotencyKey: a
 * second append with the same key does not write a second entry and reports
 * created false. The balance is always sumByFirm, never a mutable counter.
 */
export interface LedgerRepository {
  append(entry: LedgerEntryInput, balanceAfterCents: number): Promise<{
    created: boolean
    entry: StoredLedgerEntry
  }>
  listByFirm(firmId: string): Promise<StoredLedgerEntry[]>
  sumByFirm(firmId: string): Promise<number>
  /**
   * Look up an entry by its idempotency key. Lets the debit path recognize a
   * replay before it re-evaluates the balance, so a retry returns the original
   * charge instead of mistaking the already reduced balance for a new shortfall.
   */
  findByIdempotencyKey(idempotencyKey: string): Promise<StoredLedgerEntry | null>
}

export interface WalletSnapshot {
  firmId: string
  balanceCents: number
  lowBalanceThresholdCents: number
  /**
   * Optimistic concurrency version. Every guarded balance change bumps it. It is
   * what makes the snapshot the serialization point for concurrent debits: two
   * debits that read the same version race to compare-and-swap, exactly one
   * wins, the loser re-reads the now lower balance and holds. This is why a
   * wallet can never be overdrawn even under simultaneous deliveries.
   */
  version: number
  lastRebuiltAt: string
}

/**
 * The balance snapshot. The ledger stays the durable audit truth and the source
 * of truth for reconciliation, and the snapshot is rebuildable from it. But the
 * snapshot is not a passive cache: it is the atomically guarded balance of
 * record for the debit decision, updated by a single document compare-and-swap
 * so concurrent debits cannot both spend the same balance.
 */
export interface WalletSnapshotRepository {
  get(firmId: string): Promise<WalletSnapshot | null>
  /**
   * Compare and swap on version. Sets the balance and bumps the version only if
   * the stored version equals expectedVersion, or creates the snapshot at
   * version 1 when none exists and expectedVersion is 0. Returns ok false on a
   * version mismatch so the caller retries. In production this is a single
   * document conditional update, which MongoDB executes atomically without a
   * multi document transaction, so it is the overdraw guard on its own.
   */
  compareAndSwap(input: {
    firmId: string
    expectedVersion: number
    newBalanceCents: number
    lowBalanceThresholdCents: number
    at: string
  }): Promise<{ ok: boolean; snapshot: WalletSnapshot | null }>
  /** Unconditional heal from the ledger. Used only by rebuildSnapshot. */
  upsert(snapshot: WalletSnapshot): Promise<void>
}

export interface FirmRecord {
  id: string
  name: string
  marketId: string | null
  priceTable: Array<{ caseType: CaseTypeValue; feeCents: number }>
}

export interface FirmRepository {
  get(firmId: string): Promise<FirmRecord | null>
  /** Fixed fee lookup by case type. Never derived from an outcome (W3). */
  priceFor(firmId: string, caseType: CaseTypeValue): Promise<number | null>
}

/** The dependency set a WalletService instance is constructed with. */
export interface WalletDeps {
  events: EventStore
  ledger: LedgerRepository
  snapshots: WalletSnapshotRepository
  firms: FirmRepository
  ids: IdGenerator
  clock: Clock
}
