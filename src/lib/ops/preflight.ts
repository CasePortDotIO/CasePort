/**
 * Launch preflight, as a pure assembler. It turns a snapshot of the environment
 * (which integrations are configured, and how much real data exists) into a set
 * of readiness flags, so the founder can see exactly what is armed and what is
 * still dry before going to market, and can diagnose why a partner cannot log in.
 *
 * It never reads or returns a secret value, only whether each is present. Pure
 * and deterministic, so it is unit tested directly.
 */

export interface PreflightEnvPresence {
  payloadSecret: boolean
  databaseUrl: boolean
  blobToken: boolean
  stripeSecret: boolean
  stripeWebhookSecret: boolean
  twilio: boolean
  resend: boolean
  anthropic: boolean
  deepgram: boolean
  mediaLinkSecret: boolean
  statusLinkSecret: boolean
  appBaseUrl: boolean
}

export interface PreflightCounts {
  /** True only if a live database query succeeded. */
  dbReachable: boolean
  firmUsers: number
  firms: number
  liveMarkets: number
  firmsWithLiveCallbackSla: number
}

export interface PreflightReport {
  env: PreflightEnvPresence
  counts: PreflightCounts
  /** The headline checks, each with a plain reason. */
  checks: Array<{ key: string; ok: boolean; detail: string }>
  readiness: {
    /** A partner can sign in: the DB is reachable, the secret is set, and at
     * least one firm login exists. This is the direct login diagnostic. */
    canLogin: boolean
    /** Money can move in: Stripe is configured. */
    moneyInReady: boolean
    /** The speed callback can fire: Twilio is configured and a firm has a live
     * callback SLA. */
    speedLoopReady: boolean
    /** Multimodal intake is live: Vision and transcription keys are present. */
    multimodalReady: boolean
    /** Signed media and links are backed by a real secret, not the dev default. */
    linkSecretsReady: boolean
    /** Everything required to run a real case end to end for a paying firm. */
    goLive: boolean
  }
}

export function assemblePreflight(input: {
  env: PreflightEnvPresence
  counts: PreflightCounts
}): PreflightReport {
  const { env, counts } = input

  const canLogin = counts.dbReachable && env.payloadSecret && counts.firmUsers > 0
  const moneyInReady = env.stripeSecret && env.stripeWebhookSecret
  const speedLoopReady = env.twilio && counts.firmsWithLiveCallbackSla > 0
  const multimodalReady = env.anthropic && env.deepgram
  // In production the link secrets must not fall back to the dev default.
  const linkSecretsReady = env.payloadSecret || (env.mediaLinkSecret && env.statusLinkSecret)

  const checks: PreflightReport['checks'] = [
    { key: 'database', ok: counts.dbReachable, detail: counts.dbReachable ? 'Database reachable.' : 'Database not reachable. Set DATABASE_URL and check Atlas network access.' },
    { key: 'payload-secret', ok: env.payloadSecret, detail: env.payloadSecret ? 'PAYLOAD_SECRET is set.' : 'PAYLOAD_SECRET is missing. Every database route, including login, will fail without it.' },
    { key: 'firm-login-exists', ok: counts.firmUsers > 0, detail: counts.firmUsers > 0 ? `${counts.firmUsers} partner login(s) exist.` : 'No partner logins exist yet. Create one at /admin under Firm Users, or POST /api/admin/firm-user, before a partner can sign in.' },
    { key: 'live-market', ok: counts.liveMarkets > 0, detail: counts.liveMarkets > 0 ? `${counts.liveMarkets} live market(s).` : 'No live markets. Intake will not validate until a launch market is live.' },
    { key: 'blob-storage', ok: env.blobToken, detail: env.blobToken ? 'Media storage token is set.' : 'BLOB_READ_WRITE_TOKEN is missing. Media uploads will not persist.' },
    { key: 'money-in', ok: moneyInReady, detail: moneyInReady ? 'Stripe is configured.' : 'Stripe keys are incomplete. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET for wallet funding.' },
    { key: 'multimodal', ok: multimodalReady, detail: multimodalReady ? 'Vision and transcription are live.' : 'ANTHROPIC_API_KEY and/or DEEPGRAM_API_KEY missing. Intake still works; auto fill and transcription stay dry.' },
    { key: 'speed-loop', ok: speedLoopReady, detail: speedLoopReady ? 'Speed callback is armed for a firm.' : 'Twilio not configured or no firm has a live callback SLA. The speed callback stays a dry no op.' },
    { key: 'link-secrets', ok: linkSecretsReady, detail: linkSecretsReady ? 'Signed links use a real secret.' : 'Signed links are falling back to a dev secret. Set PAYLOAD_SECRET (or the per link secrets) in production.' },
    { key: 'app-url', ok: env.appBaseUrl, detail: env.appBaseUrl ? 'App base URL is set for outbound links.' : 'NEXT_PUBLIC_APP_URL is unset. Outbound links fall back to the request origin.' },
  ]

  const goLive = canLogin && moneyInReady && counts.liveMarkets > 0 && env.blobToken && linkSecretsReady

  return {
    env,
    counts,
    checks,
    readiness: { canLogin, moneyInReady, speedLoopReady, multimodalReady, linkSecretsReady, goLive },
  }
}

/** Read env presence without ever capturing a value. */
export function readEnvPresence(e: Record<string, string | undefined> = process.env): PreflightEnvPresence {
  const has = (k: string) => Boolean(e[k])
  return {
    payloadSecret: has('PAYLOAD_SECRET'),
    databaseUrl: has('DATABASE_URL'),
    blobToken: has('BLOB_READ_WRITE_TOKEN'),
    stripeSecret: has('STRIPE_SECRET_KEY'),
    stripeWebhookSecret: has('STRIPE_WEBHOOK_SECRET'),
    twilio: has('TWILIO_ACCOUNT_SID') && has('TWILIO_AUTH_TOKEN') && has('TWILIO_FROM_NUMBER'),
    resend: has('RESEND_API_KEY') && has('RESEND_FROM_EMAIL'),
    anthropic: has('ANTHROPIC_API_KEY'),
    deepgram: has('DEEPGRAM_API_KEY'),
    mediaLinkSecret: has('MEDIA_LINK_SECRET'),
    statusLinkSecret: has('STATUS_LINK_SECRET'),
    appBaseUrl: has('NEXT_PUBLIC_APP_URL') || has('NEXT_PUBLIC_SITE_URL') || has('APP_URL'),
  }
}
