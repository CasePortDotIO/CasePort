'use client'

import { InvisibleInjury } from '@/components/accidents-widgets/InvisibleInjury'
import { CTABand } from '@/components/AccidentsCTABand'
import { FAQ } from '@/components/AccidentsFAQ'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { RecoveryViz } from '@/components/AccidentsRecoveryViz'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { Capsule } from '@/components/article/Capsule'
import { Expert } from '@/components/article/Expert'
import { HeroPhoto } from '@/components/article/HeroPhoto'
import { InGuideTOC } from '@/components/article/InGuideTOC'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { ProseSections } from '@/components/article/ProseSections'
import { Sources } from '@/components/article/Sources'
import { StatTiles } from '@/components/article/StatTiles'
import { Icon } from '@/components/Icon'
import { dashLabel, readingMinutes, toSections } from '@/lib/accidents-article'
import { imgPath } from '@/lib/accidents-constants'
import {
  breadcrumb,
  faqSchema,
  itemList,
  medicalWebPage,
  orgGraph,
  speakable,
} from '@/lib/accidents-schema'
import Link from 'next/link'
import type { InjuryType } from '@/payload-types'

const INJURY_SPOKES = [
  { slug: 'symptoms', label: 'Symptoms' },
  { slug: 'treatment', label: 'Treatment' },
  { slug: 'recovery-timeline', label: 'Recovery Timeline' },
  { slug: 'settlement-factors', label: 'Settlement Factors' },
]

const SPOKE_DESC: Record<string, (name: string) => string> = {
  symptoms: () => 'Immediate, delayed, and emergency symptoms to watch for.',
  treatment: () => 'The standard medical treatment path, step by step.',
  'recovery-timeline': () => 'How long recovery takes, phase by phase.',
  'settlement-factors': (name) => `What drives the value of a ${name.toLowerCase()} claim.`,
}

const INVISIBLE = [
  'whiplash',
  'herniated-disc',
  'soft-tissue-injury',
  'neck-injury',
  'back-injury',
  'shoulder-injury',
]

function injuryScene(sceneImg?: string | null) {
  return imgPath(sceneImg || 'clinical')
}

export function injuryTypeMeta(injuryType: InjuryType) {
  return {
    title: `${injuryType.title} — Symptoms, Treatment, Recovery & Claim Value | CasePort`,
    description: (injuryType.directAnswer || '').slice(0, 180),
    canonical: `/injuries/${injuryType.slug}`,
  }
}

