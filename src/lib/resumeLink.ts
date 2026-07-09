import crypto from 'node:crypto'

/**
 * Signed intake resume links. A claimant who started an intake and stopped gets
 * a link to pick up exactly where they left off, no login. Each link carries an
 * HMAC signature over the intake session id, so it cannot be forged or
 * enumerated and it resolves to exactly one session. This is the resume
 * mechanism the Abandoned Intake Recovery Agent uses (AGENTS.md Section 4.4).
 *
 * The link only ever reaches a claimant who already began an intake on a channel
 * where consent was captured. The agent never mints a link for anyone who did
 * not start (ABA Formal Opinion 501, TCPA). The signature is the second guard:
 * even leaked, a link resolves to one existing session and nothing else.
 */

const secret = () => process.env.RESUME_LINK_SECRET || process.env.PAYLOAD_SECRET || 'dev-resume-secret'

export function signResume(sessionId: string): string {
  return crypto.createHmac('sha256', secret()).update(`resume:${sessionId}`).digest('hex').slice(0, 32)
}

export function verifyResume(sessionId: string, sig: string): boolean {
  const expected = signResume(sessionId)
  // Constant time compare to avoid leaking the signature via timing.
  if (sig.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
}

/** The absolute resume URL for a given intake session. */
export function resumeUrl(baseUrl: string, sessionId: string): string {
  const sig = signResume(sessionId)
  return `${baseUrl.replace(/\/$/, '')}/checkmycase?resume=${encodeURIComponent(sessionId)}&sig=${sig}`
}
