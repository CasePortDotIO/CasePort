import { markets } from '@/lib/marketData'
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.caseport.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const marketUrls: MetadataRoute.Sitemap = markets.map((market) => ({
    url: `${BASE_URL}/markets/${market.id}`,
    lastModified: market.activatedDate,
    changeFrequency:
      market.status === 'capped' ? 'weekly' : market.status === 'limited' ? 'weekly' : 'daily',
    priority: market.status === 'capped' ? 0.8 : market.status === 'limited' ? 0.85 : 0.9,
  }))

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
      url: `${BASE_URL}/for-law-firms`,
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
  ]
}
