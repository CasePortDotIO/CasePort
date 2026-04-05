/**
 * CasePort Rate Limiter
 *
 * Simple in-memory IP-based rate limiter.
 * No Redis dependency — suitable for single-instance deployment.
 * Limits: 3 submissions per IP per hour, 10 waitlist entries per IP per hour.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune expired entries every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of Array.from(store.entries())) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Check and increment rate limit for a given key.
 * Returns true if the request is allowed, false if rate-limited.
 */
export function checkRateLimit(
  ip: string,
  action: 'submit' | 'waitlist',
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const key = `${action}:${ip}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — reset
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

/** Rate limit config */
export const RATE_LIMITS = {
  submit: { max: 3, windowMs: 60 * 60 * 1000 },     // 3 per hour
  waitlist: { max: 5, windowMs: 60 * 60 * 1000 },   // 5 per hour
} as const;
