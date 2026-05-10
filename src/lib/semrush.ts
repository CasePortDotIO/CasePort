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
 * Uses: type=phrase_all (all databases) or type=phrase_this (one database)
 * Docs: https://developer.semrush.com/api/seo/keyword-reports/
 */
export async function getKeywordOverview(keys: string): Promise<KeywordOverviewResult[]> {
  if (!SEMRUSH_API_KEY) {
    console.warn('Semrush API key not configured')
    return []
  }

  try {
    const url = `${SEMRUSH_BASE_URL}/?type=phrase_all&key=${SEMRUSH_API_KEY}&phrase=${encodeURIComponent(keys)}&database=us&display_limit=1&export_columns=keyword,search_volume,cpc,competition,database,date`
    const res = await fetch(url, { next: { revalidate: 86400 } }) // cache 24h
    if (!res.ok) {
      const body = await res.text()
      console.error(`Semrush API error ${res.status}:`, body)
      throw new Error(`Semrush API error: ${res.status}`)
    }
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
          keyword: row.Keyword || row.keyword || '',
          phrasedifficulty: 0,
          competition: parseFloat(row.Competition || row.competition) || 0,
          cpc: parseFloat(row.CPC || row.Cpc || row.cpc) || 0,
          vol: parseFloat(row['Search Volume'] || row.search_volume) || 0,
          trend: '',
          serp_features: [],
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
 * Uses: type=phrase_questions
 * Docs: https://developer.semrush.com/api/seo/keyword-reports/
 */
export async function getKeywordQuestions(keyword: string, limit = 10): Promise<string[]> {
  if (!SEMRUSH_API_KEY) return []
  try {
    const url = `${SEMRUSH_BASE_URL}/?type=phrase_questions&key=${SEMRUSH_API_KEY}&phrase=${encodeURIComponent(keyword)}&database=us&display_limit=${limit}`
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
    const url = `${SEMRUSH_BASE_URL}/?type=phrase_questions&key=${SEMRUSH_API_KEY}&phrase=${encodeURIComponent(keyword)}&database=us&display_limit=${count}`
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