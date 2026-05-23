import { Metadata } from 'next'
import { generateArticleSchema, generateFAQSchema, generateOrganizationSchema } from '@/lib/schema-generators'
import GuidesHubClient from './GuidesHubClient'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Personal Injury Guides | CasePort',
  description:
    'Comprehensive guides on personal injury law, statute of limitations, settlement ranges, and your legal rights. Written by attorneys, updated quarterly.',
  openGraph: {
    title: 'Personal Injury Guides | CasePort',
    description:
      'Comprehensive guides on personal injury law, statute of limitations, settlement ranges, and your legal rights.',
    url: 'https://www.caseport.io/guides',
    type: 'website',
    images: [
      {
        url: 'https://www.caseport.io/og-guides.png',
        width: 1200,
        height: 630,
        alt: 'CasePort Personal Injury Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Injury Guides | CasePort',
    description:
      'Comprehensive guides on personal injury law, statute of limitations, settlement ranges, and your legal rights.',
    images: ['https://www.caseport.io/og-guides.png'],
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
    answerPlainText: 'The statute of limitations varies by state, typically ranging from 1 to 6 years. Most states allow 2-3 years for personal injury claims. Some states have shorter deadlines for specific types of cases. It is critical to file before the deadline expires, as you will lose your right to sue.',
  },
  {
    question: 'How much can I expect to receive in a settlement?',
    answerPlainText: 'Settlement amounts depend on injury severity, medical expenses, lost wages, pain and suffering, and liability strength. Average settlements range from $3,000 to $75,000, but serious injuries can result in six-figure settlements. An attorney can evaluate your specific case.',
  },
  {
    question: 'What should I do immediately after an accident?',
    answerPlainText: 'First, ensure everyone is safe and call 911 if needed. Document the scene with photos, get witness contact information, file a police report, seek medical attention, and avoid discussing fault. Contact a personal injury attorney within 72 hours to preserve evidence.',
  },
  {
    question: 'How long does a personal injury case take?',
    answerPlainText: 'Simple cases may settle in 3-6 months, while complex cases can take 1-3 years or longer. The timeline depends on injury severity, liability clarity, insurance cooperation, and whether the case goes to trial. Your attorney can provide a more specific estimate.',
  },
  {
    question: 'Do I need to hire a lawyer?',
    answerPlainText: 'For minor injuries with clear liability, you might handle a claim yourself. However, for serious injuries, disputed fault, or insurance company resistance, an attorney significantly increases your settlement amount and handles complex legal processes.',
  },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Personal Injury Guides',
    description:
      'Comprehensive guides on personal injury law, statute of limitations, settlement ranges, and your legal rights.',
    url: 'https://www.caseport.io/guides',
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answerPlainText,
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.caseport.io',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Guides',
          item: 'https://www.caseport.io/guides',
        },
      ],
    },
  },
  generateOrganizationSchema(),
]

export default function GuidesPage() {
  return (
    <>
      {/* AEO Blocks - Server-rendered, sr-only, before main */}
      <div className="sr-only" aria-label="Direct answer to common personal injury questions">
        <div className="aeo-main">
          <p>
            The statute of limitations for personal injury cases varies by state, typically ranging from 1 to 6 years.
            Most states allow 2-3 years for personal injury claims. The statute of limitations is the deadline by which
            you must file a lawsuit, or you will lose your right to sue permanently.
          </p>
        </div>
      </div>

      <div className="sr-only" aria-label="Key facts about personal injury settlements">
        <div className="aeo-settlement">
          <p>
            Average personal injury settlements range from $3,000 to $75,000, depending on injury severity, medical
            expenses, lost wages, and liability strength. Serious injuries can result in settlements exceeding $100,000.
            Settlement amounts vary significantly based on individual circumstances.
          </p>
        </div>
      </div>

      <div className="sr-only" aria-label="Immediate steps after a personal injury accident">
        <div className="aeo-steps">
          <p>
            Immediately after an accident: 1) Ensure safety and call 911 if needed, 2) Document the scene with photos,
            3) Get witness contact information, 4) File a police report, 5) Seek medical attention, 6) Avoid discussing
            fault, 7) Contact a personal injury attorney within 72 hours to preserve evidence.
          </p>
        </div>
      </div>

      <main>
        {/* JSON-LD Schemas */}
        {schemas.map((schema, index) => (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}

        {/* Breadcrumb Navigation */}
        <nav className="container py-4" aria-label="Breadcrumb">
          <ol className="flex gap-2 text-sm">
            <li>
              <a href="/">Home</a>
            </li>
            <li>/</li>
            <li aria-current="page">Guides</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-teal to-teal-light py-16 text-white">
          <div className="container text-center">
            <h1 className="mb-4 text-5xl font-bold">Personal Injury Guides</h1>
            <p className="mb-8 text-lg">
              Everything you need to know about personal injury law, your rights, and the legal process.
            </p>
            <p className="text-sm opacity-90">
              Written by attorneys. Updated quarterly. Reviewed for legal accuracy.
            </p>
          </div>
        </section>

        {/* Direct Answer Block */}
        <section className="container py-16">
          <div className="mb-12 rounded-lg bg-terra-pale p-8">
            <h2 className="mb-4 text-2xl font-bold">Quick Answer</h2>
            <p className="text-lg">
              <strong>What is the statute of limitations for personal injury cases?</strong>
            </p>
            <p className="mt-2 direct-answer-text">
              The statute of limitations varies by state, typically 1-6 years. Most states allow 2-3 years for personal
              injury claims. This is the deadline to file a lawsuit—missing it means losing your right to sue forever.
            </p>
          </div>
        </section>

        {/* Client Component for Search and Filtering */}
        <GuidesHubClient guides={guidesData} faqItems={faqItems} />
      </main>
    </>
  )
}
