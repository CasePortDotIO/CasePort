import config from '@payload-config'
import { getPayload } from 'payload'
import { createIntelligenceService } from '@/services/IntelligenceService'
import { createPayloadIntelligenceDeps } from '@/services/adapters/payloadIntelligence'
import { requireInternal } from '@/lib/adminAuth'

/**
 * The SCPS model lineage for the review surface (AGENTS.md Section 4.6). Every
 * version, its status, and what it was trained on, newest first, with the active
 * one flagged. This is what a human looks at before deciding to promote a
 * proposal. Internal auth required.
 */
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const auth = await requireInternal(payload, req)
  if ('response' in auth) return auth.response

  try {
    const intel = createIntelligenceService(createPayloadIntelligenceDeps(payload))
    const models = await intel.listScpsModels()
    return Response.json({ models })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
