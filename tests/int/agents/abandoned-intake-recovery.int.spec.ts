import { describe, it, expect } from 'vitest'
import {
  createAbandonedIntakeRecoveryAgent,
  type RecoveryDeps,
  type RecoverySessionState,
} from '@/agents/AbandonedIntakeRecoveryAgent'
import { findClaimantLanguageViolations } from '@/lib/compliance/claimantLanguage'
import { verifyResume } from '@/lib/resumeLink'

/**
 * The Abandoned Intake Recovery Agent eval harness (AGENTS.md Section 4.4,
 * Section 6). The compliance spine, proven: never contacts a non initiator,
 * consent verified before every send, no legal evaluation in any message, and
 * bounded nudges. ABA Formal Opinion 501 and TCPA.
 */

const HOUR = 3_600_000
const DAY = 24 * HOUR
const NOW = '2026-07-05T18:00:00.000Z'
const nowMs = Date.parse(NOW)

/** A capturing test rig: records every send and every emitted event. */
function rig(sessions: RecoverySessionState[], now = NOW) {
  const sent: Array<{ channel: string; to: string; body: string }> = []
  const events: Array<{ eventType: string; payload?: Record<string, unknown> }> = []
  const deps: RecoveryDeps = {
    store: { listStale: async () => sessions.filter((s) => !s.completed) },
    notify: {
      sms: async ({ to, body }) => {
        sent.push({ channel: 'sms', to, body })
        return { sent: true, channel: 'sms' }
      },
      email: async ({ to, body }) => {
        sent.push({ channel: 'email', to, body })
        return { sent: true, channel: 'email' }
      },
    },
    events: {
      append: async (e) => {
        events.push({ eventType: e.eventType, payload: e.payload })
        return e
      },
    },
    baseUrl: 'https://www.caseport.io',
    clock: { nowIso: () => now },
  }
  return { agent: createAbandonedIntakeRecoveryAgent(deps), sent, events }
}

function staleSession(over: Partial<RecoverySessionState> = {}): RecoverySessionState {
  return {
    sessionId: 'sess_1',
    createdAt: new Date(nowMs - 2 * HOUR).toISOString(),
    lastActivityAt: new Date(nowMs - 2 * HOUR).toISOString(), // 2h idle: stale
    completed: false,
    contact: { phone: '+14045550100', email: 'jordan@example.com' },
    consentCaptured: true,
    nudgesSent: [],
    ...over,
  }
}

describe('Abandoned Intake Recovery Agent: compliance spine (ABA 501, TCPA)', () => {
  it('never sends without consent, no matter how stale or how reachable', async () => {
    const { agent, sent, events } = rig([staleSession({ consentCaptured: false })])
    const summary = await agent.recoverStale()
    expect(summary.sent).toBe(0)
    expect(sent).toHaveLength(0)
    expect(events).toHaveLength(0)
    // The decision names the gate explicitly.
    const decision = agent.decide(staleSession({ consentCaptured: false }), NOW)
    expect(decision).toEqual({ action: 'skip', reason: 'no-consent' })
  })

  it('sends on a consented channel and records that consent was verified', async () => {
    const { agent, sent, events } = rig([staleSession()])
    const summary = await agent.recoverStale()
    expect(summary.sent).toBe(1)
    expect(sent).toHaveLength(1)
    expect(sent[0].channel).toBe('sms') // phone preferred when both present
    const nudge = events.find((e) => e.eventType === 'AbandonedIntakeNudged')
    expect(nudge?.payload?.consentVerified).toBe(true)
    expect(nudge?.payload?.nudgeNumber).toBe(1)
  })

  it('every message is free of legal evaluation and carries a valid signed resume link', async () => {
    const { agent, sent } = rig([staleSession()])
    await agent.recoverStale()
    const body = sent[0].body
    expect(findClaimantLanguageViolations(body)).toEqual([])
    // The link is a signed resume link for this exact session.
    const m = body.match(/resume=([^&\s]+)&sig=([a-f0-9]+)/)
    expect(m).not.toBeNull()
    expect(verifyResume(decodeURIComponent(m![1]), m![2])).toBe(true)
  })

  it('is bounded: never exceeds the max nudge count', async () => {
    const twice = staleSession({
      nudgesSent: [
        { channel: 'sms', at: new Date(nowMs - 3 * DAY).toISOString() },
        { channel: 'sms', at: new Date(nowMs - 2 * DAY).toISOString() },
      ],
    })
    const { agent, sent } = rig([twice])
    const summary = await agent.recoverStale()
    expect(summary.sent).toBe(0)
    expect(sent).toHaveLength(0)
    expect(agent.decide(twice, NOW)).toEqual({ action: 'skip', reason: 'max-nudges-reached' })
  })

  it('respects the minimum interval between nudges', async () => {
    const recent = staleSession({
      nudgesSent: [{ channel: 'sms', at: new Date(nowMs - 2 * HOUR).toISOString() }],
    })
    expect(agentDecision(recent)).toEqual({ action: 'skip', reason: 'interval-not-elapsed' })
  })

  it('does not touch a session that is not yet stale', async () => {
    const fresh = staleSession({ lastActivityAt: new Date(nowMs - 5 * 60_000).toISOString() }) // 5 min
    expect(agentDecision(fresh)).toEqual({ action: 'skip', reason: 'not-stale' })
  })

  it('does not touch a completed intake', async () => {
    const { agent, sent } = rig([staleSession({ completed: true })])
    const summary = await agent.recoverStale()
    // The store already filters completed sessions; belt and suspenders, decide agrees.
    expect(summary.scanned).toBe(0)
    expect(sent).toHaveLength(0)
    expect(agent.decide(staleSession({ completed: true }), NOW)).toEqual({ action: 'skip', reason: 'completed' })
  })

  it('falls back to email when only email has consent coverage', async () => {
    const emailOnly = staleSession({ contact: { phone: null, email: 'jordan@example.com' } })
    const { agent, sent } = rig([emailOnly])
    await agent.recoverStale()
    expect(sent[0].channel).toBe('email')
  })
})

/** Convenience: decide with a throwaway rig at the fixed NOW. */
function agentDecision(s: RecoverySessionState) {
  return rig([s]).agent.decide(s, NOW)
}
