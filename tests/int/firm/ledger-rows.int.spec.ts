import { describe, it, expect } from 'vitest'
import {
  toLedgerRows,
  toOpportunityRows,
  caseReference,
  relativeTime,
  dollars,
  type FirmLedgerEntry,
  type FirmDeliveryView,
} from '@/firm/useFirmData'

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

const delivery = (over: Partial<FirmDeliveryView>): FirmDeliveryView => ({
  deliveryId: 'del_1',
  dossierId: 'abc123def456',
  caseType: 'motor-vehicle-accident',
  deliveredAt: '2026-07-01T00:00:00.000Z',
  firmRespondedAt: null,
  responseTimeSeconds: null,
  slaBreached: false,
  billedCents: 45_000,
  ...over,
})

describe('opportunity row mapping (real deliveries, no fabricated numbers)', () => {
  it('maps case-type slug to label and derives a case reference', () => {
    const [row] = toOpportunityRows([delivery({})])
    expect(row.caseType).toBe('Motor Vehicle Accident')
    expect(row.id).toBe(caseReference('abc123def456'))
    expect(row.id).toBe('CP-DEF456')
    expect(row.feeCents).toBe(45_000)
  })

  it('derives status and SLA from response and breach, never invented', () => {
    const responded = toOpportunityRows([
      delivery({ firmRespondedAt: '2026-07-01T00:05:00.000Z', responseTimeSeconds: 300 }),
    ])[0]
    expect(responded.status).toBe('Contacted')
    expect(responded.sla).toBe('On time')
    expect(responded.responseTimeMin).toBe(5)

    const breached = toOpportunityRows([delivery({ slaBreached: true })])[0]
    expect(breached.status).toBe('Awaiting Response')
    expect(breached.sla).toBe('Overdue')
    expect(breached.responseTimeMin).toBeNull()

    const pending = toOpportunityRows([delivery({})])[0]
    expect(pending.sla).toBe('Pending')
  })

  it('orders newest delivered first', () => {
    const rows = toOpportunityRows([
      delivery({ deliveryId: 'a', deliveredAt: '2026-07-01T00:00:00.000Z' }),
      delivery({ deliveryId: 'b', deliveredAt: '2026-07-03T00:00:00.000Z' }),
      delivery({ deliveryId: 'c', deliveredAt: '2026-07-02T00:00:00.000Z' }),
    ])
    expect(rows.map((r) => r.deliveryId)).toEqual(['b', 'c', 'a'])
  })

  it('carries no fabricated case value or conversion probability', () => {
    const [row] = toOpportunityRows([delivery({})])
    expect(Object.keys(row)).not.toContain('value')
    expect(Object.keys(row)).not.toContain('conversionProbability')
  })
})

describe('relative time', () => {
  const now = Date.parse('2026-07-05T12:00:00.000Z')
  it('renders coarse, honest buckets', () => {
    expect(relativeTime('2026-07-05T11:58:00.000Z', now)).toBe('2 min ago')
    expect(relativeTime('2026-07-05T09:00:00.000Z', now)).toBe('3 hrs ago')
    expect(relativeTime('2026-07-01T12:00:00.000Z', now)).toBe('4 days ago')
    expect(relativeTime(null, now)).toBe('—')
  })
})
