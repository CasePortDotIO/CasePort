/**
 * The evaluative set. Compliance rule W2 in CLAUDE.md.
 *
 * These fields are firm facing only. They are computed after routing and
 * delivered as triage. They must never appear in any claimant facing route,
 * response, component, or log. Not once.
 *
 * This registry is the single source of truth for the compliance leak test and
 * for the ComplianceService. Add a field here the moment it becomes evaluative,
 * before it can ever reach a projection. The routing engine (W1) also treats
 * every key here as forbidden input.
 *
 * Keys are normalized (lowercased, non alphanumeric stripped) before matching,
 * so scpsScore, scps_score, and SCPS Score all resolve to the same token.
 */

/** Core evaluative fields named explicitly by W2 in the doctrine. */
export const CORE_EVALUATIVE_FIELDS = [
  'scps',
  'scpsScore',
  'scpsVersion',
  'fiveLqs',
  'fiveLqsReasoning',
  'estimatedValue',
  'estimatedCaseValue',
  'injurySeverity',
  'injurySeverityScore',
  'signedCaseProbability',
] as const

/**
 * Extended evaluative fields. Derived from the Section 5 dossier audience split
 * and from the prototype contract map (docs/PROTOTYPE_CONTRACT_MAP.md). These
 * are the SCPS analogues and firm only triage signals surfaced by the
 * dashboards.
 */
export const EXTENDED_EVALUATIVE_FIELDS = [
  'qualificationScore',
  'qualificationTier',
  'qualificationBreakdown',
  'tier',
  'qualityScore',
  'caseValue',
  'settlementRange',
  'estimatedDamages',
  'estimatedSettlementRange',
  'liabilityAssessment',
  'conversionProbability',
  'signedProbability',
  'caseFitScore',
  'leadScore',
  'responseScore',
  'statuteStatus',
  'insuranceLimits',
  'comparableCases',
  'buyerFitScore',
] as const

export const EVALUATIVE_FIELDS = [
  ...CORE_EVALUATIVE_FIELDS,
  ...EXTENDED_EVALUATIVE_FIELDS,
] as const

export type EvaluativeField = (typeof EVALUATIVE_FIELDS)[number]

/** Normalize a field name to its match token. */
export function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** The normalized token set, computed once. */
export const EVALUATIVE_TOKENS: ReadonlySet<string> = new Set(
  EVALUATIVE_FIELDS.map(normalizeKey),
)

/** True when a single field name is in the evaluative set. */
export function isEvaluativeField(key: string): boolean {
  return EVALUATIVE_TOKENS.has(normalizeKey(key))
}
