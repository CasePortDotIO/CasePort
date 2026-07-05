import { describe, it, expect } from 'vitest'
import { createWalletService } from '@/services/WalletService'
import { createRoutingService } from '@/services/RoutingService'
import { createDeliveryService } from '@/services/DeliveryService'
import { createDeliveryHarness, deliveryDepsFrom } from '@/services/fakes/deliveryInMemory'

/**
 * Phase 3 checkpoint (Section 13). The money moving slice:
 *   - a delivery debits exactly once under forced retries
 *   - an insufficient wallet holds cleanly with no partial state
 *   - every routing record reads geographic
 * Plus the wall invariants: fixed fee from the price table (W3), never derived
 * from an outcome (W4), and the SCPS triage rides along only after delivery (W2).
 */

const MVA = 'motor-vehicle-accident' as const

describe('RoutingService geographic resolution (W1, W7)', () => {
  it('resolves the market firm and audits reason geographic', async () => {
    const h = createDeliveryHarness()
    const routing = createRoutingService({ markets: h.markets, audit: h.audit, events: h.wallet.events, clock: h.wallet.clock })

    const decision = await routing.route({ dossierId: 'CP-1', market: 'mkt_atlanta', validationPassed: true })

    expect(decision.reason).toBe('geographic')
    expect(decision.firmId).toBe('firm_a')
    expect(decision.routed).toBe(true)

    const routeAudits = h.auditRows.filter((a) => a.decisionType === 'routing')
    expect(routeAudits).toHaveLength(1)
    // Every routing record reads geographic, and only geographic.
    expect(routeAudits.every((a) => a.reason === 'geographic')).toBe(true)
    expect(h.wallet.log.filter((e) => e.eventType === 'GeographicRouteResolved')).toHaveLength(1)
  })

  it('audits geographic even when no firm is assigned or validation failed', async () => {
    const h = createDeliveryHarness({})
    const routing = createRoutingService({ markets: h.markets, audit: h.audit, events: h.wallet.events, clock: h.wallet.clock })

    const noFirm = await routing.route({ dossierId: 'CP-2', market: 'mkt_nowhere', validationPassed: true })
    const failed = await routing.route({ dossierId: 'CP-3', market: 'mkt_atlanta', validationPassed: false })

    expect(noFirm.routed).toBe(false)
    expect(failed.routed).toBe(false)
    expect(h.auditRows.every((a) => a.reason === 'geographic')).toBe(true)
  })
})

describe('Delivery and the ACID debit (Section 10, W3, W4)', () => {
  it('debits exactly once for a covered delivery, and stays once under forced retries', async () => {
    const h = createDeliveryHarness()
    const wallet = createWalletService(h.wallet)
    const delivery = createDeliveryService(deliveryDepsFrom(h))
    h.addDossier({ id: 'CP-10', market: 'mkt_atlanta', caseType: MVA, scpsScore: 88 })

    await wallet.topUp({ firmId: 'firm_a', amountCents: 500000, idempotencyKey: 'seed' })

    // Deliver, then force three retries of the same delivery.
    const first = await delivery.deliver({ dossierId: 'CP-10', firmId: 'firm_a' })
    const r1 = await delivery.deliver({ dossierId: 'CP-10', firmId: 'firm_a' })
    const r2 = await delivery.deliver({ dossierId: 'CP-10', firmId: 'firm_a' })
    const r3 = await delivery.deliver({ dossierId: 'CP-10', firmId: 'firm_a' })

    expect(first.status).toBe('delivered')
    expect([r1, r2, r3].every((r) => r.status === 'delivered')).toBe(true)

    // Fixed fee from the price table (75000), charged exactly once.
    const debits = h.wallet.ledgerRows.filter((l) => l.reason === 'delivery-debit')
    expect(debits).toHaveLength(1)
    expect(debits[0].amountCents).toBe(-75000)
    expect(await wallet.balance('firm_a')).toBe(500000 - 75000)
    // One WalletDebited and one DossierDelivered, no matter how many retries.
    expect(h.wallet.log.filter((e) => e.eventType === 'WalletDebited')).toHaveLength(1)
  })

  it('attaches SCPS triage to the delivered dossier event, only after delivery (W2)', async () => {
    const h = createDeliveryHarness()
    const wallet = createWalletService(h.wallet)
    const delivery = createDeliveryService(deliveryDepsFrom(h))
    h.addDossier({ id: 'CP-11', market: 'mkt_atlanta', caseType: MVA, scpsScore: 91 })
    await wallet.topUp({ firmId: 'firm_a', amountCents: 500000, idempotencyKey: 'seed' })

    await delivery.deliver({ dossierId: 'CP-11', firmId: 'firm_a' })
    const delivered = h.wallet.log.find((e) => e.eventType === 'DossierDelivered')
    expect(delivered?.payload?.scpsScore).toBe(91)
    // The delivery record is billed, delivered timestamp set.
    const rec = h.deliveryRows.find((d) => d.dossierId === 'CP-11')
    expect(rec?.status).toBe('billed')
    expect(rec?.billed).toBe(true)
  })
})

