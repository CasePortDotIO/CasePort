import { describe, it, expect } from 'vitest'
import { createIntelligenceCoreService } from '@/services/IntelligenceCoreService'
import { createIngestionService } from '@/services/IngestionService'
import {
  createIntelligenceCoreHarness,
  intelligenceCoreDepsFrom,
} from '@/services/fakes/intelligenceCoreInMemory'
import { ingestionDepsFrom } from '@/services/fakes/ingestionInMemory'
import { ingestOwnedSignalWorkflow, pollRentedSourcesWorkflow } from '@/inngest/intelligenceWorkflows'
import type { StepRunner, WorkflowEvent } from '@/inngest/stepPort'
import type { SignalIngestInput } from '@/services/intelligenceCorePorts'

/**
 * CIC Phase B checkpoint (INTELLIGENCE_CORE.md Section 12). Owned intelligence
 * updates in near real time from live events, and rented sources poll on their
 * cadences. Both paths ingest only through the epistemic gate, so nothing
 * bypasses the allowlist, rating, dedup, or supersession.
 */

function fakeStep() {
  const events: WorkflowEvent[] = []
  const runner: StepRunner = {
    run: (_id, fn) => fn(),
    sendEvent: async (_id, evs) => {
      events.push(...(Array.isArray(evs) ? evs : [evs]))
    },
  }
  return { runner, events }
}

/** A memoizing runner models Inngest durability: a completed step never re runs. */
function memoizingStep() {
  const store = new Map<string, unknown>()
  const runner: StepRunner = {
    run: async (id, fn) => {
      if (store.has(id)) return store.get(id) as never
      const r = await fn()
      store.set(id, r)
      return r
    },
    sendEvent: async () => {},
  }
  return { runner, store }
}

async function withOwnedSource() {
  const h = createIntelligenceCoreHarness()
  const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
  await cic.registerSource({
    sourceKey: 'caseport-event-log',
    name: 'CasePort event log',
    origin: 'owned',
    reliability: 'A',
    domains: ['demand', 'supply', 'regulatory', 'market'],
    addedBy: 'founder',
  })
  return { h, cic }
}

describe('CIC owned ingestion: near real time from live events', () => {
  it('turns a live outcome event into a first party signal through the gate', async () => {
    const { h, cic } = await withOwnedSource()
    const ingestion = createIngestionService(ingestionDepsFrom(cic, {}))

    const res = await ingestion.consumeEvent({
      eventType: 'OutcomeReported',
      occurredAt: '2026-07-06T10:00:00.000Z',
      aggregateId: 'out_1',
      payload: { firmId: 'firm_a', result: 'retained', outcomeId: 'out_1' },
    })

    expect(res?.disposition).toBe('ingested')
    expect(res?.signal?.origin).toBe('owned')
    expect(res?.signal?.reliability).toBe('A')
    expect(res?.signal?.domain).toBe('supply')
    // The event carried the attribution reference for the trace back to source.
    expect(res?.signal?.attributionRef).toBe('out_1')
  })

  it('supersedes an earlier owned observation of the same firm outcome', async () => {
    const { cic } = await withOwnedSource()
    const ingestion = createIngestionService(ingestionDepsFrom(cic, {}))

    const first = await ingestion.consumeEvent({
      eventType: 'OutcomeReported',
      occurredAt: '2026-07-01T10:00:00.000Z',
      aggregateId: 'out_1',
      payload: { firmId: 'firm_a', result: 'still-evaluating', outcomeId: 'out_1' },
    })
    const second = await ingestion.consumeEvent({
      eventType: 'OutcomeReported',
      occurredAt: '2026-07-06T10:00:00.000Z',
      aggregateId: 'out_2',
      payload: { firmId: 'firm_a', result: 'retained', outcomeId: 'out_2' },
    })

    expect(second?.disposition).toBe('ingested')
    expect(second?.supersededSignalId).toBe(first?.signal?.id)
    const active = await cic.activeSignal('owned:firm-outcome:firm_a')
    expect(active?.id).toBe(second?.signal?.id)
  })

  it('returns null for an event that carries no intelligence, fabricating nothing', async () => {
    const { cic } = await withOwnedSource()
    const ingestion = createIngestionService(ingestionDepsFrom(cic, {}))
    const res = await ingestion.consumeEvent({
      eventType: 'StatusViewed',
      occurredAt: '2026-07-06T10:00:00.000Z',
      aggregateId: 'x',
      payload: {},
    })
    expect(res).toBeNull()
  })

  it('is idempotent under an Inngest retry: a duplicate is detected, never doubled', async () => {
    const { h, cic } = await withOwnedSource()
    const ingestion = createIngestionService(ingestionDepsFrom(cic, {}))
    const event = {
      eventType: 'OutcomeReported',
      occurredAt: '2026-07-06T10:00:00.000Z',
      aggregateId: 'out_1',
      payload: { firmId: 'firm_a', result: 'retained', outcomeId: 'out_1' },
    }
    const { runner } = memoizingStep()
    const a = await ingestOwnedSignalWorkflow({ ingestion }, runner, event)
    // A retry re runs the workflow body; the gate detects the duplicate.
    const direct = await ingestion.consumeEvent(event)
    expect(a.ingested).toBe(true)
    expect(direct?.disposition).toBe('duplicate')
    // Exactly one owned signal for the subject.
    expect(h.signalRows.filter((s) => s.dedupKey === 'owned:firm-outcome:firm_a')).toHaveLength(1)
  })
})

describe('CIC rented ingestion: sources poll on their cadences', () => {
  const registerSemrush = async (cic: ReturnType<typeof createIntelligenceCoreService>) =>
    cic.registerSource({
      sourceKey: 'semrush-mcp',
      name: 'Semrush',
      origin: 'rented',
      reliability: 'B',
      domains: ['demand', 'market'],
      addedBy: 'founder',
    })

  const candidates: SignalIngestInput[] = [
    { sourceKey: 'semrush-mcp', domain: 'demand', dedupKey: 'atl:mva:volume', claim: 'Volume up.', observedAt: '2026-07-05T00:00:00.000Z' },
    { sourceKey: 'semrush-mcp', domain: 'market', dedupKey: 'atl:competition', claim: 'Competition thin.', observedAt: '2026-07-05T00:00:00.000Z' },
  ]

  it('polls a source and ingests each candidate through the gate', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
    await registerSemrush(cic)
    const ingestion = createIngestionService(ingestionDepsFrom(cic, { 'semrush-mcp': candidates }))

    const summary = await ingestion.pollSource('semrush-mcp')
    expect(summary.attempted).toBe(2)
    expect(summary.ingested).toBe(2)
    expect(summary.rejected).toBe(0)
  })

  it('rejects candidates from an unregistered source at the gate', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
    // Note: semrush-mcp is not registered.
    const ingestion = createIngestionService(ingestionDepsFrom(cic, { 'semrush-mcp': candidates }))
    const summary = await ingestion.pollSource('semrush-mcp')
    expect(summary.attempted).toBe(2)
    expect(summary.ingested).toBe(0)
    expect(summary.rejected).toBe(2)
    expect(h.signalRows).toHaveLength(0)
  })

  it('runs the scheduled poll workflow dry when no source is registered', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
    const ingestion = createIngestionService(ingestionDepsFrom(cic, {}))
    const { runner } = fakeStep()
    const summaries = await pollRentedSourcesWorkflow({ ingestion }, runner, {})
    expect(summaries).toEqual([])
  })
})
