import { NextRequest, NextResponse } from 'next'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  const proto = request.headers.get('x-forwarded-proto') || 'https'

  // Redirect HTTPS non-www to www with permanent redirect (308)
  // This overrides Vercel's default 307 temporary redirect
  if (hostname === 'caseport.io' && proto === 'https') {
    return NextResponse.redirect(new URL(`https://www.caseport.io${pathname}`), 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}