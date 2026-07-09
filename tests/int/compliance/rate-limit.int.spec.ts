import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimit, enforceRateLimit, clientIp, __resetRateLimitStore } from '@/lib/rateLimit'

/**
 * The public intake endpoints write to the database and trigger paid AI calls, so
 * they are rate limited per IP. This pins the limiter: it allows a real burst,
 * blocks a flood, resets after the window, and namespaces per key.
 */

beforeEach(() => __resetRateLimitStore())

const t0 = 1_000_000

describe('rateLimit (fixed window per key)', () => {
  it('allows up to the limit, then blocks', () => {
    for (let i = 1; i <= 5; i++) {
      expect(rateLimit('k', { limit: 5, windowMs: 60_000, now: t0 }).allowed).toBe(true)
    }
    const blocked = rateLimit('k', { limit: 5, windowMs: 60_000, now: t0 })
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSec).toBeGreaterThan(0)
  })

  it('resets after the window elapses', () => {
    for (let i = 0; i < 5; i++) rateLimit('k', { limit: 5, windowMs: 60_000, now: t0 })
    expect(rateLimit('k', { limit: 5, windowMs: 60_000, now: t0 }).allowed).toBe(false)
    // A moment after the window, the budget is fresh.
    expect(rateLimit('k', { limit: 5, windowMs: 60_000, now: t0 + 60_001 }).allowed).toBe(true)
  })

  it('namespaces per key: one abuser does not block another', () => {
    for (let i = 0; i < 6; i++) rateLimit('ip_a', { limit: 5, windowMs: 60_000, now: t0 })
    expect(rateLimit('ip_a', { limit: 5, windowMs: 60_000, now: t0 }).allowed).toBe(false)
    expect(rateLimit('ip_b', { limit: 5, windowMs: 60_000, now: t0 }).allowed).toBe(true)
  })
})

describe('enforceRateLimit + clientIp', () => {
  it('reads the client IP from x-forwarded-for', () => {
    const req = new Request('http://x/api', { headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' } })
    expect(clientIp(req)).toBe('203.0.113.7')
  })

  it('returns a 429 with Retry-After once the limit is exceeded', () => {
    const req = () => new Request('http://x/api', { method: 'POST', headers: { 'x-forwarded-for': '203.0.113.9' } })
    for (let i = 0; i < 3; i++) expect(enforceRateLimit(req(), 'coach', { limit: 3, windowMs: 60_000 })).toBeNull()
    const blocked = enforceRateLimit(req(), 'coach', { limit: 3, windowMs: 60_000 })
    expect(blocked?.status).toBe(429)
    expect(blocked?.headers.get('retry-after')).toBeTruthy()
  })

  it('different routes have independent budgets for the same IP', () => {
    const req = () => new Request('http://x/api', { method: 'POST', headers: { 'x-forwarded-for': '198.51.100.1' } })
    for (let i = 0; i < 3; i++) enforceRateLimit(req(), 'coach', { limit: 3, windowMs: 60_000 })
    expect(enforceRateLimit(req(), 'coach', { limit: 3, windowMs: 60_000 })?.status).toBe(429)
    // The submit route budget for the same IP is untouched.
    expect(enforceRateLimit(req(), 'submit', { limit: 3, windowMs: 60_000 })).toBeNull()
  })
})
