import crypto from 'node:crypto'
import config from '@payload-config'
import { getPayload } from 'payload'
import { requireInternal } from '@/lib/adminAuth'
import { issueFirmPasswordLink } from '@/lib/firm/passwordLink'

/**
 * Provision a partner login (admin only). Creates a firmUser bound to a firm and
 * sends a branded activation link so the partner sets their own password on a
 * secure page. CasePort is invite only, so this is the whole onboarding motion:
 * a firm is provisioned after a signed agreement, never self served.
 *
 * A password is not required; when omitted a random one is set and the partner
 * replaces it via the activation link, so no password is ever shared. The
 * activation link is always returned too, so an admin can deliver it by hand when
 * email is not configured. The firm binding scopes every read on the Glass Box to
 * that partner's firm, from the session, not a path parameter.
 */
export const dynamic = 'force-dynamic'

function originFor(req: Request): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    new URL(req.url).origin
  )
}

export async function POST(req: Request) {
  let body: { email?: unknown; password?: unknown; name?: unknown; firmId?: unknown; role?: unknown }
  try {
    body = (await req.json()) ?? {}
  } catch {
    return Response.json({ error: 'invalid payload' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  // Password is optional: when omitted, a random one is set and the partner sets
  // their own through the activation link.
  const password =
    typeof body.password === 'string' && body.password.length >= 8
      ? body.password
      : crypto.randomBytes(24).toString('base64url')
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const firmId = typeof body.firmId === 'string' ? body.firmId : ''
  const role = body.role === 'staff' ? 'staff' : 'partner'

  if (!email || !name || !firmId) {
    return Response.json({ error: 'email, name, and firmId are required' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const auth = await requireInternal(payload, req, { admin: true })
    if ('response' in auth) return auth.response

    const firm = (await payload.findByID({ collection: 'firms', id: firmId, depth: 0 }).catch(() => null)) as
      | { name?: string }
      | null
    if (!firm) return Response.json({ error: 'firm not found' }, { status: 404 })

    const existing = await payload.find({ collection: 'firmUsers', where: { email: { equals: email } }, limit: 1 })
    if (existing.docs[0]) {
      return Response.json({ error: 'a firm user with that email already exists' }, { status: 409 })
    }

    const created = await payload.create({
      collection: 'firmUsers',
      data: { email, password, name, firm: firmId, role } as never,
    })

    // Send the activation invite so the partner sets their own password.
    const invite = await issueFirmPasswordLink(payload, {
      email,
      name,
      firmName: firm.name,
      origin: originFor(req),
      kind: 'invite',
    }).catch(() => ({ sent: false, activationLink: null }))

    return Response.json({
      created: true,
      firmUserId: String((created as { id: string | number }).id),
      email,
      firmId,
      role,
      invited: invite.sent,
      // Deliver the link by hand when email is not configured.
      activationLink: invite.activationLink,
      signInAt: '/firm/login',
    })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
