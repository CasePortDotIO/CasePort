import type { Payload } from 'payload'
import { createIntelligenceCoreService } from '../IntelligenceCoreService'
import { intelligenceCoreDepsForPayload } from './payloadIntelligenceCore'
import type { IngestionDeps, SourceFetcher } from '../ingestionPorts'

/**
 * Payload wiring for the CasePort Intelligence Core ingestion layer (Phase B).
 *
 * The owned path is fully live: consumeEvent ingests first party signals through
 * the real epistemic gate built against Payload. The rented path is scaffolded
 * dry: no source fetcher is activated yet, so the scheduled poller runs and is
 * observable but ingests nothing until a source in the declared allowlist is
 * switched on. Activating a source is adding its fetcher here, behind the same
 * gate, never a bypass.
 */

const ACTIVATED_FETCHERS: Record<string, SourceFetcher> = {
  // Rented sources activate here, one at a time, each behind the epistemic gate.
  // For example: 'semrush-mcp': createSemrushFetcher(...). None active yet.
}

export function createPayloadIngestionDeps(payload: Payload): IngestionDeps {
  const cic = createIntelligenceCoreService(intelligenceCoreDepsForPayload(payload))
  return { cic, fetchers: ACTIVATED_FETCHERS }
}
