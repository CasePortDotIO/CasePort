/**
 * seed-slip-and-fall-articles.ts
 * Run: npx tsx seed-slip-and-fall-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const REF = {
  title: 'Slip and Fall Claims: Proving Premises Liability',
  directAnswer: "Slip and fall claims are premises liability cases where a property owner or manager is responsible for injuries caused by unsafe conditions on their property. Average slip and fall settlements range from $10,000 to $100,000+ depending on injury severity and the property owner's negligence. Proving premises liability requires showing that the property owner knew or should have known about the unsafe condition and failed to fix it or warn visitors. Property owners often dispute liability, making early evidence preservation critical.",
  keyFacts: [
    'Slip and fall claims are premises liability cases where property owners are responsible for unsafe conditions',
    'Property owners must maintain safe conditions and warn visitors of known hazards',
    'Proving premises liability requires showing the property owner knew or should have known about the unsafe condition',
    'Property owners often dispute liability and argue that the visitor was careless',
    'Early evidence preservation (photographs, witness statements, maintenance records) is critical',
  ],
  sections: [
    {
      title: 'Understanding Premises Liability',
      content: [
        'Premises liability is the legal doctrine that property owners are responsible for injuries caused by unsafe conditions on their property.',
        'Property owners have a duty to inspect their property regularly and identify unsafe conditions. They also have a duty to fix unsafe conditions or warn visitors.',
        'Property owners are liable for injuries caused by unsafe conditions only if they knew or should have known about the condition.',
      ],
    },
    {
      title: 'Proving the Property Owner Knew or Should Have Known',
      content: [
        'Proving that the property owner knew or should have known about the unsafe condition is critical to premises liability claims.',
        'Maintenance records are critical evidence. If the property owner failed to inspect or maintain the property, this shows constructive notice.',
        'Photographs of the unsafe condition are critical. Take photographs immediately after the accident showing the exact condition that caused your injury.',
      ],
    },
    {
      title: 'Common Slip and Fall Hazards',
      content: [
        'Common slip and fall hazards include wet floors, ice, debris, uneven surfaces, poor lighting, and broken stairs.',
        'Wet floor hazards require evidence that the property owner failed to dry the floor or warn visitors. Ice hazards require evidence that the property owner failed to salt or sand the surface.',
        'Uneven surface and broken stair hazards require evidence that the property owner knew about the condition and failed to fix it.',
      ],
    },
    {
      title: 'Property Owner Defenses and How to Counter Them',
      content: [
        'Property owners often argue that the visitor was careless and should have seen the hazard. This is called assumption of risk or comparative negligence.',
        'Property owners also argue that the hazard was open and obvious and therefore they had no duty to warn.',
        'Property owners may also argue that they did not have constructive notice of the hazard because they inspected the property regularly.',
      ],
    },
  ],
  faqs: [
    { q: 'How do I prove a slip and fall claim?', a: 'Prove that the property owner knew or should have known about the unsafe condition and failed to fix it or warn you. Critical evidence includes photographs, witness statements, and maintenance records.' },
    { q: 'What are the most common slip and fall hazards?', a: 'Wet floors, ice and snow, uneven surfaces, poor lighting, broken stairs, and debris are the most common.' },
    { q: 'Can I sue if I was distracted when I slipped?', a: 'Comparative negligence may reduce your recovery proportionally if you were partially at fault, but it does not usually bar a claim entirely.' },
    { q: 'How long do I have to file a slip and fall claim?', a: 'Statutes of limitation for slip and fall vary by state, typically 1 to 6 years from the date of the incident. Most states fall in the 2–3 year range. Property owners often destroy evidence quickly — act immediately.' },
  ],
}

const EXPERT = { reviewerName: 'Michael D. Carr', credentials: 'Premises Liability Attorney | Former Insurance Defense Counsel', quote: "I spent years defending property owners. The cases that killed them were the ones where someone had photographed the hazard and had a witness." }
const SOURCES = { citeTitle: 'Slip and Fall Guide', sources: [{ name: 'American Bar Association (ABA) — Premises Liability', url: 'https://www.americanbar.org/' }, { name: 'National Safety Council (NSC) — Slips, Trips & Falls', url: 'https://www.nsc.gov/work-safety/topics/slips-trips' }, { name: 'Occupational Safety and Health Administration (OSHA)', url: 'https://www.osha.gov/' }] }

const PILLAR = 'slip-and-fall'
const CATEGORY_SLUG = 'slip-and-fall'
const PILLAR_NAME = 'Slip and Fall'

const SPOKES = [
  { slug: 'what-to-do', label: 'What To Do After' },
  { slug: 'settlement-amounts', label: 'Settlement Amounts' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer' },
  { slug: 'statute-of-limitations', label: 'How Long to File' },
] as const

async function upsert(payload: any, slug: string, title: string, authorId: number, categoryId: number) {
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  const data = { title, slug, subtitle: 'Slip and fall claim guidance.', focusKeyword: `slip and fall ${slug.split('-').pop()?.replace(/-/g, ' ')}`, secondaryKeywords: [{ keyword: 'premises liability' }, { keyword: 'slip and fall settlement' }], metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155), schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId }
  if (r.docs[0]) await payload.update({ collection: 'guideArticles', id: r.docs[0].id, data })
  else await payload.create({ collection: 'guideArticles', data })
}

function makeBlocks(id: number, spoke: string, otherIds: number[]) {
  const b: any[] = []
  b.push({ blockType: 'articleDirectAnswer', heading: spoke === 'what-to-do' ? `What To Do After a ${PILLAR_NAME}` : REF.title, text: spoke === 'what-to-do' ? 'The first 72 hours after a slip and fall are critical. Here is what you need to do.' : REF.directAnswer })
  b.push({ blockType: 'articleKeyTakeaways', items: REF.keyFacts.map(f => ({ fact: f })) })
  b.push({ blockType: 'articleFAQ', items: REF.faqs.map(f => ({ question: f.q, answerText: f.a })) })
  b.push({ blockType: 'articleSources', citeTitle: SOURCES.citeTitle, sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })) })
  b.push({ blockType: 'articleExpert', quote: EXPERT.quote, reviewerName: EXPERT.reviewerName, credentials: EXPERT.credentials })
  b.push({ blockType: 'articleCTA', title: 'Get a Free Case Review', subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.', buttonLabel: 'Check My Case', buttonLink: '/checkmycase' })
  if (spoke === 'what-to-do') b.push({ blockType: 'articleTimelineSteps', heading: `${PILLAR_NAME} — Step by Step`, steps: REF.sections.map((s, i) => ({ stepName: `${i + 1}. ${s.title}`, stepDescription: s.content[0] ?? '' })), note: 'Step order reflects the most important actions after a slip and fall accident.' })
  else if (spoke === 'settlement-amounts') b.push({ blockType: 'articleSettlementTable', heading: 'Estimated Slip and Fall Settlement Ranges', rows: [{ severity: 'Minor Injury', description: 'Sprains, bruises, quick recovery', range: '$10,000 – $35,000' }, { severity: 'Moderate Injury', description: 'Fractures, extended treatment', range: '$35,000 – $75,000' }, { severity: 'Severe Injury', description: 'Surgery, permanent damage, disability', range: '$75,000 – $200,000+' }, { severity: 'Catastrophic', description: 'Head trauma, spinal cord injury', range: '$200,000 – $1,000,000+' }], footnote: 'Settlement ranges are illustrative. Your actual settlement depends on property owner negligence and injury severity.' })
  else if (spoke === 'do-i-need-a-lawyer') b.push({ blockType: 'articleProseContent', sections: REF.sections.map(s => ({ heading: s.title, body: s.content.join('\n\n') })) })
  else if (spoke === 'statute-of-limitations') b.push({ blockType: 'articleStatuteBars', heading: 'Statute of Limitations for Slip and Fall Claims', bars: [{ deadline: '2 Years', states: 'Most states', widthPercent: 55 }, { deadline: '3 Years', states: 'California, Georgia, Louisiana, Montana', widthPercent: 25 }, { deadline: '1 Year', states: 'VA, MD, DC (contributory negligence)', widthPercent: 20 }], footnote: 'Statutes vary by state. Consult a slip and fall attorney to confirm your deadline.' })
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
