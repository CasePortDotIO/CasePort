import type { Clock, EventStore } from './ports'
import type { CaptureSurface } from '@/lib/domain/demandCapture'

/**
 * Ports for the Demand Capture learning loop (DEMAND_CAPTURE.md Phase E, Section
 * 9). This is what makes the engine compound rather than merely publish. Every
 * captured touch carries the attribution tuple; when a case signs, the loop
 * traces it back to the exact surface and phrasing that produced it, and returns
 * a sharper aim that reallocates the engine's effort toward what converts. An
 * engine that captures without closing this loop is a vitamin; this one closes
 * it into the CIC. The join key is always the attribution tuple.
 */

export interface LearningIdGenerator {
  attributionId(): string
  presenceId(): string
}

/**
 * Resolves a signed outcome back to its originating surface and phrasing, the
 * Answer to Wallet trace. Backed in production by the existing attribution trace
 * (outcome to delivery to dossier to intake session, where the immutable first
 * touch tuple lives). Returns null when the outcome does not exist; returns
 * complete false when the trace breaks, so a broken link is visible, not hidden.
 */
export interface ResolvedAttribution {
  complete: boolean
  outcomeId: string
  signed: boolean
  valueCents: number
  surface: string | null
  keyword: string | null
  market: string | null
  caseType: string | null
}
export interface AttributionResolver {
  resolve(outcomeId: string): Promise<ResolvedAttribution | null>
}

/** Every outcome the loop should link. Signed and unsigned both inform the aim. */
export interface OutcomeForLearning {
  outcomeId: string
}
export interface OutcomeSource {
  allOutcomes(): Promise<OutcomeForLearning[]>
}

/** A persisted attribution link (Section 10 `captureAttribution`), joined to the CIC. */
export interface CaptureAttributionInput {
  outcomeId: string
  signed: boolean
  valueCents: number
  surface: string | null
  keyword: string | null
  market: string | null
  caseType: string | null
  complete: boolean
  linkedAt: string
}
export interface CaptureAttributionRecord extends CaptureAttributionInput {
  id: string
}
export interface CaptureAttributionRepository {
  upsertByOutcome(record: CaptureAttributionRecord): Promise<void>
  list(): Promise<CaptureAttributionRecord[]>
}

/** Answer engine citation state for a target question (Section 9, measured not assumed). */
export interface CitationChecker {
  /** Whether major answer engines cite CasePort for this question right now. */
  check(question: string, surface: CaptureSurface): Promise<{ cited: boolean; engines: string[] }>
}
export interface SurfacePresenceInput {
  question: string
  surface: CaptureSurface
  market: string
  cited: boolean
  engines: string[]
  checkedAt: string
}
export interface SurfacePresenceRecord extends SurfacePresenceInput {
  id: string
}
export interface SurfacePresenceRepository {
  upsertByQuestion(record: SurfacePresenceRecord): Promise<void>
  list(): Promise<SurfacePresenceRecord[]>
}

export interface LearningLoopDeps {
  resolver: AttributionResolver
  outcomes: OutcomeSource
  attributions: CaptureAttributionRepository
  citations: CitationChecker
  presence: SurfacePresenceRepository
  events: EventStore
  ids: LearningIdGenerator
  clock: Clock
}

/** A reallocation weight for a surface and market, driving the next cycle's aim. */
export interface SurfaceWeight {
  surface: string
  market: string
  signed: number
  valueCents: number
  /** Share of total converted value, 0 to 1. The engine leans here next cycle. */
  weight: number
}
