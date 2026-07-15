/**
 * seed-medical-malpractice-articles.ts
 * Run: npx tsx seed-medical-malpractice-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Reference: guides.ts → CP.guides['medical-malpractice']
const REF = {
  title: 'Medical Malpractice: What It Takes to Prove a Claim',
  directAnswer: "Medical malpractice occurs when a healthcare provider deviates from the accepted standard of care and that deviation injures the patient. It is one of the most complex and heavily-regulated areas of personal injury: nearly every state requires an expert physician to certify the claim, damage caps often apply, and deadlines are short and unusual. Not every bad outcome is malpractice — medicine carries inherent risk. The question is always whether a competent provider, in the same situation, would have acted differently. Strong cases pair a clear standard-of-care breach with serious, documented harm.",
  keyFacts: [
    "Malpractice requires a breach of the accepted standard of care — not just a bad outcome",
    "Most states require an expert physician affidavit to even file the case",
    "Many states cap non-economic damages in malpractice specifically",
    "Statutes of limitations are short and often run from discovery of the harm",
    "Common types: misdiagnosis, surgical error, medication error, birth injury",
  ],
  sections: [
    {
      title: 'What Counts as Medical Malpractice',
      content: [
        "Medical malpractice has four elements: a duty of care (a provider-patient relationship), a breach of the accepted standard of care, causation (the breach caused the injury), and damages (real harm resulted). All four must be present — a poor outcome alone is not enough.",
        "The 'standard of care' is what a reasonably competent provider in the same specialty would have done in the same circumstances. Establishing it almost always requires testimony from a qualified physician in the same field.",
        "Common malpractice types include misdiagnosis or delayed diagnosis, surgical errors, medication and dosage errors, anesthesia errors, birth injuries, and failure to obtain informed consent.",
      ],
    },
    {
      title: 'Why These Cases Are Different',
      content: [
        "Medical malpractice is procedurally unlike other injury claims. Most states require a 'certificate of merit' or expert affidavit — a qualified physician must attest the case has merit — before you can file. This raises the cost and bar to entry.",
        "Many states also impose caps on non-economic damages (pain and suffering) in malpractice cases specifically, even where no cap applies to ordinary injury claims. Economic damages — medical bills and lost earnings — are generally not capped.",
        "Deadlines are short and unusual. Some run from the date of the negligence, others from when the patient discovered (or should have discovered) the harm. Special rules apply to minors and to objects left in the body.",
      ],
    },
    {
      title: 'Proving Causation — the Hard Part',
      content: [
        "The toughest element in most malpractice cases is causation: proving the provider's breach — not the underlying illness — caused the harm. A patient who was already seriously ill presents a difficult 'but for' question.",
        "This is where expert evidence is decisive. Specialists reconstruct what should have happened, what did happen, and how the difference produced the injury. The quality of that expert testimony often determines the outcome.",
        "Because of the cost and complexity, reputable firms screen malpractice cases rigorously and take only those with both a clear breach and serious, documented damages.",
      ],
    },
    {
      title: 'What You Can Recover',
      content: [
        'Damages in medical malpractice cases include medical expenses, lost wages, and pain and suffering.',
        'Non-economic damages (pain and suffering) are capped in many states. Economic damages are generally not capped.',
        'In cases of egregious negligence, punitive damages may be available to punish the healthcare provider.',
      ],
    },
  ],
  faqs: [
    { q: "Is a bad outcome the same as medical malpractice?", a: "No. Malpractice requires that the provider breached the accepted standard of care and that the breach caused real harm." },
    { q: "Do I need an expert to file a medical malpractice case?", a: "In most states, yes. A 'certificate of merit' or expert affidavit from a qualified physician is typically required before filing." },
    { q: "How long do I have to file a medical malpractice claim?", a: "Deadlines are short and vary by state — and the clock may run from the date of the negligence or from when you discovered the harm." },
    { q: "What is the difference between medical malpractice and medical negligence?", a: "Medical malpractice is a broader legal term that includes negligence, but also encompasses informed consent violations and fiduciary duty breaches. All malpractice is negligence, but not all negligence rises to malpractice level." },
  ],
}

const EXPERT = { reviewerName: 'Dr. Anthony R. Vega', credentials: 'MD, JD | Former Chief of Surgery, UT Southwestern | Medical Malpractice Consultant', quote: "Not every bad outcome is malpractice. The line is whether the provider breached the standard of care." }
const SOURCES = { citeTitle: 'Medical Malpractice Guide', sources: [{ name: 'American Medical Association (AMA) — Medical Liability Reform', url: 'https://www.ama-assn.org/' }, { name: 'National Practitioner Data Bank (NPDB)', url: 'https://www.npdb.hrsa.gov/' }, { name: 'Agency for Healthcare Research and Quality (AHRQ)', url: 'https://www.ahrq.gov/' }] }

const PILLAR = 'medical-malpractice'
const CATEGORY_SLUG = 'medical-malpractice'
const PILLAR_NAME = 'Medical Malpractice'

const SPOKES = [
  { slug: 'what-to-do', label: 'What To Do After' },
  { slug: 'settlement-amounts', label: 'Settlement Amounts' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer' },
  { slug: 'statute-of-limitations', label: 'How Long to File' },
] as const

async function upsert(payload: any, slug: string, title: string, authorId: number, categoryId: number) {
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  const data = { title, slug, subtitle: 'Medical malpractice claim guidance.', focusKeyword: `medical malpractice ${slug.split('-').pop()?.replace(/-/g, ' ')}`, secondaryKeywords: [{ keyword: 'medical malpractice claim' }, { keyword: 'medical negligence lawsuit' }], metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155), schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId }
  if (r.docs[0]) await payload.update({ collection: 'guideArticles', id: r.docs[0].id, data })
  else await payload.create({ collection: 'guideArticles', data })
}

function makeBlocks(id: number, spoke: string, otherIds: number[]) {
  const b: any[] = []
  b.push({ blockType: 'articleDirectAnswer', heading: spoke === 'what-to-do' ? `What To Do After Medical Malpractice` : REF.title, text: spoke === 'what-to-do' ? 'Medical malpractice cases are complex. Here is what you need to know and do if you believe you have been harmed by a healthcare provider.' : REF.directAnswer })
  b.push({ blockType: 'articleKeyTakeaways', items: REF.keyFacts.map(f => ({ fact: f })) })
  b.push({ blockType: 'articleFAQ', items: REF.faqs.map(f => ({ question: f.q, answerText: f.a })) })
  b.push({ blockType: 'articleSources', citeTitle: SOURCES.citeTitle, sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })) })
  b.push({ blockType: 'articleExpert', quote: EXPERT.quote, reviewerName: EXPERT.reviewerName, credentials: EXPERT.credentials })
  b.push({ blockType: 'articleCTA', title: 'Get a Free Case Review', subtitle: 'A law firm member will review your potential malpractice claim at no cost.', buttonLabel: 'Check My Case', buttonLink: '/checkmycase' })
  if (spoke === 'what-to-do') b.push({ blockType: 'articleTimelineSteps', heading: `${PILLAR_NAME} — Step by Step`, steps: REF.sections.map((s, i) => ({ stepName: `${i + 1}. ${s.title}`, stepDescription: s.content[0] ?? '' })), note: 'Step-by-step guidance for pursuing a medical malpractice claim.' })
  else if (spoke === 'settlement-amounts') b.push({ blockType: 'articleSettlementTable', heading: 'Estimated Medical Malpractice Settlement Ranges', rows: [{ severity: 'Proof Standard', description: 'Expert physician required to certify claim', range: 'Varies' }, { severity: 'Non-Economic Caps', description: 'Many states cap pain and suffering damages specifically', range: '$250K–$750K' }, { severity: 'Economic Damages', description: 'Medical bills, lost wages — generally NOT capped', range: 'Uncapped' }, { severity: 'Typical Range', description: 'Strong malpractice cases with documented harm', range: '$250,000 – $1,000,000+' }], footnote: 'Malpractice case values depend heavily on injury severity, expert support, and state-specific damage caps. Many states have caps specific to malpractice.' })
  else if (spoke === 'do-i-need-a-lawyer') b.push({ blockType: 'articleProseContent', sections: REF.sections.map(s => ({ heading: s.title, body: s.content.join('\n\n') })) })
  else if (spoke === 'statute-of-limitations') b.push({ blockType: 'articleStatuteBars', heading: 'Statute of Limitations for Medical Malpractice Claims', bars: [{ deadline: '2 Years', states: 'Most states (from date of injury/neglect)', widthPercent: 40 }, { deadline: '1–2 Years', states: 'Discovery rule: from when injury was or should have been discovered', widthPercent: 35 }, { deadline: 'Special Rules', states: 'Minors, foreign objects left in body, tolling provisions', widthPercent: 25 }], footnote: 'Malpractice statutes are short and often run from discovery, not the date of the procedure. Some states have caps on non-economic damages. Consult a malpractice attorney immediately.' })
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
