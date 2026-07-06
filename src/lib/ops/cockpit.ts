import type { Payload } from 'payload'
import { demandCaptureDepsForPayload } from '@/services/adapters/payloadDemandCapture'
import type { ReliabilityRating, IntelligenceDomain } from '@/lib/domain/intelligenceCore'

/**
 * The internal operations cockpit read model (the /ops app). One fused snapshot
 * of the two engines that share this backend: the CasePort Intelligence Core
 * (which aims) and the Demand Capture Engine (which executes), joined by the
 * shared event log (the learning loop).
 *
 * This is a pure projection over the system of record. It is read only, it is
 * recomputable, and it holds no fact that exists nowhere else. It never writes,
 * never promotes, and never exposes a claimant surface. It degrades to an empty
 * snapshot when the database is cold or absent, so a preview deploy still renders.
 */

export interface OpsEventRow {
  id: string
  eventType: string
  lane: OpsLane
  aggregateType: string
  aggregateId: string
  actor: string
  occurredAt: string
}

export type OpsLane = 'intelligence' | 'demand' | 'core'

export interface OpsCockpit {
  online: boolean
  generatedAt: string
  flywheel: {
    /** CIC: the aim. Active first party and rented signals feeding decisions. */
    activeSignals: number
    sources: number
    /** Demand: the execution. Cells pursued and assets live in funded markets. */
    pursuedCells: number
    publishedAssets: number
    fundedMarkets: number
    /** Loop: system pulse over the whole event log. */
    eventsTotal: number
  }
  cic: {
    sources: {
      total: number
      byRating: Record<ReliabilityRating, number>
      active: number
      prohibited: number
      retired: number
      rows: Array<{
        sourceKey: string
        name: string
        reliability: ReliabilityRating
        status: string
        origin: string
        lastCheckedAt: string | null
      }>
    }
    signals: {
      total: number
      active: number
      superseded: number
      byDomain: Record<IntelligenceDomain, number>
      recent: Array<{
        claim: string
        sourceKey: string
        domain: string
        reliability: string
        status: string
        observedAt: string
      }>
    }
  }
  demand: {
    cells: {
      total: number
      pursue: number
      ignore: number
      byIgnoreReason: Record<string, number>
      topPursued: Array<{ cellKey: string; market: string; surface: string; score: number }>
    }
    assets: {
      total: number
      byStatus: Record<string, number>
      recentPublished: Array<{ title: string; surface: string; canonicalQuestion: string; url: string; publishedAt: string | null }>
    }
    fundedMarkets: string[]
  }
  events: OpsEventRow[]
}

/** Map an event type to its lane so the fused feed reads as one system. */
export function laneFor(eventType: string): OpsLane {
  if (eventType.startsWith('Intelligence')) return 'intelligence'
  if (
    eventType.startsWith('DemandCell') ||
    eventType.startsWith('CaptureAsset') ||
    eventType.startsWith('KeywordQuestion')
  ) {
    return 'demand'
  }
  return 'core'
}

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : v ? String(v) : '')
const relId = (v: unknown) =>
  v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v)

function emptyCockpit(online: boolean, generatedAt: string): OpsCockpit {
  return {
    online,
    generatedAt,
    flywheel: { activeSignals: 0, sources: 0, pursuedCells: 0, publishedAssets: 0, fundedMarkets: 0, eventsTotal: 0 },
    cic: {
      sources: { total: 0, byRating: { A: 0, B: 0, C: 0 }, active: 0, prohibited: 0, retired: 0, rows: [] },
      signals: { total: 0, active: 0, superseded: 0, byDomain: { demand: 0, supply: 0, regulatory: 0, market: 0 }, recent: [] },
    },
    demand: {
      cells: { total: 0, pursue: 0, ignore: 0, byIgnoreReason: {}, topPursued: [] },
      assets: { total: 0, byStatus: {}, recentPublished: [] },
      fundedMarkets: [],
    },
    events: [],
  }
}

// Never let one cold collection sink the whole snapshot.
async function safe<T>(work: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await work()
  } catch {
    return fallback
  }
}

/**
 * Load the fused cockpit snapshot. Every number traces to a real record or a
 * real event; nothing here is fabricated (the D6 quality bar). Aggregations are
 * per collection and independently guarded so a partially seeded system still
 * renders honestly.
 */
