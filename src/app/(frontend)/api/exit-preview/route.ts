import { NextResponse } from 'next/server'

// Exit preview mode
export async function GET() {
  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return NextResponse.redirect(`${frontendUrl}/insights`)
}