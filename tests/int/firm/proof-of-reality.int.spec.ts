import { describe, it, expect } from 'vitest'
import { createGlassBoxService } from '@/services/GlassBoxService'
import { createWalletHarness, glassBoxDepsFrom } from '@/services/fakes/walletInMemory'
import { findEvaluativeLeaks } from '@/lib/compliance/assertNoEvaluativeLeak'
import type { RedactedActivity } from '@/services/GlassBoxService'

/**
 * Proof of reality for a market, the pre funding skeptic converter (Section 7
 * step 1). It must serve a prospect who has no firm record yet, keyed by market,
 * and it must carry no PII and no evaluative signal: representative recent
 * activity, redacted, framed as representative and never as a volume guarantee.
 */

const activity: RedactedActivity[] = [
  { reference: 'CP-AAA111', caseType: 'motor-vehicle-accident', market: 'mkt_atlanta', receivedAt: '2026-07-06T10:00:00.000Z', status: 'received' },
  { reference: 'CP-BBB222', caseType: 'commercial-trucking-accident', market: 'mkt_atlanta', receivedAt: '2026-07-05T09:00:00.000Z', status: 'delivered' },
]

function service(recent: RedactedActivity[] = activity) {
  const harness = createWalletHarness()
  return createGlassBoxService(
    glassBoxDepsFrom(harness, { recentMarketActivity: async () => recent }),
  )
}

describe('proof of reality for a market', () => {
  it('returns representative recent activity keyed by market, no firm required', async () => {
    const glass = service()
    const feed = await glass.proofOfRealityForMarket('mkt_atlanta', 12)
    expect(feed.market).toBe('mkt_atlanta')
    expect(feed.items).toHaveLength(2)
    expect(feed.items[0].reference).toBe('CP-AAA111')
  })

  it('is framed as representative, never a volume guarantee', async () => {
    const glass = service()
    const feed = await glass.proofOfRealityForMarket('mkt_atlanta')
    expect(feed.framing.toLowerCase()).toContain('representative')
    expect(feed.framing.toLowerCase()).toContain('not a volume guarantee')
  })

  it('carries no PII and no evaluative signal', async () => {
    const glass = service()
    const feed = await glass.proofOfRealityForMarket('mkt_atlanta')
    // The redacted rows expose only reference, case type, market, received, status.
    expect(findEvaluativeLeaks(feed.items)).toHaveLength(0)
    for (const item of feed.items) {
      expect(Object.keys(item).sort()).toEqual(['caseType', 'market', 'receivedAt', 'reference', 'status'])
    }
  })

  it('returns an empty feed cleanly for a market with no activity', async () => {
    const glass = service([])
    const feed = await glass.proofOfRealityForMarket('mkt_empty')
    expect(feed.items).toEqual([])
    expect(feed.framing.toLowerCase()).toContain('representative')
  })
})
