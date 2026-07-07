import type { SignalIngestInput } from '../intelligenceCorePorts'
import type { IngestionDeps, SignalIngestor, SourceFetcher } from '../ingestionPorts'

/**
 * In memory helpers for the CasePort Intelligence Core ingestion layer (Phase
 * B). A fake fetcher returns a scripted batch of candidate signals so the rented
 * poll path is proven without a live source, and the deps assembler wires the
 * real IntelligenceCoreService gate behind the SignalIngestor port so ingestion
 * exercises the true allowlist, rating, dedup, and supersession.
 */

/** A fetcher that returns a fixed batch of candidates for its source key. */
export function createFakeFetcher(batches: Record<string, SignalIngestInput[]>): SourceFetcher {
  return {
    async fetch(sourceKey) {
      return (batches[sourceKey] ?? []).map((c) => ({ ...c, sourceKey }))
    },
  }
}

/** Assemble ingestion deps from a real ingestor and a set of source batches. */
export function ingestionDepsFrom(
  cic: SignalIngestor,
  batches: Record<string, SignalIngestInput[]>,
): IngestionDeps {
  const fetcher = createFakeFetcher(batches)
  const fetchers: Record<string, SourceFetcher> = {}
  for (const key of Object.keys(batches)) fetchers[key] = fetcher
  return { cic, fetchers }
}
