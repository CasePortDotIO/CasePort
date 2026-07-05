import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import { SCPS_FACTOR_KEYS, type ScpsFactors, type ScpsModel, type ScpsSample } from '../scps'
import type {
  IntelligenceDeps,
  OutcomeDeps,
  OutcomeRepository,
  RecalibrationReader,
  ScpsModelRepository,
  ScpsScoreRepository,
  StoredOutcome,
  TraceReader,
} from '../intelligencePorts'

/**
 * Payload adapters for the outcome loop and the intelligence layer. The trace
 * readers walk direct references captured at creation (outcome to delivery to
 * dossier to intake session), so the attribution trace is a chain, not a
 * reconstructed join. The outcome deps expose no ledger, so W4 holds by
 * construction here too.
 */

const relId = (v: unknown) =>
  v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v)

function toOutcome(doc: Record<string, unknown>): StoredOutcome {
  return {
    id: String(doc.id),
    deliveryId: relId(doc.delivery),
    firmId: relId(doc.firm),
    result: doc.result as StoredOutcome['result'],
    reasonCode: (doc.reasonCode as string) ?? undefined,
    settlementValueCents: (doc.settlementValueCents as number) ?? undefined,
    reportedAt: String(doc.reportedAt ?? ''),
  }
}

function payloadOutcomeRepository(payload: Payload): OutcomeRepository {
  return {
    async create(input) {
      const created = await payload.create({
        collection: 'outcomes',
        data: {
          delivery: input.deliveryId,
          firm: input.firmId,
          result: input.result,
          reasonCode: input.reasonCode as never,
          settlementValueCents: input.settlementValueCents,
          reportedAt: input.reportedAt,
        },
      })
      return toOutcome(created as never)
    },
    async get(id) {
      try {
        const doc = await payload.findByID({ collection: 'outcomes', id, depth: 0 })
        return doc ? toOutcome(doc as never) : null
      } catch {
        return null
      }
    },
    async listByFirm(firmId) {
      const res = await payload.find({ collection: 'outcomes', where: { firm: { equals: firmId } }, limit: 5000, depth: 0 })
      return res.docs.map((d) => toOutcome(d as never))
    },
    async listAll() {
      const res = await payload.find({ collection: 'outcomes', limit: 5000, depth: 0 })
      return res.docs.map((d) => toOutcome(d as never))
    },
  }
}

function toModel(doc: Record<string, unknown>): ScpsModel {
  const w = (doc.weights ?? {}) as Partial<ScpsFactors>
  return {
    version: String(doc.version),
    weights: {
      injuryVerification: Number(w.injuryVerification ?? 0),
      liabilityClarity: Number(w.liabilityClarity ?? 0),
      statuteStatus: Number(w.statuteStatus ?? 0),
      caseTypeMatch: Number(w.caseTypeMatch ?? 0),
      firmResponseCapacity: Number(w.firmResponseCapacity ?? 0),
    },
    basis: { sampleCount: Number(doc.sampleCount ?? 0), signedCount: Number(doc.signedCount ?? 0) },
    createdAt: String(doc.createdAt ?? ''),
  }
}

function versionNum(v: string): number {
  const n = Number.parseInt(v.replace(/^v/, ''), 10)
  return Number.isFinite(n) ? n : 0
}

function payloadScpsModelRepository(payload: Payload): ScpsModelRepository {
  return {
    async active() {
      const res = await payload.find({ collection: 'scpsModels', limit: 1000, depth: 0 })
      if (res.docs.length === 0) return null
      const models = res.docs.map((d) => toModel(d as never))
      return models.sort((a, b) => versionNum(b.version) - versionNum(a.version))[0]
    },
    async get(version) {
      const res = await payload.find({ collection: 'scpsModels', where: { version: { equals: version } }, limit: 1, depth: 0 })
      return res.docs[0] ? toModel(res.docs[0] as never) : null
    },
    async save(model) {
      await payload.create({
        collection: 'scpsModels',
        data: {
          version: model.version,
          weights: model.weights,
          sampleCount: model.basis.sampleCount,
          signedCount: model.basis.signedCount,
          createdAt: model.createdAt,
        },
      })
    },
    async list() {
      const res = await payload.find({ collection: 'scpsModels', limit: 1000, depth: 0 })
      return res.docs.map((d) => toModel(d as never))
    },
  }
}

/** Factors are stored on the score breakdown as layer/score/max, score = factor*100. */
function factorsToBreakdown(factors: ScpsFactors) {
  return SCPS_FACTOR_KEYS.map((k) => ({ layer: k, score: Math.round(factors[k] * 100), max: 100 }))
}
function breakdownToFactors(breakdown: Array<{ layer?: string; score?: number; max?: number }>): ScpsFactors {
  const f = { injuryVerification: 0, liabilityClarity: 0, statuteStatus: 0, caseTypeMatch: 0, firmResponseCapacity: 0 } as ScpsFactors
  for (const row of breakdown ?? []) {
    const k = row.layer as keyof ScpsFactors
    if (k in f && row.max) f[k] = Number(row.score ?? 0) / Number(row.max)
  }
  return f
}

