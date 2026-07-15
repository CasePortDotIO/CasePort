/**
 * seed-wrongful-death-articles.ts
 * Run: npx tsx seed-wrongful-death-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const REF = {
  title: 'Wrongful Death Claims: Seeking Justice and Maximum Recovery',
  directAnswer: "Wrongful death claims allow family members to recover damages when a loved one dies due to another party's negligence. Average wrongful death settlements range from $100,000 to $1,000,000+ depending on the deceased's age, earning potential, and relationship to the family. Wrongful death claims are emotionally complex but legally straightforward: if negligence caused death, the responsible party is liable for all damages including lost income, funeral expenses, and pain and suffering of surviving family members.",
  keyFacts: [
    'Wrongful death claims allow family members to recover damages when a loved one dies due to negligence',
    "Damages include lost income, funeral expenses, and pain and suffering of surviving family members",
    "The deceased's age and earning potential are primary factors in settlement value",
    'Wrongful death claims are emotionally complex but legally straightforward',
    'Early legal action is critical to preserve evidence and protect family interests',
  ],
  sections: [
    {
      title: 'What Constitutes Wrongful Death',
      content: [
        "Wrongful death occurs when a person dies as a result of another party's negligence, recklessness, or intentional conduct.",
        'Wrongful death claims can arise from car accidents, truck accidents, pedestrian accidents, medical malpractice, workplace accidents, and other incidents involving negligence.',
        "To prove wrongful death, you must show that the responsible party owed a duty of care, breached that duty, and the breach caused the death.",
      ],
    },
    {
      title: 'Who Can File a Wrongful Death Claim',
      content: [
        "Wrongful death claims are filed by the deceased's estate or by surviving family members. The specific family members depend on state law.",
        'In some states, only the estate can file a wrongful death claim. In other states, surviving family members can file directly.',
        "If the deceased had no surviving family members, the claim may be filed by the estate for the benefit of creditors and other parties.",
      ],
    },
    {
      title: 'Calculating Wrongful Death Damages',
      content: [
        "Wrongful death damages include economic damages (lost income, lost benefits, funeral expenses) and non-economic damages (pain and suffering of surviving family members).",
        "Lost income is calculated based on the deceased's age, earning potential, and life expectancy.",
        "Non-economic damages depend on the relationship between the deceased and surviving family members. Spouses and minor children typically recover higher non-economic damages.",
      ],
    },
    {
      title: 'The Emotional and Legal Process',
      content: [
        'Wrongful death claims are emotionally complex. Families are grieving while also pursuing legal action.',
        'The legal process includes investigation, evidence preservation, negotiation, and potentially litigation.',
        'Settlement negotiations in wrongful death cases are often complex because multiple family members may have different interests.',
      ],
    },
  ],
  faqs: [
    { q: 'Who can file a wrongful death claim?', a: "Typically a spouse, children, or parents of the deceased — the specific rules vary by state." },
    { q: 'How are wrongful death damages calculated?', a: "Damages include economic losses (lost income, lost benefits, funeral expenses) and non-economic losses (pain and suffering)." },
    { q: 'Can punitive damages be awarded in wrongful death cases?', a: 'Yes. If the responsible party acted recklessly or intentionally — such as in drunk driving cases — punitive damages may be available.' },
    { q: 'How long do I have to file a wrongful death claim?', a: 'Statutes of limitation for wrongful death vary by state, typically 1 to 6 years from the date of death. Missing this deadline permanently bars the claim. Consult an attorney immediately.' },
  ],
}

const EXPERT = { reviewerName: 'Jennifer M. Cole', credentials: 'Wrongful Death & Catastrophic Injury | Board Certified, Personal Injury Trial Law', quote: "Wrongful death cases are about replacing what was taken. The economic model is straightforward." }
const SOURCES = { citeTitle: 'Wrongful Death Guide', sources: [{ name: 'American Bar Association (ABA) — Wrongful Death Actions', url: 'https://www.americanbar.org/' }, { name: 'National Center for State Courts (NCSC)', url: 'https://www.ncsc.org/' }, { name: 'U.S. Courts — Federal Tort Claims Act', url: 'https://www.uscourts.gov/' }] }

const PILLAR = 'wrongful-death'
const CATEGORY_SLUG = 'wrongful-death'
const PILLAR_NAME = 'Wrongful Death'

const SPOKES = [
  { slug: 'what-to-do', label: 'What To Do After' },
  { slug: 'settlement-amounts', label: 'Settlement Amounts' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer' },
  { slug: 'statute-of-limitations', label: 'How Long to File' },
] as const

async function upsert(payload: any, slug: string, title: string, authorId: number, categoryId: number) {
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  const data = { title, slug, subtitle: 'Wrongful death claim guidance.', focusKeyword: `wrongful death ${slug.split('-').pop()?.replace(/-/g, ' ')}`, secondaryKeywords: [{ keyword: 'wrongful death settlement' }, { keyword: 'how to file a wrongful death claim' }], metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155), schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId }
  if (r.docs[0]) await payload.update({ collection: 'guideArticles', id: r.docs[0].id, data })
  else await payload.create({ collection: 'guideArticles', data })
}

function makeBlocks(id: number, spoke: string, otherIds: number[]) {
  const b: any[] = []
  b.push({ blockType: 'articleDirectAnswer', heading: spoke === 'what-to-do' ? `What To Do After a ${PILLAR_NAME}` : REF.title, text: spoke === 'what-to-do' ? 'When a loved one dies due to someone else\'s negligence, the first steps are critical. Here is what your family needs to do.' : REF.directAnswer })
  b.push({ blockType: 'articleKeyTakeaways', items: REF.keyFacts.map(f => ({ fact: f })) })
  b.push({ blockType: 'articleFAQ', items: REF.faqs.map(f => ({ question: f.q, answerText: f.a })) })
  b.push({ blockType: 'articleSources', citeTitle: SOURCES.citeTitle, sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })) })
  b.push({ blockType: 'articleExpert', quote: EXPERT.quote, reviewerName: EXPERT.reviewerName, credentials: EXPERT.credentials })
  b.push({ blockType: 'articleCTA', title: 'Get a Free Case Review', subtitle: 'A law firm member will review your claim at no cost and tell you what your family may be entitled to.', buttonLabel: 'Check My Case', buttonLink: '/checkmycase' })
  if (spoke === 'what-to-do') b.push({ blockType: 'articleTimelineSteps', heading: `${PILLAR_NAME} — Step by Step`, steps: REF.sections.map((s, i) => ({ stepName: `${i + 1}. ${s.title}`, stepDescription: s.content[0] ?? '' })), note: 'Step order reflects the most important actions for families pursuing a wrongful death claim.' })
  else if (spoke === 'settlement-amounts') b.push({ blockType: 'articleSettlementTable', heading: 'Estimated Wrongful Death Settlement Ranges', rows: [{ severity: 'Average Recovery', description: 'Typical range based on deceased\'s age and earning potential', range: '$100,000 – $500,000' }, { severity: 'High-Value Cases', description: 'Young deceased with high earning potential, minor children', range: '$500,000 – $1,000,000+' }, { severity: 'Catastrophic / Punitive', description: 'Dram-shop, DUI, intentional conduct — punitive damages available', range: '$1,000,000 – $5,000,000+' }], footnote: 'Wrongful death settlements are highly case-specific. The deceased\'s age, income, relationships, and the circumstances of death all factor in.' })
  else if (spoke === 'do-i-need-a-lawyer') b.push({ blockType: 'articleProseContent', sections: REF.sections.map(s => ({ heading: s.title, body: s.content.join('\n\n') })) })
  else if (spoke === 'statute-of-limitations') b.push({ blockType: 'articleStatuteBars', heading: 'Statute of Limitations for Wrongful Death Claims', bars: [{ deadline: '2 Years', states: 'Most states', widthPercent: 55 }, { deadline: '3 Years', states: 'California, Louisiana, Montana', widthPercent: 25 }, { deadline: '1 Year', states: 'VA, MD, DC (contributory negligence — may apply)', widthPercent: 20 }], footnote: 'Wrongful death statutes of limitation vary by state and by the underlying claim. Consult an attorney immediately — missing the deadline permanently bars your claim.' })
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
