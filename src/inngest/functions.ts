import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import { createRoutingService } from '../services/RoutingService'
import { createDeliveryService } from '../services/DeliveryService'
import { createPayloadDeliveryDeps, createPayloadRoutingDeps } from '../services/adapters/payloadDelivery'
import { inngest, type CaseportEvents } from './client'
import type { StepRunner, WorkflowDeps, WorkflowEvent } from './stepPort'
import { deliverDossierWorkflow, reconcileWalletsWorkflow, releaseHeldWorkflow } from './workflows'

/**
 * Inngest functions: the thin durable binding. Each builds the domain services
 * against Payload and hands Inngest's step object to a pure workflow. Retries
 * are configured here; the idempotent services make them safe.
 */

/** Build the workflow service bundle from a Payload instance. */
export function buildWorkflowDeps(payload: Payload): WorkflowDeps {
  const deliveryDeps = createPayloadDeliveryDeps(payload)
  return {
    routing: createRoutingService(createPayloadRoutingDeps(payload)),
    delivery: createDeliveryService(deliveryDeps),
    wallet: deliveryDeps.wallet,
    loadDossier: (id) => deliveryDeps.dossiers.get(id),
  }
}

/** Adapt Inngest's step object to the StepRunner port the workflows depend on. */
type InngestStep = {
  run: <T>(id: string, fn: () => Promise<T>) => Promise<T>
  sendEvent: (id: string, events: unknown) => Promise<unknown>
}
function toStepRunner(step: InngestStep): StepRunner {
  return {
    run: (id, fn) => step.run(id, fn),
    sendEvent: async (id, events: WorkflowEvent | WorkflowEvent[]) => {
      await step.sendEvent(id, events)
    },
  }
}

/** Deliver a routed dossier. Triggered on request; retried up to four times. */
export const deliverDossier = inngest.createFunction(
  { id: 'deliver-dossier', retries: 4, triggers: [{ event: 'dossier/deliver.requested' }] },
  async ({ event, step }) => {
    const data = event.data as CaseportEvents['dossier/deliver.requested']
    const payload = await getPayload({ config })
    return deliverDossierWorkflow(buildWorkflowDeps(payload), toStepRunner(step as InngestStep), {
      dossierId: data.dossierId,
    })
  },
)

/**
 * Release the held queue when a firm funds its wallet. This closes the wallet
 * dry loop: a top up automatically re attempts every held delivery, in order,
 * without a human touching anything.
 */
export const releaseHeldQueue = inngest.createFunction(
  { id: 'release-held-queue', retries: 4, triggers: [{ event: 'wallet/funded' }] },
  async ({ event, step }) => {
    const data = event.data as CaseportEvents['wallet/funded']
    const payload = await getPayload({ config })
    return releaseHeldWorkflow(buildWorkflowDeps(payload), toStepRunner(step as InngestStep), {
      firmId: data.firmId,
    })
  },
)

/**
 * Scheduled reconciliation across all firms. Flags any ledger versus snapshot
 * drift for human review. Runs hourly in production.
 */
export const reconcileWallets = inngest.createFunction(
  { id: 'reconcile-wallets', triggers: [{ cron: '0 * * * *' }] },
  async ({ step }) => {
    const payload = await getPayload({ config })
    const firms = await payload.find({ collection: 'firms', limit: 1000, depth: 0 })
    const firmIds = firms.docs.map((f) => String((f as { id: unknown }).id))
    return reconcileWalletsWorkflow(buildWorkflowDeps(payload), toStepRunner(step as InngestStep), { firmIds })
  },
)

export const inngestFunctions = [deliverDossier, releaseHeldQueue, reconcileWallets]
