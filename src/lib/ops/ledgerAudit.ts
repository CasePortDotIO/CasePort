/**
 * Money path integrity audit, as a pure function. The ledger is the truth
 * (Section 10). This checks, on real data, that the truth held: every firm's
 * ledger sum matches its wallet snapshot, no idempotency key was ever used twice
 * (no double charge), and every billed delivery corresponds to exactly one debit.
 *
 * It reads billing only and writes nothing. It never derives a fee from an
 * outcome (W4) and never touches an evaluative field. Pure and deterministic, so
 * it is unit tested directly, and the endpoint is a thin data-gathering shell.
 */

export interface AuditLedgerEntry {
  firmId: string
  entryType: 'credit' | 'debit'
  reason: string
  amountCents: number
  idempotencyKey: string | null
  deliveryId: string | null
}

export interface AuditWallet {
  firmId: string
  balanceCents: number
}

export interface AuditDelivery {
  deliveryId: string
  firmId: string
  billed: boolean
}

export interface FirmAudit {
  firmId: string
  ledgerSumCents: number
  snapshotBalanceCents: number | null
  inSync: boolean
  /** Idempotency keys that appear on more than one ledger entry: a double charge. */
  duplicateIdempotencyKeys: string[]
  /** Deliveries marked billed with no matching debit entry: a missing charge. */
  billedWithoutDebit: string[]
  /** Debit entries whose delivery is not marked billed: a charge without a record. */
  debitWithoutBilledDelivery: string[]
  ok: boolean
}

export interface LedgerAuditReport {
  firms: FirmAudit[]
  totals: {
    firms: number
    firmsInSync: number
    doubleCharges: number
    billedWithoutDebit: number
    debitWithoutBilled: number
  }
  /** True only when every firm passes every invariant. */
  ok: boolean
}

export function auditLedgerIntegrity(input: {
  entries: AuditLedgerEntry[]
  wallets: AuditWallet[]
  deliveries: AuditDelivery[]
}): LedgerAuditReport {
  const snapshotByFirm = new Map(input.wallets.map((w) => [w.firmId, w.balanceCents]))
  const firmIds = new Set<string>([
    ...input.entries.map((e) => e.firmId),
    ...input.wallets.map((w) => w.firmId),
    ...input.deliveries.map((d) => d.firmId),
  ])

  const firms: FirmAudit[] = []
  for (const firmId of firmIds) {
    const entries = input.entries.filter((e) => e.firmId === firmId)
    const deliveries = input.deliveries.filter((d) => d.firmId === firmId)

    // Ledger sum is the authoritative balance: credits add, debits subtract,
    // regardless of the stored sign convention.
    const ledgerSumCents = entries.reduce(
      (s, e) => s + (e.entryType === 'credit' ? Math.abs(e.amountCents) : -Math.abs(e.amountCents)),
      0,
    )
    const snapshotBalanceCents = snapshotByFirm.get(firmId) ?? null
    const inSync = snapshotBalanceCents != null && snapshotBalanceCents === ledgerSumCents

    // A duplicate idempotency key is a double charge: the unique index should make
    // it impossible, so any duplicate here is a real integrity failure.
    const keyCounts = new Map<string, number>()
    for (const e of entries) {
      if (e.idempotencyKey) keyCounts.set(e.idempotencyKey, (keyCounts.get(e.idempotencyKey) ?? 0) + 1)
    }
    const duplicateIdempotencyKeys = [...keyCounts.entries()].filter(([, n]) => n > 1).map(([k]) => k)

    // Every billed delivery must have a debit, and every debit must point at a
    // billed delivery.
    const debitDeliveryIds = new Set(
      entries.filter((e) => e.entryType === 'debit' && e.deliveryId).map((e) => e.deliveryId as string),
    )
    const billedDeliveryIds = new Set(deliveries.filter((d) => d.billed).map((d) => d.deliveryId))
    const billedWithoutDebit = [...billedDeliveryIds].filter((id) => !debitDeliveryIds.has(id))
    const debitWithoutBilledDelivery = [...debitDeliveryIds].filter((id) => !billedDeliveryIds.has(id))

    const ok =
      inSync &&
      duplicateIdempotencyKeys.length === 0 &&
      billedWithoutDebit.length === 0 &&
      debitWithoutBilledDelivery.length === 0

    firms.push({
      firmId,
      ledgerSumCents,
      snapshotBalanceCents,
      inSync,
      duplicateIdempotencyKeys,
      billedWithoutDebit,
      debitWithoutBilledDelivery,
      ok,
    })
  }

  const totals = {
    firms: firms.length,
    firmsInSync: firms.filter((f) => f.inSync).length,
    doubleCharges: firms.reduce((s, f) => s + f.duplicateIdempotencyKeys.length, 0),
    billedWithoutDebit: firms.reduce((s, f) => s + f.billedWithoutDebit.length, 0),
    debitWithoutBilled: firms.reduce((s, f) => s + f.debitWithoutBilledDelivery.length, 0),
  }

  return { firms, totals, ok: firms.every((f) => f.ok) }
}
