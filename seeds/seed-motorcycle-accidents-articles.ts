/**
 * seed-motorcycle-accidents-articles.ts
 * Run: npx tsx seed-motorcycle-accidents-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const REF = {
  title: 'Motorcycle Accident Claims: Overcoming Bias and Maximizing Recovery',
  directAnswer: "Motorcycle accidents result in severe injuries and death at rates 28 times higher than car accidents. Average motorcycle accident settlements range from $50,000 to $300,000+ depending on injury severity. Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. Overcoming this bias requires clear evidence of the other party's liability and comprehensive medical documentation of your injuries.",
  stats: [
    { label: 'Avg Settlement', value: '$125K' },
    { label: 'Injury Severity', value: 'Severe' },
    { label: 'Fatality Rate', value: '28× Higher' },
    { label: 'Bias Factor', value: 'High' },
  ],
  keyFacts: [
    'Motorcycle accidents result in severe injuries and death at rates 28 times higher than car accidents',
    'Insurance companies and juries apply bias against motorcycle riders, assuming they were reckless',
    'Overcoming bias requires clear evidence of the other party\'s liability',
    'Motorcycle riders have limited protection, resulting in catastrophic injuries',
    'Comprehensive medical documentation is critical to overcome bias',
  ],
  sections: [
    {
      title: 'Understanding Bias Against Motorcycle Riders',
      content: [
        'Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. This bias is unfair and illegal, but it exists.',
        "Insurance adjusters argue that you were speeding, weaving through traffic, or riding recklessly. They use this narrative to reduce your settlement offer.",
        'Juries also apply this bias. Some jurors believe that motorcycle riders accept the risk of injury by choosing to ride.',
      ],
    },
    {
      title: 'Why Motorcycle Accidents Result in Severe Injuries',
      content: [
        "Motorcycle riders have no protection from impact. Cars have airbags, crumple zones, and steel frames. Motorcycles have only the rider's body.",
        'Motorcycle accident injuries are typically catastrophic: multiple fractures, road rash, spinal cord damage, traumatic brain injury, amputation, and death.',
        'Helmet use reduces head injury risk but does not prevent other injuries. Road rash, fractures, and spinal cord injuries are common even with helmet use.',
      ],
    },
    {
      title: 'Proving Liability in Motorcycle Accidents',
      content: [
        "Proving liability requires clear evidence of the other party's negligence. Witness testimony, surveillance footage, police reports, and accident reconstruction are critical.",
        "Insurance companies often argue that the motorcycle rider was speeding or weaving. Objective evidence counters these arguments.",
        'Accident reconstruction experts can analyze the accident scene, vehicle damage, and road conditions to determine what happened.',
      ],
    },
    {
      title: 'Medical Documentation and Overcoming Bias',
      content: [
        'Comprehensive medical documentation is critical to overcome bias and prove the severity of your injuries.',
        'Insurance companies argue that motorcycle riders exaggerate their injuries. Detailed medical records counter these arguments.',
        "Follow your doctor's treatment recommendations exactly. Gaps in treatment allow insurance adjusters to argue that your injuries were minor.",
      ],
    },
  ],
  faqs: [
    { q: 'How do I overcome bias against motorcycle riders in a claim?', a: "Overcoming bias requires objective evidence of the other party's liability: surveillance footage, witness testimony, police reports, and accident reconstruction." },
    { q: 'Do I need a helmet to have a valid motorcycle accident claim?', a: "Not wearing a helmet does not bar your recovery in most states. Wear a helmet for safety — but its absence should never stop you from pursuing a valid claim." },
    { q: 'What are the most common causes of motorcycle accidents?', a: 'Drivers failing to yield at intersections, making left turns across oncoming motorcycles, opening car doors into bike lanes, and rear-ending motorcycles.' },
    { q: 'What injuries are most common in motorcycle accidents?', a: 'Traumatic brain injury, spinal cord damage, multiple fractures, road rash, and amputation. The lack of protective barriers means the rider absorbs all impact energy.' },
  ],
}

const EXPERT = {
  reviewerName: 'Marcus T. Webb',
  credentials: 'Motorcycle Injury Attorney | Member, ABATE of Texas Legal Panel',
  quote: "Juries in Texas have seen a lot of car versus motorcycle cases, and many come in with bias. The attorneys who win these cases don't fight the bias directly.",
}

const SOURCES = {
  citeTitle: 'Motorcycle Accident Guide',
  sources: [
    { name: 'National Highway Traffic Safety Administration (NHTSA) — Motorcycles', url: 'https://www.nhtsa.gov/road-safety/motorcycles' },
    { name: 'Insurance Institute for Highway Safety (IIHS)', url: 'https://www.iihs.org/' },
    { name: 'ABATE of Texas | Motorcycle Rights Organization', url: 'https://www.abateoftx.org/' },
  ],
}

const PILLAR = 'motorcycle-accident'
const CATEGORY_SLUG = 'motorcycle-accidents'
const PILLAR_NAME = 'Motorcycle Accident'

const SPOKES = [
  { slug: 'what-to-do', label: 'What To Do After' },
  { slug: 'settlement-amounts', label: 'Settlement Amounts' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer' },
  { slug: 'statute-of-limitations', label: 'How Long to File' },
] as const

async function upsert(payload: any, slug: string, title: string, authorId: number, categoryId: number) {
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  const data = {
    title, slug,
    subtitle: 'Motorcycle accident claim guidance.',
    focusKeyword: `motorcycle accident ${slug.split('-').pop()?.replace(/-/g, ' ')}`,
    secondaryKeywords: [{ keyword: 'motorcycle accident settlement' }, { keyword: 'how to file a motorcycle accident claim' }],
    metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155),
    schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId,
  }
  if (r.docs[0]) await payload.update({ collection: 'guideArticles', id: r.docs[0].id, data })
  else await payload.create({ collection: 'guideArticles', data })
}

function blocks(id: number, spoke: string, otherIds: number[]) {
  const b: any[] = []
  b.push({ blockType: 'articleDirectAnswer', heading: spoke === 'what-to-do' ? `What To Do After a ${PILLAR_NAME}` : REF.title, text: spoke === 'what-to-do' ? 'The first 72 hours after a motorcycle accident are critical. Here is what you need to do.' : REF.directAnswer })
  b.push({ blockType: 'articleKeyTakeaways', items: REF.keyFacts.map(f => ({ fact: f })) })
  b.push({ blockType: 'articleFAQ', items: REF.faqs.map(f => ({ question: f.q, answerText: f.a })) })
  b.push({ blockType: 'articleSources', citeTitle: SOURCES.citeTitle, sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })) })
  b.push({ blockType: 'articleExpert', quote: EXPERT.quote, reviewerName: EXPERT.reviewerName, credentials: EXPERT.credentials })
  b.push({ blockType: 'articleCTA', title: 'Get a Free Case Review', subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.', buttonLabel: 'Check My Case', buttonLink: '/checkmycase' })
  if (spoke === 'what-to-do') b.push({ blockType: 'articleTimelineSteps', heading: `${PILLAR_NAME} — Step by Step`, steps: REF.sections.map((s, i) => ({ stepName: `${i + 1}. ${s.title}`, stepDescription: s.content[0] ?? '' })), note: 'Step order reflects the most important actions in the first 72 hours after a motorcycle accident.' })
  else if (spoke === 'settlement-amounts') b.push({ blockType: 'articleSettlementTable', heading: 'Estimated Motorcycle Accident Settlement Ranges', rows: [{ severity: 'Minor Injury', description: 'Soft tissue, quick recovery', range: '$50,000 – $100,000' }, { severity: 'Serious Injury', description: 'Fractures, road rash, ongoing treatment', range: '$100,000 – $300,000' }, { severity: 'Catastrophic Injury', description: 'Traumatic brain injury, spinal cord, amputation', range: '$300,000 – $1,000,000+' }, { severity: 'Wrongful Death', description: 'Fatal injuries', range: '$1,000,000+' }], footnote: 'Settlement ranges are illustrative estimates. Your actual settlement depends on liability, injury severity, and available insurance.' })
  else if (spoke === 'do-i-need-a-lawyer') b.push({ blockType: 'articleProseContent', sections: REF.sections.map(s => ({ heading: s.title, body: s.content.join('\n\n') })) })
  else if (spoke === 'statute-of-limitations') b.push({ blockType: 'articleStatuteBars', heading: 'Statute of Limitations for Motorcycle Accident Claims', bars: [{ deadline: '2 Years', states: 'Most states', widthPercent: 55 }, { deadline: '3 Years', states: 'California, Georgia, Louisiana, Montana', widthPercent: 25 }, { deadline: '1 Year', states: 'VA, MD, DC (contributory negligence)', widthPercent: 20 }], footnote: 'Statutes vary by state. Consult a motorcycle accident attorney to confirm your deadline.' })
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
    const b = blocks(id, spoke.slug, Object.values(ids))
    await payload.update({ collection: 'guideArticles', id, data: { blocks: b, _status: 'published', _isSeeding: true } })
    console.log(`  ✅ ${slug} — ${b.length} blocks`)
  }
  console.log('\n✅ Done!')
}

run().catch(e => { console.error(e.message); process.exit(1) })
