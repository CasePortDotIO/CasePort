import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/case-review', '/api/', '/payload-admin/'],
      },
      { userAgent: 'GPTBot', allow: ['/guides/', '/accidents/', '/injured'] },
      { userAgent: 'PerplexityBot', allow: ['/guides/', '/accidents/', '/injured'] },
      { userAgent: 'Claude-Web', allow: ['/guides/', '/accidents/', '/injured'] },
      { userAgent: 'Google-Extended', allow: ['/guides/', '/accidents/', '/injured'] },
      { userAgent: 'anthropic-ai', allow: ['/guides/', '/accidents/', '/injured'] },
      { userAgent: 'Amazonbot', allow: ['/guides/', '/accidents/', '/injured'] },
    ],
    sitemap: 'https://www.caseport.io/sitemap.xml',
  }
}
