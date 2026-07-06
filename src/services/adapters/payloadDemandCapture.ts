import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import type {
  CaptureAssetRecord,
  CaptureAssetRepository,
  DemandCaptureDeps,
  DemandCaptureIdGenerator,
  DemandCellRecord,
  DemandCellRepository,
  FundedMarketResolver,
  KeywordRegistry,
} from '../demandCapturePorts'
import type { AssetStatus, CaptureSurface, CellIgnoreReason, CellStatus } from '@/lib/domain/demandCapture'
import type { AssetStructure } from '@/lib/demand/placement'

/**
 * Payload adapters for the Demand Capture Engine foundation (Phase A). They back
 * the demand cell store and the capture asset store with the demand-cells and
 * capture-assets collections, derive keyword ownership from published assets
 * (Section 7), and resolve funded market state from the real markets, firms, and
 * wallet balance (HL3). Payload assigns document ids, so the id generator is
 * used only by the fake.
 */

const relId = (v: unknown) =>
  v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v)

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : v ? String(v) : '')

function toCell(doc: Record<string, unknown>): DemandCellRecord {
  return {
    id: String(doc.id),
    cellKey: String(doc.cellKey ?? ''),
    market: String(doc.market ?? ''),
    caseType: String(doc.caseType ?? ''),
    legalConcept: String(doc.legalConcept ?? ''),
    surface: doc.surface as CaptureSurface,
    uniqueness: Number(doc.uniqueness ?? 0),
    intent: Number(doc.intent ?? 0),
    status: doc.status as CellStatus,
    score: Number(doc.score ?? 0),
    ignoreReason: (doc.ignoreReason as CellIgnoreReason) ?? null,
    fundedMonetizable: Boolean(doc.fundedMonetizable),
    scoredAt: iso(doc.scoredAt),
  }
}

function payloadCellRepository(payload: Payload): DemandCellRepository {
  const data = (r: DemandCellRecord) => ({
    cellKey: r.cellKey,
    market: r.market,
    caseType: r.caseType,
    legalConcept: r.legalConcept,
    surface: r.surface,
    uniqueness: r.uniqueness,
    intent: r.intent,
    status: r.status,
    score: r.score,
    ignoreReason: r.ignoreReason ?? undefined,
    fundedMonetizable: r.fundedMonetizable,
    scoredAt: r.scoredAt,
  })
  return {
    async getByKey(cellKey) {
      const res = await payload.find({ collection: 'demand-cells', where: { cellKey: { equals: cellKey } }, limit: 1 })
      return res.docs[0] ? toCell(res.docs[0] as never) : null
    },
    async get(id) {
      try {
        const doc = await payload.findByID({ collection: 'demand-cells', id })
        return doc ? toCell(doc as never) : null
      } catch {
        return null
      }
    },
    async save(record) {
      const existing = await payload.find({
        collection: 'demand-cells',
        where: { cellKey: { equals: record.cellKey } },
        limit: 1,
      })
      if (existing.docs[0]) {
        await payload.update({ collection: 'demand-cells', id: String(existing.docs[0].id), data: data(record) as never })
      } else {
        await payload.create({ collection: 'demand-cells', data: data(record) as never })
      }
    },
    async list() {
      const res = await payload.find({ collection: 'demand-cells', limit: 1000 })
      return res.docs.map((d) => toCell(d as never))
    },
  }
}

function toAsset(doc: Record<string, unknown>): CaptureAssetRecord {
  return {
    id: String(doc.id),
    cellKey: String(doc.cellKey ?? ''),
    surface: doc.surface as CaptureSurface,
    canonicalQuestion: String(doc.canonicalQuestion ?? ''),
    url: String(doc.url ?? ''),
    owningIdentity: String(doc.owningIdentity ?? ''),
    title: String(doc.title ?? ''),
    structure: (doc.structure as AssetStructure) ?? ({} as AssetStructure),
    status: doc.status as AssetStatus,
    approvedBy: (doc.approvedBy as string) ?? null,
    publishedAt: doc.publishedAt ? iso(doc.publishedAt) : null,
    createdAt: iso(doc.createdAt),
  }
}

