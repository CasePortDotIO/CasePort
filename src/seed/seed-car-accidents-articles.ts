/**
 * seed-car-accidents-articles.ts
 *
 * Seeds the 4 spoke articles for car-accidents category, using EXACT reference data
 * from caseport-nextjs/src/data/_src/accident-types.ts
 *
 * Blocks per article:
 *   what-to-do          → articleTimelineSteps (4 sections as steps)
 *   settlement-amounts  → articleSettlementTable (stats as rows)
 *   do-i-need-a-lawyer → articleProseContent (sections as prose)
 *   statute-of-limitations → articleStatuteBars
 *   + ALL spokes: articleDirectAnswer, articleKeyTakeaways, articleFAQ,
 *                 articleSources, articleExpert, articleCTA, articleRelatedGuides
 *
 * Run: npx tsx src/seed/seed-car-accidents-articles.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

// ─── Reference Data (copied verbatim from accident-types.ts) ─────────────────────

const CAR_ACCIDENT_REF = {
  title: 'Car Accident Claims: Your Complete Guide to Maximum Recovery',
  category: 'Car Accident',
  directAnswer: "Car accidents are the most common personal injury claims. Average car accident settlements range from $15,000 to $100,000+ depending on injury severity, liability clarity, and your state's negligence rule. In contributory negligence states (VA, MD, DC), even 1% fault eliminates your entire recovery. The first 72 hours after a car accident are critical for evidence preservation and claim value protection.",
  stats: [
    { label: 'Avg Settlement', value: '$47K' },
    { label: 'Statute (Years)', value: '2–3' },
    { label: 'Success Rate', value: '85%+' },
    { label: 'Time to Resolve', value: '6–12mo' },
  ],
  keyFacts: [
    'Car accident settlements are calculated using the multiplier method: economic damages × 1.5x to 5x',
    'Insurance adjusters make first offers 40–60% below final value to test your knowledge',
    'Contributory negligence states (VA, MD, DC) bar 100% of recovery if you are found any % at fault',
    'Surveillance footage is overwritten within 72 hours — preserve it immediately',
    'Medical documentation is the primary driver of settlement value',
  ],
  sections: [
    {
      title: 'How Car Accident Settlements Are Calculated',
      content: [
        'Car accident settlements use the multiplier method. Insurance adjusters calculate your economic damages (medical bills, lost wages, property damage) and multiply by a factor of 1.5x to 5x depending on injury severity. A $30,000 medical bill with a 2.5x multiplier results in a $75,000 settlement offer.',
        'The multiplier depends on injury severity. Minor injuries (soft tissue, full recovery in weeks) receive 1.5x to 2x. Moderate injuries (fractures, ongoing treatment) receive 2x to 3.5x. Severe injuries (permanent disability, chronic pain) receive 3.5x to 5x or higher.',
        "However, your state's negligence rule is applied first. In contributory negligence states, any fault eliminates your entire recovery. In comparative negligence states, your recovery is reduced by your percentage of fault. This is why understanding your state's negligence rule is critical.",
      ],
    },
    {
      title: 'Why First Settlement Offers Are Always Low',
      content: [
        'Insurance companies expect negotiation. First settlement offers are intentionally low, typically 40–60% below final value. Accepting the first offer means leaving significant money on the table.',
        "Insurance adjusters use psychological tactics to pressure you into accepting low offers: \"This is our best offer,\" \"Other claimants accepted less,\" \"You'll have to wait 2 years for trial.\" These are negotiation tactics, not facts.",
        'Do not accept the first offer. Negotiate. If negotiations stall, consider litigation. Juries often award higher verdicts than insurance adjusters offer, especially in clear-liability cases.',
      ],
    },
    {
      title: 'Evidence Preservation in Car Accidents',
      content: [
        'Surveillance footage is overwritten within 72 hours. After 72 hours, the footage is gone forever. If an accident occurred on Monday, the surveillance footage from nearby businesses, traffic cameras, and ATMs will be overwritten by Thursday. Contact these businesses immediately and request that they preserve the footage.',
        'Witness information is time-sensitive. Witness memory is most reliable immediately after an incident. Within days, witnesses forget details. Within weeks, they forget the incident entirely. Get names, phone numbers, email addresses, and written statements from all witnesses while memory is fresh.',
        'Physical evidence disappears quickly. Skid marks fade within hours. Debris is cleared by road maintenance crews. Vehicle damage patterns change as vehicles are moved or repaired. Take photographs from multiple angles immediately after the accident.',
      ],
    },
    {
      title: 'Medical Documentation and Claim Value',
      content: [
        'Your medical records document your injuries and recovery trajectory. Gaps in treatment allow insurance adjusters to argue that your injuries were minor or resolved quickly. Seek medical attention immediately after the accident, even if you feel fine.',
        "Some injuries (concussions, internal injuries, soft tissue damage) do not appear immediately. Comprehensive medical documentation is the foundation of your claim. Follow your doctor's treatment recommendations exactly. Do not skip appointments or treatments.",
        'Insurance adjusters scrutinize medical bills and treatment decisions. They argue that certain treatments were unnecessary, that you recovered too quickly, or that your injuries were minor. Detailed medical records protect your claim from these arguments.',
      ],
    },
  ],
  faqs: [
    {
      q: 'How is a car accident settlement calculated?',
      a: 'Car accident settlements use the multiplier method. Insurance adjusters calculate your economic damages (medical bills, lost wages, property damage) and multiply by a factor of 1.5x to 5x depending on injury severity. Your state negligence rule is applied before the multiplier.',
    },
    {
      q: 'Why is the first settlement offer always low?',
      a: 'Insurance companies expect negotiation. First offers are intentionally set 40–60% below final value. Accepting the first offer means leaving significant money on the table.',
    },
    {
      q: 'How long do I have to file a car accident claim?',
      a: 'Statutes of limitation vary by state, typically 1 to 6 years from the date of injury. Most states fall in the 2–3 year range. Evidence disappears far sooner — act immediately.',
    },
    {
      q: 'What evidence preserves my car accident claim?',
      a: 'In the first 72 hours: photograph vehicles and scene, collect witness contacts, request police report, identify and preserve nearby surveillance footage.',
    },
    {
      q: 'Does my own insurance company need a recorded statement?',
      a: "You owe your own insurer prompt factual cooperation under your policy. However, you are not required to give the other driver's insurer a recorded statement.",
    },
  ],
}

const EXPERT = {
  reviewerName: 'James R. McMerty',
  credentials: 'Partner, The McMerty Law Firm | 35 Years Personal Injury Experience',
  quote: "Car accident claims are won and lost on documentation. The clients who recover the most are the ones who documented everything immediately.",
}

const SOURCES = {
  citeTitle: 'Car Accident Guide',
  sources: [
    { name: 'National Highway Traffic Safety Administration (NHTSA)', url: 'https://www.nhtsa.gov/' },
    { name: 'Insurance Information Institute — Auto Insurance', url: 'https://www.iii.org/issue-update/auto-insurance' },
    { name: 'American Automobile Association (AAA) — Driver Safety', url: 'https://exchange.aaa.com/safety/drive-safe/' },
  ],
}

// ─── Spoke definitions ─────────────────────────────────────────────────────────

const SPOKES = [
  {
    slug: 'what-to-do',
    label: 'What To Do After',
    heading: 'Car Accident — Step by Step',
  },
  {
    slug: 'settlement-amounts',
    label: 'Settlement Amounts',
    heading: 'Estimated Car Accident Settlement Ranges',
  },
  {
    slug: 'do-i-need-a-lawyer',
    label: 'Do I Need a Lawyer',
    heading: 'Do I Need a Lawyer for a Car Accident Claim?',
  },
  {
    slug: 'statute-of-limitations',
    label: 'How Long to File',
    heading: 'Statute of Limitations for Car Accident Claims',
  },
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAuthorId(payload: any, name: string): Promise<number | null> {
  const r = await payload.find({ collection: 'authors', where: { name: { equals: name } }, limit: 1 })
  return r.docs[0]?.id ?? null
}

async function getCategoryId(payload: any, slug: string): Promise<number | null> {
  const r = await payload.find({ collection: 'guideCategories', where: { slug: { equals: slug } }, limit: 1 })
  return r.docs[0]?.id ?? null
}

async function upsertArticle(payload: any, slug: string, data: any) {
  const existing = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs.length > 0) {
    return payload.update({ collection: 'guideArticles', id: existing.docs[0].id, data })
  } else {
    return payload.create({ collection: 'guideArticles', data })
  }
}

// ─── Block factories ───────────────────────────────────────────────────────────

function makeDirectAnswer(spoke: string) {
  const isWhatToDo = spoke === 'what-to-do'
  return {
    blockType: 'articleDirectAnswer',
    heading: isWhatToDo ? 'What To Do After a Car Accident' : 'Car Accident Claims: Your Complete Guide',
    text: isWhatToDo
      ? 'The first 72 hours after a car accident are the most critical for protecting your health and your claim. Here is what you need to do.'
      : CAR_ACCIDENT_REF.directAnswer,
  }
}

function makeKeyTakeaways() {
  return {
    blockType: 'articleKeyTakeaways',
    items: CAR_ACCIDENT_REF.keyFacts.map(fact => ({ fact })),
  }
}

function makeFAQ() {
  return {
    blockType: 'articleFAQ',
    items: CAR_ACCIDENT_REF.faqs.map(f => ({ question: f.q, answerText: f.a })),
  }
}

function makeSources() {
  return {
    blockType: 'articleSources',
    citeTitle: SOURCES.citeTitle,
    sources: SOURCES.sources.map(s => ({ name: s.name, url: s.url })),
  }
}

function makeExpert() {
  return {
    blockType: 'articleExpert',
    quote: EXPERT.quote,
    reviewerName: EXPERT.reviewerName,
    credentials: EXPERT.credentials,
  }
}

function makeCTA() {
  return {
    blockType: 'articleCTA',
    title: 'Get a Free Case Review',
    subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.',
    buttonLabel: 'Check My Case',
    buttonLink: '/checkmycase',
  }
}

function makeTimelineSteps() {
  return {
    blockType: 'articleTimelineSteps',
    heading: 'Car Accident — Step by Step',
    steps: CAR_ACCIDENT_REF.sections.map((s, i) => ({
      stepName: `${i + 1}. ${s.title}`,
      stepDescription: s.content[0] ?? '',
    })),
    note: 'Step order reflects the most important actions in the first 72 hours after a car accident.',
  }
}

function makeSettlementTable() {
  return {
    blockType: 'articleSettlementTable',
    heading: 'Estimated Car Accident Settlement Ranges',
    rows: [
      {
        severity: 'Minor Injury',
        description: 'Soft tissue, quick recovery — medical bills plus 1.5x–2x multiplier',
        range: '$15,000 – $50,000',
      },
      {
        severity: 'Moderate Injury',
        description: 'Fractures, ongoing treatment — medical bills plus 2x–3.5x multiplier',
        range: '$50,000 – $100,000',
      },
      {
        severity: 'Severe Injury',
        description: 'Permanent disability, chronic pain — medical bills plus 3.5x–5x multiplier',
        range: '$100,000 – $500,000+',
      },
      {
        severity: 'Catastrophic / Wrongful Death',
        description: 'Life-altering injuries or death — highest multipliers, full damages',
        range: '$500,000 – $1,000,000+',
      },
    ],
    footnote: 'Settlement ranges are illustrative estimates based on typical case values. Your actual settlement depends on the specific facts of your case, your state\'s negligence rules, and the quality of your evidence.',
  }
}

function makeProseContent() {
  return {
    blockType: 'articleProseContent',
    sections: CAR_ACCIDENT_REF.sections.map(s => ({
      heading: s.title,
      body: s.content.join('\n\n'),
    })),
  }
}

function makeStatuteBars() {
  return {
    blockType: 'articleStatuteBars',
    heading: 'Statute of Limitations for Car Accident Claims',
    bars: [
      {
        deadline: '2 Years',
        states: 'Most states (Texas, Florida, New York, Illinois, Pennsylvania)',
        widthPercent: 55,
      },
      {
        deadline: '3 Years',
        states: 'California, Georgia, Louisiana, Montana, South Carolina',
        widthPercent: 25,
      },
      {
        deadline: '1 Year',
        states: 'Special circumstances: VA, MD, DC (contributory negligence states — act immediately)',
        widthPercent: 20,
      },
    ],
    footnote: 'Statutes of limitation vary significantly by state. Some states have exceptions for minors, discovery of injury, or tolling provisions. Consult a car accident attorney in your state to confirm your exact deadline.',
  }
}

function makeRelatedGuides(articleIds: Record<string, number>) {
  return {
    blockType: 'articleRelatedGuides',
    articles: Object.values(articleIds),
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('🚀 Seeding car-accidents: 4 spoke articles...\n')

  const payload = await getPayload({ config })

  const authorId = await getAuthorId(payload, 'Martha Kechicha')
  if (!authorId) {
    console.error('❌ Author "Martha Kechicha" not found. Seed authors first.')
    return
  }
  console.log(`✅ Author: Martha Kechicha (ID: ${authorId})`)

  const categoryId = await getCategoryId(payload, 'car-accidents')
  if (!categoryId) {
    console.error('❌ GuideCategory "car-accidents" not found.')
    return
  }
  console.log(`✅ GuideCategory: car-accidents (ID: ${categoryId})`)

  // ── Step 1: Upsert metadata for all 4 articles ───────────────────────────────

  const articleMeta: Record<string, any> = {}

  for (const spoke of SPOKES) {
    const slug = `car-accident-${spoke.slug}`
    const title = `${spoke.label} a Car Accident`

    articleMeta[slug] = {
      title,
      slug,
      subtitle:
        spoke.slug === 'what-to-do'
          ? 'Expert guidance on the critical first steps after a car accident.'
          : spoke.slug === 'settlement-amounts'
          ? 'How car accident settlements are calculated and what your claim may be worth.'
          : spoke.slug === 'do-i-need-a-lawyer'
          ? 'Understand when you need a lawyer for your car accident claim.'
          : 'Key deadlines for filing a car accident claim in your state.',
      excerpt: CAR_ACCIDENT_REF.directAnswer.slice(0, 200) + '...',
      focusKeyword: `car accident ${spoke.slug.replace(/-/g, ' ')}`,
      secondaryKeywords: [
        { keyword: 'how to file a car accident claim' },
        { keyword: 'car accident settlement' },
      ],
      metaTitle: `${title} | CasePort`,
      metaDescription: CAR_ACCIDENT_REF.directAnswer.slice(0, 155),
      schemaType: 'Article',
      _status: 'published',
      _isSeeding: true,
      author: authorId,
      guideCategory: categoryId,
    }

    await upsertArticle(payload, slug, articleMeta[slug])
    console.log(`  ✅ upserted: ${slug}`)
  }

  // ── Step 2: Build article ID map ─────────────────────────────────────────────

  const articleIds: Record<string, number> = {}
  for (const spoke of SPOKES) {
    const slug = `car-accident-${spoke.slug}`
    const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
    if (r.docs[0]?.id) {
      articleIds[slug] = r.docs[0].id
    }
  }
  console.log(`\n✅ Article IDs mapped: ${Object.keys(articleIds).join(', ')}`)

  // ── Step 3: Build and save blocks for each article ────────────────────────────

  for (const spoke of SPOKES) {
    const slug = `car-accident-${spoke.slug}`
    const id = articleIds[slug]
    if (!id) continue

    const blocks: any[] = []

    // Common blocks — ALL spokes
    blocks.push(makeDirectAnswer(spoke.slug))
    blocks.push(makeKeyTakeaways())
    blocks.push(makeFAQ())
    blocks.push(makeSources())
    blocks.push(makeExpert())
    blocks.push(makeCTA())

    // Spoke-specific content block
    if (spoke.slug === 'what-to-do') {
      blocks.push(makeTimelineSteps())
    } else if (spoke.slug === 'settlement-amounts') {
      blocks.push(makeSettlementTable())
    } else if (spoke.slug === 'do-i-need-a-lawyer') {
      blocks.push(makeProseContent())
    } else if (spoke.slug === 'statute-of-limitations') {
      blocks.push(makeStatuteBars())
    }

    // Related guides — all 4 car-accident articles
    blocks.push(makeRelatedGuides(articleIds))

    await payload.update({
      collection: 'guideArticles',
      id,
      data: { blocks, _status: 'published', _isSeeding: true },
    })

    console.log(`  ✅ ${slug} — ${blocks.length} blocks`)
  }

  console.log('\n✅ car-accidents seeding complete!')
}

run().catch(e => { console.error(e.message); process.exit(1) })
