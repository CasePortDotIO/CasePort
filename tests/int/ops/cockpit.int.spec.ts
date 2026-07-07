import { describe, it, expect } from 'vitest'
import { loadOpsCockpit, offlineCockpit, laneFor } from '@/lib/ops/cockpit'

/**
 * The /ops cockpit read model. It fuses the two engines into one snapshot from
 * the shared collections. This drives it with a minimal fake Payload so the
 * aggregation, the lane mapping, and the graceful offline behavior are proven
 * without a live database.
 */

type Doc = Record<string, unknown>

// A tiny in memory Payload with just the find and count surface the read model
// uses. Filters support the equals and and operators the read model issues.
function fakePayload(data: Record<string, Doc[]>) {
  const matches = (doc: Doc, where: unknown): boolean => {
    if (!where || typeof where !== 'object') return true
    const w = where as Record<string, unknown>
    if (Array.isArray(w.and)) return w.and.every((c) => matches(doc, c))
    return Object.entries(w).every(([field, cond]) => {
      const c = cond as { equals?: unknown }
      if (c && 'equals' in c) return doc[field] === c.equals
      return true
    })
  }
  const rows = (collection: string, where?: unknown) => (data[collection] ?? []).filter((d) => matches(d, where))
  const sortRows = (docs: Doc[], sort?: string) => {
    if (!sort) return docs
    const desc = sort.startsWith('-')
    const key = desc ? sort.slice(1) : sort
    return [...docs].sort((a, b) => String(a[key] ?? '').localeCompare(String(b[key] ?? ''))) [desc ? 'reverse' : 'slice']()
  }
  return {
    async find({ collection, where, sort, limit }: { collection: string; where?: unknown; sort?: string; limit?: number }) {
      const all = sortRows(rows(collection, where), sort)
      return { docs: all.slice(0, limit ?? all.length), totalDocs: rows(collection, where).length }
    },
    async count({ collection, where }: { collection: string; where?: unknown }) {
      return { totalDocs: rows(collection, where).length }
    },
  } as never
}

const AT = '2026-07-06T12:00:00.000Z'

describe('ops cockpit lane mapping', () => {
  it('routes each engine event to its lane', () => {
    expect(laneFor('IntelligenceSignalIngested')).toBe('intelligence')
    expect(laneFor('DemandCellScored')).toBe('demand')
    expect(laneFor('CaptureAssetPublished')).toBe('demand')
    expect(laneFor('KeywordQuestionClaimed')).toBe('demand')
    expect(laneFor('DossierDelivered')).toBe('core')
  })
})

describe('ops cockpit offline behavior', () => {
  it('returns an honest empty snapshot when offline', () => {
    const c = offlineCockpit(AT)
    expect(c.online).toBe(false)
    expect(c.flywheel.activeSignals).toBe(0)
    expect(c.events).toEqual([])
  })

  it('degrades to empty aggregates when a collection read throws', async () => {
    const broken = {
      async find() {
        throw new Error('cold db')
      },
      async count() {
        throw new Error('cold db')
      },
    } as never
    const c = await loadOpsCockpit(broken, AT)
    expect(c.online).toBe(true)
    expect(c.cic.sources.total).toBe(0)
    expect(c.demand.cells.total).toBe(0)
    expect(c.events).toEqual([])
  })
})

describe('ops cockpit fuses both engines', () => {
  it('aggregates CIC sources and signals, demand cells and assets, and the event feed', async () => {
    const payload = fakePayload({
      'intelligence-sources': [
        { id: 's1', sourceKey: 'semrush-mcp', name: 'Semrush', reliability: 'B', status: 'active', origin: 'rented', registeredAt: '2026-07-01' },
        { id: 's2', sourceKey: 'va-bar', name: 'VA Bar', reliability: 'A', status: 'active', origin: 'rented', registeredAt: '2026-07-02' },
        { id: 's3', sourceKey: 'bad', name: 'Bad', reliability: 'C', status: 'prohibited', origin: 'rented', registeredAt: '2026-07-03' },
      ],
      'intelligence-signals': [
        { id: 'g1', claim: 'A', sourceKey: 'semrush-mcp', domain: 'demand', reliability: 'B', status: 'active', observedAt: '2026-07-01', ingestedAt: '2026-07-01' },
        { id: 'g2', claim: 'B', sourceKey: 'va-bar', domain: 'regulatory', reliability: 'A', status: 'active', observedAt: '2026-07-02', ingestedAt: '2026-07-02' },
        { id: 'g3', claim: 'C', sourceKey: 'semrush-mcp', domain: 'demand', reliability: 'B', status: 'superseded', observedAt: '2026-06-01', ingestedAt: '2026-06-01' },
      ],
      'demand-cells': [
        { id: 'c1', cellKey: 'va:mva:cn', market: 'va', surface: 'answer-engine', status: 'pursue', score: 0.72, ignoreReason: null },
        { id: 'c2', cellKey: 'va:mva:generic', market: 'va', surface: 'answer-engine', status: 'ignore', score: 0, ignoreReason: 'not-unique' },
      ],
      'capture-assets': [
        { id: 'a1', title: 'VA contributory negligence', surface: 'answer-engine', canonicalQuestion: 'q', url: 'u', status: 'published', publishedAt: '2026-07-05' },
        { id: 'a2', title: 'Draft', surface: 'search', canonicalQuestion: 'q2', url: 'u2', status: 'draft' },
      ],
      markets: [],
      events: [
        { id: 'e1', eventType: 'CaptureAssetPublished', aggregateType: 'capture-asset', aggregateId: 'a1', actor: 'Martha', occurredAt: '2026-07-05T10:00:00.000Z' },
        { id: 'e2', eventType: 'IntelligenceSignalIngested', aggregateType: 'intelligence-signal', aggregateId: 'g2', actor: 'cic', occurredAt: '2026-07-02T10:00:00.000Z' },
      ],
    })

    const c = await loadOpsCockpit(payload, AT)

    // CIC
    expect(c.cic.sources.total).toBe(3)
    expect(c.cic.sources.byRating).toEqual({ A: 1, B: 1, C: 1 })
    expect(c.cic.sources.prohibited).toBe(1)
    expect(c.cic.signals.active).toBe(2)
    expect(c.cic.signals.superseded).toBe(1)
    expect(c.cic.signals.byDomain.demand).toBe(1)
    expect(c.cic.signals.byDomain.regulatory).toBe(1)

    // Demand
    expect(c.demand.cells.pursue).toBe(1)
    expect(c.demand.cells.ignore).toBe(1)
    expect(c.demand.cells.byIgnoreReason['not-unique']).toBe(1)
    expect(c.demand.cells.topPursued[0]?.cellKey).toBe('va:mva:cn')
    expect(c.demand.assets.byStatus.published).toBe(1)
    expect(c.demand.assets.recentPublished[0]?.title).toBe('VA contributory negligence')

    // Fused flywheel and feed
    expect(c.flywheel.activeSignals).toBe(2)
    expect(c.flywheel.publishedAssets).toBe(1)
    expect(c.flywheel.eventsTotal).toBe(2)
    expect(c.events.map((e) => e.lane).sort()).toEqual(['demand', 'intelligence'])
  })
})
