import { TakeHome } from '@/components/accidents-widgets/TakeHome'
import { CTABand } from '@/components/AccidentsCTABand'
import { FAQ } from '@/components/AccidentsFAQ'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { Capsule } from '@/components/article/Capsule'
import { Expert } from '@/components/article/Expert'
import { HeroPhoto } from '@/components/article/HeroPhoto'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { ProseSections } from '@/components/article/ProseSections'
import { SectionTOC } from '@/components/article/SectionTOC'
import { Sources } from '@/components/article/Sources'
import { StatTiles } from '@/components/article/StatTiles'
import { Icon } from '@/components/Icon'
import {
  accidentTypes,
  guidePillar,
  guidePillars,
  guides,
  guideSpokeDefs,
  hasGuideSpokes,
  injuries,
  medReviewer,
} from '@/data'
import { dashLabel, readingMinutes, toSections } from '@/lib/accidents-article'
import { reviewer } from '@/lib/accidents-constants'
import { guidePillarLead, guideScene } from '@/lib/accidents-guide'
import {
  article,
  breadcrumb,
  faqSchema,
  medicalWebPage,
  orgGraph,
  speakable,
} from '@/lib/accidents-schema'
import Link from 'next/link'

const INJ_BRIDGE: Record<string, string> = {
  'car-accident': 'whiplash',
  'truck-accident': 'traumatic-brain-injury',
  'motorcycle-accident': 'broken-bones',
  'pedestrian-accident': 'traumatic-brain-injury',
  'bicycle-accident': 'broken-bones',
  'rideshare-accident': 'whiplash',
  'slip-and-fall': 'back-injury',
  'workplace-injury': 'back-injury',
  'wrongful-death': 'traumatic-brain-injury',
  'medical-malpractice': 'internal-injuries',
}
const SPOKE_TITLE: Record<string, (name: string) => string> = {
  'what-to-do': (n) => `What To Do After a ${n}`,
  'settlement-amounts': (n) => `${n} Settlement Amounts`,
  'do-i-need-a-lawyer': () => 'Do I Need a Lawyer?',
  'statute-of-limitations': () => 'How Long to File a Claim',
}

function pillarData(slug: string) {
  const p = guidePillar(slug)!
  const at = p.kind === 'accident' ? accidentTypes[slug] : null
  const g = guides[slug] || null
  const name = at ? at.category : g ? g.name : p.name
  const subtitle = g ? g.subtitle : at ? at.subtitle : p.short
  const directAnswer = g ? g.directAnswer : at ? at.directAnswer : p.short
  const stats = (g && g.stats) || (at && at.stats) || []
  const keyFacts = (g && g.keyFacts) || (at && at.keyFacts) || []
  const sections = (g && g.sections) || (at && at.sections) || []
  return { p, at, g, name, subtitle, directAnswer, stats, keyFacts, sections }
}

export function guidePillarMeta(slug: string) {
  const p = guidePillar(slug)
  if (!p || p.kind === 'faq') return null
  const { name, directAnswer } = pillarData(slug)
  return {
    title: `${name} — The Complete Guide | CasePort`,
    description: directAnswer.slice(0, 180),
    canonical: `/guide/${slug}`,
  }
}

