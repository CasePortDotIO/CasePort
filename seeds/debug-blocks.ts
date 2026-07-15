import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'guideCategories', limit: 3 })
  console.log('Total categories:', r.totalDocs)
  for (const doc of r.docs) {
    console.log(doc.slug, '| blocks:', doc.blocks?.length ?? 0)
    if (doc.blocks?.length) {
      doc.blocks.forEach((b: any, i: number) => {
        const preview = JSON.stringify(b).slice(0, 120)
        console.log(`  block ${i}: ${b.blockType} — ${preview}`)
      })
    }
  }
}
run().catch(console.error)
