import type { Payload } from 'payload'
import type { CaseTypeValue } from '@/lib/domain/constants'
import { payloadEventStoreFor } from './payloadEvents'
import type {
  FirmRepository,
  LedgerRepository,
  StoredLedgerEntry,
  WalletDeps,
  WalletSnapshot,
  WalletSnapshotRepository,
} from '../walletPorts'
import type { GlassBoxDeps, GlassBoxReadPort, RedactedActivity, FirmDeliveryView } from '../GlassBoxService'

/**
 * Payload adapters for the wallet and Glass Box ports. The ledger is authoritative;
 * the wallet snapshot is a rebuildable cache. append is idempotent on the unique
 * idempotencyKey index, so the same Stripe event credits exactly once.
 */

function toLedgerEntry(doc: Record<string, unknown>): StoredLedgerEntry {
  const relId = (v: unknown) =>
    v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v)
  return {
    id: String(doc.id),
    firmId: relId(doc.firm),
    entryType: doc.entryType as StoredLedgerEntry['entryType'],
    reason: doc.reason as StoredLedgerEntry['reason'],
    amountCents: Number(doc.amountCents ?? 0),
    idempotencyKey: String(doc.idempotencyKey ?? ''),
    stripeRef: (doc.stripeRef as string) ?? undefined,
    deliveryId: doc.delivery ? relId(doc.delivery) : undefined,
    occurredAt: String(doc.occurredAt ?? ''),
    balanceAfterCents: Number(doc.balanceAfterCents ?? 0),
  }
}

function payloadLedgerRepository(payload: Payload): LedgerRepository {
  return {
    async append(entry, balanceAfterCents) {
      try {
        const created = await payload.create({
          collection: 'ledgerEntries',
          data: {
            firm: entry.firmId,
            entryType: entry.entryType,
            reason: entry.reason,
            amountCents: entry.amountCents,
            idempotencyKey: entry.idempotencyKey,
            stripeRef: entry.stripeRef,
            delivery: entry.deliveryId,
            balanceAfterCents,
            occurredAt: entry.occurredAt,
          },
        })
        return { created: true, entry: toLedgerEntry(created as never) }
      } catch (err) {
        // Unique idempotency key violation: this event already credited.
        const existing = await payload.find({
          collection: 'ledgerEntries',
          where: { idempotencyKey: { equals: entry.idempotencyKey } },
          limit: 1,
        })
        if (existing.docs[0]) return { created: false, entry: toLedgerEntry(existing.docs[0] as never) }
        throw err
      }
    },
    async listByFirm(firmId) {
      const res = await payload.find({
        collection: 'ledgerEntries',
        where: { firm: { equals: firmId } },
        sort: 'occurredAt',
        limit: 1000,
        depth: 0,
      })
      return res.docs.map((d) => toLedgerEntry(d as never))
    },
    async sumByFirm(firmId) {
      const res = await payload.find({
        collection: 'ledgerEntries',
        where: { firm: { equals: firmId } },
        limit: 10000,
        depth: 0,
      })
      return res.docs.reduce((s: number, d) => s + Number((d as { amountCents?: number }).amountCents ?? 0), 0)
    },
    async findByIdempotencyKey(idempotencyKey) {
      const res = await payload.find({
        collection: 'ledgerEntries',
        where: { idempotencyKey: { equals: idempotencyKey } },
        limit: 1,
        depth: 0,
      })
      return res.docs[0] ? toLedgerEntry(res.docs[0] as never) : null
    },
  }
}

function payloadSnapshotRepository(payload: Payload): WalletSnapshotRepository {
  return {
    async get(firmId) {
      const res = await payload.find({
        collection: 'wallets',
        where: { firm: { equals: firmId } },
        limit: 1,
        depth: 0,
      })
      const doc = res.docs[0] as unknown as Record<string, unknown> | undefined
      if (!doc) return null
      return {
        firmId,
        balanceCents: Number(doc.balanceCents ?? 0),
        lowBalanceThresholdCents: Number(doc.lowBalanceThresholdCents ?? 200000),
        lastRebuiltAt: String(doc.lastRebuiltAt ?? ''),
      }
    },
    async upsert(snapshot: WalletSnapshot) {
      const existing = await payload.find({
        collection: 'wallets',
        where: { firm: { equals: snapshot.firmId } },
        limit: 1,
      })
      const data = {
        firm: snapshot.firmId,
        balanceCents: snapshot.balanceCents,
        lowBalanceThresholdCents: snapshot.lowBalanceThresholdCents,
        lastRebuiltAt: snapshot.lastRebuiltAt,
      }
      if (existing.docs[0]) {
        await payload.update({ collection: 'wallets', id: (existing.docs[0] as { id: string | number }).id, data })
      } else {
        await payload.create({ collection: 'wallets', data })
      }
    },
  }
}

