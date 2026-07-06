import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import { createRoutingService } from '../services/RoutingService'
import { createDeliveryService } from '../services/DeliveryService'
import { createIntelligenceService } from '../services/IntelligenceService'
import { createAgentService } from '../services/AgentService'
import { createPayloadDeliveryDeps, createPayloadRoutingDeps } from '../services/adapters/payloadDelivery'
import { createPayloadIntelligenceDeps } from '../services/adapters/payloadIntelligence'
import { createPayloadAgentDeps } from '../services/adapters/payloadAgents'
import { createIngestionService } from '../services/IngestionService'
import { createPayloadIngestionDeps } from '../services/adapters/payloadIngestion'
import { outcomeCaptureUrl } from '../lib/outcomeLink'
import { inngest, type CaseportEvents } from './client'
import type { StepRunner, WorkflowDeps, WorkflowEvent } from './stepPort'
import { deliverDossierWorkflow, reconcileWalletsWorkflow, releaseHeldWorkflow } from './workflows'
import { ingestOwnedSignalWorkflow, pollRentedSourcesWorkflow } from './intelligenceWorkflows'
import type { OwnedEventInput } from '@/lib/intelligence/ownedSignals'

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

/**
 * The Signed Case Feedback Loop (Section 9). Recalibrates the SCPS model from
 * firm reported outcomes on a daily cadence, so the model versions once per day
 * rather than churning a new version per outcome. The loop is wired from day one
 * even though it has nothing to learn from until the first cases close. Never
 * touches a fee (W4).
 */
export const recalibrateScps = inngest.createFunction(
  { id: 'recalibrate-scps', triggers: [{ cron: '0 6 * * *' }] },
  async ({ step }) => {
    const payload = await getPayload({ config })
    const intel = createIntelligenceService(createPayloadIntelligenceDeps(payload))
    return (step as InngestStep).run('recalibrate', () => intel.recalibrateScps())
  },
)

/**
 * The agents and the speed loop (Phase 5), as one durable timeline per delivery.
 * The instant a dossier is delivered the speed callback fires; Inngest then
 * sleeps until the callback SLA window closes and runs the watchdog; then sleeps
 * deeper into the decay curve and runs the decay interrupt. All gated on the
 * firm's live callback SLA, so before firm one every step is a dry no op.
 */
export const deliveryAgents = inngest.createFunction(
  { id: 'delivery-agents', retries: 3, triggers: [{ event: 'delivery/delivered' }] },
  async ({ event, step }) => {
    const data = event.data as CaseportEvents['delivery/delivered']
    const payload = await getPayload({ config })
    const deps = createPayloadAgentDeps(payload)
    const agents = createAgentService(deps)
    const s = step as InngestStep & {
      sleep: (id: string, ms: string | number) => Promise<void>
      sleepUntil: (id: string, at: string | Date) => Promise<void>
    }

    // Speed callback: fire immediately, while the claimant is still on screen.
    await s.run('speed-callback', () => agents.notifyOnDelivery({ deliveryId: data.deliveryId }))

    // SLA watchdog: wait out the callback window, then check for a response.
    const delivery = await s.run('load-delivery', () => deps.deliveries.get(data.deliveryId))
    const firm = delivery ? await s.run('load-firm', () => deps.firms.get(delivery.firmId)) : null
    if (delivery?.deliveredAt && firm) {
      const dueAt = new Date(Date.parse(delivery.deliveredAt) + firm.slaCallbackMinutes * 60_000).toISOString()
      await s.sleepUntil('await-sla-window', dueAt)
      await s.run('check-sla', () => agents.checkSla({ deliveryId: data.deliveryId }))
    }

    // Decay interrupt: deeper in the decay curve, re engage if still unworked.
    await s.sleep('await-decay-window', '72h')
    await s.run('check-decay', () => agents.checkDecay({ deliveryId: data.deliveryId }))

    // Signed case feedback loop: a couple of days later, if the firm still has
    // not told us what happened, ask, with one tap links. Reciprocity, not a
    // nag: reporting is what unlocks their true cost per signed case (W4, never
    // tied to the fee). Skipped silently once an outcome exists.
    await s.sleep('await-outcome-window', '2d')
    await s.run('request-outcome', async () => {
      if (await deps.outcomes.hasOutcome(data.deliveryId)) return { requested: false }
      const delivery = await deps.deliveries.get(data.deliveryId)
      const firm = delivery ? await deps.firms.get(delivery.firmId) : null
      if (!delivery || !firm) return { requested: false }
      const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'
      const signed = outcomeCaptureUrl(base, delivery.id, 'retained')
      const working = outcomeCaptureUrl(base, delivery.id, 'still-evaluating')
      const declined = outcomeCaptureUrl(base, delivery.id, 'not-retained')
      const body =
        `CasePort: did your delivered personal injury case sign? One tap sharpens your true cost per signed case.\n\n` +
        `It signed: ${signed}\nStill working it: ${working}\nIt did not sign: ${declined}`
      const sent: string[] = []
      if (firm.email) {
        const r = await deps.notify.email({ to: firm.email, subject: 'Did this case sign? One tap', body })
        if (r.sent) sent.push('email')
      }
      if (firm.phone) {
        const r = await deps.notify.sms({ to: firm.phone, body })
        if (r.sent) sent.push('sms')
      }
      await deps.events.append({
        eventType: 'OutcomeRequested',
        aggregateType: 'delivery',
        aggregateId: delivery.id,
        actor: 'agent',
        occurredAt: deps.clock.nowIso(),
        payload: { firmId: firm.id, channels: sent },
      })
      return { requested: true, channels: sent }
    })

    return { deliveryId: data.deliveryId }
  },
)

