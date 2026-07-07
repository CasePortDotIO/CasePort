import { describe, it, expect } from 'vitest'
import { decideOpsRoute } from '@/proxy'

/**
 * Host scoping for the internal operations console. The console is reachable
 * only on its own internal subdomain once OPS_HOST is configured, and does not
 * exist on any public surface. Dev and preview hosts always pass so nothing
 * breaks locally, and with no OPS_HOST configured behavior is unchanged.
 */

describe('ops host scoping (decideOpsRoute)', () => {
  const OPS = 'ops.caseport.io'

  it('serves the console on the internal host and lands its root on /ops', () => {
    expect(decideOpsRoute({ pathname: '/', host: OPS, opsHost: OPS })).toBe('rewrite-root-to-ops')
    expect(decideOpsRoute({ pathname: '/ops', host: OPS, opsHost: OPS })).toBe('next')
    expect(decideOpsRoute({ pathname: '/ops/preview', host: OPS, opsHost: OPS })).toBe('next')
    expect(decideOpsRoute({ pathname: '/api/ops/briefing', host: OPS, opsHost: OPS })).toBe('next')
  })

  it('404s the console on any public host once the internal host is configured', () => {
    expect(decideOpsRoute({ pathname: '/ops', host: 'www.caseport.io', opsHost: OPS })).toBe('not-found')
    expect(decideOpsRoute({ pathname: '/api/ops/asset/1', host: 'caseport.io', opsHost: OPS })).toBe('not-found')
    // Public marketing paths on the public host are untouched.
    expect(decideOpsRoute({ pathname: '/checkmycase', host: 'caseport.io', opsHost: OPS })).toBe('next')
  })

  it('always allows dev and vercel preview hosts', () => {
    expect(decideOpsRoute({ pathname: '/ops', host: 'localhost:3000', opsHost: OPS })).toBe('next')
    expect(decideOpsRoute({ pathname: '/ops/preview', host: 'caseport-abc.vercel.app', opsHost: OPS })).toBe('next')
  })

  it('leaves behavior unchanged when no internal host is configured', () => {
    expect(decideOpsRoute({ pathname: '/ops', host: 'caseport.io', opsHost: undefined })).toBe('next')
    expect(decideOpsRoute({ pathname: '/', host: 'caseport.io', opsHost: undefined })).toBe('next')
  })
})
