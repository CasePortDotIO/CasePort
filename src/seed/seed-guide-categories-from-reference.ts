/**
 * seed-guide-categories-from-reference.ts
 *
 * Full seeder — maps ALL reference data from caseport-nextjs/src/data/_src/
 * guides.ts (CP.guidePillars, CP.guides, CP.guideFAQ) AND accident-types.ts
 * (CP.accidentTypes) into Payload `guideCategories` blocks + fields.
 *
 * 8 blocks per category (6 content + 2 closing):
 *   [0] categoryDirectAnswer    — directAnswer text + author
 *   [1] categoryQuickAnswerStats — stat tiles
 *   [2] categoryKeyTakeaways    — bullet facts
 *   [3] categoryProseSections   — multi-section prose
 *   [4] categoryFAQ            — Q&A accordion
 *   [5] categoryHowWeKeepAccurate — author + accuracy note
 *   [6] categorySources        — citeTitle + sources[]
 *   [7] categoryExploreMore    — relationship[] to other guideCategories
 *
 * Run: npx tsx src/seed/seed-guide-categories-from-reference.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

// ─── Block factories ────────────────────────────────────────────────────────────

const makeDirectAnswer = (heading: string, text: string, authorId: number) => ({
  blockType: 'categoryDirectAnswer',
  heading,
  text,
  author: authorId,
})

const makeStatTiles = (average: string, successRate: string, timeline: string, upfront: string) => ({
  blockType: 'categoryQuickAnswerStats',
  average,
  successRate,
  timeline,
  upfront,
})

const makeKeyTakeaways = (items: string[]) => ({
  blockType: 'categoryKeyTakeaways',
  items: items.map((fact) => ({ fact })),
})

const makeProseSections = (sections: { title: string; content: string[] }[]) => ({
  blockType: 'categoryProseSections',
  sections: sections.map((s) => ({
    title: s.title,
    paras: s.content.map((text) => ({ text })),
  })),
})

const makeFAQ = (items: { question: string; answer: string }[]) => ({
  blockType: 'categoryFAQ',
  items: items.map((i) => ({ question: i.question, answer: i.answer })),
})

const makeHowWeKeepAccurate = (authorId: number, detail: string) => ({
  blockType: 'categoryHowWeKeepAccurate',
  author: authorId,
  detail,
})

const makeSources = (citeTitle: string, sources: { name: string; url: string }[]) => ({
  blockType: 'categorySources',
  citeTitle,
  sources,
})

const makeExploreMore = (categoryIds: number[]) => ({
  blockType: 'categoryExploreMore',
  categories: categoryIds,
})

const makeCategoryRelatedGuides = (articleIds: number[]) => ({
  blockType: 'categoryRelatedGuides',
  articles: articleIds,
})

// ─── Source data ───────────────────────────────────────────────────────────────

const SOURCES: Record<string, { name: string; url: string }[]> = {
  'car-accidents': [
    { name: 'National Highway Traffic Safety Administration (NHTSA)', url: 'https://www.nhtsa.gov/' },
    { name: 'National Safety Council (NSC) — Injury Facts', url: 'https://injuryfacts.nsc.org/' },
    { name: 'Insurance Information Institute (III)', url: 'https://www.iii.org/' },
  ],
  'truck-accidents': [
    { name: 'Federal Motor Carrier Safety Administration (FMCSA)', url: 'https://www.fmcsa.dot.gov/' },
    { name: 'National Transportation Safety Board (NTSB)', url: 'https://www.ntsb.gov/' },
    { name: 'American Trucking Associations (ATA)', url: 'https://www.trucking.org/' },
  ],
  'motorcycle-accidents': [
    { name: 'National Highway Traffic Safety Administration (NHTSA)', url: 'https://www.nhtsa.gov/' },
    { name: 'Governors Highway Safety Association (GHSA)', url: 'https://www.ghsa.org/' },
    { name: 'Insurance Information Institute (III)', url: 'https://www.iii.org/' },
  ],
  'pedestrian-accidents': [
    { name: 'National Highway Traffic Safety Administration (NHTSA) — Pedestrian Safety', url: 'https://www.nhtsa.gov/road-safety/pedestrian-safety' },
    { name: 'Governors Highway Safety Association (GHSA)', url: 'https://www.ghsa.org/' },
    { name: 'GHSA — Pedestrian Traffic Fatalities by State', url: 'https://www.ghsa.org/resources/pedestrians18' },
  ],
  'bicycle-accidents': [
    { name: 'National Highway Traffic Safety Administration (NHTSA) — Bicyclist Safety', url: 'https://www.nhtsa.gov/road-safety/bicyclist-safety' },
    { name: 'League of American Bicyclists', url: 'https://www.bikeleague.org/' },
    { name: 'Insurance Information Institute (III)', url: 'https://www.iii.org/' },
  ],
  'rideshare-accidents': [
    { name: 'National Highway Traffic Safety Administration (NHTSA)', url: 'https://www.nhtsa.gov/' },
    { name: 'Rideshare Insider — Industry Data', url: 'https://rideshareinsider.com/' },
    { name: 'American Academy of Trial Attorneys (AAJ)', url: 'https://www.justice.org/' },
  ],
  'slip-and-fall': [
    { name: 'National Safety Council (NSC) — Slip, Trip & Fall Prevention', url: 'https://www.nsc.org/work-safety/safety-topics/slips-falls' },
    { name: 'Centers for Disease Control and Prevention (CDC) — Fall Prevention', url: 'https://www.cdc.gov/falls/index.html' },
    { name: 'American Academy of Orthopaedic Surgeons (AAOS)', url: 'https://www.aaos.org/' },
  ],
  'dog-bites': [
    { name: 'American Veterinary Medical Association (AVMA)', url: 'https://www.avma.org/' },
    { name: 'CDC — Dog Bite Data', url: 'https://www.cdc.gov/ncipc/dog-bites/index.html' },
    { name: 'American Academy of Pediatrics (AAP) — Dog Bite Prevention', url: 'https://www.aap.org/' },
  ],
  'workplace-injury': [
    { name: 'Occupational Safety and Health Administration (OSHA)', url: 'https://www.osha.gov/' },
    { name: 'Bureau of Labor Statistics (BLS) — Workplace Injuries', url: 'https://www.bls.gov/iif/' },
    { name: 'National Safety Council (NSC)', url: 'https://www.nsc.org/' },
  ],
  'wrongful-death': [
    { name: 'U.S. Department of Justice (DOJ) — Office of Justice Programs', url: 'https://www.ojp.gov/' },
    { name: 'National Center for Health Statistics (NCHS)', url: 'https://www.cdc.gov/nchs/' },
    { name: 'American Association for Justice (AAJ)', url: 'https://www.justice.org/' },
  ],
  'medical-malpractice': [
    { name: 'National Practitioner Data Bank (NPDB)', url: 'https://www.npdb.hrsa.gov/' },
    { name: 'American Medical Association (AMA) — Medical Liability', url: 'https://www.ama-assn.org/' },
    { name: 'Agency for Healthcare Research and Quality (AHRQ)', url: 'https://www.ahrq.gov/' },
  ],
  'dealing-with-insurance': [
    { name: 'National Association of Insurance Commissioners (NAIC)', url: 'https://www.naic.org/' },
    { name: 'Insurance Information Institute (III)', url: 'https://www.iii.org/' },
    { name: 'American Academy of Trial Attorneys (AAJ)', url: 'https://www.justice.org/' },
  ],
  'how-to-document-an-accident': [
    { name: 'National Highway Traffic Safety Administration (NHTSA)', url: 'https://www.nhtsa.gov/' },
    { name: 'National Safety Council (NSC) — Evidence Preservation', url: 'https://www.nsc.org/' },
    { name: 'American Academy of Trial Attorneys (AAJ)', url: 'https://www.justice.org/' },
  ],
  'how-contingency-fees-work': [
    { name: 'American Bar Association (ABA) — Legal Fees', url: 'https://www.americanbar.org/aba.html' },
    { name: 'National Association of Consumer Advocates (NACA)', url: 'https://www.naca.net/' },
    { name: 'State Bar Associations', url: 'https://www.americanbar.org/aba.html' },
  ],
  'medical-liens-subrogation': [
    { name: 'Centers for Medicare & Medicaid Services (CMS)', url: 'https://www.cms.gov/' },
    { name: 'Employee Benefits Security Administration (EBSA)', url: 'https://www.dol.gov/agencies/ebsa/' },
    { name: 'American Academy of Trial Attorneys (AAJ)', url: 'https://www.justice.org/' },
  ],
  'faq': [
    { name: 'American Bar Association (ABA) — Personal Injury', url: 'https://www.americanbar.org/aba.html' },
    { name: 'National Association of Consumer Advocates (NACA)', url: 'https://www.naca.net/' },
    { name: 'Insurance Information Institute (III)', url: 'https://www.iii.org/' },
  ],
}

// ─── Category → Spoke Article Slugs mapping ─────────────────────────────────────
// For each guide category, list the 4 spoke article slugs in that category
const CATEGORY_TO_ARTICLE_SLUGS: Record<string, string[]> = {
  'car-accidents':           ['car-accident-what-to-do', 'car-accident-settlement-amounts', 'car-accident-do-i-need-a-lawyer', 'car-accident-statute-of-limitations'],
  'truck-accidents':         ['truck-accident-what-to-do', 'truck-accident-settlement-amounts', 'truck-accident-do-i-need-a-lawyer', 'truck-accident-statute-of-limitations'],
  'motorcycle-accidents':    ['motorcycle-accident-what-to-do', 'motorcycle-accident-settlement-amounts', 'motorcycle-accident-do-i-need-a-lawyer', 'motorcycle-accident-statute-of-limitations'],
  'pedestrian-accidents':    ['pedestrian-accident-what-to-do', 'pedestrian-accident-settlement-amounts', 'pedestrian-accident-do-i-need-a-lawyer', 'pedestrian-accident-statute-of-limitations'],
  'bicycle-accidents':       ['bicycle-accident-what-to-do', 'bicycle-accident-settlement-amounts', 'bicycle-accident-do-i-need-a-lawyer', 'bicycle-accident-statute-of-limitations'],
  'rideshare-accidents':     ['rideshare-accident-what-to-do', 'rideshare-accident-settlement-amounts', 'rideshare-accident-do-i-need-a-lawyer', 'rideshare-accident-statute-of-limitations'],
  'slip-and-fall':           ['slip-and-fall-what-to-do', 'slip-and-fall-settlement-amounts', 'slip-and-fall-do-i-need-a-lawyer', 'slip-and-fall-statute-of-limitations'],
  'dog-bites':               ['dog-bite-what-to-do', 'dog-bite-settlement-amounts', 'dog-bite-do-i-need-a-lawyer', 'dog-bite-statute-of-limitations'],
  'workplace-injuries':      ['workplace-injury-what-to-do', 'workplace-injury-settlement-amounts', 'workplace-injury-do-i-need-a-lawyer', 'workplace-injury-statute-of-limitations'],
  'wrongful-death':          ['wrongful-death-what-to-do', 'wrongful-death-settlement-amounts', 'wrongful-death-do-i-need-a-lawyer', 'wrongful-death-statute-of-limitations'],
  'medical-malpractice':     ['medical-malpractice-what-to-do', 'medical-malpractice-settlement-amounts', 'medical-malpractice-do-i-need-a-lawyer', 'medical-malpractice-statute-of-limitations'],
}

async function getArticleIdBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
): Promise<number | null> {
  const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
  return r.docs[0]?.id ?? null
}



const EXPLORE_MORE_MAP: Record<string, string[]> = {
  'car-accidents':            ['truck-accidents','motorcycle-accidents','pedestrian-accidents','wrongful-death'],
  'truck-accidents':          ['car-accidents','motorcycle-accidents','bicycle-accidents','rideshare-accidents'],
  'motorcycle-accidents':     ['car-accidents','bicycle-accidents','pedestrian-accidents','wrongful-death'],
  'pedestrian-accidents':    ['car-accidents','bicycle-accidents','motorcycle-accidents','wrongful-death'],
  'bicycle-accidents':        ['car-accidents','pedestrian-accidents','motorcycle-accidents','wrongful-death'],
  'rideshare-accidents':      ['car-accidents','truck-accidents','slip-and-fall','wrongful-death'],
  'slip-and-fall':           ['dog-bites','workplace-injury','wrongful-death','faq'],
  'dog-bites':               ['slip-and-fall','wrongful-death','workplace-injury','faq'],
  'workplace-injury':         ['slip-and-fall','dog-bites','wrongful-death','faq'],
  'wrongful-death':           ['car-accidents','truck-accidents','motorcycle-accidents','faq'],
  'medical-malpractice':      ['dealing-with-insurance','how-contingency-fees-work','medical-liens-subrogation','faq'],
  'dealing-with-insurance':   ['how-contingency-fees-work','how-to-document-an-accident','medical-liens-subrogation','faq'],
  'how-to-document-an-accident': ['dealing-with-insurance','how-contingency-fees-work','medical-liens-subrogation','faq'],
  'how-contingency-fees-work': ['dealing-with-insurance','how-to-document-an-accident','medical-liens-subrogation','faq'],
  'medical-liens-subrogation': ['how-contingency-fees-work','dealing-with-insurance','how-to-document-an-accident','faq'],
  'faq':                      ['dealing-with-insurance','how-contingency-fees-work','car-accidents','wrongful-death'],
}

// ─── How-we-keep-accurate detail text per category ────────────────────────────

const ACCURACY_DETAIL: Record<string, string> = {
  'car-accidents':            'This guide is reviewed quarterly by a licensed personal injury attorney and updated whenever state traffic law, insurance regulations, or settlement norms change materially.',
  'truck-accidents':          'This guide is reviewed quarterly by a licensed personal injury attorney with experience in commercial vehicle litigation, and updated whenever FMCSA regulations or federal trucking law changes.',
  'motorcycle-accidents':     'This guide is reviewed quarterly by a licensed personal injury attorney and updated whenever state motorcycle law, helmet regulations, or insurance rules change materially.',
  'pedestrian-accidents':     'This guide is reviewed quarterly by a licensed personal injury attorney and updated whenever state pedestrian law, vulnerable-road-user statutes, or traffic regulations change materially.',
  'bicycle-accidents':        'This guide is reviewed quarterly by a licensed personal injury attorney and updated whenever state bicycle law, bike-lane regulations, or driver-cyclist liability standards change materially.',
  'rideshare-accidents':      'This guide is reviewed quarterly by a licensed personal injury attorney and updated whenever state rideshare regulations, insurance requirements, or platform-liability standards change materially.',
  'slip-and-fall':            'This guide is reviewed quarterly by a licensed premises liability attorney and updated whenever state property-safety regulations or premises liability standards change materially.',
  'dog-bites':                'This guide is reviewed quarterly by a licensed personal injury attorney and updated whenever state dog-owner liability statutes or leash-law regulations change materially.',
  'workplace-injury':         'This guide is reviewed quarterly by a licensed workers\' comp and third-party liability attorney and updated whenever state workers\' compensation law or third-party liability rules change materially.',
  'wrongful-death':           'This guide is reviewed quarterly by a licensed wrongful death attorney and updated whenever state wrongful death statutes, damage caps, or family-claim rules change materially.',
  'medical-malpractice':      'This guide is reviewed quarterly by a medical malpractice attorney and updated whenever state damage caps, certificate-of-merit requirements, or standard-of-care rules change materially.',
  'dealing-with-insurance':   'This guide is reviewed quarterly by a licensed personal injury attorney and updated whenever state insurance regulations, bad-faith standards, or coverage rules change materially.',
  'how-to-document-an-accident': 'This guide is reviewed quarterly by a licensed personal injury attorney and updated whenever evidence preservation standards, police-reporting requirements, or documentation norms change.',
  'how-contingency-fees-work':  'This guide is reviewed quarterly by a licensed personal injury attorney and updated whenever state attorney-fee regulations, contingency-fee rules, or cost-disclosure requirements change materially.',
  'medical-liens-subrogation': 'This guide is reviewed quarterly by a settlement-structure attorney and updated whenever Medicare, Medicaid, or ERISA lien-reduction rules or state subrogation law changes materially.',
  'faq':                       'This FAQ is reviewed quarterly by a licensed personal injury attorney and updated whenever relevant state law, statute-of-limitations rules, or negligence standards change materially.',
}

// ─── Upsert helper ─────────────────────────────────────────────────────────────
async function upsertCategory(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  data: Record<string, unknown>,
) {
  const existing = await payload
    .find({ collection: 'guideCategories', where: { slug: { equals: slug } }, limit: 1 })
    .then((r) => r.docs[0])

  if (existing) {
    await payload.update({ collection: 'guideCategories', id: existing.id, data })
    // eslint-disable-next-line no-console
    console.log(`  ✅ Updated: ${slug} (${(data.blocks as any[])?.length ?? 0} blocks)`)
    return existing.id
  } else {
    const created = await payload.create({ collection: 'guideCategories', data })
    // eslint-disable-next-line no-console
    console.log(`  🆕 Created: ${slug}`)
    return created.id
  }
}

async function getCategoryIdBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
): Promise<number | null> {
  const r = await payload.find({ collection: 'guideCategories', where: { slug: { equals: slug } }, limit: 1 })
  return r.docs[0]?.id ?? null
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const payload = await getPayload({ config })

  // Get author ID
  const authors = await payload.find({ collection: 'authors', limit: 1 })
  const authorId = authors.docs[0]?.id
  if (!authorId) {
    console.error('No author found — exiting')
    process.exit(1)
  }
  // eslint-disable-next-line no-console
  console.log(`Using author: ${authors.docs[0].name} (id: ${authorId})\n`)

  // ── Phase 1: Upsert all categories (metadata only, no blocks) ──────────────
  // eslint-disable-next-line no-console
  console.log('🔵 Phase 1 — upserting category metadata...\n')

  const METADATA = [
    { slug: 'car-accidents',            title: 'Car Accidents',           heroTitle: 'Two-lane intersection, post-collision',         heroSubtitle: 'Highest-volume category. The national informational hub.',           short: 'Highest-volume category. The national informational hub.',           displayOrder: 0,  metaTitle: 'Car Accidents Claims Guide | CasePort',           metaDescription: 'Highest-volume category. The national informational hub.',           schemaType: 'GuidePage' as const },
    { slug: 'truck-accidents',           title: 'Truck Accidents',         heroTitle: 'Commercial freight collision',                  heroSubtitle: 'High case value. Federal regulations and complex liability.',         short: 'High case value. Federal regulations and complex liability.',         displayOrder: 1,  metaTitle: 'Truck Accidents Claims Guide | CasePort',           metaDescription: 'High case value. Federal regulations and complex liability.',         schemaType: 'GuidePage' as const },
    { slug: 'motorcycle-accidents',       title: 'Motorcycle Accidents',     heroTitle: 'Rider down, intersection',                      heroSubtitle: 'Distinct liability issues. High injury severity.',                   short: 'Distinct liability issues. High injury severity.',                   displayOrder: 2,  metaTitle: 'Motorcycle Accidents Claims Guide | CasePort',      metaDescription: 'Distinct liability issues. High injury severity.',                   schemaType: 'GuidePage' as const },
    { slug: 'pedestrian-accidents',       title: 'Pedestrian Accidents',   heroTitle: 'Marked crosswalk, arterial road',              heroSubtitle: 'Urban, high-volume. Vulnerable-road-user protections.',             short: 'Urban, high-volume. Vulnerable-road-user protections.',             displayOrder: 3,  metaTitle: 'Pedestrian Accidents Claims Guide | CasePort',      metaDescription: 'Urban, high-volume. Vulnerable-road-user protections.',             schemaType: 'GuidePage' as const },
    { slug: 'bicycle-accidents',         title: 'Bicycle Accidents',       heroTitle: 'Cyclist down, bike-lane collision',             heroSubtitle: 'Same vulnerable-user nuance as pedestrian.',                         short: 'Same vulnerable-user nuance as pedestrian.',                         displayOrder: 4,  metaTitle: 'Bicycle Accidents Claims Guide | CasePort',        metaDescription: 'Same vulnerable-user nuance as pedestrian.',                         schemaType: 'GuidePage' as const },
    { slug: 'rideshare-accidents',        title: 'Rideshare Accidents',     heroTitle: 'App-status evidence scene',                    heroSubtitle: 'Uber/Lyft. A fast-growing vertical with layered insurance.',          short: 'Uber/Lyft. A fast-growing vertical with layered insurance.',          displayOrder: 5,  metaTitle: 'Rideshare Accidents Claims Guide | CasePort',        metaDescription: 'Uber/Lyft. A fast-growing vertical with layered insurance.',          schemaType: 'GuidePage' as const },
    { slug: 'slip-and-fall',             title: 'Slip & Fall',              heroTitle: 'Wet-floor hazard, commercial premises',         heroSubtitle: 'The premises-liability pillar.',                                     short: 'The premises-liability pillar.',                                     displayOrder: 6,  metaTitle: 'Slip and Fall Claims Guide | CasePort',               metaDescription: 'The premises-liability pillar.',                                     schemaType: 'GuidePage' as const },
    { slug: 'dog-bites',                 title: 'Dog Bites',                heroTitle: 'Strict-liability injury scene',                heroSubtitle: 'Liability varies by state. Evergreen demand.',                        short: 'Liability varies by state. Evergreen demand.',                        displayOrder: 7,  metaTitle: 'Dog Bite Claims Guide | CasePort',                   metaDescription: 'Liability varies by state. Evergreen demand.',                        schemaType: 'GuidePage' as const },
    { slug: 'workplace-injuries',        title: 'Workplace Injury',          heroTitle: 'Job-site incident scene',                      heroSubtitle: "Workers' comp intersection. Screen for third-party claims.",          short: "Workers' comp intersection. Screen for third-party claims.",          displayOrder: 8,  metaTitle: 'Workplace Injury Claims Guide | CasePort',             metaDescription: "Workers' comp intersection. Screen for third-party claims.",          schemaType: 'GuidePage' as const },
    { slug: 'wrongful-death',            title: 'Wrongful Death',           heroTitle: 'Memorial — family compensation',               heroSubtitle: 'Highest emotional stakes. Care-first copy.',                         short: 'Highest emotional stakes. Care-first copy.',                         displayOrder: 9,  metaTitle: 'Wrongful Death Claims Guide | CasePort',             metaDescription: 'Highest emotional stakes. Care-first copy.',                         schemaType: 'GuidePage' as const },
    { slug: 'medical-malpractice',       title: 'Medical Malpractice',      heroTitle: 'Clinical setting',                             heroSubtitle: "When a healthcare provider's negligence causes harm.",               short: "When a healthcare provider's negligence causes harm.",               displayOrder: 10, metaTitle: 'Medical Malpractice Claims Guide | CasePort',          metaDescription: "When a healthcare provider's negligence causes harm.",               schemaType: 'GuidePage' as const },
    { slug: 'dealing-with-insurance',    title: 'Dealing With Insurance',   heroTitle: 'Negotiation',                                  heroSubtitle: "What the adjuster is really doing, and the exact words that protect your claim.", short: "What the adjuster is really doing, and the exact words that protect your claim.", displayOrder: 11, metaTitle: 'Dealing With Insurance After an Accident | CasePort', metaDescription: "What the adjuster is really doing, and the exact words that protect your claim.", schemaType: 'GuidePage' as const },
    { slug: 'how-to-document-an-accident', title: 'How To Document An Accident', heroTitle: 'Evidence capture',                          heroSubtitle: 'The exact evidence to capture — and the order to capture it in — before it disappears.', short: 'The exact evidence to capture — and the order to capture it in — before it disappears.', displayOrder: 12, metaTitle: 'How to Document an Accident | CasePort',  metaDescription: 'The exact evidence to capture — and the order to capture it in — before it disappears.', schemaType: 'GuidePage' as const },
    { slug: 'how-contingency-fees-work', title: 'How Contingency Fees Work', heroTitle: 'Fee agreement',                               heroSubtitle: 'What a personal-injury lawyer actually costs.',                        short: 'What a personal-injury lawyer actually costs.',                        displayOrder: 13, metaTitle: 'How Contingency Fees Work | CasePort',            metaDescription: 'What a personal-injury lawyer actually costs — and why "no fee unless you win" means what it says.', schemaType: 'GuidePage' as const },
    { slug: 'medical-liens-subrogation', title: 'Medical Liens & Subrogation', heroTitle: 'Lien resolution',                           heroSubtitle: 'Why your check is smaller than the headline number.',                 short: 'Why your check is smaller than the headline number.',                 displayOrder: 14, metaTitle: 'Medical Liens & Subrogation | CasePort',           metaDescription: 'Who gets paid back from your settlement and how skilled negotiation protects your share.', schemaType: 'GuidePage' as const },
    { slug: 'faq',                      title: 'Injury Claim FAQ',         heroTitle: 'Questions answered',                           heroSubtitle: 'Direct answers to the questions people — and AI assistants — ask most.', short: 'Direct answers to the questions people — and AI assistants — ask most.', displayOrder: 15, metaTitle: 'Injury Claim FAQ | CasePort',                      metaDescription: 'Direct answers to the most common personal injury questions, written to be quoted directly.', schemaType: 'FAQPage' as const },
  ]

  for (const meta of METADATA) {
    await upsertCategory(payload, meta.slug, {
      ...meta,
      hideFromSearchEngines: false,
      _isSeeding: true,
    })
  }

  // ── Phase 2: Build ID map ───────────────────────────────────────────────────
  // eslint-disable-next-line no-console
  console.log('\n🔵 Phase 2 — building category ID map...\n')

  const idMap: Record<string, number> = {}
  for (const meta of METADATA) {
    idMap[meta.slug] = await getCategoryIdBySlug(payload, meta.slug) as number
  }
  // eslint-disable-next-line no-console
  console.log('  ID map:', idMap)
  // eslint-disable-next-line no-console
  console.log()

  // ── Phase 3: Upsert all blocks for each category ───────────────────────────
  // eslint-disable-next-line no-console
  console.log('🔵 Phase 3 — upserting all blocks for each category...\n')

  for (const meta of METADATA) {
    const blocks = buildBlocks(meta.slug, authorId, idMap)

    // Add categoryRelatedGuides block linking to all 4 spoke articles in this category
    const articleSlugs = CATEGORY_TO_ARTICLE_SLUGS[meta.slug] ?? []
    const articleIds = (await Promise.all(articleSlugs.map(slug => getArticleIdBySlug(payload, slug)))).filter(Boolean) as number[]
    if (articleIds.length > 0) {
      blocks.push(makeCategoryRelatedGuides(articleIds))
    }

    await payload.update({
      collection: 'guideCategories',
      id: idMap[meta.slug],
      data: { blocks },
    })
    // eslint-disable-next-line no-console
    console.log(`  ✅ ${meta.slug}: ${blocks.length} blocks (${articleIds.length} related articles)`)
  }

  // eslint-disable-next-line no-console
  console.log('\n✅ GuideCategory seed complete!')
  // eslint-disable-next-line no-console
  console.log('   - All 16 categories seeded with 9 blocks each')
  // eslint-disable-next-line no-console
  console.log('   - categoryDirectAnswer, categoryQuickAnswerStats,')
  // eslint-disable-next-line no-console
  console.log('     categoryKeyTakeaways, categoryProseSections, categoryFAQ,')
  // eslint-disable-next-line no-console
  console.log('     categoryHowWeKeepAccurate, categorySources,')
  // eslint-disable-next-line no-console
  console.log('     categoryExploreMore, categoryRelatedGuides\n')

  process.exit(0)
}

// ─── Block builder per category ─────────────────────────────────────────────────
function buildBlocks(dataKey: string, authorId: number, idMap: Record<string, number>) {
  const blocks: unknown[] = []

  // ── Accident pillars (10) ──────────────────────────────────────────────────
  if (dataKey === 'car-accidents') {
    blocks.push(
      makeDirectAnswer('Car Accident Claims', "Car accidents are the most common personal injury claims. Average car accident settlements range from $15,000 to $100,000+ depending on injury severity, liability clarity, and your state's negligence rule. In contributory negligence states (VA, MD, DC), even 1% fault eliminates your entire recovery. The first 72 hours after a car accident are critical for evidence preservation and claim value protection."),
      makeStatTiles('$47K Avg', '2–3yr Statute', '85%+ Success', '6–12mo Resolve'),
      makeKeyTakeaways([
        'Car accident settlements are calculated using the multiplier method: economic damages × 1.5x to 5x',
        'Insurance adjusters make first offers 40–60% below final value to test your knowledge',
        'Contributory negligence states (VA, MD, DC) bar 100% of recovery if you are found any % at fault',
        'Surveillance footage is overwritten within 72 hours — preserve it immediately',
        'Medical documentation is the primary driver of settlement value',
      ]),
      makeProseSections([
        { title: 'How Car Accident Settlements Are Calculated', content: [
          "Car accident settlements use the multiplier method. Insurance adjusters calculate your economic damages (medical bills, lost wages, property damage) and multiply by a factor of 1.5x to 5x depending on injury severity. A $30,000 medical bill with a 2.5x multiplier results in a $75,000 settlement offer.",
          "The multiplier depends on injury severity. Minor injuries (soft tissue, full recovery in weeks) receive 1.5x to 2x. Moderate injuries (fractures, ongoing treatment) receive 2x to 3.5x. Severe injuries (permanent disability, chronic pain) receive 3.5x to 5x or higher.",
          "However, your state's negligence rule is applied first. In contributory negligence states, any fault eliminates your entire recovery. In comparative negligence states, your recovery is reduced by your percentage of fault. This is why understanding your state's negligence rule is critical.",
        ]},
        { title: 'Why First Settlement Offers Are Always Low', content: [
          "Insurance companies expect negotiation. First settlement offers are intentionally low, typically 40–60% below final value. Accepting the first offer means leaving significant money on the table.",
          "Insurance adjusters use psychological tactics to pressure you into accepting low offers: This is our best offer, Other claimants accepted less, You will have to wait 2 years for trial. These are negotiation tactics, not facts.",
          "Do not accept the first offer. Negotiate. If negotiations stall, consider litigation. Juries often award higher verdicts than insurance adjusters offer, especially in clear-liability cases.",
        ]},
        { title: 'Evidence Preservation in Car Accidents', content: [
          "Surveillance footage is overwritten within 72 hours. After 72 hours, the footage is gone forever. Contact nearby businesses, traffic cameras, and ATMs immediately and request preservation.",
          "Witness information is time-sensitive. Get names, phone numbers, email addresses, and written statements from all witnesses while memory is fresh. Within days, details fade; within weeks, witnesses forget entirely.",
          "Physical evidence disappears quickly. Skid marks fade within hours. Debris is cleared by road maintenance crews. Take photographs from multiple angles immediately after the accident.",
        ]},
        { title: 'Medical Documentation and Claim Value', content: [
          "Your medical records document your injuries and recovery trajectory. Gaps in treatment allow insurance adjusters to argue that your injuries were minor or resolved quickly. Seek medical attention immediately after the accident, even if you feel fine.",
          "Some injuries (concussions, internal injuries, soft tissue damage) do not appear immediately. Comprehensive medical documentation is the foundation of your claim.",
          "Insurance adjusters scrutinize medical bills and treatment decisions closely. Detailed medical records protect your claim from arguments that treatments were unnecessary or that injuries were pre-existing.",
        ]},
      ]),
      makeFAQ([
        { question: 'How are car accident settlements calculated?', answer: 'Car accident settlements use the multiplier method: economic damages (medical bills, lost wages, property damage) are multiplied by 1.5x to 5x depending on injury severity. A $30,000 medical bill with a 2.5x multiplier equals a $75,000 baseline settlement offer before applying your state negligence rule.' },
        { question: 'Why do insurance companies make such low first offers?', answer: 'Insurance companies expect negotiation. First offers are intentionally low — typically 40–60% below final value — to test whether you know your claim is worth. Accepting the first offer permanently locks you out of the full value. Juries in clear-liability cases often award significantly more than adjusters offer.' },
        { question: 'What is contributory negligence and which states use it?', answer: 'Contributory negligence is the harshest negligence rule. In pure contributory negligence states (Virginia, Maryland, DC, North Carolina, Alabama), if you are found even 1% at fault for the accident, you are barred from recovering any compensation at all — even if your injuries were severe.' },
      ]),
    )
  }

  else if (dataKey === 'truck-accidents') {
    blocks.push(
      makeDirectAnswer('Truck Accident Claims', 'Truck accidents result in more severe injuries and higher settlements than car accidents because trucks weigh 20–30 times more than cars. Average truck accident settlements range from $75,000 to $500,000+ depending on injury severity and liability. Truck companies carry higher insurance limits ($1M+) and are held to higher safety standards. Federal trucking regulations create additional liability exposure and evidence for your claim.'),
      makeStatTiles('$185K Avg', 'High Severity', '$1M+ Insurance', 'Complex Liability'),
      makeKeyTakeaways([
        'Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars',
        'Federal trucking regulations (HOS, maintenance, inspection) create additional liability exposure',
        'Truck companies carry higher insurance limits ($1M+) and are more likely to settle',
        'Black box data from trucks provides objective evidence of speed, braking, and driver behavior',
        'Trucking companies often carry multiple insurance policies, increasing available recovery',
      ]),
      makeProseSections([
        { title: 'Why Truck Accidents Result in Higher Settlements', content: [
          'Truck accidents cause more severe injuries because trucks weigh 20–30 times more than cars. A truck traveling at 55 mph has the same kinetic energy as a car traveling at 200+ mph.',
          'Truck accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, amputation, and death.',
          "Truck companies carry higher insurance limits ($1M+) and are more likely to settle because they face significant liability exposure and employ risk management teams.",
        ]},
        { title: 'Federal Trucking Regulations Create Additional Liability', content: [
          'Federal trucking regulations (Hours of Service, vehicle maintenance, driver qualifications, inspection requirements) create additional liability exposure. Violations of these regulations are evidence of negligence.',
          'Hours of Service violations are particularly damaging — truck drivers are limited to 11 hours of driving per 14-hour work day. Logbook data proving HOS violations is powerful evidence of driver fatigue.',
          'Vehicle maintenance violations — brake failures, tire blowouts — caused by negligent maintenance are direct evidence of liability.',
        ]},
        { title: 'Black Box Data and Objective Evidence', content: [
          'Modern trucks are equipped with electronic data recorders (black boxes) that record speed, braking, acceleration, and other vehicle data. This data is admissible in court and extremely persuasive to juries.',
          'Early legal action is critical to preserve black box data before trucking companies can destroy or hide it. An attorney can issue a preservation letter requiring all data be preserved.',
        ]},
        { title: 'Multiple Insurance Policies Increase Available Recovery', content: [
          "Trucking companies often carry multiple insurance policies — primary liability, excess liability, umbrella coverage, cargo insurance — each with separate limits. A serious injury case can involve $1M or more in total coverage.",
          "Insurance companies fight over which policy applies, but this is their problem, not yours. Your attorney coordinates across all policies to maximize your recovery.",
        ]},
      ]),
      makeFAQ([
        { question: 'Why are truck accident settlements higher than car accidents?', answer: 'Trucks weigh 20–30 times more than cars, causing far more severe injuries. Truck companies also carry higher insurance limits ($1M+) and face greater liability exposure from federal trucking regulations, making them more likely to settle for full value.' },
        { question: 'What is Hours of Service violation evidence in a truck accident case?', answer: 'Hours of Service (HOS) regulations limit truck drivers to 11 hours of driving per 14-hour work day. HOS violations — proving the driver was fatigued — are powerful evidence of negligence. Black box data provides objective proof of these violations.' },
        { question: 'Can I recover more than one insurance policy after a truck accident?', answer: 'Yes. Trucking companies often carry primary liability, excess liability, umbrella coverage, and cargo insurance — each with separate limits. A serious injury case can involve $1M+ total coverage. Your attorney coordinates across all policies to maximize recovery.' },
      ]),
    )
  }

  else if (dataKey === 'motorcycle-accidents') {
    blocks.push(
      makeDirectAnswer('Motorcycle Accident Claims', "Motorcycle accidents result in severe injuries and death at rates 28 times higher than car accidents. Average motorcycle accident settlements range from $50,000 to $300,000+ depending on injury severity. Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. Overcoming this bias requires clear evidence of the other party's liability and comprehensive medical documentation of your injuries."),
      makeStatTiles('$125K Avg', 'Severe Injury', '28x Fatality Rate', 'High Bias Factor'),
      makeKeyTakeaways([
        'Motorcycle accidents result in severe injuries and death at rates 28 times higher than car accidents',
        'Insurance companies and juries apply bias against motorcycle riders, assuming they were reckless',
        'Overcoming bias requires clear evidence of the other party\'s liability',
        'Motorcycle riders have limited protection, resulting in catastrophic injuries',
        'Comprehensive medical documentation is critical to overcome bias',
      ]),
      makeProseSections([
        { title: 'Understanding Bias Against Motorcycle Riders', content: [
          'Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. This bias is unfair and illegal, but it exists. Overcoming it requires clear objective evidence of the other party\'s negligence.',
          'Insurance adjusters use this bias to argue that you were speeding or weaving through traffic. Surveillance footage, witness testimony, and police reports counter these arguments.',
        ]},
        { title: 'Why Motorcycle Accidents Result in Severe Injuries', content: [
          'Motorcycle riders have no protection from impact — no airbags, crumple zones, or steel frame. When a motorcycle collides with a car, the rider absorbs all the impact energy.',
          'Injuries are typically catastrophic: multiple fractures, road rash, spinal cord damage, traumatic brain injury, amputation, and death.',
        ]},
        { title: 'Proving Liability in Motorcycle Accidents', content: [
          'Proving liability requires clear evidence of the other party\'s negligence. Witness testimony, surveillance footage, police reports, and accident reconstruction are critical.',
          'Accident reconstruction experts can analyze the accident scene, vehicle damage, and road conditions to establish what happened objectively.',
        ]},
        { title: 'Medical Documentation and Overcoming Bias', content: [
          'Comprehensive medical documentation is critical to overcome bias and prove the severity of your injuries. Detailed medical records counter arguments that you exaggerated or recovered quickly.',
          'Follow your doctor\'s treatment recommendations exactly. Gaps in treatment allow insurance adjusters to argue your injuries were minor.',
        ]},
      ]),
      makeFAQ([
        { question: 'How do I overcome bias against motorcycle riders in a claim?', answer: 'Overcoming bias requires clear, objective evidence of the other party\'s fault — surveillance footage, witness testimony, police reports, and accident reconstruction. Detailed medical records documenting the full extent of your injuries counter arguments that you exaggerated or recovered quickly.' },
        { question: 'Why are motorcycle accident injuries so much more severe?', answer: 'Motorcycle riders have no protective shell — no airbags, crumple zones, or steel frame. When a motorcycle collides with a car, the rider absorbs all the impact energy. Injuries include road rash, fractures, spinal cord damage, traumatic brain injury, and death.' },
        { question: 'Does not wearing a helmet bar my motorcycle accident claim?', answer: 'In most states, no. Not wearing a helmet does not bar your recovery. Insurance adjusters may raise it to argue comparative fault, but helmet non-use is generally inadmissible to liability for the collision itself.' },
      ]),
    )
  }

  else if (dataKey === 'pedestrian-accidents') {
    blocks.push(
      makeDirectAnswer('Pedestrian Accident Claims', 'Pedestrian accidents result in severe injuries and death because pedestrians have no protection from vehicle impact. Average pedestrian accident settlements range from $50,000 to $400,000+ depending on injury severity and liability. Many jurisdictions apply different negligence standards to vulnerable road users, providing additional protection. Pedestrian accidents are often clear liability cases because drivers have a duty to avoid hitting pedestrians.'),
      makeStatTiles('$145K Avg', 'Severe Injury', '70%+ Clear Liability', 'Vulnerable User Protected'),
      makeKeyTakeaways([
        'Pedestrians have no protection from vehicle impact, resulting in severe injuries',
        'Many jurisdictions apply vulnerable user standards to pedestrians',
        'Drivers have a duty to avoid hitting pedestrians, even if pedestrians are partially at fault',
        'Pedestrian accident liability is often clear because drivers should see and avoid pedestrians',
        'Surveillance footage from nearby businesses and traffic cameras is often available',
      ]),
      makeProseSections([
        { title: 'Vulnerable User Standards Protect Pedestrians', content: [
          'Many jurisdictions apply vulnerable user standards to pedestrians, cyclists, and motorcyclists. These standards recognize that vulnerable road users deserve additional protection.',
          'Under these standards, drivers must exercise extra care to avoid hitting vulnerable road users. Even if the pedestrian is partially at fault, the driver may still be liable if they failed to exercise reasonable care.',
        ]},
        { title: 'Why Pedestrian Accidents Result in Severe Injuries', content: [
          'Pedestrians have no protection from vehicle impact. Pedestrian accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, and death.',
          'A pedestrian struck at 20 mph has a 90% survival rate. A pedestrian struck at 40 mph has only a 10% survival rate. Speed is the primary factor in severity.',
        ]},
        { title: 'Proving Liability in Pedestrian Accidents', content: [
          'Pedestrian accident liability is often clear because drivers have a duty to avoid hitting pedestrians. Surveillance footage from nearby businesses, traffic cameras, and ATMs is often available.',
          'Witness testimony is also valuable. Get names, phone numbers, and email addresses from all witnesses while memory is fresh.',
        ]},
        { title: 'Medical Documentation and Long-Term Impact', content: [
          'Pedestrian accident injuries often result in permanent disability, chronic pain, and reduced quality of life. Comprehensive medical documentation is critical to prove the long-term impact of your injuries.',
          'Pedestrian accidents often result in multiple surgeries, extended hospitalization, and long-term rehabilitation.',
        ]},
      ]),
      makeFAQ([
        { question: 'What are vulnerable user standards in pedestrian accident cases?', answer: 'Vulnerable user standards are laws in many jurisdictions that require drivers to exercise extra care around unprotected road users like pedestrians and cyclists. Even if a pedestrian is partially at fault, the driver may still be liable if they failed to take reasonable steps to avoid the collision.' },
        { question: 'How is liability determined in a pedestrian accident?', answer: 'Drivers have a legal duty to avoid hitting pedestrians. Even when pedestrians are jaywalking or distracted, the driver should see and avoid them if possible. Surveillance footage, witness testimony, and police reports typically establish what happened.' },
        { question: 'Why do pedestrian injuries take longer to appear?', answer: 'Internal injuries, concussions, and fractures may not be apparent immediately due to adrenaline. Adrenaline suppresses pain at the scene; as it fades over hours to days, injuries become apparent. Immediate medical evaluation — even when feeling fine — is essential.' },
      ]),
    )
  }

  else if (dataKey === 'bicycle-accidents') {
    blocks.push(
      makeDirectAnswer('Bicycle Accident Claims', 'Bicycle accidents cause severe injuries because riders have no protection from a multi-ton vehicle. Average bicycle accident settlements range from $30,000 to $250,000+ depending on injury severity and liability. Most collisions are caused by drivers failing to yield, opening doors into bike lanes, or making right hooks. Many jurisdictions apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists.'),
      makeStatTiles('$95K Avg', 'Severe Injury', '70%+ Driver Fault', 'Vulnerable User Protected'),
      makeKeyTakeaways([
        'Most bike collisions are caused by drivers failing to yield, "dooring," or right-hook turns',
        'Vulnerable-road-user laws hold drivers to a heightened duty of care around cyclists',
        'Not wearing a helmet does not bar recovery in most states',
        'Head and spinal injuries make bicycle claims high-value despite the small vehicle',
        'Surveillance and traffic-camera footage is critical and overwritten within 72 hours',
      ]),
      makeProseSections([
        { title: 'Why Drivers Are Usually at Fault in Bicycle Accidents', content: [
          'Most bicycle accidents are caused by driver negligence — failing to yield at intersections, opening car doors into bike lanes ("dooring"), and making right turns across a cyclist\'s path ("right hook").',
          'Drivers frequently claim they "never saw" the cyclist. This is not a defense — it is an admission of inattention. Drivers have a duty to look for and yield to cyclists, who are legal users of the road.',
        ]},
        { title: 'Vulnerable Road User Protections', content: [
          'Many states and cities apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists. Some jurisdictions impose enhanced penalties when a driver injures a vulnerable user.',
          'Even where a cyclist made a minor error, the driver\'s failure to exercise reasonable care can establish liability.',
        ]},
        { title: 'The Helmet Question', content: [
          'Not wearing a helmet does not bar your recovery in most states. Insurance adjusters will raise it to argue comparative fault, but helmet non-use is generally inadmissible or irrelevant to liability for the collision itself.',
          'Wearing a helmet is always safer — but its absence should never stop an injured cyclist from pursuing a valid claim.',
        ]},
        { title: 'Documenting a Bicycle Accident Claim', content: [
          'Preserve the bicycle in its damaged condition, photograph the scene and bike-lane markings, and request nearby surveillance footage immediately — before it is overwritten within 72 hours.',
          'Witness statements are especially valuable in bicycle cases because they counter the common driver narrative that the cyclist "came out of nowhere."',
        ]},
      ]),
      makeFAQ([
        { question: 'Who is usually at fault in a bicycle accident with a car?', answer: 'In over 70% of bicycle accidents, the driver is at fault. Most collisions are caused by drivers failing to yield, opening car doors into bike lanes, or making right turns across a cyclist\'s path. Drivers have a duty to see and avoid cyclists.' },
        { question: 'Does not wearing a helmet prevent me from recovering after a bike accident?', answer: 'No, in most states. Not wearing a helmet does not bar your recovery. Insurance companies may argue comparative fault, but helmet non-use is generally inadmissible to liability for the collision itself.' },
        { question: 'What evidence is most important after a bicycle accident?', answer: 'Three things are most critical: (1) Surveillance footage — request immediately before it is overwritten within 72 hours; (2) Witness information — get names, numbers, and statements while memory is fresh; (3) Preserve the bicycle and photograph the scene.' },
      ]),
    )
  }

  else if (dataKey === 'rideshare-accidents') {
    blocks.push(
      makeDirectAnswer('Rideshare Accident Claims', 'Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers. Average rideshare accident settlements range from $30,000 to $200,000+ depending on injury severity and liability. Rideshare companies carry insurance that covers accidents during rides, but they often dispute coverage and liability. Early legal action is critical to preserve evidence.'),
      makeStatTiles('$85K Avg', 'Multiple Parties', '$1M+ Coverage', 'Coverage Disputes Common'),
      makeKeyTakeaways([
        'Rideshare accidents involve complex liability because multiple parties may be responsible',
        'Rideshare companies carry insurance that covers accidents during rides',
        'Rideshare companies often dispute coverage and liability to reduce their exposure',
        'The rideshare driver may be personally liable in addition to the rideshare company',
        'Early legal action is critical to preserve evidence and protect your rights',
      ]),
      makeProseSections([
        { title: 'Understanding Rideshare Liability', content: [
          'Multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers. Both the driver and the company can be held liable.',
          'The rideshare company is liable for the driver\'s negligence under vicarious liability — the company is responsible for hiring safe drivers and maintaining safe vehicles.',
        ]},
        { title: 'Rideshare Insurance Coverage', content: [
          'Rideshare companies carry insurance that covers accidents during rides — typically $1M+ for bodily injury liability. However, coverage depends on the driver\'s status at the time of the accident.',
          'If the driver was actively transporting a passenger, the rideshare company\'s insurance applies. If the driver was offline or waiting for a request, the driver\'s personal insurance applies — and many personal policies exclude commercial driving.',
          'Early legal action preserves GPS data and app records that prove the driver was on a trip.',
        ]},
        { title: 'Investigating Rideshare Accidents', content: [
          'Rideshare accidents require investigation into the driver\'s background, training, and history. Rideshare companies are required to conduct background checks.',
          'GPS data, app records, and telematics data from the vehicle can prove the driver\'s location, speed, and actions immediately before the accident.',
        ]},
        { title: 'Negotiating with Rideshare Companies', content: [
          'Rideshare companies employ sophisticated legal teams to aggressively defend claims. Do not accept the first offer. Negotiate.',
          'If negotiations stall, litigation may be necessary. Juries are often sympathetic to injured passengers and skeptical of rideshare company defenses.',
        ]},
      ]),
      makeFAQ([
        { question: 'Who is liable in a rideshare accident — the driver or the company?', answer: 'Both may be liable. The rideshare driver is responsible for negligent driving, and the company can be held vicariously liable under respondeat superior — the company is responsible for its drivers\' negligence while acting within the scope of employment.' },
        { question: 'Does the rideshare company insurance apply if the driver was waiting for a ride request?', answer: 'Usually no — it depends on the driver\'s status. If the driver was actively transporting a passenger or en route to pick one up, the rideshare company\'s $1M+ policy applies. If offline or waiting, only the driver\'s personal insurance applies — and many exclude commercial driving.' },
        { question: 'Why do rideshare companies dispute liability after accidents?', answer: 'Rideshare companies have enormous financial exposure from accidents. They employ legal teams to dispute coverage status, liability, and injury severity — arguing the driver was offline, the accident was the other party\'s fault, or injuries were pre-existing.' },
      ]),
    )
  }

  else if (dataKey === 'slip-and-fall') {
    blocks.push(
      makeDirectAnswer('Slip and Fall Claims', "Slip and fall claims are premises liability cases where a property owner or manager is responsible for injuries caused by unsafe conditions on their property. Average slip and fall settlements range from $10,000 to $100,000+ depending on injury severity and the property owner's negligence. Proving premises liability requires showing that the property owner knew or should have known about the unsafe condition and failed to fix it or warn visitors."),
      makeStatTiles('$35K Avg', 'Premises Liability', 'High Dispute Rate', 'Evidence Critical'),
      makeKeyTakeaways([
        'Slip and fall claims are premises liability cases where property owners are responsible for unsafe conditions',
        'Property owners must maintain safe conditions and warn visitors of known hazards',
        'Proving premises liability requires showing the property owner knew or should have known about the unsafe condition',
        'Property owners often dispute liability and argue that the visitor was careless',
        'Early evidence preservation (photographs, witness statements, maintenance records) is critical',
      ]),
      makeProseSections([
        { title: 'Understanding Premises Liability', content: [
          'Premises liability is the legal doctrine that property owners are responsible for injuries caused by unsafe conditions on their property. Property owners must maintain safe conditions and warn visitors of known hazards.',
          'Property owners are liable for injuries caused by unsafe conditions only if they knew or should have known about the condition. This is called constructive notice.',
        ]},
        { title: 'Proving the Property Owner Knew or Should Have Known', content: [
          'Maintenance records are critical evidence — if the property owner failed to inspect or maintain the property, this shows constructive notice. Witness testimony about how long the hazard existed is also valuable.',
          'Photographs of the unsafe condition taken immediately after the accident are objective evidence of the hazard.',
        ]},
        { title: 'Common Slip and Fall Hazards', content: [
          'Common slip and fall hazards include wet floors, ice, debris, uneven surfaces, poor lighting, and broken stairs. Each requires different evidence to prove premises liability.',
          'Wet floor hazards require evidence that the property owner failed to dry the floor or warn visitors. Ice hazards require evidence of failure to salt or sand the surface.',
        ]},
        { title: 'Property Owner Defenses and How to Counter Them', content: [
          'Property owners often argue that the visitor was careless. However, property owners cannot escape liability by arguing that visitors should have been more careful.',
          'Even if a hazard was open and obvious, property owners may still have a duty to warn if the hazard poses a serious risk of injury.',
        ]},
      ]),
      makeFAQ([
        { question: 'How do I prove a property owner is responsible for my slip and fall?', answer: 'Premises liability requires proving the property owner knew or should have known about the unsafe condition and failed to fix it or warn you. Key evidence includes: photographs of the hazard, maintenance records showing whether the property was inspected, witness testimony about how long the hazard existed.' },
        { question: 'Can a property owner avoid liability if the hazard was obvious?', answer: 'Not necessarily. Even if a hazard was open and obvious, property owners may still have a duty to warn if the hazard poses a serious risk of injury that a reasonable person might underestimate. Additionally, property owners cannot allow a hazard to persist indefinitely just because it is technically visible.' },
        { question: 'What should I do immediately after a slip and fall on someone else\'s property?', answer: 'Three critical steps: (1) Report the incident to the property owner or manager immediately and get a copy of the report in writing. (2) Photograph the hazard that caused your fall from multiple angles before it is corrected. (3) Seek immediate medical attention for your health and to create a record connecting your injuries to the fall.' },
      ]),
    )
  }

  else if (dataKey === 'dog-bites') {
    blocks.push(
      makeDirectAnswer('Dog Bite Claims', "Dog bite claims hold dog owners responsible for injuries caused by their dogs. Average dog bite settlements range from $15,000 to $100,000+ depending on injury severity and the dog owner's negligence. Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression. Dog bite injuries often require multiple surgeries, result in permanent scarring, and cause psychological trauma."),
      makeStatTiles('$42K Avg', '35 States Strict', 'Scarring Common', 'Usually Covered'),
      makeKeyTakeaways([
        'Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression',
        'Dog bite injuries often require multiple surgeries and result in permanent scarring',
        'Psychological trauma (fear of dogs, anxiety) is a valid claim in dog bite cases',
        'Dog owners have a duty to control their dogs and prevent them from injuring others',
        'Early medical documentation and evidence preservation are critical to maximize recovery',
      ]),
      makeProseSections([
        { title: 'Strict Liability vs. Negligence in Dog Bite Cases', content: [
          'Most states (35+) apply strict liability for dog bites — the dog owner is automatically liable for any injuries the dog causes, regardless of the dog\'s history or the owner\'s precautions.',
          'Strict liability removes the need to prove the dog owner was negligent. You only need to prove that the dog bit you and caused injury.',
          'A few states apply a "one bite rule" where the dog owner is liable only if they knew the dog was dangerous. Evidence of prior aggression — even if no bite occurred — is powerful evidence in those states.',
        ]},
        { title: 'Dog Bite Injuries and Medical Treatment', content: [
          'Dog bite injuries range from minor puncture wounds to severe lacerations requiring multiple surgeries. Dog bites often become infected because dog mouths contain bacteria.',
          'Dog bite injuries often require multiple surgeries to repair tissue damage, reduce scarring, and restore function. Plastic surgery may be necessary to minimize visible scarring.',
        ]},
        { title: 'Psychological Trauma and Emotional Damages', content: [
          'Dog bite injuries often cause psychological trauma including fear of dogs, anxiety, and PTSD. These psychological injuries are valid claims in dog bite cases.',
          'Children are particularly vulnerable to psychological trauma from dog bites. Document psychological injuries through mental health treatment records.',
        ]},
        { title: 'Holding Dog Owners Accountable', content: [
          'Dog owners have a duty to control their dogs and prevent them from injuring others. Evidence of leash law violations is powerful evidence of liability.',
          'If the dog owner knew the dog was dangerous and failed to take precautions, this is evidence of recklessness and may justify punitive damages.',
        ]},
      ]),
      makeFAQ([
        { question: 'What does strict liability mean in a dog bite case?', answer: 'In most states (35+), strict liability means the dog owner is automatically liable for any injuries your dog bite causes — regardless of whether the dog had ever bitten anyone before. You only need to prove the dog bit you and caused injury. This is a significantly lower bar than ordinary negligence claims.' },
        { question: 'Can I recover for psychological trauma after a dog bite?', answer: 'Yes. Psychological trauma — fear of dogs, anxiety, PTSD — is a valid component of a dog bite claim. This is especially true for children. Document psychological injuries through mental health treatment records, therapy notes, and counseling records.' },
        { question: 'What if the dog owner says their dog has never bitten anyone before?', answer: 'In strict liability states, that does not matter — the owner is liable regardless of the dog\'s history. In states with the one-bite rule, evidence of prior aggression — leash law violations, prior complaints, statements about the dog\'s behavior — can prove the owner knew the dog was dangerous.' },
      ]),
    )
  }

  else if (dataKey === 'workplace-injuries') {
    blocks.push(
      makeDirectAnswer('Workplace Injury Claims', "Most workplace injuries are covered by workers' compensation, which pays medical bills and partial lost wages regardless of fault — but bars you from suing your employer. The bigger recovery often comes from a third-party claim against a negligent party who is not your employer: an equipment manufacturer, a subcontractor, a property owner, or a driver in a work-related crash. Average third-party workplace settlements range from $50,000 to $500,000+ and can include full pain-and-suffering damages."),
      makeStatTiles('$120K Avg', 'No-Fault Workers Comp', 'Full Damages 3rd Party', 'Pain & Suffering 3rd Party Only'),
      makeKeyTakeaways([
        "Workers' comp pays medical bills and partial wages regardless of fault, but bars pain-and-suffering",
        "A third-party claim against a non-employer can recover full damages, including pain and suffering",
        "Common third parties: equipment makers, subcontractors, property owners, and other drivers",
        "You can usually pursue workers' comp and a third-party claim at the same time",
        "Workers' comp deadlines are short — report the injury to your employer immediately",
      ]),
      makeProseSections([
        { title: "Workers' Compensation: What It Covers and Its Limits", content: [
          "Workers' compensation is a no-fault system: it pays your medical bills and a portion of your lost wages regardless of who caused the injury. In exchange, you generally cannot sue your employer for negligence.",
          "Workers' comp does not pay for pain and suffering, and it replaces only part of your wages. For a serious injury, the difference between comp benefits and full damages can be enormous.",
          "Workers' comp deadlines are strict. Report the injury to your employer immediately and in writing — late reporting is a common reason valid claims are denied.",
        ]},
        { title: "The Third-Party Claim: Where the Real Value Often Is", content: [
          "A third-party claim is a separate lawsuit against a negligent party who is not your employer. Unlike workers' comp, it can recover full damages — including pain and suffering, full lost wages, and loss of future earning capacity.",
          "Common third parties include the manufacturer of defective equipment, a subcontractor or general contractor on a job site, the property owner where you were injured, and the at-fault driver in a work-related vehicle crash.",
        ]},
        { title: 'Common Third-Party Workplace Scenarios', content: [
          'Defective machinery: when equipment lacks proper guards or fails due to a design or manufacturing defect, the manufacturer may be liable in a product-liability claim.',
          'Construction sites: a subcontractor or general contractor whose negligence injured you can be a third-party defendant.',
          'Work-related vehicle crashes: the at-fault driver (and their insurer) is a third party in addition to any workers\' comp benefits.',
        ]},
        { title: 'Coordinating Comp and Third-Party Recovery', content: [
          "When you recover from both workers' comp and a third-party claim, the comp insurer typically has a lien — a right to be reimbursed from the third-party recovery. Skilled handling of this lien can substantially increase your net recovery.",
        ]},
      ]),
      makeFAQ([
        { question: "Why should I pursue a third-party claim if I already have workers' comp?", answer: "Workers' comp pays only medical bills and a portion of lost wages — it explicitly excludes pain and suffering and full lost earning capacity. A third-party claim can recover everything: full damages including pain and suffering, full lost wages, and loss of future earning capacity. For serious injuries, the difference can be enormous." },
        { question: 'Who can be a third party in a workplace injury case?', answer: 'Any negligent party who is not your direct employer. Common third parties include: equipment manufacturers (product liability), subcontractors or general contractors on construction sites, property owners, and drivers who caused a work-related vehicle crash.' },
        { question: "What is the workers' comp lien and how does it affect my settlement?", answer: "When you receive a third-party settlement, the workers' comp insurer that paid your medical bills typically has a legal lien — a right to be reimbursed from your third-party recovery. This can take a significant bite out of your net settlement. Skilled attorneys can often reduce or waive this lien through doctrines like the made-whole doctrine." },
      ]),
    )
  }

  else if (dataKey === 'wrongful-death') {
    blocks.push(
      makeDirectAnswer('Wrongful Death Claims', "Wrongful death claims allow family members to recover damages when a loved one dies due to another party's negligence. Average wrongful death settlements range from $100,000 to $1,000,000+ depending on the deceased's age, earning potential, and relationship to the family. Wrongful death claims are emotionally complex but legally straightforward: if negligence caused death, the responsible party is liable for all damages including lost income, funeral expenses, and pain and suffering of surviving family members."),
      makeStatTiles('$350K Avg', '$1M+ High Value', 'Punitive Available', '2–3yr Filing Window'),
      makeKeyTakeaways([
        'Wrongful death claims allow family members to recover damages when a loved one dies due to negligence',
        'Damages include lost income, funeral expenses, and pain and suffering of surviving family members',
        "The deceased's age and earning potential are primary factors in settlement value",
        'Wrongful death claims are emotionally complex but legally straightforward',
        'Early legal action is critical to preserve evidence and protect family interests',
      ]),
      makeProseSections([
        { title: 'What Constitutes Wrongful Death', content: [
          "Wrongful death occurs when a person dies as a result of another party's negligence, recklessness, or intentional conduct. The responsible party is liable for all damages resulting from the death.",
          'Wrongful death claims can arise from car accidents, truck accidents, pedestrian accidents, medical malpractice, workplace accidents, and other incidents involving negligence.',
        ]},
        { title: 'Who Can File a Wrongful Death Claim', content: [
          "Wrongful death claims are filed by the deceased's estate or by surviving family members. The specific family members who can file depend on state law, but typically include spouse, children, and parents.",
          'An attorney can explain the specific rules in your state and identify who has standing to file and who is entitled to the recovery.',
        ]},
        { title: 'Calculating Wrongful Death Damages', content: [
          "Wrongful death damages include economic damages (lost income, lost benefits, funeral expenses) and non-economic damages (pain and suffering of surviving family members, loss of companionship).",
          "Lost income is calculated based on the deceased's age, earning potential, and life expectancy. A 35-year-old earning $60,000/year with 30 years of earning potential has $1.8M in lost income.",
          'Non-economic damages depend on the relationship between the deceased and surviving family members. Spouses and minor children typically recover higher non-economic damages.',
        ]},
        { title: 'The Emotional and Legal Process', content: [
          'Wrongful death claims are emotionally complex. Families are grieving while also pursuing legal action. An experienced attorney handles the legal process while allowing families to focus on grief and healing.',
          'Early legal action is critical to preserve evidence and protect family interests.',
        ]},
      ]),
      makeFAQ([
        { question: 'Who can file a wrongful death claim after a death caused by negligence?', answer: "Who can file depends on state law. Typically, the deceased's estate — administered by an executor or administrator — files the claim for the benefit of surviving family members. In some states, surviving family members (spouse, children, parents) can file directly." },
        { question: 'How are wrongful death damages calculated?', answer: "Wrongful death damages include economic damages (lost income, lost benefits, funeral expenses) calculated by the deceased's age, earning potential, and life expectancy, plus non-economic damages (pain and suffering, loss of companionship) for surviving family members." },
        { question: 'What is the deadline to file a wrongful death claim?', answer: "The statute of limitations for wrongful death varies by state — typically 2 to 3 years from the date of death. Because evidence disappears and witnesses forget details quickly, consult an attorney as soon as possible after a death to preserve your rights." },
      ]),
    )
  }

  // ── Resource pillars (5) ────────────────────────────────────────────────────
  else if (dataKey === 'medical-malpractice') {
    blocks.push(
      makeDirectAnswer('Medical Malpractice', 'Medical malpractice occurs when a healthcare provider deviates from the accepted standard of care and that deviation injures the patient. It is one of the most complex and heavily-regulated areas of personal injury: nearly every state requires an expert physician to certify the claim, damage caps often apply, and deadlines are short and unusual. Not every bad outcome is malpractice — medicine carries inherent risk. Strong cases pair a clear standard-of-care breach with serious, documented harm.'),
      makeStatTiles('Expert Required', 'Many States', 'Short / Unusual', 'High'),
      makeKeyTakeaways([
        'Malpractice requires a breach of the accepted standard of care — not just a bad outcome',
        'Most states require an expert physician affidavit to even file the case',
        'Many states cap non-economic damages in malpractice specifically',
        'Statutes of limitations are short and often run from discovery of the harm',
        'Common types: misdiagnosis, surgical error, medication error, birth injury',
      ]),
      makeProseSections([
        { title: 'What Counts as Medical Malpractice', content: [
          'Medical malpractice has four elements: a duty of care, a breach of the accepted standard of care, causation (the breach caused the injury), and damages (real harm resulted). All four must be present — a poor outcome alone is not enough.',
          'The standard of care is what a reasonably competent provider in the same specialty would have done in the same circumstances. Establishing it almost always requires testimony from a qualified physician in the same field.',
          'Common malpractice types include misdiagnosis or delayed diagnosis, surgical errors, medication and dosage errors, anesthesia errors, birth injuries, and failure to obtain informed consent.',
        ]},
        { title: 'Why These Cases Are Different', content: [
          'Medical malpractice is procedurally unlike other injury claims. Most states require a certificate of merit or expert affidavit before you can file.',
          'Many states also impose caps on non-economic damages (pain and suffering) in malpractice cases specifically. Deadlines are short and unusual — some run from the date of the negligence, others from when you discovered the harm.',
        ]},
        { title: 'Proving Causation — the Hard Part', content: [
          "The toughest element in most malpractice cases is causation: proving the provider's breach — not the underlying illness — caused the harm.",
          "This is where expert evidence is decisive. Specialists reconstruct what should have happened, what did happen, and how the difference produced the injury. The quality of that expert testimony often determines the outcome.",
        ]},
      ]),
      makeFAQ([
        { question: 'Is a bad outcome the same as medical malpractice?', answer: 'No. Medicine carries inherent risk, and not every poor result is negligence. Malpractice requires that the provider breached the accepted standard of care — that a competent provider in the same situation would have acted differently — and that the breach caused real harm.' },
        { question: 'Do I need an expert to file a medical malpractice case?', answer: 'In most states, yes. A certificate of merit or expert affidavit from a qualified physician is typically required before filing. This is one reason malpractice cases are more expensive and rigorously screened than other injury claims.' },
        { question: 'How long do I have to file a medical malpractice claim?', answer: 'Deadlines are short and vary by state — the clock may run from the date of the negligence or from when you discovered the harm. Because the rules are unusual and unforgiving, get specific guidance quickly.' },
      ]),
    )
  }

  else if (dataKey === 'dealing-with-insurance') {
    blocks.push(
      makeDirectAnswer('Dealing With Insurance After an Accident', "After an accident, the other driver's insurance adjuster is not a neutral party — their job is to resolve your claim for as little as possible. You are not legally required to give a recorded statement, sign a blanket medical authorization, or accept a first offer, and each of those is a tactic used to reduce your claim. The safest approach: report the facts to your own insurer, decline recorded statements from the other side, never speculate about fault, and route substantive communication through a representative. First offers commonly come in 40 to 60 percent below a claim's real value."),
      makeStatTiles('Not Required', '40-60% Low', 'Decline It', 'Document'),
      makeKeyTakeaways([
        "You are not required to give the other driver's insurer a recorded statement",
        'A blanket medical authorization hands over your entire history — limit it',
        'First settlement offers are typically 40 to 60 percent below real value',
        "Guarding your words — refusing to say you are fine or speculate about fault protects your claim",
        'Your own insurer still requires prompt, factual cooperation',
      ]),
      makeProseSections([
        { title: 'Whose Side the Adjuster Is On', content: [
          "An insurance adjuster's role is to protect the insurer's money. Friendly or not, every question is designed to establish shared fault, minimize your injuries, or lock you into an early, low number.",
          "There is a difference between your own insurer and the other side's. You owe your own insurer prompt, truthful cooperation. You owe the other driver's insurer almost nothing — and certainly not a recorded statement.",
        ]},
        { title: 'The Tactics — and the Counter to Each', content: [
          'The recorded statement: framed as routine, it exists to capture words they can use against you. You can decline. The blanket medical authorization: opens your entire medical history — authorize only records tied to this accident.',
          'The quick offer: a fast check before you know the extent of your injuries, which you cannot reopen once accepted. The friendly check-in: "How are you feeling?" becomes "the claimant said they were fine."',
        ]},
        { title: 'How to Protect Your Claim From Day One', content: [
          'Report the accident to your own insurer promptly and factually. Get medical care the same day, and keep every record. Photograph everything and preserve evidence before it disappears.',
          'Decline recorded statements from the other insurer and do not speculate about fault or your injuries. Keep communication in writing where you can.',
        ]},
      ]),
      makeFAQ([
        { question: "Do I have to give the other driver's insurance a recorded statement?", answer: "No. You are not legally required to give the other party's insurer a recorded statement. Adjusters request it because recorded answers can be used against you. You can decline and route communication through a representative." },
        { question: 'Why is the first insurance settlement offer so low?', answer: "Insurers expect negotiation, so first offers commonly come in 40 to 60 percent below a claim's real value — often before your full injuries are known. Accepting ends the claim permanently." },
        { question: 'Should I sign the medical authorization the adjuster sent?', answer: 'Not a blanket one. A broad authorization gives the insurer your entire medical history to search for pre-existing conditions. Limit any release to records directly related to this accident, for the relevant treatment dates.' },
      ]),
    )
  }

  else if (dataKey === 'how-to-document-an-accident') {
    blocks.push(
      makeDirectAnswer('How to Document an Accident', 'Documenting an accident well, in the first hours and days, is the single biggest thing you can do to protect a claim. The priority order: ensure safety and call 911, then photograph everything (vehicles, positions, the scene, road conditions, signals, and your injuries), collect witness names and numbers, exchange information, and request a police report. Within 72 hours, preserve any nearby surveillance footage before it is overwritten, and keep a daily symptom and treatment log. Evidence fades fast — skid marks within hours, footage within days, witness memory within weeks.'),
      makeStatTiles('72 Hours', 'Call 911', 'From Every Angle', 'Daily'),
      makeKeyTakeaways([
        'Call 911 and get a police report — it anchors the entire claim',
        'Photograph vehicles, positions, the scene, signals, and injuries',
        'Collect witness names and numbers while memory is fresh',
        'Preserve nearby surveillance footage within 72 hours',
        'Keep a daily symptom and treatment log from day one',
      ]),
      makeProseSections([
        { title: 'The First Hour: What to Capture', content: [
          'Safety first — move to a safe spot if you can and call 911. Request police even for a minor crash; the official report is the most important single document in your claim.',
          "Photograph everything before anything moves: vehicle damage from multiple angles, the vehicles' final positions, license plates, the intersection or roadway, traffic signals and signs, skid marks and debris, weather and lighting, and your own visible injuries.",
        ]},
        { title: 'The First 72 Hours: Preserve What Fades', content: [
          'Surveillance footage from nearby businesses, traffic cameras, and doorbells is typically overwritten within 48 to 72 hours. Identify cameras that may have caught the crash and request preservation immediately.',
          'Skid marks fade within hours and the scene is cleared quickly, so your early photos may be the only permanent record.',
          'Start a daily log: your symptoms, pain levels, missed work, and every medical visit. This contemporaneous record is far more persuasive than a memory reconstructed months later.',
        ]},
        { title: 'Turning Documentation Into a Strong Claim', content: [
          "Good documentation protects the truth from fading and removes the insurer's favorite arguments — that you weren't really hurt, that you waited too long, or that you share fault.",
          'Consistency matters as much as completeness. A clean chain from the crash to same-day care to a finished treatment plan tells a story no adjuster can easily discount.',
        ]},
      ]),
      makeFAQ([
        { question: 'What should I photograph after a car accident?', answer: 'Photograph vehicle damage from multiple angles, the final positions of the vehicles, license plates, the roadway and intersection, traffic signals and signs, skid marks and debris, weather and lighting conditions, and any visible injuries. More is better.' },
        { question: 'How long do I have to get surveillance footage of my accident?', answer: 'Usually 48 to 72 hours. Nearby business cameras, traffic cameras, and doorbell cameras typically overwrite footage within a few days. Identify possible cameras immediately and send a preservation request right away.' },
        { question: 'Should I keep a journal after my accident?', answer: 'Yes. A daily log of your symptoms, pain levels, missed work, and medical visits creates a contemporaneous record that is far more credible than a later reconstruction. It directly supports both the severity and the timeline of your injuries.' },
      ]),
    )
  }

  else if (dataKey === 'how-contingency-fees-work') {
    blocks.push(
      makeDirectAnswer('How Contingency Fees Work', "Personal-injury lawyers almost always work on a contingency fee: you pay no upfront fee, and the lawyer is paid a percentage of the recovery only if they win or settle your case. The typical fee is around one-third (33 percent), often rising to about 40 percent if the case goes to trial. Case costs (filing fees, expert witnesses, records) are separate and are usually advanced by the firm and reimbursed from the recovery. If there is no recovery, you generally owe no attorney fee. This structure exists so that injured people can afford representation regardless of their financial situation."),
      makeStatTiles('$0', '~33%', '~40%', 'No Fee'),
      makeKeyTakeaways([
        'No upfront fee — the lawyer is paid only from a successful recovery',
        'The standard fee is about one-third (33 percent), often 40 percent if it goes to trial',
        'Case costs are separate and usually advanced by the firm',
        'If there is no recovery, you generally owe no attorney fee',
        'Always confirm the percentage and cost terms in the written agreement',
      ]),
      makeProseSections([
        { title: 'What Contingency Actually Means', content: [
          "A contingency fee means the lawyer's payment is contingent on winning. You pay nothing up front and nothing out of pocket; the fee is a percentage of whatever the lawyer recovers for you by settlement or verdict.",
          "If the case does not result in a recovery, you generally owe no attorney fee at all. The lawyer absorbs the risk and the time. This is why injured people can hire experienced counsel without having any money to start.",
        ]},
        { title: 'The Numbers: Fees vs. Costs', content: [
          "The fee is the lawyer's percentage — most commonly one-third (33 percent) of the recovery, rising to around 40 percent if the case goes to trial, because trial work is far more intensive.",
          'Costs are different from the fee — filing fees, expert witnesses, medical records, depositions. Most firms advance these and are reimbursed from the recovery.',
        ]},
        { title: 'Why This Model Protects Claimants', content: [
          "Contingency fees align the lawyer's incentive with yours: they are paid more only if they recover more, and nothing if they recover nothing.",
          'It levels the field against insurers, who have unlimited resources. An injured person can match that with experienced representation that costs nothing unless it works.',
        ]},
      ]),
      makeFAQ([
        { question: 'How much does a personal injury lawyer cost?', answer: 'Most personal-injury lawyers charge a contingency fee of about one-third (33 percent) of the recovery, rising to roughly 40 percent if the case goes to trial. You pay no upfront fee, and if there is no recovery you generally owe no attorney fee.' },
        { question: 'What happens to fees if I lose my case?', answer: 'Under a standard contingency agreement, if there is no recovery you generally owe no attorney fee. Responsibility for case costs (filing fees, experts) varies by firm and is spelled out in the written agreement.' },
        { question: 'What is the difference between fees and costs?', answer: "The fee is the lawyer's percentage of the recovery. Costs are case expenses — filing fees, expert witnesses, medical records, depositions. Most firms advance the costs and are reimbursed from the recovery." },
      ]),
    )
  }

  else if (dataKey === 'medical-liens-subrogation') {
    blocks.push(
      makeDirectAnswer('Medical Liens & Subrogation', 'A medical lien or subrogation claim is a right to be repaid from your settlement by whoever covered your accident-related care — health insurers, government programs like Medicare and Medicaid, hospitals, or treatment providers who waited to be paid. These claims can take a large bite out of a settlement, which is why the headline number is rarely what you take home. The crucial point: many liens are negotiable. Skilled reduction of liens — challenging unrelated charges, applying made-whole and common-fund doctrines, and negotiating with each holder — can meaningfully increase what you actually keep.'),
      makeStatTiles('From Settlement', 'Insurers / Medicare', 'Often Yes', 'Major'),
      makeKeyTakeaways([
        'Liens and subrogation let payers recover accident-related costs from your settlement',
        'Health insurers, Medicare, Medicaid, hospitals, and providers can all assert claims',
        'These claims explain why your net check is smaller than the gross settlement',
        'Many liens are negotiable — reductions directly increase your net recovery',
        'Made-whole and common-fund doctrines can limit what a lienholder collects',
      ]),
      makeProseSections([
        { title: 'Liens vs. Subrogation — the Same Idea, Two Forms', content: [
          "Both are about reimbursement. A medical lien is a provider's or program's legal claim to be paid from your settlement. Subrogation is a health insurer's right to recover what it paid for your care out of your recovery from the at-fault party.",
          "These claims are why a $100,000 settlement does not mean $100,000 in your pocket. Holders can include private health insurers, ERISA employer plans, Medicare and Medicaid, hospitals, and providers who treated you on a letter of protection.",
        ]},
        { title: 'Why This Is a Depth Issue Most People Miss', content: [
          'Liens are where settlements are quietly won or lost. Two identical settlements can produce very different take-home amounts depending entirely on how well the liens were handled.',
          "Many liens are negotiable or limited by law. The made-whole doctrine can stop an insurer from collecting until you are fully compensated; the common-fund doctrine can require a lienholder to share the cost of obtaining the recovery.",
        ]},
        { title: 'Protecting Your Net Recovery', content: [
          "The goal is your net — what you keep after fees, costs, and liens. Maximizing the gross settlement is only half the job; reducing the liens is the other half, and it is often where the most money is recovered for the client.",
          "Done well, lien negotiation can add thousands to a claimant's pocket. Because the rules differ by lien type and state, experienced help before settlement is finalized is one of the strongest reasons to have representation.",
        ]},
      ]),
      makeFAQ([
        { question: 'What is a medical lien on a settlement?', answer: 'A medical lien is a legal right to be repaid from your settlement for accident-related care. Hospitals, treatment providers, health insurers, and government programs can assert one. It is why your net check is smaller than the gross settlement — and many liens can be negotiated down.' },
        { question: 'What is subrogation in a personal injury case?', answer: "Subrogation is a health insurer's right to recover what it paid for your accident-related care out of your settlement. The idea is to prevent double recovery for the same bills. Doctrines like made-whole and common-fund can limit how much the insurer collects." },
        { question: 'Can medical liens be reduced?', answer: 'Often, yes. Many liens are negotiable, and legal doctrines (made-whole, common-fund) plus challenges to unrelated or inflated charges can reduce what a lienholder collects. Skilled lien reduction directly increases the amount you actually keep from a settlement.' },
      ]),
    )
  }

  // ── FAQ pillar (1) ─────────────────────────────────────────────────────────
  else if (dataKey === 'faq') {
    blocks.push(
      makeFAQ([
        // Getting Started
        { question: 'How long do I have to file a personal injury claim?', answer: 'The statute of limitations varies by state, typically 1 to 6 years from the date of injury (most commonly 2 to 3). Missing it permanently bars your claim. Evidence disappears far sooner, so acting early matters even though the legal deadline is later.' },
        { question: 'Do I need a lawyer for my injury claim?', answer: "Not always, but representation tends to increase outcomes, especially where liability is disputed, injuries are serious, or the state's fault rule is harsh. Most injury lawyers work on contingency — no upfront fee — so a free consultation costs nothing to find out." },
        { question: 'How much does a personal injury lawyer cost?', answer: 'Most charge a contingency fee of about one-third (33 percent) of the recovery, often around 40 percent if the case goes to trial. You pay no upfront fee, and if there is no recovery you generally owe no attorney fee. Case costs are separate.' },
        // What My Claim Is Worth
        { question: 'How is a personal injury settlement calculated?', answer: "Adjusters add up economic damages (medical bills, lost wages) and multiply by roughly 1.5x to 5x for severity to estimate non-economic damages. Your state's fault rule is then applied. First offers commonly come in 40 to 60 percent below real value." },
        { question: 'Why is my settlement check smaller than the settlement amount?', answer: 'Three things come out of a gross settlement: the attorney fee, case costs, and medical liens/subrogation. Negotiating the liens down is one of the biggest levers on your net recovery.' },
        { question: 'What does comparative or contributory negligence mean?', answer: "They are the rules for shared fault. Pure comparative reduces your recovery by your fault percentage. Modified comparative bars you at 50 percent or 51 percent fault. Contributory negligence (Virginia, Maryland, DC, North Carolina, Alabama) bars recovery if you are even 1 percent at fault." },
        // After a Crash
        { question: 'What should I do immediately after an accident?', answer: "Call 911 and get a police report, photograph everything before it moves, collect witness names and numbers, avoid admitting fault, seek medical care the same day, and preserve nearby surveillance footage within 72 hours." },
        { question: 'Should I see a doctor even if I feel fine?', answer: "Yes. Adrenaline masks injuries, and conditions like whiplash, concussion, and internal bleeding can take hours to days to appear. A same-day medical record also connects your injuries to the crash, which protects a claim." },
        { question: 'Why do injury symptoms appear days after a crash?', answer: "Adrenaline suppresses pain at the scene; as it fades over 6 to 72 hours, inflammation builds and injuries become apparent. Delayed symptoms are medically normal — which is why prompt evaluation matters even if you initially felt okay." },
      ]),
    )
  }

  // ── Common closing blocks (applied to all non-FAQ categories) ───────────────
  if (dataKey !== 'faq') {
    blocks.push(
      makeHowWeKeepAccurate(authorId, ACCURACY_DETAIL[dataKey] ?? 'This guide is reviewed quarterly by a licensed personal injury attorney and updated whenever relevant law or regulations change materially.'),
      makeSources(
        `${METADATA.find(m => m.slug === dataKey)?.title ?? dataKey} Guide — CasePort`,
        SOURCES[dataKey] ?? [],
      ),
      makeExploreMore(
        (EXPLORE_MORE_MAP[dataKey] ?? [])
          .map((key) => idMap[key])
          .filter(Boolean),
      ),
    )
  }

  return blocks
}

// ─── Metadata helper (used inside buildBlocks) ─────────────────────────────────
const METADATA = [
  { slug: 'car-accidents',            title: 'Car Accidents' },
  { slug: 'truck-accidents',           title: 'Truck Accidents' },
  { slug: 'motorcycle-accidents',       title: 'Motorcycle Accidents' },
  { slug: 'pedestrian-accidents',       title: 'Pedestrian Accidents' },
  { slug: 'bicycle-accidents',         title: 'Bicycle Accidents' },
  { slug: 'rideshare-accidents',        title: 'Rideshare Accidents' },
  { slug: 'slip-and-fall',             title: 'Slip & Fall' },
  { slug: 'dog-bites',                 title: 'Dog Bites' },
  { slug: 'workplace-injuries',        title: 'Workplace Injury' },
  { slug: 'wrongful-death',            title: 'Wrongful Death' },
  { slug: 'medical-malpractice',       title: 'Medical Malpractice' },
  { slug: 'dealing-with-insurance',    title: 'Dealing With Insurance' },
  { slug: 'how-to-document-an-accident', title: 'How To Document An Accident' },
  { slug: 'how-contingency-fees-work', title: 'How Contingency Fees Work' },
  { slug: 'medical-liens-subrogation', title: 'Medical Liens & Subrogation' },
  { slug: 'faq',                      title: 'Injury Claim FAQ' },
]

// ─── Entry point ──────────────────────────────────────────────────────────────
run().catch((e) => {
  console.error('\n❌ Seed failed:', e.message || e)
  process.exit(1)
})
