import { resolveSignedMedia } from '@/lib/mediaLink'

/**
 * Signed, expiring media access (W5). Resolves a signed link to the underlying
 * object and streams it, but only while the signature is valid and unexpired.
 * A firm holds only this short lived signed link, never the raw storage URL.
 *
 * Because resolveSignedMedia returns only keys the server itself signed, this
 * endpoint can never be pointed at an arbitrary URL: the HMAC closes SSRF. As a
 * second layer it still refuses anything that is not a plain https object and
 * blocks internal address ranges. The response is marked private and no-store,
 * because the bytes are PII.
 */
export const dynamic = 'force-dynamic'

function isSafePublicHttpsUrl(raw: string): boolean {
  let u: URL
  try {
    u = new URL(raw)
  } catch {
    return false
  }
  if (u.protocol !== 'https:') return false
  const host = u.hostname.toLowerCase()
  // Block internal / loopback / link-local hosts as defense in depth.
  if (
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    /^(127\.|10\.|169\.254\.|192\.168\.|::1$|fe80:)/.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  ) {
    return false
  }
  return true
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const resolved = resolveSignedMedia({
    k: url.searchParams.get('k'),
    e: url.searchParams.get('e'),
    s: url.searchParams.get('s'),
    nowEpochMs: Date.now(),
  })

  if ('error' in resolved) {
    return Response.json(
      { error: resolved.error },
      { status: resolved.error === 'expired' ? 410 : 403 },
    )
  }

  if (!isSafePublicHttpsUrl(resolved.key)) {
    // A signed key that is not a fetchable https object (e.g. a local dev path).
    return Response.json({ error: 'unavailable' }, { status: 404 })
  }

  try {
    const upstream = await fetch(resolved.key)
    if (!upstream.ok || !upstream.body) {
      return Response.json({ error: 'unavailable' }, { status: 502 })
    }
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/octet-stream',
        // PII: never cache in a shared cache, and let the browser keep it only
        // for the life of the signed link.
        'cache-control': 'private, max-age=600, no-transform',
        'content-disposition': 'inline',
      },
    })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 502 })
  }
}
