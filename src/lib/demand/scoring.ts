import type { CellIgnoreReason, CellStatus } from '@/lib/domain/demandCapture'

/**
 * Defensible data cell scoring (DEMAND_CAPTURE.md Section 6). Volume is a trap.
 * A cell is worth pursuing only when all three hold:
 *
 *   1. uniqueness   CasePort can say something uniquely or better than any
 *                   other source about this cell.
 *   2. intent       a distinct high intent exists for it.
 *   3. funded       a funded firm in this market can monetize the result (HL3).
 *
 * High volume in an unfunded market scores zero. High volume with nothing unique
 * to say scores zero. Funded market gating is a hard gate, not a weight, so it
 * is impossible for a vanity cell to score above zero. The CIC later aims the
 * engine among the pursued cells by expected converted value; this function
 * decides only pursue or ignore and a comparable base score.
 */
export interface CellScoreInput {
  /** Can CasePort say something uniquely or better here. 0 to 1. */
  uniqueness: number
  /** Distinct high intent for this cell. 0 to 1. */
  intent: number
  /** Whether a funded firm in this market can monetize the result. */
  fundedMonetizable: boolean
}

export interface CellScore {
  status: CellStatus
  /** Base score in 0 to 1. Zero whenever any gate fails. Never volume derived. */
  score: number
  ignoreReason: CellIgnoreReason | null
}

/** A dimension at or above this is strong enough to pursue on that axis. */
export const PURSUE_THRESHOLD = 0.5

const clamp01 = (n: number): number => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0)

export function scoreDemandCell(input: CellScoreInput): CellScore {
  const uniqueness = clamp01(input.uniqueness)
  const intent = clamp01(input.intent)

  // Funded market gating first (HL3). No compliant place to land, no pursuit.
  if (!input.fundedMonetizable) {
    return { status: 'ignore', score: 0, ignoreReason: 'unfunded-market' }
  }
  if (uniqueness < PURSUE_THRESHOLD) {
    return { status: 'ignore', score: 0, ignoreReason: 'not-unique' }
  }
  if (intent < PURSUE_THRESHOLD) {
    return { status: 'ignore', score: 0, ignoreReason: 'low-intent' }
  }

  // Pursued. Base score is the product of the two quality axes, never volume.
  return { status: 'pursue', score: Number((uniqueness * intent).toFixed(4)), ignoreReason: null }
}