/**
 * Owned intelligence ingestion (INTELLIGENCE_CORE.md Phase B). A live outcome or
 * delivery becomes a first party signal in near real time, through the epistemic
 * gate. Idempotent: a retry re ingests and the gate detects the duplicate, so a
 * signal is never doubled. This is how owned intelligence tracks the business.
 */
export const ingestOwnedIntelligence = inngest.createFunction(
  {
    id: 'ingest-owned-intelligence',
    retries: 3,
    triggers: [{ event: 'outcome/reported' }, { event: 'delivery/delivered' }],
  },
  async ({ event, step }) => {
    const payload = await getPayload({ config })
    const ingestion = createIngestionService(createPayloadIngestionDeps(payload))
    const occurredAt = new Date().toISOString()
    const data = event.data as Record<string, unknown>
    const owned: OwnedEventInput =
      event.name === 'outcome/reported'
        ? {
            eventType: 'OutcomeReported',
            occurredAt,
            aggregateId: String(data.outcomeId ?? ''),
            payload: data,
          }
        : {
            eventType: 'DossierDelivered',
            occurredAt,
            aggregateId: String(data.deliveryId ?? ''),
            payload: data,
          }
    return ingestOwnedSignalWorkflow({ ingestion }, toStepRunner(step as InngestStep), owned)
  },
)

/**
 * Rented source ingestion (INTELLIGENCE_CORE.md Phase B). A scheduled pass polls
 * every activated source on its cadence and ingests each candidate through the
 * gate. Runs dry and observable until a source in the declared allowlist is
 * switched on. Regulatory and bar sources warrant the frequent cadence; this
 * daily pass is the baseline and a per source cadence tightens as sources
 * activate.
 */
export const pollRentedSources = inngest.createFunction(
  { id: 'poll-rented-sources', triggers: [{ cron: '0 7 * * *' }] },
  async ({ step }) => {
    const payload = await getPayload({ config })
    const ingestion = createIngestionService(createPayloadIngestionDeps(payload))
    return pollRentedSourcesWorkflow({ ingestion }, toStepRunner(step as InngestStep), {})
  },
)

export const inngestFunctions = [
  deliverDossier,
  releaseHeldQueue,
  reconcileWallets,
  recalibrateScps,
  deliveryAgents,
  ingestOwnedIntelligence,
  pollRentedSources,
]
