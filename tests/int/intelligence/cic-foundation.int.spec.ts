import { describe, it, expect } from 'vitest'
import { createIntelligenceCoreService } from '@/services/IntelligenceCoreService'
import {
  createIntelligenceCoreHarness,
  intelligenceCoreDepsFrom,
} from '@/services/fakes/intelligenceCoreInMemory'
import type { SourceRecordInput } from '@/services/intelligenceCorePorts'

/**
 * CIC Phase A checkpoint (INTELLIGENCE_CORE.md Section 12). An ingested signal
 * is dated, rated, deduplicated, and superseded correctly, and nothing from a
 * prohibited or unlisted source can enter. Every CIC action emits an event.
 */

const semrush: SourceRecordInput = {
  sourceKey: 'semrush-mcp',
  name: 'Semrush',
  origin: 'rented',
  reliability: 'B',
  domains: ['demand', 'market'],
  addedBy: 'founder',
}

const eventTypes = (h: ReturnType<typeof createIntelligenceCoreHarness>) => h.log.map((e) => e.eventType)

describe('CIC source registry (H5, Section 5)', () => {
  it('registers an allowlisted source through human review and emits an event', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))

    const src = await cic.registerSource(semrush)
    expect(src.status).toBe('active')
    expect(src.addedBy).toBe('founder')
    expect(eventTypes(h)).toContain('IntelligenceSourceRegistered')
  })
})

describe('CIC epistemic gate: the allowlist (H5)', () => {
  it('rejects a signal from an unlisted source, storing nothing', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))

    const res = await cic.ingestSignal({
      sourceKey: 'some-random-blog',
      domain: 'demand',
      dedupKey: 'atlanta:mva:search-volume',
      claim: 'Atlanta car accident search volume up 12 percent.',
      observedAt: '2026-07-01T00:00:00.000Z',
    })

    expect(res.disposition).toBe('rejected')
    expect(res.rejectionReason).toBe('unlisted-source')
    expect(res.signal).toBeNull()
    expect(h.signalRows).toHaveLength(0)
    expect(eventTypes(h)).toContain('IntelligenceSignalRejected')
  })

  it('rejects a signal from a prohibited (non-active) source', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
    await cic.registerSource({ ...semrush, status: 'prohibited' })

    const res = await cic.ingestSignal({
      sourceKey: 'semrush-mcp',
      domain: 'demand',
      dedupKey: 'atlanta:mva:search-volume',
      claim: 'Atlanta car accident search volume up 12 percent.',
      observedAt: '2026-07-01T00:00:00.000Z',
    })

    expect(res.disposition).toBe('rejected')
    expect(res.rejectionReason).toBe('prohibited-source')
    expect(h.signalRows).toHaveLength(0)
  })

  it('rejects an undated or bodiless figure so nothing unverified is asserted', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
    await cic.registerSource(semrush)

    const undated = await cic.ingestSignal({
      sourceKey: 'semrush-mcp',
      domain: 'demand',
      dedupKey: 'k1',
      claim: 'A claim.',
      observedAt: '',
    })
    expect(undated.rejectionReason).toBe('missing-observed-at')

    const empty = await cic.ingestSignal({
      sourceKey: 'semrush-mcp',
      domain: 'demand',
      dedupKey: 'k2',
      claim: '   ',
      observedAt: '2026-07-01T00:00:00.000Z',
    })
    expect(empty.rejectionReason).toBe('missing-claim')
    expect(h.signalRows).toHaveLength(0)
  })
})

