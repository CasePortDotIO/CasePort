import { NextResponse, type NextRequest } from 'next/server'

/**
 * Host scoping for the internal operations console.
 *
 * The console (/ops and /api/ops) is the crown jewel internal surface. It is
 * meant to live on its own subdomain, isolated from the public claimant site and
 * the firm app, so a problem on a public surface never touches it. This
 * middleware enforces that at the edge: when OPS_HOST is configured (for example
 * ops.caseport.io), the console is reachable only on that host, and every other
 * production host gets a 404 for those paths, so the console does not exist on
 * any public surface. On the internal host, the root path is rewritten to /ops.
 *
 * It stays out of the way until you opt in: with OPS_HOST unset (local dev, the
 * current deploy), behavior is unchanged. Dev and Vercel preview hosts are always
 * allowed so nothing breaks locally or on a preview URL. This is the routing
 * lock; put an identity layer (Cloudflare Access or Vercel SSO tied to your
 * workspace) in front of the subdomain for the second lock, with the app's
 * operator auth on top.
 */

export type OpsRouteAction = 'next' | 'rewrite-root-to-ops' | 'not-found'

/**
 * Pure routing decision, so the host scoping is testable without the edge
 * runtime. Returns what the middleware should do for a given path and host.
 */
export function decideOpsRoute(input: {
  pathname: string
  host: string
  opsHost?: string
}): OpsRouteAction {
  const host = input.host.toLowerCase().split(':')[0]
  const opsHost = input.opsHost?.toLowerCase().trim()
  const isInternalPath =
    input.pathname === '/ops' || input.pathname.startsWith('/ops/') || input.pathname.startsWith('/api/ops')

  const isDevOrPreview =
    host === 'localhost' || host === '127.0.0.1' || host.endsWith('.vercel.app') || host.endsWith('.local')

  // Land the internal host's root on the console, whenever the host matches.
  if (opsHost && host === opsHost && input.pathname === '/') return 'rewrite-root-to-ops'

  // No internal host configured, or a dev/preview host: unchanged behavior.
  if (!opsHost || isDevOrPreview) return 'next'

  // The console exists only on the internal host. Everywhere else it is a 404.
  if (isInternalPath && host !== opsHost) return 'not-found'

  return 'next'
}

export function proxy(req: NextRequest): NextResponse {
  const host = req.headers.get('host') ?? req.nextUrl.hostname
  const action = decideOpsRoute({ pathname: req.nextUrl.pathname, host, opsHost: process.env.OPS_HOST })
  if (action === 'rewrite-root-to-ops') return NextResponse.rewrite(new URL('/ops', req.url))
  if (action === 'not-found') return new NextResponse('Not found', { status: 404 })
  return NextResponse.next()
}

/**
 * Scope the proxy to the console paths and the root only, so it never touches the
 * public marketing routes, the Payload admin, or static assets.
 */
export const config = {
  matcher: ['/', '/ops', '/ops/:path*', '/api/ops/:path*'],
}
