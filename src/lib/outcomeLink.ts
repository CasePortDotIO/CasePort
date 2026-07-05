import crypto from 'node:crypto'
import type { OutcomeResult } from '@/services/intelligencePorts'

/**
 * One tap outcome links. A firm partner gets a message on their phone or inbox
 * and reports the outcome with a single tap, no login. Each link carries an HMAC
 * signature over the delivery id and the result, so it cannot be forged or
 * enumerated, and it encodes exactly one outcome. This is the friction to zero
 * mechanism for the signed case feedback loop.
 */

const secret = () => process.env.OUTCOME_LINK_SECRET || process.env.PAYLOAD_SECRET || 'dev-outcome-secret'

export function signOutcome(deliveryId: string, result: OutcomeResult): string {
  return crypto.createHmac('sha256', secret()).update(`${deliveryId}:${result}`).digest('hex').slice(0, 32)
}

export function verifyOutcome(deliveryId: string, result: OutcomeResult, sig: string): boolean {
  const expected = signOutcome(deliveryId, result)
  // Constant time compare to avoid leaking the signature via timing.
  if (sig.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
}

/** The absolute one tap URL for a given delivery and result. */
export function outcomeCaptureUrl(baseUrl: string, deliveryId: string, result: OutcomeResult): string {
  const sig = signOutcome(deliveryId, result)
  return `${baseUrl.replace(/\/$/, '')}/api/delivery/${encodeURIComponent(deliveryId)}/outcome/capture?result=${result}&sig=${sig}`
}
