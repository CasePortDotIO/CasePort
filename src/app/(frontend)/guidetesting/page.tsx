import type { Metadata } from 'next'
import GuideTestingClient from './GuideTestingClient'

export const metadata: Metadata = {
  title: 'Personal Injury Guides | CasePort',
  description:
    'Comprehensive guides on personal injury law, statute of limitations, settlement ranges, and your legal rights. Written by attorneys, updated quarterly.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/guidetesting`,
  },
  openGraph: {
    title: 'Personal Injury Guides | CasePort',
    description:
      'Comprehensive guides on personal injury law, statute of limitations, settlement ranges, and your legal rights.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/guidetesting`,
    type: 'website',
  },
}

const guidesData = [
  {
    id: 'statute-of-limitations',
    title: 'Statute of Limitations by State',
    description: 'Understand the deadlines for filing personal injury claims in all 50 states.',
    topic: 'Rights & Law',
    readTime: 8,
  },
  {
    id: 'what-to-do-after-accident',
    title: 'What to Do After a Car Accident',
    description: 'Step-by-step guide to protect your rights and evidence immediately after an accident.',
    topic: 'The Essentials',
    readTime: 6,
  },
  {
    id: 'settlement-ranges',
    title: 'Personal Injury Settlement Ranges',
    description: 'Learn typical settlement amounts for different injury types and circumstances.',
    topic: 'The Process',
    readTime: 10,
  },
  {
    id: 'comparative-negligence',
    title: 'Comparative Negligence Explained',
    description: 'How shared fault affects your personal injury claim in different states.',
    topic: 'Rights & Law',
    readTime: 7,
  },
  {
    id: 'insurance-claim-timeline',
    title: 'Insurance Claim Timeline',
    description: 'What to expect from initial claim to settlement or trial.',
    topic: 'The Process',
    readTime: 9,
  },
  {
    id: 'do-i-need-lawyer',
    title: 'Do I Need a Lawyer?',
    description: 'When to hire an attorney for your personal injury case.',
    topic: 'The Essentials',
    readTime: 5,
  },
  {
    id: 'evidence-preservation',
    title: 'Evidence Preservation Guide',
    description: 'Critical steps to preserve evidence and strengthen your case.',
    topic: 'The Essentials',
    readTime: 7,
  },
  {
    id: 'medical-documentation',
    title: 'Medical Documentation for Claims',
    description: 'How to organize medical records to support your injury claim.',
    topic: 'The Process',
    readTime: 6,
  },
]

const faqItems = [
  {
    question: 'What is the statute of limitations for personal injury cases?',
    answerPlainText:
      'The statute of limitations varies by state, typically ranging from 1 to 6 years. Most states allow 2-3 years for personal injury claims. Some states have shorter deadlines for specific types of cases. It is critical to file before the deadline expires, as you will lose your right to sue.',
  },
  {
    question: 'How much can I expect to receive in a settlement?',
    answerPlainText:
      'Settlement amounts depend on injury severity, medical expenses, lost wages, pain and suffering, and liability strength. Average settlements range from $3,000 to $75,000, but serious injuries can result in six-figure settlements. An attorney can evaluate your specific case.',
  },
  {
    question: 'What should I do immediately after an accident?',
    answerPlainText:
      'First, ensure everyone is safe and call 911 if needed. Document the scene with photos, get witness contact information, file a police report, seek medical attention, and avoid discussing fault. Contact a personal injury attorney within 72 hours to preserve evidence.',
  },
  {
    question: 'How long does a personal injury case take?',
    answerPlainText:
      'Simple cases may settle in 3-6 months, while complex cases can take 1-3 years or longer. The timeline depends on injury severity, liability clarity, insurance cooperation, and whether the case goes to trial. Your attorney can provide a more specific estimate.',
  },
  {
    question: 'Do I need to hire a lawyer?',
    answerPlainText:
      'For minor injuries with clear liability, you might handle a claim yourself. However, for serious injuries, disputed fault, or insurance company resistance, an attorney significantly increases your settlement amount and handles complex legal processes.',
  },
]

export default function GuideTestingPage() {
  return <GuideTestingClient guides={guidesData} faqItems={faqItems} />
}