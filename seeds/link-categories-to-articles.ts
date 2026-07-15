/**
 * link-categories-to-articles.ts
 *
 * For each guide category, finds its 4 spoke article IDs and adds/replaces
 * a categoryRelatedGuides block so the category page links to its articles.
 *
 * Run: npx tsx link-categories-to-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Pillar slug → article slugs (4 spokes each)
const CATEGORY_ARTICLE_MAP: Record<string, string[]> = {
  'car-accidents': [
    'car-accident-what-to-do',
    'car-accident-settlement-amounts',
    'car-accident-do-i-need-a-lawyer',
    'car-accident-statute-of-limitations',
  ],
  'truck-accidents': [
    'truck-accident-what-to-do',
    'truck-accident-settlement-amounts',
    'truck-accident-do-i-need-a-lawyer',
    'truck-accident-statute-of-limitations',
  ],
  'motorcycle-accidents': [
    'motorcycle-accident-what-to-do',
    'motorcycle-accident-settlement-amounts',
    'motorcycle-accident-do-i-need-a-lawyer',
    'motorcycle-accident-statute-of-limitations',
  ],
  'pedestrian-accidents': [
    'pedestrian-accident-what-to-do',
    'pedestrian-accident-settlement-amounts',
    'pedestrian-accident-do-i-need-a-lawyer',
    'pedestrian-accident-statute-of-limitations',
  ],
  'bicycle-accidents': [
    'bicycle-accident-what-to-do',
    'bicycle-accident-settlement-amounts',
    'bicycle-accident-do-i-need-a-lawyer',
    'bicycle-accident-statute-of-limitations',
  ],
  'rideshare-accidents': [
    'rideshare-accident-what-to-do',
    'rideshare-accident-settlement-amounts',
    'rideshare-accident-do-i-need-a-lawyer',
    'rideshare-accident-statute-of-limitations',
  ],
  'slip-and-fall': [
    'slip-and-fall-what-to-do',
    'slip-and-fall-settlement-amounts',
    'slip-and-fall-do-i-need-a-lawyer',
    'slip-and-fall-statute-of-limitations',
  ],
  'dog-bites': [
    'dog-bite-what-to-do',
    'dog-bite-settlement-amounts',
    'dog-bite-do-i-need-a-lawyer',
    'dog-bite-statute-of-limitations',
  ],
  'workplace-injuries': [
    'workplace-injury-what-to-do',
    'workplace-injury-settlement-amounts',
    'workplace-injury-do-i-need-a-lawyer',
    'workplace-injury-statute-of-limitations',
  ],
  'wrongful-death': [
    'wrongful-death-what-to-do',
    'wrongful-death-settlement-amounts',
    'wrongful-death-do-i-need-a-lawyer',
    'wrongful-death-statute-of-limitations',
  ],
  'medical-malpractice': [
    'medical-malpractice-what-to-do',
    'medical-malpractice-settlement-amounts',
    'medical-malpractice-do-i-need-a-lawyer',
    'medical-malpractice-statute-of-limitations',
  ],
}

async function getArticleIds(payload: any, slugs: string[]): Promise<number[]> {
  const ids: number[] = []
  for (const slug of slugs) {
    const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
    if (r.docs[0]?.id) ids.push(r.docs[0].id)
    else console.warn(`  ⚠️  Article not found: ${slug}`)
  }
  return ids
}

async function run() {
  console.log('🔗 Linking guide categories to their spoke articles...\n')
  const payload = await getPayload({ config })

  for (const [categorySlug, articleSlugs] of Object.entries(CATEGORY_ARTICLE_MAP)) {
    // Get category
    const catR = await payload.find({ collection: 'guideCategories', where: { slug: { equals: categorySlug } }, limit: 1 })
    if (!catR.docs[0]) {
      console.warn(`  ⚠️  Category not found: ${categorySlug}`)
      continue
    }
    const catId = catR.docs[0].id

    // Get article IDs
    const articleIds = await getArticleIds(payload, articleSlugs)
    if (articleIds.length !== 4) {
      console.warn(`  ⚠️  ${categorySlug}: only got ${articleIds.length}/4 article IDs`)
    }

    // Build the related guides block
    const newBlock = { blockType: 'categoryRelatedGuides', articles: articleIds }

    // Get existing blocks on the category
    const catDoc = await payload.find({ collection: 'guideCategories', where: { slug: { equals: categorySlug } }, limit: 1, depth: 0 })
    const existingBlocks: any[] = catDoc.docs[0]?.blocks ?? []

    // Remove any existing categoryRelatedGuides block
    const filteredBlocks = existingBlocks.filter((b: any) => b.blockType !== 'categoryRelatedGuides')
    // Append the new one
    filteredBlocks.push(newBlock)

    await payload.update({
      collection: 'guideCategories',
      id: catId,
      data: { blocks: filteredBlocks },
    })

    console.log(`  ✅ ${categorySlug} → linked to ${articleIds.length} articles`)
  }

  console.log('\n✅ All categories linked to their spoke articles!')
}

run().catch(e => { console.error(e.message); process.exit(1) })
