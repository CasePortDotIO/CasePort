import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  const SLUGS = [
    'car-accident-what-to-do',
    'car-accident-settlement-amounts',
    'car-accident-do-i-need-a-lawyer',
    'car-accident-statute-of-limitations',
  ]

  console.log('Checking car-accident articles...\n')
  for (const slug of SLUGS) {
    const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
    const doc = r.docs[0] as any
    if (doc) {
      console.log(`✅ ${slug}`)
      console.log(`   Title: ${doc.title}`)
      console.log(`   Blocks: ${doc.blocks?.length ?? 0}`)
    } else {
      console.log(`❌ ${slug} — NOT FOUND`)
    }
  }
}

run().catch(e => { console.error(e.message); process.exit(1) })
