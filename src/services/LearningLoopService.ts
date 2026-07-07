import type { CaptureSurface } from '@/lib/domain/demandCapture'
import type {
  CaptureAttributionRecord,
  LearningLoopDeps,
  ResolvedAttribution,
  SurfaceWeight,
} from './learningPorts'

/**
 * LearningLoopService. The Demand Capture learning loop (DEMAND_CAPTURE.md Phase
 * E, Section 9). It links signed outcomes back to the exact surface and phrasing
 * that produced them, aggregates converted value per surface and market, and
 * returns a reallocation that reranks the engine's next cycle toward what
 * actually converts and away from motion without revenue. It also tracks whether
 * answer engines have begun citing CasePort for target questions, so citation
 * ownership is measured, not assumed.
 *
 * This is the compounding mechanism made concrete. The join key is the
 * attribution tuple, carried immutably from first touch through delivery, debit,
 * and outcome.
 */
export function createLearningLoopService(deps: LearningLoopDeps) {
  /**
   * Link one outcome back to its originating surface and phrasing and persist
   * the attribution. Emits CaptureAttributionLinked. A broken trace is recorded
   * with complete false rather than dropped, so the moat's integrity is visible.
   */
  async function linkOutcome(outcomeId: string): Promise<CaptureAttributionRecord | null> {
    const resolved = await deps.resolver.resolve(outcomeId)
    if (!resolved) return null
    const now = deps.clock.nowIso()
    const record: CaptureAttributionRecord = {
      id: deps.ids.attributionId(),
      outcomeId: resolved.outcomeId,
      signed: resolved.signed,
      valueCents: resolved.valueCents,
      surface: resolved.surface,
      keyword: resolved.keyword,
      market: resolved.market,
      caseType: resolved.caseType,
      complete: resolved.complete,
      linkedAt: now,
    }
    await deps.attributions.upsertByOutcome(record)
    await deps.events.append({
      eventType: 'CaptureAttributionLinked',
      aggregateType: 'capture-attribution',
      aggregateId: resolved.outcomeId,
      actor: 'demand-capture',
      occurredAt: now,
      payload: {
        signed: resolved.signed,
        surface: resolved.surface,
        keyword: resolved.keyword,
        market: resolved.market,
        complete: resolved.complete,
      },
    })
    return record
  }

  /** Link every known outcome. Used by the scheduled learning pass. */
  async function linkAll(): Promise<CaptureAttributionRecord[]> {
    const outcomes = await deps.outcomes.allOutcomes()
    const out: CaptureAttributionRecord[] = []
    for (const o of outcomes) {
      const rec = await linkOutcome(o.outcomeId)
      if (rec) out.push(rec)
    }
    return out
  }

  /**
   * The sharper aim. Aggregate signed, complete attributions into converted
   * value per surface and market, and return a normalized weight per cell. The
   * engine leans toward the highest weight surfaces next cycle. Only signed and
   * completely traced cases count, so a broken trace never inflates the aim.
   */
  async function reallocation(): Promise<SurfaceWeight[]> {
    const rows = (await deps.attributions.list()).filter((r) => r.signed && r.complete && r.surface && r.market)
    const groups = new Map<string, SurfaceWeight>()
    let totalValue = 0
    for (const r of rows) {
      const key = `${r.surface}::${r.market}`
      const g = groups.get(key) ?? { surface: r.surface as string, market: r.market as string, signed: 0, valueCents: 0, weight: 0 }
      g.signed += 1
      g.valueCents += r.valueCents
      groups.set(key, g)
      totalValue += r.valueCents
    }
    const weights = [...groups.values()]
    for (const g of weights) g.weight = totalValue > 0 ? Number((g.valueCents / totalValue).toFixed(4)) : 0
    return weights.sort((a, b) => b.weight - a.weight)
  }

  /**
   * Track whether answer engines cite CasePort for a target question (Section 9).
   * Citation ownership is measured here, never assumed. Emits CitationTracked.
   */
  async function trackCitation(question: string, surface: CaptureSurface, market: string): Promise<void> {
    const now = deps.clock.nowIso()
    const result = await deps.citations.check(question, surface)
    await deps.presence.upsertByQuestion({
      id: deps.ids.presenceId(),
      question,
      surface,
      market,
      cited: result.cited,
      engines: result.engines,
      checkedAt: now,
    })
    await deps.events.append({
      eventType: 'CitationTracked',
      aggregateType: 'surface-presence',
      aggregateId: question,
      actor: 'demand-capture',
      occurredAt: now,
      payload: { surface, market, cited: result.cited, engines: result.engines },
    })
  }

  return { linkOutcome, linkAll, reallocation, trackCitation }
}

export type LearningLoopService = ReturnType<typeof createLearningLoopService>

/** Convert a reallocation into a per surface multiplier for reranking (Section 9). */
export function surfaceBoosts(weights: SurfaceWeight[]): Record<string, number> {
  const boosts: Record<string, number> = {}
  for (const w of weights) boosts[w.surface] = Math.max(boosts[w.surface] ?? 0, w.weight)
  return boosts
}
