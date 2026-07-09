import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import { httpNotifier } from './notifier'
import type { RecoveryDeps, RecoverySessionState, RecoveryStore } from '@/agents/AbandonedIntakeRecoveryAgent'

/**
 * Payload adapters for the Abandoned Intake Recovery Agent (AGENTS.md Section
 * 4.4). The store returns only existing, incomplete intake sessions, so a non
 * initiator is unreachable by construction. Consent and the last activity are
 * read from the session's own event log, so the agent's gates run on real
 * captured facts, not assumptions.
 */

const relId = (v: unknown) => (v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v))

function payloadRecoveryStore(payload: Payload): RecoveryStore {
  return {
    async listStale(nowIso, staleAfterMs) {
      // Candidates: sessions that did not pass validation, i.e. did not complete.
      const res = await payload
        .find({
          collection: 'intakeSessions',
          where: { validationPassed: { not_equals: true } },
          limit: 2000,
          depth: 0,
        })
        .catch(() => null)
      if (!res) return []

      const now = Date.parse(nowIso)
      const out: RecoverySessionState[] = []

      for (const doc of res.docs as unknown as Array<Record<string, unknown>>) {
        const sessionId = String(doc.id)
        const events = await payload
          .find({ collection: 'events', where: { intakeSession: { equals: sessionId } }, limit: 5000, depth: 0 })
          .catch(() => null)
        const rows = (events?.docs ?? []) as unknown as Array<Record<string, unknown>>

        const times = rows.map((e) => Date.parse(String(e.occurredAt))).filter((n) => Number.isFinite(n))
        const createdAt = String(doc.createdAt ?? nowIso)
        const lastActivityMs = times.length ? Math.max(...times) : Date.parse(createdAt)
        const lastActivityAt = new Date(lastActivityMs).toISOString()

        // Staleness gate applied here so the agent only ever sees ripe sessions.
        if (now - lastActivityMs < staleAfterMs) continue

        const consentCaptured = rows.some((e) => e.eventType === 'ConsentCaptured')
        const nudgesSent = rows
          .filter((e) => e.eventType === 'AbandonedIntakeNudged')
          .map((e) => ({
            channel: ((e.payload as Record<string, unknown>)?.channel === 'email' ? 'email' : 'sms') as 'email' | 'sms',
            at: String(e.occurredAt),
          }))

        // Claimant contact for the consented channel.
        let contact: RecoverySessionState['contact'] = { email: null, phone: null }
        if (doc.claimant) {
          const claimant = (await payload
            .findByID({ collection: 'claimants', id: relId(doc.claimant), depth: 0 })
            .catch(() => null)) as Record<string, unknown> | null
          if (claimant) contact = { email: (claimant.email as string) ?? null, phone: (claimant.phone as string) ?? null }
        }

        out.push({
          sessionId,
          createdAt,
          lastActivityAt,
          completed: doc.validationPassed === true,
          contact,
          consentCaptured,
          nudgesSent,
        })
      }
      return out
    },
  }
}

export function createPayloadRecoveryDeps(payload: Payload): RecoveryDeps {
  return {
    store: payloadRecoveryStore(payload),
    notify: httpNotifier(),
    events: payloadEventStoreFor(payload) as RecoveryDeps['events'],
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io',
    clock: { nowIso: () => new Date().toISOString() },
  }
}
