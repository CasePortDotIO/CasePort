import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { GuideArticleClient } from '@/components/accidents-pages/GuideArticleClient'

type Params = {
  category: string
  slug: string
}

export async function generateMetadata({ params, searchParams }: {
  params: Promise<Params>
  searchParams: Promise<{ preview?: string }>
}): Promise<Metadata> {
  const { category, slug } = await params
  const sp = await searchParams
  const isPreview = sp.preview === 'true'
  const payload = await getPayload({ config: configPromise })

  const query: any = isPreview
    ? { slug: { equals: slug } }
    : { slug: { equals: slug }, _status: { equals: 'published' } }

  const { docs } = await payload.find({
    collection: 'guideArticles',
    where: query,
    depth: 1,
    draft: isPreview,
  })

  const doc = docs[0]
  if (!doc) return {}

  const title = (doc as any).metaTitle || doc.title || ''
  const description = (doc as any).metaDescription || (doc as any).excerpt || ''

  return {
    title,
    description,
    alternates: {
      canonical: `/guides/${category}/${slug}`,
    },
  }
}

export default async function GuideArticleRoute({ params, searchParams }: {
  params: Promise<Params>
  searchParams: Promise<{ preview?: string }>
}) {
  const { category, slug } = await params
  const sp = await searchParams
  const isPreview = sp.preview === 'true'
  const payload = await getPayload({ config: configPromise })

  const query: any = isPreview
    ? { slug: { equals: slug } }
    : { slug: { equals: slug }, _status: { equals: 'published' } }

  const { docs } = await payload.find({
    collection: 'guideArticles',
    where: query,
    depth: 1,
    draft: isPreview,
  })

  const doc = docs[0]
  if (!doc) notFound()

  return (
    <>
      {isPreview && (
        <div style={{
          background: '#5BB6C9',
          color: '#fff',
          padding: '10px 20px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 600,
          position: 'sticky',
          top: 0,
          zIndex: 9999,
        }}>
          Preview Mode — Draft Content
          <a href={`/guides/${category}/${slug}`} style={{ color: '#fff', marginLeft: '16px', textDecoration: 'underline' }}>
            Exit Preview
          </a>
        </div>
      )}
      <GuideArticleClient
        article={doc as any}
        categorySlug={category}
      />
    </>
  )
}