function payloadFirmRepository(payload: Payload): FirmRepository {
  return {
    async get(firmId) {
      try {
        const doc = (await payload.findByID({ collection: 'firms', id: firmId, depth: 0 })) as unknown as Record<string, unknown>
        if (!doc) return null
        const relId = (v: unknown) => (v == null ? null : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v))
        return {
          id: String(doc.id),
          name: String(doc.name ?? ''),
          marketId: relId(doc.assignedMarket),
          priceTable: ((doc.priceTable as { caseType: CaseTypeValue; feeCents: number }[]) ?? []).map((p) => ({
            caseType: p.caseType,
            feeCents: Number(p.feeCents),
          })),
        }
      } catch {
        return null
      }
    },
    async priceFor(firmId, caseType) {
      const firm = await this.get(firmId)
      return firm?.priceTable.find((p) => p.caseType === caseType)?.feeCents ?? null
    },
  }
}

/** Glass Box read port: redacted market activity and a firm's own deliveries. */
function payloadGlassBoxReadPort(payload: Payload): GlassBoxReadPort {
  return {
    async recentMarketActivity(marketId, limit): Promise<RedactedActivity[]> {
      const res = await payload.find({
        collection: 'dossiers',
        where: { market: { equals: marketId } },
        sort: '-receivedAt',
        limit,
        depth: 0,
      })
      return res.docs.map((d) => {
        const doc = d as unknown as Record<string, unknown>
        // Redacted: reference, case type, market, received time, status only.
        return {
          reference: `CP-${String(doc.id).slice(-6).toUpperCase()}`,
          caseType: String(doc.caseType ?? 'unknown'),
          market: marketId,
          receivedAt: String(doc.receivedAt ?? ''),
          status: String(doc.status ?? 'received'),
        }
      })
    },
    async firmDeliveries(firmId): Promise<FirmDeliveryView[]> {
      const relId = (v: unknown) => (v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v))
      const res = await payload.find({
        collection: 'deliveries',
        where: { firm: { equals: firmId } },
        sort: '-deliveredAt',
        limit: 100,
        depth: 1, // populate the dossier so we can surface its case type
      })
      // Map the actual fee billed per delivery from the authoritative ledger.
      const debits = await payload.find({
        collection: 'ledgerEntries',
        where: { and: [{ firm: { equals: firmId } }, { reason: { equals: 'delivery-debit' } }] },
        limit: 1000,
        depth: 0,
      })
      const feeByDelivery = new Map<string, number>()
      for (const l of debits.docs) {
        const row = l as unknown as Record<string, unknown>
        feeByDelivery.set(relId(row.delivery), Math.abs(Number(row.amountCents ?? 0)))
      }
      return res.docs.map((d) => {
        const doc = d as unknown as Record<string, unknown>
        const dossier = (typeof doc.dossier === 'object' ? doc.dossier : null) as Record<string, unknown> | null
        return {
          deliveryId: String(doc.id),
          dossierId: relId(doc.dossier),
          caseType: String(dossier?.caseType ?? 'unknown'),
          deliveredAt: (doc.deliveredAt as string) ?? null,
          firmRespondedAt: (doc.firmRespondedAt as string) ?? null,
          responseTimeSeconds: (doc.responseTimeSeconds as number) ?? null,
          slaBreached: Boolean(doc.slaBreached),
          billedCents: feeByDelivery.get(String(doc.id)) ?? (doc.billed ? 0 : null),
        }
      })
    },
  }
}

export function createPayloadWalletDeps(payload: Payload): WalletDeps {
  let n = 0
  const next = (p: string) => `${p}_${(n += 1).toString(36)}`
  return {
    events: payloadEventStoreFor(payload),
    ledger: payloadLedgerRepository(payload),
    snapshots: payloadSnapshotRepository(payload),
    firms: payloadFirmRepository(payload),
    ids: {
      sessionId: () => next('sess'),
      claimantId: () => next('clm'),
      dossierId: () => next('CP'),
      eventId: () => next('evt'),
      submissionId: () => next('sub'),
    },
    clock: { nowIso: () => new Date().toISOString() },
  }
}

export function createPayloadGlassBoxDeps(payload: Payload): GlassBoxDeps {
  return {
    ledger: payloadLedgerRepository(payload),
    snapshots: payloadSnapshotRepository(payload),
    firms: payloadFirmRepository(payload),
    activity: payloadGlassBoxReadPort(payload),
  }
}
