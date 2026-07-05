import config from '@payload-config'
import { getPayload } from 'payload'
import { createIntelligenceService } from '@/services/IntelligenceService'
import { createPayloadIntelligenceDeps } from '@/services/adapters/payloadIntelligence'

/**
 * The Answer to Wallet trace (Section 11). Given a firm reported outcome, return
 * the exact originating tuple: the source, keyword, referring surface, and
 * intake behavior that produced this case, end to end. This is the moat query.
 * Internal and guarded; it exposes attribution intelligence, never claimant PII.
 */
export async function GET(req: Request, { params }: { params: Promise<{ outcomeId: string }> }) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  const allowed =
    process.env.NODE_ENV !== 'production' || (process.env.SEED_SECRET && secret === process.env.SEED_SECRET)
  if (!allowed) return Response.json({ error: 'not allowed' }, { status: 403 })

  const { outcomeId } = await params
  const payload = await getPayload({ config })
  const intel = createIntelligenceService(createPayloadIntelligenceDeps(payload))
  const trace = await intel.attributionTrace(outcomeId)
  return Response.json(trace)
}
