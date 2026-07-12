import 'dotenv/config'
import { getPayload } from 'payload'
import { injuries, injuryOrder } from '../data'
import configPromise from '../payload.config'

// ─── Shared slug maps ───────────────────────────────────────────────────────────

let injuryTypeSlugMap: Map<string, string> = new Map()
let injuryTypeSlugMapLoaded = false

async function ensureInjuryTypeSlugMap(payload: Awaited<ReturnType<typeof getPayload>>) {
  if (injuryTypeSlugMapLoaded) return
  const existing = await payload.find({
    collection: 'injuryTypes',
    limit: 10000,
    depth: 0,
    select: { id: true, slug: true },
  })
  for (const doc of existing.docs) {
    if (doc.slug) injuryTypeSlugMap.set(doc.slug, doc.id as string)
  }
  injuryTypeSlugMapLoaded = true
  console.log(`   Loaded ${injuryTypeSlugMap.size} existing injury type slugs`)
}

// ─── Seed InjuryTypes ───────────────────────────────────────────────────────────

const isTransientError = (err: any): boolean =>
  err?.errorLabelSet?.has('TransientTransactionError') ||
  err?.codeName === 'WriteConflict' ||
  err?.message?.includes('catalog changes') ||
  err?.message?.includes('TransientTransactionError')

async function upsertInjuryType(
  payload: Awaited<ReturnType<typeof getPayload>>,
  doc: any,
  retries = 3,
): Promise<string> {
  await ensureInjuryTypeSlugMap(payload)
  const existingId = injuryTypeSlugMap.get(doc.slug)
  if (existingId) {
    await payload.update({
      collection: 'injuryTypes',
      id: existingId,
      data: doc,
      depth: 0,
      context: { skipVersionConstraint: true },
    })
    return existingId
  } else {
    try {
      const created = await payload.create({
        collection: 'injuryTypes',
        data: doc,
        depth: 0,
        context: { skipVersionConstraint: true },
      })
      const id = created.id as string
      injuryTypeSlugMap.set(doc.slug, id)
      return id
    } catch (err: any) {
      if (err?.data?.errors?.[0]?.path === 'slug') {
        const existing = await payload.find({
          collection: 'injuryTypes',
          where: { slug: { equals: doc.slug } },
          depth: 0,
          limit: 1,
        })
        if (existing.docs[0]?.id) {
          const id = existing.docs[0].id as string
          injuryTypeSlugMap.set(doc.slug, id)
          await payload.update({
            collection: 'injuryTypes',
            id,
            data: doc,
            depth: 0,
            context: { skipVersionConstraint: true },
          })
          return id
        }
      }
      if (retries > 0 && isTransientError(err)) {
        console.log(`   ⏳ Transient error, retrying... (${retries} left)`)
        await new Promise((r) => setTimeout(r, 1000))
        return upsertInjuryType(payload, doc, retries - 1)
      }
      throw err
    }
  }
}

// ─── Seed InjuryArticles ────────────────────────────────────────────────────────

let injuryArticleSlugMap: Map<string, string> = new Map()
let injuryArticleSlugMapLoaded = false

async function ensureInjuryArticleSlugMap(payload: Awaited<ReturnType<typeof getPayload>>) {
  if (injuryArticleSlugMapLoaded) return
  const existing = await payload.find({
    collection: 'injuryArticles',
    limit: 10000,
    depth: 0,
    select: { id: true, slug: true },
  })
  for (const doc of existing.docs) {
    if (doc.slug) injuryArticleSlugMap.set(doc.slug, doc.id as string)
  }
  injuryArticleSlugMapLoaded = true
  console.log(`   Loaded ${injuryArticleSlugMap.size} existing injury article slugs`)
}

