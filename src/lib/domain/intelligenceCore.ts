/**
 * Shared domain constants for the CasePort Intelligence Core (CIC).
 * Single source of truth for the epistemic vocabulary described in
 * INTELLIGENCE_CORE.md: reliability ratings, the four intelligence domains, the
 * source and signal lifecycle states, and the prohibited source discipline.
 *
 * The CIC lives entirely in the system of intelligence (H4). Nothing here is a
 * source of truth for a fact; every value is derived, dated, and recomputable
 * from the event log and the source registry.
 */

/**
 * Reliability rating (H5, inherited from the CasePort Data Standards source
 * discipline). Every external signal carries one. A signal never outranks its
 * source, so the rating is inherited from the source at ingestion.
 *
 *   A  primary or institutional (a state bar opinion, an ABA rule, a statute)
 *   B  industry research (Semrush trends, enrichment firmographics, benchmarks)
 *   C  synthesized or estimated (a modeled figure, a competitor inference)
 */
export const RELIABILITY_RATINGS = [
  { label: 'A. Primary or Institutional', value: 'A' },
  { label: 'B. Industry Research', value: 'B' },
  { label: 'C. Synthesized or Estimated', value: 'C' },
] as const

export type ReliabilityRating = (typeof RELIABILITY_RATINGS)[number]['value']

/** Ordinal for comparison. A is the most reliable. Lower number is better. */
export const RELIABILITY_ORDER: Record<ReliabilityRating, number> = { A: 0, B: 1, C: 2 }

/**
 * The four intelligence domains (Section 4). Every source and every signal is
 * tagged to at least one so the per-domain synthesis agents (Phase C) can read
 * only what they own.
 */
export const INTELLIGENCE_DOMAINS = [
  { label: 'Demand and B2C', value: 'demand' },
  { label: 'Supply and B2B', value: 'supply' },
  { label: 'Regulatory and Compliance', value: 'regulatory' },
  { label: 'Market and Competitive', value: 'market' },
] as const

export type IntelligenceDomain = (typeof INTELLIGENCE_DOMAINS)[number]['value']

/**
 * Whether a signal describes owned first party data (carried by the attribution
 * tuple) or rented external intelligence (Section 1). The join key across both
 * is always the attribution tuple.
 */
export const SIGNAL_ORIGINS = [
  { label: 'Owned (first party, attribution tuple)', value: 'owned' },
  { label: 'Rented (external, allowlisted source)', value: 'rented' },
] as const

export type SignalOrigin = (typeof SIGNAL_ORIGINS)[number]['value']

/**
 * Source lifecycle. New sources are added through human review, never
 * auto-trusted (Section 5). A source can be retired without deleting its
 * history. A prohibited source can never ingest (H5).
 */
export const SOURCE_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Retired', value: 'retired' },
  { label: 'Prohibited', value: 'prohibited' },
] as const

export type SourceStatus = (typeof SOURCE_STATUSES)[number]['value']

/**
 * Signal lifecycle. A signal is superseded, not deleted, when a newer figure
 * for the same claim arrives (Section 5). A stale figure that arrives after a
 * newer one is stored as superseded on arrival so the audit trail is complete.
 * A duplicate is never stored twice.
 */
export const SIGNAL_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Superseded', value: 'superseded' },
] as const

export type SignalStatus = (typeof SIGNAL_STATUSES)[number]['value']

/**
 * Why an ingestion attempt was rejected at the epistemic gate. Rejections are
 * evented too (Section 11: every CIC action emits an event and is replayable),
 * so an attempt to ingest from an unlisted or prohibited source is auditable.
 */
export const SIGNAL_REJECTION_REASONS = [
  { label: 'Source not in registry', value: 'unlisted-source' },
  { label: 'Source prohibited or not active', value: 'prohibited-source' },
  { label: 'Missing observation date', value: 'missing-observed-at' },
  { label: 'Missing claim body', value: 'missing-claim' },
] as const

export type SignalRejectionReason = (typeof SIGNAL_REJECTION_REASONS)[number]['value']

/**
 * The outcome of an ingestion attempt. The gate never throws on a bad signal:
 * it returns a typed disposition so ingestion workflows (Phase B) stay durable
 * and observable rather than failing a step on untrusted input.
 */
export const SIGNAL_DISPOSITIONS = [
  'ingested',
  'duplicate',
  'superseded-on-arrival',
  'rejected',
] as const

export type SignalDisposition = (typeof SIGNAL_DISPOSITIONS)[number]

/**
 * Production promotion types (INTELLIGENCE_CORE.md Phase F, H1). The CIC may
 * propose a change to a production value; a human promotes it. Every promotion
 * is logged with the approver, the timestamp, the model version, and the
 * evidence. Nothing changes production silently.
 */
export const PROMOTION_TYPES = [
  { value: 'scps-version', label: 'SCPS Model Version' },
  { value: 'price-change', label: 'Flat Price Table Change' },
  { value: 'qualification-weights', label: 'Qualification Signal Weights' },
  { value: 'market-action', label: 'Market Entry or Exit' },
] as const
export type PromotionType = (typeof PROMOTION_TYPES)[number]['value']

/**
 * The approver policy (decision D8, provisional). How many distinct human
 * approvers a promotion type requires before it can change production. A market
 * action requires two because a hallucinated opinion that triggers a market exit
 * is costly and a missed real one is fatal; the rest require one.
 */
export const REQUIRED_APPROVERS: Record<PromotionType, number> = {
  'scps-version': 1,
  'price-change': 1,
  'qualification-weights': 1,
  'market-action': 2,
}

export const PROMOTION_STATUSES = [
  { value: 'pending', label: 'Pending Approval' },
  { value: 'promoted', label: 'Promoted' },
  { value: 'rejected', label: 'Rejected' },
] as const
export type PromotionStatus = (typeof PROMOTION_STATUSES)[number]['value']
