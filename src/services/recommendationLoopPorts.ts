import type { Clock, EventStore } from './ports'
import type { IntelligenceDomain } from '@/lib/domain/intelligenceCore'

/**
 * Ports for the CIC recommendation self scoring loop (INTELLIGENCE_CORE.md Phase
 * E, Section 9). The engine that grades its own advice against outcomes is the
 * top of the compounding stack. This measures each executed recommendation's
 * actual outcome against its prediction and calibrates future confidence by
 * recommendation type, so the CIC learns which classes of advice actually
 * produce revenue. An intelligence engine that does not close its own loop is a
 * vitamin; this one closes it.
 */

export interface RecommendationLoopIdGenerator {
  outcomeId(): string
}

/** The recommendation being graded. Read from the recommendations store. */
export interface GradableRecommendation {
  id: string
  domain: IntelligenceDomain
  expectedValue: string
  status: 'proposed' | 'approved' | 'rejected' | 'executed'
}

export interface RecommendationReader {
  get(id: string): Promise<GradableRecommendation | null>
}

/** A measured outcome for one recommendation (Section 10 `recommendationOutcomes`). */
export interface RecommendationOutcomeInput {
  recommendationId: string
  domain: IntelligenceDomain
  predicted: string
  /** The realized result, in the same unit the prediction implied. */
  actualValue: number
  /** Whether acting on this recommendation paid off. */
  paidOff: boolean
  note?: string
  measuredAt: string
}
export interface RecommendationOutcomeRecord extends RecommendationOutcomeInput {
  id: string
}

export interface RecommendationOutcomeRepository {
  save(record: RecommendationOutcomeRecord): Promise<void>
  list(): Promise<RecommendationOutcomeRecord[]>
  listByDomain(domain: IntelligenceDomain): Promise<RecommendationOutcomeRecord[]>
}

export interface RecommendationLoopDeps {
  recommendations: RecommendationReader
  outcomes: RecommendationOutcomeRepository
  events: EventStore
  ids: RecommendationLoopIdGenerator
  clock: Clock
}

/** Per type calibration: how often this class of recommendation has paid off. */
export interface Calibration {
  domain: IntelligenceDomain
  measured: number
  paidOff: number
  /** Confidence in this recommendation type, 0 to 1. Null until measured. */
  confidence: number | null
}
