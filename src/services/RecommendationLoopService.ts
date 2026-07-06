import type { IntelligenceDomain } from '@/lib/domain/intelligenceCore'
import type {
  Calibration,
  RecommendationLoopDeps,
  RecommendationOutcomeRecord,
} from './recommendationLoopPorts'

/**
 * RecommendationLoopService. The CIC self scoring loop (INTELLIGENCE_CORE.md
 * Phase E, Section 9). It measures an executed recommendation's actual outcome
 * against its prediction, records it, and calibrates confidence by recommendation
 * type over time. The CIC thereby learns which of its recommendation classes
 * actually produce revenue and tunes its future confidence, closing its own loop.
 *
 * It never touches a fee and never promotes to production; it only grades advice
 * against reality and reports calibration for the human promotion gate to weigh.
 */
export function createRecommendationLoopService(deps: RecommendationLoopDeps) {
  /**
   * Grade one recommendation against its realized outcome. Stores the predicted
   * versus actual and whether it paid off, and emits the measurement. Returns
   * null when the recommendation does not exist.
   */
  async function recordOutcome(input: {
    recommendationId: string
    actualValue: number
    paidOff: boolean
    note?: string
  }): Promise<RecommendationOutcomeRecord | null> {
    const rec = await deps.recommendations.get(input.recommendationId)
    if (!rec) return null
    const now = deps.clock.nowIso()
    const record: RecommendationOutcomeRecord = {
      id: deps.ids.outcomeId(),
      recommendationId: rec.id,
      domain: rec.domain,
      predicted: rec.expectedValue,
      actualValue: input.actualValue,
      paidOff: input.paidOff,
      note: input.note,
      measuredAt: now,
    }
    await deps.outcomes.save(record)
    await deps.events.append({
      eventType: 'RecommendationOutcomeMeasured',
      aggregateType: 'recommendation',
      aggregateId: rec.id,
      actor: 'cic',
      occurredAt: now,
      payload: { domain: rec.domain, predicted: rec.expectedValue, actualValue: input.actualValue, paidOff: input.paidOff },
    })
    return record
  }

  /** Calibration for one recommendation type: how often it has paid off. */
  async function calibrationFor(domain: IntelligenceDomain): Promise<Calibration> {
    const rows = await deps.outcomes.listByDomain(domain)
    const measured = rows.length
    const paidOff = rows.filter((r) => r.paidOff).length
    return { domain, measured, paidOff, confidence: measured > 0 ? Number((paidOff / measured).toFixed(3)) : null }
  }

  /** Calibration across every recommendation type. The self scoring report. */
  async function calibration(): Promise<Calibration[]> {
    const domains: IntelligenceDomain[] = ['demand', 'supply', 'regulatory', 'market']
    const out: Calibration[] = []
    for (const d of domains) out.push(await calibrationFor(d))
    return out
  }

  return { recordOutcome, calibrationFor, calibration }
}

export type RecommendationLoopService = ReturnType<typeof createRecommendationLoopService>
