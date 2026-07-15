import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  console.log('connected')
  const r = await payload.find({ collection: 'guideArticles', limit: 5 })
  console.log('found:', r.totalDocs)
  r.docs.forEach((d: any) => console.log(d.slug, '|', (d.title||'').substring(0,50), '| blocks:', d.blocks?.length ?? 0))
}

run().catch(e => { console.error(e.message); process.exit(1) })