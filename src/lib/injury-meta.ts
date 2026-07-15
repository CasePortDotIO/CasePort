import type { InjuryType, InjuryArticle } from '@/payload-types'

export function injuryTypeMeta(injuryType: InjuryType) {
  return {
    title: `${injuryType.title} — Symptoms, Treatment, Recovery & Claim Value | CasePort`,
    description: (injuryType.directAnswer || '').slice(0, 180),
    canonical: `/injuries/${injuryType.slug}`,
  }
}

export function getSpokeTitle(article: InjuryArticle): string {
  const name = (article.injuryType as any)?.title || ''
  const spokeType = article.spokeType
  if (spokeType === 'symptoms') return `${name} Symptoms: Immediate, Delayed & Emergency Signs`
  if (spokeType === 'treatment') return `${name} Treatment: The Standard Medical Path`
  if (spokeType === 'recovery-timeline') return `${name} Recovery Time: How Long Does It Take to Heal?`
  if (spokeType === 'settlement-factors') return `${name} Settlement Factors: What Drives Claim Value`
  return name
}

export function getSpokeLead(article: InjuryArticle): string {
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

export function injuryArticleMeta(article: InjuryArticle) {
  return {
    title: `${getSpokeTitle(article)} | CasePort`,
    description: getSpokeLead(article).slice(0, 180),
    canonical: article.slug ? `/injuries/${article.slug}` : '',
  }
}
