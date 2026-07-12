import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { Capsule } from '@/components/article/Capsule'
import { SectionTOC } from '@/components/article/SectionTOC'
import { Expert } from '@/components/article/Expert'
import { Sources } from '@/components/article/Sources'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { RecoveryViz } from '@/components/AccidentsRecoveryViz'
import { CTABand } from '@/components/AccidentsCTABand'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { medicalWebPage, faqSchema, breadcrumb, speakable, orgGraph } from '@/lib/accidents-schema'
import { readingMinutes } from '@/lib/accidents-article'
import type { InjuryArticle, InjuryType } from '@/payload-types'

const MED_REVIEWER = 'Dr. Elena Ramos, MD'

const INJURY_SPOKES = [
  { slug: 'symptoms', label: 'Symptoms' },
  { slug: 'treatment', label: 'Treatment' },
  { slug: 'recovery-timeline', label: 'Recovery Timeline' },
  { slug: 'settlement-factors', label: 'Settlement Factors' },
]

// ─── Block renderers ───────────────────────────────────────────────────────────

function ProseBlock({ sections }: { sections: { title: string; content: string }[] }) {
  return (
    <section className="section bg-cream">
      <div className="container-4">
        {sections.map((s, i) => (
          <div className="prose-sec" key={i}>
            <div className="prose">
              <h2>{s.title}</h2>
              <p>{s.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SymptomsBlock({ block, injuryName }: { block: any; injuryName: string }) {
  const immediate = block?.immediate?.map((s: any) => s.item) || []
  const delayed = block?.delayed?.map((s: any) => s.item) || []
  const emergency = block?.emergency?.map((s: any) => s.item) || []
  const lc = injuryName.toLowerCase()

  const col = (title: string, ic: string, cls: string, items: string[]) => (
    <div className={'sym-col ' + cls}>
      <div className="sym-col-h">
        <Icon name={ic} />
        {title}
      </div>
      <ul>
        {items.map((s, i) => (
          <li key={i}>
            <Icon name={cls === 'emergency' ? 'alert' : 'check2'} />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <>
      <section className="section bg-white">
        <div className="container">
          <div className="sym-grid">
            {col('Immediate symptoms', 'clock', '', immediate)}
            {col('Delayed symptoms (hours–days)', 'steth', '', delayed)}
            {col('Emergency — call 911', 'alert', 'emergency', emergency)}
          </div>
          <p className="note" style={{ marginTop: '1.5rem' }}>
            <Icon name="alertC" />
            <span>
              This is educational information, not a diagnosis. If you have any emergency
              symptom, call 911 or go to the ER immediately.
            </span>
          </p>
        </div>
      </section>
      <ProseBlock
        sections={[
          {
            title: `Why ${injuryName} Symptoms Are Often Delayed`,
            content: `After a collision, adrenaline and the body's acute stress response suppress pain — which is why many people genuinely feel "fine" at the scene of a crash that injured them. As those stress hormones wear off over the following 6 to 72 hours, inflammation builds around the injured tissue and symptoms emerge, often peaking the next morning. With ${lc}, this delay is the rule rather than the exception, and it creates a trap: anything you said at the scene ("I'm okay") and any gap before you sought care will be used to argue you were never really hurt. The medical reality — delayed onset is normal — is on your side, but only if you document the symptoms promptly when they appear.`,
          },
          {
            title: `How ${injuryName} Is Diagnosed`,
            content: `Diagnosing ${lc} starts with a clinical exam — your physician evaluates pain, range of motion, neurological signs, and the mechanism of the crash. Imaging is ordered based on those findings. The diagnostic record this creates does double duty: it directs your treatment and it becomes the objective evidence that connects your injury to the crash. Keeping every appointment and reporting every symptom — even ones that seem minor — builds the complete picture that both your recovery and any claim depend on.`,
          },
        ]}
      />
    </>
  )
}

function TreatmentBlock({ block, injuryName }: { block: any; injuryName: string }) {
  const steps = block?.steps || []
  const lc = injuryName.toLowerCase()

  return (
    <>
      <section className="section bg-white">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">The {injuryName} treatment path</h2>
          </div>
          <div className="tx-list">
            {steps.map((t: any, i: number) => (
              <div className="tx-item r" key={i}>
                <div className="tx-num">{i + 1}</div>
                <div>
                  <h3>{t.name}</h3>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ProseBlock
        sections={[
          {
            title: 'Why Following the Full Treatment Plan Matters',
            content: `With ${lc}, the single most common mistake is stopping treatment when the acute pain fades rather than when the clinician says recovery is complete. Premature return to full activity can turn a healing injury into a chronic one, and gaps in the treatment record are the leading way insurers argue an injury "resolved" or "wasn't serious." Your treatment plan is both a medical roadmap and the evidence trail of your injury: attending every appointment, completing prescribed therapy, and reporting ongoing symptoms protects your recovery and the integrity of any claim simultaneously.`,
          },
          {
            title: 'When Conservative Care Is Not Enough',
            content: `Most ${lc} cases respond to conservative treatment, but a subset require escalation. Warning signs include symptoms that fail to improve on the expected timeline, pain that worsens despite therapy, or new neurological signs. When that happens, the next step is usually advanced imaging and a specialist referral. These escalated cases take longer to resolve and carry greater lasting impact — which is precisely why thorough documentation at every stage matters so much.`,
          },
        ]}
      />
    </>
  )
}

function RecoveryBlock({ block, injuryName }: { block: any; injuryName: string }) {
  const phases = block?.phases || []
  const lc = injuryName.toLowerCase()

  return (
    <>
      <section className="section bg-white">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">{injuryName} recovery, phase by phase</h2>
          </div>
          <RecoveryViz phases={phases} />
          <p className="note" style={{ marginTop: '1.5rem' }}>
            <Icon name="alertC" />
            <span>
              Recovery timelines are typical ranges, not guarantees. Your course depends on
              severity and individual factors — follow your clinician's guidance.
            </span>
          </p>
        </div>
      </section>
      <ProseBlock
        sections={[
          {
            title: 'What Affects How Fast You Heal',
            content: `The phases above describe a typical course, but several factors move an individual's ${lc} recovery faster or slower. Severity is the largest. Adherence is decisive too: patients who complete prescribed therapy tend to recover more fully than those who stop early. Because of this variation, treat any timeline as a planning guide, not a promise.`,
          },
          {
            title: `When ${injuryName} Becomes a Long-Term Injury`,
            content: `Most patients improve substantially, but a meaningful minority develop lasting effects. Lasting effects change everything about a claim: they introduce future medical costs, possible lost earning capacity, and a quantifiable impact on daily life. If your symptoms are not following the expected timeline, that is itself important information for both your care and your claim.`,
          },
        ]}
      />
    </>
  )
}

function SettlementBlock({ block, injuryName }: { block: any; injuryName: string }) {
  const factors = block?.factors || []
  const lc = injuryName.toLowerCase()

  return (
    <>
      <section className="section bg-white">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">What drives the value of a {lc} claim</h2>
          </div>
          <div className="card r">
            {factors.map((f: any, i: number) => (
              <div className="keyfact" style={{ marginBottom: '1rem' }} key={i}>
                <span className="cap-fact" style={{ display: 'flex', gap: '.7rem', alignItems: 'flex-start' }}>
                  <Icon name="check2" style={{ color: '#4a8c7e', flexShrink: 0, marginTop: 3 }} />
                  <span>
                    <b style={{ color: 'var(--teal)' }}>{f.factor}.</b> {f.desc}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <p className="note" style={{ marginTop: '1.25rem' }}>
            <Icon name="alertC" />
            <span>
              These are the factors that influence value — not an estimate of your specific
              claim. No one can value a claim without reviewing your records.
            </span>
          </p>
        </div>
      </section>
      <ProseBlock
        sections={[
          {
            title: `How Insurers Value (and Undervalue) a ${injuryName} Claim`,
            content: `Insurance adjusters begin with your documented economic damages — medical bills and lost wages — and apply a multiplier for severity. The adjuster's job is to find reasons to keep it low: a gap in treatment, a pre-existing condition, or any hint of shared fault. Understanding the levers — and having the records to support each one — is what moves a claim from the lowball range toward full value.`,
          },
          {
            title: 'Why No One Can Quote You a Number Online',
            content: `Be wary of any tool or site that promises a specific dollar figure — your claim's value depends on facts no calculator can see. Two people with the "same" injury can have very different claims. That is why a real valuation requires a review of your medical records and the specifics of your crash.`,
          },
        ]}
      />
    </>
  )
}

// ─── Spoke meta helpers ─────────────────────────────────────────────────────────

function getSpokeLead(article: InjuryArticle): string {
  const blocks = (article as any).blocks || []
  const spokeType = article.spokeType

  if (spokeType === 'symptoms') {
    const block = blocks.find((b: any) => b.blockType === 'injuryArticleSymptoms')
    const immediate = (block?.immediate || []).map((s: any) => s.item)
    const delayed = (block?.delayed || []).map((s: any) => s.item)
    const emergency = (block?.emergency || []).map((s: any) => s.item)
    const name = (article.injuryType as any)?.title || ''
    return `The symptoms of ${name.toLowerCase()} include ${immediate.slice(0, 3).join(', ').toLowerCase()} immediately, and delayed signs that can appear hours to days later. Seek emergency care for ${(emergency[0] || 'severe symptoms').toLowerCase()}.`
  }
  if (spokeType === 'treatment') {
    const block = blocks.find((b: any) => b.blockType === 'injuryArticleTreatment')
    const steps = block?.steps || []
    const name = (article.injuryType as any)?.title || ''
    return `Treatment for ${name.toLowerCase()} typically progresses through ${steps.length || 'several'} stages. Following the full course of care protects both your recovery and the documentation your claim depends on.`
  }
  if (spokeType === 'recovery-timeline') {
    const block = blocks.find((b: any) => b.blockType === 'injuryArticleRecovery')
    const phases = block?.phases || []
    const name = (article.injuryType as any)?.title || ''
    return `Most ${name.toLowerCase()} recovery progresses through ${phases.length} phases. Recovery timelines vary significantly by severity and individual factors.`
  }
  if (spokeType === 'settlement-factors') {
    const block = blocks.find((b: any) => b.blockType === 'injuryArticleSettlement')
    const factors = block?.factors || []
    const name = (article.injuryType as any)?.title || ''
    return `The value of a ${name.toLowerCase()} claim is driven by ${factors.length} main factors. Severity, surgery, permanence, and consistent documentation matter most. CasePort never estimates a specific claim value — only a full review of your medical records can do that.`
  }
  return ''
}

function getSpokeTitle(article: InjuryArticle): string {
  const name = (article.injuryType as any)?.title || ''
  const spokeType = article.spokeType
  if (spokeType === 'symptoms') return `${name} Symptoms: Immediate, Delayed & Emergency Signs`
  if (spokeType === 'treatment') return `${name} Treatment: The Standard Medical Path`
  if (spokeType === 'recovery-timeline') return `${name} Recovery Time: How Long Does It Take to Heal?`
  if (spokeType === 'settlement-factors') return `${name} Settlement Factors: What Drives Claim Value`
  return name
}

function getSpokeSub(article: InjuryArticle): string {
  const name = ((article.injuryType as any)?.title || '').toLowerCase()
  const spokeType = article.spokeType
  if (spokeType === 'symptoms') return `The symptoms of ${name} to watch for after a collision — including the delayed signs that appear hours to days later.`
  if (spokeType === 'treatment') return `How ${name} is treated, step by step — from initial evaluation through rehabilitation.`
  if (spokeType === 'recovery-timeline') return `The typical ${name} recovery timeline, from the acute phase through long-term outcomes.`
  if (spokeType === 'settlement-factors') return `The documented factors that increase or decrease the value of a ${name} claim.`
  return ''
}

// ─── Exports ───────────────────────────────────────────────────────────────────

export function injuryArticleMeta(article: InjuryArticle) {
  return {
    title: `${getSpokeTitle(article)} | CasePort`,
    description: getSpokeLead(article).slice(0, 180),
    canonical: article.slug ? `/injuries/${article.slug}` : '',
  }
}

export function InjuryArticlePage({ article }: { article: InjuryArticle }) {
  const art = article as any
  const blocks = art.blocks || []
  const injuryType = art.injuryType as InjuryType
  const spokeType = art.spokeType
  const injName = injuryType?.title || art.title || ''
  const injSlug = injuryType?.slug || ''

  const spoke = INJURY_SPOKES.find((s) => s.slug === spokeType)
  const metaLead = getSpokeLead(art)
  const metaTitle = getSpokeTitle(art)
  const metaSub = getSpokeSub(art)

  // Extract spoke-specific block
  const spokeBlockMap: Record<string, string> = {
    'symptoms': 'injuryArticleSymptoms',
    'treatment': 'injuryArticleTreatment',
    'recovery-timeline': 'injuryArticleRecovery',
    'settlement-factors': 'injuryArticleSettlement',
  }
  const spokeBlockType = spokeBlockMap[spokeType]
  const spokeBlock = blocks.find((b: any) => b.blockType === spokeBlockType)

  // Key takeaways from the article blocks
  const ktBlock = blocks.find((b: any) => b.blockType === 'injuryArticleKeyTakeaways')
  const ktItems = ktBlock?.items?.slice(0, 4).map((f: any) => f.item) || []

  // FAQ from the article blocks
  const faqBlock = blocks.find((b: any) => b.blockType === 'injuryArticleFAQ')
  const faqs = faqBlock?.items?.slice(0, 4).map((f: any) => ({ q: f.question || '', a: f.answerText || '' })) || []

  // Prose sections from the article blocks
  const proseBlock = blocks.find((b: any) => b.blockType === 'injuryArticleProseSections')
  const proseSections = proseBlock?.sections || []

  // Render spoke-specific content
  let spokeContent: React.ReactNode = null
  if (spokeType === 'symptoms' && spokeBlock) {
    spokeContent = <SymptomsBlock block={spokeBlock} injuryName={injName} />
  } else if (spokeType === 'treatment' && spokeBlock) {
    spokeContent = <TreatmentBlock block={spokeBlock} injuryName={injName} />
  } else if (spokeType === 'recovery-timeline' && spokeBlock) {
    spokeContent = <RecoveryBlock block={spokeBlock} injuryName={injName} />
  } else if (spokeType === 'settlement-factors' && spokeBlock) {
    spokeContent = <SettlementBlock block={spokeBlock} injuryName={injName} />
  }

  const minutes = readingMinutes(metaLead)

  return (
    <>
      <section className="page-intro">
        <div className="container-4">
          <Breadcrumbs
            items={[
              { label: 'Injuries', href: '/injuries' },
              { label: injName, href: `/injuries/${injSlug}` },
              { label: spoke?.label || '' },
            ]}
          />
          <div className="eyebrow" style={{ marginTop: '1.25rem' }}>
            {injName} · {spoke?.label}
          </div>
          <h1>{metaTitle}</h1>
          <p className="section-sub" style={{ marginTop: '.9rem' }}>
            {metaSub}
          </p>
          <Byline reviewerName={MED_REVIEWER} isMedical minutes={minutes} />
        </div>
      </section>

      {ktItems.length > 0 && <KeyTakeaways items={ktItems} />}

      <Capsule lead={metaLead} />

      <SectionTOC />

      {/* Spoke-specific blocks rendered by type */}
      {spokeContent}

      {/* Prose sections from article blocks */}
      {proseSections.length > 0 && <ProseBlock sections={proseSections} />}

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">More on {injName}</h2>
          </div>
          <div className="grid grid-4">
            {INJURY_SPOKES
              .filter((s) => s.slug !== spokeType)
              .map((s) => (
                <Link key={s.slug} href={`/injuries/${injSlug}/${s.slug}`} className="card link r">
                  <h3>
                    {injName} {s.label}
                  </h3>
                </Link>
              ))}
            <Link href={`/injuries/${injSlug}`} className="card link r">
              <h3>{injName} Overview</h3>
            </Link>
          </div>
        </div>
      </section>

      <Expert bg="bg-white" reviewType="medical" />

      <Sources medical citeTitle={metaTitle} citeUrl={`/injuries/${injSlug}/${spokeType}`} />

      <CTABand
        title={`Questions About Your ${injName} Claim?`}
        sub="A free, confidential case review takes minutes and costs nothing."
        btn="Get Free Case Review"
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          medicalWebPage({ headline: metaTitle, description: metaLead.slice(0, 180) }),
          faqSchema(faqs.length ? faqs : [{ q: metaTitle, a: metaLead }]),
          breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Injuries', url: '/injuries' },
            { name: injName, url: `/injuries/${injSlug}` },
            { name: spoke?.label || '', url: `/injuries/${injSlug}/${spokeType}` },
          ]),
          speakable(`/injuries/${injSlug}/${spokeType}`),
          ...orgGraph(),
        ]}
      />
    </>
  )
}