export async function loadOpsCockpit(payload: Payload, generatedAt: string): Promise<OpsCockpit> {
  const snapshot = emptyCockpit(true, generatedAt)

  // Intelligence Core sources. Few in number, so aggregate in memory.
  await safe(async () => {
    const res = await payload.find({ collection: 'intelligence-sources', limit: 500, sort: '-registeredAt' })
    snapshot.cic.sources.total = res.totalDocs
    for (const doc of res.docs as unknown as Array<Record<string, unknown>>) {
      const rating = (doc.reliability as ReliabilityRating) ?? 'C'
      if (rating in snapshot.cic.sources.byRating) snapshot.cic.sources.byRating[rating] += 1
      const status = String(doc.status ?? 'active')
      if (status === 'active') snapshot.cic.sources.active += 1
      else if (status === 'prohibited') snapshot.cic.sources.prohibited += 1
      else if (status === 'retired') snapshot.cic.sources.retired += 1
      if (snapshot.cic.sources.rows.length < 12) {
        snapshot.cic.sources.rows.push({
          sourceKey: String(doc.sourceKey ?? ''),
          name: String(doc.name ?? ''),
          reliability: rating,
          status,
          origin: String(doc.origin ?? ''),
          lastCheckedAt: doc.lastCheckedAt ? iso(doc.lastCheckedAt) : null,
        })
      }
    }
  }, undefined)

  // Intelligence Core signals. Counts by status and domain, plus a recent list.
  await safe(async () => {
    const [active, superseded, total, recent] = await Promise.all([
      payload.count({ collection: 'intelligence-signals', where: { status: { equals: 'active' } } }),
      payload.count({ collection: 'intelligence-signals', where: { status: { equals: 'superseded' } } }),
      payload.count({ collection: 'intelligence-signals' }),
      payload.find({ collection: 'intelligence-signals', limit: 8, sort: '-ingestedAt' }),
    ])
    snapshot.cic.signals.active = active.totalDocs
    snapshot.cic.signals.superseded = superseded.totalDocs
    snapshot.cic.signals.total = total.totalDocs
    for (const domain of ['demand', 'supply', 'regulatory', 'market'] as IntelligenceDomain[]) {
      const c = await payload.count({
        collection: 'intelligence-signals',
        where: { and: [{ domain: { equals: domain } }, { status: { equals: 'active' } }] },
      })
      snapshot.cic.signals.byDomain[domain] = c.totalDocs
    }
    snapshot.cic.signals.recent = (recent.docs as unknown as Array<Record<string, unknown>>).map((d) => ({
      claim: String(d.claim ?? ''),
      sourceKey: String(d.sourceKey ?? ''),
      domain: String(d.domain ?? ''),
      reliability: String(d.reliability ?? ''),
      status: String(d.status ?? ''),
      observedAt: iso(d.observedAt),
    }))
  }, undefined)

  // Demand cells. Pursue and ignore split, ignore reasons, and top pursued.
  await safe(async () => {
    const [total, pursue, top] = await Promise.all([
      payload.count({ collection: 'demand-cells' }),
      payload.count({ collection: 'demand-cells', where: { status: { equals: 'pursue' } } }),
      payload.find({
        collection: 'demand-cells',
        where: { status: { equals: 'pursue' } },
        sort: '-score',
        limit: 6,
      }),
    ])
    snapshot.demand.cells.total = total.totalDocs
    snapshot.demand.cells.pursue = pursue.totalDocs
    snapshot.demand.cells.ignore = total.totalDocs - pursue.totalDocs
    for (const reason of ['unfunded-market', 'not-unique', 'low-intent']) {
      const c = await payload.count({ collection: 'demand-cells', where: { ignoreReason: { equals: reason } } })
      if (c.totalDocs > 0) snapshot.demand.cells.byIgnoreReason[reason] = c.totalDocs
    }
    snapshot.demand.cells.topPursued = (top.docs as unknown as Array<Record<string, unknown>>).map((d) => ({
      cellKey: String(d.cellKey ?? ''),
      market: String(d.market ?? ''),
      surface: String(d.surface ?? ''),
      score: Number(d.score ?? 0),
    }))
  }, undefined)

  // Capture assets. Pipeline by status, plus recently published.
  await safe(async () => {
    const total = await payload.count({ collection: 'capture-assets' })
    snapshot.demand.assets.total = total.totalDocs
    for (const status of ['draft', 'pending-approval', 'published', 'rejected']) {
      const c = await payload.count({ collection: 'capture-assets', where: { status: { equals: status } } })
      if (c.totalDocs > 0) snapshot.demand.assets.byStatus[status] = c.totalDocs
    }
    const recent = await payload.find({
      collection: 'capture-assets',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 6,
    })
    snapshot.demand.assets.recentPublished = (recent.docs as unknown as Array<Record<string, unknown>>).map((d) => ({
      title: String(d.title ?? ''),
      surface: String(d.surface ?? ''),
      canonicalQuestion: String(d.canonicalQuestion ?? ''),
      url: String(d.url ?? ''),
      publishedAt: d.publishedAt ? iso(d.publishedAt) : null,
    }))
  }, undefined)

  // Funded markets, resolved from the real markets, firms, and wallet state (HL3).
  snapshot.demand.fundedMarkets = await safe(
    () => demandCaptureDepsForPayload(payload).funded.listFunded(),
    [],
  )

  // The fused event feed. The shared audit log across both engines and the core.
  await safe(async () => {
    const [total, recent] = await Promise.all([
      payload.count({ collection: 'events' }),
      payload.find({ collection: 'events', limit: 24, sort: '-occurredAt' }),
    ])
    snapshot.flywheel.eventsTotal = total.totalDocs
    snapshot.events = (recent.docs as unknown as Array<Record<string, unknown>>).map((d) => {
      const eventType = String(d.eventType ?? '')
      return {
        id: String(d.id),
        eventType,
        lane: laneFor(eventType),
        aggregateType: String(d.aggregateType ?? ''),
        aggregateId: String(d.aggregateId ?? ''),
        actor: String(d.actor ?? relId(d.actor) ?? ''),
        occurredAt: iso(d.occurredAt),
      }
    })
  }, undefined)

  // Flywheel headline numbers, all derived from the panels above.
  snapshot.flywheel.activeSignals = snapshot.cic.signals.active
  snapshot.flywheel.sources = snapshot.cic.sources.total
  snapshot.flywheel.pursuedCells = snapshot.demand.cells.pursue
  snapshot.flywheel.publishedAssets = snapshot.demand.assets.byStatus.published ?? 0
  snapshot.flywheel.fundedMarkets = snapshot.demand.fundedMarkets.length

  return snapshot
}

/** The offline snapshot for a cold or absent database. */
export function offlineCockpit(generatedAt: string): OpsCockpit {
  return emptyCockpit(false, generatedAt)
}