export function GuidePillarPage({ slug }: { slug: string }) {
  const { p, at, g, name, subtitle, directAnswer, stats, keyFacts, sections } = pillarData(slug)
  const isMedical = slug === 'medical-malpractice'
  const lead = p.kind === 'accident' && at ? guidePillarLead(name) : directAnswer
  const prose = p.kind !== 'accident' && sections.length ? toSections(sections) : []
  const minutes = readingMinutes(
    lead,
    prose.flatMap((s) => s.paras),
  )
  const takeaways = keyFacts.slice(0, 4).map(dashLabel)

  // cross-hub bridges
  const bridges: [string, string, string, string][] = []
  if (p.kind === 'accident' && at) {
    bridges.push([
      `/accidents/${slug}`,
      'scale',
      `${name} claims by state`,
      `How your state’s negligence rule and deadline affect a ${name.toLowerCase()} claim.`,
    ])
  }
  const injB = INJ_BRIDGE[slug]
  if (injB && injuries[injB]) {
    bridges.push([
      `/injuries/${injB}`,
      'steth',
      `Common ${name.toLowerCase()} injuries`,
      'Symptoms, treatment, and recovery for injuries seen in these cases.',
    ])
  }
  if (p.kind === 'accident') {
    bridges.push([
      '/guide/dealing-with-insurance',
      'shield',
      'Dealing with insurance',
      'What the adjuster is really doing — and what to say.',
    ])
    bridges.push([
      '/guide/how-to-document-an-accident',
      'camera',
      'Document your accident',
      'The exact evidence to capture before it disappears.',
    ])
  } else {
    bridges.push([
      '/guide/faq',
      'list',
      'Injury claim FAQ',
      'Direct answers to the most common claim questions.',
    ])
    bridges.push([
      '/accidents/first-hour',
      'clock',
      'The first hour after a crash',
      'The immediate steps that protect a claim.',
    ])
  }

  const faqs =
    g && g.faqs
      ? g.faqs
      : [{ q: `What is ${(at ? at.category : name).toLowerCase()}?`, a: directAnswer }].concat(
          sections.slice(0, 3).map((s: { title: string; content: string[] }) => ({
            q: s.title.replace(/\.$/, '') + (/\?$/.test(s.title) ? '' : '?'),
            a: s.content[0],
          })),
        )

  const others = guidePillars.filter((x) => x.slug !== slug && x.slug !== 'faq').slice(0, 4)
  const showTakeHome = slug === 'how-contingency-fees-work' || slug === 'medical-liens-subrogation'

  return (
    <>
      <HeroPhoto
        crumbs={<Breadcrumbs items={[{ label: 'Guide', href: '/guide' }, { label: name }]} />}
        eyebrow={p.kind === 'accident' ? 'Accident Guide · National' : 'Claim Guide · National'}
        title={at ? at.category : name}
        sub={subtitle}
        scene={p.scene}
        img={guideScene(slug)}
        byline={
          <Byline
            reviewerName={isMedical ? medReviewer.name : reviewer.name}
            isMedical={isMedical}
            minutes={minutes}
            onDark
          />
        }
      />

      {stats.length > 0 && <StatTiles category="National guide" stats={stats} />}

      <KeyTakeaways items={takeaways} />

      <Capsule
        heading={`What you need to know about ${(at ? at.category : name).toLowerCase()}`}
        lead={lead}
      />

      <SectionTOC />

      {prose.length > 0 && <ProseSections sections={prose} />}

      {hasGuideSpokes(slug) && (
        <section className="section bg-white">
          <div className="container-5">
            <div className="section-head">
              <h2 className="section-h">{name} — The Key Questions</h2>
              <p className="section-sub">
                The four things people search for most after a {name.toLowerCase()}.
              </p>
            </div>
            <div className="grid grid-4">
              {guideSpokeDefs.map((sp) => (
                <Link key={sp.slug} href={`/guide/${slug}/${sp.slug}`} className="card link r">
                  <h3>{SPOKE_TITLE[sp.slug](name)}</h3>
                  <p style={{ fontSize: '.9rem', marginTop: '.4rem' }}>{sp.note}</p>
                  <span className="card-link" style={{ marginTop: '.8rem', fontSize: '.85rem' }}>
                    Read
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {showTakeHome && <TakeHome bg="bg-warm" />}

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Take the Next Step</h2>
          </div>
          <div className="grid grid-3">
            {bridges.slice(0, 3).map((x) => (
              <Link key={x[0]} href={x[0]} className="card link r">
                <div className="card-ic">
                  <Icon name={x[1]} />
                </div>
                <h3>{x[2]}</h3>
                <p style={{ fontSize: '.92rem', marginTop: '.4rem' }}>{x[3]}</p>
                <span className="card-link" style={{ marginTop: '.8rem', fontSize: '.85rem' }}>
                  Open
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Expert bg={sections.length ? 'bg-cream' : 'bg-white'} reviewType={isMedical ? "medical" : "legal"} />

      <FAQ faqs={faqs} bg="bg-white" title={`Frequently Asked Questions — ${name}`} />

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Explore More Guides</h2>
          </div>
          <div className="grid grid-4">
            {others.map((x) => (
              <Link key={x.slug} href={`/guide/${x.slug}`} className="card link r">
                <div className="card-ic">
                  <Icon name={x.icon} />
                </div>
                <h3>{x.name}</h3>
                <p style={{ fontSize: '.92rem', marginTop: '.4rem' }}>{x.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Sources
        medical={isMedical}
        citeTitle={`${name} — The Complete Guide`}
        citeUrl={`/guide/${slug}`}
      />

      <CTABand
        title={`Questions About Your ${name} Claim?`}
        sub="Get a free, confidential case review — no cost, no obligation."
        btn="Get Free Case Review"
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          isMedical
            ? medicalWebPage({
                headline: `${name} — The Complete Guide`,
                description: directAnswer.slice(0, 180),
              })
            : article({
                headline: `${name} — The Complete Guide`,
                description: directAnswer.slice(0, 180),
              }),
          faqSchema(faqs),
          breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Guide', url: '/guide' },
            { name, url: `/guide/${slug}` },
          ]),
          speakable(`/guide/${slug}`),
          ...orgGraph(),
        ]}
      />
    </>
  )
}
