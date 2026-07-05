import type { Clock, EventStore, IdGenerator } from './ports'
import type { DossierRepository } from './ports'
import type { WalletService } from './WalletService'

/**
 * Ports for routing and delivery (Section 7, Section 8, Section 10). Routing is
 * the most compliance bearing component in the system: it resolves a firm from a
 * market and nothing else. Delivery attaches the firm facing triage, records the
 * delivery, and triggers the atomic debit or, when the wallet is dry, holds the
 * dossier in a queue with no partial state.
 */

/** A delivery record. Starts held, becomes delivered then billed on a covered debit. */
export interface DeliveryRecord {
  id: string
  dossierId: string
  firmId: string
  status: 'held' | 'delivered' | 'billed'
  deliveredAt: string | null
  billed: boolean
}

export interface DeliveryRepository {
  create(input: { dossierId: string; firmId: string; status: 'held' }): Promise<DeliveryRecord>
  get(id: string): Promise<DeliveryRecord | null>
  markDelivered(id: string, deliveredAt: string): Promise<void>
  markBilled(id: string): Promise<void>
  listHeldByFirm(firmId: string): Promise<DeliveryRecord[]>
  /**
   * Any delivery already created for this dossier and firm, in any status.
   * Reusing it makes deliver idempotent: a dossier is delivered to a firm at
   * most once, and the debit is anchored to a stable delivery id so a retry
   * cannot create a second record or a second charge.
   */
  findForDossierFirm(dossierId: string, firmId: string): Promise<DeliveryRecord | null>
}

/**
 * Geographic resolution only (W1). Given a market it returns the single assigned
 * firm and the market type. It cannot see any quality signal: there is no
 * parameter through which one could reach it.
 */
export interface MarketRoutingRepository {
  assignedFirmForMarket(marketId: string): Promise<{ firmId: string; marketType: string } | null>
}

/**
 * The audit half of the wall (W7). Every routing decision records reason
 * geographic. Every delivery decision records delivered or held. Retained seven
 * years alongside consent and disclosure records.
 */
export interface AuditLogWriter {
  record(entry: {
    decisionType: 'routing' | 'delivery'
    reason: 'geographic' | 'delivered' | 'held'
    aggregateId: string
    firmId?: string
    marketId?: string
    actor: string
    details?: Record<string, unknown>
    occurredAt: string
  }): Promise<void>
}

/**
 * The ACID boundary. In production this opens a MongoDB multi document
 * transaction so the ledger debit and the delivery billed write commit together
 * or not at all. The in memory fake runs the function directly; correctness of
 * the no double charge invariant does not depend on it because the unique
 * idempotency index is the ultimate guard.
 */
export interface TransactionRunner {
  run<T>(fn: () => Promise<T>): Promise<T>
}

/** Dependencies for the routing service. Only geographic resolution is reachable. */
export interface RoutingDeps {
  markets: MarketRoutingRepository
  audit: AuditLogWriter
  events: EventStore
  clock: Clock
}

/** Dependencies for the delivery service, including the money moving wallet. */
export interface DeliveryDeps {
  dossiers: DossierRepository
  deliveries: DeliveryRepository
  wallet: WalletService
  audit: AuditLogWriter
  events: EventStore
  ids: IdGenerator
  clock: Clock
  tx: TransactionRunner
}
