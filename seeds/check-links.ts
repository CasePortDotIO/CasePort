import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  const SLUGS = [
    'car-accidents', 'truck-accidents', 'motorcycle-accidents', 'pedestrian-accidents',
    'bicycle-accidents', 'rideshare-accidents', 'slip-and-fall', 'dog-bites',
    'workplace-injuries', 'wrongful-death', 'medical-malpractice',
  ]

  console.log('Checking category → article links...\n')
  for (const slug of SLUGS) {
    const r = await payload.find({ collection: 'guideCategories', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
    const blocks: any[] = r.docs[0]?.blocks ?? []
    const related = blocks.filter((b: any) => b.blockType === 'categoryRelatedGuides')
    if (related[0]?.articles?.length === 4) {
      console.log(`✅ ${slug} → ${related[0].articles.length} articles linked`)
    } else {
      console.log(`❌ ${slug} → blocks: ${blocks.length}, related: ${related.length}`)
    }
  }
}

run().catch(e => { console.error(e.message); process.exit(1) })
