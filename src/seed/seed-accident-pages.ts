import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import {
  accidentTypes,
  accidentTypeOrder,
  cityData,
  stateData,
  stateLawFor,
  stateLawTopics,
  crashFor,
  quickAnswers,
  quickAnswerOrder,
  type City,
} from './src/data'
import { reviewer } from './src/lib/accidents-constants'
import { severityTable } from './src/lib/accidents-accident'
import { firstHourSteps } from './src/lib/accidents-firstHour'

// ─── All 51 states + DC ──────────────────────────────────────────────────────
const ALL_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
  'NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT',
  'VT','VA','WA','WV','WI','WY',
]

// States that have city data in cityData
const CITY_DATA_STATES = ['va','md','dc','ga','ca','tx','ny','fl','il','az']

// ─── Payload helpers ────────────────────────────────────────────────────────

let slugMap: Map<string, string> = new Map()
let slugMapLoaded = false

async function ensureSlugMap(payload: Awaited<ReturnType<typeof getPayload>>) {
  if (slugMapLoaded) return
  const existing = await payload.find({
    collection: 'accidentPages',
    limit: 10000,
    depth: 0,
    select: { id: true, fullSlug: true },
  })
  for (const doc of existing.docs) {
    if (doc.fullSlug) slugMap.set(doc.fullSlug, doc.id as string)
  }
  slugMapLoaded = true
  console.log(`   Loaded ${slugMap.size} existing slugs`)
}