function payloadScpsScoreRepository(payload: Payload): ScpsScoreRepository {
  return {
    async append(input) {
      const created = await payload.create({
        collection: 'scpsScores',
        data: {
          dossier: input.dossierId,
          modelVersion: input.modelVersion,
          score: input.score,
          breakdown: factorsToBreakdown(input.factors),
          computedAt: input.computedAt,
        },
      })
      return { id: String((created as { id: unknown }).id) }
    },
    async latestForDossier(dossierId) {
      const res = await payload.find({
        collection: 'scpsScores',
        where: { dossier: { equals: dossierId } },
        sort: '-computedAt',
        limit: 1,
        depth: 0,
      })
      const doc = res.docs[0] as unknown as Record<string, unknown> | undefined
      if (!doc) return null
      return {
        score: Number(doc.score ?? 0),
        modelVersion: String(doc.modelVersion ?? 'v1'),
        factors: breakdownToFactors((doc.breakdown as never) ?? []),
      }
    },
  }
}

/** Joins outcomes to the factors of the dossier they came from (via the latest score). */
function payloadRecalibrationReader(payload: Payload): RecalibrationReader {
  const scores = payloadScpsScoreRepository(payload)
  return {
    async signedCaseSamples(): Promise<ScpsSample[]> {
      const outcomes = await payload.find({ collection: 'outcomes', limit: 5000, depth: 0 })
      const samples: ScpsSample[] = []
      for (const o of outcomes.docs) {
        const outcome = toOutcome(o as never)
        const delivery = (await payload.findByID({ collection: 'deliveries', id: outcome.deliveryId, depth: 0 }).catch(() => null)) as Record<string, unknown> | null
        if (!delivery) continue
        const dossierId = relId(delivery.dossier)
        const latest = await scores.latestForDossier(dossierId)
        if (!latest) continue
        samples.push({ factors: latest.factors, signed: outcome.result === 'retained' || outcome.result === 'settled' })
      }
      return samples
    },
  }
}

function payloadTraceReader(payload: Payload): TraceReader {
  return {
    async outcome(id) {
      const doc = (await payload.findByID({ collection: 'outcomes', id, depth: 0 }).catch(() => null)) as Record<string, unknown> | null
      if (!doc) return null
      const o = toOutcome(doc)
      return { id: o.id, deliveryId: o.deliveryId, firmId: o.firmId, result: o.result, settlementValueCents: o.settlementValueCents }
    },
    async delivery(id) {
      const doc = (await payload.findByID({ collection: 'deliveries', id, depth: 0 }).catch(() => null)) as Record<string, unknown> | null
      if (!doc) return null
      return { id: String(doc.id), dossierId: relId(doc.dossier), firmId: relId(doc.firm) }
    },
    async dossier(id) {
      const doc = (await payload.findByID({ collection: 'dossiers', id, depth: 0 }).catch(() => null)) as Record<string, unknown> | null
      if (!doc) return null
      return {
        id: String(doc.id),
        market: relId(doc.market),
        caseType: String(doc.caseType ?? ''),
        intakeSessionId: doc.intakeSession ? relId(doc.intakeSession) : null,
      }
    },
    async intakeSession(id) {
      const doc = (await payload.findByID({ collection: 'intakeSessions', id, depth: 0 }).catch(() => null)) as Record<string, unknown> | null
      if (!doc) return null
      const a = (doc.attribution ?? {}) as Record<string, unknown>
      return {
        id: String(doc.id),
        marketId: doc.market ? relId(doc.market) : null,
        attribution: {
          source: String(a.source ?? ''),
          keyword: (a.keyword as string) ?? undefined,
          referringSurface: (a.referringSurface as string) ?? undefined,
          sessionBehavior: (a.sessionBehavior as Record<string, unknown>) ?? undefined,
          firstTouchAt: String(a.firstTouchAt ?? ''),
        },
      }
    },
  }
}

export function createPayloadOutcomeDeps(payload: Payload): OutcomeDeps {
  let n = 0
  const next = (p: string) => `${p}_${(n += 1).toString(36)}`
  return {
    outcomes: payloadOutcomeRepository(payload),
    events: payloadEventStoreFor(payload),
    ids: {
      sessionId: () => next('sess'),
      claimantId: () => next('clm'),
      dossierId: () => next('CP'),
      eventId: () => next('evt'),
      submissionId: () => next('sub'),
    },
    clock: { nowIso: () => new Date().toISOString() },
  }
}

export function createPayloadIntelligenceDeps(payload: Payload): IntelligenceDeps {
  let n = 0
  const next = (p: string) => `${p}_${(n += 1).toString(36)}`
  return {
    outcomes: payloadOutcomeRepository(payload),
    models: payloadScpsModelRepository(payload),
    scores: payloadScpsScoreRepository(payload),
    samples: payloadRecalibrationReader(payload),
    trace: payloadTraceReader(payload),
    events: payloadEventStoreFor(payload),
    ids: {
      sessionId: () => next('sess'),
      claimantId: () => next('clm'),
      dossierId: () => next('CP'),
      eventId: () => next('evt'),
      submissionId: () => next('sub'),
    },
    clock: { nowIso: () => new Date().toISOString() },
    ledger: {
      async listByFirm(firmId) {
        const res = await payload.find({ collection: 'ledgerEntries', where: { firm: { equals: firmId } }, limit: 10000, depth: 0 })
        return res.docs.map((d) => {
          const doc = d as unknown as Record<string, unknown>
          return {
            id: String(doc.id),
            firmId,
            entryType: doc.entryType as 'credit' | 'debit',
            reason: doc.reason as 'topup' | 'delivery-debit' | 'adjustment',
            amountCents: Number(doc.amountCents ?? 0),
            idempotencyKey: String(doc.idempotencyKey ?? ''),
            occurredAt: String(doc.occurredAt ?? ''),
            balanceAfterCents: Number(doc.balanceAfterCents ?? 0),
          }
        })
      },
    },
  }
}
