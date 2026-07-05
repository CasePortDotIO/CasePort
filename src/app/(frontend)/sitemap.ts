export const dynamic = 'force-dynamic'
import configPromise from '@payload-config'
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const [{ docs: markets }, { docs: articles }] = await Promise.all([
    payload.find({
      collection: 'markets',
      limit: 200,
      depth: 0,
    }),
    payload.find({
      collection: 'articles',
      limit: 500,
      depth: 0,
      where: { _status: { equals: 'published' } },
    }),
  ])

  // Helper: coerce any value into a valid Date, falling back to `fallback` if invalid.
  const toValidDate = (value: unknown, fallback: Date): Date => {
    if (value instanceof Date) {
      return Number.isFinite(value.getTime()) ? value : fallback
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value)
      return Number.isFinite(parsed.getTime()) ? parsed : fallback
    }
    return fallback
  }

  const marketUrls: MetadataRoute.Sitemap = markets.map((market) => ({
    url: `${BASE_URL}/markets/${market.slug}`,
    lastModified: toValidDate(market.updatedAt, new Date()),
    changeFrequency:
      market.status === 'capped' ? 'weekly' : market.status === 'limited' ? 'weekly' : 'daily',
    priority: market.status === 'capped' ? 0.8 : market.status === 'limited' ? 0.85 : 0.9,
  }))

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => {
    let lastModified: Date = toValidDate(article.updatedAt, new Date())

    // Only consider history entries that have a parseable date — a missing or
    // empty `date` would otherwise produce NaN and crash Date.toISOString().
    if (article.contentUpdateHistory && article.contentUpdateHistory.length > 0) {
      const historyTimestamps = (article.contentUpdateHistory as Array<{
        date?: string | number | Date | null
      }>)
        .map((h) => {
          if (h?.date == null || h.date === '') return NaN
          return new Date(h.date).getTime()
        })
        .filter((t): t is number => Number.isFinite(t))

      if (historyTimestamps.length > 0) {
        const maxTs = Math.max(...historyTimestamps)
        lastModified = new Date(maxTs)
      }
    }

    return {
      url: `${BASE_URL}/insights/${article.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  })

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/markets`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/insights`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/intelligence`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/personal-injury-leads`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/request-access`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...marketUrls,
    ...articleUrls,
  ]
}
