import { recalibrate, scpsScore, type ScpsModel, type ScpsSample, SCPS_FACTOR_KEYS } from './scps'

/**
 * The SCPS experimentation harness. Before a human promotes a proposed SCPS
 * version (AGENTS.md Section 4.6), this quantifies whether the proposal actually
 * ranks signed cases better than the active model, out of sample, so promotion
 * is an evidence backed decision and not a judgment call. Every number here is
 * reproducible, so the promotion record is audit defensible: a scorer you can
 * prove improved is a moat you can defend.
 *
 * The metric is AUC (area under the ROC curve), computed exactly as the
 * concordance probability: over every (signed, declined) pair, the fraction
 * where the signed case scored higher (ties count as half). AUC is precisely
 * "how well does this score separate signed cases from declined ones." 0.5 is a
 * coin flip; 1.0 is perfect separation. It is the honest, standard measure of a
 * ranking model, and it needs no library: pure, deterministic, testable.
 *
 * The proposed model is evaluated two ways:
 *   - in sample: recalibrate on all outcomes, score all outcomes. Optimistic, so
 *     it is reported but never the basis for a decision.
 *   - cross validated: deterministic k folds; recalibrate on the training folds,
 *     score the held out fold, pool the held out predictions, compute AUC once.
 *     This is the out of sample estimate, the number that actually matters.
 */

/** Exact AUC as the concordance probability. Null when it cannot be measured
 * (no signed or no declined cases: there is no pair to rank). */
export function auc(scored: Array<{ score: number; signed: boolean }>): number | null {
  const pos = scored.filter((s) => s.signed).map((s) => s.score)
  const neg = scored.filter((s) => !s.signed).map((s) => s.score)
  if (pos.length === 0 || neg.length === 0) return null
  let concordant = 0
  for (const p of pos) {
    for (const n of neg) {
      if (p > n) concordant += 1
      else if (p === n) concordant += 0.5
    }
  }
  return concordant / (pos.length * neg.length)
}

/** Score every sample under a model and measure its AUC. */
export function evaluateModel(model: ScpsModel, samples: ScpsSample[]): { auc: number | null; n: number; signed: number; declined: number } {
  const scored = samples.map((s) => ({ score: scpsScore(model, s.factors), signed: s.signed }))
  const signed = samples.filter((s) => s.signed).length
  return { auc: auc(scored), n: samples.length, signed, declined: samples.length - signed }
}

/**
 * Cross validated out of sample AUC for a recalibration. Deterministic k fold
 * (fold = index mod k), so the backtest is reproducible and auditable. For each
 * fold, recalibrate on the other folds and score the held out fold; pool all
 * held out predictions and compute AUC once. That pooled number is how well the
 * recalibration generalizes to cases it never saw.
 */
export function crossValidatedAuc(prev: ScpsModel, samples: ScpsSample[], k: number): number | null {
  const folds = Math.max(2, Math.min(k, samples.length))
  if (samples.length < folds) return null
  const heldOut: Array<{ score: number; signed: boolean }> = []
  for (let f = 0; f < folds; f++) {
    const train = samples.filter((_, i) => i % folds !== f)
    const test = samples.filter((_, i) => i % folds === f)
    if (test.length === 0) continue
    // Recalibrate on the training folds only; the held out fold is unseen.
    const model = recalibrate(prev, train, 'cv', prev.createdAt)
    for (const s of test) heldOut.push({ score: scpsScore(model, s.factors), signed: s.signed })
  }
  return auc(heldOut)
}

export interface WeightChange {
  factor: string
  from: number
  to: number
  delta: number
}

export interface RecalibrationEvaluation {
  sampleCount: number
  signedCount: number
  declinedCount: number
  /** AUC of the current active model on the outcomes. The baseline to beat. */
  activeAuc: number | null
  /** AUC of the proposed model on the data it was fit to. Optimistic. */
  proposedInSampleAuc: number | null
  /** Out of sample AUC of the recalibration. The number that matters. */
  proposedCrossValAuc: number | null
  /** Out of sample lift over the active model. Positive means the proposal
   * ranks signed cases better on cases it never saw. Null when unmeasurable. */
  crossValLift: number | null
  /** How each factor weight moved from the active model to the proposal. */
  weightChanges: WeightChange[]
  /** A plain, honest recommendation for the human, never an auto decision. */
  recommendation: 'promote' | 'hold' | 'insufficient-data'
  folds: number
}

/** Round to 4 decimals for stable reporting. */
const r4 = (n: number | null): number | null => (n == null ? null : Math.round(n * 10_000) / 10_000)

/**
 * Evaluate a proposed recalibration against the active model. Pure and
 * deterministic. Produces the evidence a human weighs before promoting.
 *
 * The recommendation is advisory only (human in the loop is mandatory, Section
 * 3): 'promote' when there are enough signed and declined cases and the out of
 * sample lift clears a margin; 'hold' when the proposal does not beat the active
 * model out of sample; 'insufficient-data' when AUC cannot be measured at all.
 */
export function evaluateRecalibration(
  active: ScpsModel,
  proposed: ScpsModel,
  samples: ScpsSample[],
  k = 5,
  liftMargin = 0.01,
): RecalibrationEvaluation {
  const signedCount = samples.filter((s) => s.signed).length
  const declinedCount = samples.length - signedCount

  const activeAuc = evaluateModel(active, samples).auc
  const proposedInSampleAuc = evaluateModel(proposed, samples).auc
  const proposedCrossValAuc = crossValidatedAuc(active, samples, k)
  const crossValLift = activeAuc != null && proposedCrossValAuc != null ? proposedCrossValAuc - activeAuc : null

  const weightChanges: WeightChange[] = SCPS_FACTOR_KEYS.map((key) => ({
    factor: key,
    from: r4(active.weights[key]) as number,
    to: r4(proposed.weights[key]) as number,
    delta: r4(proposed.weights[key] - active.weights[key]) as number,
  }))

  let recommendation: RecalibrationEvaluation['recommendation']
  if (signedCount === 0 || declinedCount === 0 || proposedCrossValAuc == null) {
    recommendation = 'insufficient-data'
  } else if (crossValLift != null && crossValLift >= liftMargin) {
    recommendation = 'promote'
  } else {
    recommendation = 'hold'
  }

  return {
    sampleCount: samples.length,
    signedCount,
    declinedCount,
    activeAuc: r4(activeAuc),
    proposedInSampleAuc: r4(proposedInSampleAuc),
    proposedCrossValAuc: r4(proposedCrossValAuc),
    crossValLift: r4(crossValLift),
    weightChanges,
    recommendation,
    folds: Math.max(2, Math.min(k, samples.length)),
  }
}
