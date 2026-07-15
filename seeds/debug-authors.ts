import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  // Check authors
  const authors = await payload.find({ collection: 'authors', limit: 5 })
  console.log('Authors:', authors.totalDocs)
  authors.docs.forEach((a: any) => console.log('  -', a.name || a.id))

  // Check all categories and their block counts
  const cats = await payload.find({ collection: 'guideCategories', limit: 20 })
  console.log('\nAll categories:')
  cats.docs.forEach((c: any) => console.log(`  ${c.slug} | blocks: ${c.blocks?.length ?? 0}`))
}
run().catch(console.error)
