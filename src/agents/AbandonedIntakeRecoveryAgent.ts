import { findClaimantLanguageViolations } from '@/lib/compliance/claimantLanguage'
import { resumeUrl } from '@/lib/resumeLink'

/**
 * The Abandoned Intake Recovery Agent (AGENTS.md Section 4.4).
 *
 * PATTERN: a light true agent. It decides timing, channel, and message to re
 * engage a half finished intake. The decision depends on session state that
 * cannot be fully enumerated in advance, so it is not a fixed workflow, but its
 * action space is tiny and audited.
 *
 * HARD BOUNDARIES (the compliance spine of this agent):
 *   - Claimant initiated only. It re engages a claimant who ALREADY started an
 *     intake. It never cold contacts anyone. Structurally, its only input is the
 *     set of existing intake sessions; there is no path to a non initiator.
 *   - Consent gated. It sends only on a channel where consent was captured
 *     (ABA Formal Opinion 501 forbids proactively contacting claimants who did
 *     not initiate contact; TCPA gates every channel). No consent, no send, ever.
 *   - No legal evaluation in any message. Every message is guarded by the same
 *     claimant language guard the coaching agent uses. Tested, not trusted.
 *   - Bounded. A maximum number of nudges per session, a minimum interval
 *     between them, and a staleness threshold before the first. It cannot spam.
 *
 * DURABLE: run inside an Inngest function (a scan on a schedule). Every send
 * emits AbandonedIntakeNudged to the event log and is replayable.
 */

export interface RecoverySessionState {
  sessionId: string
  createdAt: string
  /** The most recent activity on the session. Staleness is measured from here. */
  lastActivityAt: string
  /** True once the intake reached completion (validated / dossier assembled). */
  completed: boolean
  /** Contact captured at intake. A channel is usable only if consent covers it. */
  contact: { email?: string | null; phone?: string | null }
  /** Whether the claimant captured consent. The gate for any outreach. */
  consentCaptured: boolean
  /** Prior recovery nudges already sent for this session. */
  nudgesSent: Array<{ channel: 'email' | 'sms'; at: string }>
}

export interface RecoveryBounds {
  /** Minimum idle time before the first nudge, milliseconds. */
  staleAfterMs: number
  /** Minimum time between nudges, milliseconds. */
  minIntervalMs: number
  /** Maximum nudges per session, ever. */
  maxNudges: number
}

export const DEFAULT_RECOVERY_BOUNDS: RecoveryBounds = {
  staleAfterMs: 30 * 60_000, // 30 minutes idle
  minIntervalMs: 24 * 60 * 60_000, // at most one nudge a day
  maxNudges: 2,
}

export type RecoveryChannel = 'email' | 'sms'

export type RecoverySkipReason =
  | 'completed'
  | 'not-stale'
  | 'no-consent'
  | 'no-channel'
  | 'max-nudges-reached'
  | 'interval-not-elapsed'

export type RecoveryDecision =
  | { action: 'skip'; reason: RecoverySkipReason }
  | { action: 'send'; channel: RecoveryChannel; to: string; message: string; resumeLink: string }

/** The audited action space (AGENTS.md Section 3): read state, send on a
 * consented channel, emit the event. No raw access. */
export const TOOL_ALLOWLIST = [
  'RecoveryStore.listStale',
  'Notify.sms',
  'Notify.email',
  'IntakeService.resumeLink',
  'EventStore.append',
] as const

export interface RecoveryNotify {
  sms(input: { to: string; body: string }): Promise<{ sent: boolean; channel: string; dryRun?: boolean }>
  email(input: { to: string; subject: string; body: string }): Promise<{ sent: boolean; channel: string; dryRun?: boolean }>
}

export interface RecoveryStore {
  /** Existing intake sessions that are stale and incomplete. Only started
   * sessions are ever returned, so a non initiator is unreachable by construction. */
  listStale(nowIso: string, staleAfterMs: number): Promise<RecoverySessionState[]>
}

export interface RecoveryEvents {
  append(event: {
    eventType: 'AbandonedIntakeNudged'
    aggregateType: string
    aggregateId: string
    intakeSessionId?: string
    actor: string
    occurredAt: string
    payload?: Record<string, unknown>
  }): Promise<unknown>
}

export interface RecoveryDeps {
  store: RecoveryStore
  notify: RecoveryNotify
  events: RecoveryEvents
  /** Base URL for the resume link. */
  baseUrl: string
  clock: { nowIso: () => string }
  bounds?: Partial<RecoveryBounds>
}

/** The warm, procedural nudge. Photographic and factual only, never legal
 * evaluation. It reminds the claimant they started and how to continue. */
