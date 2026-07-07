import type { Clock, EventStore, StoredEvent } from '../ports'
import { expectedValueScore } from '@/lib/intelligence/expectedValue'
import type {
  BriefingArtifact,
  BriefingArtifactReader,
  BriefingDeps,
  BriefingIdGenerator,
  BriefingNotifier,
  BriefingRecommendation,
  BriefingRecommendationReader,
  BriefingRecord,
  BriefingRepository,
  QueryResponder,
} from '../briefingPorts'

/**
 * In memory harness for CIC fusion, briefing, and surfaces (Phase D). It scripts
 * the domain artifacts and proposed recommendations, records delivered channels,
 * and captures the briefing and events, so the fusion, delivery, query, and
 * alert paths are proven without a live database or a live channel.
 */
export interface BriefingHarness {
  log: StoredEvent[]
  briefingRows: BriefingRecord[]
  emails: Array<{ subject: string; body: string }>
  messages: Array<{ body: string }>
  artifacts: BriefingArtifactReader
  recommendations: BriefingRecommendationReader
  briefings: BriefingRepository
  notifier: BriefingNotifier
  events: EventStore
  ids: BriefingIdGenerator
  clock: Clock
}

export function createBriefingHarness(input: {
  artifacts: BriefingArtifact[]
  recommendations: BriefingRecommendation[]
  emailSends?: boolean
  messageSends?: boolean
}): BriefingHarness {
  const log: StoredEvent[] = []
  const briefingRows: BriefingRecord[] = []
  const emails: Array<{ subject: string; body: string }> = []
  const messages: Array<{ body: string }> = []
  let n = 0
  const next = (p: string) => `${p}_${(n += 1)}`

  return {
    log,
    briefingRows,
    emails,
    messages,
    artifacts: {
      async latestPerDomain() {
        return input.artifacts.map((a) => ({ ...a }))
      },
    },
    recommendations: {
      async proposed() {
        return input.recommendations.map((r) => ({ ...r }))
      },
    },
    briefings: {
      async save(record) {
        const idx = briefingRows.findIndex((b) => b.id === record.id)
        if (idx >= 0) briefingRows[idx] = record
        else briefingRows.push(record)
      },
      async latest() {
        return briefingRows[briefingRows.length - 1] ?? null
      },
    },
    notifier: {
      async email(i) {
        emails.push(i)
        return { sent: input.emailSends ?? true }
      },
      async message(i) {
        messages.push(i)
        return { sent: input.messageSends ?? true }
      },
    },
    events: {
      async append(event) {
        const stored: StoredEvent = { ...event, id: next('evt') }
        log.push(stored)
        return stored
      },
    },
    ids: { briefingId: () => next('brief') },
    clock: { nowIso: () => '2026-07-06T12:00:00.000Z' },
  }
}

export function briefingDepsFrom(h: BriefingHarness, responder: QueryResponder): BriefingDeps {
  return {
    artifacts: h.artifacts,
    recommendations: h.recommendations,
    briefings: h.briefings,
    notifier: h.notifier,
    responder,
    events: h.events,
    ids: h.ids,
    clock: h.clock,
  }
}

/**
 * A grounded query responder: it answers only from the provided context and
 * cites what it used, with confidence scaled to how much intelligence backs it.
 * It never asserts a figure that is not in the context (H5).
 */
export function createGroundedResponder(): QueryResponder {
  return {
    async answer(question, context) {
      // Reason to the highest expected value action in the current context.
      const ranked = [...context.recommendations].sort(
        (a, b) => expectedValueScore(b.expectedValue) - expectedValueScore(a.expectedValue),
      )
      const citations = [
        ...ranked.slice(0, 2).map((r) => `recommendation:${r.id}`),
        ...context.artifacts.slice(0, 2).map((a) => `artifact:${a.domain}`),
      ]
      const top = ranked[0]
      const answer = top
        ? `Based on the current intelligence, the highest expected value action is: ${top.action} (${top.expectedValue}).`
        : `There is not enough current intelligence to answer "${question}". Flagging for human verification.`
      const confidence = citations.length >= 3 ? 'high' : citations.length >= 1 ? 'medium' : 'low'
      return { answer, citations, confidence }
    },
  }
}
