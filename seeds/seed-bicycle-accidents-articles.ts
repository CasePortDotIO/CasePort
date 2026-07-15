/**
 * seed-bicycle-accidents-articles.ts
 * Run: npx tsx seed-bicycle-accidents-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const REF = {
  title: 'Bicycle Accident Claims: Protecting Vulnerable Riders',
  directAnswer: 'Bicycle accidents cause severe injuries because riders have no protection from a multi-ton vehicle. Average bicycle accident settlements range from $30,000 to $250,000+ depending on injury severity and liability. Most collisions are caused by drivers failing to yield, opening doors into bike lanes, or making right hooks. Many jurisdictions apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists, and a helmet does not bar recovery.',
  keyFacts: [
    'Most bike collisions are caused by drivers failing to yield, "dooring," or right-hook turns',
    'Vulnerable-road-user laws hold drivers to a heightened duty of care around cyclists',
    'Not wearing a helmet does not bar recovery in most states',
    'Head and spinal injuries make bicycle claims high-value despite the small vehicle',
    'Surveillance and traffic-camera footage is critical and overwritten within 72 hours',
  ],
  sections: [
    {
      title: 'Why Drivers Are Usually at Fault in Bicycle Accidents',
      content: [
        "Most bicycle accidents are caused by driver negligence: failing to yield at intersections, opening a car door into a bike lane (\"dooring\"), and making a right turn across a cyclist's path (the \"right hook\").",
        "Drivers frequently claim they 'never saw' the cyclist. This is not a defense — it is an admission of inattention.",
        "Objective evidence — traffic-camera footage, witness testimony, and the physical damage pattern — usually establishes the driver's fault clearly.",
      ],
    },
    {
      title: 'Vulnerable Road User Protections',
      content: [
        'Many states and cities apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists.',
        'These standards recognize the vast disparity between a cyclist and a motor vehicle. Even where a cyclist made a minor error, the driver\'s failure to exercise reasonable care can establish liability.',
        'In contributory-negligence jurisdictions, however, cyclist fault can still bar recovery — which makes careful documentation and legal guidance especially important.',
      ],
    },
    {
      title: 'The Helmet Question',
      content: [
        'Not wearing a helmet does not bar your recovery in most states. Insurance adjusters will raise it to argue comparative fault, but helmet non-use is generally inadmissible to liability for the collision itself.',
        'For head injuries, an insurer may argue a helmet would have reduced the harm. The strength of that argument varies by state.',
        'Wearing a helmet is always safer — but its absence should never stop an injured cyclist from pursuing a valid claim.',
      ],
    },
    {
      title: 'Documenting a Bicycle Accident Claim',
      content: [
        'Bicycle accident injuries are often catastrophic — traumatic brain injury, spinal damage, and multiple fractures — which makes thorough medical documentation essential to capturing the claim\'s full value.',
        'Preserve the bicycle in its damaged condition, photograph the scene and bike-lane markings, and request nearby surveillance footage immediately, before it is overwritten within 72 hours.',
        "Witness statements are especially valuable in bicycle cases because they counter the common driver narrative that the cyclist 'came out of nowhere.'",
      ],
    },
  ],
  faqs: [
    { q: 'What is "dooring" in bicycle accidents?', a: 'Dooring occurs when a driver or passenger opens a car door into a bike lane without looking, striking an oncoming cyclist. The driver or passenger who opened the door is typically at fault.' },
    { q: 'What is a "right hook" bicycle accident?', a: "A right hook happens when a driver makes a right turn across a cyclist's path, cutting off or colliding with the cyclist traveling straight through." },
    { q: 'Does not wearing a helmet hurt my bicycle accident claim?', a: 'No. Not wearing a helmet does not bar your recovery in most states. Helmet non-use is generally inadmissible to liability for the collision itself.' },
    { q: 'How long do I have to file a bicycle accident claim?', a: 'Statutes of limitation vary by state, typically 1 to 6 years from the date of the accident. Most states fall in the 2–3 year range. Evidence like surveillance footage disappears far sooner — act immediately.' },
  ],
}

const EXPERT = { reviewerName: 'Robert J. Alton', credentials: 'Cycling Injury Specialist | Board Member, Dallas Bicycle Coalition', quote: "The right hook and dooring are the two most common bicycle accidents I see. Both are entirely the driver's fault under Texas law." }
const SOURCES = { citeTitle: 'Bicycle Accident Guide', sources: [{ name: 'National Highway Traffic Safety Administration (NHTSA) — Bicyclists', url: 'https://www.nhtsa.gov/road-safety/bicyclists' }, { name: 'League of American Bicyclists', url: 'https://www.bikeleague.org/' }, { name: 'Insurance Institute for Highway Safety (IIHS)', url: 'https://www.iihs.org/' }] }

const PILLAR = 'bicycle-accident'
const CATEGORY_SLUG = 'bicycle-accidents'
const PILLAR_NAME = 'Bicycle Accident'

const SPOKES = [
  { slug: 'what-to-do', label: 'What To Do After' },
  { slug: 'settlement-amounts', label: 'Settlement Amounts' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer' },
  { slug: 'statute-of-limitations', label: 'How Long to File' },
] as const

async function upsert(payload: any, slug: string, title: string, authorId: number, categoryId: number) {
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  const data = { title, slug, subtitle: 'Bicycle accident claim guidance.', focusKeyword: `bicycle accident ${slug.split('-').pop()?.replace(/-/g, ' ')}`, secondaryKeywords: [{ keyword: 'bicycle accident settlement' }, { keyword: 'how to file a bicycle accident claim' }], metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155), schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId }
  if (r.docs[0]) await payload.update({ collection: 'guideArticles', id: r.docs[0].id, data })
  else await payload.create({ collection: 'guideArticles', data })
}

function makeBlocks(id: number, spoke: string, otherIds: number[]) {
  const b: any[] = []
  b.push({ blockType: 'articleDirectAnswer', heading: spoke === 'what-to-do' ? `What To Do After a ${PILLAR_NAME}` : REF.title, text: spoke === 'what-to-do' ? 'The first 72 hours after a bicycle accident are critical. Here is what you need to do.' : REF.directAnswer })
  b.push({ blockType: 'articleKeyTakeaways', items: REF.keyFacts.map(f => ({ fact: f })) })
  b.push({ blockType: 'articleFAQ', items: REF.faqs.map(f => ({ question: f.q, answerText: f.a })) })
  b.push({ blockType: 'articleSources', citeTitle: SOURCES.citeTitle, sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })) })
  b.push({ blockType: 'articleExpert', quote: EXPERT.quote, reviewerName: EXPERT.reviewerName, credentials: EXPERT.credentials })
  b.push({ blockType: 'articleCTA', title: 'Get a Free Case Review', subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.', buttonLabel: 'Check My Case', buttonLink: '/checkmycase' })
  if (spoke === 'what-to-do') b.push({ blockType: 'articleTimelineSteps', heading: `${PILLAR_NAME} — Step by Step`, steps: REF.sections.map((s, i) => ({ stepName: `${i + 1}. ${s.title}`, stepDescription: s.content[0] ?? '' })), note: 'Step order reflects the most important actions in the first 72 hours after a bicycle accident.' })
  else if (spoke === 'settlement-amounts') b.push({ blockType: 'articleSettlementTable', heading: 'Estimated Bicycle Accident Settlement Ranges', rows: [{ severity: 'Minor Injury', description: 'Road rash, minor fractures, quick recovery', range: '$30,000 – $75,000' }, { severity: 'Serious Injury', description: 'Multiple fractures, head injuries, surgery', range: '$75,000 – $250,000' }, { severity: 'Catastrophic Injury', description: 'Traumatic brain injury, spinal cord damage', range: '$250,000 – $1,000,000+' }, { severity: 'Wrongful Death', description: 'Fatal injuries', range: '$1,000,000+' }], footnote: 'Settlement ranges are illustrative. Your actual settlement depends on liability, injury severity, and available insurance.' })
  else if (spoke === 'do-i-need-a-lawyer') b.push({ blockType: 'articleProseContent', sections: REF.sections.map(s => ({ heading: s.title, body: s.content.join('\n\n') })) })
  else if (spoke === 'statute-of-limitations') b.push({ blockType: 'articleStatuteBars', heading: 'Statute of Limitations for Bicycle Accident Claims', bars: [{ deadline: '2 Years', states: 'Most states', widthPercent: 55 }, { deadline: '3 Years', states: 'California, Georgia, Louisiana, Montana', widthPercent: 25 }, { deadline: '1 Year', states: 'VA, MD, DC (contributory negligence)', widthPercent: 20 }], footnote: 'Statutes vary by state. Consult a bicycle accident attorney to confirm your deadline.' })
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
