import type { Payload } from 'payload'

/**
 * Resolve which firm the caller is acting as, and how strongly.
 *
 * Preference order:
 *   1. An authenticated firmUser session — the firm bound to their login. This
 *      is the real, tamper proof binding: the firm comes from the session, never
 *      from a path parameter a caller could change.
 *   2. DEMO_FIRM_ID, when set — a fixed demo firm so the dashboard shows real
 *      data without a login.
 *   3. The first firm on record — so a fresh deployment still resolves something.
 *
 * `authenticated` is true only when the firm came from a real session. Endpoints
 * use it to decide how strictly to scope: an authenticated caller may only touch
 * their own firm; an unauthenticated (demo) caller is pinned to the demo firm,
 * so cross firm access is impossible either way.
 */
export interface ResolvedFirm {
  firmId: string | null
  name: string | null
  authenticated: boolean
}

export async function resolveFirm(payload: Payload, req: Request): Promise<ResolvedFirm> {
  // 1. Firm session.
  try {
    const auth = await payload.auth({ headers: req.headers })
    const user = auth.user as { collection?: string; firm?: unknown; name?: unknown } | null
    if (user && user.collection === 'firmUsers' && user.firm) {
      const firmId = typeof user.firm === 'object' ? String((user.firm as { id: unknown }).id) : String(user.firm)
      const firm = await payload.findByID({ collection: 'firms', id: firmId, depth: 0 }).catch(() => null)
      return { firmId, name: firm ? String((firm as { name?: unknown }).name ?? '') : null, authenticated: true }
    }
  } catch {
    // fall through to demo resolution
  }

  // 2. Demo firm id.
  const demoId = process.env.DEMO_FIRM_ID
  if (demoId) {
    const firm = await payload.findByID({ collection: 'firms', id: demoId, depth: 0 }).catch(() => null)
    if (firm) return { firmId: String((firm as { id: unknown }).id), name: String((firm as { name?: unknown }).name ?? ''), authenticated: false }
  }

  // 3. First firm.
  try {
    const res = await payload.find({ collection: 'firms', limit: 1, sort: 'createdAt', depth: 0 })
    const firm = res.docs[0] as { id?: unknown; name?: unknown } | undefined
    if (firm) return { firmId: String(firm.id), name: String(firm.name ?? ''), authenticated: false }
  } catch {
    // no firms
  }

  return { firmId: null, name: null, authenticated: false }
}

/**
 * Guard a firm scoped endpoint. Returns null when access is allowed, or a
 * Response (403/404) to return directly. A caller may only ever act as the firm
 * that resolves for them, so a path firmId that does not match the resolved firm
 * is refused whether the caller is a logged in partner or an unauthenticated demo
 * visitor.
 */
export async function guardFirmAccess(payload: Payload, req: Request, firmId: string): Promise<Response | null> {
  const resolved = await resolveFirm(payload, req)
  if (!resolved.firmId) return Response.json({ error: 'no firm' }, { status: 404 })
  if (resolved.firmId !== firmId) return Response.json({ error: 'forbidden' }, { status: 403 })
  return null
}
