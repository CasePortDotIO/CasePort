import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'guideArticles', limit: 100 })
  r.docs.forEach((d: any) => console.log(d.slug + ' | blocks:' + ((d.blocks as any[])?.length ?? 0)))
  console.log('TOTAL:', r.totalDocs)
}

run().catch(e => {
  console.error(e.message)
  process.exit(1)
})
