import { getPayload } from 'payload'
import config from './src/payload.config.js'

async function seed() {
  const payload = await getPayload({ config })

  const categories = [
    'For Law Firms',
    'Auto Accident Cases',
    'Claimant Education',
    'Case Acquisition Strategy',
    'PI Industry Intelligence',
    'Intake Excellence',
    'Lead Economics',
    'Platform Updates',
  ]

  for (const name of categories) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    try {
      const existing = await payload.find({
        collection: 'categories',
        where: { title: { equals: name } },
      })

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'categories',
          data: {
            title: name,
            slug: slug,
          },
        })
        console.log(`Created category: ${name}`)
      } else {
        console.log(`Category already exists: ${name}`)
      }
    } catch (e: any) {
      console.error('Error creating category:', name, e.message)
    }
  }

  console.log('Done!')
  process.exit(0)
}

seed()
