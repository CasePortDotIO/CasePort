/**
 * SCPS, the Signed Case Probability Score, and its recalibration (Section 9).
 *
 * SCPS is a firm facing triage number expressed as a percentage. It is computed
 * from five factors and a versioned weight model. This module is pure: no fee,
 * no ledger, no outcome ever reaches a price here (W3, W4). Outcomes flow in one
 * direction only, into recalibration, and recalibration produces a new model
 * version. Every score records the model version that produced it, so a v2
 * recalibration is auditable and old scores are never mutated.
 *
 * The wiring is the moat. Until real cases close there is nothing to learn from,
 * so recalibrate carries the prior weights forward and records the sample basis.
 * Once outcomes exist it nudges each weight by how strongly its factor separated
 * signed cases from declined ones, bounded so no single round can overfit.
 */

export interface ScpsFactors {
  /** Documented injury verification. */
  injuryVerification: number
  /** Liability clarity. */
  liabilityClarity: number
  /** Statute of limitations headroom. */
  statuteStatus: number
  /** Case type match to the firm's practice. */
  caseTypeMatch: number
  /** Firm response capacity for this market. */
  firmResponseCapacity: number
}

export const SCPS_FACTOR_KEYS: ReadonlyArray<keyof ScpsFactors> = [
  'injuryVerification',
  'liabilityClarity',
  'statuteStatus',
  'caseTypeMatch',
  'firmResponseCapacity',
]

export interface ScpsModel {
  version: string
  weights: ScpsFactors
  /** What this model was trained on. sampleCount 0 means it carried v1 forward. */
  basis: { sampleCount: number; signedCount: number }
  createdAt: string
}

/** v1 weights. Balanced priors before any outcome data exists. */
export const DEFAULT_V1_WEIGHTS: ScpsFactors = {
  injuryVerification: 0.25,
  liabilityClarity: 0.25,
  statuteStatus: 0.2,
  caseTypeMatch: 0.15,
  firmResponseCapacity: 0.15,
}

export function defaultV1Model(createdAt: string): ScpsModel {
  return { version: 'v1', weights: { ...DEFAULT_V1_WEIGHTS }, basis: { sampleCount: 0, signedCount: 0 }, createdAt }
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/** Normalize a weight set so the weights sum to one. */
function normalize(weights: ScpsFactors): ScpsFactors {
  const total = SCPS_FACTOR_KEYS.reduce((s, k) => s + Math.max(0, weights[k]), 0)
  if (total <= 0) return { ...DEFAULT_V1_WEIGHTS }
  const out = {} as ScpsFactors
  for (const k of SCPS_FACTOR_KEYS) out[k] = Math.max(0, weights[k]) / total
  return out
}

/**
 * The SCPS score for a set of factors under a model, as an integer percentage.
 * A weighted sum of the factors, each expected in 0..1. Never reads a fee.
 */
export function scpsScore(model: ScpsModel, factors: ScpsFactors): number {
  const w = normalize(model.weights)
  const raw = SCPS_FACTOR_KEYS.reduce((s, k) => s + w[k] * clamp01(factors[k]), 0)
  return Math.round(raw * 100)
}

/** A recalibration sample: a delivered dossier's factors and whether it signed. */
export interface ScpsSample {
  factors: ScpsFactors
  signed: boolean
}

/**
 * Recalibrate the weights from firm reported outcomes and return a new versioned
 * model. Pure. Never touches a fee (W4). For each factor it measures how much
 * higher its value ran among signed cases than declined ones, and nudges the
 * prior weight by that separation, bounded to plus or minus fifty percent so one
 * round cannot overfit. With too little data (fewer than a handful of samples,
 * or no signed or no declined cases) it carries the prior weights forward, still
 * bumping the version and recording the basis. That is the loop wired from day
 * one, learning only once there is something to learn from.
 */
export function recalibrate(
  prev: ScpsModel,
  samples: ScpsSample[],
  nextVersion: string,
  createdAt: string,
): ScpsModel {
  const signed = samples.filter((s) => s.signed)
  const declined = samples.filter((s) => !s.signed)
  const basis = { sampleCount: samples.length, signedCount: signed.length }

  const enoughData = samples.length >= 5 && signed.length > 0 && declined.length > 0
  if (!enoughData) {
    return { version: nextVersion, weights: normalize(prev.weights), basis, createdAt }
  }

  const mean = (rows: ScpsSample[], k: keyof ScpsFactors) =>
    rows.reduce((s, r) => s + clamp01(r.factors[k]), 0) / rows.length

  const nudged = {} as ScpsFactors
  for (const k of SCPS_FACTOR_KEYS) {
    // Separation in [-1, 1]: positive when the factor ran higher for signed cases.
    const separation = mean(signed, k) - mean(declined, k)
    const bounded = Math.max(-0.5, Math.min(0.5, separation))
    nudged[k] = Math.max(0, prev.weights[k] * (1 + bounded))
  }

  return { version: nextVersion, weights: normalize(nudged), basis, createdAt }
}
