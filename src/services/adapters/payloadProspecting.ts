import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import type { RedactedActivity } from '../GlassBoxService'
import type {
  EnrichmentClient,
  ProofOfRealityReader,
  ProspectingDeps,
  WebResearchClient,
} from '../ProspectingService'

/**
 * Payload adapters for the B2B Prospecting and Proof of Reality Agent (AGENTS.md
 * Section 4.3).
 *
 * Enrichment and web research are scaffolded: Clay and a web research provider
 * are not wired yet, so these fall back to what the firm record already knows
 * (its practice areas from the price table). The proof of reality reader pulls
 * redacted, representative recent activity for the market from the dossiers
 * collection, projecting only non PII fields, so nothing identifiable ever
 * reaches a draft.
 */

/** Enrichment fallback: practice areas from the firm's price table. No Clay yet. */
function enrichmentFor(payload: Payload): EnrichmentClient {
  return {
    async enrich({ firmName }) {
      const res = await payload
        .find({ collection: 'firms', where: { name: { equals: firmName } }, limit: 1, depth: 0 })
        .catch(() => null)
      const doc = res?.docs?.[0] as unknown as Record<string, unknown> | undefined
      const priceTable = Array.isArray(doc?.priceTable) ? (doc!.priceTable as Array<{ caseType?: string }>) : []
      const practiceAreas = [...new Set(priceTable.map((r) => String(r.caseType)).filter(Boolean))]
      return { practiceAreas: practiceAreas.length ? practiceAreas : ['personal injury'] }
    },
  }
}

/** Web research fallback. No provider wired yet, so it returns no findings. */
function webResearchFor(): WebResearchClient {
  return { research: async () => ({ findings: [] }) }
}

/** Redacted representative recent activity for a market. No PII projected. */
function proofReaderFor(payload: Payload): ProofOfRealityReader {
  return {
    async forMarket(market, limit) {
      const res = await payload
        .find({ collection: 'dossiers', where: { market: { equals: market } }, sort: '-receivedAt', limit, depth: 0 })
        .catch(() => null)
      if (!res) return []
      return res.docs.map((d) => {
        const doc = d as unknown as Record<string, unknown>
        const item: RedactedActivity = {
          reference: `CP-${String(doc.id).slice(-6).toUpperCase()}`,
          caseType: String(doc.caseType ?? 'unknown'),
          market,
          receivedAt: String(doc.receivedAt ?? ''),
          status: String(doc.status ?? 'received'),
        }
        return item
      })
    },
  }
}

export function createPayloadProspectingDeps(payload: Payload): ProspectingDeps {
  return {
    enrichment: enrichmentFor(payload),
    web: webResearchFor(),
    proof: proofReaderFor(payload),
    events: payloadEventStoreFor(payload),
    clock: { nowIso: () => new Date().toISOString() },
  }
}
