import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  // Check one of each spoke type
  const slugs = [
    'car-accident-what-to-do-after',
    'car-accident-settlement-amounts',
    'car-accident-do-i-need-a-lawyer',
    'car-accident-statute-of-limitations',
    'medical-malpractice-what-to-do-after',
    'medical-malpractice-settlement-amounts',
  ]

  for (const slug of slugs) {
    const r = await payload.find({
      collection: 'guideArticles',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (r.docs[0]) {
      const doc = r.docs[0]
      console.log(`\n=== ${slug} ===`)
      console.log(`Title: ${doc.title}`)
      console.log(`Category: ${(doc.guideCategory as any)?.slug}`)
      console.log(`Blocks: ${(doc.blocks as any[])?.length}`)
      ;(doc.blocks as any[])?.forEach((b: any, i: number) => {
        console.log(`  [${i}] ${b.blockType}`)
        if (b.blockType === 'articleDirectAnswer') console.log('   heading:', b.heading?.slice(0, 80))
        if (b.blockType === 'articleFAQ') console.log('   FAQ items:', b.items?.length)
        if (b.blockType === 'articleKeyTakeaways') console.log('   takeaways:', b.items?.length)
        if (b.blockType === 'articleProseContent') console.log('   sections:', b.sections?.length)
        if (b.blockType === 'articleSources') console.log('   citeTitle:', b.citeTitle, 'sources:', b.sources?.length)
        if (b.blockType === 'articleRelatedGuides') console.log('   related:', b.articles?.length)
        if (b.blockType === 'articleExpert') console.log('   reviewer:', b.reviewerName)
      })
    } else {
      console.log(`\n=== ${slug} === NOT FOUND`)
    }
  }
}

run().catch(e => { console.error(e.message); process.exit(1) })
