/**
 * seed-pedestrian-accidents-articles.ts
 * Run: npx tsx seed-pedestrian-accidents-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const REF = {
  title: 'Pedestrian Accident Claims: Vulnerable Road User Protection',
  directAnswer: 'Pedestrian accidents result in severe injuries and death because pedestrians have no protection from vehicle impact. Average pedestrian accident settlements range from $50,000 to $400,000+ depending on injury severity and liability. Many jurisdictions apply different negligence standards to vulnerable road users, providing additional protection. Pedestrian accidents are often clear liability cases because drivers have a duty to avoid hitting pedestrians.',
  keyFacts: [
    'Pedestrians have no protection from vehicle impact, resulting in severe injuries',
    'Many jurisdictions apply vulnerable user standards to pedestrians',
    'Drivers have a duty to avoid hitting pedestrians, even if pedestrians are partially at fault',
    'Pedestrian accident liability is often clear because drivers should see and avoid pedestrians',
    'Surveillance footage from nearby businesses and traffic cameras is often available',
  ],
  sections: [
    {
      title: 'Vulnerable User Standards Protect Pedestrians',
      content: [
        'Many jurisdictions apply vulnerable user standards to pedestrians, cyclists, and motorcyclists. These standards recognize that vulnerable road users deserve additional protection because they have no vehicle protection.',
        'Under vulnerable user standards, drivers must exercise extra care to avoid hitting vulnerable road users. Even if the pedestrian is partially at fault, the driver may still be liable if they failed to exercise reasonable care.',
        'Vulnerable user standards shift the burden of care to drivers. Drivers must anticipate pedestrian behavior and take steps to avoid collision.',
      ],
    },
    {
      title: 'Why Pedestrian Accidents Result in Severe Injuries',
      content: [
        'Pedestrians have no protection from vehicle impact. When a vehicle hits a pedestrian, the pedestrian absorbs all the impact energy.',
        'Pedestrian accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, and death.',
        'Pedestrian accident injuries depend on vehicle speed. A pedestrian struck at 20 mph has a 90% survival rate. A pedestrian struck at 40 mph has only a 10% survival rate.',
      ],
    },
    {
      title: 'Proving Liability in Pedestrian Accidents',
      content: [
        'Pedestrian accident liability is often clear because drivers have a duty to avoid hitting pedestrians. Even if the pedestrian is jaywalking, the driver should see and avoid them.',
        'Surveillance footage from nearby businesses, traffic cameras, and ATMs is often available in pedestrian accidents.',
        "Witness testimony is also valuable. Pedestrians often have witnesses who saw the accident.",
      ],
    },
    {
      title: 'Medical Documentation and Long-Term Impact',
      content: [
        'Pedestrian accident injuries often result in permanent disability, chronic pain, and reduced quality of life.',
        'Pedestrian accidents often result in multiple surgeries, extended hospitalization, and long-term rehabilitation.',
        "Follow your doctor's treatment recommendations exactly. Pedestrian accident injuries often require ongoing treatment and rehabilitation.",
      ],
    },
  ],
  faqs: [
    { q: 'What are vulnerable user standards in pedestrian accidents?', a: 'Vulnerable user standards hold drivers to a heightened duty of care around pedestrians, cyclists, and motorcyclists. Even if a pedestrian is partially at fault, the driver may still be liable.' },
    { q: 'How is liability determined in pedestrian accidents?', a: 'Drivers have a duty to avoid hitting pedestrians. Liability is often clear because drivers should see and avoid pedestrians.' },
    { q: 'What surveillance footage is available after a pedestrian accident?', a: 'Footage may be available from nearby businesses, traffic cameras, ATMs, doorbell cameras, and city buses. This footage is typically overwritten within 72 hours.' },
    { q: 'What should I do immediately after being hit by a car as a pedestrian?', a: 'Seek medical attention first, even if injuries seem minor. Then photograph the scene, collect witness information, request a police report, and preserve any available surveillance footage within 72 hours.' },
  ],
}

const EXPERT = { reviewerName: 'Diana L. Chen', credentials: 'Pedestrian Safety & Injury Law | Published: Texas Pedestrian Injury Patterns', quote: "In 70% of pedestrian cases I've reviewed, the surveillance footage tells the whole story. The problem is people don't ask for it until it's gone." }
const SOURCES = { citeTitle: 'Pedestrian Accident Guide', sources: [{ name: 'National Highway Traffic Safety Administration (NHTSA) — Pedestrians', url: 'https://www.nhtsa.gov/road-safety/pedestrian-safety' }, { name: 'Governors Highway Safety Association (GHSA)', url: 'https://www.ghsa.org/' }, { name: 'Smart Growth America — Dangerous By Design', url: 'https://smartgrowthamerica.org/' }] }

const PILLAR = 'pedestrian-accident'
const CATEGORY_SLUG = 'pedestrian-accidents'
const PILLAR_NAME = 'Pedestrian Accident'

const SPOKES = [
  { slug: 'what-to-do', label: 'What To Do After' },
  { slug: 'settlement-amounts', label: 'Settlement Amounts' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer' },
  { slug: 'statute-of-limitations', label: 'How Long to File' },
] as const

async function upsert(payload: any, slug: string, title: string, authorId: number, categoryId: number) {
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  const data = { title, slug, subtitle: 'Pedestrian accident claim guidance.', focusKeyword: `pedestrian accident ${slug.split('-').pop()?.replace(/-/g, ' ')}`, secondaryKeywords: [{ keyword: 'pedestrian accident settlement' }, { keyword: 'how to file a pedestrian accident claim' }], metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155), schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId }
  if (r.docs[0]) await payload.update({ collection: 'guideArticles', id: r.docs[0].id, data })
  else await payload.create({ collection: 'guideArticles', data })
}

function makeBlocks(id: number, spoke: string, otherIds: number[]) {
  const b: any[] = []
  b.push({ blockType: 'articleDirectAnswer', heading: spoke === 'what-to-do' ? `What To Do After a ${PILLAR_NAME}` : REF.title, text: spoke === 'what-to-do' ? 'The first 72 hours after a pedestrian accident are critical. Here is what you need to do.' : REF.directAnswer })
  b.push({ blockType: 'articleKeyTakeaways', items: REF.keyFacts.map(f => ({ fact: f })) })
  b.push({ blockType: 'articleFAQ', items: REF.faqs.map(f => ({ question: f.q, answerText: f.a })) })
  b.push({ blockType: 'articleSources', citeTitle: SOURCES.citeTitle, sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })) })
  b.push({ blockType: 'articleExpert', quote: EXPERT.quote, reviewerName: EXPERT.reviewerName, credentials: EXPERT.credentials })
  b.push({ blockType: 'articleCTA', title: 'Get a Free Case Review', subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.', buttonLabel: 'Check My Case', buttonLink: '/checkmycase' })
  if (spoke === 'what-to-do') b.push({ blockType: 'articleTimelineSteps', heading: `${PILLAR_NAME} — Step by Step`, steps: REF.sections.map((s, i) => ({ stepName: `${i + 1}. ${s.title}`, stepDescription: s.content[0] ?? '' })), note: 'Step order reflects the most important actions in the first 72 hours after a pedestrian accident.' })
  else if (spoke === 'settlement-amounts') b.push({ blockType: 'articleSettlementTable', heading: 'Estimated Pedestrian Accident Settlement Ranges', rows: [{ severity: 'Moderate Injury', description: 'Fractures, hospitalization — 2x–3x multiplier', range: '$50,000 – $150,000' }, { severity: 'Serious Injury', description: 'Multiple surgeries, permanent damage', range: '$150,000 – $400,000' }, { severity: 'Catastrophic Injury', description: 'Traumatic brain injury, spinal cord, amputation', range: '$400,000 – $1,000,000+' }, { severity: 'Wrongful Death', description: 'Fatal injuries', range: '$1,000,000+' }], footnote: 'Settlement ranges are illustrative. Your actual settlement depends on liability clarity, injury severity, and available insurance.' })
  else if (spoke === 'do-i-need-a-lawyer') b.push({ blockType: 'articleProseContent', sections: REF.sections.map(s => ({ heading: s.title, body: s.content.join('\n\n') })) })
  else if (spoke === 'statute-of-limitations') b.push({ blockType: 'articleStatuteBars', heading: 'Statute of Limitations for Pedestrian Accident Claims', bars: [{ deadline: '2 Years', states: 'Most states', widthPercent: 55 }, { deadline: '3 Years', states: 'California, Georgia, Louisiana, Montana', widthPercent: 25 }, { deadline: '1 Year', states: 'VA, MD, DC (contributory negligence)', widthPercent: 20 }], footnote: 'Statutes vary by state. Some have exceptions for minors and discovery. Consult a pedestrian accident attorney to confirm your deadline.' })
  b.push({ blockType: 'articleRelatedGuides', articles: otherIds.filter(rid => rid !== id) })
  return b
}

async function run() {
  console.log(`🚀 Seeding ${CATEGORY_SLUG}...\n`)
  const payload = await getPayload({ config })
  const authorId = (await payload.find({ collection: 'authors', where: { name: { equals: 'Martha Kechicha' } }, limit: 1 })).docs[0]?.id
  const categoryId = (await payload.find({ collection: 'guideCategories', where: { slug: { equals: CATEGORY_SLUG } }, limit: 1 })).docs[0]?.id
  if (!authorId || !categoryId) { console.error('❌ Author or Category not found'); return }
  console.log(`✅ Author: ${authorId}, Category: ${categoryId}`)
  const ids: Record<string, number> = {}
  for (const spoke of SPOKES) {
    const slug = `${PILLAR}-${spoke.slug}`
    const title = `${spoke.label} a ${PILLAR_NAME}`
    await upsert(payload, slug, title, authorId, categoryId)
    const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
    if (r.docs[0]?.id) ids[slug] = r.docs[0].id
    console.log(`  ✅ upserted: ${slug}`)
  }
  for (const spoke of SPOKES) {
    const slug = `${PILLAR}-${spoke.slug}`
    const id = ids[slug]
    if (!id) continue
    const b = makeBlocks(id, spoke.slug, Object.values(ids))
    await payload.update({ collection: 'guideArticles', id, data: { blocks: b, _status: 'published', _isSeeding: true } })
    console.log(`  ✅ ${slug} — ${b.length} blocks`)
  }
  console.log('\n✅ Done!')
}

run().catch(e => { console.error(e.message); process.exit(1) })
