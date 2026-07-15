/**
 * seed-rideshare-accidents-articles.ts
 * Run: npx tsx seed-rideshare-accidents-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const REF = {
  title: 'Rideshare Accident Claims: Navigating Complex Liability',
  directAnswer: 'Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers. Average rideshare accident settlements range from $30,000 to $200,000+ depending on injury severity and liability. Rideshare companies carry insurance that covers accidents during rides, but they often dispute coverage and liability. Early legal action is critical to preserve evidence and protect your rights.',
  keyFacts: [
    'Rideshare accidents involve complex liability because multiple parties may be responsible',
    'Rideshare companies carry insurance that covers accidents during rides',
    'Rideshare companies often dispute coverage and liability to reduce their exposure',
    'The rideshare driver may be personally liable in addition to the rideshare company',
    'Early legal action is critical to preserve evidence and protect your rights',
  ],
  sections: [
    {
      title: 'Understanding Rideshare Liability',
      content: [
        'Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers.',
        "The rideshare driver is responsible for operating the vehicle safely. If the driver was negligent, the driver is liable for your injuries.",
        "The rideshare company is also liable for the driver's negligence under the doctrine of vicarious liability.",
      ],
    },
    {
      title: 'Rideshare Insurance Coverage',
      content: [
        'Rideshare companies carry insurance that covers accidents during rides. The insurance limits are typically $1M+ for bodily injury liability.',
        "The rideshare insurance coverage depends on the driver's status at the time of the accident. If the driver was actively transporting a passenger, the rideshare company's insurance applies.",
        'Rideshare companies often argue that the driver was offline or waiting for a ride request to avoid coverage. Early legal action is critical to preserve evidence.',
      ],
    },
    {
      title: 'Investigating Rideshare Accidents',
      content: [
        "Rideshare accidents require investigation into the driver's background, training, and history.",
        'Driver records may show prior accidents, traffic violations, or complaints about the driver\'s safety.',
        'GPS data, app records, and telematics data from the vehicle can prove the driver\'s location, speed, and actions immediately before the accident.',
      ],
    },
    {
      title: 'Negotiating with Rideshare Companies',
      content: [
        'Rideshare companies employ sophisticated legal teams that aggressively defend claims.',
        'Rideshare companies often make low settlement offers to test your knowledge and pressure you into accepting less than your claim is worth.',
        'If negotiations stall, litigation may be necessary. Juries are often sympathetic to injured passengers.',
      ],
    },
  ],
  faqs: [
    { q: 'Which insurance applies after a rideshare accident?', a: "If the driver was actively transporting a passenger, the rideshare company's $1M+ policy applies. If the driver was waiting for a ride request, only the driver's personal insurance applies." },
    { q: 'Can I sue the rideshare company directly?', a: "Yes. Rideshare companies are vicariously liable for their drivers' negligence. They may also have direct liability for negligent hiring or failing to maintain safe vehicles." },
    { q: 'What evidence is critical after a rideshare accident?', a: 'Preserve GPS data and app records immediately — these prove whether the driver was transporting a passenger. Also collect witness information and request a police report.' },
    { q: 'How do I prove the rideshare driver was negligent?', a: 'Driver negligence in rideshare accidents is proven through GPS data, app records showing driver status, witness testimony, police reports, and accident reconstruction.' },
  ],
}

const EXPERT = { reviewerName: 'Priya N. Sharma', credentials: 'Rideshare Litigation Attorney | Speaker, ABA National Traffic Safety Conference', quote: "The insurance coverage question — was the driver waiting for a fare or actively driving — is the first fight in every Uber and Lyft case." }
const SOURCES = { citeTitle: 'Rideshare Accident Guide', sources: [{ name: 'Uber Accident Guidelines | HG.org Legal Resources', url: 'https://www.hg.org/rideshare-accidents.html' }, { name: 'Lyft Insurance Policy Overview | J.D. Power', url: 'https://www.jdpower.com/cars/lyft-insurance' }, { name: 'American Academy of Trial Attorneys — Rideshare Liability', url: 'https://www.actl.com/' }] }

const PILLAR = 'rideshare-accident'
const CATEGORY_SLUG = 'rideshare-accidents'
const PILLAR_NAME = 'Rideshare Accident'

const SPOKES = [
  { slug: 'what-to-do', label: 'What To Do After' },
  { slug: 'settlement-amounts', label: 'Settlement Amounts' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer' },
  { slug: 'statute-of-limitations', label: 'How Long to File' },
] as const

async function upsert(payload: any, slug: string, title: string, authorId: number, categoryId: number) {
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  const data = { title, slug, subtitle: 'Rideshare accident claim guidance.', focusKeyword: `rideshare accident ${slug.split('-').pop()?.replace(/-/g, ' ')}`, secondaryKeywords: [{ keyword: 'rideshare accident settlement' }, { keyword: 'Uber accident claim' }], metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155), schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId }
  if (r.docs[0]) await payload.update({ collection: 'guideArticles', id: r.docs[0].id, data })
  else await payload.create({ collection: 'guideArticles', data })
}

function makeBlocks(id: number, spoke: string, otherIds: number[]) {
  const b: any[] = []
  b.push({ blockType: 'articleDirectAnswer', heading: spoke === 'what-to-do' ? `What To Do After a ${PILLAR_NAME}` : REF.title, text: spoke === 'what-to-do' ? 'The first 72 hours after a rideshare accident are critical. Here is what you need to do.' : REF.directAnswer })
  b.push({ blockType: 'articleKeyTakeaways', items: REF.keyFacts.map(f => ({ fact: f })) })
  b.push({ blockType: 'articleFAQ', items: REF.faqs.map(f => ({ question: f.q, answerText: f.a })) })
  b.push({ blockType: 'articleSources', citeTitle: SOURCES.citeTitle, sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })) })
  b.push({ blockType: 'articleExpert', quote: EXPERT.quote, reviewerName: EXPERT.reviewerName, credentials: EXPERT.credentials })
  b.push({ blockType: 'articleCTA', title: 'Get a Free Case Review', subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.', buttonLabel: 'Check My Case', buttonLink: '/checkmycase' })
  if (spoke === 'what-to-do') b.push({ blockType: 'articleTimelineSteps', heading: `${PILLAR_NAME} — Step by Step`, steps: REF.sections.map((s, i) => ({ stepName: `${i + 1}. ${s.title}`, stepDescription: s.content[0] ?? '' })), note: 'Step order reflects the most important actions in the first 72 hours after a rideshare accident.' })
  else if (spoke === 'settlement-amounts') b.push({ blockType: 'articleSettlementTable', heading: 'Estimated Rideshare Accident Settlement Ranges', rows: [{ severity: 'Minor Injury', description: 'Soft tissue, quick recovery', range: '$30,000 – $75,000' }, { severity: 'Serious Injury', description: 'Fractures, surgery, significant medical', range: '$75,000 – $200,000' }, { severity: 'Catastrophic Injury', description: 'Traumatic brain injury, spinal cord, amputation', range: '$200,000 – $1,000,000+' }, { severity: 'Wrongful Death', description: 'Fatal injuries', range: '$1,000,000+' }], footnote: 'Settlement ranges are illustrative. Your actual settlement depends on the rideshare driver\'s status at the time and available insurance.' })
  else if (spoke === 'do-i-need-a-lawyer') b.push({ blockType: 'articleProseContent', sections: REF.sections.map(s => ({ heading: s.title, body: s.content.join('\n\n') })) })
  else if (spoke === 'statute-of-limitations') b.push({ blockType: 'articleStatuteBars', heading: 'Statute of Limitations for Rideshare Accident Claims', bars: [{ deadline: '2 Years', states: 'Most states', widthPercent: 55 }, { deadline: '3 Years', states: 'California, Georgia, Louisiana, Montana', widthPercent: 25 }, { deadline: '1 Year', states: 'VA, MD, DC (contributory negligence)', widthPercent: 20 }], footnote: 'Statutes vary by state. Consult a rideshare accident attorney to confirm your deadline.' })
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
