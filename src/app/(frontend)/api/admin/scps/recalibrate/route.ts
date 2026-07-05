import config from '@payload-config'
import { getPayload } from 'payload'
import { createIntelligenceService } from '@/services/IntelligenceService'
import { createPayloadIntelligenceDeps } from '@/services/adapters/payloadIntelligence'
import { requireInternal } from '@/lib/adminAuth'

/**
 * Run the Signed Case Feedback Loop on demand (AGENTS.md Section 4.6). Ingests
 * the firm reported outcomes and saves a new SCPS version as a PROPOSAL. It never
 * activates it: a human promotes a proposal separately. This is the same
 * recalibration the daily cron runs, exposed for ops so a human can propose a
 * fresh version right after a batch of outcomes closes. Internal auth required.
 */
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const auth = await requireInternal(payload, req)
  if ('response' in auth) return auth.response

  try {
    const intel = createIntelligenceService(createPayloadIntelligenceDeps(payload))
    const proposed = await intel.recalibrateScps()
    return Response.json({ proposed })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
