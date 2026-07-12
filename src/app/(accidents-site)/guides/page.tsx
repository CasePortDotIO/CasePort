import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { GuideHubClient } from '@/components/accidents-pages/GuideHubClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Complete Guide to Injury Claims | CasePort',
  description:
    'National, attorney-reviewed guides to every accident type and every step of an injury claim.',
  alternates: { canonical: '/guides' },
}

export default async function GuideHubRoute() {
  const payload = await getPayload({ config: configPromise })

  // Fetch all guideCategories
  const { docs: categories } = await payload.find({
    collection: 'guideCategories',
    where: {
      hideFromSearchEngines: { not_equals: true },
    },
    sort: 'displayOrder',
    limit: 100,
    depth: 0,
  })

  return <GuideHubClient categories={categories as any} />
}
