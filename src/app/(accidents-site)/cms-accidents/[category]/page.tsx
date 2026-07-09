import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { AccidentCategoryClient } from '@/components/accidents-pages/AccidentCategoryClient'

type Params = {
  category: string
}

export async function generateMetadata({ params, searchParams }: {
  params: Promise<Params>
  searchParams: Promise<{ preview?: string }>
}): Promise<Metadata> {
  const { category } = await params
  const sp = await searchParams
  const isPreview = sp.preview === 'true'
  const payload = await getPayload({ config: configPromise })

  const query: any = isPreview
    ? { slug: { equals: category } }
    : { slug: { equals: category } }

  const { docs } = await payload.find({
    collection: 'accidentCategories',
    where: query,
    depth: 1,
  })

  const doc = docs[0]
  if (!doc) return {}

  const title = (doc as any).metaTitle || doc.title || ''
  const description = (doc as any).metaDescription || (doc as any).description || ''

  return {
    title,
    description,
    alternates: {
      canonical: `/cms-accidents/${category}`,
    },
  }
}

export default async function CmsAccidentCategoryRoute({ params, searchParams }: {
  params: Promise<Params>
  searchParams: Promise<{ preview?: string }>
}) {
  const { category } = await params
  const sp = await searchParams
  const isPreview = sp.preview === 'true'
  const payload = await getPayload({ config: configPromise })

  const query: any = isPreview
    ? { slug: { equals: category } }
    : { slug: { equals: category } }

  const { docs } = await payload.find({
    collection: 'accidentCategories',
    where: query,
    depth: 2,
    draft: isPreview,
  })

  const doc = docs[0]

  // When in preview mode, check that the draft is published
  if (isPreview && doc) {
    const { docs: publishedDocs } = await payload.find({
      collection: 'accidentCategories',
      where: {
        slug: { equals: category },
        _status: { equals: 'published' },
      },
      depth: 2,
    })
    if (publishedDocs.length === 0) {
      notFound()
    }
  }

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
          <a href={`/cms-accidents/${category}`} style={{ color: '#fff', marginLeft: '16px', textDecoration: 'underline' }}>
            Exit Preview
          </a>
        </div>
      )}
      <AccidentCategoryClient category={doc as any} />
    </>
  )
}