export function InjuryTypePage({
  injuryType,
  allInjuryTypes = [],
}: {
  injuryType: InjuryType
  allInjuryTypes?: { id: string; slug: string; title: string; icon?: string | null; category?: string | null }[]
}) {
  const inj = injuryType as any
  const blocks = inj.blocks || []

  const daBlock = blocks.find((b: any) => b.blockType === 'injuryTypeDirectAnswer')
  const proseBlock = blocks.find((b: any) => b.blockType === 'injuryTypeProseSections')
  const faqBlock = blocks.find((b: any) => b.blockType === 'injuryTypeFAQ')
  const ktBlock = blocks.find((b: any) => b.blockType === 'injuryTypeKeyTakeaways')

  const sections = proseBlock?.sections || toSections(inj.sections || [])
  const minutes = readingMinutes(
    inj.directAnswer || '',
    (inj.sections || []).flatMap((s: any) => s.content || []),
  )

  const keyFactsItems = ktBlock?.items || inj.keyFacts || []
  const takeaways = keyFactsItems.slice(0, 4).map((f: any) => dashLabel(f.item || f))

  const stats = inj.stats || []

  const faqs = faqBlock?.items?.length
    ? faqBlock.items.slice(0, 4).map((f: any) => ({
        q: f.question || '',
        a: f.answerText || '',
      }))
    : [
        {
          q: `What are the symptoms of ${(inj.title || '').toLowerCase()}?`,
          a: `Symptoms vary by severity. Seek prompt evaluation for accurate diagnosis.`,
        },
        {
          q: `How is ${(inj.title || '').toLowerCase()} treated?`,
          a: `Treatment depends on severity and may include conservative care, therapy, or surgery.`,
        },
        {
          q: `How long does recovery take?`,
          a: `Recovery timelines vary significantly based on injury severity and individual factors.`,
        },
        {
          q: `How much is a claim worth?`,
          a: `Value depends on severity, treatment, documentation, and permanence. Settlements vary widely.`,
        },
      ]

  return (
    <>
      <HeroPhoto
        crumbs={
          <Breadcrumbs items={[{ label: 'Injuries', href: '/injuries' }, { label: inj.title }]} />
        }
        eyebrow={inj.category}
        title={inj.title}
        sub={(inj.directAnswer || '').split('. ').slice(0, 1)[0] + '.'}
        scene={inj.category}
        img={injuryScene(inj.sceneImg)}
        byline={<Byline reviewerName="Dr. Elena Ramos, MD" isMedical minutes={minutes} onDark />}
      />

      <StatTiles category={inj.category} stats={stats} />

      <KeyTakeaways items={takeaways} />

      <Capsule
        heading={`What ${inj.title} is — and what it means for your claim`}
        lead={daBlock?.lead || inj.directAnswer}
      />

      <InGuideTOC sections={sections} />

      {INVISIBLE.includes(inj.slug) && <InvisibleInjury />}

      <ProseSections sections={sections} />

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Go Deeper on {inj.title}</h2>
          </div>
          <div className="grid grid-4">
            {INJURY_SPOKES.map((sp) => (
              <Link
                key={sp.slug}
                href={`/injuries/${inj.slug}/${sp.slug}`}
                className="card link r"
              >
                <h3>
                  {inj.title} {sp.label}
                </h3>
                <p style={{ fontSize: '.92rem', marginTop: '.4rem' }}>
                  {SPOKE_DESC[sp.slug](inj.title)}
                </p>
                <span className="card-link" style={{ marginTop: '.9rem' }}>
                  Open
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">{inj.title} Recovery Timeline</h2>
          </div>
          <RecoveryViz phases={inj.recovery || []} />
          <div style={{ marginTop: '1.5rem' }}>
            <Link href={`/injuries/${inj.slug}/recovery-timeline`} className="card-link">
              Full recovery timeline
            </Link>
          </div>
        </div>
      </section>

      <Expert bg="bg-cream" reviewType="medical" />

      <FAQ faqs={faqs} bg="bg-white" title={`Frequently Asked Questions — ${inj.title}`} />

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Other Injuries</h2>
          </div>
          <div className="inj-grid">
            {allInjuryTypes
              .filter((i) => i.slug !== injuryType.slug)
              .slice(0, 4)
              .map((i) => (
                <Link key={i.slug} href={`/injuries/${i.slug}`} className="card link r">
                  <div className="card-ic">
                    <Icon name={i.icon || 'steth'} />
                  </div>
                  <h3>{i.title}</h3>
                  <p style={{ fontSize: '.95rem' }}>{i.category}</p>
                  <span className="card-link" style={{ marginTop: '1rem' }}>
                    Symptoms, treatment &amp; value
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Sources
        medical
        citeTitle={`${inj.title} — Symptoms, Treatment, Recovery & Claim Value`}
        citeUrl={`/injuries/${inj.slug}`}
      />

      <CTABand
        title={`Living With ${inj.title}?`}
        sub="Get a free, confidential case review to understand what your injury and your claim may be worth."
        btn="Get Free Case Review"
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          medicalWebPage({ headline: inj.title, description: (inj.directAnswer || '').slice(0, 180) }),
          faqSchema(faqs),
          breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Injuries', url: '/injuries' },
            { name: inj.title, url: `/injuries/${inj.slug}` },
          ]),
          speakable(`/injuries/${inj.slug}`),
          itemList(sections.map((s: { title: string }) => s.title)),
          ...orgGraph(),
        ]}
      />
    </>
  )
}
