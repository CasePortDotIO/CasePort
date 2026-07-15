/**
 * seed-truck-accidents-articles.ts
 * Seeds the 4 spoke articles for truck-accidents category from reference data.
 *
 * Run: npx tsx seed-truck-accidents-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// ─── Reference Data ────────────────────────────────────────────────────────────

const REF = {
  title: 'Truck Accident Claims: Why These Cases Are Worth More',
  category: 'Truck Accident',
  directAnswer: 'Truck accidents result in more severe injuries and higher settlements than car accidents because trucks weigh 20–30 times more than cars. Average truck accident settlements range from $75,000 to $500,000+ depending on injury severity and liability. Truck companies carry higher insurance limits ($1M+) and are held to higher safety standards. Federal trucking regulations create additional liability exposure and evidence for your claim.',
  stats: [
    { label: 'Avg Settlement', value: '$185K' },
    { label: 'Injury Severity', value: 'High' },
    { label: 'Insurance Limits', value: '$1M+' },
    { label: 'Liability', value: 'Complex' },
  ],
  keyFacts: [
    'Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars',
    'Federal trucking regulations (HOS, maintenance, inspection) create additional liability exposure',
    'Truck companies carry higher insurance limits ($1M+) and are more likely to settle',
    'Black box data from trucks provides objective evidence of speed, braking, and driver behavior',
    'Trucking companies often carry multiple insurance policies, increasing available recovery',
  ],
  sections: [
    {
      title: 'Why Truck Accidents Result in Higher Settlements',
      content: [
        'Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars. The physics of collision are simple: heavier vehicles cause more damage. A truck traveling at 55 mph has the same kinetic energy as a car traveling at 200+ mph.',
        'Truck accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, amputation, and death. These severe injuries justify higher settlements.',
        'Truck companies carry higher insurance limits ($1M+) and are more likely to settle because they face significant liability exposure. They also employ risk management teams that understand the cost of litigation and jury trials.',
      ],
    },
    {
      title: 'Federal Trucking Regulations Create Additional Liability',
      content: [
        'Federal trucking regulations (Hours of Service, vehicle maintenance, driver qualifications, inspection requirements) create additional liability exposure. Violations of these regulations are evidence of negligence.',
        'Hours of Service violations are particularly damaging. Truck drivers are limited to 11 hours of driving per 14-hour work day. Violations indicate driver fatigue, which is a major cause of truck accidents. Logbook data proving HOS violations is powerful evidence.',
        'Vehicle maintenance violations are also damaging. Trucks must be inspected regularly and maintained to federal standards. Brake failures, tire blowouts, and other mechanical failures caused by negligent maintenance are evidence of liability.',
      ],
    },
    {
      title: 'Black Box Data and Objective Evidence',
      content: [
        'Modern trucks are equipped with electronic data recorders (black boxes) that record speed, braking, acceleration, and other vehicle data. This data is objective evidence of driver behavior and vehicle condition.',
        'Black box data can prove that the truck driver was speeding, failed to brake, or was distracted. This data is admissible in court and is extremely persuasive to juries.',
        'Trucking companies often try to destroy or hide black box data. Early legal action is critical to preserve this evidence. An attorney can issue a preservation letter to the trucking company requiring that all black box data be preserved.',
      ],
    },
    {
      title: 'Multiple Insurance Policies Increase Available Recovery',
      content: [
        'Trucking companies often carry multiple insurance policies: primary liability, excess liability, umbrella coverage, and cargo insurance. Each policy has separate limits, increasing the total available recovery.',
        'A truck accident might have $1M in primary liability, $2M in excess liability, and $5M in umbrella coverage, for a total of $8M in available insurance. Your claim value is limited only by the severity of your injuries and the available insurance.',
        'Insurance companies often fight over which policy applies, but this is their problem, not yours. Your attorney coordinates with all insurers to maximize your recovery.',
      ],
    },
  ],
  faqs: [
    { q: 'Why are truck accident settlements higher than car accidents?', a: 'Trucks weigh 20–30 times more than cars, causing catastrophic injuries. Truck companies carry higher insurance limits ($1M+), and federal regulations create additional liability.' },
    { q: 'What is Hours of Service (HOS) and why does it matter?', a: 'HOS limits truck drivers to 11 hours of driving per 14-hour work day. Violations are evidence of driver fatigue — a major cause of truck accidents.' },
    { q: 'How do I preserve black box data after a truck accident?', a: 'Act immediately. Send a preservation letter to the trucking company demanding all electronic data records be preserved. This data is often overwritten within days.' },
    { q: 'Can I sue the trucking company directly?', a: "Yes. Trucking companies are vicariously liable for their drivers' negligence. They may also have direct liability for negligent hiring or failing to maintain safe vehicles." },
  ],
}

const EXPERT = {
  reviewerName: 'Sarah K. Martinez',
  credentials: 'Truck Accident Legal Specialist | Author, Commercial Vehicle Liability Guide',
  quote: 'Every truck accident case has a black box. The question is whether you get to it before the company does.',
}

const SOURCES = {
  citeTitle: 'Truck Accident Guide',
  sources: [
    { name: 'Federal Motor Carrier Safety Administration (FMCSA)', url: 'https://www.fmcsa.dot.gov/' },
    { name: 'American Trucking Associations (ATA)', url: 'https://www.trucking.org/' },
    { name: 'Insurance Institute for Highway Safety (IIHS)', url: 'https://www.iihs.org/' },
  ],
}

const PILLAR = 'truck-accident'
const CATEGORY_SLUG = 'truck-accidents'
const PILLAR_NAME = 'Truck Accident'

const SPOKES = [
  { slug: 'what-to-do', label: 'What To Do After' },
  { slug: 'settlement-amounts', label: 'Settlement Amounts' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer' },
  { slug: 'statute-of-limitations', label: 'How Long to File' },
] as const

// ─── Block factories ────────────────────────────────────────────────────────────

function mkDirectAnswer(spoke: string) {
  return {
    blockType: 'articleDirectAnswer',
    heading: spoke === 'what-to-do' ? `What To Do After a ${PILLAR_NAME}` : REF.title,
    text: spoke === 'what-to-do'
      ? 'The first 72 hours after a truck accident are critical for preserving evidence and protecting your claim. Here is what you need to do.'
      : REF.directAnswer,
  }
}

function mkKeyTakeaways() {
  return { blockType: 'articleKeyTakeaways', items: REF.keyFacts.map(f => ({ fact: f })) }
}

function mkFAQ() {
  return { blockType: 'articleFAQ', items: REF.faqs.map(f => ({ question: f.q, answerText: f.a })) }
}

function mkSources() {
  return { blockType: 'articleSources', citeTitle: SOURCES.citeTitle, sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })) }
}

function mkExpert() {
  return { blockType: 'articleExpert', quote: EXPERT.quote, reviewerName: EXPERT.reviewerName, credentials: EXPERT.credentials }
}

function mkCTA() {
  return { blockType: 'articleCTA', title: 'Get a Free Case Review', subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.', buttonLabel: 'Check My Case', buttonLink: '/checkmycase' }
}

function mkTimelineSteps() {
  return {
    blockType: 'articleTimelineSteps',
    heading: `${PILLAR_NAME} — Step by Step`,
    steps: REF.sections.map((s, i) => ({ stepName: `${i + 1}. ${s.title}`, stepDescription: s.content[0] ?? '' })),
    note: 'Step order reflects the most important actions in the first 72 hours after a truck accident.',
  }
}

function mkSettlementTable() {
  return {
    blockType: 'articleSettlementTable',
    heading: 'Estimated Truck Accident Settlement Ranges',
    rows: [
      { severity: 'Minor Injury', description: 'Soft tissue, quick recovery — lower medical bills, lower multipliers', range: '$75,000 – $150,000' },
      { severity: 'Serious Injury', description: 'Fractures, surgery, hospitalization — significant medical costs', range: '$150,000 – $500,000' },
      { severity: 'Catastrophic Injury', description: 'Spinal cord, traumatic brain injury, amputation — highest multipliers', range: '$500,000 – $1,000,000+' },
      { severity: 'Wrongful Death', description: 'Fatal injuries — full damages including lost income and companionship', range: '$1,000,000+' },
    ],
    footnote: 'Settlement ranges are illustrative estimates based on typical case values. Your actual settlement depends on the specific facts of your case, liability clarity, and available insurance coverage.',
  }
}

function mkProseContent() {
  return { blockType: 'articleProseContent', sections: REF.sections.map(s => ({ heading: s.title, body: s.content.join('\n\n') })) }
}

function mkStatuteBars() {
  return {
    blockType: 'articleStatuteBars',
    heading: 'Statute of Limitations for Truck Accident Claims',
    bars: [
      { deadline: '2 Years', states: 'Most states (Texas, Florida, New York, Illinois)', widthPercent: 55 },
      { deadline: '3 Years', states: 'California, Georgia, Louisiana, Montana', widthPercent: 25 },
      { deadline: '1 Year', states: 'Special circumstances: VA, MD, DC — contributory negligence states', widthPercent: 20 },
    ],
    footnote: 'Statutes of limitation vary significantly by state. Some states have exceptions for minors, discovery of injury, or tolling provisions. Consult a truck accident attorney in your state to confirm your exact deadline.',
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`🚀 Seeding ${CATEGORY_SLUG}: 4 spoke articles...\n`)
  const payload = await getPayload({ config })

  const authorId = (await payload.find({ collection: 'authors', where: { name: { equals: 'Martha Kechicha' } }, limit: 1 })).docs[0]?.id
  if (!authorId) { console.error('❌ Author not found'); return }

  const categoryId = (await payload.find({ collection: 'guideCategories', where: { slug: { equals: CATEGORY_SLUG } }, limit: 1 })).docs[0]?.id
  if (!categoryId) { console.error('❌ Category not found'); return }

  console.log(`✅ Author ID: ${authorId}, Category ID: ${categoryId}`)

  // Upsert all 4 articles
  const ids: Record<string, number> = {}
  for (const spoke of SPOKES) {
    const slug = `${PILLAR}-${spoke.slug}`
    const title = `${spoke.label} a ${PILLAR_NAME}`
    await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 }).then(async r => {
      if (r.docs[0]) {
        await payload.update({ collection: 'guideArticles', id: r.docs[0].id, data: { title, slug, subtitle: 'Truck accident claim guidance.', focusKeyword: `truck accident ${spoke.slug.replace(/-/g, ' ')}`, secondaryKeywords: [{ keyword: 'truck accident settlement' }, { keyword: 'how to file a truck accident claim' }], metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155), schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId } })
      } else {
        await payload.create({ collection: 'guideArticles', data: { title, slug, subtitle: 'Truck accident claim guidance.', focusKeyword: `truck accident ${spoke.slug.replace(/-/g, ' ')}`, secondaryKeywords: [{ keyword: 'truck accident settlement' }, { keyword: 'how to file a truck accident claim' }], metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155), schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId } })
      }
    })
    const r2 = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
    if (r2.docs[0]?.id) ids[slug] = r2.docs[0].id
    console.log(`  ✅ upserted: ${slug}`)
  }

  // Save blocks
  for (const spoke of SPOKES) {
    const slug = `${PILLAR}-${spoke.slug}`
    const id = ids[slug]
    if (!id) continue

    const blocks: any[] = []
    blocks.push(mkDirectAnswer(spoke.slug))
    blocks.push(mkKeyTakeaways())
    blocks.push(mkFAQ())
    blocks.push(mkSources())
    blocks.push(mkExpert())
    blocks.push(mkCTA())

    if (spoke.slug === 'what-to-do') blocks.push(mkTimelineSteps())
    else if (spoke.slug === 'settlement-amounts') blocks.push(mkSettlementTable())
    else if (spoke.slug === 'do-i-need-a-lawyer') blocks.push(mkProseContent())
    else if (spoke.slug === 'statute-of-limitations') blocks.push(mkStatuteBars())

    // Related: other 3 truck-accident articles
    const relatedIds = Object.values(ids).filter((rid: number) => rid !== id)
    blocks.push({ blockType: 'articleRelatedGuides', articles: relatedIds })

    await payload.update({ collection: 'guideArticles', id, data: { blocks, _status: 'published', _isSeeding: true } })
    console.log(`  ✅ ${slug} — ${blocks.length} blocks`)
  }

  console.log('\n✅ Done!')
}

run().catch(e => { console.error(e.message); process.exit(1) })
