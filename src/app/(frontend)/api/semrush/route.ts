import { NextRequest, NextResponse } from 'next/server'
import {
  getKeywordOverview,
  suggestFaqQuestions,
  enrichKeywords,
  getRelatedKeywords,
  getSerpOpportunities,
  getCompetitorKeywordGap,
  trackKeywordRankings,
  suggestInternalLinks,
  analyzeFocusKeyword,
} from '@/lib/semrush'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const keyword = searchParams.get('keyword') || ''
  const keywords = searchParams.get('keywords') || ''
  const domain = searchParams.get('domain') || 'caseport.io'
  const competitors = searchParams.get('competitors') || ''

  if (!process.env.SEMRUSH_API_KEY) {
    return NextResponse.json({ error: 'Semrush API key not configured' }, { status: 500 })
  }

  try {
    if (action === 'overview') {
      if (!keyword) return NextResponse.json({ error: 'keyword param required' }, { status: 400 })
      const results = await getKeywordOverview(keyword)
      return NextResponse.json({ results })
    }

    if (action === 'faq') {
      if (!keyword) return NextResponse.json({ error: 'keyword param required' }, { status: 400 })
      const questions = await suggestFaqQuestions(keyword, 5)
      return NextResponse.json({ questions })
    }

    if (action === 'bulk') {
      if (!keywords) return NextResponse.json({ error: 'keywords param required' }, { status: 400 })
      const keywordList = keywords.split(',').map((k) => k.trim()).filter(Boolean)
      const enriched = await enrichKeywords(keywordList)
      const result: Record<string, unknown> = {}
      enriched.forEach((val, key) => { result[key] = val })
      return NextResponse.json({ keywords: result })
    }

    if (action === 'secondary') {
      // Feature 1: Get secondary keywords for a primary keyword
      if (!keyword) return NextResponse.json({ error: 'keyword param required' }, { status: 400 })
      const secondary = await getRelatedKeywords(keyword, 10)
      return NextResponse.json({ secondary })
    }

    if (action === 'serp') {
      // Feature 2: Get SERP feature opportunities
      if (!keyword) return NextResponse.json({ error: 'keyword param required' }, { status: 400 })
      const opportunities = await getSerpOpportunities(keyword, 10)
      return NextResponse.json({ opportunities })
    }

    if (action === 'competitor-gap') {
      // Feature 3: Competitor keyword gap analysis
      if (!keyword) return NextResponse.json({ error: 'keyword param required' }, { status: 400 })
      const competitorList = competitors ? competitors.split(',').map((c) => c.trim()) : []
      const gap = await getCompetitorKeywordGap(domain, competitorList, keyword, 20)
      return NextResponse.json(gap)
    }

    if (action === 'rank-tracking') {
      // Feature 4: Track keyword rankings
      if (!keywords) return NextResponse.json({ error: 'keywords param required' }, { status: 400 })
      const keywordList = keywords.split(',').map((k) => k.trim()).filter(Boolean)
      const rankings = await trackKeywordRankings(keywordList, domain)
      return NextResponse.json({ rankings })
    }

    if (action === 'internal-links') {
      // Feature 5: Suggest internal links
      const articleTitle = searchParams.get('title') || ''
      const articleKeywords = searchParams.get('articleKeywords')?.split(',').map((k) => k.trim()) || []
      const existingArticlesParam = searchParams.get('existingArticles')
      let existingArticles: { title: string; slug: string; keywords: string[] }[] = []
      if (existingArticlesParam) {
        try {
          existingArticles = JSON.parse(existingArticlesParam)
        } catch {
          // Invalid JSON, use empty array
        }
      }
      if (!articleTitle || articleKeywords.length === 0) {
        return NextResponse.json({ error: 'title and articleKeywords params required' }, { status: 400 })
      }
      const suggestions = await suggestInternalLinks(articleTitle, articleKeywords, existingArticles)
      return NextResponse.json({ suggestions })
    }

    if (action === 'analyze') {
      // Full analysis: all data for a focus keyword
      if (!keyword) return NextResponse.json({ error: 'keyword param required' }, { status: 400 })
      const analysis = await analyzeFocusKeyword(keyword)
      return NextResponse.json({ analysis })
    }

    return NextResponse.json({ error: 'Invalid action. Use: overview, faq, bulk, secondary, serp, competitor-gap, rank-tracking, internal-links, analyze' }, { status: 400 })
  } catch (err) {
    console.error('Semrush API route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}