async function upsertInjuryArticle(
  payload: Awaited<ReturnType<typeof getPayload>>,
  doc: any,
  retries = 3,
): Promise<string> {
  await ensureInjuryArticleSlugMap(payload)
  const existingId = injuryArticleSlugMap.get(doc.slug)
  if (existingId) {
    await payload.update({
      collection: 'injuryArticles',
      id: existingId,
      data: doc,
      depth: 0,
      context: { skipVersionConstraint: true },
    })
    return existingId
  } else {
    try {
      const created = await payload.create({
        collection: 'injuryArticles',
        data: doc,
        depth: 0,
        context: { skipVersionConstraint: true },
      })
      const id = created.id as string
      injuryArticleSlugMap.set(doc.slug, id)
      return id
    } catch (err: any) {
      if (err?.data?.errors?.[0]?.path === 'slug') {
        const existing = await payload.find({
          collection: 'injuryArticles',
          where: { slug: { equals: doc.slug } },
          depth: 0,
          limit: 1,
        })
        if (existing.docs[0]?.id) {
          const id = existing.docs[0].id as string
          injuryArticleSlugMap.set(doc.slug, id)
          await payload.update({
            collection: 'injuryArticles',
            id,
            data: doc,
            depth: 0,
            context: { skipVersionConstraint: true },
          })
          return id
        }
      }
      if (retries > 0 && isTransientError(err)) {
        console.log(`   ⏳ Transient error, retrying... (${retries} left)`)
        await new Promise((r) => setTimeout(r, 1000))
        return upsertInjuryArticle(payload, doc, retries - 1)
      }
      throw err
    }
  }
}

// ─── Block builders ────────────────────────────────────────────────────────────

function buildTypeBlocks(inj: any, injuryName: string) {
  return [
    {
      blockType: 'injuryTypeDirectAnswer',
      heading: `What ${injuryName.toLowerCase()} means for your claim`,
      lead: inj.directAnswer,
    },
    {
      blockType: 'injuryTypeKeyTakeaways',
      items: inj.keyFacts.slice(0, 4).map((f: string) => ({ item: f })),
    },
    {
      blockType: 'injuryTypeProseSections',
      sections: inj.sections.map((s: any) => ({
        title: s.title,
        content: s.content.join('\n\n'),
      })),
    },
    {
      blockType: 'injuryTypeFAQ',
      items: [
        {
          question: `What are the symptoms of ${injuryName.toLowerCase()}?`,
          answerText: `Common symptoms include ${inj.symptoms.immediate.join(', ')}. Some symptoms are delayed, appearing hours to days later.`,
        },
        {
          question: `How is ${injuryName.toLowerCase()} treated?`,
          answerText: inj.treatment[0]?.desc || '',
        },
        {
          question: `How long does it take to recover from ${injuryName.toLowerCase()}?`,
          answerText: `Recovery varies by severity. Most patients progress through ${inj.recovery.length} phases, with the most severe cases involving lasting effects.`,
        },
        {
          question: `How much is a ${injuryName.toLowerCase()} claim worth?`,
          answerText: `Average settlements range ${inj.stats.find((s: any) => s.label === 'Avg Settlement')?.value || 'varies'}. Value depends on severity, treatment duration, and whether symptoms become chronic.`,
        },
      ],
      aiCitationSummary: `${injuryName} is a ${inj.category.toLowerCase()} injury. ${inj.directAnswer.split('.')[0]}. Settlements typically range ${inj.stats.find((s: any) => s.label === 'Avg Settlement')?.value || 'varies'}.`,
    },
    {
      blockType: 'injuryTypeExpert',
      reviewType: 'medical',
      sourceText:
        'Every injury guide on CasePort is reviewed for medical accuracy by Dr. Elena Ramos, MD — a board-certified physical medicine and rehabilitation specialist with 12 years of post-collision trauma experience. Content is updated quarterly.',
    },
    {
      blockType: 'injuryTypeCTA',
      title: `Living With ${injuryName}?`,
      subtitle:
        'Get a free, confidential case review to understand what your injury and your claim may be worth.',
      link: '/checkmycase',
    },
    {
      blockType: 'injuryTypeSources',
      citeTitle: `${injuryName} — Symptoms, Treatment, Recovery & Claim Value`,
      citeUrl: `/injuries/${inj.slug}`,
      sources: [
        { name: 'National Highway Traffic Safety Administration (NHTSA)', url: '' },
        { name: 'American Academy of Physical Medicine and Rehabilitation', url: '' },
        { name: 'Insurance Research Council', url: '' },
      ],
    },
  ]
}

