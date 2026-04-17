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

  const marketUrls: MetadataRoute.Sitemap = markets.map((market) => ({
    url: `${BASE_URL}/markets/${market.slug}`,
    lastModified: market.updatedAt,
    changeFrequency:
      market.status === 'capped' ? 'weekly' : market.status === 'limited' ? 'weekly' : 'daily',
    priority: market.status === 'capped' ? 0.8 : market.status === 'limited' ? 0.85 : 0.9,
  }))

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => {
    let lastModified = article.updatedAt
    if (article.contentUpdateHistory && article.contentUpdateHistory.length > 0) {
      const dates = article.contentUpdateHistory.map((h: any) => new Date(h.date).getTime())
      const maxDate = new Date(Math.max(...dates))
      lastModified = maxDate.toISOString()
    }

    return {
      url: `${BASE_URL}/insights/${article.slug}`,
      lastModified: lastModified,
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
