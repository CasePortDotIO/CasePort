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
  heroTitle?: string
  heroSubtitle?: string
  whyImportant?: string
  quickAnswerStats?: {
    average: string
    successRate: string
    timeline: string
    upfront: string
  }
  credibilitySection?: {
    recoveredAmount: string
    successRate: string
    casesWon: string
    avgSettlement: string
    recoveryNote: string
  }
  testimonials?: Array<{
    name: string
    location: string
    settlement: string
    settlementValue: string
    injuryType: string
    quote: string
  }>
  settlementData?: {
    rangesByInjury?: Array<{
      injuryType: string
      settlementAmount: string
      minAmount: string
      maxAmount: string
      recoveryTime: string
    }>
    attorneyComparison?: Array<{
      label: string
      withoutAttorney: string
      withAttorney: string
    }>
  }
  statuteOfLimitations?: {
    description: string
    byState?: Array<{ state: string; years: number; notes?: string }>
  }
  faqSection?: Array<{ question: string; answer: string }>
  peopleAlsoAsk?: Array<{ question: string; answer: string }>
  metaTitle?: string
  metaDescription?: string
  directAnswer?: string
  aiCitationSummary?: string
  socialHeadline?: string
  socialDescription?: string
  schemaType?: string
}

const categories: CategorySeed[] = [
  {
    title: 'Car Accident Guide',
    slug: 'car-accident',
    description: 'Comprehensive guidance for car accident victims. Learn what to do, settlement amounts, and whether you need a lawyer.',
    icon: '🚗',
    displayOrder: 1,
    heroTitle: 'Your Complete Guide to Car Accident Claims',
    heroSubtitle: 'Learn what your car accident case is worth, the critical deadlines you must meet, and why hiring an attorney typically results in 5x more money.',
    whyImportant: 'Car accidents send over 4 million people to emergency rooms each year. Insurance companies count on you not fighting back. This guide gives you the facts so you can make the right decision for your case.',
    quickAnswerStats: {
      average: '$95K',
      successRate: '90%',
      timeline: '12-18 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$1.8B+',
      successRate: '90%',
      casesWon: '4,500+',
      avgSettlement: '$95K',
      recoveryNote: '5x more than going it alone',
    },
    testimonials: [
      { name: 'Andrew F.', location: 'California', settlement: '$165K', settlementValue: '$165,000', injuryType: 'Whiplash & back injury', quote: "Hit by another car at a red light. Whiplash and back injury. Couldn't work for months. Got $165K." },
      { name: 'Stephanie N.', location: 'Texas', settlement: '$125K', settlementValue: '$125,000', injuryType: 'Broken arm', quote: "Hit by a car while stopped at a light. Got $125K." },
      { name: 'Charles B.', location: 'Florida', settlement: '$85K', settlementValue: '$85,000', injuryType: 'Neck injury', quote: "Hit by another car. Neck injury. Got $85K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Spinal Injury', settlementAmount: '180000', minAmount: '100000', maxAmount: '300000', recoveryTime: '12+ months' },
        { injuryType: 'Traumatic Brain Injury', settlementAmount: '150000', minAmount: '80000', maxAmount: '250000', recoveryTime: '18+ months' },
        { injuryType: 'Multiple Fractures', settlementAmount: '100000', minAmount: '60000', maxAmount: '180000', recoveryTime: '6-9 months' },
        { injuryType: 'Whiplash & Back Injury', settlementAmount: '70000', minAmount: '40000', maxAmount: '120000', recoveryTime: '3-6 months' },
        { injuryType: 'Minor Injuries', settlementAmount: '40000', minAmount: '20000', maxAmount: '80000', recoveryTime: '1-3 months' },
      ],
      attorneyComparison: [
        { label: 'Insurance company treatment', withoutAttorney: 'Knows you are scared and desperate', withAttorney: 'Knows you have backup — they negotiate differently' },
        { label: 'Case value knowledge', withoutAttorney: 'You do not know your case value (they do)', withAttorney: 'We know your case value and fight for it' },
        { label: 'Evidence gathering', withoutAttorney: 'No expert witnesses or evidence', withAttorney: 'We hire expert witnesses and gather evidence' },
        { label: 'Settlement amount', withoutAttorney: 'Accept their first lowball offer', withAttorney: 'We negotiate aggressively (they know we will go to trial)' },
      ],
    },
    statuteOfLimitations: {
      description: 'You have 2-4 years to file a lawsuit depending on your state. After that, you lose your right to recover. Forever.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 4 },
        { state: 'New York', years: 3 },
      ],
    },
    faqSection: [
      { question: 'How much can I get for a car accident case?', answer: 'The average settlement depends on injury severity, medical costs, and liability. Minor injuries may settle for $15,000-$50,000. Severe injuries with permanent disability can reach $500,000+. With an attorney, you typically receive 3-5x more than going it alone.' },
      { question: 'How long does a car accident case take?', answer: 'Most car accident cases settle within 12-18 months. Cases involving serious injuries or disputed liability can take longer. We work efficiently to get you compensated as quickly as possible.' },
      { question: 'Do I need an attorney for a car accident?', answer: 'Yes. Insurance companies have teams of lawyers working against you. Studies show you receive 3-5x more money with an attorney. Most personal injury attorneys offer free consultations and work on contingency.' },
      { question: 'What if I was partially at fault?', answer: 'Most states allow recovery even if you were partially at fault. The key is proving the other party was MORE at fault. Your recovery may be reduced by your percentage of fault, but you can still recover.' },
      { question: 'What should I do after a car accident?', answer: '1. Call 911 and get medical attention. 2. Document the scene with photos. 3. Exchange information with the other driver. 4. Contact an attorney before speaking with insurance companies.' },
    ],
    peopleAlsoAsk: [
      { question: 'What should I do after a car accident?', answer: 'Call 911, get medical attention, document the scene, exchange information, and contact an attorney immediately. Do not admit fault to anyone.' },
      { question: 'How much is my car accident case worth?', answer: 'Your case value depends on injury severity, medical costs, lost wages, and liability. Contact us for a free evaluation.' },
      { question: 'What if the insurance company denies my claim?', answer: "Don't accept a denial. Insurance companies often deny valid claims to protect their bottom line. We can appeal and fight for your rights." },
      { question: 'Can I still recover if I was partially at fault?', answer: 'Yes. Most states allow recovery even if you are partially at fault. We have won many cases with partial fault.' },
    ],
    metaTitle: 'Car Accident Guide | CasePort',
    metaDescription: 'Complete guide to car accident claims. Learn settlement amounts, statute of limitations, and how an attorney can get you 5x more money.',
    directAnswer: 'Car accident victims who hire an attorney receive on average 3-5x more money than those who go it alone. The statute of limitations in most states is 2-4 years.',
    aiCitationSummary: 'This guide covers car accident claims, settlement ranges by injury type, statute of limitations by state, and attorney representation.',
    socialHeadline: 'The Ultimate Car Accident Guide — What You Need to Know',
    socialDescription: 'Complete guide to car accident claims. Learn what your case is worth and why you need an attorney.',
    schemaType: 'GuidePage',
  },
  {
    title: 'Truck Accident Guide',
    slug: 'truck-accident',
    description: 'High-value cases involving trucking companies. Catastrophic injuries, complex liability.',
    icon: '🚛',
    displayOrder: 2,
    heroTitle: 'Your Complete Guide to Truck Accident Claims',
    heroSubtitle: 'Truck accidents cause devastating injuries. Learn how to fight the trucking companies and their insurers.',
    whyImportant: 'Truck accidents are 3x more likely to result in fatalities than car accidents. The trucking industry has powerful insurers and lawyers. You need someone on your side who knows how to fight them.',
    quickAnswerStats: {
      average: '$250K',
      successRate: '85%',
      timeline: '18-24 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$850M+',
      successRate: '85%',
      casesWon: '1,200+',
      avgSettlement: '$250K',
      recoveryNote: '8x more than going it alone',
    },
    testimonials: [
      { name: 'Marcus L.', location: 'Arizona', settlement: '$340K', settlementValue: '$340,000', injuryType: 'Spinal cord injury', quote: "Truck driver fell asleep at the wheel. Spinal cord injury. Got $340K." },
      { name: 'Rachel M.', location: 'Texas', settlement: '$220K', settlementValue: '$220,000', injuryType: 'Multiple fractures', quote: "Hit by an 18-wheeler. Multiple fractures. Got $220K." },
      { name: 'David K.', location: 'California', settlement: '$180K', settlementValue: '$180,000', injuryType: 'Traumatic brain injury', quote: "Truck accident. Traumatic brain injury. Got $180K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Spinal Cord Injury', settlementAmount: '350000', minAmount: '200000', maxAmount: '500000', recoveryTime: '18+ months' },
        { injuryType: 'Traumatic Brain Injury', settlementAmount: '275000', minAmount: '150000', maxAmount: '400000', recoveryTime: '24+ months' },
        { injuryType: 'Multiple Fractures', settlementAmount: '150000', minAmount: '80000', maxAmount: '250000', recoveryTime: '9-12 months' },
        { injuryType: 'Severe Burn Injuries', settlementAmount: '200000', minAmount: '100000', maxAmount: '350000', recoveryTime: '12-18 months' },
        { injuryType: 'Wrongful Death', settlementAmount: '500000', minAmount: '300000', maxAmount: '1M+', recoveryTime: '18-24 months' },
      ],
      attorneyComparison: [
        { label: 'Trucking company response', withoutAttorney: 'They have lawyers — you are outmatched', withAttorney: 'We match their legal firepower' },
        { label: 'Evidence preservation', withoutAttorney: 'Truck logs deleted after 6 months', withAttorney: 'We issue legal holds immediately' },
        { label: 'Settlement leverage', withoutAttorney: 'Lowball offers that insult your injuries', withAttorney: 'We know what your case is really worth' },
      ],
    },
    statuteOfLimitations: {
      description: 'Truck accident cases have the same statute of limitations as car accidents, but the stakes are higher. Do not delay.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 4 },
        { state: 'New York', years: 3 },
      ],
    },
    faqSection: [
      { question: 'How much is a truck accident case worth?', answer: 'Truck accidents typically result in larger settlements than car accidents due to the severity of injuries. Average settlements range from $100,000 to $1M+ depending on injury severity and liability.' },
      { question: 'Who is liable in a truck accident?', answer: 'Multiple parties may be liable: the truck driver, trucking company, shipper, or manufacturer. This is why truck accident cases are complex — we investigate all angles.' },
      { question: 'What evidence is important in a truck accident case?', answer: 'Critical evidence includes truck driver logs, black box data, maintenance records, and witness statements. This evidence can be destroyed quickly — contact an attorney immediately.' },
      { question: 'How long does a truck accident case take?', answer: 'Due to complexity, truck accident cases typically take 18-24 months. We work efficiently while ensuring we have all the evidence needed.' },
      { question: 'Why do I need an attorney for a truck accident?', answer: 'Trucking companies have teams of lawyers and insurers. We level the playing field and fight for the full value of your case.' },
    ],
    peopleAlsoAsk: [
      { question: 'Who is liable in a truck accident?', answer: 'The truck driver, trucking company, shipper, or manufacturer may all be liable. We investigate every potential defendant.' },
      { question: 'What evidence is preserved after a truck accident?', answer: 'Truck driver logs, black box data, maintenance records, and witness statements are critical. Act fast to preserve this evidence.' },
      { question: 'How much more do I get with an attorney for a truck accident?', answer: 'Studies show you receive 3-5x more with an attorney. For truck accidents, the multiplier can be even higher.' },
    ],
    metaTitle: 'Truck Accident Guide | CasePort',
    metaDescription: 'Comprehensive guide to truck accident claims. Learn about liability, settlement amounts, and how to fight the trucking industry.',
    directAnswer: 'Truck accident victims receive significantly larger settlements than car accident victims. With an attorney, you typically receive 3-5x more than the insurance company initially offers.',
    aiCitationSummary: 'This guide covers truck accident claims, liability of trucking companies, settlement ranges, and attorney representation.',
    socialHeadline: 'Truck Accident Claims — How to Fight Big Truck Insurance',
    schemaType: 'GuidePage',
  },
  {
    title: 'Slip & Fall Guide',
    slug: 'slip-and-fall',
    description: 'Premises liability. Property owner negligence. Common in stores and workplaces.',
    icon: '🏢',
    displayOrder: 3,
    heroTitle: 'Your Complete Guide to Slip and Fall Claims',
    heroSubtitle: 'Property owners are responsible for keeping you safe. If they failed, we will make them pay.',
    whyImportant: 'Slip and fall accidents send 1 million people to the hospital each year. Property owners carry insurance specifically for this. They know you have rights — and so should you.',
    quickAnswerStats: {
      average: '$50K',
      successRate: '80%',
      timeline: '6-12 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$250M+',
      successRate: '80%',
      casesWon: '2,800+',
      avgSettlement: '$50K',
      recoveryNote: '4x more than going it alone',
    },
    testimonials: [
      { name: 'Linda G.', location: 'New York', settlement: '$75K', settlementValue: '$75,000', injuryType: 'Hip fracture', quote: "Slipped on wet floor at grocery store with no warning sign. Hip fracture. Got $75K." },
      { name: 'James W.', location: 'Illinois', settlement: '$40K', settlementValue: '$40,000', injuryType: 'Ankle fracture', quote: "Slipped on ice outside restaurant. Ankle fracture. Got $40K." },
      { name: 'Maria S.', location: 'California', settlement: '$55K', settlementValue: '$55,000', injuryType: 'Back injury', quote: "Slipped in shopping mall. Back injury. Got $55K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Hip/Pelvis Fracture', settlementAmount: '85000', minAmount: '50000', maxAmount: '150000', recoveryTime: '6-12 months' },
        { injuryType: 'Spinal Injury', settlementAmount: '75000', minAmount: '40000', maxAmount: '130000', recoveryTime: '9-18 months' },
        { injuryType: 'Ankle/Foot Fracture', settlementAmount: '40000', minAmount: '20000', maxAmount: '80000', recoveryTime: '3-6 months' },
        { injuryType: 'Head/Traumatic Brain Injury', settlementAmount: '100000', minAmount: '50000', maxAmount: '200000', recoveryTime: '12-24 months' },
        { injuryType: 'Soft Tissue/Minor', settlementAmount: '20000', minAmount: '10000', maxAmount: '40000', recoveryTime: '1-3 months' },
      ],
      attorneyComparison: [
        { label: 'Proving negligence', withoutAttorney: 'Property owner denies everything', withAttorney: 'We gather surveillance footage and witnesses' },
        { label: 'Insurance tactics', withoutAttorney: 'They claim you were careless', withAttorney: 'We prove the hazard was their fault' },
      ],
    },
    statuteOfLimitations: {
      description: 'Slip and fall cases must be filed within 2-4 years depending on your state. On government property, you may have as little as 6 months.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 4 },
        { state: 'New York', years: 3 },
      ],
    },
    faqSection: [
      { question: 'How much is a slip and fall case worth?', answer: 'Slip and fall settlements depend on injury severity and the strength of evidence. Minor injuries may settle for $10,000-$30,000. Fractures and head injuries can reach $100,000+.' },
      { question: 'What must I prove in a slip and fall case?', answer: 'You must prove: (1) the property owner created the hazard or should have known about it, (2) they failed to fix it or warn you, and (3) the hazard caused your injury.' },
      { question: 'Can I sue if I was partly at fault?', answer: 'Yes in most states. Comparative negligence laws allow recovery even if you were partially at fault, though your percentage of fault reduces your award.' },
      { question: 'How long do I have to file a slip and fall claim?', answer: 'The statute of limitations is typically 2-4 years, but on government property you may have as little as 6 months to file a notice of claim.' },
      { question: 'What should I do immediately after a slip and fall?', answer: 'Seek medical attention, document the hazard with photos, get witness contact info, and report the incident to the property owner or manager.' },
    ],
    peopleAlsoAsk: [
      { question: 'What must I prove in a slip and fall case?', answer: 'You must prove the property owner was negligent in maintaining the property and that negligence caused your injury.' },
      { question: 'Can I sue if I was partially at fault?', answer: 'Yes. Most states use comparative negligence, which means your award is reduced by your percentage of fault.' },
      { question: 'How long does a slip and fall case take?', answer: 'Most slip and fall cases settle in 6-12 months. Cases with disputed liability or serious injuries take longer.' },
    ],
    metaTitle: 'Slip and Fall Guide | CasePort',
    metaDescription: 'Complete guide to slip and fall claims. Learn about premises liability, settlement amounts, and how to prove property owner negligence.',
    directAnswer: 'Slip and fall victims who hire an attorney receive significantly more than those who attempt to handle claims themselves. Property owners have insurance — you deserve fair compensation.',
    socialHeadline: 'Slip and Fall Claims — Know Your Rights',
    schemaType: 'GuidePage',
  },
  {
    title: 'Medical Malpractice Guide',
    slug: 'medical-malpractice',
    description: 'Doctor negligence and surgical errors. Complex cases requiring expert testimony.',
    icon: '⚕️',
    displayOrder: 4,
    heroTitle: 'Your Complete Guide to Medical Malpractice Claims',
    heroSubtitle: 'When doctors make mistakes, the consequences are devastating. You deserve answers — and compensation.',
    whyImportant: 'Medical errors are the 3rd leading cause of death in the US. Doctors and hospitals have powerful lawyers and insurance. You need an attorney who knows medicine AND the law.',
    quickAnswerStats: {
      average: '$350K',
      successRate: '75%',
      timeline: '24-36 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$500M+',
      successRate: '75%',
      casesWon: '850+',
      avgSettlement: '$350K',
      recoveryNote: 'Higher than average — complex cases',
    },
    testimonials: [
      { name: 'Sandra T.', location: 'California', settlement: '$450K', settlementValue: '$450,000', injuryType: 'Surgical error', quote: "Surgical error during routine procedure. Additional surgeries required. Got $450K." },
      { name: 'Robert H.', location: 'Florida', settlement: '$280K', settlementValue: '$280,000', injuryType: 'Misdiagnosis', quote: "Misdiagnosis led to delayed cancer treatment. Got $280K." },
      { name: 'Angela D.', location: 'Texas', settlement: '$520K', settlementValue: '$520,000', injuryType: 'Birth injury', quote: "Birth injury to child due to improper monitoring. Got $520K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Birth Injury', settlementAmount: '500000', minAmount: '200000', maxAmount: '1M+', recoveryTime: '24-36 months' },
        { injuryType: 'Surgical Error', settlementAmount: '300000', minAmount: '100000', maxAmount: '600000', recoveryTime: '24-36 months' },
        { injuryType: 'Misdiagnosis/Cancer Delay', settlementAmount: '250000', minAmount: '100000', maxAmount: '500000', recoveryTime: '18-30 months' },
        { injuryType: 'Medication Error', settlementAmount: '150000', minAmount: '50000', maxAmount: '300000', recoveryTime: '12-24 months' },
        { injuryType: 'Hospital Infection', settlementAmount: '100000', minAmount: '50000', maxAmount: '200000', recoveryTime: '12-18 months' },
      ],
      attorneyComparison: [
        { label: 'Medical expertise', withoutAttorney: 'You cannot interpret medical records', withAttorney: 'We have medical experts on staff' },
        { label: 'Hospital lawyers', withoutAttorney: 'Hospitals have teams of defense lawyers', withAttorney: 'We match their resources' },
      ],
    },
    statuteOfLimitations: {
      description: 'Medical malpractice cases have strict deadlines. You may have as little as 6 months to 2 years from the date of discovery. Do not delay.',
      byState: [
        { state: 'California', years: 3 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 2 },
        { state: 'New York', years: 2 },
      ],
    },
    faqSection: [
      { question: 'What is medical malpractice?', answer: 'Medical malpractice occurs when a healthcare provider deviates from the standard of care and that deviation causes injury or death. Examples include surgical errors, misdiagnosis, medication errors, and birth injuries.' },
      { question: 'How much is a medical malpractice case worth?', answer: 'Medical malpractice settlements vary widely based on injury severity, long-term impact, and the strength of medical evidence. Cases can range from $50,000 to millions of dollars.' },
      { question: 'Why do I need an attorney for medical malpractice?', answer: 'Medical malpractice cases are among the most complex in the law. They require medical experts, detailed records, and years of experience. We have all three.' },
      { question: 'How long does a medical malpractice case take?', answer: 'Due to complexity and the need for medical expert testimony, these cases typically take 2-3 years. We work efficiently while building the strongest case possible.' },
      { question: 'What is the statute of limitations for medical malpractice?', answer: 'The statute of limitations varies by state and is often shorter than other personal injury cases. It may run from the date of injury or the date you discovered the injury.' },
    ],
    peopleAlsoAsk: [
      { question: 'What constitutes medical malpractice?', answer: 'Medical malpractice occurs when a healthcare provider fails to meet the standard of care and that failure causes injury or death.' },
      { question: 'How long do I have to file a medical malpractice claim?', answer: 'This varies by state but is often 2-3 years from the date of injury or discovery. Some states have statutes of limitations as short as 6 months.' },
    ],
    metaTitle: 'Medical Malpractice Guide | CasePort',
    metaDescription: 'Comprehensive guide to medical malpractice claims. Learn about surgical errors, misdiagnosis, and how to hold doctors accountable.',
    directAnswer: 'Medical malpractice victims who hire attorneys receive compensation for medical bills, lost wages, pain and suffering, and future care. These cases require expert medical testimony.',
    socialHeadline: 'Medical Malpractice — When Doctors Make Mistakes',
    schemaType: 'GuidePage',
  },
  {
    title: 'Workplace Injury Guide',
    slug: 'workplace-injury',
    description: 'Workers compensation and third-party claims. On-the-job injuries.',
    icon: '🦺',
    displayOrder: 5,
    heroTitle: 'Your Complete Guide to Workplace Injury Claims',
    heroSubtitle: 'On-the-job injuries are covered by workers comp — but you may also have a third-party claim worth significantly more.',
    whyImportant: 'Over 2.8 million workplace injuries occur each year. Workers comp covers basic medical and wage loss, but third-party claims can result in 5-10x more money.',
    quickAnswerStats: {
      average: '$75K',
      successRate: '88%',
      timeline: '12-18 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$400M+',
      successRate: '88%',
      casesWon: '3,100+',
      avgSettlement: '$75K',
      recoveryNote: 'Workers comp + third-party claims',
    },
    testimonials: [
      { name: 'Carlos R.', location: 'Texas', settlement: '$120K', settlementValue: '$120,000', injuryType: 'Construction fall', quote: "Fell from scaffolding at work. Spinal injury. Workers comp plus third-party claim. Got $120K." },
      { name: 'Patricia L.', location: 'Florida', settlement: '$85K', settlementValue: '$85,000', injuryType: 'Repetitive stress', quote: "Repetitive stress injury from assembly line work. Got $85K." },
      { name: 'Thomas B.', location: 'California', settlement: '$95K', settlementValue: '$95,000', injuryType: 'Machinery injury', quote: "Caught in industrial machinery. Hand injuries. Got $95K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Spinal Injury', settlementAmount: '150000', minAmount: '80000', maxAmount: '300000', recoveryTime: '12-18 months' },
        { injuryType: 'Traumatic Brain Injury', settlementAmount: '200000', minAmount: '100000', maxAmount: '400000', recoveryTime: '18-24 months' },
        { injuryType: 'Amputation/Loss of Limb', settlementAmount: '250000', minAmount: '150000', maxAmount: '500000', recoveryTime: '18-24 months' },
        { injuryType: 'Repetitive Stress Injury', settlementAmount: '60000', minAmount: '30000', maxAmount: '120000', recoveryTime: '6-12 months' },
        { injuryType: 'Burn Injury', settlementAmount: '100000', minAmount: '50000', maxAmount: '200000', recoveryTime: '12-18 months' },
      ],
      attorneyComparison: [
        { label: 'Workers comp benefits', withoutAttorney: 'Minimal benefits, slow payments', withAttorney: 'We ensure you get full workers comp benefits' },
        { label: 'Third-party claims', withoutAttorney: 'You miss potential additional claims', withAttorney: 'We identify all third-party liability' },
      ],
    },
    statuteOfLimitations: {
      description: 'Workers comp claims must be reported within 30 days. Third-party claims follow the standard statute of limitations of 2-4 years.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 4 },
        { state: 'New York', years: 3 },
      ],
    },
    faqSection: [
      { question: 'What is the difference between workers comp and a personal injury claim?', answer: 'Workers compensation covers basic medical and wage loss benefits regardless of fault. A personal injury (third-party) claim can recover significantly more for pain and suffering, and is available when someone other than your employer caused your injury.' },
      { question: 'Can I sue my employer for a workplace injury?', answer: 'Generally no — workers comp is your exclusive remedy against your employer. However, you CAN sue third parties (equipment manufacturers, subcontractors, property owners) whose negligence contributed to your injury.' },
      { question: 'How much is a workplace injury case worth?', answer: 'Workers comp typically covers medical bills and 2/3 of lost wages. Third-party claims can add significant compensation for pain and suffering and all lost wages.' },
      { question: 'What should I do after a workplace injury?', answer: '1. Report the injury to your employer within 30 days. 2. Seek medical attention. 3. Document the scene. 4. Contact an attorney before giving recorded statements.' },
      { question: 'How long does a workplace injury case take?', answer: 'Workers comp cases typically resolve in 6-12 months. Third-party cases take 12-18 months or longer.' },
    ],
    peopleAlsoAsk: [
      { question: 'Can I sue my employer for a workplace injury?', answer: 'Generally no — workers comp is your exclusive remedy. But you can sue third parties whose negligence caused your injury.' },
      { question: 'What is a third-party workplace injury claim?', answer: 'A third-party claim is when someone other than your employer (equipment manufacturer, subcontractor, property owner) caused your workplace injury.' },
    ],
    metaTitle: 'Workplace Injury Guide | Workers Comp Claims | CasePort',
    metaDescription: 'Complete guide to workplace injury claims. Learn about workers comp benefits and third-party claims worth significantly more.',
    directAnswer: 'Workplace injury victims may be entitled to workers comp benefits AND third-party claims. Third-party claims can result in 5-10x more compensation than workers comp alone.',
    socialHeadline: 'Workplace Injury Claims — What You Need to Know',
    schemaType: 'GuidePage',
  },
  {
    title: 'Motorcycle Accident Guide',
    slug: 'motorcycle-accident',
    description: 'Severe injuries, bias against riders. High-value settlements.',
    icon: '🏍️',
    displayOrder: 6,
    heroTitle: 'Your Complete Guide to Motorcycle Accident Claims',
    heroSubtitle: 'Motorcyclists face bias from insurance companies. Do not let them devalue your case.',
    whyImportant: 'Motorcyclists are 28x more likely to die in a crash than car occupants. When accidents happen, insurance companies often blame the rider. You need someone who will fight for you.',
    quickAnswerStats: {
      average: '$150K',
      successRate: '82%',
      timeline: '12-18 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$600M+',
      successRate: '82%',
      casesWon: '1,500+',
      avgSettlement: '$150K',
      recoveryNote: '10x more than going it alone',
    },
    testimonials: [
      { name: 'Ryan M.', location: 'Arizona', settlement: '$275K', settlementValue: '$275,000', injuryType: 'Road rash & fractures', quote: "Hit by distracted driver. Road rash, multiple fractures. Got $275K." },
      { name: 'Jennifer L.', location: 'California', settlement: '$190K', settlementValue: '$190,000', injuryType: 'Spinal injury', quote: "Lane change accident. Spinal injury. Got $190K." },
      { name: 'William D.', location: 'Texas', settlement: '$160K', settlementValue: '$160,000', injuryType: 'Head trauma', quote: "T-boned at intersection. Head trauma. Got $160K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Traumatic Brain Injury', settlementAmount: '300000', minAmount: '150000', maxAmount: '500000', recoveryTime: '18-24 months' },
        { injuryType: 'Spinal Cord Injury', settlementAmount: '350000', minAmount: '200000', maxAmount: '600000', recoveryTime: '18-24 months' },
        { injuryType: 'Road Rash/Skin Graft', settlementAmount: '80000', minAmount: '40000', maxAmount: '150000', recoveryTime: '6-12 months' },
        { injuryType: 'Multiple Fractures', settlementAmount: '100000', minAmount: '50000', maxAmount: '200000', recoveryTime: '9-12 months' },
        { injuryType: 'Fatal/Wrongful Death', settlementAmount: '500000', minAmount: '300000', maxAmount: '1M+', recoveryTime: '18-24 months' },
      ],
      attorneyComparison: [
        { label: 'Bias against riders', withoutAttorney: 'Insurance blames the motorcyclist', withAttorney: 'We fight the bias and prove liability' },
        { label: 'Injury severity', withoutAttorney: 'They minimize your injuries', withAttorney: 'We prove the full extent of your injuries' },
      ],
    },
    statuteOfLimitations: {
      description: 'The statute of limitations for motorcycle accidents is typically 2-4 years. Do not let the insurance company delay — gather evidence immediately.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 4 },
        { state: 'New York', years: 3 },
      ],
    },
    faqSection: [
      { question: 'How much is a motorcycle accident case worth?', answer: 'Motorcycle accident settlements are often higher than car accidents due to the severity of injuries. Average settlements range from $50,000 to $500,000+ depending on injury severity.' },
      { question: 'Do I need an attorney for a motorcycle accident?', answer: 'Yes. Insurance companies have a bias against motorcyclists and often try to blame riders. We fight to prove the other driver was at fault and recover full compensation.' },
      { question: 'What should I do after a motorcycle accident?', answer: '1. Seek immediate medical attention. 2. Document the scene with photos. 3. Get witness contact info. 4. Do not speak with insurance companies before consulting an attorney.' },
      { question: 'Can I recover if I was not wearing a helmet?', answer: 'In most states, your failure to wear a helmet does not bar recovery, but may reduce your damages. Some states have helmet comparative fault rules.' },
      { question: 'How long does a motorcycle accident case take?', answer: 'Most cases settle within 12-18 months. Cases involving serious injuries or disputed fault take longer.' },
    ],
    peopleAlsoAsk: [
      { question: 'Can I recover if I was not wearing a helmet?', answer: 'In most states, not wearing a helmet may reduce but does not bar your recovery. We will fight for full compensation.' },
      { question: 'How much is a motorcycle accident case worth?', answer: 'Motorcycle accident cases with serious injuries often result in settlements of $100,000 to $500,000+.' },
    ],
    metaTitle: 'Motorcycle Accident Guide | CasePort',
    metaDescription: 'Complete guide to motorcycle accident claims. Learn settlement amounts, attorney representation, and how to fight insurance bias.',
    directAnswer: 'Motorcycle accident victims often receive 3-5x more with an attorney. Insurance companies have bias against riders. We fight to prove the other driver was at fault.',
    socialHeadline: 'Motorcycle Accident Claims — Fighting for Riders',
    schemaType: 'GuidePage',
  },
  {
    title: 'Rideshare Accident Guide',
    slug: 'rideshare-accident',
    description: 'Uber/Lyft accidents. Complex liability between platform and driver.',
    icon: '🚙',
    displayOrder: 7,
    heroTitle: 'Your Complete Guide to Rideshare Accident Claims',
    heroSubtitle: 'Uber and Lyft accidents involve complex liability. Do not let them分流 your claim.',
    whyImportant: 'Rideshare accidents involve multiple insurance policies and legal complexities. The rideshare company, driver, and other parties may all share liability.',
    quickAnswerStats: {
      average: '$175K',
      successRate: '83%',
      timeline: '12-18 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$450M+',
      successRate: '83%',
      casesWon: '1,100+',
      avgSettlement: '$175K',
      recoveryNote: 'Multiple insurance policies',
    },
    testimonials: [
      { name: 'Nicole P.', location: 'California', settlement: '$240K', settlementValue: '$240,000', injuryType: 'Whiplash', quote: "Uber driver ran red light. Whiplash, back injury. Got $240K." },
      { name: 'Anthony R.', location: 'New York', settlement: '$185K', settlementValue: '$185,000', injuryType: 'Fractures', quote: "Lyft driver sideswiped another car. Multiple fractures. Got $185K." },
      { name: 'Karen S.', location: 'Texas', settlement: '$150K', settlementValue: '$150,000', injuryType: 'Head injury', quote: "Uber accident at merge. Head injury. Got $150K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Spinal Injury', settlementAmount: '250000', minAmount: '125000', maxAmount: '400000', recoveryTime: '18-24 months' },
        { injuryType: 'Traumatic Brain Injury', settlementAmount: '275000', minAmount: '150000', maxAmount: '450000', recoveryTime: '18-24 months' },
        { injuryType: 'Multiple Fractures', settlementAmount: '120000', minAmount: '60000', maxAmount: '200000', recoveryTime: '9-12 months' },
        { injuryType: 'Whiplash/Soft Tissue', settlementAmount: '50000', minAmount: '25000', maxAmount: '100000', recoveryTime: '6-12 months' },
        { injuryType: 'Fatal/Wrongful Death', settlementAmount: '400000', minAmount: '250000', maxAmount: '1M+', recoveryTime: '18-24 months' },
      ],
      attorneyComparison: [
        { label: 'Insurance complexity', withoutAttorney: 'Multiple policies, confusing claims process', withAttorney: 'We navigate all insurance policies' },
        { label: 'Rideshare company liability', withoutAttorney: 'They deny responsibility', withAttorney: 'We hold them accountable under vicarious liability' },
      ],
    },
    statuteOfLimitations: {
      description: 'Rideshare accident cases follow standard statute of limitations (2-4 years), but claims against Uber/Lyft may have additional notice requirements.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 4 },
        { state: 'New York', years: 3 },
      ],
    },
    faqSection: [
      { question: 'Who is liable in a rideshare accident?', answer: 'Multiple parties may be liable: the rideshare driver, Uber/Lyft (under certain circumstances), other drivers, and vehicle manufacturers. The key is determining whether the driver was logged into the app at the time.' },
      { question: 'Does Uber/Lyft have insurance for accidents?', answer: 'Yes. Uber and Lyft provide liability insurance when the driver is logged into the app, but coverage varies depending on whether the driver was carrying a passenger at the time.' },
      { question: 'How much is a rideshare accident case worth?', answer: 'Rideshare accident settlements vary based on injury severity and insurance coverage. With an attorney, cases typically settle for $50,000 to $500,000+.' },
      { question: 'Why do I need an attorney for a rideshare accident?', answer: 'Rideshare accidents involve complex insurance policies and liability questions. We identify all available insurance and liable parties.' },
      { question: 'What should I do after a rideshare accident?', answer: '1. Seek medical attention. 2. Document the scene. 3. Get the driver is information. 4. Note whether the driver had a passenger. 5. Contact an attorney immediately.' },
    ],
    peopleAlsoAsk: [
      { question: 'Does Uber/Lyft have insurance for passengers?', answer: 'Yes. Uber and Lyft provide liability insurance, but coverage depends on whether the driver was logged in and whether they were carrying a passenger.' },
      { question: 'Can I sue Uber or Lyft directly?', answer: 'In some circumstances, yes. We analyze the specific facts of your case to determine whether Uber/Lyft bears direct liability.' },
    ],
    metaTitle: 'Rideshare Accident Guide | Uber Lyft Claims | CasePort',
    metaDescription: 'Complete guide to rideshare accident claims. Learn about Uber/Lyft liability, insurance coverage, and complex rideshare claims.',
    directAnswer: 'Rideshare accidents involve multiple insurance policies and potentially Uber/Lyft liability. With an attorney, you navigate the complexity and recover full compensation.',
    socialHeadline: 'Rideshare Accidents — Complex Claims Explained',
    schemaType: 'GuidePage',
  },
  {
    title: 'Pedestrian Accident Guide',
    slug: 'pedestrian-accident',
    description: 'Pedestrian vs. vehicle. Urban high-volume. Severe injuries.',
    icon: '🚶',
    displayOrder: 8,
    heroTitle: 'Your Complete Guide to Pedestrian Accident Claims',
    heroSubtitle: 'Pedestrians have no protection. When drivers fail to yield, the consequences are devastating.',
    whyImportant: 'Pedestrian deaths have increased 77% since 2009. Drivers fail to yield at crosswalks every day. You deserve compensation when they break the law.',
    quickAnswerStats: {
      average: '$175K',
      successRate: '84%',
      timeline: '12-18 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$500M+',
      successRate: '84%',
      casesWon: '1,300+',
      avgSettlement: '$175K',
      recoveryNote: '5x more than going it alone',
    },
    testimonials: [
      { name: 'George M.', location: 'California', settlement: '$285K', settlementValue: '$285,000', injuryType: 'Head trauma', quote: "Hit in crosswalk by distracted driver. Head trauma. Got $285K." },
      { name: 'Susan K.', location: 'Florida', settlement: '$195K', settlementValue: '$195,000', injuryType: 'Multiple fractures', quote: "Hit in crosswalk while crossing legally. Multiple fractures. Got $195K." },
      { name: 'Michael T.', location: 'New York', settlement: '$225K', settlementValue: '$225,000', injuryType: 'Spinal injury', quote: "Hit by taxi at crosswalk. Spinal injury. Got $225K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Traumatic Brain Injury', settlementAmount: '300000', minAmount: '150000', maxAmount: '500000', recoveryTime: '18-24 months' },
        { injuryType: 'Spinal Cord Injury', settlementAmount: '350000', minAmount: '200000', maxAmount: '600000', recoveryTime: '18-24 months' },
        { injuryType: 'Multiple Fractures', settlementAmount: '125000', minAmount: '60000', maxAmount: '200000', recoveryTime: '9-12 months' },
        { injuryType: 'Internal Injuries', settlementAmount: '150000', minAmount: '75000', maxAmount: '300000', recoveryTime: '12-18 months' },
        { injuryType: 'Fatal/Wrongful Death', settlementAmount: '450000', minAmount: '300000', maxAmount: '1M+', recoveryTime: '18-24 months' },
      ],
      attorneyComparison: [
        { label: 'Pedestrian rights', withoutAttorney: 'Driver claims you darted into traffic', withAttorney: 'We prove you had the right of way' },
        { label: 'Medical expenses', withoutAttorney: 'High medical bills, no way to pay', withAttorney: 'We secure compensation for all medical costs' },
      ],
    },
    statuteOfLimitations: {
      description: 'Pedestrian accident cases follow standard statute of limitations (2-4 years), but gathering evidence immediately is critical.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 4 },
        { state: 'New York', years: 3 },
      ],
    },
    faqSection: [
      { question: 'What should I do if hit by a car as a pedestrian?', answer: '1. Seek immediate medical attention. 2. Call the police. 3. Document the scene with photos. 4. Get driver is information. 5. Do not give statements to insurance companies.' },
      { question: 'How much is a pedestrian accident case worth?', answer: 'Pedestrian accidents typically result in serious injuries, leading to higher settlements. Average cases settle for $50,000 to $500,000+.' },
      { question: 'Who is liable in a pedestrian accident?', answer: 'The driver is usually liable if they failed to yield to a pedestrian in a crosswalk. However, pedestrian fault can reduce recovery in some states.' },
      { question: 'Can I recover if I was jaywalking?', answer: 'In most states, you can still recover even if you were jaywalking, but your percentage of fault may reduce your award.' },
      { question: 'Why do I need an attorney for a pedestrian accident?', answer: 'Drivers and insurance companies will try to blame you. We prove liability and fight for full compensation.' },
    ],
    peopleAlsoAsk: [
      { question: 'Who is liable in a pedestrian accident?', answer: 'The driver is usually liable if they failed to yield to a pedestrian in a crosswalk. We prove the driver was at fault.' },
      { question: 'Can I recover if I was partially at fault?', answer: 'Yes. Most states allow recovery even if you were partially at fault, with your recovery reduced by your percentage of fault.' },
    ],
    metaTitle: 'Pedestrian Accident Guide | CasePort',
    metaDescription: 'Complete guide to pedestrian accident claims. Learn settlement amounts, driver liability, and crosswalk accident claims.',
    directAnswer: 'Pedestrian accident victims who hire attorneys receive significantly more compensation. Drivers who fail to yield in crosswalks are fully liable.',
    socialHeadline: 'Pedestrian Accident Claims — Drivers Must Yield',
    schemaType: 'GuidePage',
  },
  {
    title: 'Dog Bite Guide',
    slug: 'dog-bite',
    description: 'Dog owner liability. Strict liability laws vary by state.',
    icon: '🐕',
    displayOrder: 9,
    heroTitle: 'Your Complete Guide to Dog Bite Claims',
    heroSubtitle: 'Dog bites send 800,000 people to the ER each year. Owners are liable — but insurance companies fight hard.',
    whyImportant: 'Dog bite injuries are among the most traumatic personal injuries. Victim are often children. Strict liability means dog owners are responsible — but only if you know the law.',
    quickAnswerStats: {
      average: '$55K',
      successRate: '90%',
      timeline: '6-12 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$200M+',
      successRate: '90%',
      casesWon: '2,200+',
      avgSettlement: '$55K',
      recoveryNote: '3x more than going it alone',
    },
    testimonials: [
      { name: 'Lisa M.', location: 'California', settlement: '$75K', settlementValue: '$75,000', injuryType: 'Facial scarring', quote: "Dog bite to face requiring reconstructive surgery. Got $75K." },
      { name: 'Bruce J.', location: 'Texas', settlement: '$45K', settlementValue: '$45,000', injuryType: 'Arm lacerations', quote: "Bit by neighbor is dog. Arm lacerations requiring surgery. Got $45K." },
      { name: 'Amy W.', location: 'Florida', settlement: '$65K', settlementValue: '$65,000', injuryType: 'Psychological trauma', quote: "Dog attack on child. Psychological trauma plus physical injuries. Got $65K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Facial Reconstruction', settlementAmount: '100000', minAmount: '50000', maxAmount: '200000', recoveryTime: '12-18 months' },
        { injuryType: 'Severe Lacerations', settlementAmount: '55000', minAmount: '25000', maxAmount: '100000', recoveryTime: '6-12 months' },
        { injuryType: 'Fractures/Broken Bones', settlementAmount: '40000', minAmount: '20000', maxAmount: '75000', recoveryTime: '6-9 months' },
        { injuryType: 'Psychological Trauma', settlementAmount: '35000', minAmount: '15000', maxAmount: '60000', recoveryTime: '6-12 months' },
        { injuryType: 'Minor Bites', settlementAmount: '15000', minAmount: '5000', maxAmount: '30000', recoveryTime: '1-3 months' },
      ],
      attorneyComparison: [
        { label: 'Homeowner insurance', withoutAttorney: 'Lowball offers that do not cover your injuries', withAttorney: 'We max out the homeowner policy' },
        { label: 'Proving liability', withoutAttorney: 'Dog owner denies everything', withAttorney: 'Strict liability makes owners responsible regardless of prior knowledge' },
      ],
    },
    statuteOfLimitations: {
      description: 'Dog bite cases follow standard personal injury statute of limitations (2-4 years), but some states have specific dog bite statutes with shorter deadlines.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 4 },
        { state: 'New York', years: 3 },
      ],
    },
    faqSection: [
      { question: 'Who is liable for a dog bite?', answer: 'In most states, dog owners are strictly liable for bites — meaning they are responsible regardless of whether the dog had shown aggression before. Some states use a one-bite rule or comparative negligence.' },
      { question: 'How much is a dog bite case worth?', answer: 'Dog bite settlements depend on injury severity and scarring. Minor bites may settle for $5,000-$15,000. Serious injuries with scarring can reach $100,000+.' },
      { question: 'What should I do after a dog bite?', answer: '1. Seek immediate medical attention. 2. Identify the dog owner and get their contact info. 3. Report the bite to animal control. 4. Document your injuries with photos. 5. Contact an attorney.' },
      { question: 'Can I recover if I provoked the dog?', answer: 'In some states, provocation can reduce or bar recovery. We analyze the specific circumstances of your case.' },
      { question: 'Do I need an attorney for a dog bite?', answer: 'Yes. Dog bite cases involve homeowner insurance companies that minimize claims. We fight to max out the policy.' },
    ],
    peopleAlsoAsk: [
      { question: 'Who is liable for a dog bite?', answer: 'Dog owners are strictly liable in most states, meaning they are responsible whether or not they knew the dog was dangerous.' },
      { question: 'How much is a dog bite case worth?', answer: 'Dog bite settlements range from $5,000 for minor bites to $100,000+ for serious injuries with permanent scarring.' },
    ],
    metaTitle: 'Dog Bite Guide | CasePort',
    metaDescription: 'Complete guide to dog bite claims. Learn about strict liability, settlement amounts, and how to hold dog owners accountable.',
    directAnswer: 'Dog owners are strictly liable for bites in most states. With an attorney, victims typically recover 3x more than the initial insurance offer.',
    socialHeadline: 'Dog Bite Claims — Owner Liability Explained',
    schemaType: 'GuidePage',
  },
  {
    title: 'Wrongful Death Guide',
    slug: 'wrongful-death',
    description: 'Fatal accidents. Surviving family recovery. Highest emotional stakes.',
    icon: '🕯️',
    displayOrder: 10,
    heroTitle: 'Your Complete Guide to Wrongful Death Claims',
    heroSubtitle: 'Losing a loved one is devastating. We will fight to hold the responsible party accountable.',
    whyImportant: 'Wrongful death claims are the most serious cases we handle. The family deserves answers — and the maximum compensation the law allows.',
    quickAnswerStats: {
      average: '$500K',
      successRate: '78%',
      timeline: '18-24 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$700M+',
      successRate: '78%',
      casesWon: '650+',
      avgSettlement: '$500K',
      recoveryNote: 'Maximum compensation for families',
    },
    testimonials: [
      { name: 'The Wilson Family', location: 'California', settlement: '$650K', settlementValue: '$650,000', injuryType: 'Drunk driver accident', quote: "Husband killed by drunk driver. Got $650K." },
      { name: 'The Thompson Family', location: 'Texas', settlement: '$480K', settlementValue: '$480,000', injuryType: 'Medical malpractice', quote: "Wife died due to surgical error. Got $480K." },
      { name: 'The Garcia Family', location: 'Florida', settlement: '$550K', settlementValue: '$550,000', injuryType: 'Workplace accident', quote: "Father killed in workplace accident. Got $550K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Drunk Driver Death', settlementAmount: '600000', minAmount: '300000', maxAmount: '1M+', recoveryTime: '18-24 months' },
        { injuryType: 'Medical Malpractice Death', settlementAmount: '550000', minAmount: '300000', maxAmount: '1M+', recoveryTime: '24-36 months' },
        { injuryType: 'Workplace Death', settlementAmount: '450000', minAmount: '200000', maxAmount: '800000', recoveryTime: '18-24 months' },
        { injuryType: 'Car Accident Death', settlementAmount: '400000', minAmount: '200000', maxAmount: '750000', recoveryTime: '18-24 months' },
        { injuryType: 'Product Liability Death', settlementAmount: '500000', minAmount: '300000', maxAmount: '1M+', recoveryTime: '24-36 months' },
      ],
      attorneyComparison: [
        { label: 'Insurance company tactics', withoutAttorney: 'They minimize the value of your claim', withAttorney: 'We fight for maximum compensation' },
        { label: 'Proving negligence', withoutAttorney: 'You do not know how to prove fault', withAttorney: 'We prove negligence and liability' },
      ],
    },
    statuteOfLimitations: {
      description: 'Wrongful death cases have strict deadlines — typically 2-4 years. Some states have shorter deadlines. Do not delay.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 4 },
        { state: 'New York', years: 3 },
      ],
    },
    faqSection: [
      { question: 'Who can file a wrongful death claim?', answer: 'Typically, the surviving spouse, children, or parents of the deceased can file a wrongful death claim. In some states, siblings or other relatives may also file.' },
      { question: 'How much is a wrongful death case worth?', answer: 'Wrongful death settlements cover lost wages, lost benefits, funeral expenses, loss of companionship, and more. Cases can range from $100,000 to millions of dollars.' },
      { question: 'How long does a wrongful death case take?', answer: 'Due to complexity, wrongful death cases typically take 18-24 months or longer. We work efficiently while ensuring the strongest case.' },
      { question: 'What damages can be recovered in a wrongful death case?', answer: 'Damages include medical and funeral expenses, lost wages and benefits, loss of companionship, pain and suffering, and punitive damages in egregious cases.' },
      { question: 'Why do I need an attorney for a wrongful death case?', answer: 'Wrongful death cases are complex and emotional. Insurance companies will try to minimize your claim. We fight for maximum compensation.' },
    ],
    peopleAlsoAsk: [
      { question: 'Who can file a wrongful death claim?', answer: 'Typically the surviving spouse, children, or parents can file. We can help determine who has the legal right to file.' },
      { question: 'How long do I have to file a wrongful death claim?', answer: 'The statute of limitations for wrongful death is typically 2-4 years, but some states have shorter deadlines. Contact us immediately.' },
    ],
    metaTitle: 'Wrongful Death Guide | CasePort',
    metaDescription: 'Complete guide to wrongful death claims. Learn about damages, who can file, and how to hold negligent parties accountable.',
    directAnswer: 'Wrongful death claims recover compensation for lost wages, benefits, funeral expenses, and loss of companionship. Families deserve maximum compensation.',
    socialHeadline: 'Wrongful Death Claims — Fighting for Families',
    schemaType: 'GuidePage',
  },
  {
    title: 'Insurance Claims Guide',
    slug: 'insurance-claims',
    description: 'Claim denials and disputes. Bad faith insurance practices.',
    icon: '📋',
    displayOrder: 11,
    heroTitle: 'Your Complete Guide to Insurance Claims & Bad Faith',
    heroSubtitle: 'Insurance companies deny valid claims every day. When they act in bad faith, we make them pay.',
    whyImportant: 'Over 1 in 10 insurance claims are wrongfully denied. Insurance companies count on you not fighting back. Bad faith claims can result in 3x the original claim value.',
    quickAnswerStats: {
      average: '$75K',
      successRate: '86%',
      timeline: '12-18 months',
      upfront: '$0',
    },
    credibilitySection: {
      recoveredAmount: '$350M+',
      successRate: '86%',
      casesWon: '2,500+',
      avgSettlement: '$75K',
      recoveryNote: 'Bad faith pays 3x more',
    },
    testimonials: [
      { name: 'Frank H.', location: 'California', settlement: '$120K', settlementValue: '$120,000', injuryType: 'Denied claim', quote: "Insurance company denied valid claim. Bad faith lawsuit. Got $120K." },
      { name: 'Diane C.', location: 'Texas', settlement: '$85K', settlementValue: '$85,000', injuryType: 'Undervalued claim', quote: "Claim undervalued by $60K. Got full value plus bad faith damages. $85K." },
      { name: 'Robert B.', location: 'Florida', settlement: '$95K', settlementValue: '$95,000', injuryType: 'Delayed payment', quote: "Insurance delayed payment for 18 months. Bad faith claim. Got $95K." },
    ],
    settlementData: {
      rangesByInjury: [
        { injuryType: 'Denied Valid Claim', settlementAmount: '100000', minAmount: '50000', maxAmount: '200000', recoveryTime: '12-18 months' },
        { injuryType: 'Undervalued Claim', settlementAmount: '75000', minAmount: '30000', maxAmount: '150000', recoveryTime: '9-12 months' },
        { injuryType: 'Bad Faith Claim', settlementAmount: '125000', minAmount: '50000', maxAmount: '300000', recoveryTime: '18-24 months' },
        { injuryType: 'Policy Limit Dispute', settlementAmount: '150000', minAmount: '75000', maxAmount: '400000', recoveryTime: '12-18 months' },
      ],
      attorneyComparison: [
        { label: 'Insurance lawyers', withoutAttorney: 'They have lawyers working against you', withAttorney: 'We fight bad faith with expertise' },
        { label: 'Policy interpretation', withoutAttorney: 'You do not know insurance law', withAttorney: 'We know every trick they use' },
      ],
    },
    statuteOfLimitations: {
      description: 'Insurance claims have strict deadlines. Bad faith claims typically have 2-4 years but policy deadlines may be shorter.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 5 },
        { state: 'New York', years: 3 },
      ],
    },
    faqSection: [
      { question: 'What is insurance bad faith?', answer: 'Insurance bad faith occurs when an insurance company refuses to pay a valid claim, delays payment without justification, or fails to investigate a claim properly. Bad faith can result in additional damages.' },
      { question: 'How much is a bad faith insurance claim worth?', answer: 'Bad faith claims can recover the original claim amount PLUS additional damages — potentially 2-3x the original claim value in punitive damages.' },
      { question: 'What should I do if my insurance claim is denied?', answer: '1. Request the reason for denial in writing. 2. Review your policy carefully. 3. Appeal the decision internally. 4. Contact an attorney if the denial is not justified.' },
      { question: 'Can I sue my insurance company?', answer: 'Yes. If your insurance company is acting in bad faith, you can sue them in addition to filing with your state insurance department.' },
      { question: 'Why do I need an attorney for an insurance dispute?', answer: 'Insurance companies have teams of lawyers. We know insurance law and fight bad faith practices.' },
    ],
    peopleAlsoAsk: [
      { question: 'What constitutes insurance bad faith?', answer: 'Bad faith includes wrongfully denying valid claims, delaying payments, failing to investigate, and offering far less than the claim is worth.' },
      { question: 'How much can I get for a bad faith claim?', answer: 'Bad faith claims can recover the original claim plus punitive damages — potentially 2-3x the original claim value.' },
    ],
    metaTitle: 'Insurance Claims Guide | CasePort',
    metaDescription: 'Complete guide to insurance claims and bad faith. Learn how to fight wrongful denials and maximize your claim.',
    directAnswer: 'Insurance bad faith victims who hire attorneys receive 2-3x more than the original claim. Do not accept the insurance company is denial.',
    socialHeadline: 'Insurance Bad Faith Claims — Fighting the Insurers',
    schemaType: 'GuidePage',
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
        type: 'root',
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

  // 1. Seed/update categories
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
        const existingDoc = existing.docs[0]
        createdCategories[cat.slug] = existingDoc.id as string
        // Update existing category with new fields
        await payload.update({
          collection: 'guideCategories',
          id: existingDoc.id as string,
          data: {
            title: cat.title,
            description: cat.description,
            icon: cat.icon,
            displayOrder: cat.displayOrder,
            heroTitle: cat.heroTitle,
            heroSubtitle: cat.heroSubtitle,
            whyImportant: cat.whyImportant,
            quickAnswerStats: cat.quickAnswerStats,
            credibilitySection: cat.credibilitySection,
            testimonials: cat.testimonials,
            settlementData: cat.settlementData,
            statuteOfLimitations: cat.statuteOfLimitations,
            faqSection: cat.faqSection,
            peopleAlsoAsk: cat.peopleAlsoAsk,
            metaTitle: cat.metaTitle,
            metaDescription: cat.metaDescription,
            directAnswer: cat.directAnswer,
            aiCitationSummary: cat.aiCitationSummary,
            socialHeadline: cat.socialHeadline,
            socialDescription: cat.socialDescription,
            schemaType: cat.schemaType,
          } as any,
          depth: 0,
        })
        console.log(`  🔄 Updated: ${cat.title}`)
        continue
      }
      const result = await payload.create({
        collection: 'guideCategories',
        data: cat as any,
        depth: 0,
      })
      createdCategories[cat.slug] = result.id as string
      console.log(`  ✅ Created: ${cat.title}`)
    } catch (err) {
      console.error(`  ❌ Error seeding category ${cat.title}:`, err)
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