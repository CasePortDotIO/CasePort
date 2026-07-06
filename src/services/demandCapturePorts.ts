import type { Clock, EventStore } from './ports'
import type { AssetStatus, CaptureSurface, CellStatus, CellIgnoreReason } from '@/lib/domain/demandCapture'
import type { AssetStructure } from '@/lib/demand/placement'

/**
 * Ports for the Demand Capture Engine foundation (DEMAND_CAPTURE.md Phase A).
 * The service depends on these interfaces, never on Payload or a surface API
 * directly, matching the domain service layer discipline in ports.ts.
 *
 * Two properties are enforced structurally through these ports:
 *   HL3  funded market gating. The service resolves fundedness only through
 *        FundedMarketResolver; a cell cannot be pursued in an unfunded market.
 *   Section 7  one canonical answer per question, enforced by KeywordRegistry
 *        as a hard pre publish gate.
 */

export interface DemandCaptureIdGenerator {
  cellId(): string
  assetId(): string
}

/**
 * Resolves whether a market is funded (HL3): a firm is assigned to it and that
 * firm's wallet can receive an opportunity. The production adapter reads the
 * markets, firms, and ledger; the fake is set per test. The demand engine never
 * decides fundedness itself, so gating cannot drift from the real wallet state.
 */
export interface FundedMarketResolver {
  isFunded(marketKey: string): Promise<boolean>
  listFunded(): Promise<string[]>
}

/** A geography by case-type by legal-concept unit (Section 10 `demandCells`). */
export interface DemandCellInput {
  /** Stable identity: market:caseType:legalConcept, for example va:mva:contributory-negligence. */
  cellKey: string
  market: string
  caseType: string
  legalConcept: string
  surface: CaptureSurface
  uniqueness: number
  intent: number
}

export interface DemandCellRecord {
  id: string
  cellKey: string
  market: string
  caseType: string
  legalConcept: string
  surface: CaptureSurface
  uniqueness: number
  intent: number
  status: CellStatus
  score: number
  ignoreReason: CellIgnoreReason | null
  fundedMonetizable: boolean
  scoredAt: string
}

export interface DemandCellRepository {
  getByKey(cellKey: string): Promise<DemandCellRecord | null>
  get(id: string): Promise<DemandCellRecord | null>
  save(record: DemandCellRecord): Promise<void>
  list(): Promise<DemandCellRecord[]>
}

/**
 * The keyword ownership registry (Section 7). One canonical answer per question
 * across the whole domain. Ownership is established by publication, so it is a
 * derived view over published capture assets: the owner of a question is the
 * published asset whose canonical question matches. This keeps the registry
 * recomputable (nothing to drift) and makes publication itself the binding
 * claim. A second URL is blocked at its own publish gate.
 */
export interface KeywordOwnership {
  canonicalQuestion: string
  url: string
  assetId: string
}

export interface KeywordRegistry {
  /** The published owner of a canonical question, or null when unowned. */
  owner(canonicalQuestion: string): Promise<KeywordOwnership | null>
}

/** A produced asset or answer (Section 10 `captureAssets`). */
export interface CaptureAssetInput {
  cellKey: string
  surface: CaptureSurface
  canonicalQuestion: string
  url: string
  /** The owning real identity for identity based surfaces (HL2). */
  owningIdentity: string
  title: string
  structure: AssetStructure
}

export interface CaptureAssetRecord {
  id: string
  cellKey: string
  surface: CaptureSurface
  canonicalQuestion: string
  url: string
  owningIdentity: string
  title: string
  structure: AssetStructure
  status: AssetStatus
  approvedBy: string | null
  publishedAt: string | null
  createdAt: string
}

export interface CaptureAssetRepository {
  get(id: string): Promise<CaptureAssetRecord | null>
  save(record: CaptureAssetRecord): Promise<void>
  list(): Promise<CaptureAssetRecord[]>
}

export interface DemandCaptureDeps {
  cells: DemandCellRepository
  assets: CaptureAssetRepository
  registry: KeywordRegistry
  funded: FundedMarketResolver
  events: EventStore
  ids: DemandCaptureIdGenerator
  clock: Clock
}

/** Typed result of the pre publish gate. Never throws on a non compliant asset. */
export interface PublishResult {
  published: boolean
  asset: CaptureAssetRecord | null
  reasons: string[]
}
