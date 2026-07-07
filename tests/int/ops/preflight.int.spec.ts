import { describe, it, expect } from 'vitest'
import { assemblePreflight, readEnvPresence, type PreflightEnvPresence, type PreflightCounts } from '@/lib/ops/preflight'

/**
 * The launch preflight and login diagnostic. It turns the environment snapshot
 * into readiness flags so the founder sees what is armed and, specifically, why a
 * partner cannot sign in.
 */

const allEnv: PreflightEnvPresence = {
  payloadSecret: true, databaseUrl: true, blobToken: true, stripeSecret: true, stripeWebhookSecret: true,
  twilio: true, resend: true, anthropic: true, deepgram: true, mediaLinkSecret: true, statusLinkSecret: true, appBaseUrl: true,
}
const noEnv: PreflightEnvPresence = {
  payloadSecret: false, databaseUrl: false, blobToken: false, stripeSecret: false, stripeWebhookSecret: false,
  twilio: false, resend: false, anthropic: false, deepgram: false, mediaLinkSecret: false, statusLinkSecret: false, appBaseUrl: false,
}
const fullCounts: PreflightCounts = { dbReachable: true, firmUsers: 1, firms: 1, liveMarkets: 1, firmsWithLiveCallbackSla: 1 }
const emptyCounts: PreflightCounts = { dbReachable: false, firmUsers: 0, firms: 0, liveMarkets: 0, firmsWithLiveCallbackSla: 0 }

describe('login diagnostic (canLogin)', () => {
  it('is true only when the DB is reachable, the secret is set, and a firm login exists', () => {
    expect(assemblePreflight({ env: allEnv, counts: fullCounts }).readiness.canLogin).toBe(true)
  })

  it('is false, with a clear reason, when no partner login exists yet', () => {
    const r = assemblePreflight({ env: allEnv, counts: { ...fullCounts, firmUsers: 0 } })
    expect(r.readiness.canLogin).toBe(false)
    const check = r.checks.find((c) => c.key === 'firm-login-exists')!
    expect(check.ok).toBe(false)
    expect(check.detail).toContain('No partner logins exist')
  })

  it('is false, with a clear reason, when PAYLOAD_SECRET is missing', () => {
    const r = assemblePreflight({ env: { ...allEnv, payloadSecret: false }, counts: fullCounts })
    expect(r.readiness.canLogin).toBe(false)
    expect(r.checks.find((c) => c.key === 'payload-secret')!.detail).toContain('login')
  })

  it('is false when the database is unreachable', () => {
    expect(assemblePreflight({ env: allEnv, counts: { ...fullCounts, dbReachable: false } }).readiness.canLogin).toBe(false)
  })
})

describe('go-live readiness', () => {
  it('is green only when login, money-in, a live market, storage, and real link secrets are all ready', () => {
    expect(assemblePreflight({ env: allEnv, counts: fullCounts }).readiness.goLive).toBe(true)
  })

  it('a bare environment is not go-live, and every check reads false', () => {
    const r = assemblePreflight({ env: noEnv, counts: emptyCounts })
    expect(r.readiness.goLive).toBe(false)
    expect(r.readiness.canLogin).toBe(false)
    expect(r.readiness.moneyInReady).toBe(false)
    expect(r.readiness.speedLoopReady).toBe(false)
  })

  it('flags the speed loop as dry until a firm has a live callback SLA even with Twilio set', () => {
    const r = assemblePreflight({ env: allEnv, counts: { ...fullCounts, firmsWithLiveCallbackSla: 0 } })
    expect(r.readiness.speedLoopReady).toBe(false)
  })

  it('treats link secrets as ready when PAYLOAD_SECRET is set (the fallback source)', () => {
    const r = assemblePreflight({ env: { ...noEnv, payloadSecret: true }, counts: fullCounts })
    expect(r.readiness.linkSecretsReady).toBe(true)
  })

  it('never leaks a secret value: the report is presence booleans only', () => {
    const r = assemblePreflight({ env: allEnv, counts: fullCounts })
    for (const v of Object.values(r.env)) expect(typeof v).toBe('boolean')
  })
})

describe('readEnvPresence', () => {
  it('reports presence without capturing values', () => {
    const p = readEnvPresence({ PAYLOAD_SECRET: 'super-secret', TWILIO_ACCOUNT_SID: 'x', TWILIO_AUTH_TOKEN: 'y', TWILIO_FROM_NUMBER: 'z' })
    expect(p.payloadSecret).toBe(true)
    expect(p.twilio).toBe(true)
    expect(p.stripeSecret).toBe(false)
    // The value never appears on the presence object.
    expect(JSON.stringify(p)).not.toContain('super-secret')
  })

  it('requires all three Twilio vars for twilio presence', () => {
    expect(readEnvPresence({ TWILIO_ACCOUNT_SID: 'x' }).twilio).toBe(false)
  })
})
