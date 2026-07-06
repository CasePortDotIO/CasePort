import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import type {
  CicIdGenerator,
  IntelligenceCoreDeps,
  SignalRecord,
  SignalRecordInput,
  SignalStore,
  SourceRecord,
  SourceRegistryRepository,
} from '../intelligenceCorePorts'
import type {
  IntelligenceDomain,
  ReliabilityRating,
  SignalOrigin,
  SignalStatus,
  SourceStatus,
} from '@/lib/domain/intelligenceCore'

/**
 * Payload adapters for the CasePort Intelligence Core foundation (Phase A).
 * They back the source registry and the signal store with the
 * intelligence-sources and intelligence-signals collections. Payload assigns
 * the document ids, so the CIC id generator is only used by the in memory fake;
 * here `save` upserts by the document id carried on the record.
 */

const relId = (v: unknown) =>
  v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v)

const iso = (v: unknown): string => {
  if (!v) return ''
  if (v instanceof Date) return v.toISOString()
  return String(v)
}

function toSource(doc: Record<string, unknown>): SourceRecord {
  return {
    id: String(doc.id),
    sourceKey: String(doc.sourceKey ?? ''),
    name: String(doc.name ?? ''),
    origin: doc.origin as SignalOrigin,
    reliability: doc.reliability as ReliabilityRating,
    domains: (doc.domains as IntelligenceDomain[]) ?? [],
    status: doc.status as SourceStatus,
    addedBy: String(doc.addedBy ?? ''),
    notes: (doc.notes as string) ?? undefined,
    registeredAt: iso(doc.registeredAt),
    lastCheckedAt: doc.lastCheckedAt ? iso(doc.lastCheckedAt) : null,
  }
}

function payloadSourceRegistry(payload: Payload): SourceRegistryRepository {
  return {
    async getByKey(sourceKey) {
      const res = await payload.find({
        collection: 'intelligence-sources',
        where: { sourceKey: { equals: sourceKey } },
        limit: 1,
      })
      const doc = res.docs[0]
      return doc ? toSource(doc as never) : null
    },
    async get(id) {
      try {
        const doc = await payload.findByID({ collection: 'intelligence-sources', id })
        return doc ? toSource(doc as never) : null
      } catch {
        return null
      }
    },
    async save(record) {
      const data = {
        sourceKey: record.sourceKey,
        name: record.name,
        origin: record.origin,
        reliability: record.reliability,
        domains: record.domains,
        status: record.status,
        addedBy: record.addedBy,
        notes: record.notes,
        registeredAt: record.registeredAt,
        lastCheckedAt: record.lastCheckedAt ?? undefined,
      }
      const existing = await payload.find({
        collection: 'intelligence-sources',
        where: { sourceKey: { equals: record.sourceKey } },
        limit: 1,
      })
      if (existing.docs[0]) {
        await payload.update({ collection: 'intelligence-sources', id: String(existing.docs[0].id), data: data as never })
      } else {
        await payload.create({ collection: 'intelligence-sources', data: data as never })
      }
    },
    async touch(id, atIso) {
      await payload.update({ collection: 'intelligence-sources', id, data: { lastCheckedAt: atIso } as never })
    },
    async list() {
      const res = await payload.find({ collection: 'intelligence-sources', limit: 1000 })
      return res.docs.map((d) => toSource(d as never))
    },
  }
}

function toSignal(doc: Record<string, unknown>): SignalRecord {
  return {
    id: String(doc.id),
    sourceId: relId(doc.source),
    sourceKey: String(doc.sourceKey ?? ''),
    origin: doc.origin as SignalOrigin,
    reliability: doc.reliability as ReliabilityRating,
    domain: doc.domain as IntelligenceDomain,
    dedupKey: String(doc.dedupKey ?? ''),
    claim: String(doc.claim ?? ''),
    observedAt: iso(doc.observedAt),
    ingestedAt: iso(doc.ingestedAt),
    status: doc.status as SignalStatus,
    data: (doc.data as Record<string, unknown>) ?? undefined,
    attributionRef: (doc.attributionRef as string) ?? undefined,
    supersededById: doc.supersededBy ? relId(doc.supersededBy) : undefined,
    supersededAt: doc.supersededAt ? iso(doc.supersededAt) : undefined,
  }
}

function payloadSignalStore(payload: Payload): SignalStore {
  return {
    async append(input: SignalRecordInput) {
      const created = await payload.create({
        collection: 'intelligence-signals',
        data: {
          source: input.sourceId,
          sourceKey: input.sourceKey,
          origin: input.origin,
          reliability: input.reliability,
          domain: input.domain,
          dedupKey: input.dedupKey,
          claim: input.claim,
          observedAt: input.observedAt,
          ingestedAt: input.ingestedAt,
          status: input.status,
          data: input.data,
          attributionRef: input.attributionRef,
          supersededBy: input.supersededById,
          supersededAt: input.supersededAt,
        } as never,
      })
      return toSignal(created as never)
    },
    async get(id) {
      try {
        const doc = await payload.findByID({ collection: 'intelligence-signals', id })
        return doc ? toSignal(doc as never) : null
      } catch {
        return null
      }
    },
    async activeByDedupKey(dedupKey) {
      const res = await payload.find({
        collection: 'intelligence-signals',
        where: { and: [{ dedupKey: { equals: dedupKey } }, { status: { equals: 'active' } }] },
        limit: 1,
      })
      const doc = res.docs[0]
      return doc ? toSignal(doc as never) : null
    },
    async historyByDedupKey(dedupKey) {
      const res = await payload.find({
        collection: 'intelligence-signals',
        where: { dedupKey: { equals: dedupKey } },
        sort: 'observedAt',
        limit: 1000,
      })
      return res.docs.map((d) => toSignal(d as never))
    },
    async markSuperseded(id, bySignalId, atIso) {
      await payload.update({
        collection: 'intelligence-signals',
        id,
        data: { status: 'superseded', supersededBy: bySignalId, supersededAt: atIso } as never,
      })
    },
    async list() {
      const res = await payload.find({ collection: 'intelligence-signals', limit: 1000 })
      return res.docs.map((d) => toSignal(d as never))
    },
  }
}

/**
 * Payload assigns document ids, so these are never used to key a create. They
 * exist only to satisfy the CicIdGenerator port shape; the fake supplies real
 * generated ids for tests.
 */
const payloadCicIds: CicIdGenerator = {
  sourceId: () => '',
  signalId: () => '',
}

export function intelligenceCoreDepsForPayload(payload: Payload): IntelligenceCoreDeps {
  return {
    sources: payloadSourceRegistry(payload),
    signals: payloadSignalStore(payload),
    events: payloadEventStoreFor(payload),
    ids: payloadCicIds,
    clock: { nowIso: () => new Date().toISOString() },
  }
}
