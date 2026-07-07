import type { AgentDeps, DeliveryForAgent, FirmContact } from './agentPorts'
import { findClaimantLanguageViolations } from '@/lib/compliance/claimantLanguage'

/**
 * The post signing agents and the speed callback loop (Section 6 step 9, Section
 * 7 step 9). Scaffolded now, gated on a firm's live contractual callback SLA so
 * they activate at firm one, and fully testable in a dry run.
 *
 *   notifyOnDelivery   the speed callback. The instant a dossier is delivered,
 *                      the firm partner is prompted to call while the claimant is
 *                      still on the confirmation screen.
 *   recordFirmResponse the firm marks that it made contact; the response time is
 *                      computed against the SLA.
 *   checkSla           the watchdog. When the callback window closes with no
 *                      response, the delivery is flagged breached and an alert
 *                      fires.
 *   checkDecay         the decay interrupt. A delivered opportunity still unworked
 *                      deeper in the decay curve triggers a re engagement nudge.
 */

/** Pure SLA computation. No side effects, trivially testable. */
export function slaStatus(input: {
  deliveredAt: string | null
  firmRespondedAt: string | null
  slaMinutes: number
  nowIso: string
}): { dueAtIso: string | null; respondedInTime: boolean | null; breached: boolean } {
  if (!input.deliveredAt) return { dueAtIso: null, respondedInTime: null, breached: false }
  const deliveredMs = Date.parse(input.deliveredAt)
  const dueMs = deliveredMs + input.slaMinutes * 60_000
  const dueAtIso = new Date(dueMs).toISOString()

  if (input.firmRespondedAt) {
    const respondedMs = Date.parse(input.firmRespondedAt)
    return { dueAtIso, respondedInTime: respondedMs <= dueMs, breached: false }
  }
  const nowMs = Date.parse(input.nowIso)
  return { dueAtIso, respondedInTime: null, breached: nowMs >= dueMs }
}

const PERSONAL_INJURY = 'personal injury'

/**
 * The claimant heads up for the speed callback (Section 6 step 9). The instant a
 * firm is prompted to call, the claimant is told to expect it, so a call from a
 * local number is welcome, not a surprise. Procedural and factual only: it names
 * the firm that is calling and asks them to keep their phone nearby. It makes no
 * claim about the case (W2, W6). Pure, so the copy is unit tested and guarded.
 */
export function speedCallbackClaimantMessage(input: { firstName?: string; firmName: string }): string {
  const name = input.firstName?.trim() ? `${input.firstName.trim()}, ` : ''
  return (
    `CasePort: ${name}an attorney from ${input.firmName} is about to call you about your ${PERSONAL_INJURY} case. ` +
    `Keep your phone nearby. The call comes from a local number.`
  )
}

