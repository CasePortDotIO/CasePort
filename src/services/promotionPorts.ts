import type { Clock, EventStore } from './ports'
import type { PromotionStatus, PromotionType } from '@/lib/domain/intelligenceCore'

/**
 * Ports for the CIC promotion gates (INTELLIGENCE_CORE.md Phase F, Section 7, H1).
 * The CIC updates its own knowledge autonomously, but it never promotes a change
 * to production scoring, pricing, or routing without a human approval gate. Every
 * promotion is logged with the approver, the timestamp, the model version, and
 * the evidence. The human gate is the moat, not a speed bump: a scoring or
 * pricing engine that rewrites itself silently breaks reproducibility, the Glass
 * Box promise, and the compliance audit trail.
 */

export interface PromotionIdGenerator {
  promotionId(): string
  versionId(): string
}

/** One human approval on a promotion, appended to the log (Section 10 `promotionLog`). */
export interface Approval {
  approver: string
  at: string
}

/** A proposed production change awaiting the human gate. */
export interface PromotionInput {
  type: PromotionType
  summary: string
  /** The concrete change: the new SCPS weights, the price cells, the market, etc. */
  proposedChange: Record<string, unknown>
  /** What justifies it: source signal ids, a recommendation id, the data window. */
  evidence: Record<string, unknown>
  proposedBy: string
}

export interface PromotionRecord extends PromotionInput {
  id: string
  status: PromotionStatus
  requiredApprovers: number
  approvals: Approval[]
  /** The model version this promotion produced, once promoted. */
  versionId: string | null
  rejectionReason?: string
  createdAt: string
  decidedAt: string | null
}

export interface PromotionRepository {
  get(id: string): Promise<PromotionRecord | null>
  save(record: PromotionRecord): Promise<void>
  list(): Promise<PromotionRecord[]>
}

/** A versioned production value produced by a promoted change (Section 10 `modelVersions`). */
export interface ModelVersionInput {
  type: PromotionType
  version: string
  value: Record<string, unknown>
  /** The data window the value was learned from. */
  dataWindow: string
  promotionId: string
  approvedBy: string[]
  createdAt: string
}
export interface ModelVersionRecord extends ModelVersionInput {
  id: string
}
export interface ModelVersionRepository {
  save(record: ModelVersionRecord): Promise<void>
  latestVersion(type: PromotionType): Promise<number>
  list(): Promise<ModelVersionRecord[]>
}

export interface PromotionDeps {
  promotions: PromotionRepository
  versions: ModelVersionRepository
  events: EventStore
  ids: PromotionIdGenerator
  clock: Clock
}

export interface PromotionResult {
  promotion: PromotionRecord | null
  /** True on the approval that crossed the required threshold and promoted. */
  promoted: boolean
  reasons: string[]
}
