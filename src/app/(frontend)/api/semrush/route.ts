import { NextRequest, NextResponse } from 'next/server'
import { getKeywordOverview, suggestFaqQuestions, enrichKeywords } from '@/lib/semrush'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const keyword = searchParams.get('keyword') || ''
  const keywords = searchParams.get('keywords') || ''

  if (!process.env.SEMRUSH_API_KEY) {
    return NextResponse.json({ error: 'Semrush API key not configured' }, { status: 500 })
  }

  try {
    if (action === 'overview') {
      // Get volume, CPC, difficulty for a keyword
      if (!keyword) return NextResponse.json({ error: 'keyword param required' }, { status: 400 })
      const results = await getKeywordOverview(keyword)
      return NextResponse.json({ results })
    }

    if (action === 'faq') {
      // Get suggested FAQ questions
      if (!keyword) return NextResponse.json({ error: 'keyword param required' }, { status: 400 })
      const questions = await suggestFaqQuestions(keyword, 5)
      return NextResponse.json({ questions })
    }

    if (action === 'bulk') {
      // Bulk keyword enrichment
      if (!keywords) return NextResponse.json({ error: 'keywords param required' }, { status: 400 })
      const keywordList = keywords.split(',').map((k) => k.trim()).filter(Boolean)
      const enriched = await enrichKeywords(keywordList)
      const result: Record<string, any> = {}
      enriched.forEach((val, key) => { result[key] = val })
      return NextResponse.json({ keywords: result })
    }

    return NextResponse.json({ error: 'Invalid action. Use: overview, faq, bulk' }, { status: 400 })
  } catch (err) {
    console.error('Semrush API route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}