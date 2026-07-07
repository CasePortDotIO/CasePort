import type { SignalIngestInput, IngestResult } from './intelligenceCorePorts'

/**
 * Ports for the CasePort Intelligence Core ingestion layer (Phase B). Ingestion
 * is durable workflows, not agents (Section 3): known steps, variable content.
 * Both the owned event consumer and the rented source pollers ingest only
 * through the epistemic gate, so nothing bypasses the allowlist and rating (H5).
 */

/** The subset of IntelligenceCoreService the ingestion layer needs. */
export interface SignalIngestor {
  ingestSignal(input: SignalIngestInput): Promise<IngestResult>
}

/**
 * Fetches candidate signals from a single rented source. The real adapters wrap
 * the declared source allowlist (Semrush via MCP, the bar and statute trackers,
 * benchmarks). Until a source is activated its fetcher returns nothing, so the
 * scheduled poller runs dry and observable, exactly as the doctrine scaffolds a
 * durable workflow before its content exists. A fetcher never trusts its own
 * output: everything it returns still passes the gate.
 */
export interface SourceFetcher {
  /** Candidate signals observed since the given time, or all recent if omitted. */
  fetch(sourceKey: string, sinceIso?: string): Promise<SignalIngestInput[]>
}

export interface IngestionDeps {
  cic: SignalIngestor
  fetchers: Record<string, SourceFetcher>
}

/** A per run summary of an ingestion pass. Every disposition is accounted for. */
export interface IngestionSummary {
  sourceKey: string
  attempted: number
  ingested: number
  duplicate: number
  supersededOnArrival: number
  rejected: number
  results: IngestResult[]
}
