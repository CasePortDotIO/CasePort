import type { Clock, EventStore } from './ports'
import type {
  IntelligenceDomain,
  ReliabilityRating,
  SignalDisposition,
  SignalOrigin,
  SignalRejectionReason,
  SignalStatus,
  SourceStatus,
} from '@/lib/domain/intelligenceCore'

/**
 * Ports for the CasePort Intelligence Core foundation (INTELLIGENCE_CORE.md
 * Phase A). The CIC service depends on these interfaces, never on Payload or an
 * external API directly, matching the domain service layer discipline in
 * ports.ts. Production adapters back them with Payload; in memory fakes back
 * them for tests, so the epistemic gate is exercised without a live database.
 *
 * The single most important property enforced here is H5: nothing from a
 * prohibited or unlisted source can enter. The registry is the allowlist, and
 * the signal store is reachable only through the gate in IntelligenceCoreService.
 */

/** Id generation for CIC aggregates. Kept separate from the intake IdGenerator. */
export interface CicIdGenerator {
  sourceId(): string
  signalId(): string
}

/**
 * A registered source (Section 5, Section 10 `intelligenceSources`). Added
 * through human review, never auto-trusted. Carries its reliability rating, the
 * domains it feeds, and its lifecycle status. `sourceKey` is the stable
 * ingestion handle (for example `semrush-mcp`, `va-bar-ethics`).
 */
export interface SourceRecordInput {
  sourceKey: string
  name: string
  origin: SignalOrigin
  reliability: ReliabilityRating
  domains: IntelligenceDomain[]
  status?: SourceStatus
  /** The human who reviewed and approved the source. Never a system actor. */
  addedBy: string
  notes?: string
}

export interface SourceRecord extends SourceRecordInput {
  id: string
  status: SourceStatus
  registeredAt: string
  lastCheckedAt: string | null
}

export interface SourceRegistryRepository {
  /** Look up a source by its stable ingestion key. Null when unlisted. */
  getByKey(sourceKey: string): Promise<SourceRecord | null>
  get(id: string): Promise<SourceRecord | null>
  save(record: SourceRecord): Promise<void>
  /** Record that a source was polled, without changing trust. */
  touch(id: string, atIso: string): Promise<void>
  list(): Promise<SourceRecord[]>
}

/**
 * A single ingested signal (Section 5, Section 10 `intelligenceSignals`). Dated,
 * source linked, domain tagged, deduplicated, and supersession aware.
 *
 *   dedupKey    identity of the claim this signal makes (normalized claim plus
 *               metric plus geography). Two signals with the same dedupKey are
 *               the same claim observed at possibly different times.
 *   observedAt  the date the figure is true as of. Drives supersession: a newer
 *               observation supersedes an older one for the same dedupKey.
 *   claim       the human readable statement. Required; a signal with no body is
 *               rejected rather than stored (H5: never assert an empty figure).
 */
export interface SignalIngestInput {
  sourceKey: string
  domain: IntelligenceDomain
  dedupKey: string
  claim: string
  observedAt: string
  /** Structured payload behind the claim: the metric, geography, value, units. */
  data?: Record<string, unknown>
  /** Reference to the attribution tuple for owned signals; absent for rented. */
  attributionRef?: string
}

export interface SignalRecordInput {
  sourceId: string
  sourceKey: string
  origin: SignalOrigin
  reliability: ReliabilityRating
  domain: IntelligenceDomain
  dedupKey: string
  claim: string
  observedAt: string
  ingestedAt: string
  status: SignalStatus
  data?: Record<string, unknown>
  attributionRef?: string
  /** Set when this signal is superseded by a newer one, or superseded on arrival. */
  supersededById?: string
  supersededAt?: string
}

export interface SignalRecord extends SignalRecordInput {
  id: string
}

export interface SignalStore {
  append(input: SignalRecordInput): Promise<SignalRecord>
  get(id: string): Promise<SignalRecord | null>
  /** The active signal for a claim, if any. At most one is active per dedupKey. */
  activeByDedupKey(dedupKey: string): Promise<SignalRecord | null>
  /** Every signal for a claim, active and superseded, oldest first. */
  historyByDedupKey(dedupKey: string): Promise<SignalRecord[]>
  markSuperseded(id: string, bySignalId: string, atIso: string): Promise<void>
  list(): Promise<SignalRecord[]>
}

export interface IntelligenceCoreDeps {
  sources: SourceRegistryRepository
  signals: SignalStore
  events: EventStore
  ids: CicIdGenerator
  clock: Clock
}

/** The typed disposition returned by the ingestion gate. Never throws on input. */
export interface IngestResult {
  disposition: SignalDisposition
  signal: SignalRecord | null
  /** The signal this one superseded (newer wins) or the one it duplicated. */
  supersededSignalId?: string
  duplicateOfSignalId?: string
  rejectionReason?: SignalRejectionReason
}