function buildArticleBlocks(inj: any, injuryName: string, spokeType: string) {
  const lc = injuryName.toLowerCase()

  if (spokeType === 'symptoms') {
    return [
      {
        blockType: 'injuryArticleSymptoms',
        immediate: inj.symptoms.immediate.map((s: string) => ({ item: s })),
        delayed: inj.symptoms.delayed.map((s: string) => ({ item: s })),
        emergency: inj.symptoms.emergency.map((s: string) => ({ item: s })),
      },
      {
        blockType: 'injuryArticleKeyTakeaways',
        items: inj.symptoms.immediate.slice(0, 4).map((s: string) => ({ item: s })),
      },
      {
        blockType: 'injuryArticleFAQ',
        items: [
          { question: `What are the first symptoms of ${lc}?`, answerText: `Immediately after the injury: ${inj.symptoms.immediate.join(', ').toLowerCase()}.` },
          { question: `Can ${lc} symptoms be delayed?`, answerText: `Yes. Delayed symptoms include ${inj.symptoms.delayed.join(', ').toLowerCase()}, often appearing hours to days after the crash as inflammation builds.` },
          { question: `When is ${lc} an emergency?`, answerText: `Seek emergency care immediately for: ${inj.symptoms.emergency.join(', ').toLowerCase()}.` },
        ],
      },
    ]
  }

  if (spokeType === 'treatment') {
    return [
      {
        blockType: 'injuryArticleTreatment',
        steps: inj.treatment.map((t: any) => ({ name: t.name, desc: t.desc })),
      },
      {
        blockType: 'injuryArticleKeyTakeaways',
        items: inj.treatment.map((t: any) => ({ item: t.name })),
      },
      {
        blockType: 'injuryArticleFAQ',
        items: inj.treatment.slice(0, 3).map((t: any) => ({ question: `${t.name} for ${lc}?`, answerText: t.desc })),
      },
    ]
  }

  if (spokeType === 'recovery-timeline') {
    return [
      {
        blockType: 'injuryArticleRecovery',
        phases: inj.recovery.map((r: any) => ({
          phase: r.phase,
          time: r.time,
          desc: r.desc,
        })),
      },
      {
        blockType: 'injuryArticleKeyTakeaways',
        items: inj.recovery.map((p: any) => ({ item: `${p.phase} — ${p.time}` })),
      },
      {
        blockType: 'injuryArticleFAQ',
        items: [
          { question: `How long does ${lc} take to heal?`, answerText: inj.recovery.map((p: any) => `${p.phase} (${p.time}): ${p.desc}`).join(' ') },
          { question: `Can ${lc} cause permanent damage?`, answerText: `In some cases, yes. Lasting effects are a major factor in claim value.` },
        ],
      },
    ]
  }

  if (spokeType === 'settlement-factors') {
    return [
      {
        blockType: 'injuryArticleSettlement',
        factors: inj.settlement.map((f: any) => ({ factor: f.factor, desc: f.desc })),
      },
      {
        blockType: 'injuryArticleKeyTakeaways',
        items: inj.settlement.slice(0, 4).map((f: any) => ({ item: f.factor })),
      },
      {
        blockType: 'injuryArticleFAQ',
        items: inj.settlement.slice(0, 3).map((f: any) => ({
          question: `Does ${f.factor.toLowerCase()} affect a ${lc} claim?`,
          answerText: f.desc,
        })),
      },
    ]
  }

  return []
}

// ─── Main seed ─────────────────────────────────────────────────────────────────

