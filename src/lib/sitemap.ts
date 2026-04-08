/**
 * Sitemap Generation Utility
 *
 * Generates XML sitemap for all 46 city pages
 * For GEO/AEO optimization and search engine crawling
 */

import { markets } from './marketData'

export function generateSitemap(baseUrl: string = 'https://www.caseport.io'): string {
  const urls = [
    // Main pages
    {
      loc: `${baseUrl}/`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      loc: `${baseUrl}/markets`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.9',
    },

    // City pages
    ...markets.map((market) => ({
      loc: `${baseUrl}/markets/${market.id}`,
      lastmod: market.activatedDate,
      changefreq: 'weekly',
      priority: market.status === 'capped' ? '0.8' : market.status === 'limited' ? '0.85' : '0.9',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  return xml
}

/**
 * Generates robots.txt with sitemap reference
 */
export function generateRobotsTxt(baseUrl: string = 'https://www.caseport.io'): string {
  return `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml
`
}
