/**
 * Seed script for SiteLinks collection.
 * Run: npx tsx seed-site-links.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const SITE_LINKS = [
  { name: 'Home', url: '/' },
  { name: 'Request Access', url: '/request-access' },
  { name: 'Check My Case', url: '/checkmycase' },
  { name: 'Insights', url: '/insights' },
  { name: 'Intelligence', url: '/intelligence' },
  { name: 'Intelligence Thank You', url: '/intelligence/thank-you' },
  { name: 'Markets', url: '/markets' },
  { name: 'Personal Injury Leads', url: '/personal-injury-leads' },
  { name: 'Injured', url: '/injured' },
  { name: 'All Guides', url: '/guides' },
  { name: 'Guide Category', url: '/guides/[category]' },
  { name: 'Individual Guide', url: '/guides/[category]/[slug]' },
  { name: 'State Guide', url: '/guides/states/[state]' },
  { name: 'City Guide', url: '/guides/cities/[city]' },
  { name: 'FAQ Guide', url: '/guides/faq/[slug]' },
]

const run = async () => {
  const payload = await getPayload({ config })

  for (const link of SITE_LINKS) {
    // Check if already exists
    const existing = await payload.find({
      collection: 'siteLinks',
      where: { url: { equals: link.url } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  Skipping "${link.name}" — already exists`)
      continue
    }

    await payload.create({
      collection: 'siteLinks',
      data: {
        name: link.name,
        url: link.url,
      },
    })
    console.log(`  Created "${link.name}" → ${link.url}`)
  }

  console.log('\nSiteLinks seeded successfully!')
}

run().catch(console.error)
