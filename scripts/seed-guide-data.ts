/**
 * Seed Script: GuideCategories + GuideArticles
 * Run: npx tsx scripts/seed-guide-data.ts
 *
 * Creates:
 * - 11 GuideCategories (car-accident, truck-accident, slip-and-fall, etc.)
 * - ~40 GuideArticles (4 sub-guides per category × 10 + state/city/FAQ articles)
 *
 * Uses Payload Local API — no authentication needed.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

// ─── Category Data ────────────────────────────────────────────────────────────────

interface CategorySeed {
  title: string
  slug: string
  description: string
  icon: string
  displayOrder: number
}

const categories: CategorySeed[] = [
  {
    title: 'Car Accident Guide',
    slug: 'car-accident',
    description: 'Comprehensive guidance for car accident victims. Learn what to do, settlement amounts, and whether you need a lawyer.',
    icon: '🚗',
    displayOrder: 1,
  },
  {
    title: 'Truck Accident Guide',
    slug: 'truck-accident',
    description: 'High-value cases involving trucking companies. Catastrophic injuries, complex liability.',
    icon: '🚛',
    displayOrder: 2,
  },
  {
    title: 'Slip & Fall Guide',
    slug: 'slip-and-fall',
    description: 'Premises liability. Property owner negligence. Common in stores and workplaces.',
    icon: '🏢',
    displayOrder: 3,
  },
  {
    title: 'Medical Malpractice Guide',
    slug: 'medical-malpractice',
    description: 'Doctor negligence and surgical errors. Complex cases requiring expert testimony.',
    icon: '⚕️',
    displayOrder: 4,
  },
  {
    title: 'Workplace Injury Guide',
    slug: 'workplace-injury',
    description: 'Workers compensation and third-party claims. On-the-job injuries.',
    icon: '🦺',
    displayOrder: 5,
  },
  {
    title: 'Motorcycle Accident Guide',
    slug: 'motorcycle-accident',
    description: 'Severe injuries, bias against riders. High-value settlements.',
    icon: '🏍️',
    displayOrder: 6,
  },
  {
    title: 'Rideshare Accident Guide',
    slug: 'rideshare-accident',
    description: 'Uber/Lyft accidents. Complex liability between platform and driver.',
    icon: '🚙',
    displayOrder: 7,
  },
  {
    title: 'Pedestrian Accident Guide',
    slug: 'pedestrian-accident',
    description: 'Pedestrian vs. vehicle. Urban high-volume. Severe injuries.',
    icon: '🚶',
    displayOrder: 8,
  },
  {
    title: 'Dog Bite Guide',
    slug: 'dog-bite',
    description: 'Dog owner liability. Strict liability laws vary by state.',
    icon: '🐕',
    displayOrder: 9,
  },
  {
    title: 'Wrongful Death Guide',
    slug: 'wrongful-death',
    description: 'Fatal accidents. Surviving family recovery. Highest emotional stakes.',
    icon: '🕯️',
    displayOrder: 10,
  },
  {
    title: 'Insurance Claims Guide',
    slug: 'insurance-claims',
    description: 'Claim denials and disputes. Bad faith insurance practices.',
    icon: '📋',
    displayOrder: 11,
  },
]

// ─── SubGuide Template ─────────────────────────────────────────────────────────

function makeSubGuide(title: string, slug: string, description: string, pageType: 'guide' | 'faq' | 'state' | 'city', catId: string, catSlug: string, extraFields: any = {}) {
  return {
    title,
    slug,
    excerpt: description,
    description,
    pageType,
    guideCategory: catId,
    _status: 'published',
    focusKeyword: title.toLowerCase(),
    metaTitle: `${title} | CasePort`,
    metaDescription: description.slice(0, 155),
    directAnswer: `This guide covers ${title.toLowerCase()}. ${description} Get a free consultation.`,
    voiceAnswer: `The answer to ${title.toLowerCase()} is in this guide.`,
    schemaType: pageType === 'faq' ? 'FAQPage' : 'HowTo',
    content: JSON.stringify({
      root: {
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: `Understanding ${title}` }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: `${description} This guide provides comprehensive information to help you understand your rights and options.` }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'Key Steps to Take' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: '1. Document everything related to your case. 2. Seek medical attention. 3. Contact an attorney. 4. File your claim before the statute of limitations expires.' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'Settlement Information' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Settlement amounts vary based on injury severity, medical bills, lost wages, and liability. With an attorney, you typically receive 3-5x more than without legal representation.' }],
          },
        ],
      },
    }),
    faqSection: [
      { question: `What should I do first for a ${title.toLowerCase()}?`, answer: `Document your case, seek medical attention, and contact an attorney immediately. Time is critical.` },
      { question: `How much is my ${title.toLowerCase()} case worth?`, answer: `Settlement amounts vary widely. With an attorney, cases typically settle for significantly more than without.` },
      { question: `How long does a ${title.toLowerCase()} case take?`, answer: `Most cases settle in 6-18 months. Complex cases can take longer.` },
      { question: `Do I need an attorney for a ${title.toLowerCase()}?`, answer: `Yes. You typically receive 3-5x more with an attorney. Most offer free consultations.` },
    ],
    keyStatistics: [
      { text: 'Average settlement with attorney is 3-5x higher', sourceName: 'Industry Data', sourceUrl: '', year: '2024' },
      { text: 'Most cases settle before trial', sourceName: 'Industry Data', sourceUrl: '', year: '2024' },
    ],
    secondaryKeywords: [
      { keyword: 'personal injury' },
      { keyword: 'settlement' },
      { keyword: 'attorney' },
    ],
    sameAsEntityUrls: [{ url: 'https://www.caseport.io' }],
    speakableCssSelectors: [{ selector: '#main-content' }],
    sgeOptimizedAnswer: `This guide covers ${title.toLowerCase()}. Key steps include documenting your case, seeking medical attention, and contacting an attorney.`,
    expertReviewer: 'Jane Smith, Esq.',
    expertCredentials: 'Personal Injury Attorney, 20+ years experience',
    expertQuote: 'Time is critical. The sooner you act, the stronger your case.',
    ...extraFields,
  }
}

// ─── State Seed Data ───────────────────────────────────────────────────────────

const states: Array<{
  slug: string; state: string; abbreviation: string; statuteYears: number;
  negligenceType: string; avgSettlement: string; topCities: string[];
}> = [
  { slug: 'california', state: 'California', abbreviation: 'CA', statuteYears: 2, negligenceType: 'Comparative Negligence', avgSettlement: '$50,000 - $80,000', topCities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Fresno'] },
  { slug: 'texas', state: 'Texas', abbreviation: 'TX', statuteYears: 2, negligenceType: 'Comparative Negligence', avgSettlement: '$45,000 - $75,000', topCities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'] },
  { slug: 'florida', state: 'Florida', abbreviation: 'FL', statuteYears: 4, negligenceType: 'Comparative Negligence', avgSettlement: '$50,000 - $85,000', topCities: ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale'] },
  { slug: 'new-york', state: 'New York', abbreviation: 'NY', statuteYears: 3, negligenceType: 'Comparative Negligence', avgSettlement: '$55,000 - $90,000', topCities: ['New York City', 'Brooklyn', 'Queens', 'Bronx', 'Albany'] },
  { slug: 'illinois', state: 'Illinois', abbreviation: 'IL', statuteYears: 2, negligenceType: 'Comparative Negligence', avgSettlement: '$40,000 - $70,000', topCities: ['Chicago', 'Springfield', 'Rockford', 'Peoria', 'Naperville'] },
  { slug: 'pennsylvania', state: 'Pennsylvania', abbreviation: 'PA', statuteYears: 2, negligenceType: 'Comparative Negligence', avgSettlement: '$40,000 - $65,000', topCities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Harrisburg', 'Scranton'] },
  { slug: 'ohio', state: 'Ohio', abbreviation: 'OH', statuteYears: 2, negligenceType: 'Comparative Negligence', avgSettlement: '$35,000 - $60,000', topCities: ['Columbus', 'Cleveland', 'Cincinnati', 'Dayton', 'Toledo'] },
  { slug: 'georgia', state: 'Georgia', abbreviation: 'GA', statuteYears: 2, negligenceType: 'Comparative Negligence', avgSettlement: '$40,000 - $65,000', topCities: ['Atlanta', 'Augusta', 'Savannah', 'Macon', 'Columbus'] },
  { slug: 'arizona', state: 'Arizona', abbreviation: 'AZ', statuteYears: 2, negligenceType: 'Comparative Negligence', avgSettlement: '$45,000 - $75,000', topCities: ['Phoenix', 'Mesa', 'Scottsdale', 'Chandler', 'Glendale'] },
  { slug: 'washington', state: 'Washington', abbreviation: 'WA', statuteYears: 3, negligenceType: 'Comparative Negligence', avgSettlement: '$50,000 - $80,000', topCities: ['Seattle', 'Tacoma', 'Spokane', 'Vancouver', 'Bellevue'] },
]

// ─── City Seed Data ────────────────────────────────────────────────────────────

const cities: Array<{
  slug: string; city: string; state: string; abbreviation: string; population: string;
}> = [
  { slug: 'los-angeles-california', city: 'Los Angeles', state: 'California', abbreviation: 'CA', population: '4M' },
  { slug: 'houston-texas', city: 'Houston', state: 'Texas', abbreviation: 'TX', population: '2.3M' },
  { slug: 'phoenix-arizona', city: 'Phoenix', state: 'Arizona', abbreviation: 'AZ', population: '1.6M' },
  { slug: 'miami-florida', city: 'Miami', state: 'Florida', abbreviation: 'FL', population: '450K' },
  { slug: 'chicago-illinois', city: 'Chicago', state: 'Illinois', abbreviation: 'IL', population: '2.7M' },
]

// ─── FAQ Seed Data ─────────────────────────────────────────────────────────────

const faqSeeds = [
  { slug: 'statute-of-limitations', title: 'Statute of Limitations for Personal Injury', question: 'How long do I have to file a personal injury claim?', answer: 'The statute of limitations varies by state, typically between 2-4 years from the date of injury. In California and Texas, it\'s 2 years. In Florida, it\'s 4 years. In New York, it\'s 3 years. Missing this deadline means losing your right to recover forever.' },
  { slug: 'settlement-amounts', title: 'Average Personal Injury Settlement Amounts', question: 'How much is my personal injury case worth?', answer: 'Settlement amounts depend on injury severity, medical bills, lost wages, and liability. Minor injuries settle for $5,000-$25,000. Moderate injuries settle for $25,000-$100,000. Severe injuries with permanent disability can settle for $100,000-$500,000+. With an attorney, you typically receive 3-5x more.' },
  { slug: 'do-i-need-lawyer', title: 'Do I Need a Lawyer for My Personal Injury Case?', question: 'Do I really need a lawyer for my personal injury case?', answer: 'Yes. Insurance companies have teams of lawyers working against you. With a lawyer, you typically receive 3-5x more money. Lawyers work on contingency (no upfront cost). Most personal injury cases settle without going to trial.' },
  { slug: 'what-is-personal-injury', title: 'What Is a Personal Injury Case?', question: 'What constitutes a personal injury case?', answer: 'A personal injury case arises when someone is injured due to another party\'s negligence. This includes car accidents, truck accidents, slip and fall, medical malpractice, workplace injuries, and more. You can recover damages for medical bills, lost wages, pain and suffering, and future medical care.' },
  { slug: 'pain-and-suffering', title: 'How Is Pain and Suffering Calculated?', question: 'How is pain and suffering calculated in a settlement?', answer: 'Pain and suffering is typically calculated as a multiplier of your medical bills (usually 3-5x). For severe injuries with permanent disability, the multiplier can be higher. Factors include injury severity, recovery time, permanent disability, and impact on quality of life.' },
]

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  console.log('🚀 Starting Guide seed...\n')

  const payload = await getPayload({ config: configPromise })

  // 1. Seed categories
  console.log('📁 Seeding GuideCategories...')
  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    try {
      const existing = await payload.find({
        collection: 'guideCategories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        createdCategories[cat.slug] = existing.docs[0].id as string
        console.log(`  ⏭️  Already exists: ${cat.title}`)
        continue
      }
      const result = await payload.create({
        collection: 'guideCategories',
        data: cat,
        depth: 0,
      })
      createdCategories[cat.slug] = result.id as string
      console.log(`  ✅ Created: ${cat.title}`)
    } catch (err) {
      console.error(`  ❌ Error creating category ${cat.title}:`, err)
    }
  }

  // 2. Seed sub-guides for each category
  console.log('\n📄 Seeding GuideArticles (sub-guides)...')

  const subGuideTemplates = [
    { titleSuffix: 'What To Do After a {category}', slugSuffix: 'what-to-do', description: 'Immediate action steps for {category} victims. Call 911, document everything, get medical attention.' },
    { titleSuffix: '{category} Settlement Amounts', slugSuffix: 'settlement-amounts', description: 'Real settlement data by injury type. Learn what your {category} case is worth.' },
    { titleSuffix: 'Do I Need a Lawyer for {category}?', slugSuffix: 'do-i-need-a-lawyer', description: 'Why you need an attorney for your {category}. Statistics on 5x more money with representation.' },
    { titleSuffix: '{category} Statute of Limitations', slugSuffix: 'statute-of-limitations', description: 'Critical deadlines for filing your {category} claim. State-by-state deadlines.' },
  ]

  const categoryDisplayNames: Record<string, string> = {
    'car-accident': 'Car Accident',
    'truck-accident': 'Truck Accident',
    'slip-and-fall': 'Slip & Fall',
    'medical-malpractice': 'Medical Malpractice',
    'workplace-injury': 'Workplace Injury',
    'motorcycle-accident': 'Motorcycle Accident',
    'rideshare-accident': 'Rideshare Accident',
    'pedestrian-accident': 'Pedestrian Accident',
    'dog-bite': 'Dog Bite',
    'wrongful-death': 'Wrongful Death',
    'insurance-claims': 'Insurance Claims',
  }

  for (const cat of categories) {
    const catId = createdCategories[cat.slug]
    if (!catId) continue

    const displayName = categoryDisplayNames[cat.slug] || cat.title.replace(' Guide', '')

    for (const tmpl of subGuideTemplates) {
      const title = tmpl.titleSuffix.replace('{category}', displayName)
      const slug = `${cat.slug}-${tmpl.slugSuffix}`
      const description = tmpl.description.replace('{category}', displayName)

      try {
        const existing = await payload.find({
          collection: 'guideArticles',
          where: { slug: { equals: slug } },
          limit: 1,
        })
        if (existing.docs.length > 0) {
          console.log(`  ⏭️  Already exists: ${title}`)
          continue
        }

        const articleData = makeSubGuide(title, slug, description, 'guide', catId, cat.slug)
        const result = await payload.create({
          collection: 'guideArticles',
          data: {
            ...articleData,
            _isSeeding: true,
          } as any,
          depth: 0,
        })
        console.log(`  ✅ Created: ${title}`)
      } catch (err: any) {
        console.error(`  ❌ Error creating article ${title}:`, err?.message || err)
      }
    }
  }

  // 3. Seed state articles
  console.log('\n🏛️ Seeding GuideArticles (state pages)...')
  for (const state of states) {
    try {
      const existing = await payload.find({
        collection: 'guideArticles',
        where: { slug: { equals: state.slug }, pageType: { equals: 'state' } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`  ⏭️  Already exists: ${state.state}`)
        continue
      }

      const result = await payload.create({
        collection: 'guideArticles',
        data: {
          title: `Personal Injury Guide | ${state.state}`,
          slug: state.slug,
          excerpt: `Complete guide to personal injury law in ${state.state}. Statute of limitations, settlement ranges, and your rights.`,
          description: `Personal Injury Law Guide for ${state.state}`,
          pageType: 'state',
          _status: 'published',
          focusKeyword: `${state.state} personal injury`,
          metaTitle: `Personal Injury Guide | ${state.state} | CasePort`,
          metaDescription: `Learn about personal injury claims, statute of limitations, and settlement ranges in ${state.state}.`,
          directAnswer: `In ${state.state}, the statute of limitations for personal injury is ${state.statuteYears} years from the date of injury. Average settlements range from ${state.avgSettlement}.`,
          voiceAnswer: `The statute of limitations in ${state.state} is ${state.statuteYears} years.`,
          schemaType: 'Article',
          targetStates: [state.abbreviation],
          settlementData: {
            average: state.avgSettlement,
            successRate: '90%',
            timeline: '12-18 months',
            upfrontCost: '$0',
            minSettlement: '$15,000',
            maxSettlement: '$500,000+',
            avgSettlement: state.avgSettlement,
            rangesByInjury: [
              { injuryType: 'Minor (soft tissue)', minAmount: '$5,000', maxAmount: '$25,000', recoveryTime: '3-6 months' },
              { injuryType: 'Moderate (fractures)', minAmount: '$25,000', maxAmount: '$100,000', recoveryTime: '6-12 months' },
              { injuryType: 'Severe (permanent disability)', minAmount: '$100,000', maxAmount: '$500,000+', recoveryTime: '12-24 months' },
            ],
          },
          statuteOfLimitations: {
            years: state.statuteYears,
            description: `Personal injury cases in ${state.state} have a ${state.statuteYears}-year statute of limitations from the date of injury.`,
            exceptions: [
              { exception: `Minors: ${state.statuteYears} years from age 18` },
              { exception: 'Mental incapacity: May extend deadline' },
              { exception: 'Defendant absence from state: May toll deadline' },
            ],
          },
          negligenceType: state.negligenceType,
          negligenceDescription: `${state.state} follows a ${state.negligenceType} rule. You can recover damages even if you are partially at fault, but your recovery is reduced by your percentage of fault.`,
          topCities: state.topCities,
          keyStatistics: [
            { text: `Average settlement in ${state.state}: ${state.avgSettlement}`, sourceName: 'Industry Data', sourceUrl: '', year: '2024' },
            { text: `Statute of limitations: ${state.statuteYears} years`, sourceName: `${state.state} State Law`, sourceUrl: '', year: '2024' },
          ],
          faqSection: [
            { question: `What is the statute of limitations in ${state.state}?`, answer: `${state.statuteYears} years from the date of injury.` },
            { question: `What is the average personal injury settlement in ${state.state}?`, answer: `Average settlements range from ${state.avgSettlement}.` },
            { question: `Does ${state.state} follow comparative negligence?`, answer: `Yes. Your recovery is reduced by your percentage of fault.` },
          ],
          secondaryKeywords: [{ keyword: `${state.state} personal injury` }, { keyword: `${state.state} settlement` }],
          sameAsEntityUrls: [{ url: 'https://www.caseport.io' }],
          speakableCssSelectors: [{ selector: '#main-content' }],
          sgeOptimizedAnswer: `In ${state.state}, the statute of limitations is ${state.statuteYears} years. Average settlements range from ${state.avgSettlement}.`,
          expertReviewer: 'Jane Smith, Esq.',
          expertCredentials: 'Personal Injury Attorney',
          _isSeeding: true,
        } as any,
        depth: 0,
      })
      console.log(`  ✅ Created state: ${state.state}`)
    } catch (err: any) {
      console.error(`  ❌ Error creating state ${state.state}:`, err?.message || err)
    }
  }

  // 4. Seed city articles
  console.log('\n🏙️ Seeding GuideArticles (city pages)...')
  for (const city of cities) {
    try {
      const existing = await payload.find({
        collection: 'guideArticles',
        where: { slug: { equals: city.slug }, pageType: { equals: 'city' } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`  ⏭️  Already exists: ${city.city}`)
        continue
      }

      const result = await payload.create({
        collection: 'guideArticles',
        data: {
          title: `Personal Injury Lawyer in ${city.city}`,
          slug: city.slug,
          excerpt: `Personal injury law guide for ${city.city}, ${city.state}. Statute of limitations and settlement information.`,
          description: `Personal Injury Law Guide for ${city.city}`,
          pageType: 'city',
          _status: 'published',
          focusKeyword: `${city.city} personal injury`,
          metaTitle: `Personal Injury Lawyer in ${city.city} | CasePort`,
          metaDescription: `Learn about personal injury claims, statute of limitations, and settlement ranges in ${city.city}.`,
          directAnswer: `In ${city.city}, ${city.state}, personal injury cases are common. The statute of limitations follows state law. Settlements vary by injury severity. Contact an attorney for a free case evaluation.`,
          voiceAnswer: `In ${city.city}, personal injury settlements depend on your specific case.`,
          schemaType: 'Article',
          targetCities: [`${city.city}, ${city.abbreviation}`],
          targetStates: [city.abbreviation],
          population: city.population,
          commonInjuries: ['Car accidents', 'Workplace injuries', 'Slip and fall', 'Medical malpractice'],
          resources: [
            { title: `${city.state} Bar Association`, url: 'https://example.com' },
            { title: `California Personal Injury Laws`, url: 'https://example.com' },
          ],
          keyStatistics: [
            { text: `Population: ${city.population}`, sourceName: 'Census Data', sourceUrl: '', year: '2024' },
            { text: 'Most cases settle in 6-18 months', sourceName: 'Industry Data', sourceUrl: '', year: '2024' },
          ],
          faqSection: [
            { question: `What is the statute of limitations in ${city.city}?`, answer: 'It follows state law, typically 2-4 years.' },
            { question: `How much is my ${city.city} case worth?`, answer: 'Settlement amounts depend on injury severity. Contact an attorney for a free evaluation.' },
          ],
          secondaryKeywords: [{ keyword: `${city.city} personal injury` }, { keyword: `${city.city} lawyer` }],
          sameAsEntityUrls: [{ url: 'https://www.caseport.io' }],
          speakableCssSelectors: [{ selector: '#main-content' }],
          sgeOptimizedAnswer: `In ${city.city}, personal injury cases follow state law. Contact an attorney for a free case evaluation.`,
          _isSeeding: true,
        } as any,
        depth: 0,
      })
      console.log(`  ✅ Created city: ${city.city}`)
    } catch (err: any) {
      console.error(`  ❌ Error creating city ${city.city}:`, err?.message || err)
    }
  }

  // 5. Seed FAQ articles
  console.log('\n❓ Seeding GuideArticles (FAQ pages)...')
  for (const faq of faqSeeds) {
    try {
      const existing = await payload.find({
        collection: 'guideArticles',
        where: { slug: { equals: faq.slug }, pageType: { equals: 'faq' } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`  ⏭️  Already exists: ${faq.title}`)
        continue
      }

      const result = await payload.create({
        collection: 'guideArticles',
        data: {
          title: faq.title,
          slug: faq.slug,
          excerpt: faq.answer.slice(0, 295),
          description: faq.title,
          pageType: 'faq',
          _status: 'published',
          focusKeyword: faq.slug.replace('-', ' '),
          metaTitle: `${faq.title} | CasePort`,
          metaDescription: faq.answer.slice(0, 155),
          directAnswer: faq.answer,
          voiceAnswer: faq.answer,
          schemaType: 'FAQPage',
          keyStatistics: [
            { text: 'Time is critical in personal injury cases', sourceName: 'Industry Data', sourceUrl: '', year: '2024' },
          ],
          faqSection: [
            { question: faq.question, answer: faq.answer },
          ],
          secondaryKeywords: [{ keyword: 'personal injury' }, { keyword: 'faq' }],
          sameAsEntityUrls: [{ url: 'https://www.caseport.io' }],
          speakableCssSelectors: [{ selector: '#answer-text' }],
          sgeOptimizedAnswer: faq.answer.slice(0, 100),
          expertReviewer: 'Jane Smith, Esq.',
          expertCredentials: 'Personal Injury Attorney',
          _isSeeding: true,
        } as any,
        depth: 0,
      })
      console.log(`  ✅ Created FAQ: ${faq.title}`)
    } catch (err: any) {
      console.error(`  ❌ Error creating FAQ ${faq.title}:`, err?.message || err)
    }
  }

  console.log('\n🎉 Seed complete!\n')
  console.log('Summary:')
  console.log(`  - ${Object.keys(createdCategories).length} GuideCategories`)
  console.log(`  - ${states.length} State pages`)
  console.log(`  - ${cities.length} City pages`)
  console.log(`  - ${faqSeeds.length} FAQ pages`)
  console.log('\nNext: Run npm run generate:types then npm run build')
}

seed().catch(console.error)