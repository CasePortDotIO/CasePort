import config from '@payload-config'
import { getPayload } from 'payload'
import { resolveFirm } from '@/lib/firmAuth'

/**
 * Resolve the current firm for the firm dashboard.
 *
 * Prefers an authenticated firmUser session (the firm bound to their login);
 * falls back to a demo firm (DEMO_FIRM_ID, else the first firm) so the dashboard
 * shows real data without a login. Returns `authenticated` so the client knows
 * whether a real partner is signed in.
 */
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config })
    const resolved = await resolveFirm(payload, req)
    return Response.json(resolved)
  } catch {
    // Cold database or no connection: the dashboard falls back to its empty state.
    return Response.json({ firmId: null, name: null, authenticated: false })
  }
}
