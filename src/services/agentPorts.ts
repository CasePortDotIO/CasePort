import type { Clock, EventStore } from './ports'

/**
 * Ports for the post signing agents and the speed callback loop (Section 6 step
 * 9, Section 7 step 9). These are durable, time based processes: the speed
 * callback fires the instant a dossier is delivered, the SLA watchdog fires when
 * the callback window closes, and the decay interrupt fires deeper into the
 * decay curve. All are scaffolded now and gated so they activate only when a
 * firm has a live contractual callback SLA (activated at firm one). Everything
 * runs dry, without a live firm or a live Twilio, behind these ports.
 */

export interface DeliveryForAgent {
  id: string
  firmId: string
  dossierId: string
  status: 'held' | 'delivered' | 'billed'
  deliveredAt: string | null
  firmRespondedAt: string | null
  responseTimeSeconds: number | null
  slaBreached: boolean
}

export interface AgentDeliveryStore {
  get(id: string): Promise<DeliveryForAgent | null>
  recordResponse(id: string, respondedAt: string, responseTimeSeconds: number): Promise<void>
  markSlaBreached(id: string): Promise<void>
}

export interface FirmContact {
  id: string
  name: string
  phone?: string
  email?: string
  slaCallbackMinutes: number
  /** The gate. False until a firm signs a contractual callback SLA (firm one). */
  callbackSlaActive: boolean
}

export interface FirmContactRepository {
  get(firmId: string): Promise<FirmContact | null>
}

/** Whether a firm has reported an outcome for a delivery yet. Read only. */
export interface OutcomeLookup {
  hasOutcome(deliveryId: string): Promise<boolean>
}

export interface NotifyResult {
  sent: boolean
  channel: 'sms' | 'email'
  ref?: string
  /** True when the notifier is a dry run (no live Twilio or Resend configured). */
  dryRun: boolean
}

/**
 * Twilio for SMS and the speed callback, Resend for email (Section 3). The
 * production adapter posts to their REST APIs when configured, and no ops
 * cleanly when not, so the whole system is testable in a dry run.
 */
export interface Notifier {
  sms(input: { to: string; body: string }): Promise<NotifyResult>
  email(input: { to: string; subject: string; body: string }): Promise<NotifyResult>
}

export interface AgentDeps {
  deliveries: AgentDeliveryStore
  firms: FirmContactRepository
  outcomes: OutcomeLookup
  notify: Notifier
  events: EventStore
  clock: Clock
}
