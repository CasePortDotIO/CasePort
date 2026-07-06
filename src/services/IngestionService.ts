import { eventToOwnedSignal, type OwnedEventInput } from '@/lib/intelligence/ownedSignals'
import type { IngestResult } from './intelligenceCorePorts'
import type { IngestionDeps, IngestionSummary } from './ingestionPorts'

/**
 * IngestionService. The CasePort Intelligence Core ingestion layer (Phase B).
 * It feeds the signals store continuously from two directions:
 *
 *   consumeEvent   the owned path. A live domain event from the shared event log
 *                  becomes a first party signal in near real time, so owned
 *                  intelligence tracks the business as it runs. This is the moat.
 *   pollSource     the rented path. A scheduled pass fetches candidate signals
 *                  from an allowlisted source and ingests each. Sources poll on
 *                  cadences appropriate to their volatility.
 *
 * Both paths ingest only through the epistemic gate (SignalIngestor), so nothing
 * bypasses the allowlist, the rating, deduplication, or supersession (H5). The
 * service never throws on untrusted input; it returns typed dispositions so the
 * durable workflows stay observable and retry safe (Section 3).
 */
export function createIngestionService(deps: IngestionDeps) {
  /**
   * The owned path. Map a live event to a first party signal and ingest it.
   * Returns null when the event carries no intelligence (nothing is fabricated).
   */
  async function consumeEvent(event: OwnedEventInput): Promise<IngestResult | null> {
    const signal = eventToOwnedSignal(event)
    if (!signal) return null
    return deps.cic.ingestSignal(signal)
  }

  /**
   * The rented path. Fetch candidate signals from one source and ingest each
   * through the gate. A source with no registered fetcher, or one that is not
   * yet activated, contributes nothing rather than failing the pass.
   */
  async function pollSource(sourceKey: string, sinceIso?: string): Promise<IngestionSummary> {
    const summary: IngestionSummary = {
      sourceKey,
      attempted: 0,
      ingested: 0,
      duplicate: 0,
      supersededOnArrival: 0,
      rejected: 0,
      results: [],
    }
    const fetcher = deps.fetchers[sourceKey]
    if (!fetcher) return summary

    const candidates = await fetcher.fetch(sourceKey, sinceIso)
    for (const candidate of candidates) {
      summary.attempted += 1
      const result = await deps.cic.ingestSignal({ ...candidate, sourceKey })
      summary.results.push(result)
      if (result.disposition === 'ingested') summary.ingested += 1
      else if (result.disposition === 'duplicate') summary.duplicate += 1
      else if (result.disposition === 'superseded-on-arrival') summary.supersededOnArrival += 1
      else summary.rejected += 1
    }
    return summary
  }

  /** Poll every registered source in one pass. Used by the scheduled workflow. */
  async function pollAll(sinceIso?: string): Promise<IngestionSummary[]> {
    const keys = Object.keys(deps.fetchers)
    const summaries: IngestionSummary[] = []
    for (const key of keys) summaries.push(await pollSource(key, sinceIso))
    return summaries
  }

  return { consumeEvent, pollSource, pollAll }
}

export type IngestionService = ReturnType<typeof createIngestionService>
