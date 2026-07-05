import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Resolve the current firm for the firm dashboard.
 *
 * A real firm session will bind the firm from auth. Until auth exists, this
 * resolves a single demo firm so the dashboard can show that firm's own real
 * data (its ledger, its deliveries, its market) rather than mock arrays. It
 * resolves DEMO_FIRM_ID when set, otherwise the first firm on record. This is a
 * temporary binding, not a security boundary: the Glass Box endpoint still
 * scopes every read by the firmId it is given.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const demoId = process.env.DEMO_FIRM_ID
    if (demoId) {
      const doc = await payload.findByID({ collection: 'firms', id: demoId, depth: 0 }).catch(() => null)
      if (doc) return Response.json({ firmId: String(doc.id), name: String((doc as { name?: unknown }).name ?? '') })
    }

    const res = await payload.find({ collection: 'firms', limit: 1, sort: 'createdAt', depth: 0 })
    const firm = res.docs[0] as { id?: unknown; name?: unknown } | undefined
    if (!firm) return Response.json({ firmId: null, name: null })

    return Response.json({ firmId: String(firm.id), name: String(firm.name ?? '') })
  } catch {
    // Cold database or no connection: the dashboard falls back to its empty state.
    return Response.json({ firmId: null, name: null })
  }
}
