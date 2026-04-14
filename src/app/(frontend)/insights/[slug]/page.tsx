import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import ArticleClient from './ArticleClient'
import { fetchNavData } from '@/lib/navData'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    depth: 0,
  })
  const article = docs[0]
  if (!article) return {}

  const title = article.title as string
  const description = (article.excerpt as string | undefined) ?? ''

  return {
    title,
    description,
    alternates: { canonical: `https://www.caseport.io/insights/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.caseport.io/insights/${slug}`,
      type: 'article',
    },
  }
}

export default async function InsightsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const [{ docs }, navData] = await Promise.all([
    payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      depth: 1,
    }),
    fetchNavData(),
  ])

  const article = docs[0]

  if (!article) {
    notFound()
  }

  return <ArticleClient article={article} {...navData} />
}
