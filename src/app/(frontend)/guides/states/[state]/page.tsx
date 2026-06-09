import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import StateGuideClient from './StateGuideClient'

export const revalidate = 3600

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>
}): Promise<Metadata> {
  const { state } = await params
  const payload = await getPayload({ config: configPromise })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'
  const stateName = STATE_NAMES[state.toUpperCase()] || state

  const { docs } = await payload.find({
    collection: 'guideArticles',
    where: { AND: [{ pageType: { equals: 'state' } }, { targetStates: { contains: state.toUpperCase() } }] },
    depth: 1,
    limit: 1,
  })

  const article: any = docs[0]

  return {
    title: article?.metaTitle ?? `Personal Injury Guide | ${stateName} | CasePort`,
    description: article?.metaDescription ?? `Learn about personal injury claims, statute of limitations, and settlement ranges in ${stateName}.`,
    alternates: { canonical: `${siteUrl}/guide/states/${state}` },
    openGraph: {
      title: article?.socialHeadline ?? `Personal Injury Guide | ${stateName} | CasePort`,
      description: article?.socialDescription ?? `Learn about personal injury claims in ${stateName}.`,
      url: `${siteUrl}/guide/states/${state}`,
      type: 'website',
    },
  }
}

export default async function StateGuidePage({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params
  const payload = await getPayload({ config: configPromise })
  const stateName = STATE_NAMES[state.toUpperCase()] || state

  const { docs } = await payload.find({
    collection: 'guideArticles',
    where: { AND: [{ pageType: { equals: 'state' } }, { targetStates: { contains: state.toUpperCase() } }] },
    depth: 2,
    limit: 1,
  })

  const article = docs[0]

  if (!article) notFound()

  const navData = await fetchNavData()

  return <StateGuideClient article={article} stateName={stateName} stateCode={state.toUpperCase()} {...navData} />
}