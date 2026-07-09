import config from '@payload-config'
import { getPayload } from 'payload'
import { requireInternal } from '@/lib/adminAuth'
import { assemblePreflight, readEnvPresence, type PreflightCounts } from '@/lib/ops/preflight'

/**
 * Launch preflight and login diagnostic (admin only). Reports what is armed and
 * what is still dry in this exact environment: whether the database is reachable,
 * whether the secret and integration keys are set (presence only, never a value),
 * and how much real data exists. It answers, from the running environment, why a
 * partner cannot sign in, and what remains before a real case can flow end to end.
 *
 * Admin gated: it reveals configuration shape, so only an internal admin may read
 * it. Create the first admin at /admin (Payload's standard first user flow), then
 * call this.
 */
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const env = readEnvPresence()

  const counts: PreflightCounts = {
    dbReachable: false,
    firmUsers: 0,
    firms: 0,
    liveMarkets: 0,
    firmsWithLiveCallbackSla: 0,
  }

  try {
    const payload = await getPayload({ config })

    const auth = await requireInternal(payload, req, { admin: true })
    if ('response' in auth) return auth.response

    const safeCount = async (fn: () => Promise<number>): Promise<number> => {
      try {
        return await fn()
      } catch {
        return 0
      }
    }

    const firmUsers = await safeCount(async () => (await payload.count({ collection: 'firmUsers' })).totalDocs)
    counts.dbReachable = true // the count answered, so the DB is reachable
    counts.firmUsers = firmUsers
    counts.firms = await safeCount(async () => (await payload.count({ collection: 'firms' })).totalDocs)
    counts.liveMarkets = await safeCount(
      async () => (await payload.count({ collection: 'markets', where: { liveForIntake: { equals: true } } })).totalDocs,
    )
    counts.firmsWithLiveCallbackSla = await safeCount(
      async () => (await payload.count({ collection: 'firms', where: { callbackSlaActive: { equals: true } } })).totalDocs,
    )

    return Response.json(assemblePreflight({ env, counts }))
  } catch {
    // Payload could not initialize at all (missing secret or URL). Report that
    // plainly rather than 500, so the founder sees the real cause. Only env
    // presence booleans and zero counts are revealed, no data.
    return Response.json(
      { ...assemblePreflight({ env, counts }), note: 'Database could not be initialized. Set PAYLOAD_SECRET and DATABASE_URL.' },
      { status: 200 },
    )
  }
}
