/**
 * seed-dog-bite-articles.ts
 * Run: npx tsx seed-dog-bite-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const REF = {
  title: 'Dog Bite Claims: Holding Negligent Dog Owners Accountable',
  directAnswer: "Dog bite claims hold dog owners responsible for injuries caused by their dogs. Average dog bite settlements range from $15,000 to $100,000+ depending on injury severity and the dog owner's negligence. Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression. Dog bite injuries often require multiple surgeries, result in permanent scarring, and cause psychological trauma. Early medical documentation and evidence preservation are critical.",
  keyFacts: [
    "Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression",
    "Dog bite injuries often require multiple surgeries and result in permanent scarring",
    "Psychological trauma (fear of dogs, anxiety) is a valid claim in dog bite cases",
    "Dog owners have a duty to control their dogs and prevent them from injuring others",
    "Early medical documentation and evidence preservation are critical to maximize recovery",
  ],
  sections: [
    {
      title: 'Strict Liability vs. Negligence in Dog Bite Cases',
      content: [
        'Most states (35+) apply strict liability for dog bites, meaning the dog owner is liable for injuries their dog causes even if the dog had no history of aggression.',
        'Strict liability removes the need to prove that the dog owner was negligent. You only need to prove that the dog bit you and caused injury.',
        "A few states apply a 'one bite rule' where the dog owner is liable only if they knew the dog was dangerous.",
      ],
    },
    {
      title: 'Dog Bite Injuries and Medical Treatment',
      content: [
        'Dog bite injuries range from minor puncture wounds to severe lacerations requiring multiple surgeries. Severe bites often cause permanent scarring and disfigurement.',
        'Dog bite injuries often become infected because dog mouths contain bacteria. Immediate medical treatment is critical.',
        'Dog bite injuries often require multiple surgeries to repair tissue damage, reduce scarring, and restore function.',
      ],
    },
    {
      title: 'Psychological Trauma and Emotional Damages',
      content: [
        'Dog bite injuries often cause psychological trauma including fear of dogs, anxiety, and post-traumatic stress disorder (PTSD).',
        'Children are particularly vulnerable to psychological trauma from dog bites.',
        'Psychological trauma is documented through mental health treatment records.',
      ],
    },
    {
      title: 'Holding Dog Owners Accountable',
      content: [
        'Dog owners have a duty to control their dogs and prevent them from injuring others.',
        'Dog owners who violate local leash laws or allow dogs to roam free are negligent.',
        'If the dog owner knew the dog was dangerous and failed to take precautions, this may justify punitive damages.',
      ],
    },
  ],
  faqs: [
    { q: 'What is strict liability for dog bites?', a: 'Most states apply strict liability, meaning the dog owner is automatically liable for injuries their dog causes — regardless of whether the dog had previously shown aggression.' },
    { q: 'What damages can I recover in a dog bite case?', a: 'Damages include medical expenses, lost wages, pain and suffering, scarring and disfigurement, and psychological trauma including PTSD and anxiety.' },
    { q: 'Can I recover if I was partially at fault for the dog bite?', a: 'In most comparative negligence states, your recovery is reduced by your percentage of fault. However, strict liability states bar this defense.' },
    { q: 'What should I do immediately after being bitten by a dog?', a: 'Seek immediate medical attention — dog bites can cause serious infection. Identify the dog and its owner, photograph your injuries, collect witness information, and report the bite to local animal control.' },
  ],
}

const EXPERT = { reviewerName: 'Linda K. Foster', credentials: 'Dog Bite & Animal Law Specialist | Author: Texas Animal Liability Handbook', quote: "Strict liability means the owner is on the hook regardless of the dog's history. What people don't realize is how much the medical records matter." }
const SOURCES = { citeTitle: 'Dog Bite Guide', sources: [{ name: 'American Veterinary Medical Association (AVMA)', url: 'https://www.avma.org/' }, { name: 'Centers for Disease Control and Prevention (CDC) — Dog Bite Prevention', url: 'https://www.cdc.gov/injury-and-violence-prevention/dog-bites/' }, { name: 'State Bar of Texas — Animal Liability', url: 'https://www.texasbar.com/' }] }

const PILLAR = 'dog-bite'
const CATEGORY_SLUG = 'dog-bites'
const PILLAR_NAME = 'Dog Bite'

const SPOKES = [
  { slug: 'what-to-do', label: 'What To Do After' },
  { slug: 'settlement-amounts', label: 'Settlement Amounts' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer' },
  { slug: 'statute-of-limitations', label: 'How Long to File' },
] as const

async function upsert(payload: any, slug: string, title: string, authorId: number, categoryId: number) {
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  const data = { title, slug, subtitle: 'Dog bite claim guidance.', focusKeyword: `dog bite ${slug.split('-').pop()?.replace(/-/g, ' ')}`, secondaryKeywords: [{ keyword: 'dog bite settlement' }, { keyword: 'dog bite lawsuit' }], metaTitle: `${title} | CasePort`, metaDescription: REF.directAnswer.slice(0, 155), schemaType: 'Article', _status: 'published', _isSeeding: true, author: authorId, guideCategory: categoryId }
  if (r.docs[0]) await payload.update({ collection: 'guideArticles', id: r.docs[0].id, data })
  else await payload.create({ collection: 'guideArticles', data })
}

function makeBlocks(id: number, spoke: string, otherIds: number[]) {
  const b: any[] = []
  b.push({ blockType: 'articleDirectAnswer', heading: spoke === 'what-to-do' ? `What To Do After a ${PILLAR_NAME}` : REF.title, text: spoke === 'what-to-do' ? 'The first 72 hours after a dog bite are critical. Here is what you need to do.' : REF.directAnswer })
  b.push({ blockType: 'articleKeyTakeaways', items: REF.keyFacts.map(f => ({ fact: f })) })
  b.push({ blockType: 'articleFAQ', items: REF.faqs.map(f => ({ question: f.q, answerText: f.a })) })
  b.push({ blockType: 'articleSources', citeTitle: SOURCES.citeTitle, sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })) })
  b.push({ blockType: 'articleExpert', quote: EXPERT.quote, reviewerName: EXPERT.reviewerName, credentials: EXPERT.credentials })
  b.push({ blockType: 'articleCTA', title: 'Get a Free Case Review', subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.', buttonLabel: 'Check My Case', buttonLink: '/checkmycase' })
  if (spoke === 'what-to-do') b.push({ blockType: 'articleTimelineSteps', heading: `${PILLAR_NAME} — Step by Step`, steps: REF.sections.map((s, i) => ({ stepName: `${i + 1}. ${s.title}`, stepDescription: s.content[0] ?? '' })), note: 'Step order reflects the most important actions after a dog bite.' })
  else if (spoke === 'settlement-amounts') b.push({ blockType: 'articleSettlementTable', heading: 'Estimated Dog Bite Settlement Ranges', rows: [{ severity: 'Minor Wound', description: 'Puncture wounds, minor lacerations, quick recovery', range: '$15,000 – $35,000' }, { severity: 'Serious Injury', description: 'Lacerations requiring stitches, infection, scarring', range: '$35,000 – $75,000' }, { severity: 'Severe Injury', description: 'Multiple surgeries, plastic surgery, permanent scarring', range: '$75,000 – $150,000+' }, { severity: 'Catastrophic', description: 'Children attacked, severe psychological trauma, disfigurement', range: '$150,000 – $500,000+' }], footnote: 'Dog bite settlement ranges are illustrative. Your actual settlement depends on liability and injury documentation.' })
  else if (spoke === 'do-i-need-a-lawyer') b.push({ blockType: 'articleProseContent', sections: REF.sections.map(s => ({ heading: s.title, body: s.content.join('\n\n') })) })
  else if (spoke === 'statute-of-limitations') b.push({ blockType: 'articleStatuteBars', heading: 'Statute of Limitations for Dog Bite Claims', bars: [{ deadline: '2 Years', states: 'Most states', widthPercent: 55 }, { deadline: '3 Years', states: 'California, Louisiana', widthPercent: 25 }, { deadline: '1 Year', states: 'VA, MD, DC (contributory negligence)', widthPercent: 20 }], footnote: 'Statutes vary by state. Some have special rules for minors and discovery. Consult a dog bite attorney to confirm your deadline.' })
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
