import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'guideArticles', limit: 5 })
  r.docs.forEach((d: any) => {
    const catSlug = d.guideCategory?.slug ?? 'MISSING'
    console.log(`${d.slug} -> category: ${catSlug}`)
  })
}

run().catch(e => { console.error(e.message); process.exit(1) })
