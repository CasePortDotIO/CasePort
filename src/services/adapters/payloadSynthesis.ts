import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import type {
  ArtifactRecord,
  ArtifactRepository,
  DomainSignalReader,
  DomainSynthesizer,
  RecommendationRecord,
  RecommendationRepository,
  SynthIdGenerator,
  SynthesisDeps,
} from '../synthesisPorts'
import type { IntelligenceDomain, ReliabilityRating } from '@/lib/domain/intelligenceCore'

/**
 * Payload wiring for CIC domain synthesis (Phase C). The signal reader queries
 * active signals by domain; the artifact and recommendation repositories persist
 * to their collections. The synthesizer is injected (a real Claude backed agent
 * in production, a fake in tests), so this adapter never contains reasoning, only
 * storage and reads.
 */

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : v ? String(v) : '')

function payloadSignalReader(payload: Payload): DomainSignalReader {
  return {
    async activeByDomain(domain) {
      const res = await payload.find({
        collection: 'intelligence-signals',
        where: { and: [{ domain: { equals: domain } }, { status: { equals: 'active' } }] },
        limit: 500,
        sort: '-observedAt',
      })
      return (res.docs as unknown as Array<Record<string, unknown>>).map((d) => ({
        id: String(d.id),
        claim: String(d.claim ?? ''),
        sourceKey: String(d.sourceKey ?? ''),
        reliability: d.reliability as ReliabilityRating,
        observedAt: iso(d.observedAt),
      }))
    },
  }
}

function payloadArtifactRepository(payload: Payload): ArtifactRepository {
  return {
    async save(record: ArtifactRecord) {
      await payload.create({
        collection: 'intelligence-artifacts',
        data: {
          domain: record.domain,
          title: record.title,
          summary: record.summary,
          findings: record.findings,
          generatedAt: record.generatedAt,
        } as never,
      })
    },
    async list(domain) {
      const res = await payload.find({
        collection: 'intelligence-artifacts',
        where: domain ? { domain: { equals: domain } } : undefined,
        limit: 200,
        sort: '-generatedAt',
      })
      return (res.docs as unknown as Array<Record<string, unknown>>).map((d) => ({
        id: String(d.id),
        domain: d.domain as IntelligenceDomain,
        title: String(d.title ?? ''),
        summary: String(d.summary ?? ''),
        findings: (d.findings as ArtifactRecord['findings']) ?? [],
        generatedAt: iso(d.generatedAt),
      }))
    },
  }
}

function payloadRecommendationRepository(payload: Payload): RecommendationRepository {
  return {
    async save(record: RecommendationRecord) {
      await payload.create({
        collection: 'recommendations',
        data: {
          domain: record.domain,
          action: record.action,
          expectedValue: record.expectedValue,
          rationale: record.rationale,
          sourceSignalIds: record.sourceSignalIds,
          status: record.status,
          rejectionReason: record.rejectionReason,
          createdAt: record.createdAt,
        } as never,
      })
    },
    async list(domain) {
      const res = await payload.find({
        collection: 'recommendations',
        where: domain ? { domain: { equals: domain } } : undefined,
        limit: 200,
        sort: '-createdAt',
      })
      return (res.docs as unknown as Array<Record<string, unknown>>).map((d) => ({
        id: String(d.id),
        domain: d.domain as IntelligenceDomain,
        action: String(d.action ?? ''),
        expectedValue: String(d.expectedValue ?? ''),
        rationale: String(d.rationale ?? ''),
        sourceSignalIds: (d.sourceSignalIds as string[]) ?? [],
        status: d.status as RecommendationRecord['status'],
        rejectionReason: (d.rejectionReason as string) ?? undefined,
        createdAt: iso(d.createdAt),
      }))
    },
  }
}

const payloadSynthIds: SynthIdGenerator = { artifactId: () => '', recommendationId: () => '' }

export function createPayloadSynthesisDeps(payload: Payload, synthesizer: DomainSynthesizer): SynthesisDeps {
  return {
    signals: payloadSignalReader(payload),
    synthesizer,
    artifacts: payloadArtifactRepository(payload),
    recommendations: payloadRecommendationRepository(payload),
    events: payloadEventStoreFor(payload),
    ids: payloadSynthIds,
    clock: { nowIso: () => new Date().toISOString() },
  }
}
