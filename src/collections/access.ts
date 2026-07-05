import type { Access, FieldAccess } from 'payload'

/**
 * Shared access control helpers for the CasePort backend collections.
 *
 * Phase 0 baseline. Every backend collection is gated to authenticated users;
 * none of the case, wallet, or consent data is public. Firm scoping (a firm
 * sees only its own data) and firm portal auth arrive in Phase 2. The evaluative
 * field gate below is the collection level half of the W2 audience split; the
 * projection layer in src/lib/compliance is the other half for claimant
 * surfaces that do not run through Payload auth at all.
 */

/** Collection access: any authenticated Payload user. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Collection access: admins only. */
export const adminOnly: Access = ({ req: { user } }) =>
  Boolean(user && (user as { role?: string }).role === 'admin')

/**
 * Collection access: append only. Reads require auth, writes after create are
 * denied outright. Used for the event log, ledger, consents, and audit log so
 * history is immutable (W7).
 */
export const appendOnly = {
  read: authenticated,
  create: authenticated,
  update: () => false,
  delete: () => false,
} satisfies {
  read: Access
  create: Access
  update: Access
  delete: Access
}

/**
 * Field access: evaluative fields are firm facing only (W2). Readable by
 * authenticated firm or admin users, never serialized to an unauthenticated
 * claimant surface. Claimant surfaces are served through the projection layer,
 * which strips these regardless.
 */
export const firmOnlyFieldRead: FieldAccess = ({ req: { user } }) => Boolean(user)
