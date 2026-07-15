import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: 'car-accident-what-to-do' } }, limit: 1 })
  const doc = r.docs[0] as any
  console.log('Title:', doc.title)
  console.log('Blocks count:', doc.blocks?.length ?? 0)
  console.log('Block types:', doc.blocks?.map((b: any) => b.blockType))
}

run().catch(e => { console.error(e.message); process.exit(1) })
