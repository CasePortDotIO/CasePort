import { describe, it, expect } from 'vitest'
import { createWalletService } from '@/services/WalletService'
import { createGlassBoxService } from '@/services/GlassBoxService'
import { createWalletHarness, glassBoxDepsFrom } from '@/services/fakes/walletInMemory'

/**
 * Phase 2 checkpoint. A firm funds a wallet, the ledger and the snapshot agree,
 * top ups are idempotent, and the Glass Box serves only that firm's own data.
 * The ledger is the single source of truth (Section 10).
 */

describe('WalletService money in', () => {
  it('credits the ledger and the snapshot agrees with the authoritative balance', async () => {
    const harness = createWalletHarness()
    const wallet = createWalletService(harness)

    const res = await wallet.topUp({ firmId: 'firm_a', amountCents: 500000, idempotencyKey: 'evt_1', stripeRef: 'pi_1' })
    expect(res.credited).toBe(true)
    expect(res.balanceCents).toBe(500000)

    // Authoritative balance is the ledger sum.
    expect(await wallet.balance('firm_a')).toBe(500000)
    // Ledger and snapshot agree.
    const recon = await wallet.reconcile('firm_a')
    expect(recon.ledgerBalanceCents).toBe(500000)
    expect(recon.snapshotBalanceCents).toBe(500000)
    expect(recon.inSync).toBe(true)
    // One WalletFunded event emitted.
    expect(harness.log.filter((e) => e.eventType === 'WalletFunded')).toHaveLength(1)
  })

  it('is idempotent on the Stripe event id: firing the same event twice credits once', async () => {
    const harness = createWalletHarness()
    const wallet = createWalletService(harness)

    const first = await wallet.topUp({ firmId: 'firm_a', amountCents: 500000, idempotencyKey: 'evt_dup', stripeRef: 'pi_1' })
    const second = await wallet.topUp({ firmId: 'firm_a', amountCents: 500000, idempotencyKey: 'evt_dup', stripeRef: 'pi_1' })

    expect(first.credited).toBe(true)
    expect(second.credited).toBe(false)
    expect(await wallet.balance('firm_a')).toBe(500000)
    expect(harness.ledgerRows.filter((r) => r.firmId === 'firm_a')).toHaveLength(1)
    // No second WalletFunded on the replay.
    expect(harness.log.filter((e) => e.eventType === 'WalletFunded')).toHaveLength(1)
  })

  it('sums multiple distinct top ups and records a running balance per entry', async () => {
    const harness = createWalletHarness()
    const wallet = createWalletService(harness)
    await wallet.topUp({ firmId: 'firm_a', amountCents: 300000, idempotencyKey: 'e1' })
    await wallet.topUp({ firmId: 'firm_a', amountCents: 250000, idempotencyKey: 'e2' })
    expect(await wallet.balance('firm_a')).toBe(550000)
    expect(harness.ledgerRows.map((r) => r.balanceAfterCents)).toEqual([300000, 550000])
  })

  it('detects drift between the snapshot and the ledger', async () => {
    const harness = createWalletHarness()
    const wallet = createWalletService(harness)
    await wallet.topUp({ firmId: 'firm_a', amountCents: 500000, idempotencyKey: 'e1' })
    // Corrupt the snapshot to simulate drift.
    harness.snapshotRows.set('firm_a', { ...harness.snapshotRows.get('firm_a')!, balanceCents: 400000 })
    const recon = await wallet.reconcile('firm_a')
    expect(recon.inSync).toBe(false)
    expect(recon.driftCents).toBe(100000)
    // rebuildSnapshot heals it.
    await wallet.rebuildSnapshot('firm_a')
    expect((await wallet.reconcile('firm_a')).inSync).toBe(true)
  })

  it('rejects a non positive top up', async () => {
    const wallet = createWalletService(createWalletHarness())
    await expect(wallet.topUp({ firmId: 'firm_a', amountCents: 0, idempotencyKey: 'e0' })).rejects.toThrow()
  })
})

describe('Glass Box firm scoping', () => {
  it('serves only the requesting firm own wallet and ledger', async () => {
    const harness = createWalletHarness()
    const wallet = createWalletService(harness)
    const glass = createGlassBoxService(glassBoxDepsFrom(harness))

    await wallet.topUp({ firmId: 'firm_a', amountCents: 500000, idempotencyKey: 'a1', stripeRef: 'pi_a' })
    await wallet.topUp({ firmId: 'firm_b', amountCents: 999999, idempotencyKey: 'b1', stripeRef: 'pi_b' })

    const viewA = await glass.walletView('firm_a')
    expect(viewA.balanceCents).toBe(500000)
    expect(viewA.inSync).toBe(true)
    expect(viewA.entries).toHaveLength(1)
    // Firm A never sees Firm B data.
    expect(viewA.entries.every((e) => e.firmId === 'firm_a')).toBe(true)
    expect(viewA.entries.some((e) => e.firmId === 'firm_b')).toBe(false)

    const viewB = await glass.walletView('firm_b')
    expect(viewB.balanceCents).toBe(999999)
    expect(viewB.entries.every((e) => e.firmId === 'firm_b')).toBe(true)
  })

  it('serves proof of reality as representative activity, never a volume guarantee', async () => {
    const harness = createWalletHarness()
    const glass = createGlassBoxService(
      glassBoxDepsFrom(harness, {
        recentMarketActivity: async (marketId) => [
          { reference: 'CP-REDACTED-1', caseType: 'motor-vehicle-accident', market: marketId, receivedAt: '2026-07-01T00:00:00.000Z', status: 'received' },
        ],
      }),
    )
    const feed = await glass.proofOfRealityFeed('firm_a')
    expect(feed.market).toBe('mkt_atlanta')
    expect(feed.framing.toLowerCase()).toContain('representative')
    expect(feed.framing.toLowerCase()).toContain('not a volume guarantee')
    // Redacted: no PII, no evaluative field on the items.
    for (const item of feed.items) {
      expect(item).not.toHaveProperty('claimantName')
      expect(item).not.toHaveProperty('scpsScore')
    }
  })

  it('serves an honest, clearly labeled sample dossier', async () => {
    const glass = createGlassBoxService(glassBoxDepsFrom(createWalletHarness()))
    const sample = glass.sampleDossier()
    expect(sample.note.toLowerCase()).toContain('sample')
    expect(sample.evaluation.scpsVersion).toBe('v1')
  })
})