export function createAgentService(deps: AgentDeps) {
  async function load(deliveryId: string): Promise<{ delivery: DeliveryForAgent; firm: FirmContact } | null> {
    const delivery = await deps.deliveries.get(deliveryId)
    if (!delivery) return null
    const firm = await deps.firms.get(delivery.firmId)
    if (!firm) return null
    return { delivery, firm }
  }

  async function notifyFirm(firm: FirmContact, subject: string, body: string) {
    const results = []
    if (firm.phone) results.push(await deps.notify.sms({ to: firm.phone, body }))
    if (firm.email) results.push(await deps.notify.email({ to: firm.email, subject, body }))
    return results
  }

  /**
   * The speed callback. Fires the instant a dossier is delivered. Gated on the
   * firm's live callback SLA: until firm one it records that it would have fired
   * (activated false) without sending, so the scaffold is exercisable dry.
   */
  async function notifyOnDelivery(input: { deliveryId: string; caseHeadline?: string }): Promise<{
    activated: boolean
    notified: number
    claimantNotified: boolean
  }> {
    const loaded = await load(input.deliveryId)
    if (!loaded) return { activated: false, notified: 0, claimantNotified: false }
    const { delivery, firm } = loaded

    if (!firm.callbackSlaActive) {
      // Scaffolded, not yet activated. No message is sent before firm one.
      return { activated: false, notified: 0, claimantNotified: false }
    }

    const headline = input.caseHeadline ?? `a new ${PERSONAL_INJURY} opportunity in your market`
    const body = `CasePort: ${headline} was just delivered. Call now, within your ${firm.slaCallbackMinutes} minute window, while the claimant is still on the confirmation screen.`
    const results = await notifyFirm(firm, `New ${PERSONAL_INJURY} case delivered`, body)

    // The other half of the magic: tell the claimant to expect the call, so a
    // local number ringing seconds after they finished is welcome, not a
    // surprise. Best effort and guarded: the copy is checked for legal
    // evaluation and non recommendation language, and skipped if it ever drifts
    // or the claimant has no phone. It never blocks the firm notification.
    let claimantNotified = false
    try {
      const claimant = deps.claimants ? await deps.claimants.forDossier(delivery.dossierId) : null
      if (claimant?.phone) {
        const message = speedCallbackClaimantMessage({ firstName: claimant.firstName, firmName: firm.name })
        if (findClaimantLanguageViolations(message).length === 0) {
          const r = await deps.notify.sms({ to: claimant.phone, body: message })
          claimantNotified = r.sent
        }
      }
    } catch {
      claimantNotified = false
    }

    await deps.events.append({
      eventType: 'SpeedCallbackNotified',
      aggregateType: 'delivery',
      aggregateId: delivery.id,
      actor: 'agent',
      occurredAt: deps.clock.nowIso(),
      payload: {
        firmId: firm.id,
        channels: results.map((r) => r.channel),
        dryRun: results.some((r) => r.dryRun),
        claimantNotified,
      },
    })

    return { activated: true, notified: results.filter((r) => r.sent).length, claimantNotified }
  }

  /** The firm records that it made contact. Response time is measured against the SLA. */
  async function recordFirmResponse(input: { deliveryId: string; respondedAt?: string }): Promise<{
    recorded: boolean
    responseTimeSeconds: number | null
    withinSla: boolean | null
  }> {
    const loaded = await load(input.deliveryId)
    if (!loaded) return { recorded: false, responseTimeSeconds: null, withinSla: null }
    const { delivery, firm } = loaded
    if (!delivery.deliveredAt) return { recorded: false, responseTimeSeconds: null, withinSla: null }

    const respondedAt = input.respondedAt ?? deps.clock.nowIso()
    const responseTimeSeconds = Math.max(0, Math.round((Date.parse(respondedAt) - Date.parse(delivery.deliveredAt)) / 1000))
    await deps.deliveries.recordResponse(delivery.id, respondedAt, responseTimeSeconds)

    const status = slaStatus({ deliveredAt: delivery.deliveredAt, firmRespondedAt: respondedAt, slaMinutes: firm.slaCallbackMinutes, nowIso: deps.clock.nowIso() })

    await deps.events.append({
      eventType: 'FirmResponded',
      aggregateType: 'delivery',
      aggregateId: delivery.id,
      actor: 'firm',
      occurredAt: deps.clock.nowIso(),
      payload: { firmId: firm.id, responseTimeSeconds, withinSla: status.respondedInTime },
    })

    return { recorded: true, responseTimeSeconds, withinSla: status.respondedInTime }
  }

  /**
   * The SLA watchdog. Run when the callback window closes. If the firm responded
   * in time, nothing happens. If the window passed with no response, the delivery
   * is flagged breached and an alert fires. Gated on the live callback SLA.
   */
  async function checkSla(input: { deliveryId: string }): Promise<{
    watched: boolean
    breached: boolean
    dueAtIso: string | null
  }> {
    const loaded = await load(input.deliveryId)
    if (!loaded) return { watched: false, breached: false, dueAtIso: null }
    const { delivery, firm } = loaded
    if (!firm.callbackSlaActive) return { watched: false, breached: false, dueAtIso: null }

    const status = slaStatus({
      deliveredAt: delivery.deliveredAt,
      firmRespondedAt: delivery.firmRespondedAt,
      slaMinutes: firm.slaCallbackMinutes,
      nowIso: deps.clock.nowIso(),
    })

    if (!delivery.firmRespondedAt && status.breached && !delivery.slaBreached) {
      await deps.deliveries.markSlaBreached(delivery.id)
      await notifyFirm(
        firm,
        `Missed callback window`,
        `CasePort: the ${firm.slaCallbackMinutes} minute callback window for a delivered ${PERSONAL_INJURY} case has passed with no recorded contact. Please reach the claimant now.`,
      )
      await deps.events.append({
        eventType: 'SlaBreached',
        aggregateType: 'delivery',
        aggregateId: delivery.id,
        actor: 'agent',
        occurredAt: deps.clock.nowIso(),
        payload: { firmId: firm.id, dueAtIso: status.dueAtIso },
      })
      return { watched: true, breached: true, dueAtIso: status.dueAtIso }
    }

    return { watched: true, breached: false, dueAtIso: status.dueAtIso }
  }

  /**
   * The decay interrupt. Run deeper in the decay curve. If the firm has reported
   * an outcome the case is being worked and nothing happens. If it is still
   * unworked, a re engagement nudge fires so an aging opportunity is not lost.
   */
  async function checkDecay(input: { deliveryId: string }): Promise<{ reengaged: boolean }> {
    const loaded = await load(input.deliveryId)
    if (!loaded) return { reengaged: false }
    const { delivery, firm } = loaded

    const worked = await deps.outcomes.hasOutcome(delivery.id)
    if (worked) return { reengaged: false }

    await notifyFirm(
      firm,
      `Re engage a ${PERSONAL_INJURY} opportunity`,
      `CasePort: a delivered ${PERSONAL_INJURY} opportunity in your market is still unworked. Its value decays with time. Re engage the claimant to protect the case.`,
    )
    await deps.events.append({
      eventType: 'DecayInterrupt',
      aggregateType: 'delivery',
      aggregateId: delivery.id,
      actor: 'agent',
      occurredAt: deps.clock.nowIso(),
      payload: { firmId: firm.id },
    })
    return { reengaged: true }
  }

  return { notifyOnDelivery, recordFirmResponse, checkSla, checkDecay }
}

export type AgentService = ReturnType<typeof createAgentService>
