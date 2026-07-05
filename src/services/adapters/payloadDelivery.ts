import type { Payload } from 'payload'
import type { Dossier, FirmOnlyEvaluation } from '@/lib/compliance/dossierProjections'
import type { DossierRepository } from '../ports'
import type {
  AuditLogWriter,
  DeliveryDeps,
  DeliveryRecord,
  DeliveryRepository,
  MarketRoutingRepository,
  RoutingDeps,
  TransactionRunner,
} from '../deliveryPorts'
import { createWalletService } from '../WalletService'
import { payloadEventStoreFor } from './payloadEvents'
import { createPayloadWalletDeps } from './payloadWallet'

/**
 * Payload adapters for routing and delivery. The delivery record starts held and
 * becomes delivered then billed only inside a covered debit. Market routing is
 * geographic only: it returns the single assigned firm for a market and the
 * market type, and exposes no quality signal.
 */

const relId = (v: unknown) =>
  v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v)

function toDelivery(doc: Record<string, unknown>): DeliveryRecord {
  return {
    id: String(doc.id),
    dossierId: relId(doc.dossier),
    firmId: relId(doc.firm),
    status: (doc.status as DeliveryRecord['status']) ?? 'held',
    deliveredAt: (doc.deliveredAt as string) ?? null,
    billed: Boolean(doc.billed),
  }
}

function payloadDeliveryRepository(payload: Payload): DeliveryRepository {
  return {
    async create({ dossierId, firmId, status }) {
      const created = await payload.create({
        collection: 'deliveries',
        data: { dossier: dossierId, firm: firmId, status },
      })
      return toDelivery(created as never)
    },
    async get(id) {
      try {
        const doc = await payload.findByID({ collection: 'deliveries', id, depth: 0 })
        return doc ? toDelivery(doc as never) : null
      } catch {
        return null
      }
    },
    async markDelivered(id, deliveredAt) {
      await payload.update({ collection: 'deliveries', id, data: { status: 'delivered', deliveredAt } })
    },
    async markBilled(id) {
      await payload.update({ collection: 'deliveries', id, data: { status: 'billed', billed: true } })
    },
    async listHeldByFirm(firmId) {
      const res = await payload.find({
        collection: 'deliveries',
        where: { and: [{ firm: { equals: firmId } }, { status: { equals: 'held' } }] },
        limit: 500,
        depth: 0,
      })
      return res.docs.map((d) => toDelivery(d as never))
    },
    async findForDossierFirm(dossierId, firmId) {
      const res = await payload.find({
        collection: 'deliveries',
        where: { and: [{ dossier: { equals: dossierId } }, { firm: { equals: firmId } }] },
        sort: '-createdAt',
        limit: 1,
        depth: 0,
      })
      return res.docs[0] ? toDelivery(res.docs[0] as never) : null
    },
  }
}

/** A dossier reader that returns both audience halves for delivery. */
function payloadDossierReader(payload: Payload): DossierRepository {
  return {
    async create(dossier) {
      return dossier
    },
    async get(id) {
      try {
        const doc = (await payload.findByID({ collection: 'dossiers', id, depth: 0 })) as unknown as Record<string, unknown>
        if (!doc) return null
        const evaluation = (doc.evaluation ?? {}) as Partial<FirmOnlyEvaluation>
        const dossier: Dossier = {
          id: String(doc.id),
          claimantId: relId(doc.claimant),
          intakeSessionId: doc.intakeSession ? relId(doc.intakeSession) : null,
          market: relId(doc.market),
          caseType: String(doc.caseType ?? ''),
          status: String(doc.status ?? 'received'),
          plainLanguageSummary: String(doc.plainLanguageSummary ?? ''),
          protectionPlan: Array.isArray(doc.protectionPlan)
            ? (doc.protectionPlan as Array<{ step: string }>).map((p) => p.step)
            : [],
          statuteOfLimitationsDate: (doc.statuteOfLimitationsDate as string) ?? null,
          receivedAt: String(doc.receivedAt ?? ''),
          evaluation: {
            scpsScore: Number(evaluation.scpsScore ?? 0),
            scpsVersion: String(evaluation.scpsVersion ?? 'v1'),
            qualificationTier: (evaluation.qualificationTier ?? 'C') as FirmOnlyEvaluation['qualificationTier'],
            qualificationScore: Number(evaluation.qualificationScore ?? 0),
            qualificationBreakdown: evaluation.qualificationBreakdown ?? [],
            estimatedValue: Number(evaluation.estimatedValue ?? 0),
            injurySeverity: String(evaluation.injurySeverity ?? ''),
            liabilityAssessment: String(evaluation.liabilityAssessment ?? ''),
            statuteStatus: String(evaluation.statuteStatus ?? ''),
            signedCaseProbability: Number(evaluation.signedCaseProbability ?? 0),
          },
        }
        return dossier
      } catch {
        return null
      }
    },
    async attachEvaluation(id, evaluation) {
      // Post routing write of the firm only triage half. overrideAccess so the
      // system can populate it; field access still shields it from claimants.
      await payload.update({
        collection: 'dossiers',
        id,
        data: { evaluation: evaluation as never },
        overrideAccess: true,
      })
    },
  }
}

function payloadMarketRouting(payload: Payload): MarketRoutingRepository {
  return {
    async assignedFirmForMarket(marketId) {
      try {
        const market = (await payload.findByID({ collection: 'markets', id: marketId, depth: 0 })) as unknown as Record<
          string,
          unknown
        >
        const firmId = relId(market.assignedFirm)
        if (!firmId) return null
        return { firmId, marketType: String(market.marketType ?? 'single-firm-exclusive') }
      } catch {
        return null
      }
    },
  }
}

function payloadAuditWriter(payload: Payload): AuditLogWriter {
  return {
    async record(entry) {
      await payload.create({
        collection: 'auditLog',
        data: {
          decisionType: entry.decisionType,
          reason: entry.reason,
          aggregateId: entry.aggregateId,
          firm: entry.firmId,
          market: entry.marketId,
          actor: entry.actor,
          details: entry.details,
          occurredAt: entry.occurredAt,
        },
      })
    },
  }
}

/**
 * The transaction boundary. Payload's Mongoose adapter does not thread a session
 * through these port level create and update calls, so this is a pass through:
 * the no double charge invariant is guaranteed by the unique idempotency index
 * on ledgerEntries, and marking a delivery billed is idempotent. Full Mongo
 * session threading is a hardening follow up, not a correctness dependency.
 */
function passThroughRunner(): TransactionRunner {
  return { run: (fn) => fn() }
}

export function createPayloadRoutingDeps(payload: Payload): RoutingDeps {
  return {
    markets: payloadMarketRouting(payload),
    audit: payloadAuditWriter(payload),
    events: payloadEventStoreFor(payload),
    clock: { nowIso: () => new Date().toISOString() },
  }
}

export function createPayloadDeliveryDeps(payload: Payload): DeliveryDeps {
  const walletDeps = createPayloadWalletDeps(payload)
  return {
    dossiers: payloadDossierReader(payload),
    deliveries: payloadDeliveryRepository(payload),
    wallet: createWalletService(walletDeps),
    audit: payloadAuditWriter(payload),
    events: payloadEventStoreFor(payload),
    ids: walletDeps.ids,
    clock: walletDeps.clock,
    tx: passThroughRunner(),
  }
}
