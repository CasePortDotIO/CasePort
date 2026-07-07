import type { Clock, EventStore, StoredEvent } from '../ports'
import type {
  AttributionResolver,
  CaptureAttributionRecord,
  CaptureAttributionRepository,
  CitationChecker,
  LearningIdGenerator,
  LearningLoopDeps,
  OutcomeSource,
  ResolvedAttribution,
  SurfacePresenceRecord,
  SurfacePresenceRepository,
} from '../learningPorts'

/**
 * In memory harness for the Demand Capture learning loop (Phase E). It scripts
 * the attribution traces and citation results, and captures the attribution and
 * presence records the service persists, so the loop is proven without a live
 * database and without the full backend trace chain.
 */
export interface LearningHarness {
  log: StoredEvent[]
  attributionRows: Map<string, CaptureAttributionRecord>
  presenceRows: SurfacePresenceRecord[]
  resolver: AttributionResolver
  outcomes: OutcomeSource
  attributions: CaptureAttributionRepository
  citations: CitationChecker
  presence: SurfacePresenceRepository
  events: EventStore
  ids: LearningIdGenerator
  clock: Clock
}

export function createLearningHarness(input: {
  traces: Record<string, ResolvedAttribution>
  cited?: Record<string, string[]>
}): LearningHarness {
  const log: StoredEvent[] = []
  const attributionRows = new Map<string, CaptureAttributionRecord>()
  const presenceRows: SurfacePresenceRecord[] = []
  let n = 0
  const next = (p: string) => `${p}_${(n += 1)}`

  return {
    log,
    attributionRows,
    presenceRows,
    resolver: {
      async resolve(outcomeId) {
        return input.traces[outcomeId] ?? null
      },
    },
    outcomes: {
      async allOutcomes() {
        return Object.keys(input.traces).map((outcomeId) => ({ outcomeId }))
      },
    },
    attributions: {
      async upsertByOutcome(record) {
        attributionRows.set(record.outcomeId, record)
      },
      async list() {
        return [...attributionRows.values()].map((r) => ({ ...r }))
      },
    },
    citations: {
      async check(question) {
        const engines = input.cited?.[question] ?? []
        return { cited: engines.length > 0, engines }
      },
    },
    presence: {
      async upsertByQuestion(record) {
        presenceRows.push(record)
      },
      async list() {
        return presenceRows.map((r) => ({ ...r }))
      },
    },
    events: {
      async append(event) {
        const stored: StoredEvent = { ...event, id: next('evt') }
        log.push(stored)
        return stored
      },
    },
    ids: { attributionId: () => next('attr'), presenceId: () => next('pres') },
    clock: { nowIso: () => '2026-07-06T12:00:00.000Z' },
  }
}

export function learningDepsFrom(h: LearningHarness): LearningLoopDeps {
  return {
    resolver: h.resolver,
    outcomes: h.outcomes,
    attributions: h.attributions,
    citations: h.citations,
    presence: h.presence,
    events: h.events,
    ids: h.ids,
    clock: h.clock,
  }
}
