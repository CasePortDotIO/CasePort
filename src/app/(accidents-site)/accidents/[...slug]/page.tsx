/**
 * /accidents/[...slug]/page.tsx
 *
 * CMS-driven catch-all for /accidents/*
 * All pages are stored in the `accidentPages` collection with a `fullSlug` field.
 *
 * URL → fullSlug mapping:
 *   /accidents/car-accident                         → "car-accident"
 *   /accidents/va                                  → "va"
 *   /accidents/va/statute-of-limitations           → "va/statute-of-limitations"
 *   /accidents/va/richmond/car-accident            → "va/richmond/car-accident"
 *   /accidents/resources                            → "resources"
 */

import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { AccidentPageTypePage } from '@/components/accidents-pages/AccidentPageTypePage'

export const dynamicParams = true

type Params = {
  slug: string[]
}

async function fetchPage(fullSlug: string, isPreview: boolean) {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'accidentPages',
    where: { fullSlug: { equals: fullSlug } },
    depth: 1,
    draft: isPreview,
  })

  return docs[0] ?? null
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<{ preview?: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const sp = await searchParams
  const isPreview = sp.preview === 'true'

  const doc = await fetchPage(slug.join('/'), isPreview)
  if (!doc) return {}

  const docAny = doc as any
  return {
    title: docAny.metaTitle || docAny.title || '',
    description: docAny.metaDescription || '',
    alternates: { canonical: `/accidents/${slug.join('/')}` },
  }
}

export default async function AccidentsDynamicPage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const isPreview = sp.preview === 'true'

  const doc = await fetchPage(slug.join('/'), isPreview)
  if (!doc) notFound()

  const docAny = doc as any

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
          <a
            href={`/accidents/${slug.join('/')}`}
            style={{ color: '#fff', marginLeft: '16px', textDecoration: 'underline' }}
          >
            Exit Preview
          </a>
        </div>
      )}
      <AccidentPageTypePage doc={docAny} />
    </>
  )
}
