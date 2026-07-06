# Money path: correctness model and Atlas verification

The wallet is life critical (CLAUDE.md Section 10). This documents exactly how its
correctness is guaranteed, what the tests prove, and the short list that must be
verified against a real MongoDB Atlas replica set before real money moves. Green
unit tests prove the *logic*; they cannot prove the *production database enforces
the two indexes the logic relies on*. That gap is closed here.

## The correctness model

Two hard invariants, each enforced at the database level, not by discipline:

1. **No double charge** — a unique index on `ledgerEntries.idempotencyKey`. A
   delivery debit is keyed `delivery-debit:<deliveryId>`. However many times
   Inngest retries the step, the second insert violates the unique index and the
   debit returns the original result. Proven in `concurrency.int.spec.ts` (6x
   sequential, 8x concurrent, 5x delivery-level: exactly one charge every time).

2. **No overdraw** — an optimistic compare-and-swap on the wallet snapshot
   `version`. A debit reads `{balance, version}`, and commits with a
   version-filtered update (`where: firm + version == expected`). MongoDB
   executes that update atomically per document, so two concurrent debits at the
   same version cannot both match; the loser re-reads and re-decides. Proven in
   `concurrency.int.spec.ts` (2 and 10 concurrent debits never overdraw).

Plus: **the ledger is the source of truth; the snapshot is a rebuildable cache.**
`wallet.balance` is the ledger sum. Any snapshot drift is not money and is healed
by the reconciliation job, which flags divergence for review rather than silently
correcting it.

## What the Payload transaction adds

`payloadTransactionRunner` (src/services/adapters/txContext.ts) wraps the debit in
a real Mongo multi-document transaction: the ledger debit, the snapshot swap, the
`WalletDebited` event, and the delivery `billed` write commit together or roll back
together. This is defense in depth on top of the two invariants above, removing the
transient window where one write landed without the other.

It degrades safely: when the adapter reports no transaction support (a Mongo
without a replica set, e.g. local dev), `beginTransaction` returns null and the
runner runs the debit directly, exactly as before. Enabling it can never behave
worse than the previous pass-through.

## Verify against Atlas before real money (the short list)

The unit tests use in-memory fakes that model the unique index and the atomic CAS.
Confirm the production database actually enforces them:

1. **Unique index exists.** After first deploy, confirm `ledgerEntries` has a
   unique index on `idempotencyKey` (Payload builds it from `unique: true`, but
   verify in Atlas: `db.ledgerEntries.getIndexes()`). This is the no-double-charge
   guarantee. If it is missing, the guarantee is not real.

2. **CAS is atomic.** Confirm Payload's `update({ where: version == n })` compiles
   to a single conditional update, not a read-then-write. Verify empirically: fire
   N concurrent debits against one funded-for-M wallet on Atlas and assert exactly
   M ledger debits and a non-negative balance (the same assertions as
   `concurrency.int.spec.ts`, run against the real DB).

3. **Transactions are available.** Confirm `payload.db.beginTransaction()` returns
   an id on Atlas (a replica set). If it returns null, the debit still runs
   (degraded) on the two invariants above, but the multi-document atomicity is not
   active.

4. **Reconciliation runs.** Confirm the `reconcile-wallets` Inngest cron is
   deployed and firing, so any snapshot drift is surfaced.

Until items 1 and 2 are confirmed on Atlas, treat the money path as unproven in
production regardless of the green unit suite.
