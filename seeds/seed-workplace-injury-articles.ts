/**
 * seed-workplace-injury-articles.ts
 * Run: npx tsx seed-workplace-injury-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const REF = {
  title: "Workplace Injury Claims: Beyond Workers' Compensation",
  directAnswer: "Most workplace injuries are covered by workers' compensation, which pays medical bills and partial lost wages regardless of fault — but bars you from suing your employer. The bigger recovery often comes from a third-party claim against a negligent party who is not your employer: an equipment manufacturer, a subcontractor, a property owner, or a driver in a work-related crash. Average third-party workplace settlements range from $50,000 to $500,000+ and, unlike workers' comp, can include full pain-and-suffering damages.",
  keyFacts: [
    "Workers' comp pays medical bills and partial wages regardless of fault, but bars pain-and-suffering",
    "A third-party claim against a non-employer can recover full damages, including pain and suffering",
    "Common third parties: equipment makers, subcontractors, property owners, and other drivers",
    "You can usually pursue workers' comp and a third-party claim at the same time",
    "Workers' comp deadlines are short — report the injury to your employer immediately",
  ],
  sections: [
    {
      title: "Workers' Compensation: What It Covers and Its Limits",
      content: [
        "Workers' compensation is a no-fault system: it pays your medical bills and a portion of your lost wages regardless of who caused the injury.",
        "The trade-off is significant. Workers' comp does not pay for pain and suffering, and it replaces only part of your wages.",
        "Workers' comp deadlines are strict. Report the injury to your employer immediately and in writing — late reporting is a common reason valid claims are denied.",
      ],
    },
    {
      title: "The Third-Party Claim: Where the Real Value Often Is",
      content: [
        "A third-party claim is a separate lawsuit against a negligent party who is not your employer. Unlike workers' comp, a third-party claim can recover full damages.",
        'Common third parties include the manufacturer of defective equipment, a subcontractor or general contractor on a job site, the property owner where you were injured, and the at-fault driver in a work-related vehicle crash.',
        "You can usually pursue both at once: workers' comp covers immediate medical and wage needs while the third-party claim pursues the full value of your injury.",
      ],
    },
    {
      title: 'Common Third-Party Workplace Scenarios',
      content: [
        'Defective machinery and tools: when equipment lacks proper guards or fails due to a design or manufacturing defect, the manufacturer may be liable in a product-liability claim.',
        'Construction sites: with multiple companies on one site, a subcontractor or general contractor whose negligence injured you can be a third-party defendant separate from your direct employer.',
        "Work-related vehicle crashes: if you are injured driving for work by another negligent driver, that driver (and their insurer) is a third party — in addition to any workers' comp benefits.",
      ],
    },
    {
      title: 'Coordinating Comp and Third-Party Recovery',
      content: [
        "When you recover from both workers' comp and a third-party claim, your employer's comp insurer typically has a lien.",
        'Skilled handling of the comp lien can substantially increase your net recovery, sometimes reducing or waiving the reimbursement owed.',
        "Because the two systems interact in complex ways, workplace injuries with a potential third party benefit most from early, coordinated legal guidance.",
      ],
    },
  ],
  faqs: [
    { q: "Can I sue my employer for a workplace injury?", a: "Generally no. Workers' compensation bars lawsuits against your employer. However, you can pursue a third-party claim against a negligent party who is not your employer." },
    { q: 'What is a third-party workplace injury claim?', a: "A third-party claim is a lawsuit against a negligent party who is not your employer — such as a contractor, equipment manufacturer, property owner, or driver." },
    { q: "How do I protect my workers' comp claim?", a: "Report the injury to your employer immediately and in writing. Seek medical attention right away and follow all treatment recommendations." },
    { q: "What's the difference between workers' comp and a third-party claim?", a: "Workers' comp pays medical bills and partial wages regardless of fault, but bars pain-and-suffering damages. A third-party claim can recover full damages including pain and suffering, but requires proving negligence by a non-employer." },
  ],
}

const EXPERT = { reviewerName: 'Christopher D. Hayes', credentials: "Workers' Comp + Third-Party Specialist | 20 Years Texas Workplace Injury", quote: "The third-party claim is almost always worth more than the workers' comp claim. The mistake people make is settling comp first, which triggers a lien." }
const SOURCES = { citeTitle: 'Workplace Injury Guide', sources: [{ name: 'Occupational Safety and Health Administration (OSHA)', url: 'https://www.osha.gov/' }, { name: 'U.S. Department of Labor — Workers Compensation', url: 'https://www.dol.gov/agencies/owcp/sec12' }, { name: 'National Safety Council (NSC)', url: 'https://www.nsc.org/' }] }

const PILLAR = 'workplace-injury'
const CATEGORY_SLUG = 'workplace-injuries'
const PILLAR_NAME = 'Workplace Injury'

const SPOKES = [
  { slug: 'what-to-do', label: 'What To Do After' },
  { slug: 'settlement-amounts', label: 'Settlement Amounts' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer' },
  { slug: 'statute-of-limitations', label: 'How Long to File' },
] as const

async function upsert(payload: any, slug: string, title: string, authorId: number, categoryId: number) {
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  const data = { title, slug, subtitle: 'Workplace injury claim guidance.', focusKeyword: `workplace injury ${slug.split('-').pop()?.replace(/-/g, ' ')}`, secondaryKeywords: [{ keyword: 'workers compensation claim' }, { keyword: 'third party workplace lawsuit' }], metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155), schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId }
  if (r.docs[0]) await payload.update({ collection: 'guideArticles', id: r.docs[0].id, data })
  else await payload.create({ collection: 'guideArticles', data })
}

function makeBlocks(id: number, spoke: string, otherIds: number[]) {
  const b: any[] = []
  b.push({ blockType: 'articleDirectAnswer', heading: spoke === 'what-to-do' ? `What To Do After a ${PILLAR_NAME}` : REF.title, text: spoke === 'what-to-do' ? 'The first 72 hours after a workplace injury are critical. Here is what you need to do.' : REF.directAnswer })
  b.push({ blockType: 'articleKeyTakeaways', items: REF.keyFacts.map(f => ({ fact: f })) })
  b.push({ blockType: 'articleFAQ', items: REF.faqs.map(f => ({ question: f.q, answerText: f.a })) })
  b.push({ blockType: 'articleSources', citeTitle: SOURCES.citeTitle, sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })) })
  b.push({ blockType: 'articleExpert', quote: EXPERT.quote, reviewerName: EXPERT.reviewerName, credentials: EXPERT.credentials })
  b.push({ blockType: 'articleCTA', title: 'Get a Free Case Review', subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.', buttonLabel: 'Check My Case', buttonLink: '/checkmycase' })
  if (spoke === 'what-to-do') b.push({ blockType: 'articleTimelineSteps', heading: `${PILLAR_NAME} — Step by Step`, steps: REF.sections.map((s, i) => ({ stepName: `${i + 1}. ${s.title}`, stepDescription: s.content[0] ?? '' })), note: 'Step order reflects the most important actions after a workplace injury.' })
  else if (spoke === 'settlement-amounts') b.push({ blockType: 'articleSettlementTable', heading: 'Estimated Workplace Injury Settlement Ranges (Third-Party Claims)', rows: [{ severity: "Workers' Comp Only", description: "Medical + partial wages only; no pain and suffering", range: '$10,000 – $50,000' }, { severity: 'Minor Third-Party', description: 'Soft tissue, quick recovery with third-party claim', range: '$50,000 – $150,000' }, { severity: 'Serious Third-Party', description: 'Fractures, surgery, significant medical with third-party', range: '$150,000 – $500,000' }, { severity: 'Catastrophic Third-Party', description: 'Amputation, permanent disability, wrongful death', range: '$500,000 – $2,000,000+' }], footnote: "Workers' comp alone rarely exceeds $50K. Third-party claims can be worth 10x more. Settlement ranges are illustrative." })
  else if (spoke === 'do-i-need-a-lawyer') b.push({ blockType: 'articleProseContent', sections: REF.sections.map(s => ({ heading: s.title, body: s.content.join('\n\n') })) })
  else if (spoke === 'statute-of-limitations') b.push({ blockType: 'articleStatuteBars', heading: 'Statute of Limitations for Workplace Injury Claims', bars: [{ deadline: '2 Years', states: "Workers' comp: most states | Third-party: most states", widthPercent: 55 }, { deadline: '1 Year', states: "Workers' comp: some states (TX, FL)", widthPercent: 25 }, { deadline: '6 Months', states: "Workers' comp: some states for federal employees (FECA)", widthPercent: 20 }], footnote: "Workers' comp deadlines are very short — report to your employer immediately. Third-party claims have longer statutes. Consult an attorney." })
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
