import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'guideArticles', limit: 100 })
  console.log('Found:', r.totalDocs, 'articles')

  for (const doc of r.docs) {
    await payload.update({
      collection: 'guideArticles',
      id: doc.id,
      data: { _status: 'published', _isSeeding: true },
    })
    console.log('Published:', doc.slug)
  }

  console.log('\nAll done!')
}

run().catch(e => { console.error(e.message); process.exit(1) })

