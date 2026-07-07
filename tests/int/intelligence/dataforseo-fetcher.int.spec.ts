import { describe, it, expect, beforeAll } from 'vitest'
import { createIntelligenceCoreService } from '@/services/IntelligenceCoreService'
import { createIngestionService } from '@/services/IngestionService'
import { createIntelligenceCoreHarness, intelligenceCoreDepsFrom } from '@/services/fakes/intelligenceCoreInMemory'
import { ingestionDepsFrom } from '@/services/fakes/ingestionInMemory'
import { cellKeyword, dataForSeoToSignals, DATAFORSEO_SOURCE_KEY, createDataForSeoFetcher } from '@/services/adapters/dataForSeoFetcher'

/**
 * DataForSEO fetcher: the cheaper keyword and search data source (Phase B). This
 * proves the pure mapping (a cell to its keyword, a volume row to a candidate
 * signal), that the mapped signals pass the epistemic gate, and that the live
 * fetcher runs dry with no spend when credentials are absent.
 */

beforeAll(() => {
  delete process.env.DATAFORSEO_LOGIN
  delete process.env.DATAFORSEO_PASSWORD
})

describe('DataForSEO cell to keyword mapping', () => {
  it('derives a geo scoped keyword from a demand cell', () => {
    expect(cellKeyword({ market: 'va', legalConcept: 'contributory-negligence' })).toBe('contributory negligence virginia')
    expect(cellKeyword({ market: 'ga', legalConcept: 'sb-68' })).toBe('sb 68 georgia')
    expect(cellKeyword({ market: 'dc', legalConcept: 'pedestrian-carve-outs' })).toBe('pedestrian carve outs washington dc')
  })
})

describe('DataForSEO volume rows to candidate signals', () => {
  it('maps rows to signals and never invents a missing figure', () => {
    const signals = dataForSeoToSignals(
      [
        { keyword: 'contributory negligence virginia', search_volume: 480 },
        { keyword: 'no volume keyword', search_volume: null },
        { keyword: '', search_volume: 10 },
      ],
      '2026-07-06T00:00:00.000Z',
    )
    expect(signals).toHaveLength(2) // the empty keyword is skipped
    expect(signals[0]?.sourceKey).toBe(DATAFORSEO_SOURCE_KEY)
    expect(signals[0]?.domain).toBe('demand')
    expect(signals[0]?.claim).toMatch(/is 480/)
    expect(signals[1]?.claim).toMatch(/not available/) // null volume is not invented
  })

  it('mapped signals pass the epistemic gate once the source is registered', async () => {
    const h = createIntelligenceCoreHarness()
    const cic = createIntelligenceCoreService(intelligenceCoreDepsFrom(h))
    await cic.registerSource({
      sourceKey: DATAFORSEO_SOURCE_KEY,
      name: 'DataForSEO',
      origin: 'rented',
      reliability: 'B',
      domains: ['demand', 'market'],
      addedBy: 'founder',
    })
    const candidates = dataForSeoToSignals([{ keyword: 'slip and fall maryland', search_volume: 210 }], '2026-07-06T00:00:00.000Z')
    const ingestion = createIngestionService(ingestionDepsFrom(cic, { [DATAFORSEO_SOURCE_KEY]: candidates }))
    const summary = await ingestion.pollSource(DATAFORSEO_SOURCE_KEY)
    expect(summary.ingested).toBe(1)
    expect(h.signalRows[0]?.reliability).toBe('B') // inherited from the source
  })
})

describe('DataForSEO fetcher runs dry without credentials', () => {
  it('returns nothing and makes no request when unconfigured', async () => {
    // A payload stub that would throw if queried, proving no work happens dry.
    const payloadStub = {
      find() {
        throw new Error('should not query without credentials')
      },
    } as never
    const fetcher = createDataForSeoFetcher(payloadStub)
    expect(await fetcher.fetch(DATAFORSEO_SOURCE_KEY)).toEqual([])
  })
})
