'use client'

import { GuideCategoryClient } from './GuideCategoryClient'

type Article = {
  title: string
  slug: string
  excerpt?: string
  blocks?: any[]
  heroImage?: { url: string }
  subtitle?: string
  breadcrumbTitle?: string
  updatedAt?: string
  author?: { name?: string; title?: string }
  guideCategory?: {
    slug: string
    title: string
  }
}

export function GuideArticleClient({
  article,
  categorySlug,
}: {
  article: Article
  categorySlug: string
}) {
  return (
    <GuideCategoryClient
      category={{
        id: article.slug,
        title: article.guideCategory?.title || article.title,
        slug: categorySlug,
        blocks: article.blocks || [],
        heroImage: article.heroImage,
        heroTitle: article.title,
        heroSubtitle: article.subtitle || article.excerpt,
        updatedAt: article.updatedAt,
        breadcrumbTitle: article.breadcrumbTitle,
        articleTitle: article.title,
      }}
    />
  )
}