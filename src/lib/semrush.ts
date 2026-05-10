/**
 * Semrush API Service
 * API Docs: https://www.semrush.com/api/
 *
 * Authentication: API key passed as `key` query parameter
 * Base URL: https://api.semrush.com/
 */

const SEMRUSH_API_KEY = process.env.SEMRUSH_API_KEY || ''
const SEMRUSH_BASE_URL = 'https://api.semrush.com'

export interface KeywordData {
  keyword: string
  volume: number
  cpc: number
  competition: number
  difficulty: number
  trend: string
  resultCount: number
  serpFeatures: string[]
}

export interface KeywordOverviewResult {
  keyword: string
  phrasedifficulty: number
  competition: number
  cpc: number
  vol: number
  trend: string
  serp_features: string[]
}

export interface DomainAnalyticsResult {
  domain: string
  overview: {
    domain: string
    rank: number
    organic_keywords: number
    organic_traffic: number
    organic_cost: number
    ad_traffic: number
    ad_cost: number
  }
}

export interface TrafficAnalyticsResult {
  domain: string
  metrics: {
    visitors: number
    pages_per_visit: number
    bounce_rate: number
    month_over_month: number
  }
}

// ─── Keyword Research ─────────────────────────────────────────────────────────

/**
 * Get keyword overview data - volume, CPC, difficulty, competition
 * Endpoint: /info/keyword_overview/
 */
export async function getKeywordOverview(keys: string): Promise<KeywordOverviewResult[]> {
  if (!SEMRUSH_API_KEY) {
    console.warn('Semrush API key not configured')
    return []
  }

  try {
    const url = `${SEMRUSH_BASE_URL}/info/keyword_overview/?key=${SEMRUSH_API_KEY}&keys=${encodeURIComponent(keys)}&export_columns=phrase,phrasedifficulty,competition,cpc,vol,trend,serp_features`
    const res = await fetch(url, { next: { revalidate: 86400 } }) // cache 24h
    if (!res.ok) throw new Error(`Semrush API error: ${res.status}`)
    const text = await res.text()
    // Semrush returns CSV-like format: header line then data lines
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []
    const headers = lines[0].split(';')
    const results: KeywordOverviewResult[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';')
      if (values.length >= headers.length) {
        const row: any = {}
        headers.forEach((h, idx) => { row[h] = values[idx] })
        results.push({
          keyword: row.phrase,
          phrasedifficulty: parseFloat(row.phrasedifficulty) || 0,
          competition: parseFloat(row.competition) || 0,
          cpc: parseFloat(row.cpc) || 0,
          vol: parseFloat(row.vol) || 0,
          trend: row.trend || '',
          serp_features: row.serp_features ? row.serp_features.split(',') : [],
        })
      }
    }
    return results
  } catch (err) {
    console.error('Semrush keyword overview error:', err)
    return []
  }
}

/**
 * Get keyword ideas for a seed keyword
 * Endpoint: /info/keyword_questions/
 */
export async function getKeywordQuestions(keyword: string, limit = 10): Promise<string[]> {
  if (!SEMRUSH_API_KEY) return []
  try {
    const url = `${SEMRUSH_BASE_URL}/info/keyword_questions/?key=${SEMRUSH_API_KEY}&keyword=${encodeURIComponent(keyword)}&type=questions&limit=${limit}`
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) throw new Error(`Semrush API error: ${res.status}`)
    const text = await res.text()
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []
    // Format: phrase;similarity
    const questions: string[] = []
    for (let i = 1; i < lines.length; i++) {
      const [phrase] = lines[i].split(';')
      if (phrase) questions.push(phrase)
    }
    return questions
  } catch (err) {
    console.error('Semrush keyword questions error:', err)
    return []
  }
}

// ─── Domain Analytics ─────────────────────────────────────────────────────────

/**
 * Get domain overview analytics
 * Endpoint: /analytics/domain_overview/
 */
export async function getDomainOverview(domain: string): Promise<DomainAnalyticsResult | null> {
  if (!SEMRUSH_API_KEY) return null
  try {
    const url = `${SEMRUSH_BASE_URL}/analytics/domain_overview/?key=${SEMRUSH_API_KEY}&domain=${encodeURIComponent(domain)}&display_limit=1`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`Semrush API error: ${res.status}`)
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      return data.results[0]
    }
    return null
  } catch (err) {
    console.error('Semrush domain overview error:', err)
    return null
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Bulk fetch keyword data for an array of keywords
 */
export async function enrichKeywords(keywords: string[]): Promise<Map<string, KeywordData>> {
  if (!SEMRUSH_API_KEY || keywords.length === 0) return new Map()

  // Semrush allows up to 200 keywords per request, batch them
  const results = new Map<string, KeywordData>()
  const batchSize = 100
  for (let i = 0; i < keywords.length; i += batchSize) {
    const batch = keywords.slice(i, i + batchSize)
    const keysParam = batch.join(',')
    const overview = await getKeywordOverview(keysParam)
    overview.forEach((row) => {
      results.set(row.keyword, {
        keyword: row.keyword,
        volume: row.vol,
        cpc: row.cpc,
        competition: row.competition,
        difficulty: row.phrasedifficulty,
        trend: row.trend,
        resultCount: 0,
        serpFeatures: row.serp_features,
      })
    })
  }
  return results
}

/**
 * Get suggested FAQ questions based on keyword research
 * Uses keyword_questions to find common question patterns
 */
export async function suggestFaqQuestions(keyword: string, count = 5): Promise<string[]> {
  if (!SEMRUSH_API_KEY) return []
  try {
    const url = `${SEMRUSH_BASE_URL}/info/keyword_questions/?key=${SEMRUSH_API_KEY}&keyword=${encodeURIComponent(keyword)}&type=questions&limit=${count}`
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) throw new Error(`Semrush API error: ${res.status}`)
    const text = await res.text()
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []
    const questions: string[] = []
    for (let i = 1; i < lines.length && questions.length < count; i++) {
      const [phrase] = lines[i].split(';')
      if (phrase) questions.push(phrase)
    }
    return questions
  } catch (err) {
    console.error('Semrush FAQ suggestions error:', err)
    return []
  }
}