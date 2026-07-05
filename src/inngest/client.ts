import { Inngest } from 'inngest'

/**
 * The Inngest client (Section 3). Inngest is the durable execution layer for
 * every async, retryable, multi step process: delivery, the held queue release
 * after a top up, and scheduled reconciliation. The domain services it calls are
 * pure and idempotent, so an Inngest retry can never double charge or double
 * deliver. That is the whole payoff of the wallet and delivery design: the
 * durable layer is thin because correctness already lives in the services.
 */

/** The event names and payload shapes this system emits and reacts to. */
export type CaseportEvents = {
  'dossier/deliver.requested': { firmId?: string; dossierId: string }
  'wallet/funded': { firmId: string }
  'wallet/low-balance': { firmId: string; deliveryId: string }
  'wallet/drift-detected': { firmId: string; driftCents: number }
}

export type CaseportEventName = keyof CaseportEvents

export const inngest = new Inngest({ id: 'caseport' })
