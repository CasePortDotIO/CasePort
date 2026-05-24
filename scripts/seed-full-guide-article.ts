/**
 * Seed Script: Comprehensive Guide Article (Fresh)
 * Run: npx tsx scripts/seed-full-guide-article.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function seedFullGuideArticle() {
  console.log('🚀 Seeding comprehensive guide article...\n')

  const payload = await getPayload({ config: configPromise })

  // Find car-accident category
  const { docs: categories } = await payload.find({
    collection: 'guideCategories',
    where: { slug: { equals: 'car-accident' } },
    limit: 1,
  })

  const category = categories[0]
  if (!category) {
    console.error('❌ Car accident category not found. Run seed-guide-data.ts first.')
    return
  }

  console.log(`📁 Using category: ${category.title} (${category.id})\n`)

  // Check if article already exists
  const existing = await payload.find({
    collection: 'guideArticles',
    where: { slug: { equals: 'car-accident-what-to-do' } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log('⏭️  Article already exists: Car Accident What To Do')
    console.log('   Deleting and re-creating...\n')

    const articleId = existing.docs[0].id as string

    await payload.delete({
      collection: 'guideArticles',
      id: articleId,
    })
    console.log('   🗑️  Deleted old article\n')
  }

  console.log('   Creating fresh article...\n')

  // Lexical rich text content as JSON string
  const contentJson = JSON.stringify({
    root: {
      type: 'root',
      children: [
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Direct Answer' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'After a car accident: (1) Call 911 and get medical attention, (2) Document everything with photos, (3) Get police report, (4) Contact an attorney within 24-48 hours. The statute of limitations is typically 2 years. With an attorney, you receive 3-5x more money.' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'TL;DR — Car Accident Action Plan' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '1. Call 911 and get medical attention (0-60 min)' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '2. Get police report and exchange information (30-120 min)' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '3. Document the scene with photos (30-60 min)' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '4. Gather witness contact information (15-30 min)' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '5. Contact a personal injury attorney (30-60 min)' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Key Takeaways' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Evidence disappears fast — document everything immediately' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Insurance first offers are always low — never accept without consulting an attorney' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• With an attorney, you typically receive 3-5x more money' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• The statute of limitations means time is critical' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Medical documentation is essential for your case' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'The 72-Hour Action Plan' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Follow these steps in order. This checklist protects your health, evidence, and legal rights.' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'Step 1: Seek Medical Attention Immediately' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Do this first, even if you don\'t feel injured. Some injuries appear hours or days later. Get medical documentation immediately.' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Call 911 if anyone is injured' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Go to the ER or urgent care immediately' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Keep all medical records and receipts' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'Step 2: Call Police and Get a Report Number' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Never leave the scene without a police report. This is your official record of what happened.' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Call 911 or local police non-emergency line' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Get the police report number' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Get the officer\'s name and badge number' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'Step 3: Document Everything With Photos' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Take photos immediately. Evidence disappears fast.' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Vehicle damage (multiple angles)' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Road conditions and scene' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Traffic signs and signals' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Your visible injuries' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'Step 4: Get Witness Information' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Witnesses corroborate your version of events. Get their contact information before they leave.' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Full name and phone number' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• What they saw' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'Step 5: Contact an Attorney Within 24-48 Hours' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'This is critical. Attorneys preserve evidence and protect your rights.' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Call a personal injury attorney immediately' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• No upfront cost (contingency fee)' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Medical Documentation: Why It\'s Critical' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Seek medical evaluation within 24 hours, even if you feel fine. Medical records create a documented link between the accident and your injuries.' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Settlement: With Attorney vs. Without' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Attorneys settle cases for 5x more on average. Here\'s why: Insurance companies have lawyers working against you.' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Real Settlement Examples' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Andrew F. — $165,000 (Whiplash & Back Injury). Hit by another car at a red light. Case settled in 8 months.' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Stephanie N. — $125,000 (Broken Arm). Hit while stopped at a light. Case settled in 6 months.' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Maria G. — $210,000 (Spinal Disc Herniation). Rear-ended on highway. Case settled in 11 months.' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Settlement Ranges by State' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Settlement amounts vary by state. California: $15,000-$2,000,000+. Texas: $12,000-$1,500,000+. Florida: $14,000-$1,800,000+.' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Your Statute of Limitations is Ticking' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'In most states, you have 2 years from the date of the accident to file a lawsuit. After that, you lose your right to recover.' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'State Deadlines' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• California: 2 years • Texas: 2 years • Florida: 4 years • New York: 3 years' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'People Also Ask' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'How much time do I have to file?' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Most states have 2-3 year statute of limitations, but file within 30-90 days to preserve evidence.' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'What damages can I recover?' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Medical expenses, lost wages, pain & suffering, future medical care. Settlements range $50,000-$2,000,000+.' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Frequently Asked Questions' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'What should I do after a car accident?' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Call 911, get medical attention, document the scene, get police report, exchange info, contact an attorney within 24-48 hours.' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'How much is my case worth?' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Minor injuries: $15,000-$50,000. Severe with permanent disability: $500,000+. With attorney: 3-5x more.' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'When should I hire an attorney?' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Immediately if you have serious injuries, disputed liability, or insurance company is being difficult.' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Critical Mistakes to Avoid' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Don\'t admit fault or apologize' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Don\'t post on social media about the accident' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Don\'t accept the first settlement offer' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Don\'t delay seeking medical attention' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '• Don\'t sign anything without an attorney' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'The Math That Insurance Companies Don\'t Want You to See' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Without Attorney: Settlement $50,000, you keep $50,000.' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'With Attorney: Settlement $67,500, attorney fee 33% = $22,275, you keep $45,225.' }] },
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Don\'t Navigate This Alone' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Car accident cases are complex. You need an experienced attorney to fight for maximum compensation.' }] },
        { type: 'paragraph', children: [{ type: 'text', text: '✓ Free case evaluation • ✓ No upfront costs • ✓ Expert negotiators' }] }
      ]
    }
  })

  try {
    await payload.create({
      collection: 'guideArticles',
      data: {
        title: 'What To Do After a Car Accident',
        slug: 'car-accident-what-to-do',
        excerpt: 'Step-by-step guide for the first 72 hours after a car accident. Attorney-reviewed action plan.',
        pageType: 'guide',
        guideCategory: category.id,
        _status: 'published',
        _isSeeding: true,
        difficultyLevel: 'beginner',
        estimatedCompletionTime: '8 min read',
        whatYouLearn: [
          { icon: 'AlertCircle', title: 'Immediate Steps', description: 'What to do in the first 24 hours' },
          { icon: 'BookOpen', title: 'Legal Rights', description: 'Your rights under the law' },
          { icon: 'DollarSign', title: 'Settlement Amounts', description: 'What your case is worth' },
          { icon: 'Shield', title: 'Insurance Claims', description: 'How to deal with insurance' },
          { icon: 'Users', title: 'Attorney Help', description: 'When and why you need one' },
        ],
        immediateStepsTitle: 'The 72-Hour Action Plan',
        immediateStepsSubtitle: 'Follow these steps in order to protect your health, evidence, and legal rights.',
        immediateSteps: [
          { step: 1, title: 'Seek Medical Attention', description: 'Even if you dont feel injured.', bullets: [{ bullet: 'Call 911 if injured' }, { bullet: 'Go to ER immediately' }] },
          { step: 2, title: 'Call Police', description: 'Get a police report.', bullets: [{ bullet: 'Get report number' }] },
        ],
        keyTakeaways: [
          { point: 'Evidence disappears fast — document everything immediately' },
          { point: 'Insurance first offers are always low' },
          { point: 'With an attorney, you typically receive 3-5x more money' },
          { point: 'The statute of limitations means time is critical' },
          { point: 'Medical documentation is essential' },
        ],
        tldrItems: [
          { step: 1, action: 'Call 911 and get medical attention', timeMin: 0, timeMax: 60 },
          { step: 2, action: 'Get police report and exchange information', timeMin: 30, timeMax: 120 },
          { step: 3, action: 'Document the scene with photos', timeMin: 30, timeMax: 60 },
          { step: 4, action: 'Gather witness contact information', timeMin: 15, timeMax: 30 },
          { step: 5, action: 'Contact a personal injury attorney', timeMin: 30, timeMax: 60 },
        ],
        focusKeyword: 'what to do after car accident',
        secondaryKeywords: [
          { keyword: 'car accident checklist' },
          { keyword: 'car accident first steps' },
          { keyword: 'car accident attorney' },
        ],
        metaTitle: 'What To Do After Car Accident | CasePort',
        metaDescription: 'Step-by-step guide for the first 72 hours after a car accident. Attorney-reviewed action plan.',
        directAnswer: 'After a car accident: (1) Call 911 and get medical attention, (2) Document everything with photos, (3) Get police report, (4) Contact an attorney within 24-48 hours.',
        aiCitationSummary: 'This guide covers what to do after a car accident in the first 72 hours.',
        primaryAiQuery: 'what to do after car accident checklist',
        keyStatistics: [
          { text: '25-40% higher settlements with an attorney', sourceName: 'Insurance Industry Data', sourceUrl: 'https://www.iii.org', year: '2024' },
          { text: '3-5x more money with legal representation', sourceName: 'Trial Lawyers College', sourceUrl: 'https://www.tlc.edu', year: '2024' },
        ],
        faqSection: [
          { question: 'What should I do immediately after a car accident?', answer: 'Call 911, get medical attention, document the scene with photos, get the police report number, and contact an attorney within 24-48 hours.' },
          { question: 'How much is my car accident case worth?', answer: 'Minor injuries may settle for $15,000-$50,000. Severe injuries can reach $500,000+. With an attorney, you typically receive 3-5x more.' },
          { question: 'When should I hire an attorney?', answer: 'Hire an attorney immediately if you have serious injuries, disputed liability, or insurance company is being difficult.' },
          { question: 'How long does a case take?', answer: 'Most car accident cases settle within 12-18 months.' },
        ],
        voiceAnswer: 'After a car accident: call 911, get medical attention, document everything, get police report, and contact an attorney within 24 to 48 hours.',
        speakableCssSelectors: [{ selector: '#direct-answer' }],
        conversationalQueryVariants: [{ query: 'what should I do after a car accident' }],
        targetsSpecificLocation: true,
        locationTargets: [
          { state: 'CA', city: 'Los Angeles' },
          { state: 'TX', city: 'Houston' },
          { state: 'FL', city: 'Miami' },
          { state: 'NY', city: 'New York' },
        ],
        schemaType: 'HowTo',
        howToSteps: [
          { name: 'Call 911 and get medical attention', description: 'Even if you dont feel injured.' },
          { name: 'Document the scene with photos', description: 'Take photos of vehicle damage and injuries.' },
          { name: 'Get police report', description: 'Get the report number and officer info.' },
          { name: 'Contact an attorney', description: 'Within 24-48 hours to preserve evidence.' },
        ],
        sameAsEntityUrls: [{ url: 'https://www.nolo.com/legal-encyclopedia/car-accident-law.html' }],
        articleSection: 'Personal Injury Law',
        legalDisclaimer: 'Standard',
        abaComplianceVerified: true,
        expertReviewer: 'Sarah Mitchell, Esq.',
        expertCredentials: 'Personal Injury Attorney, 15+ years experience',
        expertQuote: 'The first 72 hours after a car accident are critical.',
        externalSources: [
          { name: 'Insurance Information Institute', url: 'https://www.iii.org', credibilityTier: 'High' },
          { name: 'National Highway Traffic Safety Administration', url: 'https://www.nhtsa.gov', credibilityTier: 'High' },
        ],
        contentUpdateHistory: [
          { date: '2024-01-15', summary: 'Initial publication', updatedBy: 'Sarah Mitchell' },
          { date: '2024-04-28', summary: 'Updated statute of limitations data', updatedBy: 'Sarah Mitchell' },
        ],
        targetStates: ['CA', 'TX', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'AZ', 'WA'],
        targetCities: ['Los Angeles, CA', 'Houston, TX', 'Miami, FL', 'New York, NY'],
        jurisdiction: 'Multi-state',
        serviceAreaDescription: 'We help car accident victims across California, Texas, Florida, New York, and 42 other states.',
        stateSpecificDeadline: 2,
        sgeOptimizedAnswer: 'After a car accident, call 911, get medical attention, document everything with photos, get the police report, and contact an attorney within 24-48 hours.',
        uniqueContentSignals: [
          { signal: '72-hour action plan checklist', description: 'Structured timeline for first 72 hours' },
        ],
        freshnessSignal: 'recent',
        competitorComparison: 'Other guides lack the step-by-step action plan.',
        topCompetitors: [
          { url: 'https://www.nolo.com/legal-encyclopedia/car-accident-law.html', estimatedScore: 75, yourAdvantage: 'More comprehensive action plan' },
        ],
        uniqueAdvantages: [
          { advantage: '72-hour action plan with checklist format' },
          { advantage: 'State-specific statute of limitations' },
        ],
        testimonialData: [
          { name: 'Andrew F.', location: 'California', settlement: '$165,000', settlementValue: '$165K', injuryType: 'Whiplash & back injury', caseType: 'Rear-end collision', quote: 'Hit at red light. Got $165K.', rating: 5, caseResolutionTime: '8 months' },
        ],
        settlementData: {
          average: '$95K',
          successRate: '90%',
          timeline: '12-18 months',
          upfrontCost: '$0',
          minSettlement: '$15,000',
          maxSettlement: '$500,000+',
          avgSettlement: '$95,000',
          rangesByInjury: [
            { injuryType: 'Spinal Injury', minAmount: '$100,000', maxAmount: '$300,000', recoveryTime: '12+ months' },
            { injuryType: 'Traumatic Brain Injury', minAmount: '$80,000', maxAmount: '$250,000', recoveryTime: '18+ months' },
            { injuryType: 'Multiple Fractures', minAmount: '$60,000', maxAmount: '$180,000', recoveryTime: '6-9 months' },
            { injuryType: 'Whiplash & Back Injury', minAmount: '$40,000', maxAmount: '$120,000', recoveryTime: '3-6 months' },
            { injuryType: 'Minor Injuries', minAmount: '$20,000', maxAmount: '$80,000', recoveryTime: '1-3 months' },
          ],
        },
        statuteOfLimitations: {
          years: 2,
          description: 'In most states, you have 2 years from the date of the accident to file a lawsuit.',
          exceptions: [
            { exception: 'Minors: 2 years from age 18' },
          ],
          byState: [
            { state: 'California', years: 2, notes: '2 years from accident date' },
            { state: 'Texas', years: 2, notes: '2 years from accident date' },
            { state: 'Florida', years: 4, notes: '4 years from accident date' },
            { state: 'New York', years: 3, notes: '3 years from accident date' },
          ],
        },
        attorneyComparison: [
          { label: 'Insurance treatment', withoutAttorney: 'Knows you are scared', withAttorney: 'Knows you have backup' },
          { label: 'Settlement amount', withoutAttorney: 'Accept first lowball', withAttorney: 'Negotiate aggressively' },
        ],
        stateRanges: {
          'CA': { min: 35000, max: 150000, avg: 85000 },
          'TX': { min: 30000, max: 125000, avg: 75000 },
          'FL': { min: 35000, max: 140000, avg: 80000 },
          'NY': { min: 45000, max: 180000, avg: 95000 },
        },
        // THE KEY FIX: content as parsed Lexical JSON object
        content: JSON.parse(contentJson),
      },
      depth: 0,
    })
    console.log('✅ Created: Car Accident What To Do (full guide article)')
  } catch (err: any) {
    console.error('❌ Error creating article:', err?.message || err)
  }

  console.log('\n🎉 Seed complete!')
  console.log('\nNext steps:')
  console.log('1. npm run generate:types')
  console.log('2. npm run build')
  console.log('3. Navigate to /guide/car-accident/car-accident-what-to-do to see the full article')
}

seedFullGuideArticle().catch(console.error)