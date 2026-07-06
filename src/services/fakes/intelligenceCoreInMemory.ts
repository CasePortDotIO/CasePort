import type { Clock, EventStore, StoredEvent } from '../ports'
import type {
  CicIdGenerator,
  IntelligenceCoreDeps,
  SignalRecord,
  SignalRecordInput,
  SignalStore,
  SourceRecord,
  SourceRegistryRepository,
} from '../intelligenceCorePorts'

/**
 * In memory harness for the CasePort Intelligence Core foundation (Phase A).
 * It models the source registry, the signal store, and the event log so the
 * epistemic gate is proven end to end without a live database: the allowlist,
 * the rating inheritance, deduplication, and supersession. Nothing here runs in
 * production.
 */
export interface IntelligenceCoreHarness {
  log: StoredEvent[]
  sourceRows: Map<string, SourceRecord>
  signalRows: SignalRecord[]
  sources: SourceRegistryRepository
  signals: SignalStore
  events: EventStore
  ids: CicIdGenerator
  clock: Clock
  /** Freeze or advance the harness clock so ingestedAt is deterministic. */
  setNow(iso: string): void
}

export function createIntelligenceCoreHarness(): IntelligenceCoreHarness {
  const log: StoredEvent[] = []
  const sourceRows = new Map<string, SourceRecord>()
  const signalRows: SignalRecord[] = []

  let n = 0
  const next = (p: string) => `${p}_${(n += 1)}`
  const ids: CicIdGenerator = {
    sourceId: () => next('src'),
    signalId: () => next('sig'),
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

  const sources: SourceRegistryRepository = {
    async getByKey(sourceKey) {
      for (const row of sourceRows.values()) if (row.sourceKey === sourceKey) return { ...row }
      return null
    },
    async get(id) {
      const row = sourceRows.get(id)
      return row ? { ...row } : null
    },
    async save(record) {
      sourceRows.set(record.id, { ...record })
    },
    async touch(id, atIso) {
      const row = sourceRows.get(id)
      if (row) sourceRows.set(id, { ...row, lastCheckedAt: atIso })
    },
    async list() {
      return [...sourceRows.values()].map((r) => ({ ...r }))
    },
  }

  const signals: SignalStore = {
    async append(input: SignalRecordInput) {
      const row: SignalRecord = { ...input, id: ids.signalId() }
      signalRows.push(row)
      return { ...row }
    },
    async get(id) {
      const row = signalRows.find((s) => s.id === id)
      return row ? { ...row } : null
    },
    async activeByDedupKey(dedupKey) {
      const row = signalRows.find((s) => s.dedupKey === dedupKey && s.status === 'active')
      return row ? { ...row } : null
    },
    async historyByDedupKey(dedupKey) {
      return signalRows
        .filter((s) => s.dedupKey === dedupKey)
        .slice()
        .sort((a, b) => a.observedAt.localeCompare(b.observedAt))
        .map((s) => ({ ...s }))
    },
    async markSuperseded(id, bySignalId, atIso) {
      const idx = signalRows.findIndex((s) => s.id === id)
      if (idx >= 0) {
        signalRows[idx] = {
          ...signalRows[idx],
          status: 'superseded',
          supersededById: bySignalId,
          supersededAt: atIso,
        }
      }
    },
    async list() {
      return signalRows.map((s) => ({ ...s }))
    },
  }

  return {
    log,
    sourceRows,
    signalRows,
    sources,
    signals,
    events,
    ids,
    clock,
    setNow: (iso: string) => {
      now = iso
    },
  }
}

/** Assemble the CIC service deps from the harness. */
export function intelligenceCoreDepsFrom(h: IntelligenceCoreHarness): IntelligenceCoreDeps {
  return { sources: h.sources, signals: h.signals, events: h.events, ids: h.ids, clock: h.clock }
}
