/**
 * Shared domain constants for the CasePort Demand Capture Engine
 * (DEMAND_CAPTURE.md). Single source of truth for the surfaces, the cell and
 * asset lifecycle, the deterministic placement rules (Section 7), and the
 * routing destinations (Section 8).
 *
 * The engine harvests, never intercepts (Section 1). Nothing here reaches an
 * injured person; every constant serves presence and self-initiation. The
 * engine lives in the intelligence and reach layers and is recomputable (H4 of
 * INTELLIGENCE_CORE.md); none of it is a source of truth for a case fact.
 */

/**
 * The capture surfaces (Section 4 and Section 5). Each carries which side of
 * the business it serves and whether it is identity based. Identity based
 * surfaces require a real named identity and a human publisher (HL2, HL4).
 */
export const CAPTURE_SURFACES = [
  // B2C demand harvesting (Section 4), ranked by intent density over competition.
  { value: 'answer-engine', label: 'AI Answer Engines', side: 'b2c', identityBased: false },
  { value: 'search', label: 'Search (programmatic geo pages)', side: 'b2c', identityBased: false },
  { value: 'question-platform', label: 'Question Platforms (Quora, Justia)', side: 'b2c', identityBased: true },
  { value: 'voice-search', label: 'Voice Search', side: 'b2c', identityBased: false },
  { value: 'video', label: 'Video (YouTube, short form)', side: 'b2c', identityBased: true },
  { value: 'local-community', label: 'Local and Community', side: 'b2c', identityBased: true },
  // B2B demand capture (Section 5).
  { value: 'trade-press', label: 'Legal Trade Press and Syndication', side: 'b2b', identityBased: true },
  { value: 'expert-citation', label: 'Expert Citation Platforms', side: 'b2b', identityBased: true },
  { value: 'repository', label: 'Academic and Credibility Repositories', side: 'b2b', identityBased: true },
  { value: 'linkedin', label: 'LinkedIn Thought Leadership', side: 'b2b', identityBased: true },
] as const

export type CaptureSurface = (typeof CAPTURE_SURFACES)[number]['value']
export type BusinessSide = 'b2c' | 'b2b'

export const IDENTITY_BASED_SURFACES: ReadonlySet<CaptureSurface> = new Set(
  CAPTURE_SURFACES.filter((s) => s.identityBased).map((s) => s.value),
)
export const surfaceSide = (surface: CaptureSurface): BusinessSide =>
  (CAPTURE_SURFACES.find((s) => s.value === surface)?.side as BusinessSide) ?? 'b2c'

/**
 * Demand cell pursue or ignore status (Section 6). A cell is pursued only when
 * all three of uniqueness, distinct intent, and funded monetizability hold.
 * Everything else is a vanity cell and is ignored.
 */
export const CELL_STATUSES = [
  { value: 'pursue', label: 'Pursue' },
  { value: 'ignore', label: 'Ignore' },
] as const
export type CellStatus = (typeof CELL_STATUSES)[number]['value']

/** Why a scored cell is ignored. Recorded so the deprioritization is auditable. */
export const CELL_IGNORE_REASONS = [
  { value: 'unfunded-market', label: 'Market is not funded (HL3)' },
  { value: 'not-unique', label: 'Nothing uniquely better to say' },
  { value: 'low-intent', label: 'No distinct high intent' },
] as const
export type CellIgnoreReason = (typeof CELL_IGNORE_REASONS)[number]['value']

/**
 * Capture asset lifecycle (Section 10). A human publishes anything under a real
 * identity (HL4), so an asset never jumps from draft to published without an
 * approver.
 */
export const ASSET_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending-approval', label: 'Pending Approval' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
] as const
export type AssetStatus = (typeof ASSET_STATUSES)[number]['value']

/**
 * Deterministic placement thresholds (Section 7). Direct answer blocks are
 * engineered for answer engine extraction; word counts are hard bounds.
 */
export const DIRECT_ANSWER_LIMITS = {
  /** Answer engine citation summary. */
  aeoSummary: { min: 100, max: 150 },
  /** FAQ answer block. */
  faqAnswer: { min: 55, max: 75 },
} as const

/** The target keyword must appear naturally within the first N words of body. */
export const KEYWORD_WINDOW_WORDS = 300

/**
 * Routing destinations (Section 8). Every captured intent routes to self
 * initiation; no path routes to a call.
 */
export const INTAKE_PATH = '/checkmycase'
export const INTAKE_URL = 'caseport.io/checkmycase'
/** The one permitted claimant call to action. */
export const INTAKE_CTA = 'Send my information'
/** Prohibited claimant calls to action (W6, Section 8). */
export const PROHIBITED_INTAKE_CTAS = [
  'free case review',
  'case review',
  'case evaluation',
  'free consultation',
  'free case evaluation',
] as const

/** B2B routing by reader psychology (Section 8). */
export const B2B_ROUTES = {
  painAwareness: '/markets',
  financialOrVendorEvaluation: '/request-access',
} as const

/**
 * B2B target lifecycle (Section 5, Section 10 `b2bTargets`). The enumerable firm
 * universe moves from added, through enrichment and research, to a drafted
 * outreach pending a human send (HL4, HL6).
 */
export const B2B_TARGET_STATUSES = [
  { value: 'added', label: 'Added' },
  { value: 'enriched', label: 'Enriched' },
  { value: 'drafted', label: 'Outreach Drafted' },
  { value: 'sent', label: 'Sent' },
] as const
export type B2BTargetStatus = (typeof B2B_TARGET_STATUSES)[number]['value']

/** Outbound draft lifecycle. A human sends; a non compliant draft is rejected. */
export const OUTBOUND_STATUSES = [
  { value: 'pending-send', label: 'Pending Human Send' },
  { value: 'rejected', label: 'Rejected (Rule 7.1)' },
  { value: 'sent', label: 'Sent' },
] as const
export type OutboundStatus = (typeof OUTBOUND_STATUSES)[number]['value']

/**
 * The non recommendation words that may never appear on a public surface (HL5,
 * W6). These are content tokens, distinct from the evaluative field key guard
 * in src/lib/compliance/evaluativeFields.ts.
 */
export const PROHIBITED_PUBLIC_TERMS = [
  'approved',
  'vetted',
  'qualified',
  'pre-screened',
  'prescreened',
  'top-rated',
  'top rated',
  'best-rated',
  'matched',
  'selected',
  'hand-picked',
  'handpicked',
] as const

/** Evaluative signals that are firm facing only and never public (W2, HL5). */
export const PROHIBITED_PUBLIC_EVALUATIVE = [
  'scps',
  'case value',
  'estimated case value',
  'signed-case probability',
  'signed case probability',
  'settlement value',
] as const

/**
 * Guarantee and outcome promise language. B2B outbound must be Rule 7.1 clean
 * and no public surface promises an outcome (HL5, HL6). These never appear.
 */
export const PROHIBITED_GUARANTEE_TERMS = [
  'guarantee',
  'guaranteed',
  'we win or you pay nothing',
  'you will win',
  'you will recover',
  'assured settlement',
  'promise you',
] as const

/**
 * Legal advice and case merit language. The author is not a lawyer and content
 * is educational (HL5). A public asset never tells a specific reader they have a
 * case, how strong it is, or what to do about it.
 */
export const PROHIBITED_ADVICE_TERMS = [
  'strong case',
  'you have a case',
  'you have a strong',
  'you should sue',
  'we recommend you',
  'your case is worth',
] as const
