import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { GuideCategoryClient } from '@/components/accidents-pages/GuideCategoryClient'

type Params = {
  category: string
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'guideCategories',
    limit: 100,
    pagination: false,
  })
  return docs.map((doc) => ({ category: doc.slug as string }))
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
    collection: 'guideCategories',
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
      canonical: `/guides/${category}`,
    },
  }
}

export default async function GuideCategoryRoute({ params, searchParams }: {
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
    collection: 'guideCategories',
    where: query,
    depth: 2,
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
          <a href={`/guides/${category}`} style={{ color: '#fff', marginLeft: '16px', textDecoration: 'underline' }}>
            Exit Preview
          </a>
        </div>
      )}
      <GuideCategoryClient category={doc as any} />
    </>
  )
}
