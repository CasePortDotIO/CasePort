import config from '@payload-config'
import { getPayload } from 'payload'
import { requireInternal } from '@/lib/adminAuth'

/**
 * Mint a partner login (admin only). Creates a firmUser bound to a firm so a
 * managing partner can sign in to the firm dashboard. This is the production safe
 * way to provision the first login without the dev seed: create the first admin
 * at /admin, then call this. Firm users can also be created directly in the
 * Payload admin under Firm Users; this endpoint is the scriptable equivalent.
 *
 * It never returns the password. The firm binding scopes every read on the Glass
 * Box to that partner's firm, from the session, not a path parameter.
 */
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: { email?: unknown; password?: unknown; name?: unknown; firmId?: unknown; role?: unknown }
  try {
    body = (await req.json()) ?? {}
  } catch {
    return Response.json({ error: 'invalid payload' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const firmId = typeof body.firmId === 'string' ? body.firmId : ''
  const role = body.role === 'staff' ? 'staff' : 'partner'

  if (!email || !password || !name || !firmId) {
    return Response.json({ error: 'email, password, name, and firmId are required' }, { status: 400 })
  }
  if (password.length < 8) {
    return Response.json({ error: 'password must be at least 8 characters' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const auth = await requireInternal(payload, req, { admin: true })
    if ('response' in auth) return auth.response

    const firm = await payload.findByID({ collection: 'firms', id: firmId, depth: 0 }).catch(() => null)
    if (!firm) return Response.json({ error: 'firm not found' }, { status: 404 })

    const existing = await payload.find({ collection: 'firmUsers', where: { email: { equals: email } }, limit: 1 })
    if (existing.docs[0]) {
      return Response.json({ error: 'a firm user with that email already exists' }, { status: 409 })
    }

    const created = await payload.create({
      collection: 'firmUsers',
      data: { email, password, name, firm: firmId, role } as never,
    })

    return Response.json({
      created: true,
      firmUserId: String((created as { id: string | number }).id),
      email,
      firmId,
      role,
      signInAt: '/firm/login',
    })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
