import type { Clock, EventStore } from './ports'
import type { AssetStructure } from '@/lib/demand/placement'
import type { B2BTargetStatus, CaptureSurface, OutboundStatus } from '@/lib/domain/demandCapture'

/**
 * Ports for Demand Capture B2B (DEMAND_CAPTURE.md Phase C, Section 5). Two
 * motions: inbound authority drafting and outbound precision. Both are agentic
 * (research and draft) but human published or sent (HL4, HL6). Firms are not
 * protected the way claimants are, so outbound to firms is normal B2B sales, but
 * every draft must be Rule 7.1 clean and every proof of reality is redacted.
 */

export interface B2BIdGenerator {
  targetId(): string
  assetId(): string
}

/** A redacted, representative recent activity item for a market. No PII (HL6). */
export interface MarketActivityItem {
  caseType: string
  market: string
  /** A redacted one line summary. Never a name, email, phone, or address. */
  summary: string
  occurredAt: string
}

/**
 * Reads redacted representative recent activity for a market, the proof of
 * reality that answers the skeptic's only real objection. It is framed as
 * representative, never as a volume guarantee, and it carries no claimant PII.
 */
export interface MarketProofReader {
  recentActivity(market: string, limit: number): Promise<MarketActivityItem[]>
}

/** A target firm in the enumerable universe (Section 10 `b2bTargets`). */
export interface B2BTargetInput {
  firmName: string
  market: string
  partnerName?: string
  revenueBand?: string
}

export interface OutboundDraft {
  subject: string
  body: string
  proof: MarketActivityItem[]
  status: OutboundStatus
  rejectionReason?: string
  sentBy?: string
  sentAt?: string
}

export interface B2BTargetRecord extends B2BTargetInput {
  id: string
  status: B2BTargetStatus
  enriched: boolean
  outbound: OutboundDraft | null
  createdAt: string
}

export interface B2BTargetRepository {
  get(id: string): Promise<B2BTargetRecord | null>
  save(record: B2BTargetRecord): Promise<void>
  list(): Promise<B2BTargetRecord[]>
}

/** Agentic research on a firm and its partner. Public, professional information. */
export interface ProspectResearch {
  firmName: string
  partnerName: string
  notes: string
}
export interface ProspectResearcher {
  research(target: B2BTargetRecord): Promise<ProspectResearch>
}

/** Agentic outreach drafting. Produces a subject and body; a human sends it. */
export interface OutboundDrafter {
  draft(input: {
    target: B2BTargetRecord
    research: ProspectResearch
    proof: MarketActivityItem[]
  }): Promise<{ subject: string; body: string }>
}

/** Persists an authority draft as a capture asset on a B2B surface. */
export interface CaptureAssetWriter {
  create(input: {
    cellKey: string
    surface: CaptureSurface
    canonicalQuestion: string
    url: string
    owningIdentity: string
    title: string
    structure: AssetStructure
    status: 'draft' | 'pending-approval'
  }): Promise<{ id: string }>
}

export interface B2BCaptureDeps {
  targets: B2BTargetRepository
  assets: CaptureAssetWriter
  proof: MarketProofReader
  researcher: ProspectResearcher
  drafter: OutboundDrafter
  events: EventStore
  ids: B2BIdGenerator
  clock: Clock
}

export interface DraftOutboundResult {
  ok: boolean
  target: B2BTargetRecord | null
  reasons: string[]
}
