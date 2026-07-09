import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import {
  accidentTypes,
  accidentTypeOrder,
  cityData,
  stateData,
  stateLawFor,
  crashFor,
} from './src/data'
import { reviewer } from './src/lib/accidents-constants'
import { firstHourSteps } from './src/lib/accidents-firstHour'

const CITY_DATA_STATES = ['va','md','dc','ga','ca','tx','ny','fl','il','az']

// ─── Slug map ────────────────────────────────────────────────────────────────

let slugMap: Map<string, string> = new Map()
let slugMapLoaded = false

async function ensureSlugMap(payload: Awaited<ReturnType<typeof getPayload>>) {
  if (slugMapLoaded) return
  const existing = await payload.find({
    collection: 'accidentPages',
    limit: 10000,
    select: { id: true, fullSlug: true },
  })
  for (const doc of existing.docs) {
    if (doc.fullSlug) slugMap.set(doc.fullSlug, doc.id as string)
  }
  slugMapLoaded = true
  console.log(`   Loaded ${slugMap.size} existing slugs`)
}

async function upsertDoc(
  payload: any,
  doc: any,
): Promise<string> {
  await ensureSlugMap(payload)
  const existingId = slugMap.get(doc.fullSlug)
  if (existingId) {
    await payload.update({
      collection: 'accidentPages',
      id: existingId,
      data: doc,
      depth: 0,
      context: { skipVersionConstraint: true },
    })
    return existingId
  } else {
    try {
      const created = await payload.create({
        collection: 'accidentPages',
        data: doc,
        depth: 0,
        context: { skipVersionConstraint: true },
      })
      const id = created.id as string
      slugMap.set(doc.fullSlug, id)
      return id
    } catch (err: any) {
      if (err?.data?.errors?.[0]?.path === 'fullSlug') {
        const existing = await payload.find({
          collection: 'accidentPages',
          where: { fullSlug: { equals: doc.fullSlug } },
          depth: 0,
          limit: 1,
        })
        if (existing.docs[0]?.id) {
          const id = existing.docs[0].id as string
          slugMap.set(doc.fullSlug, id)
          await payload.update({
            collection: 'accidentPages',
            id,
            data: doc,
            depth: 0,
            context: { skipVersionConstraint: true },
          })
          return id
        }
      }
      throw err
    }
  }
}

// ─── Author ─────────────────────────────────────────────────────────────────

let _authorId: string | null = null

async function getAuthorId(payload: any): Promise<string> {
  if (_authorId) return _authorId
  const { docs } = await payload.find({ collection: 'authors', where: { name: { equals: 'Martha Kechicha' } }, depth: 0 })
  if (docs[0]?.id) { _authorId = docs[0].id as string; return _authorId }
  const created = await payload.create({
    collection: 'authors',
    data: { name: 'Martha Kechicha', title: 'Co-Founder & Chief Case Intelligence Officer', credentials: [
      { value: '10+ years', label: 'Law-firm operations' },
      { value: '1,400+', label: 'PI cases managed' },
      { value: 'PhD', label: 'Research credential' },
    ]},
    depth: 0,
  })
  _authorId = created.id as string
  return _authorId
}

function makeExpertBlock(authorId: string | null): any {
  return {
    blockType: 'expert' as const,
    reviewType: 'legal' as const,
    author: authorId,
    sourceText:
      'Every figure on this page is drawn from primary sources — state statutes and case law, NHTSA crash data, and the Insurance Research Council — and re-verified each quarter. CasePort is editorially independent: our guidance is not influenced by any law firm. This is general legal information, not legal advice.',
  }
}

// ─── City Types ─────────────────────────────────────────────────────────────

