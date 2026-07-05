import type { Payload } from 'payload'

/**
 * Internal (operator/admin) authentication for the ops API. Resolves the Payload
 * user from the request's session, and optionally requires the admin role.
 *
 * SCPS model promotion is human in the loop and admin gated (AGENTS.md Section 3,
 * Section 4.6): a scorer that silently rewrites itself breaks auditability, so
 * promoting a version requires an admin, and the approver is recorded on the
 * audit event.
 *
 * Returns the authenticated user, or a Response to return directly (401/403).
 */
export interface InternalUser {
  id: string
  email: string
  role: string
}

export async function requireInternal(
  payload: Payload,
  req: Request,
  opts: { admin?: boolean } = {},
): Promise<{ user: InternalUser } | { response: Response }> {
  type AuthUser = { id?: unknown; email?: unknown; role?: unknown }
  let user: AuthUser | null = null
  try {
    const auth = await payload.auth({ headers: req.headers })
    user = (auth.user as AuthUser | null) ?? null
  } catch {
    user = null
  }

  if (!user) {
    return { response: Response.json({ error: 'unauthorized' }, { status: 401 }) }
  }
  const role = String(user.role ?? 'operator')
  if (opts.admin && role !== 'admin') {
    return { response: Response.json({ error: 'forbidden: admin role required' }, { status: 403 }) }
  }
  return { user: { id: String(user.id), email: String(user.email ?? ''), role } }
}
