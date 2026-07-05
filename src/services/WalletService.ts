import { notImplemented } from './notImplemented'

/**
 * WalletService. Section 4, Section 10. Life critical. Correctness beats every
 * other consideration.
 *
 * Money in is a Stripe top up that writes an append only credit ledger entry.
 * The debit runs a single MongoDB multi document ACID transaction on verified
 * DossierDelivered, keyed by an idempotency key derived from the delivery event
 * id and protected by a unique index, so a retry can never double charge. The
 * fee is a fixed lookup by case type and market, never derived from an outcome
 * (W3, W4). The authoritative balance is the sum of ledger entries; the wallet
 * snapshot is a cache.
 *
 * Phase 2 fills topUp and balance. Phase 3 fills debitForDelivery.
 */
export const WalletService = {
  topUp: (_firmId: string, _amountCents: number, _stripeRef: string): never =>
    notImplemented('WalletService', 'topUp', 'Phase 2'),
  balance: (_firmId: string): never =>
    notImplemented('WalletService', 'balance', 'Phase 2'),
  rebuildSnapshot: (_firmId: string): never =>
    notImplemented('WalletService', 'rebuildSnapshot', 'Phase 2'),
  debitForDelivery: (_deliveryEventId: string): never =>
    notImplemented('WalletService', 'debitForDelivery', 'Phase 3'),
}
