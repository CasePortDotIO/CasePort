import crypto from 'node:crypto'

/**
 * Signed, expiring media access (W5, CLAUDE.md Section 3). Dossier photos, the
 * insurance card, voice files, and documents are PII and must live behind signed,
 * expiring URLs, never public. A firm surface never receives a raw storage URL;
 * it receives a short lived signed link to /api/media/access that resolves to the
 * bytes only while the signature is valid and unexpired.
 *
 * The signature covers both the storage key and the expiry, so a link cannot be
 * extended or pointed at a different object after the fact. Because the access
 * endpoint fetches only keys we signed, the signature also closes SSRF: an
 * attacker cannot make the server fetch an arbitrary URL, only one we minted.
 *
 * This is the seam that makes the storage backend swappable. Today the underlying
 * key is a Vercel Blob URL; when media moves to R2, only the access endpoint's
 * resolution changes, and every firm facing signed link stays identical.
 */

const secret = () => process.env.MEDIA_LINK_SECRET || process.env.PAYLOAD_SECRET || 'dev-media-secret'

/** Default time to live for a signed media link: long enough to load a case file,
 * short enough that a leaked link is quickly useless. */
export const DEFAULT_MEDIA_TTL_SECONDS = 900

function b64url(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64url')
}
function unb64url(s: string): string {
  return Buffer.from(s, 'base64url').toString('utf8')
}

function signature(key: string, expEpochMs: number): string {
  return crypto.createHmac('sha256', secret()).update(`media:${key}:${expEpochMs}`).digest('hex').slice(0, 32)
}

export function verifyMedia(key: string, expEpochMs: number, sig: string | null | undefined): boolean {
  if (!sig || !Number.isFinite(expEpochMs)) return false
  const expected = signature(key, expEpochMs)
  if (sig.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
}

/**
 * Build a signed, same origin access path for a storage key that expires after
 * ttlSeconds. nowEpochMs is passed in so the domain stays pure and testable; the
 * caller supplies the clock.
 */
export function signedMediaPath(key: string, nowEpochMs: number, ttlSeconds = DEFAULT_MEDIA_TTL_SECONDS): string {
  const exp = nowEpochMs + ttlSeconds * 1000
  const sig = signature(key, exp)
  return `/api/media/access?k=${encodeURIComponent(b64url(key))}&e=${exp}&s=${sig}`
}

/** Decode the params on the access endpoint back into a verified key, or null. */
export function resolveSignedMedia(params: {
  k: string | null
  e: string | null
  s: string | null
  nowEpochMs: number
}): { key: string } | { error: 'invalid' | 'expired' } {
  if (!params.k || !params.e || !params.s) return { error: 'invalid' }
  let key: string
  try {
    key = unb64url(params.k)
  } catch {
    return { error: 'invalid' }
  }
  const exp = Number(params.e)
  if (!verifyMedia(key, exp, params.s)) return { error: 'invalid' }
  if (params.nowEpochMs > exp) return { error: 'expired' }
  return { key }
}