async function main() {
  console.log('🏙️  Seeding city type pages only...')
  const payload = await getPayload({ config: configPromise })
  const authorId = await getAuthorId(payload)
  console.log(`   Using author ID: ${authorId}`)

  let grandTotal = 0

  for (const cityKey of CITY_DATA_STATES) {
    const t0 = Date.now()
    const cd = cityData[cityKey]
    if (!cd) { console.log(`   ${cityKey}: no cityData, skipping`); continue }

    const s = stateData[cd.abbr]
    if (!s) { console.log(`   ${cityKey}: no stateData for ${cd.abbr}, skipping`); continue }

    let stateTotal = 0

    for (const city of cd.cities) {
      for (const typeKey of accidentTypeOrder) {
        const t = accidentTypes[typeKey]
        if (!t) continue

        const cr = crashFor(cd.abbr)
        const lawTopics = stateLawFor(cd.abbr)
        const typeName = t.category

        const faqs = [
          { question: `How much is a ${typeName.toLowerCase()} claim worth in ${city.name}?`, answerText: t.directAnswer },
          { question: `What negligence rule applies in ${s.name}?`, answerText: `${s.label}: ${s.faultThreshold}` },
          { question: `How long do I have to file after a ${typeName.toLowerCase()} in ${city.name}?`,
            answerText: lawTopics.statute_of_limitations?.direct_answer || `You have ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} from the date of injury to file in ${s.name}.` },
        ]

        const firstHourStepsBlock = firstHourSteps.map((st: any, idx: number) => ({ stepName: st[0], stepDescription: st[1], id: `fhs-${idx}` }))
        const fullSlug = `${cityKey}/${city.slug}/${typeKey}`

        const blocks: any[] = [
          { blockType: 'hero', heroTitle: `${typeName} in ${city.name}, ${s.abbr}`, heroSubtitle: `Local accident data, ${s.name} law, and what to do immediately after an accident in ${city.name}.`, eyebrow: `${typeName} · ${city.name}`, scene: `${city.name}, ${s.abbr}` },
          { blockType: 'keyTakeaways', items: [{ item: 'Controlling law' }, { item: 'Filing deadline' }, { item: 'Fault threshold' }, { item: 'Local accident rate' }] },
          { blockType: 'directAnswer', heading: `${typeName} claims in ${city.name}, ${s.abbr}`,
            lead: `If you were injured in a ${typeName.toLowerCase()} in ${city.name}, ${s.name} law controls your claim: ${s.name} uses the ${s.label.toLowerCase()} rule (${s.faultThreshold}), and you have ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} from the date of injury to file. ${city.name} is a ${city.accidentRate.toLowerCase()}-accident-rate area, so evidence and witnesses move fast.`,
            voiceAnswer: `${s.name} uses the ${s.label.toLowerCase()} rule. You have ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} to file.`,
            speakableCssSelectors: [{ selector: '.cap-lead' }, { selector: '.direct-answer h2' }],
            label: `${city.name} at a glance`,
            head: [{ cell: 'Factor' }, { cell: 'Detail' }],
            rows: [
              { cells: [{ cell: 'City' }, { cell: `${city.name}, ${s.abbr}` }] },
              { cells: [{ cell: 'Population' }, { cell: city.population }] },
              { cells: [{ cell: 'Accident rate' }, { cell: city.accidentRate }] },
              { cells: [{ cell: 'Negligence rule' }, { cell: s.label }] },
              { cells: [{ cell: 'Filing deadline' }, { cell: `${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''}` }] },
              { cells: [{ cell: `Avg ${s.name} settlement` }, { cell: `$${s.avgSettlement}K` }] },
            ],
          },
          { blockType: 'sectionTOC' },
          ...(city.description || (city.keyFacts && city.keyFacts.length > 0)
            ? [{ blockType: 'cityOverview', description: city.description || '', keyFacts: (city.keyFacts || []).map((f: string) => ({ fact: f })) }]
            : []),
          { blockType: 'stateLawBlock', stateName: s.name, cityName: city.name, label: s.label, faultThreshold: s.faultThreshold, statuteYears: s.statuteYears, topicSlug: 'fault-rules', statuteTopicSlug: 'statute-of-limitations' },
          { blockType: 'firstHourSteps', steps: firstHourStepsBlock },
          { blockType: 'reportBlock', stateName: s.name, requestFrom: cr.a, requestHow: cr.h,
            whenToAct: `Reports are typically available 3–10 business days after the crash. Request yours early — and remember your ${s.name} filing deadline is ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} from the date of injury.`,
            note: 'Agencies and online portals change. Confirm the current request method and fee before relying on it. This is general information, not legal advice.', statuteYears: s.statuteYears },
          { blockType: 'actionKit', title: `Your ${city.name} Action Kit — Copy, Paste, Send`,
            intro: `Four scripts that protect your ${city.name} claim in the first days — written for you, ready to send today. Replace the brackets and go.` },
          { blockType: 'cityResources', items: [
              { icon: 'doc', title: `What to Do After an Accident in ${city.name}`, description: 'The exact steps and copy-paste scripts for the first hours.', url: `/accidents/${cityKey}/${city.slug}/what-to-do-after` },
              { icon: 'file', title: `Get Your ${city.name} Crash Report`, description: 'The exact agency, process, and a ready-to-send request.', url: `/accidents/${cityKey}/${city.slug}/police-report` },
              { icon: 'pin', title: `Most Dangerous Roads in ${city.name}`, description: 'Where crashes cluster — local crash data.', url: `/accidents/${cityKey}/${city.slug}/dangerous-roads` },
          ]},
          { blockType: 'faq', title: `Frequently Asked Questions — ${city.name}`, items: faqs,
            aiCitationSummary: `This guide covers ${typeName.toLowerCase()} claims in ${city.name}, ${s.name}. It explains the ${s.label.toLowerCase()} rule, filing deadlines, fault thresholds, and local accident data for ${city.name}.`,
            conversationalQueryVariants: [
              { query: `${typeName.toLowerCase()} settlement ${city.name} ${s.abbr}` },
              { query: `how much is a ${typeName.toLowerCase()} claim worth in ${city.name}` },
              { query: `what is the statute of limitations for ${typeName.toLowerCase()} in ${s.name}` },
            ],
          },
          makeExpertBlock(authorId),
          { blockType: 'sources', citeTitle: `${typeName} in ${city.name}, ${s.abbr} — Local Accident Guide`, citeUrl: `/accidents/${cityKey}/${city.slug}/${typeKey}`,
            sources: [{ name: `${s.name} State Statutes`, url: '' }, { name: 'NHTSA Crash Data', url: '' }, { name: 'Insurance Research Council', url: '' }] },
          { blockType: 'cta', title: `Injured in ${city.name}?`, sub: `Understanding your rights is the first step. Get a free case review to learn what your accident is worth — confidentially, at no cost.`, link: '/checkmycase' },
        ]

        try {
          await upsertDoc(payload, {
            pageType: 'cityType',
            fullSlug,
            title: `${t.category} in ${city.name}, ${cd.abbr}`,
            state: cd.abbr,
            cityKey,
            citySlug: city.slug,
            accidentType: typeKey,
            blocks,
            metaTitle: `${t.category} in ${city.name}, ${cd.abbr} | CasePort`,
            metaDescription: `${t.category} claims in ${city.name}: ${s.name} negligence law (${s.label}), ${s.statuteYears}-year filing deadline, and local accident data.`,
            focusKeyword: `${t.category.toLowerCase()} ${city.name} ${cd.abbr}`,
            publishedDate: new Date().toISOString(),
          })
          stateTotal++
          grandTotal++
          if (stateTotal % 50 === 0) process.stderr.write(`   [${cityKey}] ${stateTotal} pages...\n`)
        } catch (err: any) {
          console.error(`   ERROR ${fullSlug}: ${err.message}`)
        }
      }
    }

    console.log(`   ✅ ${cd.name}: ${stateTotal} city type pages [${((Date.now()-t0)/1000).toFixed(1)}s]`)
  }

  console.log(`\n🎉 Done — ${grandTotal} city type pages seeded.`)
}

main().catch(console.error)