function nudgeMessage(link: string): string {
  return (
    'You started documenting your accident with CasePort and did not finish. ' +
    'Your progress is saved. You can pick up right where you left off here: ' +
    link
  )
}

export function createAbandonedIntakeRecoveryAgent(deps: RecoveryDeps) {
  const bounds: RecoveryBounds = { ...DEFAULT_RECOVERY_BOUNDS, ...deps.bounds }

  /** Choose the channel to reach a claimant on. Consent gates everything: with
   * no consent captured there is no usable channel, so the agent cannot send. */
  function chooseChannel(s: RecoverySessionState): { channel: RecoveryChannel; to: string } | null {
    if (!s.consentCaptured) return null
    if (s.contact.phone) return { channel: 'sms', to: s.contact.phone }
    if (s.contact.email) return { channel: 'email', to: s.contact.email }
    return null
  }

  /**
   * The observe and decide half, pure and testable. Given one session's state and
   * the current time, decide whether and how to re engage. This is where every
   * hard boundary is enforced before a single message is composed.
   */
  function decide(s: RecoverySessionState, nowIso: string): RecoveryDecision {
    if (s.completed) return { action: 'skip', reason: 'completed' }

    const now = Date.parse(nowIso)
    if (now - Date.parse(s.lastActivityAt) < bounds.staleAfterMs) {
      return { action: 'skip', reason: 'not-stale' }
    }
    if (s.nudgesSent.length >= bounds.maxNudges) {
      return { action: 'skip', reason: 'max-nudges-reached' }
    }
    const last = s.nudgesSent[s.nudgesSent.length - 1]
    if (last && now - Date.parse(last.at) < bounds.minIntervalMs) {
      return { action: 'skip', reason: 'interval-not-elapsed' }
    }

    // Consent gate. No consent means no usable channel means no send, ever.
    const channel = chooseChannel(s)
    if (!s.consentCaptured) return { action: 'skip', reason: 'no-consent' }
    if (!channel) return { action: 'skip', reason: 'no-channel' }

    const link = resumeUrl(deps.baseUrl, s.sessionId)
    const message = nudgeMessage(link)
    return { action: 'send', channel: channel.channel, to: channel.to, message, resumeLink: link }
  }

  /**
   * The act half for one session: decide, and if the decision is to send, guard
   * the message, deliver it on the consented channel, and record the nudge. A
   * message that somehow carried legal evaluation is never sent; the send aborts
   * and is reported, so the guard is a hard stop, not a warning.
   */
  async function recoverOne(s: RecoverySessionState): Promise<
    | { sent: false; reason: RecoverySkipReason | 'blocked-non-compliant' }
    | { sent: true; channel: RecoveryChannel }
  > {
    const nowIso = deps.clock.nowIso()
    const decision = decide(s, nowIso)
    if (decision.action === 'skip') return { sent: false, reason: decision.reason }

    // Compliance hard stop: never send a message that carries legal evaluation.
    if (findClaimantLanguageViolations(decision.message).length > 0) {
      return { sent: false, reason: 'blocked-non-compliant' }
    }

    if (decision.channel === 'sms') {
      await deps.notify.sms({ to: decision.to, body: decision.message })
    } else {
      await deps.notify.email({
        to: decision.to,
        subject: 'Your CasePort intake is saved',
        body: decision.message,
      })
    }

    await deps.events.append({
      eventType: 'AbandonedIntakeNudged',
      aggregateType: 'intakeSession',
      aggregateId: s.sessionId,
      intakeSessionId: s.sessionId,
      actor: 'agent',
      occurredAt: nowIso,
      payload: {
        channel: decision.channel,
        nudgeNumber: s.nudgesSent.length + 1,
        consentVerified: true,
      },
    })
    return { sent: true, channel: decision.channel }
  }

  /**
   * The scan. Pull every stale, incomplete, claimant started session and run the
   * agent over each. Returns a summary. Bounded by the store returning only
   * started sessions, so there is no path to a non initiator.
   */
  async function recoverStale(): Promise<{ scanned: number; sent: number; skipped: number }> {
    const nowIso = deps.clock.nowIso()
    const stale = await deps.store.listStale(nowIso, bounds.staleAfterMs)
    let sent = 0
    for (const s of stale) {
      const r = await recoverOne(s)
      if (r.sent) sent += 1
    }
    return { scanned: stale.length, sent, skipped: stale.length - sent }
  }

  return { bounds, toolAllowlist: TOOL_ALLOWLIST, decide, recoverOne, recoverStale }
}

export type AbandonedIntakeRecoveryAgent = ReturnType<typeof createAbandonedIntakeRecoveryAgent>