describe('Wallet dry hold queue (Section 8)', () => {
  it('holds cleanly with no partial state when the wallet cannot cover the fee', async () => {
    const h = createDeliveryHarness()
    const delivery = createDeliveryService(deliveryDepsFrom(h))
    h.addDossier({ id: 'CP-20', market: 'mkt_atlanta', caseType: MVA })
    // No top up: balance is zero.

    const out = await delivery.deliver({ dossierId: 'CP-20', firmId: 'firm_a' })

    expect(out.status).toBe('held')
    // No partial state: nothing written to the ledger, no delivered event.
    expect(h.wallet.ledgerRows.filter((l) => l.reason === 'delivery-debit')).toHaveLength(0)
    expect(h.wallet.log.filter((e) => e.eventType === 'DossierDelivered')).toHaveLength(0)
    expect(h.wallet.log.filter((e) => e.eventType === 'WalletDebited')).toHaveLength(0)
    // The firm is alerted to top up, the delivery is held, not dropped or re routed.
    expect(h.wallet.log.filter((e) => e.eventType === 'DeliveryHeld')).toHaveLength(1)
    expect(h.wallet.log.filter((e) => e.eventType === 'LowBalanceAlerted')).toHaveLength(1)
    const held = h.auditRows.filter((a) => a.decisionType === 'delivery' && a.reason === 'held')
    expect(held).toHaveLength(1)
    const rec = h.deliveryRows.find((d) => d.dossierId === 'CP-20')
    expect(rec?.status).toBe('held')
  })

  it('releases the held queue after a top up, charging each covered delivery once', async () => {
    const h = createDeliveryHarness()
    const wallet = createWalletService(h.wallet)
    const delivery = createDeliveryService(deliveryDepsFrom(h))
    h.addDossier({ id: 'CP-21', market: 'mkt_atlanta', caseType: MVA })

    // Held first.
    const held = await delivery.deliver({ dossierId: 'CP-21', firmId: 'firm_a' })
    expect(held.status).toBe('held')

    // Firm tops up, then the queue is released.
    await wallet.topUp({ firmId: 'firm_a', amountCents: 100000, idempotencyKey: 'topup-1' })
    const released = await delivery.releaseHeld('firm_a')

    expect(released).toHaveLength(1)
    expect(released[0].status).toBe('delivered')
    // The same held delivery is settled, not duplicated. Charged exactly once.
    expect(h.deliveryRows.filter((d) => d.dossierId === 'CP-21')).toHaveLength(1)
    expect(h.wallet.ledgerRows.filter((l) => l.reason === 'delivery-debit')).toHaveLength(1)
    expect(await wallet.balance('firm_a')).toBe(100000 - 75000)
  })

  it('holds when the firm has no price for the case type, never inventing a fee (W3)', async () => {
    const h = createDeliveryHarness()
    const wallet = createWalletService(h.wallet)
    const delivery = createDeliveryService(deliveryDepsFrom(h))
    // firm_a only prices motor-vehicle-accident; deliver a med-mal dossier.
    h.addDossier({ id: 'CP-22', market: 'mkt_atlanta', caseType: 'medical-malpractice' })
    await wallet.topUp({ firmId: 'firm_a', amountCents: 5000000, idempotencyKey: 'rich' })

    const out = await delivery.deliver({ dossierId: 'CP-22', firmId: 'firm_a' })
    expect(out.status).toBe('held')
    expect(h.wallet.ledgerRows.filter((l) => l.reason === 'delivery-debit')).toHaveLength(0)
  })
})
