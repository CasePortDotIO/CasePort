import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import { httpNotifier } from './notifier'
import type {
  BriefingArtifactReader,
  BriefingDeps,
  BriefingIdGenerator,
  BriefingNotifier,
  BriefingRecommendationReader,
  BriefingRecord,
  BriefingRepository,
  QueryResponder,
} from '../briefingPorts'
import type { IntelligenceDomain } from '@/lib/domain/intelligenceCore'

/**
 * Payload wiring for CIC fusion, briefing, and surfaces (Phase D). Reads the
 * latest artifact per domain and the proposed recommendations, persists the
 * fused briefing, and delivers through the internal channels (D9): Resend email
 * to the ops briefing address and the messaging channel to the ops alert number.
 * Recipients come from the environment and dry run cleanly when unset, so the
 * whole surface is testable without live channels. The responder is injected
 * (agentic in production). Internal only (H6).
 */

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : v ? String(v) : '')

function payloadArtifactReader(payload: Payload): BriefingArtifactReader {
  return {
    async latestPerDomain() {
      const domains: IntelligenceDomain[] = ['demand', 'supply', 'regulatory', 'market']
      const out = []
      for (const domain of domains) {
        const res = await payload.find({
          collection: 'intelligence-artifacts',
          where: { domain: { equals: domain } },
          sort: '-generatedAt',
          limit: 1,
        })
        const d = res.docs[0] as unknown as Record<string, unknown> | undefined
        if (d) out.push({ domain, title: String(d.title ?? ''), summary: String(d.summary ?? ''), generatedAt: iso(d.generatedAt) })
      }
      return out
    },
  }
}

function payloadRecommendationReader(payload: Payload): BriefingRecommendationReader {
  return {
    async proposed() {
      const res = await payload.find({
        collection: 'recommendations',
        where: { status: { equals: 'proposed' } },
        limit: 200,
        sort: '-createdAt',
      })
      return (res.docs as unknown as Array<Record<string, unknown>>).map((d) => ({
        id: String(d.id),
        domain: d.domain as IntelligenceDomain,
        action: String(d.action ?? ''),
        expectedValue: String(d.expectedValue ?? ''),
        rationale: String(d.rationale ?? ''),
      }))
    },
  }
}

function payloadBriefingRepository(payload: Payload): BriefingRepository {
  const data = (r: BriefingRecord) => ({
    title: r.title,
    summary: r.summary,
    ranked: r.ranked,
    domainSummaries: r.domainSummaries,
    deliveredChannels: r.deliveredChannels,
    generatedAt: r.generatedAt,
  })
  return {
    async save(record) {
      const existing = record.id
        ? await payload.findByID({ collection: 'briefings', id: record.id }).catch(() => null)
        : null
      if (existing) await payload.update({ collection: 'briefings', id: record.id, data: data(record) as never })
      else await payload.create({ collection: 'briefings', data: data(record) as never })
    },
    async latest() {
      const res = await payload.find({ collection: 'briefings', sort: '-generatedAt', limit: 1 })
      const d = res.docs[0] as unknown as Record<string, unknown> | undefined
      if (!d) return null
      return {
        id: String(d.id),
        title: String(d.title ?? ''),
        summary: String(d.summary ?? ''),
        ranked: (d.ranked as BriefingRecord['ranked']) ?? [],
        domainSummaries: (d.domainSummaries as BriefingRecord['domainSummaries']) ?? [],
        deliveredChannels: (d.deliveredChannels as string[]) ?? [],
        generatedAt: iso(d.generatedAt),
      }
    },
  }
}

/** Internal delivery (D9): Resend email and the messaging channel, from env. */
function envNotifier(): BriefingNotifier {
  const notifier = httpNotifier()
  return {
    async email({ subject, body }) {
      const to = process.env.OPS_BRIEFING_EMAIL
      if (!to) {
        console.info('[briefing] dry run email (no OPS_BRIEFING_EMAIL)')
        return { sent: false }
      }
      const r = await notifier.email({ to, subject, body })
      return { sent: r.sent }
    },
    async message({ body }) {
      const to = process.env.OPS_ALERT_PHONE
      if (!to) {
        console.info('[briefing] dry run message (no OPS_ALERT_PHONE)')
        return { sent: false }
      }
      const r = await notifier.sms({ to, body })
      return { sent: r.sent }
    },
  }
}

const payloadBriefingIds: BriefingIdGenerator = { briefingId: () => '' }

export function createPayloadBriefingDeps(payload: Payload, responder: QueryResponder): BriefingDeps {
  return {
    artifacts: payloadArtifactReader(payload),
    recommendations: payloadRecommendationReader(payload),
    briefings: payloadBriefingRepository(payload),
    notifier: envNotifier(),
    responder,
    events: payloadEventStoreFor(payload),
    ids: payloadBriefingIds,
    clock: { nowIso: () => new Date().toISOString() },
  }
}
