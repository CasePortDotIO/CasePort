import type { Clock, EventStore, StoredEvent } from '../ports'
import type {
  GradableRecommendation,
  RecommendationLoopDeps,
  RecommendationLoopIdGenerator,
  RecommendationOutcomeRecord,
  RecommendationOutcomeRepository,
  RecommendationReader,
} from '../recommendationLoopPorts'

/**
 * In memory harness for the CIC recommendation self scoring loop (Phase E). It
 * holds the recommendations to grade and the measured outcomes, so the loop is
 * proven without a live database.
 */
export interface RecommendationLoopHarness {
  log: StoredEvent[]
  recommendationRows: Map<string, GradableRecommendation>
  outcomeRows: RecommendationOutcomeRecord[]
  recommendations: RecommendationReader
  outcomes: RecommendationOutcomeRepository
  events: EventStore
  ids: RecommendationLoopIdGenerator
  clock: Clock
  seedRecommendation(rec: GradableRecommendation): void
}

export function createRecommendationLoopHarness(): RecommendationLoopHarness {
  const log: StoredEvent[] = []
  const recommendationRows = new Map<string, GradableRecommendation>()
  const outcomeRows: RecommendationOutcomeRecord[] = []
  let n = 0
  const next = (p: string) => `${p}_${(n += 1)}`

  return {
    log,
    recommendationRows,
    outcomeRows,
    recommendations: {
      async get(id) {
        const r = recommendationRows.get(id)
        return r ? { ...r } : null
      },
    },
    outcomes: {
      async save(record) {
        outcomeRows.push(record)
      },
      async list() {
        return outcomeRows.map((r) => ({ ...r }))
      },
      async listByDomain(domain) {
        return outcomeRows.filter((r) => r.domain === domain).map((r) => ({ ...r }))
      },
    },
    events: {
      async append(event) {
        const stored: StoredEvent = { ...event, id: next('evt') }
        log.push(stored)
        return stored
      },
    },
    ids: { outcomeId: () => next('rout') },
    clock: { nowIso: () => '2026-07-06T12:00:00.000Z' },
    seedRecommendation: (rec) => recommendationRows.set(rec.id, rec),
  }
}

export function recommendationLoopDepsFrom(h: RecommendationLoopHarness): RecommendationLoopDeps {
  return { recommendations: h.recommendations, outcomes: h.outcomes, events: h.events, ids: h.ids, clock: h.clock }
}
