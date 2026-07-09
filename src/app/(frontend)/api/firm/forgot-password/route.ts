import config from '@payload-config'
import { getPayload } from 'payload'
import { enforceRateLimit } from '@/lib/rateLimit'
import { issueFirmPasswordLink } from '@/lib/firm/passwordLink'

/**
 * Partner password reset request. A firm partner who forgot their password enters
 * their email and receives a branded link to set a new one. Public, so it is rate
 * limited, and it always responds the same way whether or not the email is on
 * file, so it never reveals which addresses have an account.
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
  const limited = enforceRateLimit(req, 'firm-forgot', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  let body: { email?: unknown }
  try {
    body = (await req.json()) ?? {}
  } catch {
    return Response.json({ error: 'invalid payload' }, { status: 400 })
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email) return Response.json({ error: 'email is required' }, { status: 400 })

  try {
    const payload = await getPayload({ config })
    await issueFirmPasswordLink(payload, { email, origin: originFor(req), kind: 'reset' })
  } catch {
    // Swallow everything: a missing account, an unavailable backend, and a
    // successful send all return the same response, so existence never leaks.
  }

  return Response.json({
    ok: true,
    message: 'If that email is on a CasePort account, a set your password link is on its way.',
  })
}
