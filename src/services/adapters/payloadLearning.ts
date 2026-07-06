import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import { createIntelligenceService } from '../IntelligenceService'
import { createPayloadIntelligenceDeps } from './payloadIntelligence'
import type {
  AttributionResolver,
  CaptureAttributionRecord,
  CaptureAttributionRepository,
  CitationChecker,
  LearningIdGenerator,
  LearningLoopDeps,
  OutcomeSource,
  SurfacePresenceRecord,
  SurfacePresenceRepository,
} from '../learningPorts'

/**
 * Payload wiring for the Demand Capture learning loop (Phase E).
 *
 * The attribution resolver is backed by the existing IntelligenceService
 * attribution trace (the Answer to Wallet query): outcome to delivery to dossier
 * to intake session, where the immutable first touch tuple lives. The surface
 * and phrasing come from that tuple, so the loop rests on the same moat the
 * backend already guarantees end to end. Citation checking is injected (an
 * agentic checker in production); this adapter holds only storage and reads.
 */

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : v ? String(v) : '')

function payloadAttributionResolver(payload: Payload): AttributionResolver {
  const intel = createIntelligenceService(createPayloadIntelligenceDeps(payload))
  return {
    async resolve(outcomeId) {
      const trace = await intel.attributionTrace(outcomeId)
      if (!trace.outcome) return null
      const signed = trace.outcome.result === 'retained' || trace.outcome.result === 'settled'
      return {
        complete: trace.complete,
        outcomeId,
        signed,
        valueCents: trace.outcome.settlementValueCents ?? 0,
        surface: trace.tuple?.referringSurface ?? null,
        keyword: trace.tuple?.keyword ?? null,
        market: trace.market,
        caseType: trace.caseType,
      }
    },
  }
}

function payloadOutcomeSource(payload: Payload): OutcomeSource {
  return {
    async allOutcomes() {
      const res = await payload.find({ collection: 'outcomes', limit: 2000 })
      return (res.docs as unknown as Array<Record<string, unknown>>).map((d) => ({ outcomeId: String(d.id) }))
    },
  }
}

function payloadAttributionRepository(payload: Payload): CaptureAttributionRepository {
  const data = (r: CaptureAttributionRecord) => ({
    outcomeId: r.outcomeId,
    signed: r.signed,
    valueCents: r.valueCents,
    surface: r.surface,
    keyword: r.keyword,
    market: r.market,
    caseType: r.caseType,
    complete: r.complete,
    linkedAt: r.linkedAt,
  })
  return {
    async upsertByOutcome(record) {
      const existing = await payload.find({
        collection: 'capture-attributions',
        where: { outcomeId: { equals: record.outcomeId } },
        limit: 1,
      })
      if (existing.docs[0]) {
        await payload.update({ collection: 'capture-attributions', id: String(existing.docs[0].id), data: data(record) as never })
      } else {
        await payload.create({ collection: 'capture-attributions', data: data(record) as never })
      }
    },
    async list() {
      const res = await payload.find({ collection: 'capture-attributions', limit: 2000 })
      return (res.docs as unknown as Array<Record<string, unknown>>).map((d) => ({
        id: String(d.id),
        outcomeId: String(d.outcomeId ?? ''),
        signed: Boolean(d.signed),
        valueCents: Number(d.valueCents ?? 0),
        surface: (d.surface as string) ?? null,
        keyword: (d.keyword as string) ?? null,
        market: (d.market as string) ?? null,
        caseType: (d.caseType as string) ?? null,
        complete: Boolean(d.complete),
        linkedAt: iso(d.linkedAt),
      }))
    },
  }
}

function payloadPresenceRepository(payload: Payload): SurfacePresenceRepository {
  return {
    async upsertByQuestion(record: SurfacePresenceRecord) {
      const existing = await payload.find({
        collection: 'surface-presence',
        where: { question: { equals: record.question } },
        limit: 1,
      })
      const data = {
        question: record.question,
        surface: record.surface,
        market: record.market,
        cited: record.cited,
        engines: record.engines,
        checkedAt: record.checkedAt,
      }
      if (existing.docs[0]) {
        await payload.update({ collection: 'surface-presence', id: String(existing.docs[0].id), data: data as never })
      } else {
        await payload.create({ collection: 'surface-presence', data: data as never })
      }
    },
    async list() {
      const res = await payload.find({ collection: 'surface-presence', limit: 2000 })
      return (res.docs as unknown as Array<Record<string, unknown>>).map((d) => ({
        id: String(d.id),
        question: String(d.question ?? ''),
        surface: d.surface as SurfacePresenceRecord['surface'],
        market: String(d.market ?? ''),
        cited: Boolean(d.cited),
        engines: (d.engines as string[]) ?? [],
        checkedAt: iso(d.checkedAt),
      }))
    },
  }
}

const payloadLearningIds: LearningIdGenerator = { attributionId: () => '', presenceId: () => '' }

export function createPayloadLearningDeps(payload: Payload, citations: CitationChecker): LearningLoopDeps {
  return {
    resolver: payloadAttributionResolver(payload),
    outcomes: payloadOutcomeSource(payload),
    attributions: payloadAttributionRepository(payload),
    citations,
    presence: payloadPresenceRepository(payload),
    events: payloadEventStoreFor(payload),
    ids: payloadLearningIds,
    clock: { nowIso: () => new Date().toISOString() },
  }
}
