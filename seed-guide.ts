/**
 * Seed script for GuideBlocks and GuideArticles.
 * Run: npx tsx seed-guide.ts
 *
 * Creates:
 *  - One TestGuideBlocks entry (all 22 B2C block types)
 *  - One GuideArticle with all 6 guide block types + full SEO/AEO fields
 *
 * Uses _isSeeding flag to bypass beforeValidate hooks.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

const run = async () => {
  const payload = await getPayload({ config })

  // ─── Author ──────────────────────────────────────────────────────────────────
  const authorsResult = await payload.find({ collection: 'authors', limit: 1 })
  const author = authorsResult.docs[0]
  if (!author) {
    throw new Error('No author found. Run the main seed first to create an author.')
  }

  // ─── Guide Category ───────────────────────────────────────────────────────────
  let category = await payload.find({
    collection: 'guideCategories',
    where: { slug: { equals: 'car-accidents' } },
    limit: 1,
  }).then(r => r.docs[0])

  if (!category) {
    const catResult = await payload.create({
      collection: 'guideCategories',
      data: {
        title: 'Car Accidents',
        slug: 'car-accidents',
        description: 'Complete guides for car accident injury claims',
        icon: '🚗',
        _isSeeding: true,
      } as any,
    })
    category = catResult
    // eslint-disable-next-line no-console
    console.log('Created guide category: car-accidents')
  }

  // ─── GuideArticle with all blocks ─────────────────────────────────────────────
  // All content fields are now in blocks — no more top-level duplicate fields
  const guideArticleData = {
    _status: 'draft',
    _isSeeding: true,
    title: 'What To Do After a Car Accident: Complete Guide',
    slug: 'what-to-do-after-a-car-accident',
    author: author.id,
    guideCategory: category.id,
    pageType: 'guide',
    heroImage: undefined,
    excerpt: 'A complete step-by-step guide covering the first 72 hours after a car accident — medical care, evidence, insurance, and legal deadlines.',
    subtitle: 'Your 72-hour action plan for protecting your health and your claim',
    executiveSummary: 'This comprehensive guide walks you through every critical step after a car accident — from ensuring your safety at the scene to understanding settlement timelines and deadlines.',
    focusKeyword: 'what to do after a car accident',
    metaTitle: 'What To Do After a Car Accident | Complete Guide',
    metaDescription: 'Step-by-step guide to the first 72 hours after a car accident: medical care, evidence, insurance claims, and legal deadlines.',
    secondaryKeywords: [
      { keyword: 'car accident checklist' },
      { keyword: 'car accident claim process' },
      { keyword: 'car accident settlement timeline' },
      { keyword: 'car accident injuries documentation' },
    ],
    voiceAnswer: 'After a car accident, prioritize your safety, call 911, seek medical attention, document the scene thoroughly, exchange information, and consult a personal injury attorney before speaking with insurance companies.',
    schemaType: 'HowTo',
    articleSection: 'Legal',
    apaCitation: 'CasePort Editorial Team. (2024). What To Do After a Car Accident: Complete Guide.',
    howToSteps: [
      { name: 'Call 911 and ensure safety', description: 'Move to safety, call emergency services, and report all injuries.' },
      { name: 'Document the accident scene', description: 'Photograph all vehicles, damage, injuries, and road conditions before vehicles are moved.' },
      { name: 'Seek medical evaluation', description: 'Get checked by a medical professional even if you feel fine — some injuries appear later.' },
      { name: 'Exchange information', description: "Get the other driver's name, insurance policy number, license plate, and contact information." },
      { name: 'Consult a personal injury attorney', description: 'Before giving any recorded statements or accepting any offers, speak with an attorney.' },
    ],
    sameAsEntityUrls: [
      { url: 'https://en.wikipedia.org/wiki/Traffic_collision' },
      { url: 'https://www.wikidata.org/wiki/Q17205' },
    ],
    expertReviewer: 'J.M., Personal Injury Attorney (20+ years)',
    expertCredentials: 'Barred in California, Texas, and New York',
    externalSources: [
      { name: 'National Highway Traffic Safety Administration', url: 'https://www.nhtsa.gov', credibilityTier: 'High' },
      { name: 'Insurance Research Council', url: 'https://www.insurance.org', credibilityTier: 'High' },
      { name: 'American Bar Association', url: 'https://www.americanbar.org', credibilityTier: 'High' },
    ],
    targetStates: ['CA', 'TX', 'FL', 'NY', 'AZ'],
    geoOptimization: {
      targetStates: ['CA', 'TX', 'FL', 'NY', 'AZ'],
      stateSpecificDeadline: 2,
      stateSpecificExceptions: 'Claims against government vehicles require notice within 180 days regardless of the general statute of limitations.',
    },
    sgeOptimizedAnswer: 'To protect your car accident claim, call 911, document the scene with photos, seek medical care, exchange information with the other driver, and consult a personal injury attorney before speaking with insurance companies or accepting any settlement offers. Settlement amounts vary by injury severity and state, ranging from $15,000 for minor injuries to over $500,000 for catastrophic injuries.',
    freshnessSignal: 'evergreen',
    legalDisclaimer: 'Standard',
    difficultyLevel: 'beginner',
    estimatedCompletionTime: '8 min read',
    searchIntent: 'Informational',
    targetSerpFeature: 'Featured snippet, People Also Ask',
    contentConfidence: 'High',
    reviewCycle: '6months',
    // ── ALL CONTENT NOW IN BLOCKS ──────────────────────────────────────────
    blocks: [
      // 1. Standfirst — the lede
      {
        blockType: 'standfirst',
        text: 'A car accident moves fast and the hours afterward matter more than most people realize. This guide walks you through exactly what to do, in order, to protect your health and your claim.',
      },
      // 2. Direct Answer — AI snippet answer
      {
        blockType: 'directAnswer',
        text: 'After a car accident, call 911 and get medical care even if you feel fine. Document the scene with photos, exchange insurance information, and avoid giving recorded statements to any insurer before consulting a personal injury attorney about your claim.',
        speakable: true,
      },
      // 3. Quick Action Plan — timed TL;DR
      {
        blockType: 'quickActionPlan',
        items: [
          { phase: 'At the Scene', timeWindow: 'First 30 minutes', text: 'Get to safety, call 911, and photograph everything before vehicles are moved.' },
          { phase: 'Same Day', timeWindow: 'First hours', text: 'Get a medical evaluation and keep every record.' },
          { phase: 'First 72 Hours', timeWindow: 'Next 3 days', text: 'Write down what you remember, avoid insurer recorded statements, and consult an attorney.' },
        ],
      },
      // 4. Key Takeaways
      {
        blockType: 'keyTakeaways',
        items: [
          { item: 'Your health comes first — get evaluated even if you feel fine, because some injuries surface later.' },
          { item: 'Evidence disappears quickly — photos, witness details, and the police report are hard to recover after the scene clears.' },
          { item: 'Deadlines are real and vary by state, and government-vehicle claims have very short notice windows.' },
        ],
      },
      // 5. Step Checklist
      {
        blockType: 'stepChecklist',
        intro: 'Work through these in order during the first 72 hours.',
        steps: [
          { name: 'Get to Safety and Call 911', timeWindow: 'Immediately', bullets: [{ b: 'Move out of traffic if you can do so safely' }, { b: 'Report injuries so paramedics are dispatched' }, { b: 'Do not admit fault to anyone at the scene' }] },
          { name: 'Document the Scene', timeWindow: 'Before vehicles move', bullets: [{ b: 'Photograph all vehicles, damage, and road conditions' }, { b: 'Capture the other driver\'s name, license plate, and insurance info' }, { b: 'Get contact info from any witnesses' }] },
          { name: 'Get Medical Care', timeWindow: 'Same day', bullets: [{ b: 'A prompt evaluation protects your health and documents the injury' }, { b: 'Keep all medical records, bills, and receipts' }, { b: 'Follow through on all follow-up appointments' }] },
          { name: 'Protect Your Claim', timeWindow: 'Within 72 hours', bullets: [{ b: 'Do not give recorded statements to any insurer yet' }, { b: 'Do not accept any settlement offers yet' }, { b: 'Write down everything you remember while it is fresh' }] },
        ],
      },
      // 6. Citation Fact — sourced statistics
      {
        blockType: 'citationFact',
        facts: [
          { fact: 'Claimants with legal representation recover 3.5x more on average than those without.', source: 'Insurance Research Council', sourceUrl: 'https://www.insurance.org' },
          { fact: 'Only 4% of claimants handle their cases without an attorney.', source: 'American Bar Association', sourceUrl: 'https://www.americanbar.org' },
        ],
      },
      // 7. Stat Callout — single standout stat
      {
        blockType: 'statCallout',
        value: '$16,500',
        label: 'Average car accident settlement',
        source: 'National Highway Traffic Safety Administration',
        sourceUrl: 'https://www.nhtsa.gov',
      },
      // 8. Immediate Actions Block (guide-specific)
      {
        blockType: 'immediateActions',
        title: 'Your First 72-Hour Checklist',
        subtitle: 'These steps, in order, protect both your health and your legal claim',
        steps: [
          { step: 1, title: 'Ensure Safety & Call 911', description: 'Move to a safe location if possible. Call 911 even for minor accidents — a police report is critical.', timeNote: 'Within 15 minutes', bullets: [{ bullet: 'Move vehicles out of traffic if possible' }, { bullet: 'Turn on hazard lights' }, { bullet: 'Call 911 and report all injuries' }] },
          { step: 2, title: 'Document the Scene', description: 'Photograph everything before vehicles are moved. This evidence is hard to recreate later.', timeNote: 'Before vehicles move', bullets: [{ bullet: 'All vehicle damage from multiple angles' }, { bullet: 'License plates and insurance cards' }, { bullet: 'Road conditions, traffic signs, skid marks' }, { bullet: 'Injuries visible on your body' }] },
          { step: 3, title: 'Get Medical Care', description: 'Even if you feel fine, get evaluated. Soft tissue injuries and concussions often show up hours or days later.', timeNote: 'Same day as accident', bullets: [{ bullet: 'Keep all medical records and receipts' }, { bullet: 'Follow all prescribed treatment plans' }, { bullet: 'Note any symptoms that develop later' }] },
          { step: 4, title: 'Protect Your Claim', description: "The other side's insurance company is already building their case. You need to protect yours.", timeNote: 'Within 72 hours', bullets: [{ bullet: 'Do not give recorded statements yet' }, { bullet: 'Do not accept any settlement offers yet' }, { bullet: 'Write down everything you remember while it is fresh' }] },
        ],
      },
      // 9. Medical Documentation Block
      {
        blockType: 'medicalDocumentation',
        introText: 'Proper medical documentation is the foundation of any car accident claim. Insurance companies and attorneys evaluate the strength of your case largely based on your medical records. Gaps in treatment or delayed care can significantly reduce what you recover.',
        calloutText: 'Never skip follow-up appointments or reduce treatment early — even if you start feeling better. Stopping treatment early gives the insurance company ammunition to argue your injuries were not serious.',
        alertLevel: 'warning',
      },
      // 10. Comparison — with/without attorney
      {
        blockType: 'comparison',
        points: [
          { stat: 'Claimants with attorney representation recover 3x more on average.', source: 'Insurance Research Council', sourceUrl: 'https://www.insurance.org' },
          { stat: '91% of attorney-represented claims reach settlement.', source: 'American Bar Association', sourceUrl: 'https://www.americanbar.org' },
          { stat: 'Claimants without attorneys are 4x more likely to accept a lowball first offer.', source: 'Insurance Information Institute', sourceUrl: 'https://www.iii.org' },
        ],
      },
      // 11. Attorney Comparison Block (guide-specific)
      {
        blockType: 'attorneyComparison',
        title: 'With an Attorney vs. Without',
        subtitle: 'The numbers speak for themselves',
        rows: [
          { factor: 'Average settlement amount', withAttorney: '$79,000+ average recovered', withoutAttorney: '$21,000 average recovered' },
          { factor: 'Claims settled successfully', withAttorney: '91% reach settlement', withoutAttorney: '45% settle, many go to trial and lose' },
          { factor: 'Insurance company response', withAttorney: 'Immediate attention and respect', withoutAttorney: 'Delayed, lowball offers, stonewalling' },
          { factor: 'Legal fees', withAttorney: 'Contingency — no fee unless you win', withoutAttorney: 'You keep all of a much smaller settlement' },
        ],
        summaryEnabled: true,
      },
      // 12. Case Scenario — settlement examples
      {
        blockType: 'caseScenario',
        isIllustrative: true,
        methodologyNote: 'Case scenarios are illustrative only and do not represent actual cases or outcomes.',
        items: [
          { injuryType: 'Rear-end collision with whiplash', illustrativeRange: '$8,000 – $25,000', note: 'Most common low-severity car accident case type' },
          { injuryType: 'T-bone collision with fractures', illustrativeRange: '$40,000 – $120,000', note: 'Mid-range severity with liability dispute common' },
          { injuryType: 'Head-on collision requiring surgery', illustrativeRange: '$150,000 – $500,000', note: 'High-severity with pain and suffering multipliers' },
        ],
      },
      // 13. Settlement Example Block (guide-specific)
      {
        blockType: 'settlementExample',
        title: 'Real Settlement Examples',
        examples: [
          { settlement: 'Rear-End Collision — Whiplash', settlementValue: '$18,500', injuryType: 'Whiplash, neck strain', caseType: 'Liability admitted, soft tissue injury', caseResolutionTime: '8 months', quote: 'Client was rear-ended at a stoplight. Had ongoing neck pain for 4 months. Medical bills totaled $8,200. Settlement covered medical costs plus pain and suffering.', name: 'M.T.', location: 'Arizona' },
          { settlement: 'T-Bone Collision — Fractured Wrist', settlementValue: '$67,000', injuryType: 'Fractured wrist requiring surgery', caseType: 'Disputed liability, surgical intervention', caseResolutionTime: '14 months', quote: "Client's vehicle was hit broadside by a driver running a red light. Wrist required surgical pins. Lost 3 months of work. Settlement covered all medical, lost wages, and pain.", name: 'R.K.', location: 'Texas' },
          { settlement: 'Multi-Vehicle — Back Injury', settlementValue: '$142,000', injuryType: 'Herniated disc requiring physical therapy', caseType: 'Rear-ended on highway, multiple vehicles', caseResolutionTime: '22 months', quote: 'Client was rear-ended in a chain-reaction accident on the highway. Herniated disc required 6 months of physical therapy and limited work activities. Settlement reflects ongoing impact and future medical needs.', name: 'S.W.', location: 'California' },
        ],
      },
      // 14. Settlement Ranges Block (guide-specific)
      {
        blockType: 'settlementRanges',
        title: 'Settlement Ranges by State',
        ranges: [
          { state: 'CA', min: '$25,000', max: '$150,000', avg: '$75,000', note: 'High cost of living drives higher settlements' },
          { state: 'TX', min: '$20,000', max: '$100,000', avg: '$55,000', note: 'Large volume of cases keeps averages moderate' },
          { state: 'FL', min: '$18,000', max: '$90,000', avg: '$48,000', note: 'No-fault state affects claim structure' },
          { state: 'NY', min: '$30,000', max: '$180,000', avg: '$85,000', note: 'Higher verdicts in metropolitan areas' },
          { state: 'AZ', min: '$15,000', max: '$85,000', avg: '$42,000', note: 'Comparative fault reduces some claims' },
        ],
        showCatastrophic: true,
      },
      // 15. Statute of Limitations Block (guide-specific)
      {
        blockType: 'statuteLimitations',
        title: 'Statute of Limitations by State',
        description: 'The statute of limitations is the hard deadline to file your lawsuit. Missing this deadline almost always means losing your right to any compensation — no matter how strong your case is.',
        defaultYears: 2,
        states: [
          { state: 'California', years: 2, notes: 'Files in civil court. Discovery rule may extend for latent injuries.' },
          { state: 'Florida', years: 2, notes: 'Reduced from 4 years in 2023 tort reform. Strict deadline.' },
          { state: 'Texas', years: 2, notes: 'Two-year limit for personal injury. Government claims have shorter notice periods.' },
          { state: 'New York', years: 3, notes: 'Three-year window. No-fault insurance claims follow different rules.' },
          { state: 'Arizona', years: 2, notes: 'Comparative fault state. Your recovery reduced by your percentage of fault.' },
        ],
        exceptions: [
          { exception: 'Claims against government entities typically require notice within 180 days to 1 year — far shorter than the standard civil statute.' },
          { exception: 'Minors have the statute toll (pause) until they turn 18, giving them time to file even if the standard deadline passes.' },
          { exception: "Latent injuries that don't appear immediately may qualify for the discovery rule — starting the clock when you knew or should have known about the injury." },
        ],
      },
      // 16. People Also Ask
      {
        blockType: 'peopleAlsoAsk',
        items: [
          { q: 'How is pain and suffering calculated in a car accident claim?', a: 'Pain and suffering is typically calculated using a multiplier applied to your medical expenses, ranging from 1.5x to 5x depending on injury severity and impact on daily life.' },
          { q: "What's the average time to settle a car accident case?", a: 'Most car accident cases settle within 6 months to 2 years. Complex cases with disputed liability or severe injuries can take longer.' },
          { q: 'Will my car insurance rates go up after an accident?', a: "Rates vary by insurer and state law. Not-at-fault accidents often don't increase rates, but at-fault accidents typically result in increases of 20-40%." },
        ],
      },
      // 17. FAQ Accordion
      {
        blockType: 'faqAccordion',
        faqs: [
          { question: 'How long do I have to file a car accident claim?', answer: 'Statutes of limitation vary by state from 2 to 4 years. Missing this deadline typically forfeits your right to compensation.' },
          { question: "Should I accept the insurance company's first settlement offer?", answer: 'Never accept a first offer without consulting an attorney. Initial offers are typically far below what your claim is worth and accepting locks you out of additional recovery.' },
          { question: 'What if the accident was partially my fault?', answer: 'Many states allow comparative fault, meaning you can still recover even if partially at fault — but your compensation is reduced by your percentage of fault.' },
          { question: 'Do I need a lawyer for a car accident claim?', answer: 'While not legally required, statistics show claimants with attorney representation recover 3x more on average. Complex cases with injuries, disputed liability, or high stakes strongly benefit from legal counsel.' },
        ],
      },
      // 18. Expert Quote
      {
        blockType: 'expertQuote',
        quote: 'The first 72 hours after an accident are critical. What you do — or don\'t do — during that window can dramatically affect the outcome of your claim.',
        speakerName: 'J.M.',
        credentials: 'Personal Injury Attorney, 20+ years experience',
      },
      // 19. Term Definition
      {
        blockType: 'termDefinition',
        term: 'Statute of Limitations',
        definition: 'A law that sets the maximum time after an event within which legal proceedings may be initiated. For car accidents, these range from 2 to 4 years depending on the state.',
      },
      // 20. Protection Plan
      {
        blockType: 'protectionPlan',
        steps: [
          { step: 'Keep every medical bill, record, and receipt in one organized file.' },
          { step: 'Do not post about the accident on social media — anything you say can be used against you.' },
          { step: 'Do not give recorded statements to any insurance company before consulting an attorney.' },
          { step: 'Do not accept any settlement offer until you understand the full extent of your injuries.' },
        ],
      },
      // 21. CTA Block
      {
        blockType: 'cta',
        heading: 'You handle healing. Let a local attorney handle the rest.',
        subcopy: 'Car accident claims move fast and the other side already has lawyers working. The firm that covers your area knows the local courts, the deadlines, and how to maximize what you recover.',
        buttonLabel: 'Connect with an attorney',
      },
      // 22. Disclaimer
      {
        blockType: 'disclaimer',
        note: 'This content is for informational purposes only and does not constitute legal advice. CasePort is not a law firm and does not provide legal representation.',
      },
      // 23. Rich Text — optional freeform content (user can add more of these)
      {
        blockType: 'richText',
        content: {
          root: {
            children: [
              { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Why Speed Matters After a Car Accident' }] },
              { type: 'paragraph', children: [{ type: 'text', text: 'Evidence disappears fast. Skid marks fade, witnesses forget details, and surveillance footage can be overwritten within days. The moment you delay getting an attorney is the moment you lose leverage.' }] },
              { type: 'paragraph', children: [{ type: 'text', text: 'Insurance companies know this. Their adjusters are trained to contact you quickly, get a recorded statement, and settle for as little as possible before you fully understand the value of your claim.' }] },
            ],
          },
        },
      },
    ],
  }
    // ── Guide Blocks (all 6 types) ────────────────────────────────────────────

  // Check if guide article already exists
  const existingGuide = await payload.find({
    collection: 'guideArticles',
    where: { slug: { equals: 'what-to-do-after-a-car-accident' } },
    limit: 1,
  }).then(r => r.docs[0])

  if (existingGuide) {
    await payload.update({
      collection: 'guideArticles',
      id: existingGuide.id,
      data: { ...guideArticleData, _isSeeding: true } as any,
    })
    // eslint-disable-next-line no-console
    console.log('Updated existing GuideArticle with all blocks.')
  } else {
    await payload.create({ collection: 'guideArticles', data: guideArticleData as any })
    // eslint-disable-next-line no-console
    console.log('Created GuideArticle with all blocks.')
  }

  // eslint-disable-next-line no-console
  console.log('\nSeed complete!')
  // eslint-disable-next-line no-console
  console.log('Go to Payload admin → Guide Articles → "What To Do After a Car Accident" to see all 23 blocks.')
  // eslint-disable-next-line no-console
  console.log('\nNOTE: GuideArticle has no hero image set (would need a real media ID).')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})