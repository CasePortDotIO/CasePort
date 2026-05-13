import { NextRequest, NextResponse } from 'next/server'
import { submitUrlToBing } from '@/lib/bing-indexing'

/**
 * POST /api/bing-index
 * Submit a single URL to Bing IndexNow
 * Body: { url: string, siteUrl?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, siteUrl } = body

    if (!url) {
      return NextResponse.json(
        { success: false, message: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const result = await submitUrlToBing(url, siteUrl)

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/bing-index
 * Health check / status
 */
export async function GET() {
  const apiKey = process.env.BING_INDEXNOW_API_KEY
  return NextResponse.json({
    status: 'ok',
    bingIndexingConfigured: !!apiKey,
    message: apiKey
      ? 'BING_INDEXNOW_API_KEY is configured'
      : 'BING_INDEXNOW_API_KEY environment variable not set',
  })
}