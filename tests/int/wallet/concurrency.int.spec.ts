import { describe, it, expect } from 'vitest'
import { createWalletService } from '@/services/WalletService'
import { createDeliveryService } from '@/services/DeliveryService'
import { createWalletHarness } from '@/services/fakes/walletInMemory'
import { createDeliveryHarness, deliveryDepsFrom } from '@/services/fakes/deliveryInMemory'

/**
 * The wallet is life critical, so correctness under concurrency is proven, not
 * assumed. The overdraw guard is a compare-and-swap on the snapshot version: two
 * simultaneous debits that read the same balance cannot both spend it. Exactly
 * one reserves, the other re-reads the reduced balance and holds. A wallet can
 * never go negative, no matter how many deliveries land at once.
 */

const MVA = 'motor-vehicle-accident' as const

describe('Wallet concurrency: no overdraw (Section 10)', () => {
  it('two simultaneous debits, balance covers one: exactly one succeeds, wallet never negative', async () => {
    const h = createWalletHarness()
    const wallet = createWalletService(h)

    // Fund exactly one motor vehicle accident fee (75000).
    await wallet.topUp({ firmId: 'firm_a', amountCents: 75000, idempotencyKey: 'seed' })

    // Two different deliveries hit the same wallet at the same moment.
    const [a, b] = await Promise.all([
      wallet.debit({ firmId: 'firm_a', caseType: MVA, deliveryId: 'del_A', idempotencyKey: 'k_A' }),
      wallet.debit({ firmId: 'firm_a', caseType: MVA, deliveryId: 'del_B', idempotencyKey: 'k_B' }),
    ])

    const debited = [a, b].filter((r) => r.debited)
    const held = [a, b].filter((r) => !r.debited)
    expect(debited).toHaveLength(1)
    expect(held).toHaveLength(1)
    expect(held[0].reason).toBe('insufficient-funds')

    // Exactly one debit entry, wallet at zero, never negative.
    const balance = await wallet.balance('firm_a')
    expect(balance).toBe(0)
    expect(balance).toBeGreaterThanOrEqual(0)
    expect(h.ledgerRows.filter((r) => r.reason === 'delivery-debit')).toHaveLength(1)
    expect(h.log.filter((e) => e.eventType === 'WalletDebited')).toHaveLength(1)
  })

  it('ten simultaneous debits, balance covers three: exactly three succeed, wallet never negative', async () => {
    const h = createWalletHarness()
    const wallet = createWalletService(h)
    await wallet.topUp({ firmId: 'firm_a', amountCents: 3 * 75000, idempotencyKey: 'seed' })

    const attempts = Array.from({ length: 10 }, (_, i) =>
      wallet.debit({ firmId: 'firm_a', caseType: MVA, deliveryId: `del_${i}`, idempotencyKey: `k_${i}` }),
    )
    const results = await Promise.all(attempts)

    expect(results.filter((r) => r.debited)).toHaveLength(3)
    expect(results.filter((r) => !r.debited)).toHaveLength(7)
    const balance = await wallet.balance('firm_a')
    expect(balance).toBe(0)
    expect(balance).toBeGreaterThanOrEqual(0)
    expect(h.ledgerRows.filter((r) => r.reason === 'delivery-debit')).toHaveLength(3)
  })

  it('concurrent top up and debit: the credit is never lost to a racing debit', async () => {
    const h = createWalletHarness()
    const wallet = createWalletService(h)
    await wallet.topUp({ firmId: 'firm_a', amountCents: 75000, idempotencyKey: 'seed' })

    // A debit and a top up race. Whatever the interleaving, the ledger sum is
    // exact: start 75000, minus one 75000 debit, plus one 50000 credit = 50000.
    await Promise.all([
      wallet.debit({ firmId: 'firm_a', caseType: MVA, deliveryId: 'del_1', idempotencyKey: 'k_1' }),
      wallet.topUp({ firmId: 'firm_a', amountCents: 50000, idempotencyKey: 'topup_2' }),
    ])

    expect(await wallet.balance('firm_a')).toBe(50000)
    // The snapshot agrees with the ledger after the dust settles.
    const recon = await wallet.reconcile('firm_a')
    expect(recon.inSync).toBe(true)
  })

  it('full slice under concurrency: two deliveries, one fee funded, one delivers and one holds', async () => {
    const h = createDeliveryHarness()
    const wallet = createWalletService(h.wallet)
    const delivery = createDeliveryService(deliveryDepsFrom(h))
    h.addDossier({ id: 'CP-A', market: 'mkt_atlanta', caseType: MVA })
    h.addDossier({ id: 'CP-B', market: 'mkt_atlanta', caseType: MVA })
    await wallet.topUp({ firmId: 'firm_a', amountCents: 75000, idempotencyKey: 'seed' })

    const [a, b] = await Promise.all([
      delivery.deliver({ dossierId: 'CP-A', firmId: 'firm_a' }),
      delivery.deliver({ dossierId: 'CP-B', firmId: 'firm_a' }),
    ])

    const statuses = [a.status, b.status].sort()
    expect(statuses).toEqual(['delivered', 'held'])
    expect(await wallet.balance('firm_a')).toBe(0)
    expect(h.wallet.ledgerRows.filter((r) => r.reason === 'delivery-debit')).toHaveLength(1)
    expect(h.wallet.log.filter((e) => e.eventType === 'DossierDelivered')).toHaveLength(1)
    expect(h.wallet.log.filter((e) => e.eventType === 'DeliveryHeld')).toHaveLength(1)
  })
})
