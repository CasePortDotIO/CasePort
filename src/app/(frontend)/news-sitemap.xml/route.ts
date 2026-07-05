export const dynamic = 'force-dynamic'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { docs: articles } = await payload.find({
    collection: 'articles',
    limit: 1000,
    depth: 0,
    where: {
      and: [
        { _status: { equals: 'published' } },
        { contentFormat: { equals: 'News' } },
        { publishedDate: { greater_than_equal: thirtyDaysAgo.toISOString() } },
      ],
    },
  })

  const urls = articles
    .map((article) => {
      const pubDate = new Date(article.publishedDate || article.createdAt).toISOString()
      return `
    <url>
      <loc>${BASE_URL}/insights/${article.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>CasePort</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${pubDate}</news:publication_date>
        <news:title>${article.metaTitle || article.title}</news:title>
      </news:news>
    </url>
  `
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
