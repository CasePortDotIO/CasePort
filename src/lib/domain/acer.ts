/**
 * ACER, locked. CLAUDE.md Section 15 item 1 flagged that ACER was defined three
 * ways across the source documents. This is the decision, and it is the single
 * source of truth for the number everywhere it appears:
 *
 *   ACER = Acquisition Cost Efficiency Ratio = a firm's true cost per signed case
 *        = total fixed fees the firm actually paid for delivered opportunities
 *          divided by the number of those cases the firm signed.
 *
 * Why this one. The other two candidates (Average Case Economic Return, and
 * signed over delivered as a bare ratio) either require settlement dollars we do
 * not hold, or produce a unitless rate that does not answer the question the
 * managing partner actually asks: what does a signed case cost me here versus
 * what it costs me through Google Ads and shared leads. Cost per signed case is
 * denominated in dollars, computed only from facts we hold (our own ledger
 * debits and the firm's reported outcomes), and it is the number the firm came
 * for. So that is the locked definition.
 *
 * Direction of data flow (W4). Billing reads into intelligence here, which is
 * allowed and intended: fees paid are an input to ACER. The reverse, an outcome
 * changing a fee, is forbidden and lives nowhere. A signed case never changes
 * what a delivery cost.
 *
 * Reciprocity. The number is unknowable until the firm reports what signed. A
 * firm that has paid for deliveries but reported nothing sees ACER locked, with
 * the honest reason: reporting outcomes unlocks it. We never estimate it.
 */

/** A signed case is one the firm retained or that has settled. Declined and
 * still-evaluating outcomes are not signed. */
export type AcerOutcomeResult = 'retained' | 'settled' | 'declined' | 'still-evaluating' | string

export interface AcerInput {
  /** Fixed fees the firm actually paid for delivered opportunities, in cents. */
  feesPaidCents: number
  /** The firm's reported outcome results. Order and count only; values classify. */
  outcomeResults: AcerOutcomeResult[]
}

export interface Acer {
  feesPaidCents: number
  signedCases: number
  /** The locked number: true cost per signed case, in cents. Null when unknowable. */
  costPerSignedCaseCents: number | null
  /** True once the firm has reported any outcome. */
  reported: boolean
  /** True when fees were paid but no outcome was reported, so ACER cannot be
   * computed. The reciprocity gate: reporting unlocks the number. */
  locked: boolean
}

/** Whether an outcome result counts as a signed case for ACER. */
export function isSignedOutcome(result: AcerOutcomeResult): boolean {
  return result === 'retained' || result === 'settled'
}

/**
 * The canonical ACER computation. Every surface that shows a firm's cost per
 * signed case calls this, so the definition can never drift between the
 * dashboard, the API, and the closing kit.
 */
export function computeAcer(input: AcerInput): Acer {
  const feesPaidCents = Math.max(0, Math.round(input.feesPaidCents))
  const reported = input.outcomeResults.length > 0
  const signedCases = input.outcomeResults.filter(isSignedOutcome).length
  return {
    feesPaidCents,
    signedCases,
    costPerSignedCaseCents: signedCases > 0 ? Math.round(feesPaidCents / signedCases) : null,
    reported,
    locked: feesPaidCents > 0 && !reported,
  }
}
