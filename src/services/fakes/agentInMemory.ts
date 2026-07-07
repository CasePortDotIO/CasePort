import type { EventStore, StoredEvent } from '../ports'
import type {
  AgentDeps,
  AgentDeliveryStore,
  ClaimantReach,
  ClaimantReachRepository,
  DeliveryForAgent,
  FirmContact,
  FirmContactRepository,
  Notifier,
  NotifyResult,
  OutcomeLookup,
} from '../agentPorts'

/**
 * In memory harness for the agents and the speed loop. The notifier is a dry run
 * that records what it would have sent, so the whole scaffold is exercisable
 * without a live Twilio, Resend, or firm. Nothing here runs in production.
 */

export interface SentMessage {
  channel: 'sms' | 'email'
  to: string
  subject?: string
  body: string
}

export interface AgentHarness extends AgentDeps {
  log: StoredEvent[]
  sent: SentMessage[]
  deliveryRows: Map<string, DeliveryForAgent>
  firmRows: Map<string, FirmContact>
  outcomeDeliveryIds: Set<string>
  claimantRows: Map<string, ClaimantReach>
  clock: { nowIso: () => string }
  setNow(iso: string): void
  addDelivery(d: DeliveryForAgent): void
  addFirm(f: FirmContact): void
  addOutcome(deliveryId: string): void
  /** Attach a reachable claimant to a dossier so the speed callback can text them. */
  addClaimant(dossierId: string, reach: ClaimantReach): void
}

export function createAgentHarness(initialNow = '2026-07-05T12:00:00.000Z'): AgentHarness {
  const log: StoredEvent[] = []
  const sent: SentMessage[] = []
  const deliveryRows = new Map<string, DeliveryForAgent>()
  const firmRows = new Map<string, FirmContact>()
  const outcomeDeliveryIds = new Set<string>()
  const claimantRows = new Map<string, ClaimantReach>()
  let now = initialNow
  let n = 0

  const clock = { nowIso: () => now }

  const events: EventStore = {
    append: async (event) => {
      const stored: StoredEvent = { id: `evt_${(n += 1)}`, ...event }
      log.push(stored)
      return stored
    },
  }

  const deliveries: AgentDeliveryStore = {
    get: async (id) => deliveryRows.get(id) ?? null,
    recordResponse: async (id, respondedAt, responseTimeSeconds) => {
      const d = deliveryRows.get(id)
      if (d) {
        d.firmRespondedAt = respondedAt
        d.responseTimeSeconds = responseTimeSeconds
      }
    },
    markSlaBreached: async (id) => {
      const d = deliveryRows.get(id)
      if (d) d.slaBreached = true
    },
  }

  const firms: FirmContactRepository = {
    get: async (id) => firmRows.get(id) ?? null,
  }

  const outcomes: OutcomeLookup = {
    hasOutcome: async (deliveryId) => outcomeDeliveryIds.has(deliveryId),
  }

  const claimants: ClaimantReachRepository = {
    forDossier: async (dossierId) => claimantRows.get(dossierId) ?? null,
  }

  const notify: Notifier = {
    sms: async ({ to, body }): Promise<NotifyResult> => {
      sent.push({ channel: 'sms', to, body })
      return { sent: true, channel: 'sms', dryRun: true }
    },
    email: async ({ to, subject, body }): Promise<NotifyResult> => {
      sent.push({ channel: 'email', to, subject, body })
      return { sent: true, channel: 'email', dryRun: true }
    },
  }

  return {
    log,
    sent,
    deliveryRows,
    firmRows,
    outcomeDeliveryIds,
    claimantRows,
    deliveries,
    firms,
    outcomes,
    claimants,
    notify,
    events,
    clock,
    setNow: (iso) => {
      now = iso
    },
    addDelivery: (d) => deliveryRows.set(d.id, d),
    addFirm: (f) => firmRows.set(f.id, f),
    addOutcome: (deliveryId) => outcomeDeliveryIds.add(deliveryId),
    addClaimant: (dossierId, reach) => claimantRows.set(dossierId, reach),
  }
}
