import { describe, it, expect } from 'vitest'
import { auc, evaluateModel, crossValidatedAuc, evaluateRecalibration } from '@/services/scpsEval'
import { defaultV1Model, recalibrate, type ScpsFactors, type ScpsModel, type ScpsSample } from '@/services/scps'

/**
 * The SCPS experimentation harness. Promotion must be evidence based, so the
 * discrimination metric (AUC) must be exactly right, and the out of sample
 * backtest must not flatter an overfit model. These tests pin both.
 */

const model = defaultV1Model('t')

describe('AUC (concordance probability)', () => {
  it('is 1.0 for perfect separation', () => {
    expect(auc([
      { score: 90, signed: true },
      { score: 80, signed: true },
      { score: 40, signed: false },
      { score: 30, signed: false },
    ])).toBe(1)
  })

  it('is 0.0 when the ranking is exactly inverted', () => {
    expect(auc([
      { score: 10, signed: true },
      { score: 20, signed: false },
    ])).toBe(0)
  })

  it('is 0.5 for a coin flip (all ties)', () => {
    expect(auc([
      { score: 50, signed: true },
      { score: 50, signed: false },
    ])).toBe(0.5)
  })

  it('counts a partial concordance correctly', () => {
    // signed {70,40}, declined {50}: 70>50 (1) + 40<50 (0) = 1 of 2 pairs.
    expect(auc([
      { score: 70, signed: true },
      { score: 40, signed: true },
      { score: 50, signed: false },
    ])).toBe(0.5)
  })

  it('is null when a class is missing (no pair to rank)', () => {
    expect(auc([{ score: 1, signed: true }])).toBeNull()
    expect(auc([{ score: 1, signed: false }])).toBeNull()
  })
})

/** Build separable samples: signed cases have high liability clarity, declined low. */
function separableSamples(n: number): ScpsSample[] {
  const flat = 0.5
  const out: ScpsSample[] = []
  for (let i = 0; i < n; i++) {
    const signed = i % 2 === 0
    const factors: ScpsFactors = {
      injuryVerification: flat,
      liabilityClarity: signed ? 0.9 : 0.15,
      statuteStatus: flat,
      caseTypeMatch: flat,
      firmResponseCapacity: flat,
    }
    out.push({ factors, signed })
  }
  return out
}

describe('model evaluation + cross validation', () => {
  it('measures a model AUC over samples', () => {
    const res = evaluateModel(model, separableSamples(8))
    expect(res.n).toBe(8)
    expect(res.signed).toBe(4)
    expect(res.auc).not.toBeNull()
  })

  it('cross validated AUC is out of sample: it recalibrates on train, scores held-out folds', () => {
    const samples = separableSamples(20)
    const cv = crossValidatedAuc(model, samples, 5)
    expect(cv).not.toBeNull()
    // Liability clarity cleanly separates the classes, so a recalibrated model
    // should rank held-out signed cases above declined ones well above chance.
    expect(cv as number).toBeGreaterThan(0.6)
  })

  it('returns null cross-val when there are too few samples to fold', () => {
    expect(crossValidatedAuc(model, separableSamples(1), 5)).toBeNull()
  })
})

/** Samples where the ACTIVE model is misled: the true signal sits on a factor it
 * weights low (firm response capacity), while a factor it weights high (injury
 * verification) is anti-correlated with the outcome. A good recalibration should
 * fix this and improve out-of-sample ranking. */
function misleadingSamples(n: number): ScpsSample[] {
  const out: ScpsSample[] = []
  for (let i = 0; i < n; i++) {
    const signed = i % 2 === 0
    const factors: ScpsFactors = {
      injuryVerification: signed ? 0.2 : 0.8, // anti-correlated, high active weight
      liabilityClarity: 0.5,
      statuteStatus: 0.5,
      caseTypeMatch: 0.5,
      firmResponseCapacity: signed ? 0.9 : 0.2, // the true signal, low active weight
    }
    out.push({ factors, signed })
  }
  return out
}

describe('evaluateRecalibration (the promotion evidence)', () => {
  it('recommends promote when recalibration fixes a misled model, out of sample', () => {
    const samples = misleadingSamples(20)
    const proposed = recalibrate(model, samples, 'v2', 't')
    const report = evaluateRecalibration(model, proposed, samples)
    expect(report.sampleCount).toBe(20)
    expect(report.signedCount).toBe(10)

    // The active model is misled here, so it ranks below chance.
    expect(report.activeAuc as number).toBeLessThan(0.5)
    // The recalibration downweights the misleading factor and upweights the signal.
    expect(report.weightChanges.find((w) => w.factor === 'injuryVerification')!.delta).toBeLessThan(0)
    expect(report.weightChanges.find((w) => w.factor === 'firmResponseCapacity')!.delta).toBeGreaterThan(0)
    // And it improves ranking on cases it never saw, so the evidence says promote.
    expect(report.crossValLift as number).toBeGreaterThan(0)
    expect(report.recommendation).toBe('promote')
  })

  it('recommends hold when the active model already separates perfectly (no lift to claim)', () => {
    const samples = separableSamples(20)
    const proposed = recalibrate(model, samples, 'v2', 't')
    const report = evaluateRecalibration(model, proposed, samples)
    // v1 already ranks these perfectly, so an honest harness claims no improvement.
    expect(report.recommendation).toBe('hold')
  })

  it('recommends insufficient-data when a class is missing', () => {
    const onlySigned: ScpsSample[] = separableSamples(6).map((s) => ({ ...s, signed: true }))
    const proposed = recalibrate(model, onlySigned, 'v2', 't')
    const report = evaluateRecalibration(model, proposed, onlySigned)
    expect(report.recommendation).toBe('insufficient-data')
    expect(report.activeAuc).toBeNull()
  })

  it('does not flatter a proposal on pure noise: no meaningful out-of-sample lift', () => {
    // Signed/declined unrelated to any factor: recalibration has no real signal.
    const noise: ScpsSample[] = []
    const f: ScpsFactors = { injuryVerification: 0.5, liabilityClarity: 0.5, statuteStatus: 0.5, caseTypeMatch: 0.5, firmResponseCapacity: 0.5 }
    for (let i = 0; i < 20; i++) noise.push({ factors: f, signed: i % 2 === 0 })
    const proposed = recalibrate(model, noise, 'v2', 't')
    const report = evaluateRecalibration(model, proposed, noise)
    // Flat factors mean no separation is possible; the harness must not claim a win.
    expect(report.recommendation).not.toBe('promote')
  })
})
