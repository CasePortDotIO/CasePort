/**
 * A lightweight in-process rate limiter for the public, unauthenticated intake
 * endpoints. Those endpoints write to the database and trigger paid AI calls
 * (Claude coaching, Vision), so an abuser hammering them is both a denial of
 * service and a cost bomb. This is the first line of defense.
 *
 * It is a fixed-window per-key counter held in memory, with a bounded map so it
 * cannot grow without limit. Honest caveat: on serverless (Vercel) each instance
 * has its own memory, so this enforces per-instance, not globally. It meaningfully
 * blunts a single abuser hitting a warm instance, but production should back it
 * with a shared store (Vercel KV or Upstash Redis) for cross-instance limits, and
 * lean on the platform's own DDoS protection. Kept dependency-free and injectable
 * (`now`) so it is unit tested deterministically.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()
const MAX_KEYS = 20_000

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSec: number
}

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number; now?: number },
): RateLimitResult {
  const now = opts.now ?? Date.now()
  let b = buckets.get(key)
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + opts.windowMs }
    buckets.set(key, b)
  }
  b.count += 1

  // Bound memory: when the map grows past the cap, drop expired entries.
  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k)
      if (buckets.size <= MAX_KEYS) break
    }
  }

  const allowed = b.count <= opts.limit
  return {
    allowed,
    remaining: Math.max(0, opts.limit - b.count),
    retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
  }
}

/** The client IP from proxy headers, falling back to a stable placeholder. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0]!.trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

/**
 * Guard a request. Returns a 429 Response to return directly when the limit is
 * exceeded, or null to proceed. The bucket key namespaces by route so limits do
 * not bleed across endpoints.
 */
export function enforceRateLimit(
  req: Request,
  route: string,
  opts: { limit: number; windowMs: number },
): Response | null {
  const result = rateLimit(`${route}:${clientIp(req)}`, opts)
  if (result.allowed) return null
  return Response.json(
    { error: 'too many requests', retryAfterSec: result.retryAfterSec },
    { status: 429, headers: { 'retry-after': String(result.retryAfterSec) } },
  )
}

/** Test-only: clear the in-memory buckets between cases. */
export function __resetRateLimitStore(): void {
  buckets.clear()
}
