import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import type {
  ModelVersionRecord,
  ModelVersionRepository,
  PromotionDeps,
  PromotionIdGenerator,
  PromotionRecord,
  PromotionRepository,
} from '../promotionPorts'
import type { PromotionStatus, PromotionType } from '@/lib/domain/intelligenceCore'

/**
 * Payload wiring for the CIC promotion gates (Phase F). Persists promotions and
 * the versioned production values. No reasoning here, only storage; the human
 * gate and the guard live in PromotionService. Payload assigns ids.
 */

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : v ? String(v) : '')

function toPromotion(d: Record<string, unknown>): PromotionRecord {
  return {
    id: String(d.id),
    type: d.type as PromotionType,
    summary: String(d.summary ?? ''),
    proposedChange: (d.proposedChange as Record<string, unknown>) ?? {},
    evidence: (d.evidence as Record<string, unknown>) ?? {},
    proposedBy: String(d.proposedBy ?? ''),
    status: d.status as PromotionStatus,
    requiredApprovers: Number(d.requiredApprovers ?? 1),
    approvals: ((d.approvals as Array<Record<string, unknown>>) ?? []).map((a) => ({
      approver: String(a.approver ?? ''),
      at: iso(a.at),
    })),
    versionId: (d.versionId as string) ?? null,
    rejectionReason: (d.rejectionReason as string) ?? undefined,
    createdAt: iso(d.createdAt),
    decidedAt: d.decidedAt ? iso(d.decidedAt) : null,
  }
}

function payloadPromotionRepository(payload: Payload): PromotionRepository {
  const data = (r: PromotionRecord) => ({
    type: r.type,
    summary: r.summary,
    proposedChange: r.proposedChange,
    evidence: r.evidence,
    proposedBy: r.proposedBy,
    status: r.status,
    requiredApprovers: r.requiredApprovers,
    approvals: r.approvals,
    versionId: r.versionId ?? undefined,
    rejectionReason: r.rejectionReason,
    createdAt: r.createdAt,
    decidedAt: r.decidedAt ?? undefined,
  })
  return {
    async get(id) {
      try {
        const doc = await payload.findByID({ collection: 'promotions', id })
        return doc ? toPromotion(doc as unknown as Record<string, unknown>) : null
      } catch {
        return null
      }
    },
    async save(record) {
      const existing = record.id
        ? await payload.findByID({ collection: 'promotions', id: record.id }).catch(() => null)
        : null
      if (existing) await payload.update({ collection: 'promotions', id: record.id, data: data(record) as never })
      else await payload.create({ collection: 'promotions', data: data(record) as never })
    },
    async list() {
      const res = await payload.find({ collection: 'promotions', limit: 500, sort: '-createdAt' })
      return (res.docs as unknown as Array<Record<string, unknown>>).map(toPromotion)
    },
  }
}

function payloadVersionRepository(payload: Payload): ModelVersionRepository {
  return {
    async save(record: ModelVersionRecord) {
      await payload.create({
        collection: 'model-versions',
        data: {
          type: record.type,
          version: record.version,
          value: record.value,
          dataWindow: record.dataWindow,
          promotionId: record.promotionId,
          approvedBy: record.approvedBy,
          createdAt: record.createdAt,
        } as never,
      })
    },
    async latestVersion(type: PromotionType) {
      const res = await payload.count({ collection: 'model-versions', where: { type: { equals: type } } })
      return res.totalDocs
    },
    async list() {
      const res = await payload.find({ collection: 'model-versions', limit: 500, sort: '-createdAt' })
      return (res.docs as unknown as Array<Record<string, unknown>>).map((d) => ({
        id: String(d.id),
        type: d.type as PromotionType,
        version: String(d.version ?? ''),
        value: (d.value as Record<string, unknown>) ?? {},
        dataWindow: String(d.dataWindow ?? ''),
        promotionId: String(d.promotionId ?? ''),
        approvedBy: (d.approvedBy as string[]) ?? [],
        createdAt: iso(d.createdAt),
      }))
    },
  }
}

const payloadPromotionIds: PromotionIdGenerator = { promotionId: () => '', versionId: () => '' }

export function createPayloadPromotionDeps(payload: Payload): PromotionDeps {
  return {
    promotions: payloadPromotionRepository(payload),
    versions: payloadVersionRepository(payload),
    events: payloadEventStoreFor(payload),
    ids: payloadPromotionIds,
    clock: { nowIso: () => new Date().toISOString() },
  }
}
