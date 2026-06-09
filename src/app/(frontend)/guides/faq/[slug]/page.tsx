import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import FAQGuideClient from './FAQGuideClient'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'

  const { docs } = await payload.find({
    collection: 'guideArticles',
    where: { AND: [{ slug: { equals: slug } }, { pageType: { equals: 'faq' } }] },
    depth: 1,
    limit: 1,
  })

  const article: any = docs[0]

  return {
    title: article?.metaTitle ?? article?.title ?? 'FAQ | CasePort',
    description: article?.metaDescription ?? article?.excerpt ?? 'Frequently asked questions about personal injury claims.',
    alternates: { canonical: `${siteUrl}/guide/faq/${slug}` },
    openGraph: {
      title: article?.socialHeadline ?? article?.title ?? 'FAQ | CasePort',
      description: article?.socialDescription ?? article?.excerpt ?? 'Frequently asked questions about personal injury claims.',
      url: `${siteUrl}/guide/faq/${slug}`,
      type: 'website',
    },
  }
}

export default async function FAQGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const [{ docs }, navData] = await Promise.all([
    payload.find({
      collection: 'guideArticles',
      where: { AND: [{ slug: { equals: slug } }, { pageType: { equals: 'faq' } }, { _status: { equals: 'published' } }] },
      depth: 2,
      limit: 1,
    }),
    fetchNavData(),
  ])

  const article = docs[0]

  if (!article) notFound()

  return <FAQGuideClient article={article} {...navData} />
}