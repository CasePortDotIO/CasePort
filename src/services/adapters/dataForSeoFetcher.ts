import type { Payload } from 'payload'
import type { SourceFetcher } from '../ingestionPorts'
import type { SignalIngestInput } from '../intelligenceCorePorts'

/**
 * DataForSEO rented source fetcher (INTELLIGENCE_CORE.md Phase B). A pay as you
 * go, no subscription alternative to the Semrush API for keyword volume and
 * search data (roughly two orders of magnitude cheaper at CasePort's scope,
 * because the defensible data cell gate means we only ever fetch pursued cells
 * in funded markets, and signals dedup and supersede so unchanged data is never
 * refetched).
 *
 * The fetcher derives its keyword list from the pursued demand cells, so it never
 * queries a cell that would not monetize, and it emits candidate signals that
 * still pass the epistemic gate (source rating, dedup, supersession). It runs dry
 * (returns nothing) when DataForSEO credentials are absent, so building it commits
 * no spend and the poller stays observable meanwhile. It is provider agnostic: a
 * different keyword source is a different fetcher behind the same port.
 */

export const DATAFORSEO_SOURCE_KEY = 'dataforseo'

interface KeywordVolumeRow {
  keyword: string
  search_volume: number | null
}

function dataForSeoConfigured(): boolean {
  return Boolean(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD)
}

/** Map a demand cell to the keyword it should track. Pure, so it is testable. */
export function cellKeyword(cell: { market: string; legalConcept: string }): string {
  const marketTerm: Record<string, string> = {
    va: 'virginia',
    md: 'maryland',
    dc: 'washington dc',
    ga: 'georgia',
  }
  const concept = cell.legalConcept.replace(/-/g, ' ').trim()
  const geo = marketTerm[cell.market.toLowerCase()] ?? cell.market
  return `${concept} ${geo}`.trim()
}

/**
 * Map DataForSEO keyword volume rows to candidate signals. Pure and testable.
 * A row with no keyword is skipped; a null volume is carried as unknown rather
 * than invented, honoring the epistemic discipline (never assert a figure we do
 * not have).
 */
export function dataForSeoToSignals(rows: KeywordVolumeRow[], observedAt: string): SignalIngestInput[] {
  return rows
    .filter((r) => r.keyword && r.keyword.trim())
    .map((r) => ({
      sourceKey: DATAFORSEO_SOURCE_KEY,
      domain: 'demand' as const,
      dedupKey: `dataforseo:volume:${r.keyword.toLowerCase()}`,
      claim:
        r.search_volume == null
          ? `Google monthly search volume for "${r.keyword}" is not available.`
          : `Google monthly search volume for "${r.keyword}" is ${r.search_volume}.`,
      observedAt,
      data: { keyword: r.keyword, searchVolume: r.search_volume },
    }))
}

async function fetchVolumes(keywords: string[]): Promise<KeywordVolumeRow[]> {
  if (keywords.length === 0) return []
  const login = process.env.DATAFORSEO_LOGIN as string
  const password = process.env.DATAFORSEO_PASSWORD as string
  const auth = Buffer.from(`${login}:${password}`).toString('base64')
  const locationCode = Number(process.env.DATAFORSEO_LOCATION_CODE ?? 2840) // United States
  try {
    const res = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ keywords, location_code: locationCode, language_code: 'en' }]),
    })
    const json = (await res.json().catch(() => ({}))) as {
      tasks?: Array<{ result?: Array<{ keyword?: string; search_volume?: number | null }> }>
    }
    const rows: KeywordVolumeRow[] = []
    for (const task of json.tasks ?? []) {
      for (const r of task.result ?? []) {
        if (r.keyword) rows.push({ keyword: r.keyword, search_volume: r.search_volume ?? null })
      }
    }
    return rows
  } catch (err) {
    console.error('[dataforseo] search volume fetch failed', err)
    return []
  }
}

/**
 * Build the DataForSEO fetcher against Payload. It reads the pursued demand cells
 * to decide which keywords to query, so spend is bounded to funded, monetizable
 * cells by construction.
 */
export function createDataForSeoFetcher(payload: Payload): SourceFetcher {
  return {
    async fetch() {
      if (!dataForSeoConfigured()) return []
      const cells = await payload.find({
        collection: 'demand-cells',
        where: { status: { equals: 'pursue' } },
        limit: 200,
      })
      const keywords = Array.from(
        new Set(
          (cells.docs as unknown as Array<Record<string, unknown>>)
            .map((c) => cellKeyword({ market: String(c.market ?? ''), legalConcept: String(c.legalConcept ?? '') }))
            .filter(Boolean),
        ),
      )
      const rows = await fetchVolumes(keywords)
      return dataForSeoToSignals(rows, new Date().toISOString())
    },
  }
}
