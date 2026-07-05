import type { EventStore, IdGenerator, StoredEvent } from '../ports'
import type {
  FirmRecord,
  FirmRepository,
  LedgerRepository,
  StoredLedgerEntry,
  WalletDeps,
  WalletSnapshot,
  WalletSnapshotRepository,
} from '../walletPorts'
import type { GlassBoxDeps, GlassBoxReadPort } from '../GlassBoxService'

/**
 * In memory fakes for the wallet and Glass Box ports. The ledger is a plain
 * array with a real unique idempotency key check, so idempotent top up behavior
 * is exercised exactly as the production unique index would enforce it. Nothing
 * here is used in production.
 */

export interface WalletHarness extends WalletDeps {
  log: StoredEvent[]
  ledgerRows: StoredLedgerEntry[]
  snapshotRows: Map<string, WalletSnapshot>
}

function sequentialIds(): IdGenerator {
  let n = 0
  const next = (p: string) => `${p}_${(n += 1)}`
  return {
    sessionId: () => next('sess'),
    claimantId: () => next('clm'),
    dossierId: () => next('CP'),
    eventId: () => next('evt'),
    submissionId: () => next('sub'),
  }
}

export function createWalletHarness(
  firms: FirmRecord[] = [
    { id: 'firm_a', name: 'Firm A', marketId: 'mkt_atlanta', priceTable: [{ caseType: 'motor-vehicle-accident', feeCents: 75000 }] },
    { id: 'firm_b', name: 'Firm B', marketId: 'mkt_baltimore', priceTable: [] },
  ],
): WalletHarness {
  const log: StoredEvent[] = []
  const ledgerRows: StoredLedgerEntry[] = []
  const snapshotRows = new Map<string, WalletSnapshot>()
  const ids = sequentialIds()

  const events: EventStore = {
    append: async (event) => {
      const stored: StoredEvent = { id: ids.eventId(), ...event }
      log.push(stored)
      return stored
    },
  }

  const ledger: LedgerRepository = {
    append: async (entry, balanceAfterCents) => {
      // Unique idempotency key: a duplicate is a no op, mirroring the DB index.
      const existing = ledgerRows.find((r) => r.idempotencyKey === entry.idempotencyKey)
      if (existing) return { created: false, entry: existing }
      const stored: StoredLedgerEntry = { id: `led_${ledgerRows.length + 1}`, balanceAfterCents, ...entry }
      ledgerRows.push(stored)
      return { created: true, entry: stored }
    },
    listByFirm: async (firmId) => ledgerRows.filter((r) => r.firmId === firmId),
    sumByFirm: async (firmId) =>
      ledgerRows.filter((r) => r.firmId === firmId).reduce((s, r) => s + r.amountCents, 0),
    findByIdempotencyKey: async (key) => ledgerRows.find((r) => r.idempotencyKey === key) ?? null,
  }

  const snapshots: WalletSnapshotRepository = {
    get: async (firmId) => snapshotRows.get(firmId) ?? null,
    // The body is synchronous, so it models the atomic single document CAS: two
    // concurrent debits interleave only at the awaits around this call, and only
    // one can match the version and swap. The other loses and retries.
    compareAndSwap: async ({ firmId, expectedVersion, newBalanceCents, lowBalanceThresholdCents, at }) => {
      const cur = snapshotRows.get(firmId)
      if (cur == null) {
        if (expectedVersion !== 0) return { ok: false, snapshot: null }
        const snap: WalletSnapshot = { firmId, balanceCents: newBalanceCents, lowBalanceThresholdCents, version: 1, lastRebuiltAt: at }
        snapshotRows.set(firmId, snap)
        return { ok: true, snapshot: snap }
      }
      if (cur.version !== expectedVersion) return { ok: false, snapshot: cur }
      const snap: WalletSnapshot = { ...cur, balanceCents: newBalanceCents, lowBalanceThresholdCents, version: cur.version + 1, lastRebuiltAt: at }
      snapshotRows.set(firmId, snap)
      return { ok: true, snapshot: snap }
    },
    upsert: async (snapshot) => {
      snapshotRows.set(snapshot.firmId, snapshot)
    },
  }

  const firmRepo: FirmRepository = {
    get: async (firmId) => firms.find((f) => f.id === firmId) ?? null,
    priceFor: async (firmId, caseType) => {
      const firm = firms.find((f) => f.id === firmId)
      return firm?.priceTable.find((p) => p.caseType === caseType)?.feeCents ?? null
    },
  }

  return {
    events,
    ledger,
    snapshots,
    firms: firmRepo,
    ids,
    clock: { nowIso: () => '2026-07-05T12:00:00.000Z' },
    log,
    ledgerRows,
    snapshotRows,
  }
}

/** Build Glass Box deps from a wallet harness plus a fake activity read port. */
export function glassBoxDepsFrom(
  harness: WalletHarness,
  activity: Partial<GlassBoxReadPort> = {},
): GlassBoxDeps {
  return {
    ledger: harness.ledger,
    snapshots: harness.snapshots,
    firms: harness.firms,
    activity: {
      recentMarketActivity: activity.recentMarketActivity ?? (async () => []),
      firmDeliveries: activity.firmDeliveries ?? (async () => []),
    },
  }
}
