import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'

  const content = `# See llms.txt at ${baseUrl}/llms.txt for AI context
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /_next
Disallow: /static
Disallow: /cdn-cgi
Disallow: /*.json$
Disallow: /preview
Disallow: /draft

Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/news-sitemap.xml
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
