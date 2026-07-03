import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

type CollectionSlug = 'articles' | 'guideArticles'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const slug = searchParams.get('slug')
  const id = searchParams.get('id')
  const collectionParam = searchParams.get('collection') || 'articles'

  if (!slug && !id) {
    return NextResponse.json(
      { error: 'Missing slug or id parameter' },
      { status: 400 }
    )
  }

  const collectionSlug: CollectionSlug = collectionParam === 'guideArticles' ? 'guideArticles' : 'articles'

  try {
    const payload = await getPayload({ config })

    let article: any
    if (id) {
      article = await payload.findByID({
        collection: collectionSlug,
        id,
        draft: true,
      })
    } else {
      const result = await payload.find({
        collection: collectionSlug,
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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin

    let frontendUrl: string
    if (collectionSlug === 'guideArticles') {
      const categorySlug = article.guideCategory?.slug || article.guideCategory
      frontendUrl = `${siteUrl}/guides/${categorySlug}/${targetSlug}?preview=true&draft=${article.id}`
    } else {
      frontendUrl = `${siteUrl}/insights/${targetSlug}?preview=true&draft=${article.id}`
    }

    return NextResponse.redirect(frontendUrl)
  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json(
      { error: 'Failed to load preview' },
      { status: 500 }
    )
  }
}