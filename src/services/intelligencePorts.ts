import type { AttributionTuple, Clock, EventStore, IdGenerator } from './ports'
import type { LedgerRepository } from './walletPorts'
import type { ScpsFactors, ScpsModel, ScpsSample } from './scps'

/**
 * Ports for the outcome loop and the intelligence layer (Section 4, 9, 11).
 *
 * The single most important compliance property here is W4: outcome data flows
 * into intelligence, never into billing. That is enforced structurally.
 * OutcomeDeps has no ledger or wallet port, so there is no channel through which
 * reporting an outcome could move money. The intelligence layer may read the
 * ledger (cost per signed case is a firm facing metric), but never writes it.
 */

export type OutcomeResult = 'retained' | 'not-retained' | 'still-evaluating' | 'settled'

export interface OutcomeRecordInput {
  deliveryId: string
  firmId: string
  result: OutcomeResult
  reasonCode?: string
  settlementValueCents?: number
  reportedAt: string
}

export interface StoredOutcome extends OutcomeRecordInput {
  id: string
}

export interface OutcomeRepository {
  create(input: OutcomeRecordInput): Promise<StoredOutcome>
  get(id: string): Promise<StoredOutcome | null>
  listByFirm(firmId: string): Promise<StoredOutcome[]>
  listAll(): Promise<StoredOutcome[]>
}

/**
 * The versioned SCPS model store. Append only in weights: recalibration saves a
 * new version, it never mutates an existing model's weights, so every historical
 * score stays reproducible against the model that produced it. The one permitted
 * mutation is the lifecycle status, flipped only by an explicit human promotion
 * (AGENTS.md Section 4.6), which never changes weights and so cannot alter any
 * past score.
 */
export interface ScpsModelRepository {
  /** The highest version whose status is 'active'. The model that scores. */
  active(): Promise<ScpsModel | null>
  get(version: string): Promise<ScpsModel | null>
  save(model: ScpsModel): Promise<void>
  list(): Promise<ScpsModel[]>
  /**
   * Promote a proposed version to active. Flips status only; weights are never
   * touched. Returns the promoted model, or null if the version does not exist.
   * The human in the loop gate: nothing but this call makes a new version score.
   */
  promote(version: string): Promise<ScpsModel | null>
}

export interface ScpsScoreInput {
  dossierId: string
  modelVersion: string
  score: number
  factors: ScpsFactors
  computedAt: string
}

export interface ScpsScoreRepository {
  append(input: ScpsScoreInput): Promise<{ id: string }>
  latestForDossier(dossierId: string): Promise<{ score: number; modelVersion: string; factors: ScpsFactors } | null>
}

/** Joins outcomes to the factors of the dossier they came from, for recalibration. */
export interface RecalibrationReader {
  signedCaseSamples(): Promise<ScpsSample[]>
}

/**
 * The attribution trace reader (Section 11). Walks the chain a signed case dollar
 * came through: outcome to delivery to dossier to intake session, where the
 * immutable first touch tuple lives. Each hop is a direct reference captured at
 * creation, not a reconstructed join.
 */
export interface TraceOutcome {
  id: string
  deliveryId: string
  firmId: string
  result: OutcomeResult
  settlementValueCents?: number
}
export interface TraceDelivery {
  id: string
  dossierId: string
  firmId: string
}
export interface TraceDossier {
  id: string
  market: string
  caseType: string
  intakeSessionId: string | null
}
export interface TraceSession {
  id: string
  marketId: string | null
  attribution: AttributionTuple
}

export interface TraceReader {
  outcome(id: string): Promise<TraceOutcome | null>
  delivery(id: string): Promise<TraceDelivery | null>
  dossier(id: string): Promise<TraceDossier | null>
  intakeSession(id: string): Promise<TraceSession | null>
}

/**
 * Dependencies for the outcome service. Note the absence of any ledger or wallet
 * port: reporting an outcome cannot, by construction, move money (W4).
 */
export interface OutcomeDeps {
  outcomes: OutcomeRepository
  events: EventStore
  ids: IdGenerator
  clock: Clock
}

/** Dependencies for the intelligence layer. May read the ledger, never writes it. */
export interface IntelligenceDeps {
  outcomes: OutcomeRepository
  models: ScpsModelRepository
  scores: ScpsScoreRepository
  samples: RecalibrationReader
  trace: TraceReader
  events: EventStore
  ids: IdGenerator
  clock: Clock
  /** Read only, for the ACER cost per signed case metric. Never mutated. */
  ledger: Pick<LedgerRepository, 'listByFirm'>
}
