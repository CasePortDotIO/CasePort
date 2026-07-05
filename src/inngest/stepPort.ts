import type { RoutingServiceInstance } from '../services/RoutingService'
import type { DeliveryService } from '../services/DeliveryService'
import type { WalletService } from '../services/WalletService'
import type { Dossier } from '@/lib/compliance/dossierProjections'

/**
 * The minimal step runner the workflows depend on, matching the shape of
 * Inngest's step object. Depending on this port instead of Inngest directly is
 * what lets the orchestration be tested without a live Inngest server: a fake
 * step runner executes steps directly, and a memoizing one models Inngest's
 * durable execution where a completed step is never re run on retry.
 */
export interface WorkflowEvent {
  name: string
  data: Record<string, unknown>
}

export interface StepRunner {
  /** Run a named, independently retryable step. Its result is memoized by id. */
  run<T>(id: string, fn: () => Promise<T>): Promise<T>
  /** Emit downstream events durably (fans out to other functions). */
  sendEvent(id: string, events: WorkflowEvent | WorkflowEvent[]): Promise<void>
}

/** The services a workflow orchestrates. All idempotent, so retries are safe. */
export interface WorkflowDeps {
  routing: RoutingServiceInstance
  delivery: DeliveryService
  wallet: WalletService
  loadDossier(dossierId: string): Promise<Dossier | null>
}
