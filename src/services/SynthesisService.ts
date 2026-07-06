import { findRecommendationViolations } from '@/lib/intelligence/recommendationGuard'
import type { IntelligenceDomain, ReliabilityRating } from '@/lib/domain/intelligenceCore'
import type {
  ArtifactFinding,
  ArtifactRecord,
  RecommendationRecord,
  SynthesisDeps,
} from './synthesisPorts'

/**
 * SynthesisService. CIC domain synthesis (INTELLIGENCE_CORE.md Phase C). For a
 * domain it reads the active signals, runs the agentic synthesizer, and turns
 * its output into a persisted artifact and recommendations, behind two gates
 * that the synthesizer cannot bypass:
 *
 *   Regulatory verification (H5). A finding is asserted as fact only when it
 *   rests on a sufficiently reliable active signal. Regulatory findings require
 *   an A rated primary source; everything else is flagged needs-verification and
 *   surfaced for a human, never asserted. A finding the synthesizer invented
 *   with no backing signal is never asserted. The CIC flags and cites; a human
 *   confirms and acts. A hallucinated opinion cannot become an assertion.
 *
 *   Recommendation compliance (H2, H3). A recommendation that would make routing
 *   smart or make pricing scale with outcome is rejected before it can be
 *   proposed, no matter the reasoning. The CIC proposes; it never promotes (H1).
 */
export function createSynthesisService(deps: SynthesisDeps) {
  // Whether a finding may be asserted as fact given its backing and the domain.
  function assertable(domain: IntelligenceDomain, reliability: ReliabilityRating | null, hasSignal: boolean): boolean {
    if (!hasSignal || !reliability) return false // hallucinated: never asserted
    if (domain === 'regulatory') return reliability === 'A' // primary source only
    return reliability === 'A' || reliability === 'B'
  }

  async function synthesizeDomain(domain: IntelligenceDomain): Promise<{
    artifact: ArtifactRecord
    proposed: RecommendationRecord[]
    rejected: RecommendationRecord[]
  }> {
    const now = deps.clock.nowIso()
    const signals = await deps.signals.activeByDomain(domain)
    const byId = new Map(signals.map((s) => [s.id, s]))

    const output = await deps.synthesizer.synthesize({ domain, signals })

    // Findings: resolve each to its backing signal and apply the assertion gate.
    const findings: ArtifactFinding[] = output.findings.map((f) => {
      const signal = f.signalId ? byId.get(f.signalId) : undefined
      const reliability = signal?.reliability ?? null
      const asserted = assertable(domain, reliability, Boolean(signal))
      return {
        claim: f.claim,
        signalId: signal ? signal.id : null,
        sourceKey: signal?.sourceKey ?? '',
        reliability,
        rank: f.rank,
        status: asserted ? 'asserted' : 'needs-verification',
      }
    })
    findings.sort((a, b) => a.rank - b.rank)

    const artifact: ArtifactRecord = {
      id: deps.ids.artifactId(),
      domain,
      title: output.title,
      summary: output.summary,
      findings,
      generatedAt: now,
    }
    await deps.artifacts.save(artifact)
    await deps.events.append({
      eventType: 'IntelligenceArtifactSynthesized',
      aggregateType: 'intelligence-artifact',
      aggregateId: artifact.id,
      actor: 'cic',
      occurredAt: now,
      payload: {
        domain,
        findingCount: findings.length,
        asserted: findings.filter((f) => f.status === 'asserted').length,
        needsVerification: findings.filter((f) => f.status === 'needs-verification').length,
      },
    })

    // Recommendations: compliance gate before anything is proposed (H2, H3).
    const proposed: RecommendationRecord[] = []
    const rejected: RecommendationRecord[] = []
    for (const r of output.recommendations) {
      const violations = findRecommendationViolations(`${r.action} ${r.rationale}`)
      if (violations.length > 0) {
        const rec: RecommendationRecord = {
          id: deps.ids.recommendationId(),
          domain,
          action: r.action,
          expectedValue: r.expectedValue,
          rationale: r.rationale,
          sourceSignalIds: r.sourceSignalIds,
          status: 'rejected',
          rejectionReason: violations.map((v) => `${v.rule}: ${v.match}`).join('; '),
          createdAt: now,
        }
        await deps.recommendations.save(rec)
        await deps.events.append({
          eventType: 'RecommendationRejected',
          aggregateType: 'recommendation',
          aggregateId: rec.id,
          actor: 'cic',
          occurredAt: now,
          payload: { domain, reason: rec.rejectionReason },
        })
        rejected.push(rec)
        continue
      }
      const rec: RecommendationRecord = {
        id: deps.ids.recommendationId(),
        domain,
        action: r.action,
        expectedValue: r.expectedValue,
        rationale: r.rationale,
        sourceSignalIds: r.sourceSignalIds,
        status: 'proposed',
        createdAt: now,
      }
      await deps.recommendations.save(rec)
      await deps.events.append({
        eventType: 'RecommendationProposed',
        aggregateType: 'recommendation',
        aggregateId: rec.id,
        actor: 'cic',
        occurredAt: now,
        payload: { domain, expectedValue: rec.expectedValue, sourceSignalIds: rec.sourceSignalIds },
      })
      proposed.push(rec)
    }

    return { artifact, proposed, rejected }
  }

  /** Synthesize every domain in one pass, for the scheduled synthesis run. */
  async function synthesizeAll(): Promise<ArtifactRecord[]> {
    const domains: IntelligenceDomain[] = ['demand', 'supply', 'regulatory', 'market']
    const out: ArtifactRecord[] = []
    for (const d of domains) out.push((await synthesizeDomain(d)).artifact)
    return out
  }

  return { synthesizeDomain, synthesizeAll }
}

export type SynthesisService = ReturnType<typeof createSynthesisService>
