import { describe, it, expect } from 'vitest'
import { auditLedgerIntegrity, type AuditLedgerEntry, type AuditWallet, type AuditDelivery } from '@/lib/ops/ledgerAudit'

/**
 * The money path integrity audit. The ledger is the truth (Section 10). This
 * proves, on real data, that the truth held: sum matches snapshot, no double
 * charge, every billed delivery debited exactly once.
 */

const credit = (firmId: string, amountCents: number, key: string): AuditLedgerEntry => ({
  firmId, entryType: 'credit', reason: 'topup', amountCents, idempotencyKey: key, deliveryId: null,
})
const debit = (firmId: string, amountCents: number, key: string, deliveryId: string): AuditLedgerEntry => ({
  firmId, entryType: 'debit', reason: 'delivery-debit', amountCents, idempotencyKey: key, deliveryId,
})

describe('ledger integrity audit', () => {
  it('passes a clean firm: sum matches snapshot, one debit per billed delivery', () => {
    const entries = [credit('f1', 100_000, 'top1'), debit('f1', 45_000, 'del1_debit', 'del1')]
    const wallets: AuditWallet[] = [{ firmId: 'f1', balanceCents: 55_000 }]
    const deliveries: AuditDelivery[] = [{ deliveryId: 'del1', firmId: 'f1', billed: true }]
    const report = auditLedgerIntegrity({ entries, wallets, deliveries })
    expect(report.ok).toBe(true)
    expect(report.firms[0].inSync).toBe(true)
    expect(report.firms[0].ledgerSumCents).toBe(55_000)
  })

  it('flags a snapshot that drifts from the ledger sum', () => {
    const entries = [credit('f1', 100_000, 'top1'), debit('f1', 45_000, 'del1_debit', 'del1')]
    const wallets: AuditWallet[] = [{ firmId: 'f1', balanceCents: 60_000 }] // wrong
    const deliveries: AuditDelivery[] = [{ deliveryId: 'del1', firmId: 'f1', billed: true }]
    const report = auditLedgerIntegrity({ entries, wallets, deliveries })
    expect(report.ok).toBe(false)
    expect(report.firms[0].inSync).toBe(false)
  })

  it('flags a double charge: the same idempotency key on two entries', () => {
    const entries = [
      credit('f1', 100_000, 'top1'),
      debit('f1', 45_000, 'del1_debit', 'del1'),
      debit('f1', 45_000, 'del1_debit', 'del1'), // must be impossible under the unique index
    ]
    const wallets: AuditWallet[] = [{ firmId: 'f1', balanceCents: 10_000 }]
    const deliveries: AuditDelivery[] = [{ deliveryId: 'del1', firmId: 'f1', billed: true }]
    const report = auditLedgerIntegrity({ entries, wallets, deliveries })
    expect(report.ok).toBe(false)
    expect(report.firms[0].duplicateIdempotencyKeys).toContain('del1_debit')
    expect(report.totals.doubleCharges).toBe(1)
  })

  it('flags a billed delivery with no debit, and a debit with no billed delivery', () => {
    const entries = [credit('f1', 100_000, 'top1'), debit('f1', 45_000, 'delX_debit', 'delX')]
    const wallets: AuditWallet[] = [{ firmId: 'f1', balanceCents: 55_000 }]
    const deliveries: AuditDelivery[] = [
      { deliveryId: 'del1', firmId: 'f1', billed: true }, // billed, no debit
      { deliveryId: 'delX', firmId: 'f1', billed: false }, // debit points here but not billed
    ]
    const report = auditLedgerIntegrity({ entries, wallets, deliveries })
    expect(report.firms[0].billedWithoutDebit).toContain('del1')
    expect(report.firms[0].debitWithoutBilledDelivery).toContain('delX')
    expect(report.ok).toBe(false)
  })

  it('audits multiple firms independently and totals them', () => {
    const entries = [
      credit('f1', 100_000, 't1'), debit('f1', 45_000, 'd1', 'del1'),
      credit('f2', 50_000, 't2'),
    ]
    const wallets: AuditWallet[] = [
      { firmId: 'f1', balanceCents: 55_000 },
      { firmId: 'f2', balanceCents: 50_000 },
    ]
    const deliveries: AuditDelivery[] = [{ deliveryId: 'del1', firmId: 'f1', billed: true }]
    const report = auditLedgerIntegrity({ entries, wallets, deliveries })
    expect(report.ok).toBe(true)
    expect(report.totals.firms).toBe(2)
    expect(report.totals.firmsInSync).toBe(2)
  })
})
