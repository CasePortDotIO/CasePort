import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function check() {
  const payload = await getPayload({ config: configPromise })

  // Check if there's a New York state article
  const nyArticle = await payload.find({
    collection: 'guideArticles',
    where: { AND: [{ pageType: { equals: 'state' } }, { targetStates: { contains: 'NY' } }] },
    limit: 1
  })
  console.log('New York state article:', nyArticle.docs.length > 0 ? nyArticle.docs[0].title : 'NOT FOUND')

  // Check all state articles
  const allState = await payload.find({
    collection: 'guideArticles',
    where: { pageType: { equals: 'state' } },
    limit: 10
  })
  console.log('\nAll state articles:', allState.docs.length)
  allState.docs.forEach((d: any) => console.log(' -', d.title, '| states:', d.targetStates))

  // Check for car accident articles
  const carAccident = await payload.find({
    collection: 'guideArticles',
    where: { slug: { contains: 'car-accident' } },
    limit: 5
  })
  console.log('\nCar accident articles:', carAccident.docs.length)
  carAccident.docs.forEach((d: any) => console.log(' -', d.title, '| pageType:', d.pageType, '| states:', d.targetStates))
}

check().catch(console.error)