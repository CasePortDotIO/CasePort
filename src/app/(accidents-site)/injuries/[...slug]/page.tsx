import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { InjuryTypePage, injuryTypeMeta } from '@/components/accidents-pages/InjuryTypePage'
import { InjuryArticlePage, injuryArticleMeta } from '@/components/accidents-pages/InjuryArticlePage'
import {
  DelayedSymptomsPage,
  delayedSymptomsMeta,
  WhenToSeeDoctorPage,
  whenToSeeDoctorMeta,
} from '@/components/accidents-pages/StandaloneInjuryPages'

export const dynamicParams = true

// Spoke slugs that correspond to the 4 injury article spoke types
const INJURY_SPOKE_TYPES = ['symptoms', 'treatment', 'recovery-timeline', 'settlement-factors']

type Resolved =
  | { kind: 'delayed' }
  | { kind: 'whenToSee' }
  | { kind: 'type'; slug: string }
  | { kind: 'spoke'; injSlug: string; spokeType: string }

function resolve(slug: string[]): Resolved | null {
  if (slug.length === 1) {
    const a = slug[0]
    if (a === 'delayed-symptoms-after-car-accident') return { kind: 'delayed' }
    if (a === 'when-to-see-doctor-after-accident') return { kind: 'whenToSee' }
    return { kind: 'type', slug: a }
  } else if (slug.length === 2) {
    const [injSlug, spokeType] = slug
    if (INJURY_SPOKE_TYPES.includes(spokeType)) return { kind: 'spoke', injSlug, spokeType }
  }
  return null
}

async function fetchInjuryType(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'injuryTypes',
    where: { slug: { equals: slug } },
    depth: 1,
    draft: false,
  })
  return docs[0] ?? null
}

async function fetchInjuryArticle(injSlug: string, spokeType: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'injuryArticles',
    where: {
      'injuryType.slug': { equals: injSlug },
      spokeType: { equals: spokeType },
    },
    depth: 1,
    draft: false,
  })
  return docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const params: { slug: string[] }[] = [
    { slug: ['delayed-symptoms-after-car-accident'] },
    { slug: ['when-to-see-doctor-after-accident'] },
  ]

  // Injury type pages and their spoke pages
  const { docs: injuryTypes } = await payload.find({
    collection: 'injuryTypes',
    limit: 1000,
    depth: 0,
    select: { slug: true },
  })

  for (const doc of injuryTypes) {
    if (doc.slug) {
      params.push({ slug: [doc.slug] })
      for (const spoke of INJURY_SPOKE_TYPES) {
        params.push({ slug: [doc.slug, spoke] })
      }
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const r = resolve(slug)

  if (r?.kind === 'delayed') {
    return { title: delayedSymptomsMeta.title, description: delayedSymptomsMeta.description, alternates: { canonical: delayedSymptomsMeta.canonical } }
  }
  if (r?.kind === 'whenToSee') {
    return { title: whenToSeeDoctorMeta.title, description: whenToSeeDoctorMeta.description, alternates: { canonical: whenToSeeDoctorMeta.canonical } }
  }
  if (r?.kind === 'type') {
    const injuryType = await fetchInjuryType(r.slug)
    if (!injuryType) return {}
    const meta = injuryTypeMeta(injuryType)
    return { title: meta?.title, description: meta?.description, alternates: { canonical: meta?.canonical } }
  }
  if (r?.kind === 'spoke') {
    const article = await fetchInjuryArticle(r.injSlug, r.spokeType)
    if (!article) return {}
    const meta = injuryArticleMeta(article)
    return { title: meta?.title, description: meta?.description, alternates: { canonical: meta?.canonical } }
  }

  return {}
}

export default async function InjuriesCatchAll({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const r = resolve(slug)

  if (!r) notFound()

  switch (r.kind) {
    case 'delayed':
      return <DelayedSymptomsPage />
    case 'whenToSee':
      return <WhenToSeeDoctorPage />
    case 'type': {
      const injuryType = await fetchInjuryType(r.slug)
      if (!injuryType) notFound()
      // Fetch all injury types for the "Other Injuries" section
      const payload = await getPayload({ config: configPromise })
      const { docs: allInjuryTypes } = await payload.find({
        collection: 'injuryTypes',
        limit: 100,
        depth: 0,
        select: { id: true, slug: true, title: true, icon: true, category: true },
      })
      return <InjuryTypePage injuryType={injuryType} allInjuryTypes={allInjuryTypes} />
    }
    case 'spoke': {
      const article = await fetchInjuryArticle(r.injSlug, r.spokeType)
      if (!article) notFound()
      return <InjuryArticlePage article={article} />
    }
  }
}
