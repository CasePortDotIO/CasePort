import { describe, it, expect } from 'vitest'
import type { Payload } from 'payload'
import { resolveFirm, guardFirmAccess } from '@/lib/firmAuth'

/**
 * Firm session resolution and the firm scoping guard. The firm a caller acts as
 * comes from their session, not a path parameter, so a caller can only ever
 * touch their own firm. An authenticated partner is pinned to their firm; a demo
 * visitor is pinned to the demo firm. Either way, a mismatched path firmId is
 * refused.
 */

/** A tiny Payload stub: a firm session when a token header is present, plus a
 * firms collection with one firm. */
function fakePayload(opts: { sessionFirmId?: string; firms?: Array<{ id: string; name: string }> } = {}): Payload {
  const firms = opts.firms ?? [{ id: 'firm_a', name: 'Peachtree Injury Partners' }]
  return {
    auth: async ({ headers }: { headers: Headers }) => {
      const authed = headers.get('authorization') === 'session'
      if (authed && opts.sessionFirmId) {
        return { user: { collection: 'firmUsers', firm: opts.sessionFirmId, name: 'Partner' } }
      }
      return { user: null }
    },
    findByID: async ({ id }: { id: string }) => firms.find((f) => f.id === id) ?? null,
    find: async () => ({ docs: firms }),
  } as unknown as Payload
}

const reqWith = (headers: Record<string, string> = {}) => new Request('http://x/api/firm', { headers })

describe('resolveFirm', () => {
  it('binds the firm from an authenticated session', async () => {
    const payload = fakePayload({ sessionFirmId: 'firm_a' })
    const resolved = await resolveFirm(payload, reqWith({ authorization: 'session' }))
    expect(resolved.firmId).toBe('firm_a')
    expect(resolved.authenticated).toBe(true)
  })

  it('falls back to the first firm for a demo visitor (not authenticated)', async () => {
    const payload = fakePayload({ firms: [{ id: 'firm_a', name: 'Peachtree Injury Partners' }] })
    const resolved = await resolveFirm(payload, reqWith())
    expect(resolved.firmId).toBe('firm_a')
    expect(resolved.authenticated).toBe(false)
  })
})

describe('guardFirmAccess', () => {
  it('allows a caller to reach their own firm', async () => {
    const payload = fakePayload({ sessionFirmId: 'firm_a' })
    const denied = await guardFirmAccess(payload, reqWith({ authorization: 'session' }), 'firm_a')
    expect(denied).toBeNull()
  })

  it('refuses an authenticated caller reaching another firm (403)', async () => {
    const payload = fakePayload({ sessionFirmId: 'firm_a' })
    const denied = await guardFirmAccess(payload, reqWith({ authorization: 'session' }), 'firm_b')
    expect(denied?.status).toBe(403)
  })

  it('pins a demo visitor to the resolved firm, refusing any other (403)', async () => {
    const payload = fakePayload({ firms: [{ id: 'firm_a', name: 'A' }] })
    expect(await guardFirmAccess(payload, reqWith(), 'firm_a')).toBeNull()
    expect((await guardFirmAccess(payload, reqWith(), 'firm_b'))?.status).toBe(403)
  })

  it('returns 404 when no firm resolves at all', async () => {
    const payload = fakePayload({ firms: [] })
    expect((await guardFirmAccess(payload, reqWith(), 'firm_a'))?.status).toBe(404)
  })
})
