import type { Clock, EventStore } from './ports'
import type { IntelligenceDomain } from '@/lib/domain/intelligenceCore'

/**
 * Ports for CIC fusion, briefing, and surfaces (INTELLIGENCE_CORE.md Phase D,
 * Section 8). The lead synthesis agent assembles the fused briefing, ranks
 * recommendations by expected value, and resolves conflicts between domains. The
 * briefing is delivered where the principals already live, internal only (H6),
 * and answered on demand in natural language through a callable designed to
 * become the Layer 1 internal operations MCP tool.
 */

export interface BriefingIdGenerator {
  briefingId(): string
}

/** A per domain artifact the briefing fuses. Read only. */
export interface BriefingArtifact {
  domain: IntelligenceDomain
  title: string
  summary: string
  generatedAt: string
}
export interface BriefingArtifactReader {
  latestPerDomain(): Promise<BriefingArtifact[]>
}

/** A proposed recommendation, ranked into the briefing by expected value. */
export interface BriefingRecommendation {
  id: string
  domain: IntelligenceDomain
  action: string
  expectedValue: string
  rationale: string
}
export interface BriefingRecommendationReader {
  proposed(): Promise<BriefingRecommendation[]>
}

/** The assembled fused briefing (Section 10 `intelligenceArtifacts`, fused). */
export interface BriefingRankedItem {
  recommendationId: string
  domain: IntelligenceDomain
  action: string
  expectedValue: string
  score: number
  rank: number
}
export interface BriefingRecordInput {
  title: string
  summary: string
  ranked: BriefingRankedItem[]
  domainSummaries: Array<{ domain: IntelligenceDomain; summary: string }>
  generatedAt: string
  deliveredChannels: string[]
}
export interface BriefingRecord extends BriefingRecordInput {
  id: string
}
export interface BriefingRepository {
  save(record: BriefingRecord): Promise<void>
  latest(): Promise<BriefingRecord | null>
}

/** Internal delivery channels (D9): Resend email and a messaging channel (H6). */
export interface BriefingNotifier {
  email(input: { subject: string; body: string }): Promise<{ sent: boolean }>
  message(input: { body: string }): Promise<{ sent: boolean }>
}

/**
 * The on demand query responder. Agentic in production (reasons over the fused
 * intelligence to answer a natural language question in CasePort numbers); a
 * fake in tests. Its answer never asserts an unverified figure; it cites the
 * artifacts and recommendations it drew on (H5).
 */
export interface QueryContext {
  artifacts: BriefingArtifact[]
  recommendations: BriefingRecommendation[]
}
export interface QueryAnswer {
  answer: string
  citations: string[]
  /** Low when the intelligence is thin, so the operator knows to verify. */
  confidence: 'high' | 'medium' | 'low'
}
export interface QueryResponder {
  answer(question: string, context: QueryContext): Promise<QueryAnswer>
}

export interface BriefingDeps {
  artifacts: BriefingArtifactReader
  recommendations: BriefingRecommendationReader
  briefings: BriefingRepository
  notifier: BriefingNotifier
  responder: QueryResponder
  events: EventStore
  ids: BriefingIdGenerator
  clock: Clock
}

/** A real time alert (Section 8). Delivered internally, never on a claimant surface. */
export type AlertKind =
  | 'regulatory-change'
  | 'churn-risk'
  | 'citation-gap'
  | 'price-opportunity'
  | 'demand-surge'
  | 'new-mass-tort'
export interface Alert {
  kind: AlertKind
  market: string | null
  message: string
  /** The source signal or artifact this alert cites. Never asserted unsourced. */
  citation: string
}
