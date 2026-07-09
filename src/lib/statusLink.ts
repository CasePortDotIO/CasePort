import crypto from 'node:crypto'

/**
 * Signed claimant status links. After intake, the claimant gets a link to a
 * living status page that shows motion on their behalf (Section 6 step 8). The
 * link carries an HMAC signature over the dossier id, so the status page cannot
 * be forged or enumerated: a bare dossier id without a valid signature resolves
 * to nothing. This is the same guard the resume link uses, applied to the status
 * surface.
 *
 * The page it points to is claimant safe by construction: geographic and
 * procedural status only, never an evaluative signal (W2). The signature simply
 * keeps one claimant from walking another claimant's dossier ids.
 */

const secret = () => process.env.STATUS_LINK_SECRET || process.env.PAYLOAD_SECRET || 'dev-status-secret'

export function signStatus(dossierId: string): string {
  return crypto.createHmac('sha256', secret()).update(`status:${dossierId}`).digest('hex').slice(0, 32)
}

export function verifyStatus(dossierId: string, sig: string | null | undefined): boolean {
  if (!sig) return false
  const expected = signStatus(dossierId)
  if (sig.length !== expected.length) return false
  // Constant time compare to avoid leaking the signature via timing.
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
}

/** The relative status path (for a same origin link and the confirmation screen). */
export function statusPath(dossierId: string): string {
  return `/checkmycase/status/${encodeURIComponent(dossierId)}?sig=${signStatus(dossierId)}`
}

/** The absolute status URL, for an SMS or email that leaves the app. */
export function statusUrl(baseUrl: string, dossierId: string): string {
  return `${baseUrl.replace(/\/$/, '')}${statusPath(dossierId)}`
}
