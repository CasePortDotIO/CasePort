import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

type CollectionSlug = 'articles' | 'guideArticles' | 'accidentPages'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const slug = searchParams.get('slug')
  const id = searchParams.get('id')
  const collectionParam = searchParams.get('collection') || 'accidentPages'

  if (!slug && !id) {
    return NextResponse.json(
      { error: 'Missing slug or id parameter' },
      { status: 400 }
    )
  }

  const collectionSlug: CollectionSlug =
    collectionParam === 'accidentPages' ? 'accidentPages'
    : collectionParam === 'guideArticles' ? 'guideArticles'
    : 'articles'

  try {
    const payload = await getPayload({ config })

    let doc: any
    if (id) {
      doc = await payload.findByID({
        collection: collectionSlug,
        id,
        draft: true,
      })
    } else {
      const result = await payload.find({
        collection: collectionSlug,
        where: { fullSlug: { equals: slug } },
        draft: true,
        limit: 1,
      })
      if (!result.docs.length) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 })
      }
      doc = result.docs[0]
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin
    let frontendUrl: string

    if (collectionSlug === 'accidentPages') {
      frontendUrl = `${siteUrl}/accidents/${doc.fullSlug}?preview=true`
    } else if (collectionSlug === 'guideArticles') {
      const categorySlug = doc.guideCategory?.slug || doc.guideCategory
      frontendUrl = `${siteUrl}/guides/${categorySlug}/${doc.slug}?preview=true&draft=${doc.id}`
    } else {
      frontendUrl = `${siteUrl}/insights/${doc.slug}?preview=true&draft=${doc.id}`
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
