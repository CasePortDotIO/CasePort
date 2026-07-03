import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GuideSpokePage, guideSpokeMeta } from '@/components/accidents-pages/GuideSpokePage'
import { guideSpokeDefs } from '@/data'

type Params = {
  spoke: string
}

const SPOKE_SLUGS = guideSpokeDefs.map((s) => s.slug)

// car-accidents → car-accident (singular) for static data lookup
const SLUG_MAP: Record<string, string> = {
  'car-accidents': 'car-accident',
}

export function generateStaticParams() {
  return SPOKE_SLUGS.map((spoke) => ({ spoke }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { spoke } = await params
  if (!SPOKE_SLUGS.includes(spoke)) return {}
  const pillarSlug = SLUG_MAP['car-accidents'] ?? 'car-accidents'
  const meta = guideSpokeMeta(pillarSlug, spoke)
  if (!meta) return {}
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/guides/car-accidents/spoke/${spoke}` },
  }
}

export default async function CarAccidentsSpokePage({ params }: { params: Promise<Params> }) {
  const { spoke } = await params
  if (!SPOKE_SLUGS.includes(spoke)) notFound()
  const pillarSlug = SLUG_MAP['car-accidents'] ?? 'car-accidents'
  return <GuideSpokePage pillarSlug={pillarSlug} spokeSlug={spoke} />
}
