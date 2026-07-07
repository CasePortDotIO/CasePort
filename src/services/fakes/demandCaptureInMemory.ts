import type { Clock, EventStore, StoredEvent } from '../ports'
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

/**
 * In memory harness for the Demand Capture Engine foundation (Phase A). It
 * models the demand cell store, the capture asset store, the keyword ownership
 * registry, and a settable funded market resolver, so the scoring gate, the
 * canonical ownership gate, and the pre publish gate are proven end to end
 * without a live database. Nothing here runs in production.
 */
export interface DemandCaptureHarness {
  log: StoredEvent[]
  cellRows: Map<string, DemandCellRecord>
  assetRows: Map<string, CaptureAssetRecord>
  cells: DemandCellRepository
  assets: CaptureAssetRepository
  registry: KeywordRegistry
  funded: FundedMarketResolver
  events: EventStore
  ids: DemandCaptureIdGenerator
  clock: Clock
  setNow(iso: string): void
  /** Mark a market funded (HL3) for the test. */
  fund(marketKey: string): void
}

export function createDemandCaptureHarness(): DemandCaptureHarness {
  const log: StoredEvent[] = []
  const cellRows = new Map<string, DemandCellRecord>()
  const assetRows = new Map<string, CaptureAssetRecord>()
  const fundedMarkets = new Set<string>()

  let n = 0
  const next = (p: string) => `${p}_${(n += 1)}`
  const ids: DemandCaptureIdGenerator = {
    cellId: () => next('cell'),
    assetId: () => next('asset'),
  }

  let now = '2026-07-06T00:00:00.000Z'
  const clock: Clock = { nowIso: () => now }

  const events: EventStore = {
    async append(event) {
      const stored: StoredEvent = { ...event, id: next('evt') }
      log.push(stored)
      return stored
    },
  }

  const cells: DemandCellRepository = {
    async getByKey(cellKey) {
      for (const row of cellRows.values()) if (row.cellKey === cellKey) return { ...row }
      return null
    },
    async get(id) {
      const row = cellRows.get(id)
      return row ? { ...row } : null
    },
    async save(record) {
      cellRows.set(record.id, { ...record })
    },
    async list() {
      return [...cellRows.values()].map((r) => ({ ...r }))
    },
  }

  const assets: CaptureAssetRepository = {
    async get(id) {
      const row = assetRows.get(id)
      return row ? { ...row } : null
    },
    async save(record) {
      assetRows.set(record.id, { ...record })
    },
    async list() {
      return [...assetRows.values()].map((r) => ({ ...r }))
    },
  }

  // Ownership is a derived view over published assets (Section 7). The owner of
  // a question is the published asset whose canonical question matches.
  const registry: KeywordRegistry = {
    async owner(canonicalQuestion) {
      const q = canonicalQuestion.toLowerCase()
      for (const a of assetRows.values()) {
        if (a.status === 'published' && a.canonicalQuestion.toLowerCase() === q) {
          return { canonicalQuestion: a.canonicalQuestion, url: a.url, assetId: a.id }
        }
      }
      return null
    },
  }

  const funded: FundedMarketResolver = {
    async isFunded(marketKey) {
      return fundedMarkets.has(marketKey)
    },
    async listFunded() {
      return [...fundedMarkets]
    },
  }

  return {
    log,
    cellRows,
    assetRows,
    cells,
    assets,
    registry,
    funded,
    events,
    ids,
    clock,
    setNow: (iso: string) => {
      now = iso
    },
    fund: (marketKey: string) => {
      fundedMarkets.add(marketKey)
    },
  }
}

export function demandCaptureDepsFrom(h: DemandCaptureHarness): DemandCaptureDeps {
  return {
    cells: h.cells,
    assets: h.assets,
    registry: h.registry,
    funded: h.funded,
    events: h.events,
    ids: h.ids,
    clock: h.clock,
  }
}
