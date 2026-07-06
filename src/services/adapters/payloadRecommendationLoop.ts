import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import type {
  GradableRecommendation,
  RecommendationLoopDeps,
  RecommendationLoopIdGenerator,
  RecommendationOutcomeRecord,
  RecommendationOutcomeRepository,
  RecommendationReader,
} from '../recommendationLoopPorts'
import type { IntelligenceDomain } from '@/lib/domain/intelligenceCore'

/**
 * Payload wiring for the CIC recommendation self scoring loop (Phase E). Reads
 * recommendations from their collection and persists measured outcomes to
 * recommendation-outcomes. No reasoning here, only storage and reads.
 */

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : v ? String(v) : '')

function payloadRecommendationReader(payload: Payload): RecommendationReader {
  return {
    async get(id) {
      try {
        const doc = await payload.findByID({ collection: 'recommendations', id })
        if (!doc) return null
        const d = doc as unknown as Record<string, unknown>
        return {
          id: String(d.id),
          domain: d.domain as GradableRecommendation['domain'],
          expectedValue: String(d.expectedValue ?? ''),
          status: d.status as GradableRecommendation['status'],
        }
      } catch {
        return null
      }
    },
  }
}

function payloadOutcomeRepository(payload: Payload): RecommendationOutcomeRepository {
  const toRow = (d: Record<string, unknown>): RecommendationOutcomeRecord => ({
    id: String(d.id),
    recommendationId: String(d.recommendationId ?? ''),
    domain: d.domain as IntelligenceDomain,
    predicted: String(d.predicted ?? ''),
    actualValue: Number(d.actualValue ?? 0),
    paidOff: Boolean(d.paidOff),
    note: (d.note as string) ?? undefined,
    measuredAt: iso(d.measuredAt),
  })
  return {
    async save(record) {
      await payload.create({
        collection: 'recommendation-outcomes',
        data: {
          recommendationId: record.recommendationId,
          domain: record.domain,
          predicted: record.predicted,
          actualValue: record.actualValue,
          paidOff: record.paidOff,
          note: record.note,
          measuredAt: record.measuredAt,
        } as never,
      })
    },
    async list() {
      const res = await payload.find({ collection: 'recommendation-outcomes', limit: 1000 })
      return (res.docs as unknown as Array<Record<string, unknown>>).map(toRow)
    },
    async listByDomain(domain) {
      const res = await payload.find({
        collection: 'recommendation-outcomes',
        where: { domain: { equals: domain } },
        limit: 1000,
      })
      return (res.docs as unknown as Array<Record<string, unknown>>).map(toRow)
    },
  }
}

const payloadLoopIds: RecommendationLoopIdGenerator = { outcomeId: () => '' }

export function createPayloadRecommendationLoopDeps(payload: Payload): RecommendationLoopDeps {
  return {
    recommendations: payloadRecommendationReader(payload),
    outcomes: payloadOutcomeRepository(payload),
    events: payloadEventStoreFor(payload),
    ids: payloadLoopIds,
    clock: { nowIso: () => new Date().toISOString() },
  }
}
