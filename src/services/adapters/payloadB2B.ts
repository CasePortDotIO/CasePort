import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import type {
  B2BCaptureDeps,
  B2BIdGenerator,
  B2BTargetRecord,
  B2BTargetRepository,
  CaptureAssetWriter,
  MarketActivityItem,
  MarketProofReader,
  OutboundDrafter,
  ProspectResearcher,
} from '../b2bPorts'
import type { B2BTargetStatus, OutboundStatus } from '@/lib/domain/demandCapture'
import { createGlassBoxService } from '../GlassBoxService'
import { createPayloadGlassBoxDeps } from './payloadWallet'

/**
 * Payload wiring for Demand Capture B2B (Phase C). Targets persist to the
 * b2b-targets collection; authority drafts persist as capture assets; the proof
 * reader is backed by the existing Glass Box proof of reality feed, which is
 * already redacted for a firm's territory. Research and drafting are injected
 * (agentic in production), so this adapter holds only storage and reads.
 */

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : v ? String(v) : '')

function toTarget(doc: Record<string, unknown>): B2BTargetRecord {
  const outbound = (doc.outbound as Record<string, unknown> | undefined) ?? null
  return {
    id: String(doc.id),
    firmName: String(doc.firmName ?? ''),
    market: String(doc.market ?? ''),
    partnerName: (doc.partnerName as string) ?? undefined,
    revenueBand: (doc.revenueBand as string) ?? undefined,
    status: doc.status as B2BTargetStatus,
    enriched: Boolean(doc.enriched),
    outbound:
      outbound && outbound.status
        ? {
            subject: String(outbound.subject ?? ''),
            body: String(outbound.body ?? ''),
            proof: (outbound.proof as MarketActivityItem[]) ?? [],
            status: outbound.status as OutboundStatus,
            rejectionReason: (outbound.rejectionReason as string) ?? undefined,
            sentBy: (outbound.sentBy as string) ?? undefined,
            sentAt: outbound.sentAt ? iso(outbound.sentAt) : undefined,
          }
        : null,
    createdAt: iso(doc.createdAt),
  }
}

function payloadTargetRepository(payload: Payload): B2BTargetRepository {
  const data = (r: B2BTargetRecord) => ({
    firmName: r.firmName,
    market: r.market,
    partnerName: r.partnerName,
    revenueBand: r.revenueBand,
    status: r.status,
    enriched: r.enriched,
    outbound: r.outbound ?? undefined,
    createdAt: r.createdAt,
  })
  return {
    async get(id) {
      try {
        const doc = await payload.findByID({ collection: 'b2b-targets', id })
        return doc ? toTarget(doc as never) : null
      } catch {
        return null
      }
    },
    async save(record) {
      const existing = record.id
        ? await payload.findByID({ collection: 'b2b-targets', id: record.id }).catch(() => null)
        : null
      if (existing) {
        await payload.update({ collection: 'b2b-targets', id: record.id, data: data(record) as never })
      } else {
        await payload.create({ collection: 'b2b-targets', data: data(record) as never })
      }
    },
    async list() {
      const res = await payload.find({ collection: 'b2b-targets', limit: 1000 })
      return (res.docs as unknown as Array<Record<string, unknown>>).map(toTarget)
    },
  }
}

function payloadAuthorityWriter(payload: Payload): CaptureAssetWriter {
  return {
    async create(input) {
      const created = await payload.create({
        collection: 'capture-assets',
        data: {
          cellKey: input.cellKey,
          surface: input.surface,
          canonicalQuestion: input.canonicalQuestion,
          url: input.url,
          owningIdentity: input.owningIdentity,
          title: input.title,
          status: input.status,
          structure: input.structure,
        } as never,
      })
      return { id: String((created as { id: unknown }).id) }
    },
  }
}

/** Proof of reality from the Glass Box feed: redacted, market scoped (HL6). */
function payloadProofReader(payload: Payload): MarketProofReader {
  const glass = createGlassBoxService(createPayloadGlassBoxDeps(payload))
  return {
    async recentActivity(market, limit) {
      // The Glass Box proof feed is keyed by firm territory; resolve the market's
      // firm and read its redacted representative activity. Falls back to empty
      // when no firm is assigned, so the reader never invents activity.
      try {
        const markets = await payload.find({ collection: 'markets', where: { slug: { equals: market } }, limit: 1 })
        const firmId = (markets.docs[0] as { assignedFirm?: unknown } | undefined)?.assignedFirm
        const id = firmId == null ? '' : typeof firmId === 'object' ? String((firmId as { id: unknown }).id) : String(firmId)
        if (!id) return []
        const feed = await glass.proofOfRealityFeed(id, limit)
        // RedactedActivity carries no PII: a reference, case type, market, and
        // status only. Render a representative one line summary, never a name.
        return feed.items.map((it) => ({
          caseType: it.caseType,
          market,
          summary: `Representative recent ${it.caseType} activity in ${it.market}, ${it.status}.`,
          occurredAt: it.receivedAt,
        }))
      } catch {
        return []
      }
    },
  }
}

const payloadB2BIds: B2BIdGenerator = { targetId: () => '', assetId: () => '' }

export function createPayloadB2BDeps(
  payload: Payload,
  researcher: ProspectResearcher,
  drafter: OutboundDrafter,
): B2BCaptureDeps {
  return {
    targets: payloadTargetRepository(payload),
    assets: payloadAuthorityWriter(payload),
    proof: payloadProofReader(payload),
    researcher,
    drafter,
    events: payloadEventStoreFor(payload),
    ids: payloadB2BIds,
    clock: { nowIso: () => new Date().toISOString() },
  }
}
