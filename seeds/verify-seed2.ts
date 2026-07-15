import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'guideCategories', limit: 20 })
  console.log('Total: ' + r.totalDocs)
  for (const doc of r.docs) {
    console.log(doc.slug + ': ' + (doc.blocks?.length ?? 0) + ' blocks')
    if (doc.blocks?.length) {
      doc.blocks.forEach((b: any, i: number) => console.log('  [' + i + '] ' + b.blockType))
    }
  }
}
run().catch(console.error)
