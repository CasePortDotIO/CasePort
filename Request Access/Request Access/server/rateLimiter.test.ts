/**
 * Rate Limiter Tests
 * Verifies that IP-based rate limiting allows up to max requests
 * and blocks subsequent requests within the window.
 */
import { describe, it, expect } from 'vitest';
import { checkRateLimit } from './rateLimiter';

describe('checkRateLimit', () => {
  it('allows the first request', () => {
    const result = checkRateLimit('1.2.3.4', 'submit', 3, 3600000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('allows up to max requests', () => {
    const ip = '10.0.0.1';
    const r1 = checkRateLimit(ip, 'submit', 3, 3600000);
    const r2 = checkRateLimit(ip, 'submit', 3, 3600000);
    const r3 = checkRateLimit(ip, 'submit', 3, 3600000);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(true);
  });

  it('blocks requests exceeding the limit', () => {
    const ip = '10.0.0.2';
    checkRateLimit(ip, 'submit', 2, 3600000);
    checkRateLimit(ip, 'submit', 2, 3600000);
    const blocked = checkRateLimit(ip, 'submit', 2, 3600000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('uses separate buckets for different actions', () => {
    const ip = '10.0.0.3';
    // Exhaust submit limit
    checkRateLimit(ip, 'submit', 1, 3600000);
    const submitBlocked = checkRateLimit(ip, 'submit', 1, 3600000);
    expect(submitBlocked.allowed).toBe(false);
    // Waitlist should still be allowed
    const waitlistAllowed = checkRateLimit(ip, 'waitlist', 1, 3600000);
    expect(waitlistAllowed.allowed).toBe(true);
  });

  it('uses separate buckets for different IPs', () => {
    checkRateLimit('192.168.1.1', 'submit', 1, 3600000);
    const blocked = checkRateLimit('192.168.1.1', 'submit', 1, 3600000);
    const allowed = checkRateLimit('192.168.1.2', 'submit', 1, 3600000);
    expect(blocked.allowed).toBe(false);
    expect(allowed.allowed).toBe(true);
  });
});
