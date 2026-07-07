import { expectedValueScore } from '@/lib/intelligence/expectedValue'
import type {
  Alert,
  BriefingDeps,
  BriefingRankedItem,
  BriefingRecord,
  QueryAnswer,
} from './briefingPorts'

/**
 * BriefingService. CIC fusion, briefing, and surfaces (INTELLIGENCE_CORE.md
 * Phase D, Section 8). It is the lead synthesis layer: it fuses the per domain
 * artifacts into one briefing, ranks recommendations by expected value, delivers
 * the briefing where the principals already live, answers natural language
 * questions on demand, and raises real time alerts. All internal only (H6).
 *
 * It never promotes anything to production and never asserts an unverified
 * figure; it ranks, delivers, and answers with citations, and leaves every
 * production change to the human promotion gate.
 */
export function createBriefingService(deps: BriefingDeps) {
  /**
   * Assemble the fused briefing: the latest brief per domain, plus every proposed
   * recommendation ranked by expected value, highest first. The best interface
   * for a busy operator is no interface, so this is the artifact that gets pushed.
   */
  async function assembleBriefing(): Promise<BriefingRecord> {
    const now = deps.clock.nowIso()
    const artifacts = await deps.artifacts.latestPerDomain()
    const recs = await deps.recommendations.proposed()

    const ranked: BriefingRankedItem[] = recs
      .map((r) => ({
        recommendationId: r.id,
        domain: r.domain,
        action: r.action,
        expectedValue: r.expectedValue,
        score: expectedValueScore(r.expectedValue),
        rank: 0,
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, i) => ({ ...item, rank: i + 1 }))

    const record: BriefingRecord = {
      id: deps.ids.briefingId(),
      title: `CasePort intelligence briefing`,
      summary: `${artifacts.length} domain briefs fused; ${ranked.length} recommendations ranked by expected value.`,
      ranked,
      domainSummaries: artifacts.map((a) => ({ domain: a.domain, summary: a.summary })),
      generatedAt: now,
      deliveredChannels: [],
    }
    await deps.briefings.save(record)
    await deps.events.append({
      eventType: 'BriefingAssembled',
      aggregateType: 'briefing',
      aggregateId: record.id,
      actor: 'cic',
      occurredAt: now,
      payload: { domainBriefs: artifacts.length, recommendations: ranked.length, topScore: ranked[0]?.score ?? 0 },
    })
    return record
  }

  /**
   * Deliver a briefing through the internal channels (D9): Resend email and a
   * messaging channel. Records which channels actually delivered. Internal only.
   */
  async function deliverBriefing(briefing: BriefingRecord): Promise<BriefingRecord> {
    const now = deps.clock.nowIso()
    const subject = briefing.title
    const body = renderBriefing(briefing)
    const channels: string[] = []
    const emailed = await deps.notifier.email({ subject, body })
    if (emailed.sent) channels.push('email')
    const messaged = await deps.notifier.message({ body })
    if (messaged.sent) channels.push('message')

    const delivered: BriefingRecord = { ...briefing, deliveredChannels: channels }
    await deps.briefings.save(delivered)
    await deps.events.append({
      eventType: 'BriefingDelivered',
      aggregateType: 'briefing',
      aggregateId: briefing.id,
      actor: 'cic',
      occurredAt: now,
      payload: { channels },
    })
    return delivered
  }

  /** Assemble then deliver, the scheduled briefing pass. */
  async function runBriefing(): Promise<BriefingRecord> {
    return deliverBriefing(await assembleBriefing())
  }

  /**
   * Answer a natural language question over the fused intelligence, in CasePort
   * numbers. Designed to be the Layer 1 internal operations MCP tool: clean input,
   * clean output, citations, and a confidence the operator can trust. It never
   * asserts an unverified figure (H5). Emits IntelligenceQueried.
   */
  async function answerQuery(question: string): Promise<QueryAnswer> {
    const now = deps.clock.nowIso()
    const [artifacts, recommendations] = await Promise.all([
      deps.artifacts.latestPerDomain(),
      deps.recommendations.proposed(),
    ])
    const answer = await deps.responder.answer(question, { artifacts, recommendations })
    await deps.events.append({
      eventType: 'IntelligenceQueried',
      aggregateType: 'intelligence-query',
      aggregateId: 'query',
      actor: 'operator',
      occurredAt: now,
      payload: { question, confidence: answer.confidence, citationCount: answer.citations.length },
    })
    return answer
  }

  /**
   * Raise a real time alert internally (Section 8). The alert cites its source
   * signal or artifact and is delivered through the messaging channel. It never
   * reaches a claimant surface. Emits IntelligenceAlertRaised.
   */
  async function raiseAlert(alert: Alert): Promise<{ delivered: boolean }> {
    const now = deps.clock.nowIso()
    const body = `[${alert.kind}]${alert.market ? ` ${alert.market}` : ''}: ${alert.message} (source: ${alert.citation})`
    const messaged = await deps.notifier.message({ body })
    await deps.events.append({
      eventType: 'IntelligenceAlertRaised',
      aggregateType: 'intelligence-alert',
      aggregateId: alert.kind,
      actor: 'cic',
      occurredAt: now,
      payload: { kind: alert.kind, market: alert.market, citation: alert.citation, delivered: messaged.sent },
    })
    return { delivered: messaged.sent }
  }

  return { assembleBriefing, deliverBriefing, runBriefing, answerQuery, raiseAlert }
}

export type BriefingService = ReturnType<typeof createBriefingService>

/** Render a briefing to plain text for email and messaging. */
export function renderBriefing(b: BriefingRecord): string {
  const lines: string[] = [b.title, '', b.summary, '']
  if (b.ranked.length > 0) {
    lines.push('Ranked recommendations:')
    for (const r of b.ranked) lines.push(`${r.rank}. [${r.domain}] ${r.action} (expected: ${r.expectedValue})`)
    lines.push('')
  }
  for (const d of b.domainSummaries) lines.push(`${d.domain}: ${d.summary}`)
  return lines.join('\n')
}
