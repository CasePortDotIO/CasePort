import config from '@payload-config'
import { getPayload } from 'payload'
import { createGlassBoxService, SAMPLE_DOSSIER } from '@/services/GlassBoxService'
import { createPayloadGlassBoxDeps } from '@/services/adapters/payloadWallet'
import { findEvaluativeLeaks } from '@/lib/compliance/assertNoEvaluativeLeak'
import { enforceRateLimit } from '@/lib/rateLimit'
import { CASE_TYPES } from '@/lib/domain/constants'

/**
 * Proof of reality for a market, before a firm has funded anything (Section 7
 * step 1). The single artifact that converts the first skeptic: representative
 * recent activity from their actual territory, redacted, framed as
 * representative and never as a volume guarantee, plus a full fidelity sample
 * closing kit so they see exactly what a delivered case looks like.
 *
 * Public and pre auth, so it is defended: rate limited per IP, and the redacted
 * feed is scanned to guarantee no PII and no evaluative signal ever rides along.
 * The seeded sample intentionally shows the firm facing SCPS triage, because it
 * is a demonstration, not a real claimant.
 */
export const dynamic = 'force-dynamic'

const LABEL: Record<string, string> = Object.fromEntries(CASE_TYPES.map((c) => [c.value, c.label]))

export async function GET(req: Request, { params }: { params: Promise<{ market: string }> }) {
  const limited = enforceRateLimit(req, 'proof', { limit: 30, windowMs: 60_000 })
  if (limited) return limited

  const { market: marketSlug } = await params

  try {
    const payload = await getPayload({ config })

    // Resolve the market by slug. A prospect uses the URL friendly slug; the id
    // never leaves the server.
    const markets = await payload.find({
      collection: 'markets',
      where: { slug: { equals: marketSlug } },
      limit: 1,
      depth: 0,
    })
    const marketDoc = markets.docs[0] as unknown as Record<string, unknown> | undefined
    if (!marketDoc) {
      return Response.json({ error: 'market not found' }, { status: 404 })
    }

    const glass = createGlassBoxService(createPayloadGlassBoxDeps(payload))
    const feed = await glass.proofOfRealityForMarket(String(marketDoc.id), 12)

    // Present the redacted activity with human case labels. Still no PII, no
    // evaluative field: reference, case type, received time, and status only.
    const items = feed.items.map((i) => ({
      reference: i.reference,
      caseType: LABEL[i.caseType] ?? i.caseType,
      receivedAt: i.receivedAt,
      status: i.status,
    }))

    // Hard guard: the redacted feed must carry no evaluative signal. The sample is
    // intentionally firm facing and is not guarded here.
    const leaks = findEvaluativeLeaks(items)
    if (leaks.length > 0) {
      return Response.json({ error: 'unavailable' }, { status: 503 })
    }

    return Response.json({
      market: {
        slug: marketSlug,
        metro: (marketDoc.metro as string) ?? marketSlug,
        state: (marketDoc.state as string) ?? null,
      },
      framing: feed.framing,
      count: items.length,
      items,
      sample: SAMPLE_DOSSIER,
    })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
