import type { Payload } from 'payload'
import type { CaseTypeValue } from '@/lib/domain/constants'
import { payloadEventStoreFor } from './payloadEvents'
import { reqOf, type TxContext } from './txContext'
import type {
  FirmRepository,
  LedgerRepository,
  StoredLedgerEntry,
  WalletDeps,
  WalletSnapshot,
  WalletSnapshotRepository,
} from '../walletPorts'
import {
  buildOpportunityDetail,
  type GlassBoxDeps,
  type GlassBoxReadPort,
  type RedactedActivity,
  type FirmDeliveryView,
  type OpportunityDetail,
} from '../GlassBoxService'

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

function payloadLedgerRepository(payload: Payload, txCtx?: TxContext): LedgerRepository {
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
          ...reqOf(txCtx),
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

function payloadSnapshotRepository(payload: Payload, txCtx?: TxContext): WalletSnapshotRepository {
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
        version: Number(doc.version ?? 0),
        lastRebuiltAt: String(doc.lastRebuiltAt ?? ''),
      }
    },
    async compareAndSwap({ firmId, expectedVersion, newBalanceCents, lowBalanceThresholdCents, at }) {
      // The swap: a version filtered update. MongoDB executes it as an atomic
      // per document update, so two concurrent swaps at the same version cannot
      // both match. The one that loses gets zero updated docs and retries.
      const updated = await payload.update({
        collection: 'wallets',
        where: { and: [{ firm: { equals: firmId } }, { version: { equals: expectedVersion } }] },
        data: {
          balanceCents: newBalanceCents,
          lowBalanceThresholdCents,
          version: expectedVersion + 1,
          lastRebuiltAt: at,
        } as never,
        ...reqOf(txCtx),
      })
      const doc = (updated as { docs?: unknown[] }).docs?.[0] as Record<string, unknown> | undefined
      if (doc) {
        return {
          ok: true,
          snapshot: {
            firmId,
            balanceCents: Number(doc.balanceCents ?? newBalanceCents),
            lowBalanceThresholdCents: Number(doc.lowBalanceThresholdCents ?? lowBalanceThresholdCents),
            version: Number(doc.version ?? expectedVersion + 1),
            lastRebuiltAt: String(doc.lastRebuiltAt ?? at),
          },
        }
      }
      // No row at that version. Either the wallet does not exist yet (create it
      // at version 1 when the caller expected 0) or a concurrent swap moved it on.
      if (expectedVersion === 0) {
        try {
          const created = await payload.create({
            collection: 'wallets',
            data: { firm: firmId, balanceCents: newBalanceCents, lowBalanceThresholdCents, version: 1, lastRebuiltAt: at },
            ...reqOf(txCtx),
          })
          const c = created as unknown as Record<string, unknown>
          return {
            ok: true,
            snapshot: { firmId, balanceCents: Number(c.balanceCents ?? newBalanceCents), lowBalanceThresholdCents, version: 1, lastRebuiltAt: at },
          }
        } catch {
          // Unique firm index rejected a concurrent create. Lost the race, retry.
          return { ok: false, snapshot: null }
        }
      }
      return { ok: false, snapshot: null }
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
        version: snapshot.version,
        lastRebuiltAt: snapshot.lastRebuiltAt,
      }
      if (existing.docs[0]) {
        await payload.update({ collection: 'wallets', id: (existing.docs[0] as { id: string | number }).id, data, ...reqOf(txCtx) })
      } else {
        await payload.create({ collection: 'wallets', data, ...reqOf(txCtx) })
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
    async opportunityForFirm(firmId, deliveryId): Promise<OpportunityDetail | null> {
      const relId = (v: unknown) => (v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v))
      const delivery = (await payload.findByID({ collection: 'deliveries', id: deliveryId, depth: 0 }).catch(() => null)) as Record<
        string,
        unknown
      > | null
      if (!delivery) return null
      const dossier = (await payload
        .findByID({ collection: 'dossiers', id: relId(delivery.dossier), depth: 0 })
        .catch(() => null)) as Record<string, unknown> | null
      const evaluation = (dossier?.evaluation ?? {}) as Record<string, unknown>
      const claimant = dossier?.claimant
        ? ((await payload.findByID({ collection: 'claimants', id: relId(dossier.claimant), depth: 0 }).catch(() => null)) as Record<
            string,
            unknown
          > | null)
        : null

      // Categorized evidence, assembled from the intake event log. Photos and
      // documents each carry a kind and a viewable media URL. The event payload
      // holds the media key, never the bytes (Section 4, W5).
      const photos: Array<{ kind: string; url: string }> = []
      const documents: Array<{ kind: string; url: string }> = []
      const sessionId = dossier ? relId(dossier.intakeSession) : ''
      if (sessionId) {
        const evers = await payload
          .find({
            collection: 'events',
            where: {
              and: [
                { intakeSession: { equals: sessionId } },
                { eventType: { in: ['PhotoUploaded', 'DocumentParsed'] } },
              ],
            },
            sort: 'occurredAt',
            limit: 100,
            depth: 0,
          })
          .catch(() => null)
        for (const ev of evers?.docs ?? []) {
          const row = ev as unknown as Record<string, unknown>
          const p = (row.payload ?? {}) as { mediaKey?: unknown; kind?: unknown }
          const url = typeof p.mediaKey === 'string' ? p.mediaKey : ''
          const kind = typeof p.kind === 'string' ? p.kind : 'other'
          if (!url) continue
          if (row.eventType === 'PhotoUploaded') photos.push({ kind, url })
          else documents.push({ kind, url })
        }
      }

      // The firm scoping and mapping live in the pure builder, unit tested.
      return buildOpportunityDetail({
        evidence: { photos, documents },
        firmId,
        delivery: {
          id: String(delivery.id),
          firmId: relId(delivery.firm),
          dossierId: relId(delivery.dossier),
          deliveredAt: (delivery.deliveredAt as string) ?? null,
          firmRespondedAt: (delivery.firmRespondedAt as string) ?? null,
          slaBreached: Boolean(delivery.slaBreached),
        },
        dossier: dossier
          ? {
              market: relId(dossier.market),
              caseType: String(dossier.caseType ?? 'unknown'),
              plainLanguageSummary: String(dossier.plainLanguageSummary ?? ''),
              statuteOfLimitationsDate: (dossier.statuteOfLimitationsDate as string) ?? null,
              evaluation: {
                scpsScore: Number(evaluation.scpsScore ?? 0),
                scpsVersion: String(evaluation.scpsVersion ?? 'v1'),
                qualificationTier: String(evaluation.qualificationTier ?? 'D'),
                injurySeverity: String(evaluation.injurySeverity ?? ''),
                liabilityAssessment: String(evaluation.liabilityAssessment ?? ''),
                statuteStatus: String(evaluation.statuteStatus ?? ''),
                qualificationBreakdown: Array.isArray(evaluation.qualificationBreakdown)
                  ? (evaluation.qualificationBreakdown as Array<{ layer: string; score: number; max?: number }>)
                  : [],
              },
            }
          : null,
        claimant: claimant
          ? {
              firstName: (claimant.firstName as string) ?? '',
              lastName: (claimant.lastName as string) ?? '',
              phone: (claimant.phone as string) ?? null,
              email: (claimant.email as string) ?? null,
              location: String(claimant.marketZip ?? ''),
            }
          : null,
      })
    },
  }
}

export function createPayloadWalletDeps(payload: Payload, txCtx?: TxContext): WalletDeps {
  let n = 0
  const next = (p: string) => `${p}_${(n += 1).toString(36)}`
  return {
    events: payloadEventStoreFor(payload, txCtx),
    ledger: payloadLedgerRepository(payload, txCtx),
    snapshots: payloadSnapshotRepository(payload, txCtx),
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
