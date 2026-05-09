import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin
  return NextResponse.redirect(`${siteUrl}/insights`)
}