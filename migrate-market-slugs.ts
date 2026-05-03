/**
 * migrate-market-slugs.ts
 *
 * One-time migration: appends -personal-injury-leads to all existing market slugs
 * that don't already have it.
 *
 * Run: npx tsx migrate-market-slugs.ts
 */

import dotenv from 'dotenv'
dotenv.config()

import { getPayload } from 'payload'
import config from './src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  const { docs: markets } = await payload.find({
    collection: 'markets',
    limit: 200,
    depth: 0,
  })

  console.log(`Found ${markets.length} markets. Migrating slugs...\n`)

  let updated = 0
  let skipped = 0

  for (const market of markets) {
    const currentSlug = market.slug as string

    if (currentSlug.endsWith('-personal-injury-leads')) {
      console.log(`  ⟳  Already migrated: ${currentSlug}`)
      skipped++
      continue
    }

    const newSlug = `${currentSlug}-personal-injury-leads`

    await payload.update({
      collection: 'markets',
      id: market.id,
      data: { slug: newSlug },
    })

    console.log(`  ✓  ${currentSlug} → ${newSlug}`)
    updated++
  }

  console.log(`\nDone. Updated: ${updated}  Skipped: ${skipped}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
