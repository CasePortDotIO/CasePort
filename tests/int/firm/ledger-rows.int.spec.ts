import { describe, it, expect } from 'vitest'
import { toLedgerRows, dollars, type FirmLedgerEntry } from '@/firm/useFirmData'

/**
 * The wallet ledger mapping. The firm's wallet shows real ledger entries, so the
 * mapping from stored entries to display rows must be exactly right: newest
 * first, correct sign per entry type, and the running balance carried through.
 */

const entry = (over: Partial<FirmLedgerEntry>): FirmLedgerEntry => ({
  id: 'le',
  entryType: 'credit',
  reason: 'topup',
  amountCents: 100_000,
  occurredAt: '2026-07-01T00:00:00.000Z',
  balanceAfterCents: 100_000,
  ...over,
})

describe('wallet ledger row mapping', () => {
  it('orders newest first', () => {
    const rows = toLedgerRows([
      entry({ id: 'a', occurredAt: '2026-07-01T00:00:00.000Z' }),
      entry({ id: 'b', occurredAt: '2026-07-03T00:00:00.000Z' }),
      entry({ id: 'c', occurredAt: '2026-07-02T00:00:00.000Z' }),
    ])
    expect(rows.map((r) => r.occurredAt)).toEqual([
      '2026-07-03T00:00:00.000Z',
      '2026-07-02T00:00:00.000Z',
      '2026-07-01T00:00:00.000Z',
    ])
  })

  it('signs credits positive and debits negative regardless of stored sign', () => {
    const rows = toLedgerRows([
      entry({ entryType: 'credit', reason: 'topup', amountCents: 500_000 }),
      entry({ entryType: 'debit', reason: 'delivery-debit', amountCents: 45_000, occurredAt: '2026-06-30T00:00:00.000Z' }),
      entry({ entryType: 'debit', reason: 'delivery-debit', amountCents: -45_000, occurredAt: '2026-06-29T00:00:00.000Z' }),
    ])
    expect(rows[0].amountCents).toBe(500_000) // credit stays positive
    expect(rows[1].amountCents).toBe(-45_000) // positive-stored debit shows negative
    expect(rows[2].amountCents).toBe(-45_000) // negative-stored debit shows negative
  })

  it('labels each entry type and carries the running balance', () => {
    const rows = toLedgerRows([
      entry({ reason: 'topup', balanceAfterCents: 500_000 }),
      entry({ reason: 'delivery-debit', entryType: 'debit', amountCents: 45_000, balanceAfterCents: 455_000, occurredAt: '2026-06-30T00:00:00.000Z' }),
      entry({ reason: 'adjustment', entryType: 'debit', amountCents: 1_000, balanceAfterCents: 454_000, occurredAt: '2026-06-29T00:00:00.000Z' }),
    ])
    expect(rows.map((r) => r.type)).toEqual(['Top-Up', 'Delivery', 'Adjustment'])
    expect(rows.map((r) => r.balanceCents)).toEqual([500_000, 455_000, 454_000])
  })

  it('formats dollars from cents', () => {
    expect(dollars(500_000)).toBe('5,000.00')
    expect(dollars(45_000)).toBe('450.00')
    expect(dollars(null)).toBe('0.00')
  })
})
