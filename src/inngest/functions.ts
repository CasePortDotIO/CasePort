import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import { createRoutingService } from '../services/RoutingService'
import { createDeliveryService } from '../services/DeliveryService'
import { createIntelligenceService } from '../services/IntelligenceService'
import { createAgentService } from '../services/AgentService'
import { createIntakeService } from '../services/IntakeService'
import { createDossierAssemblyService } from '../services/DossierAssemblyService'
import { createPayloadAssemblyDeps } from '../services/adapters/payloadAssembly'
import { createEvidenceCoachingAgent } from '../agents/EvidenceCoachingAgent'
import { createAbandonedIntakeRecoveryAgent } from '../agents/AbandonedIntakeRecoveryAgent'
import { createPayloadRecoveryDeps } from '../services/adapters/payloadRecovery'
import { createProspectingService } from '../services/ProspectingService'
import { createProspectingAgent } from '../agents/ProspectingAgent'
import { createPayloadProspectingDeps } from '../services/adapters/payloadProspecting'
import { createPayloadDeliveryDeps, createPayloadRoutingDeps } from '../services/adapters/payloadDelivery'
import { createPayloadIntelligenceDeps } from '../services/adapters/payloadIntelligence'
import { createPayloadAgentDeps } from '../services/adapters/payloadAgents'
import { createPayloadIntakeDeps } from '../services/adapters/payload'
import { outcomeCaptureUrl } from '../lib/outcomeLink'
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
  const assembly = createDossierAssemblyService(createPayloadAssemblyDeps(payload))
  return {
    routing: createRoutingService(createPayloadRoutingDeps(payload)),
    delivery: createDeliveryService(deliveryDeps),
    wallet: deliveryDeps.wallet,
    loadDossier: (id) => deliveryDeps.dossiers.get(id),
    assembleFirmPackage: async (dossierId, firmId) => {
      const result = await assembly.assembleFirmPackage(dossierId, firmId)
      return result ? { scpsScore: result.scpsScore, scpsVersion: result.scpsVersion } : null
    },
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
 * The Signed Case Feedback Loop (Section 9, AGENTS.md Section 4.6). Recalibrates
 * the SCPS model from firm reported outcomes on a daily cadence and saves it as a
 * PROPOSAL. It never activates the new version: a human promotes a proposal to
 * active through the intelligence service, so the scorer can never silently
 * rewrite itself. The loop is wired from day one even though it has nothing to
 * learn from until the first cases close. Never touches a fee (W4).
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
 * The Evidence and Intake Coaching Agent (AGENTS.md Section 4.1), as a durable
 * step. Triggered after each capture during intake. It observes the current
 * capture inventory and returns the single next photographic or factual
 * direction, guarded so nothing evaluative can reach the claimant (W2, W6). One
 * durable step per capture: a retry re runs the same guarded decision, and the
 * EvidenceCoachingShown event is emitted inside the service, so replays are
 * clean. Bounded by the agent's step cap, timeout, and direction budget.
 */
export const coachEvidence = inngest.createFunction(
  { id: 'evidence-coaching', retries: 2, triggers: [{ event: 'intake/coach.requested' }] },
  async ({ event, step }) => {
    const data = event.data as CaseportEvents['intake/coach.requested']
    const payload = await getPayload({ config })
    const intake = createIntakeService(createPayloadIntakeDeps(payload))
    const agent = createEvidenceCoachingAgent({ coachNextCapture: intake.coachNextCapture })
    const direction = await (step as InngestStep).run('coach-next', () =>
      agent.coachOnce(data.sessionId, data.inventory),
    )
    return { sessionId: data.sessionId, direction }
  },
)

/**
 * The Abandoned Intake Recovery Agent (AGENTS.md Section 4.4). A scheduled scan
 * that re engages claimants who started an intake and did not finish. It only
 * ever touches existing, incomplete sessions on a channel where consent was
 * captured, so it never cold contacts anyone (ABA Formal Opinion 501, TCPA). No
 * message carries legal evaluation; the send is guarded. Bounded per session.
 */
export const recoverAbandonedIntakes = inngest.createFunction(
  { id: 'recover-abandoned-intakes', triggers: [{ cron: '0 */4 * * *' }] },
  async ({ step }) => {
    const payload = await getPayload({ config })
    const agent = createAbandonedIntakeRecoveryAgent(createPayloadRecoveryDeps(payload))
    return (step as InngestStep).run('recover-stale', () => agent.recoverStale())
  },
)

/**
 * The B2B Prospecting and Proof of Reality Agent (AGENTS.md Section 4.3).
 * Triggered when a target firm is named. It researches the firm and drafts
 * personalized outreach with redacted proof of reality. It NEVER sends: the
 * draft is the output, awaiting human review and send (Section 3, human in the
 * loop for all B2B outreach). Every draft is guarded against Rule 7.1.
 */
export const prospectFirm = inngest.createFunction(
  { id: 'prospect-firm', retries: 2, triggers: [{ event: 'prospect/requested' }] },
  async ({ event, step }) => {
    const data = event.data as CaseportEvents['prospect/requested']
    const payload = await getPayload({ config })
    const agent = createProspectingAgent(createProspectingService(createPayloadProspectingDeps(payload)))
    const result = await (step as InngestStep).run('prospect', () => agent.prospect(data))
    // The draft is returned for a human to review and send. Nothing is sent here.
    return { firmId: data.firmId, status: 'draft', awaitingHumanApproval: true, draft: result.draft }
  },
)

export const inngestFunctions = [
  deliverDossier,
  releaseHeldQueue,
  reconcileWallets,
  recalibrateScps,
  deliveryAgents,
  coachEvidence,
  recoverAbandonedIntakes,
  prospectFirm,
]
