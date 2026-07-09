'use client'

import { AccidentCategoryClient } from './AccidentCategoryClient'

type AccidentArticle = {
  title: string
  slug: string
  excerpt?: string
  blocks?: any[]
  heroImage?: { url: string }
  subtitle?: string
  breadcrumbTitle?: string
  updatedAt?: string
  author?: { name?: string; title?: string }
  accidentCategory?: {
    slug: string
    title: string
  }
}

export function AccidentArticleClient({
  article,
  categorySlug,
}: {
  article: AccidentArticle
  categorySlug: string
}) {
  return (
    <AccidentCategoryClient
      category={{
        id: article.slug,
        title: article.accidentCategory?.title || article.title,
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
