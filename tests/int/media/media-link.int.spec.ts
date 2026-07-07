import { describe, it, expect } from 'vitest'
import { signedMediaPath, resolveSignedMedia, verifyMedia, DEFAULT_MEDIA_TTL_SECONDS } from '@/lib/mediaLink'

/**
 * Signed, expiring media access (W5). A firm receives only a short lived signed
 * link to the bytes, never the raw storage URL. These pin the guarantees: a valid
 * link resolves, an expired one is refused, a tampered signature or key is
 * refused, and the signature binds the exact key so a link cannot be repointed.
 */

const KEY = 'https://blob.example/dossier/clm/wide-1.jpg'
const t0 = 1_800_000_000_000

function parse(path: string) {
  const q = new URLSearchParams(path.split('?')[1])
  return { k: q.get('k'), e: q.get('e'), s: q.get('s') }
}

describe('signed media links', () => {
  it('mints a same origin access link that resolves back to the key while valid', () => {
    const path = signedMediaPath(KEY, t0)
    expect(path.startsWith('/api/media/access?')).toBe(true)
    const p = parse(path)
    const resolved = resolveSignedMedia({ ...p, nowEpochMs: t0 + 1000 })
    expect(resolved).toEqual({ key: KEY })
  })

  it('refuses the link once it has expired', () => {
    const path = signedMediaPath(KEY, t0, 60) // 60s TTL
    const p = parse(path)
    const resolved = resolveSignedMedia({ ...p, nowEpochMs: t0 + 61_000 })
    expect(resolved).toEqual({ error: 'expired' })
  })

  it('refuses a tampered signature', () => {
    const p = parse(signedMediaPath(KEY, t0))
    const resolved = resolveSignedMedia({ ...p, s: 'x'.repeat((p.s ?? '').length), nowEpochMs: t0 + 1000 })
    expect(resolved).toEqual({ error: 'invalid' })
  })

  it('binds the exact key: a link cannot be repointed at another object', () => {
    const p = parse(signedMediaPath(KEY, t0))
    // Swap the key for a different object, keep the signature: must not verify.
    const otherKey = Buffer.from('https://blob.example/someone-else.jpg', 'utf8').toString('base64url')
    const resolved = resolveSignedMedia({ ...p, k: otherKey, nowEpochMs: t0 + 1000 })
    expect(resolved).toEqual({ error: 'invalid' })
  })

  it('refuses missing params', () => {
    expect(resolveSignedMedia({ k: null, e: null, s: null, nowEpochMs: t0 })).toEqual({ error: 'invalid' })
  })

  it('verifyMedia is exact on key and expiry', () => {
    const exp = t0 + DEFAULT_MEDIA_TTL_SECONDS * 1000
    const p = parse(signedMediaPath(KEY, t0))
    expect(verifyMedia(KEY, exp, p.s)).toBe(true)
    expect(verifyMedia(KEY, exp + 1, p.s)).toBe(false) // expiry is signed
    expect(verifyMedia(KEY, exp, null)).toBe(false)
  })
})
