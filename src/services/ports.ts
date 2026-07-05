import type { Dossier, FirmOnlyEvaluation } from '@/lib/compliance/dossierProjections'
import type { EventType } from '@/lib/domain/constants'

/**
 * Ports for the domain service layer (Section 4). The services depend on these
 * interfaces, never on Payload, Stripe, Anthropic, Deepgram, or R2 directly.
 * Production adapters implement them against the real systems; in memory fakes
 * implement them for tests. This is what lets the full intake pipeline be
 * exercised end to end without a live database or external API.
 */

/* Attribution tuple. Captured at first touch, immutable (Section 11). */
export interface AttributionTuple {
  readonly source: string
  readonly keyword?: string
  readonly referringSurface?: string
  readonly sessionBehavior?: Record<string, unknown>
  readonly firstTouchAt: string
}

/* Claimant contact captured during intake. PII (Section 5). */
export interface ClaimantContact {
  firstName: string
  lastName?: string
  phone?: string
  email?: string
  location: GeographicLocation
}

/* The geographic inputs to routing (W1). ZIP preferred; state and city are the
 * fallback for the launch markets. No quality signal is ever present here. */
export interface GeographicLocation {
  state?: string
  city?: string
  zip?: string
}

/* A resolved market. The routing surface exposes only what W1 permits. */
export interface MarketInfo {
  id: string
  slug: string
  state: string
  liveForIntake: boolean
}

/* An appended event on the global log. */
export interface StoredEvent {
  id: string
  eventType: EventType
  aggregateType: string
  aggregateId: string
  intakeSessionId?: string
  actor: string
  occurredAt: string
  payload?: Record<string, unknown>
}

export interface EventStore {
  append(event: Omit<StoredEvent, 'id'>): Promise<StoredEvent>
}

/* Intake session record carrying the immutable attribution tuple. */
export interface IntakeSessionRecord {
  id: string
  claimantId: string
  marketId: string | null
  attribution: AttributionTuple
  validationPassed: boolean
  eventIds: string[]
  createdAt: string
}

export interface IntakeRepository {
  createSession(input: {
    claimantId: string
    marketId: string | null
    attribution: AttributionTuple
  }): Promise<IntakeSessionRecord>
  getSession(id: string): Promise<IntakeSessionRecord | null>
  updateSession(
    id: string,
    patch: Partial<Pick<IntakeSessionRecord, 'marketId' | 'validationPassed' | 'eventIds'>>,
  ): Promise<IntakeSessionRecord>
}

export interface ClaimantRepository {
  create(contact: ClaimantContact): Promise<{ id: string }>
  get(id: string): Promise<(ClaimantContact & { id: string }) | null>
}

export interface DossierRepository {
  create(dossier: Dossier): Promise<Dossier>
  get(id: string): Promise<Dossier | null>
  /**
   * Attach the firm only evaluation half after routing (Section 8, Phase 3;
   * AGENTS.md Section 4.2). This is the one write that populates SCPS and the
   * qualification factors as firm facing triage. It happens after the geographic
   * routing decision, never before, so a quality signal can never reach routing
   * (W1). It writes only the evaluation half; the claimant safe half is
   * immutable from assembly.
   */
  attachEvaluation(id: string, evaluation: FirmOnlyEvaluation): Promise<void>
}

/* Resolves a market from a geographic location. Geographic only (W1). No
 * quality signal is reachable through this port. */
export interface MarketResolver {
  resolveByLocation(location: GeographicLocation): Promise<MarketInfo | null>
}

/* Media storage behind signed, expiring URLs. Never public (Section 3, W5). */
export interface MediaStorage {
  put(input: { key: string; body: Uint8Array; contentType: string }): Promise<{ key: string }>
  signedUrl(key: string, expiresInSeconds: number): Promise<string>
}

/* Reflective playback result. Organization of the claimant words, never legal
 * evaluation (Section 6, step 4). It never says strong case. */
export interface PlaybackResult {
  summary: string
  points: string[]
}

/**
 * What the claimant has captured so far in an intake session. The observation a
 * coaching decision is made from: the next best shot depends on what is already
 * in hand (AGENTS.md Section 4.1, why the coaching is a true agent). Carries no
 * evaluative signal, only kinds and counts of captured media.
 */
export interface CaptureInventory {
  /** Photos captured, by kind (wide, vehicle, plate, damage, injury, scene, other). */
  photos: Array<{ kind: string }>
  /** Documents captured, by kind (police-report, insurance-card, other). */
  documents: Array<{ kind: string }>
  voiceCaptured: boolean
  insuranceCardParsed: boolean
}

/**
 * One coaching decision. Photographic and factual direction only, zero legal
 * evaluation (AGENTS.md Section 4.1 hard boundaries). A court reporter, not a
 * judge.
 */
export interface CaptureDirection {
  /** One short procedural instruction for the next capture. */
  direction: string
  /** True when the essential captures are in hand and coaching can stop. */
  done: boolean
  /** Optional category the next shot belongs to (wide, plate, damage, scene, documents). */
  focus?: string
}

/* Claude backed narrative. Contains zero legal evaluation (W2). */
export interface NarrativeClient {
  reflectivePlayback(input: { transcript: string }): Promise<PlaybackResult>
  evidenceCoaching(input: { photosSoFar: number; lastPhotoKind?: string }): Promise<string>
  /**
   * The inventory aware next capture decision that powers the Evidence and
   * Intake Coaching Agent. Given everything captured so far, return the single
   * next photographic or factual direction, or done when the essentials are in
   * hand. Photographic and factual direction only (W2, W6).
   */
  nextCaptureDirection(input: { inventory: CaptureInventory }): Promise<CaptureDirection>
  protectionPlan(input: { summary: string; caseType: string }): Promise<string[]>
}

/* Claude Vision parsing of an insurance card or damage photo. Firm facing intel
 * derived here stays out of claimant projections. */
export interface VisionClient {
  parseInsuranceCard(input: { mediaKey: string }): Promise<Record<string, string>>
}

/* Deepgram voice transcription. */
export interface TranscriptionClient {
  transcribe(input: { mediaKey: string }): Promise<{ transcript: string }>
}

/* TrustedForm certificate on every submission (W7). The certificate is
 * generated client side by the TrustedForm script, so certify records the
 * provided certificate; it generates a placeholder only if none was provided. */
export interface ConsentClient {
  certify(input: {
    submissionId: string
    ipAddress?: string
    userAgent?: string
    providedCertUrl?: string | null
  }): Promise<{ trustedFormUrl: string; consentLanguageVersion: string }>
}

/* Deterministic id and clock ports keep the domain pure and testable. */
export interface IdGenerator {
  sessionId(): string
  claimantId(): string
  dossierId(): string
  eventId(): string
  submissionId(): string
}

export interface Clock {
  nowIso(): string
}

/* The full dependency set an IntakeService instance is constructed with. */
export interface IntakeDeps {
  events: EventStore
  intake: IntakeRepository
  claimants: ClaimantRepository
  dossiers: DossierRepository
  markets: MarketResolver
  media: MediaStorage
  narrative: NarrativeClient
  vision: VisionClient
  transcription: TranscriptionClient
  consent: ConsentClient
  ids: IdGenerator
  clock: Clock
}
