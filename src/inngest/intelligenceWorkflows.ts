import type { StepRunner } from './stepPort'
import type { IngestionService } from '../services/IngestionService'
import type { OwnedEventInput } from '@/lib/intelligence/ownedSignals'
import type { IngestionSummary } from '../services/ingestionPorts'

/**
 * Pure ingestion workflows for the CasePort Intelligence Core (Phase B). Like
 * the delivery workflows, these are thin and durable: each step is named and
 * independently retryable, and the IngestionService they call ingests only
 * through the epistemic gate, so a retry can never corrupt the signals store.
 * They depend on the StepRunner port, not on Inngest, so they run under a fake
 * step runner in tests and under Inngest in production.
 */

export interface IntelligenceWorkflowDeps {
  ingestion: IngestionService
}

/**
 * The owned path. A live domain event becomes a first party signal in near real
 * time. One memoized step, so a retry re ingests idempotently through the gate
 * (a duplicate is detected, never doubled).
 */
export async function ingestOwnedSignalWorkflow(
  deps: IntelligenceWorkflowDeps,
  step: StepRunner,
  event: OwnedEventInput,
): Promise<{ ingested: boolean; disposition: string | null }> {
  const result = await step.run('ingest-owned', () => deps.ingestion.consumeEvent(event))
  return { ingested: result?.disposition === 'ingested', disposition: result?.disposition ?? null }
}

/**
 * The rented path. A scheduled pass polls every registered source and ingests
 * each candidate through the gate. Runs dry and observable until a source is
 * activated. One step per source keeps a slow source from re running a fast one
 * on retry.
 */
export async function pollRentedSourcesWorkflow(
  deps: IntelligenceWorkflowDeps,
  step: StepRunner,
  input: { sinceIso?: string; sourceKeys?: string[] },
): Promise<IngestionSummary[]> {
  if (input.sourceKeys && input.sourceKeys.length > 0) {
    const summaries: IngestionSummary[] = []
    for (const key of input.sourceKeys) {
      summaries.push(await step.run(`poll-${key}`, () => deps.ingestion.pollSource(key, input.sinceIso)))
    }
    return summaries
  }
  return step.run('poll-all', () => deps.ingestion.pollAll(input.sinceIso))
}
