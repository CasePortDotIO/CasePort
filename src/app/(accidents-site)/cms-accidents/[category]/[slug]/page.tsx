import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { AccidentArticleClient } from '@/components/accidents-pages/AccidentArticleClient'

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

  const { docs } = await payload.find({
    collection: 'accidentArticles',
    where: {
      and: [
        { slug: { equals: slug } },
        { 'accidentCategory.slug': { equals: category } },
      ],
    },
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
      canonical: `/cms-accidents/${category}/${slug}`,
    },
  }
}

export default async function CmsAccidentArticleRoute({ params, searchParams }: {
  params: Promise<Params>
  searchParams: Promise<{ preview?: string }>
}) {
  const { category, slug } = await params
  const sp = await searchParams
  const isPreview = sp.preview === 'true'
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'accidentArticles',
    where: {
      and: [
        { slug: { equals: slug } },
        { 'accidentCategory.slug': { equals: category } },
      ],
    },
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
          <a href={`/cms-accidents/${category}/${slug}`} style={{ color: '#fff', marginLeft: '16px', textDecoration: 'underline' }}>
            Exit Preview
          </a>
        </div>
      )}
      <AccidentArticleClient
        article={doc as any}
        categorySlug={category}
      />
    </>
  )
}
