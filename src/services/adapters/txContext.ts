import type { Payload } from 'payload'
import type { TransactionRunner } from '../deliveryPorts'

/**
 * A shared transaction context threaded through the Payload adapters that
 * participate in the wallet debit. When a transaction is open, `transactionID`
 * carries the Payload/Mongo session id; every operation that reads it commits
 * into the same transaction. When it is null (no open transaction, or a Mongo
 * without transaction support), the operations behave exactly as they did
 * before: unthreaded, non transactional.
 *
 * This is defense in depth. The debit's hard invariants do not depend on it: no
 * double charge is guaranteed by the unique index on ledgerEntries.idempotencyKey,
 * and no overdraw by the version filtered compare and swap on the wallet snapshot.
 * The transaction adds cross document atomicity (the ledger debit and the delivery
 * billed write commit together), so there is no transient window where one landed
 * without the other.
 */
export interface TxContext {
  transactionID: string | number | null
}

export function newTxContext(): TxContext {
  return { transactionID: null }
}

/** Spread into a Payload operation to enroll it in the open transaction, if any. */
export function reqOf(txCtx?: TxContext | null): { req: { transactionID: string | number } } | Record<string, never> {
  return txCtx?.transactionID != null ? { req: { transactionID: txCtx.transactionID } } : {}
}

/**
 * A transaction runner backed by Payload's Mongo transaction API. It begins a
 * transaction, threads its id through the shared context so the debit's writes
 * enroll in it, and commits, or rolls back on any error.
 *
 * Safe degradation: when the adapter does not support transactions (a Mongo
 * without a replica set, e.g. local dev), `beginTransaction` returns null and the
 * runner simply runs the function directly, exactly as the previous pass through
 * runner did. So enabling this can never behave worse than before; on a real
 * replica set (MongoDB Atlas) it becomes a true multi document transaction.
 */
export function payloadTransactionRunner(payload: Payload, txCtx: TxContext): TransactionRunner {
  return {
    async run(fn) {
      const db = payload.db as {
        beginTransaction?: () => Promise<string | number | null>
        commitTransaction?: (id: string | number) => Promise<void>
        rollbackTransaction?: (id: string | number) => Promise<void>
      }
      const id = (await db.beginTransaction?.()) ?? null
      if (id == null) return fn() // transactions unsupported: behave as before

      txCtx.transactionID = id
      try {
        const result = await fn()
        await db.commitTransaction?.(id)
        return result
      } catch (err) {
        await db.rollbackTransaction?.(id)
        throw err
      } finally {
        txCtx.transactionID = null
      }
    },
  }
}
