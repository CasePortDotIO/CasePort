import type { AttributionTuple } from './ports'
import type { IntelligenceDeps } from './intelligencePorts'
import { defaultV1Model, recalibrate, scpsScore, type ScpsFactors, type ScpsModel } from './scps'

/**
 * IntelligenceService. Section 4, 9, 11. Derived and always recomputable: if the
 * whole intelligence layer were deleted it could be rebuilt from the event log
 * and the collections. It is never a source of truth, and it never writes money.
 *
 *   attributionTrace  the Answer to Wallet query: a signed case back to the
 *                     exact originating tuple (Section 11). The billion dollar
 *                     trace, tested end to end.
 *   recalibrateScps   the Signed Case Feedback Loop: ingest outcomes, write a
 *                     new SCPS model version. Never touches a fee (W4).
 *   scoreDossier      compute a versioned SCPS triage number for a dossier.
 *   acer              true cost per signed case (decision D1), read only.
 */
export function createIntelligenceService(deps: IntelligenceDeps) {
  /** Ensure a model exists to score against. Seeds v1 on first use. */
  async function activeModel(): Promise<ScpsModel> {
    const active = await deps.models.active()
    if (active) return active
    const v1 = defaultV1Model(deps.clock.nowIso())
    await deps.models.save(v1)
    return v1
  }

  /**
   * The full attribution trace (Section 11). Given a signed (or any) outcome,
   * walk the immutable chain back to the first touch tuple: the exact source,
   * keyword, referring surface, and intake behavior that produced this case. If
   * the trace cannot complete end to end, the moat is not real, so this names
   * exactly where a broken link is.
   */
  async function attributionTrace(outcomeId: string): Promise<{
    complete: boolean
    brokenAt: 'outcome' | 'delivery' | 'dossier' | 'intakeSession' | null
    outcome: { id: string; result: string; settlementValueCents: number | null } | null
    firmId: string | null
    market: string | null
    caseType: string | null
    tuple: AttributionTuple | null
  }> {
    const empty = {
      complete: false as const,
      outcome: null,
      firmId: null,
      market: null,
      caseType: null,
      tuple: null,
    }

    const outcome = await deps.trace.outcome(outcomeId)
    if (!outcome) return { ...empty, brokenAt: 'outcome' }
    const outcomeView = {
      id: outcome.id,
      result: outcome.result,
      settlementValueCents: outcome.settlementValueCents ?? null,
    }

    const delivery = await deps.trace.delivery(outcome.deliveryId)
    if (!delivery) return { ...empty, brokenAt: 'delivery', outcome: outcomeView, firmId: outcome.firmId }

    const dossier = await deps.trace.dossier(delivery.dossierId)
    if (!dossier || !dossier.intakeSessionId) {
      return {
        ...empty,
        brokenAt: 'dossier',
        outcome: outcomeView,
        firmId: outcome.firmId,
        market: dossier?.market ?? null,
        caseType: dossier?.caseType ?? null,
      }
    }

    const session = await deps.trace.intakeSession(dossier.intakeSessionId)
    if (!session) {
      return {
        ...empty,
        brokenAt: 'intakeSession',
        outcome: outcomeView,
        firmId: outcome.firmId,
        market: dossier.market,
        caseType: dossier.caseType,
      }
    }

    return {
      complete: true,
      brokenAt: null,
      outcome: outcomeView,
      firmId: outcome.firmId,
      market: dossier.market,
      caseType: dossier.caseType,
      tuple: session.attribution,
    }
  }

  /**
   * Compute and store a versioned SCPS triage score for a dossier. The score
   * records the model version that produced it, so a later recalibration is
   * auditable and this score is never silently changed. Firm facing only (W2);
   * never a routing input (W1); never reads a fee (W3).
   */
  async function scoreDossier(dossierId: string, factors: ScpsFactors): Promise<{ score: number; modelVersion: string }> {
    const model = await activeModel()
    const score = scpsScore(model, factors)
    await deps.scores.append({
      dossierId,
      modelVersion: model.version,
      score,
      factors,
      computedAt: deps.clock.nowIso(),
    })
    return { score, modelVersion: model.version }
  }

  /**
   * The Signed Case Feedback Loop (Section 9). Ingests firm reported outcomes,
   * recalibrates the SCPS weights, and saves a new model version. Its inputs are
   * outcomes and the factors of the dossiers they came from, full stop. It never
   * reads or writes a fee (W4). Emits SCPSRecalibrated with the sample basis.
   */
  async function recalibrateScps(): Promise<ScpsModel> {
    const prev = await activeModel()
    const samples = await deps.samples.signedCaseSamples()
    const nextVersion = nextModelVersion(prev.version)
    const model = recalibrate(prev, samples, nextVersion, deps.clock.nowIso())
    await deps.models.save(model)

    await deps.events.append({
      eventType: 'SCPSRecalibrated',
      aggregateType: 'scps-model',
      aggregateId: model.version,
      actor: 'system',
      occurredAt: deps.clock.nowIso(),
      payload: {
        fromVersion: prev.version,
        toVersion: model.version,
        sampleCount: model.basis.sampleCount,
        signedCount: model.basis.signedCount,
      },
    })
    return model
  }

  /**
   * ACER, the true cost per signed case (decision D1). Reads the firm's ledger
   * debits (fees actually paid) and its retained or settled outcomes. Reading
   * billing into intelligence is allowed and intended; W4 forbids only the
   * reverse, outcomes into billing. Read only.
   */
  async function acer(firmId: string): Promise<{
    firmId: string
    feesPaidCents: number
    signedCases: number
    costPerSignedCaseCents: number | null
  }> {
    const entries = await deps.ledger.listByFirm(firmId)
    const feesPaidCents = entries
      .filter((e) => e.reason === 'delivery-debit')
      .reduce((s, e) => s + Math.abs(e.amountCents), 0)
    const outcomes = await deps.outcomes.listByFirm(firmId)
    const signedCases = outcomes.filter((o) => o.result === 'retained' || o.result === 'settled').length
    return {
      firmId,
      feesPaidCents,
      signedCases,
      costPerSignedCaseCents: signedCases > 0 ? Math.round(feesPaidCents / signedCases) : null,
    }
  }

  return { attributionTrace, scoreDossier, recalibrateScps, acer }
}

/** v1 to v2 to v3. Deterministic and greppable. */
export function nextModelVersion(current: string): string {
  const n = Number.parseInt(current.replace(/^v/, ''), 10)
  return Number.isFinite(n) ? `v${n + 1}` : 'v2'
}

export type IntelligenceService = ReturnType<typeof createIntelligenceService>
