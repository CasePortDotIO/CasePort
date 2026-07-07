import type { Payload } from 'payload'
import { createIntelligenceCoreService } from '../IntelligenceCoreService'
import { intelligenceCoreDepsForPayload } from './payloadIntelligenceCore'
import { createDataForSeoFetcher, DATAFORSEO_SOURCE_KEY } from './dataForSeoFetcher'
import type { IngestionDeps, SourceFetcher } from '../ingestionPorts'

/**
 * Payload wiring for the CasePort Intelligence Core ingestion layer (Phase B).
 *
 * The owned path is fully live: consumeEvent ingests first party signals through
 * the real epistemic gate built against Payload. The rented path activates a
 * source by adding its fetcher here, always behind the same gate, never a bypass.
 * DataForSEO is wired as the keyword and search data source (a pay as you go
 * alternative to the Semrush API); it runs dry until its credentials are set, so
 * the scheduled poller stays observable and no spend is committed by wiring it.
 */

export function createPayloadIngestionDeps(payload: Payload): IngestionDeps {
  const cic = createIntelligenceCoreService(intelligenceCoreDepsForPayload(payload))
  const fetchers: Record<string, SourceFetcher> = {
    [DATAFORSEO_SOURCE_KEY]: createDataForSeoFetcher(payload),
  }
  return { cic, fetchers }
}
