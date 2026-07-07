import type { Clock, EventStore, StoredEvent } from '../ports'
import type {
  ModelVersionRecord,
  ModelVersionRepository,
  PromotionDeps,
  PromotionIdGenerator,
  PromotionRecord,
  PromotionRepository,
} from '../promotionPorts'
import type { PromotionType } from '@/lib/domain/intelligenceCore'

/**
 * In memory harness for the CIC promotion gates (Phase F). It holds the pending
 * promotions and the versioned production values, so the human gate and the
 * versioning are proven without a live database.
 */
export interface PromotionHarness {
  log: StoredEvent[]
  promotionRows: Map<string, PromotionRecord>
  versionRows: ModelVersionRecord[]
  promotions: PromotionRepository
  versions: ModelVersionRepository
  events: EventStore
  ids: PromotionIdGenerator
  clock: Clock
}

export function createPromotionHarness(): PromotionHarness {
  const log: StoredEvent[] = []
  const promotionRows = new Map<string, PromotionRecord>()
  const versionRows: ModelVersionRecord[] = []
  let n = 0
  const next = (p: string) => `${p}_${(n += 1)}`

  return {
    log,
    promotionRows,
    versionRows,
    promotions: {
      async get(id) {
        const r = promotionRows.get(id)
        return r ? { ...r, approvals: [...r.approvals] } : null
      },
      async save(record) {
        promotionRows.set(record.id, { ...record, approvals: [...record.approvals] })
      },
      async list() {
        return [...promotionRows.values()].map((r) => ({ ...r }))
      },
    },
    versions: {
      async save(record) {
        versionRows.push(record)
      },
      async latestVersion(type: PromotionType) {
        return versionRows.filter((v) => v.type === type).length
      },
      async list() {
        return versionRows.map((v) => ({ ...v }))
      },
    },
    events: {
      async append(event) {
        const stored: StoredEvent = { ...event, id: next('evt') }
        log.push(stored)
        return stored
      },
    },
    ids: { promotionId: () => next('promo'), versionId: () => next('ver') },
    clock: { nowIso: () => '2026-07-06T12:00:00.000Z' },
  }
}

export function promotionDepsFrom(h: PromotionHarness): PromotionDeps {
  return { promotions: h.promotions, versions: h.versions, events: h.events, ids: h.ids, clock: h.clock }
}
