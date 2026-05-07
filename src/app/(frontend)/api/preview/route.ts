import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const slug = searchParams.get('slug')
  const id = searchParams.get('id')

  if (!slug && !id) {
    return NextResponse.json(
      { error: 'Missing slug or id parameter' },
      { status: 400 }
    )
  }

  try {
    const payload = await getPayload({ config })

    let article: any
    if (id) {
      // When we have the ID, we can directly fetch by ID with drafts
      article = await payload.findByID({
        collection: 'articles',
        id,
        draft: true,
      })
    } else {
      // For slug-based lookup with drafts, we need to query with both slug and _status
      const result = await payload.find({
        collection: 'articles',
        where: {
          slug: { equals: slug },
        },
        draft: true,
        limit: 1,
      })
      if (!result.docs.length) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
      article = result.docs[0]
    }

    const targetSlug = article.slug
    const frontendUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/insights/${targetSlug}?preview=true&draft=${article.id}`

    return NextResponse.redirect(frontendUrl)
  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json(
      { error: 'Failed to load preview' },
      { status: 500 }
    )
  }
}