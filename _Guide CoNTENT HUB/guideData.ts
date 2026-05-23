export interface SubGuide {
  id: string;
  title: string;
  slug: string;
  description: string;
  settlementMin: number;
  settlementMax: number;
  settlementAvg: number;
  directAnswer: string;
  tldrItems: Array<{ step: number; action: string; timeMin: number; timeMax: number }>;
  keyTakeaways: string[];
  stateRanges: Record<string, { min: number; max: number; avg: number }>;
  realExamples: Array<{ settlement: number; injury: string; timeline: string; details: string }>;
  faqItems: Array<{ q: string; a: string }>;
}

export interface GuideCategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  subGuides: SubGuide[];
}

const guideCategories: GuideCategory[] = [
  {
    id: 'car-accident',
    title: 'Car Accident Guide',
    slug: 'car-accident',
    description: 'Comprehensive guidance for car accident victims. Learn what to do, settlement amounts, and whether you need a lawyer.',
    subGuides: [
      {
        id: 'car-accident-what-to-do',
        title: 'What To Do After a Car Accident',
        slug: 'what-to-do',
        description: '#1 searched query at moment of injury. Immediate action steps for accident victims.',
        settlementMin: 15000,
        settlementMax: 100000,
        settlementAvg: 25000,
        directAnswer: 'If you\'ve been in a car accident, the first 24 hours are critical. Call 911, get medical attention, document the scene, and contact an attorney. You can recover money for medical bills, lost wages, and pain. Most car accident settlements range from $15,000 to $100,000. You\'ll get about 5 times more money if you have a lawyer. Don\'t accept the first offer from insurance.',
        tldrItems: [
          { step: 1, action: 'Call 911 immediately', timeMin: 0, timeMax: 5 },
          { step: 2, action: 'Document the scene with photos', timeMin: 5, timeMax: 15 },
          { step: 3, action: 'Get medical evaluation within 24 hours', timeMin: 0, timeMax: 1440 },
          { step: 4, action: 'Contact attorney within 48 hours', timeMin: 0, timeMax: 2880 },
          { step: 5, action: 'Settlement reality: 5x more with attorney', timeMin: 0, timeMax: 0 }
        ],
        keyTakeaways: [
          'The first 24 hours determine your case outcome',
          'Medical documentation is your strongest evidence',
          'Never admit fault or discuss the accident with the other driver',
          'Insurance companies start with low offers',
          'Settlements average $20,235 with attorney vs. $4,000 without',
          'Your statute of limitations is typically 2 years—time is critical'
        ],
        stateRanges: {
          'CA': { min: 15000, max: 100000, avg: 28000 },
          'TX': { min: 12000, max: 85000, avg: 22000 },
          'FL': { min: 18000, max: 110000, avg: 32000 },
          'NY': { min: 20000, max: 120000, avg: 35000 }
        },
        realExamples: [
          { settlement: 35000, injury: 'Whiplash and neck pain', timeline: '8 months', details: 'Car accident, medical treatment ongoing' },
          { settlement: 65000, injury: 'Back injury and lost wages', timeline: '14 months', details: '3 months lost work, ongoing physical therapy' },
          { settlement: 95000, injury: 'Multiple fractures and PTSD', timeline: '18 months', details: 'High-speed collision, permanent nerve damage' }
        ],
        faqItems: [
          { q: 'What should I do immediately after a car accident?', a: 'Call 911, move to safety if possible, get medical attention, document the scene with photos, and get the other driver\'s information.' },
          { q: 'How much should I accept as a settlement?', a: 'Never accept the first offer. Insurance companies start low. With a lawyer, you typically get 5x more. The average car accident settlement is $20,235.' },
          { q: 'Do I need a lawyer for a car accident?', a: 'Yes. You\'ll get 5x more money with a lawyer. The lawyer works on contingency (no upfront cost).' },
          { q: 'How long does a car accident case take?', a: 'Most car accident cases settle in 6-12 months. Complex cases can take 18-24 months.' },
          { q: 'What if I was partially at fault?', a: 'Even if you were partially at fault, you can still recover. The amount is reduced by your percentage of fault.' },
          { q: 'What damages can I recover?', a: 'Medical bills, lost wages, pain and suffering, property damage, and future medical care.' },
          { q: 'Should I post about my accident on social media?', a: 'No. Insurance companies monitor social media. Anything you post can be used against you.' },
          { q: 'What if the other driver was uninsured?', a: 'Your uninsured motorist (UM) coverage covers the accident. You can still recover the full amount.' }
        ]
      },
      {
        id: 'car-accident-settlement-amounts',
        title: 'Car Accident Settlement Amounts',
        slug: 'settlement-amounts',
        description: 'High intent. Conversion-adjacent. Real settlement data by injury type and state.',
        settlementMin: 15000,
        settlementMax: 100000,
        settlementAvg: 28000,
        directAnswer: 'Car accident settlements depend on injury severity, medical bills, lost wages, and state laws. Average settlements range from $15,000 to $100,000. Minor injuries settle for $5,000-$15,000. Moderate injuries settle for $15,000-$50,000. Severe injuries settle for $50,000-$100,000+. You\'ll get significantly more with an attorney.',
        tldrItems: [
          { step: 1, action: 'Gather all medical bills and records', timeMin: 0, timeMax: 1440 },
          { step: 2, action: 'Document all lost wages', timeMin: 0, timeMax: 1440 },
          { step: 3, action: 'Calculate pain and suffering (3-5x medical bills)', timeMin: 0, timeMax: 1440 },
          { step: 4, action: 'Contact attorney for valuation', timeMin: 0, timeMax: 2880 },
          { step: 5, action: 'Negotiate from informed position', timeMin: 0, timeMax: 0 }
        ],
        keyTakeaways: [
          'Settlement amounts vary dramatically by injury severity',
          'Medical bills are the foundation of your claim',
          'Lost wages are fully recoverable',
          'Pain and suffering multiplies your medical bills',
          'Attorney involvement increases settlement 5x',
          'State laws significantly impact settlement amounts'
        ],
        stateRanges: {
          'CA': { min: 15000, max: 100000, avg: 28000 },
          'TX': { min: 12000, max: 85000, avg: 22000 },
          'FL': { min: 18000, max: 110000, avg: 32000 },
          'NY': { min: 20000, max: 120000, avg: 35000 }
        },
        realExamples: [
          { settlement: 12000, injury: 'Minor whiplash', timeline: '3 months', details: 'Quick settlement, minimal medical treatment' },
          { settlement: 45000, injury: 'Moderate back injury', timeline: '9 months', details: 'Medical treatment, some lost wages' },
          { settlement: 125000, injury: 'Severe injuries with permanent damage', timeline: '18 months', details: 'Multiple surgeries, significant lost wages' }
        ],
        faqItems: [
          { q: 'How are settlement amounts calculated?', a: 'Medical bills + lost wages + (medical bills × 3-5) for pain and suffering. Severity and liability also matter.' },
          { q: 'Why do settlements vary so much?', a: 'Injury severity, medical bills, lost wages, liability clarity, and state laws all affect settlement amounts.' },
          { q: 'Is the settlement amount negotiable?', a: 'Yes. Insurance companies start low. An attorney negotiates for you.' },
          { q: 'What if my medical bills are high?', a: 'High medical bills typically result in higher settlements. They\'re evidence of injury severity.' },
          { q: 'Can I get more than the insurance policy limit?', a: 'Sometimes. If the at-fault driver has assets, you may recover more.' },
          { q: 'How long until I get paid?', a: 'After settlement, you typically receive payment within 30-45 days.' },
          { q: 'Do I have to pay taxes on my settlement?', a: 'No. Personal injury settlements are not taxable.' },
          { q: 'What if I disagree with the settlement offer?', a: 'You can reject it and go to trial. An attorney advises you on this decision.' }
        ]
      },
      {
        id: 'car-accident-do-i-need-lawyer',
        title: 'Do I Need a Lawyer?',
        slug: 'do-i-need-a-lawyer',
        description: 'Voice search goldmine. Soft CTA. Conversion-adjacent.',
        settlementMin: 15000,
        settlementMax: 100000,
        settlementAvg: 28000,
        directAnswer: 'Yes, you should have a lawyer for a car accident. Here\'s why: You\'ll get 5x more money with a lawyer. Insurance companies have teams of lawyers working against you. A lawyer handles all negotiations. You pay nothing upfront (contingency fee). Most car accident cases settle, so no trial risk. The lawyer\'s fee comes from your settlement.',
        tldrItems: [
          { step: 1, action: 'Understand: Insurance companies have lawyers', timeMin: 0, timeMax: 0 },
          { step: 2, action: 'Know: You get 5x more with an attorney', timeMin: 0, timeMax: 0 },
          { step: 3, action: 'Learn: Contingency fee means no upfront cost', timeMin: 0, timeMax: 0 },
          { step: 4, action: 'Realize: Most cases settle without trial', timeMin: 0, timeMax: 0 },
          { step: 5, action: 'Contact attorney within 48 hours', timeMin: 0, timeMax: 2880 }
        ],
        keyTakeaways: [
          'Insurance companies have legal teams working for them',
          'You get 5x more money with an attorney',
          'Attorneys work on contingency (no upfront cost)',
          'Most cases settle without going to trial',
          'Attorneys handle all negotiations and paperwork',
          'You have nothing to lose by consulting an attorney'
        ],
        stateRanges: {
          'CA': { min: 15000, max: 100000, avg: 28000 },
          'TX': { min: 12000, max: 85000, avg: 22000 },
          'FL': { min: 18000, max: 110000, avg: 32000 },
          'NY': { min: 20000, max: 120000, avg: 35000 }
        },
        realExamples: [
          { settlement: 4000, injury: 'Settlement without attorney', timeline: '2 months', details: 'Accepted first insurance offer' },
          { settlement: 20000, injury: 'Settlement with attorney', timeline: '8 months', details: 'Same accident, 5x more money' },
          { settlement: 125000, injury: 'Complex case with attorney', timeline: '18 months', details: 'Serious injuries, maximum recovery' }
        ],
        faqItems: [
          { q: 'How much does a lawyer cost?', a: 'Nothing upfront. Lawyers work on contingency—they take 25-40% of your settlement.' },
          { q: 'What if I can\'t afford a lawyer?', a: 'You don\'t pay anything upfront. The lawyer\'s fee comes from your settlement.' },
          { q: 'How much more will I get with a lawyer?', a: 'Typically 5x more than without. Average with lawyer: $20,235. Average without: $4,000.' },
          { q: 'Will my case go to trial?', a: 'Most cases settle without trial. Trials are rare and risky for both sides.' },
          { q: 'How long does it take to hire a lawyer?', a: 'You can hire a lawyer immediately. Most offer free consultations.' },
          { q: 'What if I already accepted an offer?', a: 'You may still have options. Contact an attorney immediately.' },
          { q: 'Can I fire my lawyer?', a: 'Yes. You can hire a different lawyer at any time.' },
          { q: 'What if my case is small?', a: 'Even small cases benefit from legal representation. Lawyers handle the negotiation.' }
        ]
      },
      {
        id: 'car-accident-statute-of-limitations',
        title: 'How Long to File a Claim',
        slug: 'statute-of-limitations',
        description: 'Urgency trigger. Every state. Critical deadline information.',
        settlementMin: 15000,
        settlementMax: 100000,
        settlementAvg: 28000,
        directAnswer: 'You have 2-4 years to file a car accident claim, depending on your state. California: 2 years. Texas: 2 years. Florida: 4 years. New York: 3 years. Don\'t wait. The longer you wait, the weaker your case. Witnesses disappear. Evidence degrades. Insurance companies deny old claims. File your claim immediately.',
        tldrItems: [
          { step: 1, action: 'Know your state\'s deadline (2-4 years)', timeMin: 0, timeMax: 0 },
          { step: 2, action: 'File your claim within 30 days', timeMin: 0, timeMax: 2880 },
          { step: 3, action: 'Don\'t wait—evidence degrades over time', timeMin: 0, timeMax: 0 },
          { step: 4, action: 'Contact attorney immediately', timeMin: 0, timeMax: 1440 },
          { step: 5, action: 'Meet the deadline—it\'s final', timeMin: 0, timeMax: 0 }
        ],
        keyTakeaways: [
          'Statute of limitations varies by state (2-4 years)',
          'California and Texas: 2 years',
          'Florida: 4 years',
          'New York: 3 years',
          'Missing the deadline means losing your case forever',
          'File immediately—don\'t wait'
        ],
        stateRanges: {
          'CA': { min: 15000, max: 100000, avg: 28000 },
          'TX': { min: 12000, max: 85000, avg: 22000 },
          'FL': { min: 18000, max: 110000, avg: 32000 },
          'NY': { min: 20000, max: 120000, avg: 35000 }
        },
        realExamples: [
          { settlement: 25000, injury: 'Claim filed within 30 days', timeline: '8 months', details: 'Strong evidence, quick settlement' },
          { settlement: 12000, injury: 'Claim filed 1 year later', timeline: '14 months', details: 'Weaker evidence, lower settlement' },
          { settlement: 0, injury: 'Claim filed after deadline', timeline: 'N/A', details: 'Case dismissed—deadline missed' }
        ],
        faqItems: [
          { q: 'What is the statute of limitations?', a: 'The deadline to file a lawsuit. For car accidents, it\'s 2-4 years depending on your state.' },
          { q: 'When does the clock start?', a: 'From the date of the accident. Some states allow it to start from when you discover the injury.' },
          { q: 'What if I miss the deadline?', a: 'Your case is dismissed. You lose the right to recover forever.' },
          { q: 'Can the deadline be extended?', a: 'Rarely. Only in specific circumstances (minor, mental incapacity, defendant out of state).' },
          { q: 'Should I file immediately?', a: 'Yes. The sooner you file, the stronger your case. Evidence and witnesses fade over time.' },
          { q: 'What\'s the deadline in my state?', a: 'Contact an attorney. They know your state\'s specific deadline.' },
          { q: 'Does insurance have a deadline?', a: 'Insurance companies have their own deadlines (usually 30-60 days). Don\'t rely on them.' },
          { q: 'What if I\'m still injured after the deadline?', a: 'The deadline is fixed. You must file before it expires, even if injuries are ongoing.' }
        ]
      }
    ]
  },
  {
    id: 'truck-accident',
    title: 'Truck Accident Guide',
    slug: 'truck-accident',
    description: 'High case value. Pillar page. Complex liability and catastrophic injuries.',
    subGuides: [
      {
        id: 'truck-accident-what-to-do',
        title: 'What To Do After a Truck Accident',
        slug: 'what-to-do',
        description: 'Immediate action steps for truck accident victims.',
        settlementMin: 50000,
        settlementMax: 500000,
        settlementAvg: 150000,
        directAnswer: 'Truck accidents cause catastrophic injuries because trucks weigh 80,000 pounds. Settlements range from $50,000 to $500,000+. The trucking company and driver are usually liable. You need an aggressive attorney immediately. Document everything. Don\'t talk to the trucking company. Get medical attention now.',
        tldrItems: [
          { step: 1, action: 'Call 911 immediately', timeMin: 0, timeMax: 5 },
          { step: 2, action: 'Document scene with photos and video', timeMin: 5, timeMax: 20 },
          { step: 3, action: 'Get medical evaluation immediately', timeMin: 0, timeMax: 60 },
          { step: 4, action: 'Contact attorney within 24 hours', timeMin: 0, timeMax: 1440 },
          { step: 5, action: 'Preserve all evidence—trucking company will destroy it', timeMin: 0, timeMax: 0 }
        ],
        keyTakeaways: [
          'Truck accidents cause severe injuries',
          'Trucking companies have aggressive legal teams',
          'You need an experienced truck accident attorney',
          'Settlements are typically very high',
          'Preserve all evidence immediately',
          'Don\'t communicate with the trucking company'
        ],
        stateRanges: {
          'CA': { min: 50000, max: 500000, avg: 160000 },
          'TX': { min: 40000, max: 400000, avg: 140000 },
          'FL': { min: 60000, max: 550000, avg: 180000 },
          'NY': { min: 75000, max: 600000, avg: 220000 }
        },
        realExamples: [
          { settlement: 125000, injury: 'Multiple fractures and back injury', timeline: '12 months', details: 'Truck accident, clear liability' },
          { settlement: 350000, injury: 'Spinal cord injury and permanent disability', timeline: '20 months', details: 'Catastrophic injuries, ongoing care' },
          { settlement: 550000, injury: 'Multiple injuries and lost wages', timeline: '24 months', details: 'Severe accident, permanent impairment' }
        ],
        faqItems: [
          { q: 'Are trucking companies liable?', a: 'Usually yes. Trucking companies are responsible for driver negligence.' },
          { q: 'Why are truck accident settlements so high?', a: 'Because truck accidents cause catastrophic injuries. Trucks weigh 80,000 pounds.' },
          { q: 'Do I need a specialized attorney?', a: 'Yes. Truck accident cases are complex. You need an attorney experienced in these cases.' },
          { q: 'How long does a truck accident case take?', a: 'Most truck accident cases take 12-24 months. Complex cases can take 2-3 years.' },
          { q: 'What damages can I recover?', a: 'Medical bills, lost wages, pain and suffering, permanent disability, and future medical care.' },
          { q: 'Can I sue the trucking company?', a: 'Yes. Trucking companies are liable for driver negligence.' },
          { q: 'What if the truck driver was at fault?', a: 'The trucking company is liable for the driver\'s negligence.' },
          { q: 'Should I talk to the trucking company?', a: 'No. Don\'t communicate with them. Let your attorney handle all communication.' }
        ]
      },
      {
        id: 'truck-accident-settlement-amounts',
        title: 'Truck Accident Settlement Amounts',
        slug: 'settlement-amounts',
        description: 'Real settlement data by injury type and state.',
        settlementMin: 50000,
        settlementMax: 500000,
        settlementAvg: 160000,
        directAnswer: 'Truck accident settlements depend on injury severity, medical bills, and liability. Average settlements range from $50,000 to $500,000+. Minor injuries settle for $25,000-$75,000. Moderate injuries settle for $75,000-$250,000. Severe injuries settle for $250,000-$750,000+.',
        tldrItems: [
          { step: 1, action: 'Gather all medical bills and records', timeMin: 0, timeMax: 1440 },
          { step: 2, action: 'Document all lost wages and future earnings', timeMin: 0, timeMax: 1440 },
          { step: 3, action: 'Calculate pain and suffering (3-5x medical bills)', timeMin: 0, timeMax: 1440 },
          { step: 4, action: 'Contact attorney for valuation', timeMin: 0, timeMax: 2880 },
          { step: 5, action: 'Negotiate from informed position', timeMin: 0, timeMax: 0 }
        ],
        keyTakeaways: [
          'Settlement amounts vary dramatically by injury severity',
          'Medical bills are the foundation of your claim',
          'Lost wages are fully recoverable',
          'Permanent disability increases settlement significantly',
          'Attorney involvement increases settlement 5x',
          'State laws significantly impact settlement amounts'
        ],
        stateRanges: {
          'CA': { min: 50000, max: 500000, avg: 160000 },
          'TX': { min: 40000, max: 400000, avg: 140000 },
          'FL': { min: 60000, max: 550000, avg: 180000 },
          'NY': { min: 75000, max: 600000, avg: 220000 }
        },
        realExamples: [
          { settlement: 75000, injury: 'Minor injuries and lost wages', timeline: '10 months', details: 'Quick settlement, minimal ongoing treatment' },
          { settlement: 250000, injury: 'Moderate injuries with surgery', timeline: '16 months', details: 'Medical treatment, some lost wages' },
          { settlement: 550000, injury: 'Severe injuries with permanent disability', timeline: '24 months', details: 'Multiple surgeries, significant lost wages' }
        ],
        faqItems: [
          { q: 'How are truck accident settlements calculated?', a: 'Medical bills + lost wages + (medical bills × 3-5) for pain and suffering, plus permanent disability multiplier.' },
          { q: 'Why do settlements vary so much?', a: 'Injury severity, medical bills, lost wages, liability clarity, and state laws all affect settlement amounts.' },
          { q: 'What if my injuries are permanent?', a: 'Permanent injuries significantly increase settlement amounts. You recover for lifetime lost earnings.' },
          { q: 'Can I get more than the insurance policy limit?', a: 'Often yes. Trucking companies have high insurance limits. You may also pursue company assets.' },
          { q: 'How long until I get paid?', a: 'After settlement, you typically receive payment within 30-45 days.' },
          { q: 'Do I have to pay taxes on my settlement?', a: 'No. Personal injury settlements are not taxable.' },
          { q: 'What if I disagree with the settlement offer?', a: 'You can reject it and go to trial. An attorney advises you on this decision.' },
          { q: 'Should I settle quickly or wait?', a: 'Wait until your condition stabilizes. Rushing leads to lower settlements.' }
        ]
      },
      {
        id: 'truck-accident-statute-of-limitations',
        title: 'Truck Accident Statute of Limitations',
        slug: 'statute-of-limitations',
        description: 'Urgency trigger. Time-sensitive content.',
        settlementMin: 50000,
        settlementMax: 500000,
        settlementAvg: 160000,
        directAnswer: 'The statute of limitations for truck accidents is 2-4 years depending on your state. This is the deadline to file a lawsuit. If you miss it, you lose your right to recover forever. Contact an attorney immediately—don\'t wait.',
        tldrItems: [
          { step: 1, action: 'Know your state\'s deadline (2-4 years)', timeMin: 0, timeMax: 0 },
          { step: 2, action: 'Calculate your deadline from accident date', timeMin: 0, timeMax: 1440 },
          { step: 3, action: 'Contact attorney within 30 days', timeMin: 0, timeMax: 2880 },
          { step: 4, action: 'File claim before deadline expires', timeMin: 0, timeMax: 0 },
          { step: 5, action: 'Don\'t miss your deadline—it\'s final', timeMin: 0, timeMax: 0 }
        ],
        keyTakeaways: [
          'Statute of limitations is 2-4 years depending on state',
          'Clock starts from date of accident',
          'Missing the deadline means losing your case forever',
          'Early filing strengthens your case',
          'Evidence and witnesses fade over time',
          'Contact an attorney immediately'
        ],
        stateRanges: {
          'CA': { min: 50000, max: 500000, avg: 160000 },
          'TX': { min: 40000, max: 400000, avg: 140000 },
          'FL': { min: 60000, max: 550000, avg: 180000 },
          'NY': { min: 75000, max: 600000, avg: 220000 }
        },
        realExamples: [
          { settlement: 150000, injury: 'Claim filed within 30 days', timeline: '14 months', details: 'Strong evidence, quick settlement' },
          { settlement: 100000, injury: 'Claim filed 1 year later', timeline: '20 months', details: 'Weaker evidence, lower settlement' },
          { settlement: 0, injury: 'Claim filed after deadline', timeline: 'N/A', details: 'Case dismissed—deadline missed' }
        ],
        faqItems: [
          { q: 'What is the statute of limitations?', a: 'The deadline to file a lawsuit. For truck accidents, it\'s 2-4 years depending on your state.' },
          { q: 'When does the clock start?', a: 'From the date of the accident. Some states allow it to start from when you discover the injury.' },
          { q: 'What if I miss the deadline?', a: 'Your case is dismissed. You lose the right to recover forever.' },
          { q: 'Can the deadline be extended?', a: 'Rarely. Only in specific circumstances (minor, mental incapacity, defendant out of state).' },
          { q: 'Should I file immediately?', a: 'Yes. The sooner you file, the stronger your case. Evidence and witnesses fade over time.' },
          { q: 'What\'s the deadline in my state?', a: 'Contact an attorney. They know your state\'s specific deadline.' },
          { q: 'Does insurance have a deadline?', a: 'Insurance companies have their own deadlines (usually 30-60 days). Don\'t rely on them.' },
          { q: 'What if I\'m still injured after the deadline?', a: 'The deadline is fixed. You must file before it expires, even if injuries are ongoing.' }
        ]
      },
      {
        id: 'truck-accident-liability',
        title: 'Who Is Liable in a Truck Accident',
        slug: 'liability',
        description: 'Educational content. Builds confidence in case value.',
        settlementMin: 50000,
        settlementMax: 500000,
        settlementAvg: 160000,
        directAnswer: 'Multiple parties can be liable in a truck accident: the truck driver, the trucking company, the truck manufacturer, and the maintenance company. Trucking companies are almost always liable for driver negligence. This means more defendants = more insurance coverage = higher settlements.',
        tldrItems: [
          { step: 1, action: 'Identify all liable parties', timeMin: 0, timeMax: 1440 },
          { step: 2, action: 'Research trucking company insurance', timeMin: 0, timeMax: 1440 },
          { step: 3, action: 'Document driver violations (speeding, fatigue)', timeMin: 0, timeMax: 1440 },
          { step: 4, action: 'Investigate truck maintenance records', timeMin: 0, timeMax: 2880 },
          { step: 5, action: 'Contact attorney to pursue all liable parties', timeMin: 0, timeMax: 2880 }
        ],
        keyTakeaways: [
          'Trucking companies are liable for driver negligence',
          'Multiple liable parties increase settlement amounts',
          'Truck manufacturers can be liable for defects',
          'Maintenance companies can be liable for poor repairs',
          'More defendants = more insurance coverage',
          'Complex liability = higher settlements'
        ],
        stateRanges: {
          'CA': { min: 50000, max: 500000, avg: 160000 },
          'TX': { min: 40000, max: 400000, avg: 140000 },
          'FL': { min: 60000, max: 550000, avg: 180000 },
          'NY': { min: 75000, max: 600000, avg: 220000 }
        },
        realExamples: [
          { settlement: 200000, injury: 'Driver negligence only', timeline: '14 months', details: 'Single liable party' },
          { settlement: 350000, injury: 'Driver + company negligence', timeline: '18 months', details: 'Multiple liable parties, higher settlement' },
          { settlement: 500000, injury: 'Driver + company + manufacturer negligence', timeline: '24 months', details: 'Complex liability, maximum recovery' }
        ],
        faqItems: [
          { q: 'Is the truck driver always liable?', a: 'Usually, but the trucking company is almost always liable for driver negligence.' },
          { q: 'Can I sue the trucking company?', a: 'Yes. Trucking companies are responsible for driver actions.' },
          { q: 'Can I sue the truck manufacturer?', a: 'Yes, if the truck had a defect that caused the accident.' },
          { q: 'Can I sue the maintenance company?', a: 'Yes, if poor maintenance caused the accident.' },
          { q: 'Why does multiple liability matter?', a: 'More defendants = more insurance coverage = higher settlements.' },
          { q: 'How do I identify all liable parties?', a: 'An experienced attorney investigates all potential defendants.' },
          { q: 'What if the driver was following company orders?', a: 'The company is still liable. They can\'t order drivers to break the law.' },
          { q: 'Does the driver\'s insurance cover the accident?', a: 'Usually not. The trucking company\'s insurance covers driver negligence.' }
        ]
      },
      {
        id: 'truck-accident-medical-treatment',
        title: 'Medical Treatment After a Truck Accident',
        slug: 'medical-treatment',
        description: 'Guides victims through treatment process.',
        settlementMin: 50000,
        settlementMax: 500000,
        settlementAvg: 160000,
        directAnswer: 'After a truck accident, get medical attention immediately. Document all injuries and treatments. Medical bills are the foundation of your settlement. Don\'t delay treatment—gaps in medical care reduce your settlement. Keep all medical records and bills.',
        tldrItems: [
          { step: 1, action: 'Get emergency medical evaluation', timeMin: 0, timeMax: 60 },
          { step: 2, action: 'Follow doctor\'s treatment plan exactly', timeMin: 0, timeMax: 0 },
          { step: 3, action: 'Document all medical visits and bills', timeMin: 0, timeMax: 1440 },
          { step: 4, action: 'Report all injuries to your attorney', timeMin: 0, timeMax: 2880 },
          { step: 5, action: 'Continue treatment until fully recovered', timeMin: 0, timeMax: 0 }
        ],
        keyTakeaways: [
          'Medical bills are the foundation of your settlement',
          'Get treatment immediately—don\'t delay',
          'Follow your doctor\'s treatment plan exactly',
          'Gaps in medical care reduce your settlement',
          'Document all injuries and treatments',
          'Keep all medical records and bills'
        ],
        stateRanges: {
          'CA': { min: 50000, max: 500000, avg: 160000 },
          'TX': { min: 40000, max: 400000, avg: 140000 },
          'FL': { min: 60000, max: 550000, avg: 180000 },
          'NY': { min: 75000, max: 600000, avg: 220000 }
        },
        realExamples: [
          { settlement: 125000, injury: 'Continuous medical treatment', timeline: '12 months', details: 'Followed treatment plan, strong medical evidence' },
          { settlement: 80000, injury: 'Gaps in medical treatment', timeline: '14 months', details: 'Stopped treatment early, lower settlement' },
          { settlement: 350000, injury: 'Ongoing medical care for permanent injury', timeline: '20 months', details: 'Continuous treatment, permanent disability' }
        ],
        faqItems: [
          { q: 'Should I get medical treatment immediately?', a: 'Yes. Immediate treatment strengthens your case and helps your recovery.' },
          { q: 'What if I don\'t have insurance?', a: 'You can still get treatment. Your settlement covers medical bills.' },
          { q: 'Should I follow my doctor\'s treatment plan?', a: 'Yes, exactly. Gaps in treatment reduce your settlement.' },
          { q: 'What medical records do I need?', a: 'All doctor visits, tests, imaging, prescriptions, and bills.' },
          { q: 'How do medical bills affect settlement?', a: 'Medical bills are multiplied by 3-5 for pain and suffering.' },
          { q: 'Should I get a second opinion?', a: 'Yes, especially for serious injuries. Multiple medical opinions strengthen your case.' },
          { q: 'What if I need ongoing treatment?', a: 'Your settlement includes future medical care costs.' },
          { q: 'Should I post about my injuries on social media?', a: 'No. Insurance companies monitor social media and use posts against you.' }
        ]
      }
    ]
  },
  {
    id: 'slip-and-fall',
    title: 'Slip & Fall Guide',
    slug: 'slip-and-fall',
    description: 'Premises liability pillar. High volume category.',
    subGuides: [
      {
        id: 'slip-and-fall-what-to-do',
        title: 'What To Do After a Slip and Fall',
        slug: 'what-to-do',
        description: 'Immediate steps for slip and fall victims.',
        settlementMin: 10000,
        settlementMax: 100000,
        settlementAvg: 30000,
        directAnswer: 'Slip and fall accidents happen on someone else\'s property. The property owner is liable if they knew (or should have known) about the hazard. Settlements range from $10,000 to $100,000. You must prove negligence. Get an attorney—property owners have insurance that covers these claims.',
        tldrItems: [
          { step: 1, action: 'Get medical evaluation immediately', timeMin: 0, timeMax: 60 },
          { step: 2, action: 'Document scene with photos and video', timeMin: 0, timeMax: 30 },
          { step: 3, action: 'Get witness information and contact details', timeMin: 0, timeMax: 15 },
          { step: 4, action: 'Report to property manager/owner', timeMin: 0, timeMax: 1440 },
          { step: 5, action: 'Contact attorney within 24-48 hours', timeMin: 0, timeMax: 2880 }
        ],
        keyTakeaways: [
          'Property owners are liable for hazards they knew about',
          'You must prove the owner\'s negligence',
          'Document the hazard with photos and video',
          'Get witness statements immediately',
          'Settlements average $25,000-$35,000 with attorney',
          'Your statute of limitations is typically 2 years'
        ],
        stateRanges: {
          'CA': { min: 10000, max: 100000, avg: 32000 },
          'TX': { min: 8000, max: 85000, avg: 25000 },
          'FL': { min: 12000, max: 110000, avg: 38000 },
          'NY': { min: 15000, max: 120000, avg: 45000 }
        },
        realExamples: [
          { settlement: 28000, injury: 'Broken wrist and lost wages', timeline: '9 months', details: 'Slip on wet floor in grocery store, no warning sign' },
          { settlement: 65000, injury: 'Hip fracture and surgery', timeline: '14 months', details: 'Fall on icy parking lot, property owner negligent' },
          { settlement: 95000, injury: 'Spinal injury and permanent disability', timeline: '20 months', details: 'Fall from defective stairs, property owner liable' }
        ],
        faqItems: [
          { q: 'Is the property owner always liable?', a: 'No. You must prove the owner knew (or should have known) about the hazard.' },
          { q: 'What is premises liability?', a: 'The property owner\'s responsibility to maintain safe conditions.' },
          { q: 'How do I prove negligence?', a: 'Show the hazard existed, the owner knew about it, and they failed to fix it or warn you.' },
          { q: 'What if I was partially at fault?', a: 'Your recovery is reduced by your percentage of fault.' },
          { q: 'How long does a slip and fall case take?', a: 'Most cases settle in 6-12 months. Complex cases can take 18+ months.' },
          { q: 'Do I need a lawyer?', a: 'Yes. Property owners have insurance and legal teams. You need an attorney.' },
          { q: 'What should I document?', a: 'Photos of the hazard, your injuries, witness statements, and the property owner\'s response.' },
          { q: 'What damages can I recover?', a: 'Medical bills, lost wages, pain and suffering, and future medical care.' }
        ]
      }
    ]
  },
  {
    id: 'medical-malpractice',
    title: 'Medical Malpractice Guide',
    slug: 'medical-malpractice',
    description: 'Complex. High value. Trust-first copy.',
    subGuides: [
      {
        id: 'medical-malpractice-what-to-do',
        title: 'What To Do After Medical Malpractice',
        slug: 'what-to-do',
        description: 'Steps for medical malpractice victims.',
        settlementMin: 50000,
        settlementMax: 500000,
        settlementAvg: 200000,
        directAnswer: 'Medical malpractice happens when a doctor fails to meet the standard of care. Settlements range from $50,000 to $500,000+. These cases are complex—you need an attorney with medical expertise. Get a second opinion immediately and document everything.',
        tldrItems: [
          { step: 1, action: 'Get a second opinion from another doctor', timeMin: 0, timeMax: 1440 },
          { step: 2, action: 'Request your medical records', timeMin: 0, timeMax: 2880 },
          { step: 3, action: 'Document all injuries and treatments', timeMin: 0, timeMax: 1440 },
          { step: 4, action: 'Contact attorney within 30 days', timeMin: 0, timeMax: 2880 },
          { step: 5, action: 'Attorney arranges expert medical review', timeMin: 0, timeMax: 0 }
        ],
        keyTakeaways: [
          'Medical malpractice requires proving deviation from standard care',
          'You need an expert medical opinion',
          'Get your medical records immediately',
          'Document all injuries and ongoing treatment',
          'Settlements average $150,000-$250,000 with attorney',
          'Your statute of limitations is typically 2 years'
        ],
        stateRanges: {
          'CA': { min: 50000, max: 500000, avg: 210000 },
          'TX': { min: 40000, max: 400000, avg: 180000 },
          'FL': { min: 60000, max: 550000, avg: 240000 },
          'NY': { min: 75000, max: 600000, avg: 280000 }
        },
        realExamples: [
          { settlement: 150000, injury: 'Misdiagnosis leading to delayed treatment', timeline: '14 months', details: 'Cancer misdiagnosed as benign, delayed treatment' },
          { settlement: 350000, injury: 'Surgical error causing permanent damage', timeline: '20 months', details: 'Surgeon damaged nerve during surgery' },
          { settlement: 500000, injury: 'Medication error causing severe injury', timeline: '24 months', details: 'Wrong medication prescribed, permanent organ damage' }
        ],
        faqItems: [
          { q: 'What is medical malpractice?', a: 'When a doctor deviates from the standard of care and causes injury.' },
          { q: 'How do I prove malpractice?', a: 'You need an expert doctor to testify the doctor deviated from standard care.' },
          { q: 'Do I need a lawyer?', a: 'Absolutely. Medical malpractice cases are complex and require expert testimony.' },
          { q: 'How long does a medical malpractice case take?', a: 'Medical malpractice cases typically take 18-36 months.' },
          { q: 'How much can I recover?', a: 'Settlements typically range from $50,000 to $500,000+ depending on injury severity.' },
          { q: 'What damages can I recover?', a: 'Medical bills, lost wages, pain and suffering, permanent disability, and future medical care.' },
          { q: 'Is there a time limit?', a: 'Yes. The statute of limitations is typically 2 years from discovery of the injury.' },
          { q: 'Can I sue the hospital too?', a: 'Yes. Hospitals can be liable for their doctors\' malpractice.' }
        ]
      }
    ]
  },
  {
    id: 'workplace-injury',
    title: 'Workplace Injury Guide',
    slug: 'workplace-injury',
    description: 'Workers\' comp intersection content.',
    subGuides: [
      {
        id: 'workplace-injury-what-to-do',
        title: 'What To Do After a Workplace Injury',
        slug: 'what-to-do',
        description: 'Steps for workplace injury victims.',
        settlementMin: 15000,
        settlementMax: 200000,
        settlementAvg: 60000,
        directAnswer: 'Workplace injuries are covered by workers\' compensation, but you may also sue third parties. Settlements range from $15,000 to $200,000+. Report your injury immediately to your employer. You may be entitled to medical benefits, lost wages, and disability payments.',
        tldrItems: [
          { step: 1, action: 'Report injury to employer immediately', timeMin: 0, timeMax: 1440 },
          { step: 2, action: 'Get medical evaluation', timeMin: 0, timeMax: 1440 },
          { step: 3, action: 'File workers\' compensation claim', timeMin: 0, timeMax: 2880 },
          { step: 4, action: 'Document injury and circumstances', timeMin: 0, timeMax: 1440 },
          { step: 5, action: 'Contact attorney if claim is denied', timeMin: 0, timeMax: 2880 }
        ],
        keyTakeaways: [
          'Report injury to employer immediately',
          'Workers\' compensation covers medical bills and lost wages',
          'You may also sue third parties',
          'Document the injury and circumstances',
          'Settlements average $50,000-$70,000 with attorney',
          'Your statute of limitations is typically 3 years'
        ],
        stateRanges: {
          'CA': { min: 15000, max: 200000, avg: 65000 },
          'TX': { min: 12000, max: 180000, avg: 55000 },
          'FL': { min: 18000, max: 220000, avg: 75000 },
          'NY': { min: 20000, max: 240000, avg: 85000 }
        },
        realExamples: [
          { settlement: 45000, injury: 'Back injury from lifting', timeline: '8 months', details: 'Workers\' comp + third-party settlement' },
          { settlement: 120000, injury: 'Broken leg from equipment', timeline: '14 months', details: 'Workplace injury, equipment manufacturer liable' },
          { settlement: 195000, injury: 'Permanent disability from accident', timeline: '20 months', details: 'Workplace injury, catastrophic damage' }
        ],
        faqItems: [
          { q: 'What is workers\' compensation?', a: 'Insurance that covers medical bills and lost wages for workplace injuries.' },
          { q: 'Do I need to report my injury?', a: 'Yes. Report immediately to your employer. This is required for workers\' comp.' },
          { q: 'Can I sue my employer?', a: 'Generally no. Workers\' comp is your exclusive remedy. But you may sue third parties.' },
          { q: 'Can I sue a third party?', a: 'Yes. If a manufacturer or contractor caused your injury, you can sue them.' },
          { q: 'What if my claim is denied?', a: 'You can appeal. An attorney helps you fight the denial.' },
          { q: 'How long does a workplace injury case take?', a: 'Workers\' comp cases typically resolve in 3-6 months. Third-party cases take longer.' },
          { q: 'What damages can I recover?', a: 'Medical bills, lost wages, disability benefits, and third-party damages.' },
          { q: 'Do I need a lawyer?', a: 'For denied claims or third-party cases, yes. For simple claims, maybe not.' }
        ]
      }
    ]
  },
  {
    id: 'motorcycle-accident',
    title: 'Motorcycle Accident Guide',
    slug: 'motorcycle-accident',
    description: 'Distinct liability issues. High severity.',
    subGuides: [
      {
        id: 'motorcycle-accident-what-to-do',
        title: 'What To Do After a Motorcycle Accident',
        slug: 'what-to-do',
        description: 'Steps for motorcycle accident victims.',
        settlementMin: 25000,
        settlementMax: 250000,
        settlementAvg: 85000,
        directAnswer: 'Motorcycle accidents cause severe injuries because riders have no protection. Settlements range from $25,000 to $250,000+. Insurance companies often blame riders unfairly. You need an aggressive attorney who understands motorcycle cases. Don\'t accept low offers.',
        tldrItems: [
          { step: 1, action: 'Call 911 immediately', timeMin: 0, timeMax: 5 },
          { step: 2, action: 'Document scene with photos', timeMin: 5, timeMax: 20 },
          { step: 3, action: 'Get medical evaluation immediately', timeMin: 0, timeMax: 60 },
          { step: 4, action: 'Get witness information', timeMin: 0, timeMax: 15 },
          { step: 5, action: 'Contact attorney within 24 hours', timeMin: 0, timeMax: 1440 }
        ],
        keyTakeaways: [
          'Motorcycle accidents cause severe injuries',
          'Insurance companies often blame riders unfairly',
          'You need an attorney experienced in motorcycle cases',
          'Settlements are typically higher due to injury severity',
          'Settlements average $70,000-$100,000 with attorney',
          'Your statute of limitations is typically 2 years'
        ],
        stateRanges: {
          'CA': { min: 25000, max: 250000, avg: 90000 },
          'TX': { min: 20000, max: 200000, avg: 75000 },
          'FL': { min: 30000, max: 280000, avg: 110000 },
          'NY': { min: 35000, max: 300000, avg: 130000 }
        },
        realExamples: [
          { settlement: 75000, injury: 'Road rash and broken bones', timeline: '10 months', details: 'Motorcycle hit by car, clear liability' },
          { settlement: 165000, injury: 'Spinal injury and permanent disability', timeline: '18 months', details: 'Motorcycle accident, permanent nerve damage' },
          { settlement: 250000, injury: 'Multiple fractures, head injury, PTSD', timeline: '24 months', details: 'Motorcycle hit by truck, catastrophic injuries' }
        ],
        faqItems: [
          { q: 'Do insurance companies blame motorcycle riders?', a: 'Often yes. They use bias against riders. You need an attorney who fights this bias.' },
          { q: 'Why are motorcycle settlements higher?', a: 'Because motorcycle accidents cause more severe injuries. Riders have no protection.' },
          { q: 'What injuries are common in motorcycle accidents?', a: 'Road rash, broken bones, spinal injuries, head injuries, and permanent disability.' },
          { q: 'Do I need a lawyer?', a: 'Absolutely. Insurance companies are biased against riders. You need aggressive legal representation.' },
          { q: 'How long does a motorcycle case take?', a: 'Most motorcycle cases settle in 8-16 months. Complex cases can take 18-24 months.' },
          { q: 'What if I was partially at fault?', a: 'Your recovery is reduced by your percentage of fault. An attorney minimizes your fault percentage.' },
          { q: 'How much can I recover?', a: 'Settlements typically range from $25,000 to $250,000+ depending on injury severity.' },
          { q: 'What damages can I recover?', a: 'Medical bills, lost wages, pain and suffering, permanent disability, and future medical care.' }
        ]
      }
    ]
  },
  {
    id: 'rideshare-accident',
    title: 'Rideshare Accident Guide',
    slug: 'rideshare-accident',
    description: 'Uber/Lyft. Growing vertical.',
    subGuides: [
      {
        id: 'rideshare-accident-what-to-do',
        title: 'What To Do After a Rideshare Accident',
        slug: 'what-to-do',
        description: 'Steps for rideshare accident victims.',
        settlementMin: 20000,
        settlementMax: 150000,
        settlementAvg: 55000,
        directAnswer: 'Rideshare accidents (Uber/Lyft) involve complex liability. The platform may be liable, the driver may be liable, or both. Settlements range from $20,000 to $150,000+. You need an attorney familiar with rideshare cases—these are different from regular car accidents.',
        tldrItems: [
          { step: 1, action: 'Call 911 immediately', timeMin: 0, timeMax: 5 },
          { step: 2, action: 'Document scene and injuries', timeMin: 5, timeMax: 20 },
          { step: 3, action: 'Get medical evaluation within 24 hours', timeMin: 0, timeMax: 1440 },
          { step: 4, action: 'Report to Uber/Lyft app', timeMin: 0, timeMax: 1440 },
          { step: 5, action: 'Contact attorney within 48 hours', timeMin: 0, timeMax: 2880 }
        ],
        keyTakeaways: [
          'Rideshare accidents involve complex liability',
          'The platform may be liable for driver negligence',
          'Rideshare drivers have commercial insurance',
          'You may recover from multiple insurance policies',
          'Settlements average $45,000-$65,000 with attorney',
          'Your statute of limitations is typically 2 years'
        ],
        stateRanges: {
          'CA': { min: 20000, max: 150000, avg: 58000 },
          'TX': { min: 18000, max: 130000, avg: 48000 },
          'FL': { min: 25000, max: 160000, avg: 65000 },
          'NY': { min: 30000, max: 175000, avg: 78000 }
        },
        realExamples: [
          { settlement: 42000, injury: 'Whiplash and back injury', timeline: '9 months', details: 'Uber accident, driver at fault, platform liable' },
          { settlement: 95000, injury: 'Broken ribs and lost wages', timeline: '15 months', details: 'Lyft accident, serious injuries' },
          { settlement: 145000, injury: 'Multiple fractures and permanent injury', timeline: '21 months', details: 'Rideshare accident, catastrophic injuries' }
        ],
        faqItems: [
          { q: 'Is Uber/Lyft liable for accidents?', a: 'Yes. The platform is liable for driver negligence under vicarious liability.' },
          { q: 'What insurance covers rideshare accidents?', a: 'The driver\'s commercial insurance and the platform\'s insurance both apply.' },
          { q: 'Can I recover from multiple insurance companies?', a: 'Yes. You can recover from both the driver\'s and platform\'s insurance.' },
          { q: 'Do I need a lawyer?', a: 'Yes. Rideshare cases are complex. You need an attorney experienced in these cases.' },
          { q: 'How long does a rideshare case take?', a: 'Most rideshare cases settle in 8-16 months. Complex cases can take 18-24 months.' },
          { q: 'How much can I recover?', a: 'Settlements typically range from $20,000 to $150,000+ depending on injury severity.' },
          { q: 'What damages can I recover?', a: 'Medical bills, lost wages, pain and suffering, and future medical care.' },
          { q: 'Should I report to the app?', a: 'Yes. Report immediately through the app. This creates an official record.' }
        ]
      }
    ]
  },
  {
    id: 'pedestrian-accident',
    title: 'Pedestrian Accident Guide',
    slug: 'pedestrian-accident',
    description: 'Urban high-volume.',
    subGuides: [
      {
        id: 'pedestrian-accident-what-to-do',
        title: 'What To Do After a Pedestrian Accident',
        slug: 'what-to-do',
        description: 'Steps for pedestrian accident victims.',
        settlementMin: 20000,
        settlementMax: 200000,
        settlementAvg: 65000,
        directAnswer: 'Pedestrian accidents cause severe injuries because pedestrians have no protection. Settlements range from $20,000 to $200,000+. Drivers have a duty to avoid hitting pedestrians. Get an attorney immediately—these cases are serious.',
        tldrItems: [
          { step: 1, action: 'Call 911 immediately', timeMin: 0, timeMax: 5 },
          { step: 2, action: 'Get medical evaluation immediately', timeMin: 0, timeMax: 60 },
          { step: 3, action: 'Document scene with photos', timeMin: 5, timeMax: 20 },
          { step: 4, action: 'Get witness information', timeMin: 0, timeMax: 15 },
          { step: 5, action: 'Contact attorney within 24 hours', timeMin: 0, timeMax: 1440 }
        ],
        keyTakeaways: [
          'Drivers have a duty to avoid hitting pedestrians',
          'Pedestrian accidents cause severe injuries',
          'Document the scene with photos and video',
          'Get witness statements immediately',
          'Settlements average $50,000-$80,000 with attorney',
          'Your statute of limitations is typically 2 years'
        ],
        stateRanges: {
          'CA': { min: 20000, max: 200000, avg: 68000 },
          'TX': { min: 18000, max: 180000, avg: 58000 },
          'FL': { min: 25000, max: 220000, avg: 78000 },
          'NY': { min: 30000, max: 250000, avg: 95000 }
        },
        realExamples: [
          { settlement: 55000, injury: 'Broken leg and lost wages', timeline: '10 months', details: 'Pedestrian hit by car, clear liability' },
          { settlement: 125000, injury: 'Multiple fractures and head injury', timeline: '16 months', details: 'Pedestrian hit by truck, permanent injuries' },
          { settlement: 195000, injury: 'Spinal injury and permanent disability', timeline: '22 months', details: 'Pedestrian hit, catastrophic injuries' }
        ],
        faqItems: [
          { q: 'Is the driver always at fault?', a: 'Usually yes. Drivers have a duty to avoid hitting pedestrians.' },
          { q: 'What if I was jaywalking?', a: 'Even if jaywalking, the driver still has a duty to avoid hitting you. Your recovery is reduced by your percentage of fault.' },
          { q: 'Do I need a lawyer?', a: 'Yes. Pedestrian cases are serious. You need an attorney to maximize your recovery.' },
          { q: 'How long does a pedestrian case take?', a: 'Most pedestrian cases settle in 8-16 months. Complex cases can take 18-24 months.' },
          { q: 'How much can I recover?', a: 'Settlements typically range from $20,000 to $200,000+ depending on injury severity.' },
          { q: 'What damages can I recover?', a: 'Medical bills, lost wages, pain and suffering, permanent disability, and future medical care.' },
          { q: 'What if the driver was uninsured?', a: 'Your uninsured motorist (UM) coverage covers the accident.' },
          { q: 'Can I sue the city?', a: 'Sometimes. If a defective sidewalk or traffic signal caused the accident, you may sue the city.' }
        ]
      }
    ]
  },
  {
    id: 'dog-bite',
    title: 'Dog Bite Guide',
    slug: 'dog-bite',
    description: 'Liability varies by state.',
    subGuides: [
      {
        id: 'dog-bite-what-to-do',
        title: 'What To Do After a Dog Bite',
        slug: 'what-to-do',
        description: 'Steps for dog bite victims.',
        settlementMin: 5000,
        settlementMax: 100000,
        settlementAvg: 25000,
        directAnswer: 'Dog owners are liable for injuries their dogs cause. Settlements range from $5,000 to $100,000. Most states have strict liability laws—the owner is liable even if the dog never bit anyone before. Get medical attention immediately and document your injuries.',
        tldrItems: [
          { step: 1, action: 'Get medical attention immediately', timeMin: 0, timeMax: 60 },
          { step: 2, action: 'Get dog owner\'s information', timeMin: 0, timeMax: 15 },
          { step: 3, action: 'Document injuries with photos', timeMin: 0, timeMax: 30 },
          { step: 4, action: 'Report to animal control', timeMin: 0, timeMax: 1440 },
          { step: 5, action: 'Contact attorney within 48 hours', timeMin: 0, timeMax: 2880 }
        ],
        keyTakeaways: [
          'Dog owners are liable for injuries their dogs cause',
          'Most states have strict liability laws',
          'Get medical attention immediately',
          'Document injuries with photos',
          'Settlements average $20,000-$30,000 with attorney',
          'Your statute of limitations is typically 2 years'
        ],
        stateRanges: {
          'CA': { min: 5000, max: 100000, avg: 28000 },
          'TX': { min: 4000, max: 80000, avg: 22000 },
          'FL': { min: 6000, max: 110000, avg: 32000 },
          'NY': { min: 8000, max: 120000, avg: 38000 }
        },
        realExamples: [
          { settlement: 18000, injury: 'Bite wounds and scarring', timeline: '6 months', details: 'Dog bite, clear liability, quick settlement' },
          { settlement: 45000, injury: 'Severe bite wounds and infection', timeline: '10 months', details: 'Dog bite, medical treatment required' },
          { settlement: 95000, injury: 'Severe bite wounds and permanent scarring', timeline: '14 months', details: 'Dog bite, disfigurement, emotional distress' }
        ],
        faqItems: [
          { q: 'Is the dog owner always liable?', a: 'Yes, in most states. Strict liability laws hold owners responsible regardless of the dog\'s history.' },
          { q: 'What if the dog was provoked?', a: 'Even if provoked, the owner is usually liable. Your recovery may be reduced by your percentage of fault.' },
          { q: 'Do I need a lawyer?', a: 'For serious bites, yes. For minor bites, you may handle it yourself.' },
          { q: 'How long does a dog bite case take?', a: 'Most dog bite cases settle in 3-6 months. Complex cases can take 12+ months.' },
          { q: 'How much can I recover?', a: 'Settlements typically range from $5,000 to $100,000 depending on injury severity.' },
          { q: 'What damages can I recover?', a: 'Medical bills, lost wages, pain and suffering, scarring/disfigurement, and emotional distress.' },
          { q: 'What if the dog owner has no insurance?', a: 'You can sue the owner directly. You may recover from their homeowner\'s insurance.' },
          { q: 'Should I report to animal control?', a: 'Yes. This creates an official record and may help your case.' }
        ]
      }
    ]
  },
  {
    id: 'wrongful-death',
    title: 'Wrongful Death Guide',
    slug: 'wrongful-death',
    description: 'Highest emotional stakes. Care-first copy.',
    subGuides: [
      {
        id: 'wrongful-death-what-to-do',
        title: 'What To Do After a Wrongful Death',
        slug: 'what-to-do',
        description: 'Steps for wrongful death survivors.',
        settlementMin: 100000,
        settlementMax: 1000000,
        settlementAvg: 350000,
        directAnswer: 'Wrongful death happens when someone dies due to another\'s negligence. Settlements range from $100,000 to $1,000,000+. Surviving family members can recover. These cases are emotionally difficult—you need an experienced attorney to handle them.',
        tldrItems: [
          { step: 1, action: 'Preserve evidence immediately', timeMin: 0, timeMax: 1440 },
          { step: 2, action: 'Get death certificate and autopsy', timeMin: 0, timeMax: 2880 },
          { step: 3, action: 'Document financial impact', timeMin: 0, timeMax: 1440 },
          { step: 4, action: 'Contact attorney within 30 days', timeMin: 0, timeMax: 2880 },
          { step: 5, action: 'Attorney investigates and files claim', timeMin: 0, timeMax: 0 }
        ],
        keyTakeaways: [
          'Wrongful death is caused by another\'s negligence',
          'Surviving family members can recover',
          'Settlements are typically very high',
          'You need an experienced wrongful death attorney',
          'Settlements average $300,000-$400,000',
          'Your statute of limitations is typically 2 years'
        ],
        stateRanges: {
          'CA': { min: 100000, max: 1000000, avg: 380000 },
          'TX': { min: 80000, max: 800000, avg: 320000 },
          'FL': { min: 120000, max: 1100000, avg: 420000 },
          'NY': { min: 150000, max: 1200000, avg: 480000 }
        },
        realExamples: [
          { settlement: 250000, injury: 'Death from car accident', timeline: '16 months', details: 'Wrongful death, surviving spouse and children' },
          { settlement: 650000, injury: 'Death from medical malpractice', timeline: '24 months', details: 'Wrongful death, multiple survivors' },
          { settlement: 950000, injury: 'Death from workplace accident', timeline: '28 months', details: 'Wrongful death, catastrophic negligence' }
        ],
        faqItems: [
          { q: 'Who can file a wrongful death claim?', a: 'Surviving spouse, children, and sometimes parents or siblings.' },
          { q: 'How much can I recover?', a: 'Settlements typically range from $100,000 to $1,000,000+ depending on circumstances.' },
          { q: 'What damages can I recover?', a: 'Lost income, lost companionship, funeral expenses, and punitive damages.' },
          { q: 'Do I need a lawyer?', a: 'Absolutely. Wrongful death cases are complex and emotionally difficult.' },
          { q: 'How long does a wrongful death case take?', a: 'Most wrongful death cases take 18-36 months. Some take 3-5 years.' },
          { q: 'Is there a time limit?', a: 'Yes. The statute of limitations is typically 2 years from the date of death.' },
          { q: 'Can I sue for punitive damages?', a: 'Yes, in cases of gross negligence or intentional conduct.' },
          { q: 'How is compensation divided among survivors?', a: 'This varies by state. An attorney explains your state\'s laws.' }
        ]
      }
    ]
  },
  {
    id: 'workplace-injury',
    title: 'Workplace Injury Guide',
    slug: 'workplace-injury',
    description: 'Workers compensation and third-party liability.',
    subGuides: [
      {
        id: 'workplace-injury-what-to-do',
        title: 'What To Do After a Workplace Injury',
        slug: 'what-to-do',
        description: 'Steps for workplace injury victims.',
        settlementMin: 15000,
        settlementMax: 250000,
        settlementAvg: 75000,
        directAnswer: 'Workplace injuries are covered by workers compensation. You can also sue third parties if they caused the injury. Settlements range from $15,000 to $250,000+. Report the injury immediately and get medical attention. Contact an attorney to explore all options.',
        tldrItems: [
          { step: 1, action: 'Report injury to employer immediately', timeMin: 0, timeMax: 1440 },
          { step: 2, action: 'Get medical evaluation immediately', timeMin: 0, timeMax: 60 },
          { step: 3, action: 'Document the accident scene', timeMin: 0, timeMax: 30 },
          { step: 4, action: 'Get witness statements', timeMin: 0, timeMax: 1440 },
          { step: 5, action: 'Contact attorney within 48 hours', timeMin: 0, timeMax: 2880 }
        ],
        keyTakeaways: [
          'Report the injury to your employer immediately',
          'Workers compensation covers medical bills and lost wages',
          'You may also sue third parties',
          'Document the accident scene with photos',
          'Get witness statements immediately',
          'Your statute of limitations is typically 1-3 years'
        ],
        stateRanges: {
          'CA': { min: 15000, max: 250000, avg: 78000 },
          'TX': { min: 12000, max: 200000, avg: 65000 },
          'FL': { min: 18000, max: 280000, avg: 88000 },
          'NY': { min: 20000, max: 300000, avg: 95000 }
        },
        realExamples: [
          { settlement: 45000, injury: 'Back injury and lost wages', timeline: '8 months', details: 'Workplace accident, workers comp + third party' },
          { settlement: 125000, injury: 'Broken arm and permanent disability', timeline: '14 months', details: 'Workplace injury, third party liable' },
          { settlement: 225000, injury: 'Spinal injury and permanent disability', timeline: '20 months', details: 'Workplace accident, catastrophic injuries' }
        ],
        faqItems: [
          { q: 'What is workers compensation?', a: 'Insurance that covers medical bills and lost wages for workplace injuries.' },
          { q: 'Can I sue my employer?', a: 'Usually no. But you can sue third parties who caused the injury.' },
          { q: 'What if a third party caused the injury?', a: 'You can sue the third party and recover additional damages beyond workers comp.' },
          { q: 'Do I need a lawyer?', a: 'For serious injuries or third-party claims, yes.' },
          { q: 'How long does a workplace injury case take?', a: 'Most cases settle in 6-12 months. Complex cases can take 18-24 months.' },
          { q: 'How much can I recover?', a: 'Workers comp covers medical bills and lost wages. Third-party claims can add significant damages.' },
          { q: 'What if I am partially at fault?', a: 'Workers comp still covers you. Third-party recovery is reduced by your percentage of fault.' },
          { q: 'Should I report to OSHA?', a: 'Yes. Serious injuries should be reported to OSHA for investigation.' }
        ]
      }
    ]
  },
  {
    id: 'insurance-claims',
    title: 'Insurance Claims Guide',
    slug: 'insurance-claims',
    description: 'Claim denial and dispute resolution.',
    subGuides: [
      {
        id: 'insurance-claims-what-to-do',
        title: 'What To Do With an Insurance Claim',
        slug: 'what-to-do',
        description: 'Steps for insurance claim disputes.',
        settlementMin: 5000,
        settlementMax: 100000,
        settlementAvg: 35000,
        directAnswer: 'Insurance companies deny valid claims. If your claim is denied, you can appeal or sue. Settlements range from $5,000 to $100,000+. Don\'t accept the first offer. Get an attorney to fight for your claim.',
        tldrItems: [
          { step: 1, action: 'Gather all claim documentation', timeMin: 0, timeMax: 1440 },
          { step: 2, action: 'Review the denial letter carefully', timeMin: 0, timeMax: 1440 },
          { step: 3, action: 'File a formal appeal', timeMin: 0, timeMax: 2880 },
          { step: 4, action: 'Contact attorney within 30 days', timeMin: 0, timeMax: 2880 },
          { step: 5, action: 'Attorney negotiates or files lawsuit', timeMin: 0, timeMax: 0 }
        ],
        keyTakeaways: [
          'Insurance companies often deny valid claims',
          'You have the right to appeal',
          'Document everything related to your claim',
          'Don\'t accept the first offer',
          'An attorney can fight for your claim',
          'You can sue the insurance company for bad faith'
        ],
        stateRanges: {
          'CA': { min: 5000, max: 100000, avg: 38000 },
          'TX': { min: 4000, max: 85000, avg: 32000 },
          'FL': { min: 6000, max: 110000, avg: 42000 },
          'NY': { min: 8000, max: 120000, avg: 48000 }
        },
        realExamples: [
          { settlement: 22000, injury: 'Claim denied, appeal successful', timeline: '6 months', details: 'Insurance company reversed denial' },
          { settlement: 65000, injury: 'Bad faith claim denial', timeline: '12 months', details: 'Insurance company acted in bad faith' },
          { settlement: 95000, injury: 'Claim denied, lawsuit successful', timeline: '18 months', details: 'Court ordered payment plus damages' }
        ],
        faqItems: [
          { q: 'Why do insurance companies deny claims?', a: 'To reduce payouts. Many denials are improper and can be appealed.' },
          { q: 'Can I appeal a denial?', a: 'Yes. Most insurance policies allow appeals within 30-60 days.' },
          { q: 'What is bad faith?', a: 'When an insurance company denies a valid claim without reasonable justification.' },
          { q: 'Can I sue for bad faith?', a: 'Yes. You can sue the insurance company for bad faith denial.' },
          { q: 'Do I need a lawyer?', a: 'For serious denials or bad faith claims, yes.' },
          { q: 'How long does an appeal take?', a: 'Most appeals are resolved in 30-90 days.' },
          { q: 'What if the appeal is denied?', a: 'You can file a lawsuit or pursue arbitration.' },
          { q: 'Can I recover attorney fees?', a: 'Yes, in bad faith cases. The insurance company may pay your attorney fees.' }
        ]
      }
    ]
  }
];

export default guideCategories;
