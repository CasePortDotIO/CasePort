import config from '@payload-config'
import { getPayload } from 'payload'
import { createIntelligenceService } from '@/services/IntelligenceService'
import { createPayloadIntelligenceDeps } from '@/services/adapters/payloadIntelligence'
import { requireInternal } from '@/lib/adminAuth'

/**
 * Promote a proposed SCPS version to active (AGENTS.md Section 3, Section 4.6:
 * human in the loop for promoting any SCPS model version). This is the only path
 * by which a recalibrated version starts scoring. ADMIN role required: a scorer
 * that silently rewrites itself breaks auditability, so promotion is a
 * deliberate, audited human act, and the approver is recorded on the event.
 */
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: { version?: unknown }
  try {
    body = (await req.json()) ?? {}
  } catch {
    return Response.json({ error: 'invalid payload' }, { status: 400 })
  }
  const version = typeof body.version === 'string' ? body.version : ''
  if (!version) return Response.json({ error: 'version required' }, { status: 400 })

  try {
    const payload = await getPayload({ config })
    const auth = await requireInternal(payload, req, { admin: true })
    if ('response' in auth) return auth.response
    const intel = createIntelligenceService(createPayloadIntelligenceDeps(payload))
    const result = await intel.promoteScpsModel({ version, approvedBy: auth.user.email })
    // not-found / already-active are reported, not thrown, so the caller knows why.
    const httpStatus = result.promoted ? 200 : result.reason === 'not-found' ? 404 : 409
    return Response.json(result, { status: httpStatus })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
