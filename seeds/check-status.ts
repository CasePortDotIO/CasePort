import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'guideArticles', limit: 3 })
  r.docs.forEach((d: any) => console.log(d.slug, '| status:', d._status))
}

run().catch(e => { console.error(e.message); process.exit(1) })