describe('CIC epistemic gate: dating and rating (H5)', () => {
  it('dates the signal and inherits the source reliability rating', async () => {
    const h = createIntelligenceCoreHarness()
    h.setNow('2026-07-06T12:00:00.000Z')
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
    await cic.registerSource(semrush)

    const res = await cic.ingestSignal({
      sourceKey: 'semrush-mcp',
      domain: 'demand',
      dedupKey: 'atlanta:mva:search-volume',
      claim: 'Atlanta car accident search volume up 12 percent.',
      observedAt: '2026-07-01T00:00:00.000Z',
    })

    expect(res.disposition).toBe('ingested')
    expect(res.signal?.reliability).toBe('B') // inherited from source, never outranks it
    expect(res.signal?.observedAt).toBe('2026-07-01T00:00:00.000Z')
    expect(res.signal?.ingestedAt).toBe('2026-07-06T12:00:00.000Z')
    expect(res.signal?.status).toBe('active')
    // The source was marked as polled without changing trust.
    const source = await h.sources.getByKey('semrush-mcp')
    expect(source?.lastCheckedAt).toBe('2026-07-06T12:00:00.000Z')
    expect(eventTypes(h)).toContain('IntelligenceSignalIngested')
  })
})

describe('CIC epistemic gate: deduplication (Section 5)', () => {
  it('does not store the same claim observed at the same date twice', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
    await cic.registerSource(semrush)

    const signal = {
      sourceKey: 'semrush-mcp' as const,
      domain: 'demand' as const,
      dedupKey: 'atlanta:mva:search-volume',
      claim: 'Atlanta car accident search volume up 12 percent.',
      observedAt: '2026-07-01T00:00:00.000Z',
    }
    const first = await cic.ingestSignal(signal)
    const second = await cic.ingestSignal(signal)

    expect(first.disposition).toBe('ingested')
    expect(second.disposition).toBe('duplicate')
    expect(second.duplicateOfSignalId).toBe(first.signal?.id)
    expect(h.signalRows).toHaveLength(1)
  })
})

describe('CIC epistemic gate: supersession (Section 5)', () => {
  it('supersedes an older figure with a newer one, marking not deleting', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
    await cic.registerSource(semrush)

    const older = await cic.ingestSignal({
      sourceKey: 'semrush-mcp',
      domain: 'demand',
      dedupKey: 'atlanta:mva:search-volume',
      claim: 'Volume up 12 percent.',
      observedAt: '2026-06-01T00:00:00.000Z',
    })
    const newer = await cic.ingestSignal({
      sourceKey: 'semrush-mcp',
      domain: 'demand',
      dedupKey: 'atlanta:mva:search-volume',
      claim: 'Volume up 18 percent.',
      observedAt: '2026-07-01T00:00:00.000Z',
    })

    expect(newer.disposition).toBe('ingested')
    expect(newer.supersededSignalId).toBe(older.signal?.id)

    // The old figure is preserved, marked superseded, and points to the new one.
    const active = await cic.activeSignal('atlanta:mva:search-volume')
    expect(active?.id).toBe(newer.signal?.id)
    const history = await cic.signalHistory('atlanta:mva:search-volume')
    expect(history).toHaveLength(2)
    const oldRow = history.find((s) => s.id === older.signal?.id)
    expect(oldRow?.status).toBe('superseded')
    expect(oldRow?.supersededById).toBe(newer.signal?.id)
    expect(eventTypes(h)).toContain('IntelligenceSignalSuperseded')
  })

  it('stores a stale arrival as superseded on arrival, leaving the newer active', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
    await cic.registerSource(semrush)

    const newer = await cic.ingestSignal({
      sourceKey: 'semrush-mcp',
      domain: 'demand',
      dedupKey: 'atlanta:mva:search-volume',
      claim: 'Volume up 18 percent.',
      observedAt: '2026-07-01T00:00:00.000Z',
    })
    const stale = await cic.ingestSignal({
      sourceKey: 'semrush-mcp',
      domain: 'demand',
      dedupKey: 'atlanta:mva:search-volume',
      claim: 'Volume up 12 percent.',
      observedAt: '2026-06-01T00:00:00.000Z',
    })

    expect(stale.disposition).toBe('superseded-on-arrival')
    expect(stale.signal?.status).toBe('superseded')
    expect(stale.signal?.supersededById).toBe(newer.signal?.id)
    const active = await cic.activeSignal('atlanta:mva:search-volume')
    expect(active?.id).toBe(newer.signal?.id)
  })
})
