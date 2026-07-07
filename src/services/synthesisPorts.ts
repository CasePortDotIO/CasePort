import type { Clock, EventStore } from './ports'
import type { IntelligenceDomain, ReliabilityRating } from '@/lib/domain/intelligenceCore'

/**
 * Ports for CIC domain synthesis (INTELLIGENCE_CORE.md Phase C, Section 4 and 9).
 * Per domain synthesis is agentic: open ended reasoning over fused owned and
 * rented signals. It is bounded here behind ports so the orchestration is
 * deterministic, testable, and compliance gated. Synthesis proposes; it never
 * promotes to production (H1) and never asserts an unverified figure (H5).
 */

export interface SynthIdGenerator {
  artifactId(): string
  recommendationId(): string
}

/** A single ranked finding in an artifact, traceable to the signal behind it. */
export interface ArtifactFinding {
  claim: string
  /** The signal this finding rests on. Empty when the synthesizer invented it. */
  signalId: string | null
  sourceKey: string
  reliability: ReliabilityRating | null
  rank: number
  /**
   * asserted   stated as fact, backed by a sufficiently reliable active signal.
   * needs-verification  surfaced but flagged, never asserted, pending a human.
   */
  status: 'asserted' | 'needs-verification'
}

/** A synthesized per domain brief (Section 10 `intelligenceArtifacts`). */
export interface ArtifactRecordInput {
  domain: IntelligenceDomain
  title: string
  summary: string
  findings: ArtifactFinding[]
  generatedAt: string
}
export interface ArtifactRecord extends ArtifactRecordInput {
  id: string
}

export interface ArtifactRepository {
  save(record: ArtifactRecord): Promise<void>
  list(domain?: IntelligenceDomain): Promise<ArtifactRecord[]>
}

/** A proposed recommendation (Section 9, Section 10 `recommendations`). */
export type RecommendationStatus = 'proposed' | 'approved' | 'rejected' | 'executed'

export interface RecommendationRecordInput {
  domain: IntelligenceDomain
  action: string
  expectedValue: string
  rationale: string
  sourceSignalIds: string[]
  status: RecommendationStatus
  /** Set when the compliance guard rejected it (H2, H3). */
  rejectionReason?: string
  createdAt: string
}
export interface RecommendationRecord extends RecommendationRecordInput {
  id: string
}

export interface RecommendationRepository {
  save(record: RecommendationRecord): Promise<void>
  list(domain?: IntelligenceDomain): Promise<RecommendationRecord[]>
}

/** Reads active signals for a domain, the fuel the synthesizer reasons over. */
export interface DomainSignalReader {
  activeByDomain(domain: IntelligenceDomain): Promise<
    Array<{ id: string; claim: string; sourceKey: string; reliability: ReliabilityRating; observedAt: string }>
  >
}

/**
 * The agentic synthesizer for one domain. It reasons over the domain's signals
 * and proposes a ranked brief and recommendations. It is untrusted: its output
 * is always run through the SynthesisService gates (regulatory verification and
 * the recommendation compliance guard) before anything is persisted or asserted.
 */
export interface DomainSynthesisInput {
  domain: IntelligenceDomain
  signals: Array<{ id: string; claim: string; sourceKey: string; reliability: ReliabilityRating; observedAt: string }>
}
export interface SynthesizedFinding {
  claim: string
  signalId: string | null
  rank: number
}
export interface SynthesizedRecommendation {
  action: string
  expectedValue: string
  rationale: string
  sourceSignalIds: string[]
}
export interface DomainSynthesisOutput {
  title: string
  summary: string
  findings: SynthesizedFinding[]
  recommendations: SynthesizedRecommendation[]
}
export interface DomainSynthesizer {
  synthesize(input: DomainSynthesisInput): Promise<DomainSynthesisOutput>
}

export interface SynthesisDeps {
  signals: DomainSignalReader
  synthesizer: DomainSynthesizer
  artifacts: ArtifactRepository
  recommendations: RecommendationRepository
  events: EventStore
  ids: SynthIdGenerator
  clock: Clock
}