const SPOKE_TYPES = ['symptoms', 'treatment', 'recovery-timeline', 'settlement-factors']

async function main() {
  console.log('🚀 Seeding InjuryTypes + InjuryArticles collections...')
  const payload = await getPayload({ config: configPromise })

  // ── Phase 1: Seed InjuryTypes ──────────────────────────────────────────────
  console.log('\n📦 Phase 1: Seeding InjuryTypes...')
  let typeCount = 0

  for (const slug of injuryOrder) {
    const inj = injuries[slug]
    if (!inj) {
      console.warn(`   ⚠️  No injury data for "${slug}", skipping`)
      continue
    }

    const blocks = buildTypeBlocks(inj, inj.name)

    await upsertInjuryType(payload, {
      _isSeeding: true,
      title: inj.name,
      slug: slug,
      category: inj.category,
      icon: inj.icon || 'steth',
      sceneImg: inj.sceneImg || 'clinical',
      displayOrder: injuryOrder.indexOf(slug),
      directAnswer: inj.directAnswer,
      stats: inj.stats.map((s: any) => ({ label: s.label, value: s.value })),
      keyFacts: inj.keyFacts.map((f: string) => ({ item: f })),
      blocks,
      // Root-level spoke data — used by InjuryTypePage for RecoveryViz and any direct access
      symptoms: {
        immediate: inj.symptoms.immediate.map((s: string) => ({ item: s })),
        delayed: inj.symptoms.delayed.map((s: string) => ({ item: s })),
        emergency: inj.symptoms.emergency.map((s: string) => ({ item: s })),
      },
      treatment: inj.treatment,
      recovery: inj.recovery.map((r: any) => ({ phase: r.phase, time: r.time, desc: r.desc })),
      settlement: inj.settlement.map((f: any) => ({ factor: f.factor, desc: f.desc })),
      metaTitle: `${inj.name} — Symptoms, Treatment & Claim Value | CasePort`,
      metaDescription: inj.directAnswer.slice(0, 160),
      focusKeyword: `${inj.name.toLowerCase()} settlement claim`,
      publishedDate: new Date().toISOString(),
    })

    typeCount++
    console.log(`   ✅ Seeded InjuryType: ${inj.name}`)
  }

  // ── Phase 2: Seed InjuryArticles ───────────────────────────────────────────
  console.log('\n📦 Phase 2: Seeding InjuryArticles...')
  let articleCount = 0

  for (const injSlug of injuryOrder) {
    const inj = injuries[injSlug]
    if (!inj) continue

    const injuryTypeId = injuryTypeSlugMap.get(injSlug)
    if (!injuryTypeId) {
      console.warn(`   ⚠️  No InjuryType ID for "${injSlug}", skipping articles`)
      continue
    }

    for (const spokeType of SPOKE_TYPES) {
      const articleSlug = `${injSlug}-${spokeType}`
      const blocks = buildArticleBlocks(inj, inj.name, spokeType)

      // Derive article title from spoke type
      const spokeLabel = spokeType === 'recovery-timeline' ? 'Recovery Timeline'
        : spokeType === 'settlement-factors' ? 'Settlement Factors'
        : spokeType.charAt(0).toUpperCase() + spokeType.slice(1)
      const articleTitle = `${inj.name} ${spokeLabel}`

      await upsertInjuryArticle(payload, {
        _isSeeding: true,
        title: articleTitle,
        slug: articleSlug,
        injuryType: injuryTypeId,
        spokeType,
        blocks,
        metaTitle: `${articleTitle} | CasePort`,
        metaDescription: blocks[0] ? `${inj.name} ${spokeLabel} — learn more about this injury.` : '',
        publishedDate: new Date().toISOString(),
      })

      articleCount++
      console.log(`   ✅ Seeded InjuryArticle: ${articleTitle}`)
    }
  }

  console.log(`\n🎉 Done — ${typeCount} injury types + ${articleCount} articles seeded.`)
}

main().catch(console.error)