async function upsertDoc(
  payload: Awaited<ReturnType<typeof getPayload>>,
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
      // Duplicate key — doc was created by a previous run that got killed.
      // Re-fetch its ID and update instead.
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

// Cached author ID
let _authorId: string | null = null

async function getAuthorId(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<string> {
  if (_authorId) return _authorId
  const { docs } = await payload.find({
    collection: 'authors',
    where: { name: { equals: 'Martha Kechicha' } },
    depth: 0,
  })
  if (docs[0]?.id) {
    _authorId = docs[0].id as string
    return _authorId
  }
  const created = await payload.create({
    collection: 'authors',
    data: {
      name: 'Martha Kechicha',
      title: 'Co-Founder & Chief Case Intelligence Officer',
      credentials: [
        { value: '10+ years', label: 'Law-firm operations' },
        { value: '1,400+', label: 'PI cases managed' },
        { value: 'PhD', label: 'Research credential' },
      ],
    },
    depth: 0,
  })
  _authorId = created.id as string
  return _authorId
}

// ─── Block factories ─────────────────────────────────────────────────────────

function makeExpertBlock(authorId: string | null): any {
  return {
    blockType: 'expert' as const,
    reviewType: 'legal' as const,
    author: authorId,
    sourceText:
      'Every figure on this page is drawn from primary sources — state statutes and case law, NHTSA crash data, and the Insurance Research Council — and re-verified each quarter. CasePort is editorially independent: our guidance is not influenced by any law firm. This is general legal information, not legal advice.',
  }
}

// ─── Accident Type seed ──────────────────────────────────────────────────────

async function seedAccidentTypes(
  payload: Awaited<ReturnType<typeof getPayload>>,
  authorId: string | null,
): Promise<Map<string, string>> {
  const typeIds = new Map<string, string>()
  let count = 0

  for (const typeKey of accidentTypeOrder) {
    const t = accidentTypes[typeKey]
    if (!t) continue

    const faqs = [
      {
        question: `How much is a ${t.category.toLowerCase()} claim worth?`,
        answerText: t.directAnswer,
      },
      ...t.sections.map((s: any) => ({
        question: s.title,
        answerText: s.content[0],
      })),
    ]

    const blocks = [
      {
        blockType: 'hero',
        heroTitle: t.title.split(':')[0].trim(),
        heroSubtitle: t.subtitle,
        eyebrow: t.category,
        scene: t.scene,
        reviewerName: reviewer.name,
      },
      {
        blockType: 'directAnswer',
        heading: `How ${t.category.toLowerCase()} claims work — and what yours may be worth`,
        lead: t.directAnswer,
        voiceAnswer: t.directAnswer.split('.')[0] + '.',
        speakableCssSelectors: [
          { selector: '.cap-lead' },
          { selector: '.direct-answer h2' },
        ],
        label: 'Typical settlement range by injury severity',
        head: [
          { cell: 'Injury severity' },
          { cell: 'What it looks like' },
          { cell: 'Illustrative range' },
        ],
        rows: severityTable(t).rows.map((row) => ({
          cells: row.map((cell) => ({ cell })),
        })),
      },
      {
        blockType: 'statTiles',
        items: (t.stats || []).map((s: any) => ({ label: s.label, value: s.value })),
      },
      {
        blockType: 'keyTakeaways',
        items: t.keyFacts.slice(0, 4).map((f: string) => ({ item: f })),
      },
      {
        blockType: 'proseSections',
        sections: t.sections.map((s: any) => ({
          title: s.title,
          content: s.content.join('\n\n'),
        })),
      },
      {
        blockType: 'faq',
        items: faqs,
        aiCitationSummary: `This guide covers ${t.category.toLowerCase()} settlements, liability rules, and the filing process. Key factors include injury severity, state negligence law, and insurance policy limits.`,
        conversationalQueryVariants: [
          { query: `how much is a ${t.category.toLowerCase()} settlement` },
          { query: `${t.category.toLowerCase()} claim value calculator` },
          { query: `how to win a ${t.category.toLowerCase()} case` },
        ],
      },
      // exploreMore populated after all type IDs are known — see below
      {
        blockType: 'sources',
        sources: (t as any).sources || [],
      },
      makeExpertBlock(authorId),
      { blockType: 'cta', link: '/checkmycase' },
    ]

    const id = await upsertDoc(payload, {
      pageType: 'accidentType',
      fullSlug: typeKey,
      title: t.title,
      accidentType: typeKey,
      blocks,
      metaTitle: `${t.title} | CasePort`,
      metaDescription: t.directAnswer.slice(0, 160),
      focusKeyword: `${t.category.toLowerCase()} settlement claim`,
      publishedDate: new Date().toISOString(),
    })
    typeIds.set(typeKey, id)
    count++
  }

  console.log(`✅ Seeded ${count} accident type pages`)

  // Second pass: populate exploreMore hasMany with all type IDs
  const allTypeIds = Array.from(typeIds.values())
  for (const [typeKey, id] of typeIds) {
    const t = accidentTypes[typeKey]
    if (!t) continue
    const otherIds = allTypeIds.filter((tid) => tid !== id)
    // Replace the exploreMore block with hasMany IDs
    const blocks = [
      {
        blockType: 'hero',
        heroTitle: t.title.split(':')[0].trim(),
        heroSubtitle: t.subtitle,
        eyebrow: t.category,
        scene: t.scene,
        reviewerName: reviewer.name,
      },
      {
        blockType: 'directAnswer',
        heading: `How ${t.category.toLowerCase()} claims work — and what yours may be worth`,
        lead: t.directAnswer,
        voiceAnswer: t.directAnswer.split('.')[0] + '.',
        speakableCssSelectors: [
          { selector: '.cap-lead' },
          { selector: '.direct-answer h2' },
        ],
        label: 'Typical settlement range by injury severity',
        head: [
          { cell: 'Injury severity' },
          { cell: 'What it looks like' },
          { cell: 'Illustrative range' },
        ],
        rows: severityTable(t).rows.map((row) => ({
          cells: row.map((cell) => ({ cell })),
        })),
      },
      {
        blockType: 'statTiles',
        items: (t.stats || []).map((s: any) => ({ label: s.label, value: s.value })),
      },
      {
        blockType: 'keyTakeaways',
        items: t.keyFacts.slice(0, 4).map((f: string) => ({ item: f })),
      },
      {
        blockType: 'proseSections',
        sections: t.sections.map((s: any) => ({
          title: s.title,
          content: s.content.join('\n\n'),
        })),
      },
      {
        blockType: 'faq',
        items: [
          {
            question: `How much is a ${t.category.toLowerCase()} claim worth?`,
            answerText: t.directAnswer,
          },
          ...t.sections.map((s: any) => ({
            question: s.title,
            answerText: s.content[0],
          })),
        ],
        aiCitationSummary: `This guide covers ${t.category.toLowerCase()} settlements, liability rules, and the filing process. Key factors include injury severity, state negligence law, and insurance policy limits.`,
        conversationalQueryVariants: [
          { query: `how much is a ${t.category.toLowerCase()} settlement` },
          { query: `${t.category.toLowerCase()} claim value calculator` },
          { query: `how to win a ${t.category.toLowerCase()} case` },
        ],
      },
      { blockType: 'exploreMore', category: t.category, pages: otherIds },
      {
        blockType: 'sources',
        sources: (t as any).sources || [],
      },
      makeExpertBlock(authorId),
      { blockType: 'cta', link: '/checkmycase' },
    ]
    await payload.update({
      collection: 'accidentPages',
      id,
      data: { blocks },
      depth: 0,
      context: { skipVersionConstraint: true },
    })
  }

  return typeIds
}

// ─── Quick Answer seed ───────────────────────────────────────────────────────

async function seedQuickAnswers(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<void> {
  let count = 0
  for (const qaKey of quickAnswerOrder) {
    const qa = quickAnswers[qaKey]
    if (!qa) continue

    const blocks = [
      {
        blockType: 'hero',
        heroTitle: qa.title,
        eyebrow: qa.eyebrow,
      },
      {
        blockType: 'quickAnswerStats',
        average: '~$50K',
        successRate: 'High',
        timeline: '2–3 years',
        upfront: '$0 upfront',
      },
      {
        blockType: 'keyTakeaways',
        items: (qa.keyFacts || []).map((f: string) => ({ item: f })),
      },
      {
        blockType: 'directAnswer',
        lead: qa.directAnswer,
      },
      {
        blockType: 'proseSections',
        sections: qa.sections.map((s: any) => ({
          title: s.title,
          content: s.content,
        })),
      },
      {
        blockType: 'qaVisual',
        kind: (qa as any).visual || 'statute',
      },
      {
        blockType: 'faq',
        items: [
          { question: qa.question, answerText: qa.directAnswer, slug: 'car-accident' },
          ...qa.sections.slice(0, 4).map((s: any, i: number) => {
            const otherQAs = quickAnswerOrder.filter((id) => id !== qaKey)
            const linkedSlug = otherQAs[i % otherQAs.length] || ''
            return { question: s.title, answerText: s.content, slug: linkedSlug }
          }),
        ],
      },
      { blockType: 'exploreMore', category: qa.eyebrow },
      {
        blockType: 'sources',
        sources: (qa.sources || []).map((s: string) => ({ name: s, url: '' })),
      },
      { blockType: 'cta' },
    ]

    await upsertDoc(payload, {
      pageType: 'quickAnswer',
      fullSlug: qaKey,
      title: qa.title,
      quickAnswerSlug: qaKey,
      blocks,
      metaTitle: `${qa.title} | CasePort`.slice(0, 80),
      metaDescription: qa.directAnswer.slice(0, 160),
      focusKeyword: qa.title.toLowerCase(),
      publishedDate: new Date().toISOString(),
    })
    count++
  }
  console.log(`✅ Seeded ${count} quick answer pages`)
}

// ─── State seed (ALL 51 + DC) ────────────────────────────────────────────────

async function seedStates(
  payload: Awaited<ReturnType<typeof getPayload>>,
  authorId: string | null,
): Promise<void> {
  let count = 0
  for (const stateKey of ALL_STATES) {
    const s = stateData[stateKey]
    if (!s) {
      console.warn(`   ⚠️ No stateData for ${stateKey}, skipping`)
      continue
    }

    const lawTopics = stateLawFor(stateKey)
    const cd = cityData[stateKey.toLowerCase()]

    const topics = stateLawTopics.map((tp) => ({
      slug: tp.slug,
      label: tp.label,
      tags: tp.tags.join(','),
    }))

    const cities = cd
      ? cd.cities.map((c: any) => ({
          name: c.name,
          slug: c.slug,
          accidentRate: c.accidentRate,
        }))
      : []

    const blocks = [
      {
        blockType: 'topSection',
        eyebrow: `State Law · ${stateKey}`,
        heroTitle: `Accident Law in ${s.name}`,
        heroSubtitle: `${s.name} applies ${s.label}. Here is the negligence rule, filing deadline, damage caps, and local data that determine your recovery.`,
      },
      {
        blockType: 'localizedStats',
        items: [
          { label: 'Filing Deadline', value: `${s.statuteYears} yr` },
          { label: 'Fault Threshold', value: s.faultThreshold.split('—')[0].trim() },
          { label: 'Avg Settlement', value: `$${s.avgSettlement}K` },
          { label: 'Top Cause', value: s.topCause },
        ],
      },
      {
        blockType: 'keyTakeaways',
        items: [
          { item: 'Negligence rule' },
          { item: 'Filing deadline' },
          { item: 'Fault threshold' },
          { item: 'Damage cap' },
        ],
      },
      {
        blockType: 'directAnswer',
        heading: `Accident law in ${s.name}, in one place`,
        lead: `In ${s.name}, the ${s.label.toLowerCase()} rule governs every accident claim: ${s.faultThreshold}. You have ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} from the date of injury to file.`,
        label: `${s.name} vs. the national average`,
        head: [
          { cell: 'Metric' },
          { cell: s.name },
          { cell: 'National avg' },
        ],
        rows: [
          {
            cells: [
              { cell: 'Average settlement' },
              { cell: `$${s.avgSettlement}K` },
              { cell: '$52K' },
            ],
          },
          {
            cells: [
              { cell: 'Median jury verdict' },
              { cell: `$${s.medianJuryVerdict}K` },
              { cell: '$31K' },
            ],
          },
          {
            cells: [
              { cell: 'Statute of limitations' },
              { cell: `${s.statuteYears} yr` },
              { cell: '2–3 yr' },
            ],
          },
          {
            cells: [
              { cell: 'Uninsured-motorist rate' },
              { cell: `${s.uninsuredRate}%` },
              { cell: '13%' },
            ],
          },
          {
            cells: [
              { cell: 'Fatal crash rate (per 100K)' },
              { cell: `${s.fatalCrashRate}` },
              { cell: '13.1' },
            ],
          },
        ],
      },
      { blockType: 'sectionTOC' },
      {
        blockType: 'stateTopicsGrid',
        topics,
      },
      ...(cities.length > 0
        ? [{ blockType: 'citiesGrid', cities }]
        : []),
      {
        blockType: 'stateFaqBlock',
        title: `Frequently Asked Questions — ${s.name}`,
        faqs: [
          {
            question: `What is the statute of limitations in ${s.name}?`,
            answer:
              lawTopics.statute_of_limitations?.direct_answer ||
              `You have ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} from the date of injury to file in ${s.name}.`,
          },
          {
            question: `What negligence rule does ${s.name} use?`,
            answer:
              lawTopics.fault_rules?.direct_answer ||
              `${s.name} uses the ${s.label.toLowerCase()} rule: ${s.faultThreshold}`,
          },
          {
            question: `Is there a cap on damages in ${s.name}?`,
            answer:
              lawTopics.damage_caps?.direct_answer ||
              s.damageCap,
          },
          {
            question: `Do I need a lawyer in ${s.name}?`,
            answer:
              lawTopics.do_i_need_a_lawyer?.direct_answer ||
              'Legal representation significantly improves outcomes. Contact CasePort for a free review.',
          },
        ],
      },
      {
        blockType: 'stateComparison',
        initialA: stateKey,
      },
      {
        blockType: 'reportBlock',
        stateName: s.name,
        requestFrom: crashFor(stateKey).a,
        requestHow: crashFor(stateKey).h,
        whenToAct: `Reports are typically available 3–10 business days after the crash. Request yours early — and remember your ${s.name} filing deadline is ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} from the date of injury.`,
        note: 'Agencies and online portals change. Confirm the current request method and fee before relying on it. This is general information, not legal advice.',
      },
      {
        blockType: 'actionKit',
        title: `Your ${s.name} Action Kit — Copy, Paste, Send`,
        intro: 'Four scripts that protect your claim in the first days — written for you, ready to use. Most accident victims never get these in time. You can send them today.',
        scripts: [
          {
            id: 'preserve',
            icon: 'camera',
            title: 'Evidence Preservation Letter',
            why: 'Send this within 24 hours to any nearby business, parking garage, or property that may have caught the crash on camera. Most systems overwrite footage in 72 hours.',
            to: 'Send to: the business owner or manager (walk in or email)',
            subject: 'URGENT: Preserve Video Footage — Incident on [DATE]',
            body: 'To Whom It May Concern,\n\nOn [DATE] at approximately [TIME], a motor-vehicle accident occurred at or near [ADDRESS / INTERSECTION], which may have been recorded by your security or surveillance cameras.\n\nI am formally requesting that you preserve — and not delete, overwrite, or destroy — any and all video footage from [DATE] between [TIME RANGE, e.g. 2:00 PM and 3:00 PM]. This footage is material evidence in a personal-injury matter.\n\nPlease confirm in writing that the footage has been preserved, and let me know the process to obtain a copy. Many systems automatically overwrite within 72 hours, so your prompt action is critical.\n\nYou can reach me at [YOUR PHONE] or [YOUR EMAIL].\n\nThank you for your prompt attention.\n\n[YOUR FULL NAME]',
          },
          {
            id: 'report',
            icon: 'file',
            title: 'Crash / Police Report Request',
            why: 'Use this to obtain the official crash report — the single most important document in your claim. Send it to the records division of the agency that responded.',
            to: "Send to: the responding agency's Records Division (see your state's source below)",
            subject: 'Request for Crash Report — Incident on [DATE]',
            body: 'Dear Records Division,\n\nI am requesting a certified copy of the crash/police report for a motor-vehicle accident with the following details:\n\n• Date of accident: [DATE]\n• Location: [ADDRESS / INTERSECTION / HIGHWAY + MILE MARKER]\n• Report or incident number (if known): [NUMBER]\n• Parties involved: [YOUR NAME] and [OTHER DRIVER, if known]\n\nI am a party to this accident. Please advise the fee, accepted payment methods, and how the report will be delivered.\n\nMy contact information: [YOUR NAME], [ADDRESS], [PHONE], [EMAIL].\n\nThank you,\n[YOUR FULL NAME]',
          },
          {
            id: 'insurer',
            icon: 'shield',
            title: 'Insurance "No Recorded Statement" Script',
            why: "Read or email this verbatim when the other driver's adjuster calls. You are not required to give a recorded statement or sign a blanket medical release — both are used to reduce your claim.",
            to: "Say to: the other driver's insurance adjuster",
            subject: 'Re: Claim #[CLAIM NUMBER] — Communication Preference',
            body: "Thank you for reaching out. I am not providing a recorded statement at this time, and I do not consent to a blanket medical-records authorization.\n\nI am still under medical care and cannot evaluate any settlement until my treatment is complete. Please direct all further communication regarding this claim to me in writing at [YOUR EMAIL].\n\nI will authorize only the records directly related to injuries from this accident, for the relevant treatment dates.\n\nThank you.",
          },
          {
            id: 'records',
            icon: 'steth',
            title: 'Medical Records Request',
            why: 'Your medical records are the backbone of your claim value. Request the complete file — notes, imaging, and itemized billing — early.',
            to: "Send to: your treating provider's medical-records department",
            subject: 'Medical Records Request — [YOUR NAME], DOB [DOB]',
            body: "To the Medical Records Department,\n\nI am requesting a complete copy of my medical records for treatment on and after [ACCIDENT DATE], including:\n\n• Physician and nursing notes\n• Imaging (X-ray, CT, MRI) and radiology reports\n• Test and lab results\n• An itemized billing statement\n\nPatient: [YOUR FULL NAME]\nDate of birth: [DOB]\nDates of service: [START] to [PRESENT]\n\nPlease send the records to [YOUR ADDRESS / EMAIL], or advise your release process and any fee.\n\nThank you,\n[YOUR FULL NAME]",
          },
        ],
      },
      makeExpertBlock(authorId),
      {
        blockType: 'sources',
        citeTitle: `Accident Law in ${s.name}`,
        citeUrl: `/${stateKey.toLowerCase()}`,
        sources: [
          { name: `${s.name} State Statutes`, url: '' },
          { name: 'NHTSA Data', url: '' },
          { name: 'Insurance Records', url: '' },
        ],
      },
      { blockType: 'cta', link: '/checkmycase' },
    ]

    await upsertDoc(payload, {
      pageType: 'state',
      fullSlug: stateKey.toLowerCase(),
      title: `Accident Law in ${s.name}`,
      state: stateKey,
      blocks,
      metaTitle: `Accident Law in ${s.name} | CasePort`,
      metaDescription: `${s.name} applies ${s.label}. Filing deadline ${s.statuteYears} years. Average settlement $${s.avgSettlement}K. ${s.topCause} is the top cause.`.slice(
        0,
        160,
      ),
      focusKeyword: `personal injury lawyer ${s.name}`,
      publishedDate: new Date().toISOString(),
    })
    count++
  }
  console.log(`✅ Seeded ${count} state pages (all 51 + DC)`)
}

// ─── State Topic seed (ALL 51 × 5 topics) ────────────────────────────────────

async function seedStateTopics(
  payload: Awaited<ReturnType<typeof getPayload>>,
  authorId: string | null,
): Promise<void> {
  let count = 0
  for (const stateKey of ALL_STATES) {
    const s = stateLawFor(stateKey)
    if (!s) {
      console.warn(`   ⚠️ No stateLaw for ${stateKey}, skipping topics`)
      continue
    }

    for (const tp of stateLawTopics) {
      const c = s[tp.key]
      if (!c) continue

      const blocks = [
        {
          blockType: 'hero',
          heroTitle: c.title,
          heroSubtitle: c.subtitle,
          eyebrow: `${stateKey} · ${c.title}`,
        },
        {
          blockType: 'directAnswer',
          lead: c.direct_answer,
          speakableCssSelectors: [
            { selector: '.cap-lead' },
            { selector: '.direct-answer h2' },
          ],
        },
        ...(c.sections && c.sections.length > 0
          ? [
              {
                blockType: 'proseSections',
                sections: c.sections.map((sec: any) => ({
                  title: sec.title,
                  content: sec.content,
                })),
              },
            ]
          : []),
        {
          blockType: 'faq',
          title: `Frequently Asked Questions About ${stateKey} Accident Law`,
          items: [
            { question: c.title, answerText: c.direct_answer },
            ...(c.sections || [])
              .slice(0, 4)
              .map((sec: any) => ({
                question: sec.title,
                answerText: sec.content,
              })),
          ],
          aiCitationSummary: c.direct_answer
            ? c.direct_answer.slice(0, 200)
            : undefined,
        },
        {
          blockType: 'sources',
          citeTitle: c.title,
          citeUrl: `${stateKey.toLowerCase()}/${tp.slug}`,
          sources: [
            { name: `${stateKey} State Statutes`, url: '' },
            { name: 'Legal Precedent', url: '' },
            { name: 'State Bar Association', url: '' },
          ],
        },
        makeExpertBlock(authorId),
        { blockType: 'cta', link: '/checkmycase' },
      ]

      await upsertDoc(payload, {
        pageType: 'stateTopic',
        fullSlug: `${stateKey.toLowerCase()}/${tp.slug}`,
        title: c.title,
        state: stateKey,
        stateTopic: tp.slug,
        blocks,
        metaTitle: `${c.title} | CasePort`,
        metaDescription: c.direct_answer?.slice(0, 160) || c.subtitle?.slice(0, 160),
        focusKeyword: `${tp.label.toLowerCase()} ${stateKey.toLowerCase()}`,
        publishedDate: new Date().toISOString(),
      })
      count++
    }
  }
  console.log(`✅ Seeded ${count} state topic pages (${ALL_STATES.length} states × ${stateLawTopics.length} topics)`)
}

// ─── City Type seed (10 city-data states × all accident types) ───────────────

async function seedCityTypes(
  payload: Awaited<ReturnType<typeof getPayload>>,
  authorId: string | null,
): Promise<void> {
  console.log('🏙️  Starting city type seed...')
  let totalCount = 0
  let cityCount = 0

  for (const cityKey of CITY_DATA_STATES) {
    const t0 = Date.now()
    const cd = cityData[cityKey]
    if (!cd) continue

    const s = stateData[cd.abbr]
    if (!s) continue

    cityCount = 0
    // First pass: create all city type pages, collect their IDs
    const cityTypeIds = new Map<string, string>() // typeKey → docId

    for (const city of cd.cities) {
      // Skip cities with no description/keyFacts (e.g. DC has no cities array)
      if (!city.description && (!city.keyFacts || city.keyFacts.length === 0)) {
        // Still try to create pages if we have basic city data
      }

      for (const typeKey of accidentTypeOrder) {
        const t = accidentTypes[typeKey]
        if (!t) continue

        const cr = crashFor(cd.abbr)
        const lawTopics = stateLawFor(cd.abbr)
        const typeName = t.category

        const faqs = [
          {
            question: `How much is a ${typeName.toLowerCase()} claim worth in ${city.name}?`,
            answerText: t.directAnswer,
          },
          {
            question: `What negligence rule applies in ${s.name}?`,
            answerText: `${s.label}: ${s.faultThreshold}`,
          },
          {
            question: `How long do I have to file after a ${typeName.toLowerCase()} in ${city.name}?`,
            answerText:
              lawTopics.statute_of_limitations?.direct_answer ||
              `You have ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} from the date of injury to file in ${s.name}.`,
          },
        ]

        const firstHourStepsBlock = firstHourSteps.map((st, idx) => ({
          stepName: st[0],
          stepDescription: st[1],
          id: `fhs-${idx}`,
        }))

        const fullSlug = `${cityKey}/${city.slug}/${typeKey}`

        const blocks = [
          // 1. Hero
          {
            blockType: 'hero',
            heroTitle: `${typeName} in ${city.name}, ${s.abbr}`,
            heroSubtitle: `Local accident data, ${s.name} law, and what to do immediately after an accident in ${city.name}.`,
            eyebrow: `${typeName} · ${city.name}`,
            scene: `${city.name}, ${s.abbr}`,
          },
          // 2. Key Takeaways
          {
            blockType: 'keyTakeaways',
            items: [
              { item: 'Controlling law' },
              { item: 'Filing deadline' },
              { item: 'Fault threshold' },
              { item: 'Local accident rate' },
            ],
          },
          // 3. Direct Answer / Capsule
          {
            blockType: 'directAnswer',
            heading: `${typeName} claims in ${city.name}, ${s.abbr}`,
            lead: `If you were injured in a ${typeName.toLowerCase()} in ${city.name}, ${s.name} law controls your claim: ${s.name} uses the ${s.label.toLowerCase()} rule (${s.faultThreshold}), and you have ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} from the date of injury to file. ${city.name} is a ${city.accidentRate.toLowerCase()}-accident-rate area, so evidence and witnesses move fast — the first 72 hours matter most.`,
            voiceAnswer: `${s.name} uses the ${s.label.toLowerCase()} rule. You have ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} to file.`,
            speakableCssSelectors: [
              { selector: '.cap-lead' },
              { selector: '.direct-answer h2' },
            ],
            label: `${city.name} at a glance`,
            head: [{ cell: 'Factor' }, { cell: 'Detail' }],
            rows: [
              { cells: [{ cell: 'City' }, { cell: `${city.name}, ${s.abbr}` }] },
              { cells: [{ cell: 'Population' }, { cell: city.population }] },
              { cells: [{ cell: 'Accident rate' }, { cell: city.accidentRate }] },
              { cells: [{ cell: 'Negligence rule' }, { cell: s.label }] },
              {
                cells: [
                  { cell: 'Filing deadline' },
                  { cell: `${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''}` },
                ],
              },
              {
                cells: [
                  { cell: `Avg ${s.name} settlement` },
                  { cell: `$${s.avgSettlement}K` },
                ],
              },
            ],
          },
          // 4. Section TOC
          { blockType: 'sectionTOC' },
          // 5. City Overview (only if city has description or keyFacts)
          ...(city.description || (city.keyFacts && city.keyFacts.length > 0)
            ? [
                {
                  blockType: 'cityOverview',
                  description: city.description || '',
                  keyFacts: (city.keyFacts || []).map((f: string) => ({
                    fact: f,
                  })),
                },
              ]
            : []),
          // 6. State Law Block
          {
            blockType: 'stateLawBlock',
            stateName: s.name,
            cityName: city.name,
            label: s.label,
            faultThreshold: s.faultThreshold,
            statuteYears: s.statuteYears,
            topicSlug: 'fault-rules',
            statuteTopicSlug: 'statute-of-limitations',
          },
          // 7. First Hour Steps
          {
            blockType: 'firstHourSteps',
            steps: firstHourStepsBlock,
          },
          // 8. Report Block
          {
            blockType: 'reportBlock',
            stateName: s.name,
            requestFrom: cr.a,
            requestHow: cr.h,
            whenToAct: `Reports are typically available 3–10 business days after the crash. Request yours early — and remember your ${s.name} filing deadline is ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} from the date of injury.`,
            note: 'Agencies and online portals change. Confirm the current request method and fee before relying on it. This is general information, not legal advice.',
            statuteYears: s.statuteYears,
          },
          // 9. Action Kit
          {
            blockType: 'actionKit',
            title: `Your ${city.name} Action Kit — Copy, Paste, Send`,
            intro: `Four scripts that protect your ${city.name} claim in the first days — written for you, ready to send today. Replace the brackets and go.`,
          },
          // 10. City Resources
          {
            blockType: 'cityResources',
            items: [
              {
                icon: 'doc',
                title: `What to Do After an Accident in ${city.name}`,
                description:
                  'The exact steps and copy-paste scripts for the first hours.',
                url: `/accidents/${cityKey}/${city.slug}/what-to-do-after`,
              },
              {
                icon: 'file',
                title: `Get Your ${city.name} Crash Report`,
                description: 'The exact agency, process, and a ready-to-send request.',
                url: `/accidents/${cityKey}/${city.slug}/police-report`,
              },
              {
                icon: 'pin',
                title: `Most Dangerous Roads in ${city.name}`,
                description: 'Where crashes cluster — local crash data.',
                url: `/accidents/${cityKey}/${city.slug}/dangerous-roads`,
              },
            ],
          },
          // 11. FAQ
          {
            blockType: 'faq',
            title: `Frequently Asked Questions — ${city.name}`,
            items: faqs,
            aiCitationSummary: `This guide covers ${typeName.toLowerCase()} claims in ${city.name}, ${s.name}. It explains the ${s.label.toLowerCase()} rule, filing deadlines, fault thresholds, and local accident data for ${city.name}.`,
            conversationalQueryVariants: [
              {
                query: `${typeName.toLowerCase()} settlement ${city.name} ${s.abbr}`,
              },
              {
                query: `how much is a ${typeName.toLowerCase()} claim worth in ${city.name}`,
              },
              {
                query: `what is the statute of limitations for ${typeName.toLowerCase()} in ${s.name}`,
              },
            ],
          },
          // 12. Expert
          makeExpertBlock(authorId),
          // 13. Sources
          {
            blockType: 'sources',
            citeTitle: `${typeName} in ${city.name}, ${s.abbr} — Local Accident Guide`,
            citeUrl: `/accidents/${cityKey}/${city.slug}/${typeKey}`,
            sources: [
              { name: `${s.name} State Statutes`, url: '' },
              { name: 'NHTSA Crash Data', url: '' },
              { name: 'Insurance Research Council', url: '' },
            ],
          },
          // 14. CTA
          {
            blockType: 'cta',
            title: `Injured in ${city.name}?`,
            sub: `Understanding your rights is the first step. Get a free case review to learn what your accident is worth — confidentially, at no cost.`,
            link: '/checkmycase',
          },
        ]

        try {
          const id = await upsertDoc(payload, {
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
          cityTypeIds.set(typeKey, id)
          totalCount++
          cityCount++
          if (cityCount % 50 === 0) process.stderr.write(`   ...${cityCount} city type pages seeded\n`)
        } catch (err: any) {
          console.error(`   ERROR on ${fullSlug}: ${err.message}`)
        }
      }
    }

    console.log(
      `   ${cd.name}: ${cityTypeIds.size} city type pages → ${cd.cities.length} cities × ${accidentTypeOrder.length} types [${((Date.now()-t0)/1000).toFixed(1)}s]`,
    )
  }

  console.log(`✅ Seeded ${totalCount} city type pages`)
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Seeding accidentPages (comprehensive — all 51 states + all cities)...')
  const payload = await getPayload({ config: configPromise })

  const authorId = await getAuthorId(payload)
  console.log(`   Using author ID: ${authorId}`)

  // Seed in dependency order: types → quick answers → states → state topics
  // (city types are handled by seed-city-types-only.ts — run separately)
  const typeIds = await seedAccidentTypes(payload, authorId)
  await seedQuickAnswers(payload)
  await seedStates(payload, authorId)
  console.time('seedStateTopics')
  await seedStateTopics(payload, authorId)
  console.timeEnd('seedStateTopics')

  console.log('🎉 Done — accident types, quick answers, states, and state topics seeded.')
}

main().catch(console.error)