function payloadAssetRepository(payload: Payload): CaptureAssetRepository {
  const data = (r: CaptureAssetRecord) => ({
    title: r.title,
    cellKey: r.cellKey,
    surface: r.surface,
    canonicalQuestion: r.canonicalQuestion,
    url: r.url,
    owningIdentity: r.owningIdentity,
    status: r.status,
    approvedBy: r.approvedBy ?? undefined,
    publishedAt: r.publishedAt ?? undefined,
    structure: r.structure,
  })
  return {
    async get(id) {
      try {
        const doc = await payload.findByID({ collection: 'capture-assets', id })
        return doc ? toAsset(doc as never) : null
      } catch {
        return null
      }
    },
    async save(record) {
      const existing = record.id
        ? await payload.findByID({ collection: 'capture-assets', id: record.id }).catch(() => null)
        : null
      if (existing) {
        await payload.update({ collection: 'capture-assets', id: record.id, data: data(record) as never })
      } else {
        await payload.create({ collection: 'capture-assets', data: data(record) as never })
      }
    },
    async list() {
      const res = await payload.find({ collection: 'capture-assets', limit: 1000 })
      return res.docs.map((d) => toAsset(d as never))
    },
  }
}

// Ownership is the published asset for a canonical question (Section 7).
function payloadKeywordRegistry(payload: Payload): KeywordRegistry {
  return {
    async owner(canonicalQuestion) {
      const res = await payload.find({
        collection: 'capture-assets',
        where: {
          and: [{ canonicalQuestion: { equals: canonicalQuestion } }, { status: { equals: 'published' } }],
        },
        limit: 1,
      })
      const doc = res.docs[0]
      if (!doc) return null
      const a = toAsset(doc as never)
      return { canonicalQuestion: a.canonicalQuestion, url: a.url, assetId: a.id }
    },
  }
}

/**
 * Funded market resolver (HL3). A market is funded when it is active, has an
 * assigned firm, and that firm's wallet balance is positive. Fundedness is read
 * from the real wallet state, never decided by the demand engine, so B2C capture
 * gating cannot drift from whether a firm can actually receive the opportunity.
 * marketKey matches either the market slug or its state code.
 */
function payloadFundedResolver(payload: Payload): FundedMarketResolver {
  async function firmFunded(firmId: string): Promise<boolean> {
    if (!firmId) return false
    const wallets = await payload.find({ collection: 'wallets', where: { firm: { equals: firmId } }, limit: 1 })
    const balance = Number((wallets.docs[0] as { balanceCents?: number } | undefined)?.balanceCents ?? 0)
    return balance > 0
  }
  async function fundedMarketDocs() {
    const markets = await payload.find({ collection: 'markets', where: { status: { equals: 'active' } }, limit: 1000 })
    const funded: Array<{ slug: string; state: string }> = []
    for (const m of markets.docs as unknown as Array<Record<string, unknown>>) {
      const firmId = relId(m.assignedFirm)
      if (firmId && (await firmFunded(firmId))) {
        funded.push({ slug: String(m.slug ?? ''), state: String(m.state ?? '') })
      }
    }
    return funded
  }
  return {
    async isFunded(marketKey) {
      const funded = await fundedMarketDocs()
      const key = marketKey.toLowerCase()
      return funded.some((m) => m.slug.toLowerCase() === key || m.state.toLowerCase() === key)
    },
    async listFunded() {
      const funded = await fundedMarketDocs()
      return funded.map((m) => m.slug || m.state)
    },
  }
}

// Payload assigns ids; these satisfy the port shape only.
const payloadDemandIds: DemandCaptureIdGenerator = { cellId: () => '', assetId: () => '' }

export function demandCaptureDepsForPayload(payload: Payload): DemandCaptureDeps {
  return {
    cells: payloadCellRepository(payload),
    assets: payloadAssetRepository(payload),
    registry: payloadKeywordRegistry(payload),
    funded: payloadFundedResolver(payload),
    events: payloadEventStoreFor(payload),
    ids: payloadDemandIds,
    clock: { nowIso: () => new Date().toISOString() },
  }
}
