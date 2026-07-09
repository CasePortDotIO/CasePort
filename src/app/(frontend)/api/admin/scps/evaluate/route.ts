import config from '@payload-config'
import { getPayload } from 'payload'
import { createIntelligenceService } from '@/services/IntelligenceService'
import { createPayloadIntelligenceDeps } from '@/services/adapters/payloadIntelligence'
import { requireInternal } from '@/lib/adminAuth'

/**
 * The SCPS experimentation harness endpoint (AGENTS.md Section 4.6). Backtests a
 * recalibration against the active model and returns the out of sample AUC lift,
 * so a human promotes on evidence, not judgment. This is the number to read
 * before POST /api/admin/scps/promote.
 *
 * Optional ?version= backtests a specific proposed version; otherwise it
 * evaluates what a fresh recalibration would produce now. Internal auth required.
 */
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config })
    const auth = await requireInternal(payload, req)
    if ('response' in auth) return auth.response

    const version = new URL(req.url).searchParams.get('version') ?? undefined
    const intel = createIntelligenceService(createPayloadIntelligenceDeps(payload))
    const evaluation = await intel.evaluateRecalibration(version)
    if (!evaluation) return Response.json({ error: 'version not found' }, { status: 404 })
    return Response.json({ evaluation })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
