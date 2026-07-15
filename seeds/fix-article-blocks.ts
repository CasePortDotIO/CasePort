import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PILLAR_SLUGS = [
  'car-accident', 'truck-accident', 'motorcycle-accident', 'pedestrian-accident',
  'bicycle-accident', 'rideshare-accident', 'slip-and-fall', 'dog-bite',
  'workplace-injury', 'wrongful-death', 'medical-malpractice',
] as const

const SPOKE_SLUGS = ['what-to-do', 'settlement-amounts', 'do-i-need-a-lawyer', 'statute-of-limitations'] as const
const SPOKE_LABELS: Record<string, string> = {
  'what-to-do': 'What To Do After',
  'settlement-amounts': 'Settlement Amounts',
  'do-i-need-a-lawyer': 'Do I Need a Lawyer',
  'statute-of-limitations': 'How Long to File',
}
const PILLAR_NAMES: Record<string, string> = {
  'car-accident': 'Car Accident', 'truck-accident': 'Truck Accident',
  'motorcycle-accident': 'Motorcycle Accident', 'pedestrian-accident': 'Pedestrian Accident',
  'bicycle-accident': 'Bicycle Accident', 'rideshare-accident': 'Rideshare Accident',
  'slip-and-fall': 'Slip and Fall', 'dog-bite': 'Dog Bite',
  'workplace-injury': 'Workplace Injury', 'wrongful-death': 'Wrongful Death',
  'medical-malpractice': 'Medical Malpractice',
}

const EXPERT_DATA: Record<string, { reviewerName: string; credentials: string; quote: string }> = {
  'car-accident': { reviewerName: 'James R. McMerty', credentials: 'Partner, The McMerty Law Firm | 35 Years Personal Injury Experience', quote: 'Car accident claims are won and lost on documentation.' },
  'truck-accident': { reviewerName: 'Sarah K. Martinez', credentials: 'Truck Accident Legal Specialist', quote: 'Every truck accident case has a black box.' },
  'motorcycle-accident': { reviewerName: 'Marcus T. Webb', credentials: 'Motorcycle Injury Attorney', quote: 'Juries come in with bias.' },
  'pedestrian-accident': { reviewerName: 'Diana L. Chen', credentials: 'Pedestrian Safety & Injury Law', quote: 'In 70% of pedestrian cases, surveillance footage tells the whole story.' },
  'bicycle-accident': { reviewerName: 'Robert J. Alton', credentials: 'Cycling Injury Specialist', quote: 'The right hook and dooring are the two most common bicycle accidents.' },
  'rideshare-accident': { reviewerName: 'Priya N. Sharma', credentials: 'Rideshare Litigation Attorney', quote: 'The insurance coverage question is the first fight.' },
  'slip-and-fall': { reviewerName: 'Michael D. Carr', credentials: 'Premises Liability Attorney', quote: 'The cases that killed them were the ones where someone had photographed the hazard.' },
  'dog-bite': { reviewerName: 'Linda K. Foster', credentials: 'Dog Bite & Animal Law Specialist', quote: 'Strict liability means the owner is on the hook.' },
  'workplace-injury': { reviewerName: 'Christopher D. Hayes', credentials: "Workers' Comp + Third-Party Specialist", quote: "The third-party claim is almost always worth more than the workers' comp claim." },
  'wrongful-death': { reviewerName: 'Jennifer M. Cole', credentials: 'Wrongful Death & Catastrophic Injury', quote: 'Wrongful death cases are about replacing what was taken.' },
  'medical-malpractice': { reviewerName: 'Dr. Anthony R. Vega', credentials: 'MD, JD | Former Chief of Surgery', quote: 'Not every bad outcome is malpractice.' },
}

const SOURCES_DATA: Record<string, { citeTitle: string; sources: { name: string; url: string }[] }> = {
  'car-accident': { citeTitle: 'Car Accident Guide', sources: [{ name: 'NHTSA', url: 'https://www.nhtsa.gov/' }, { name: 'III', url: 'https://www.iii.org/' }] },
  'truck-accident': { citeTitle: 'Truck Accident Guide', sources: [{ name: 'FMCSA', url: 'https://www.fmcsa.dot.gov/' }] },
  'motorcycle-accident': { citeTitle: 'Motorcycle Accident Guide', sources: [{ name: 'NHTSA', url: 'https://www.nhtsa.gov/' }] },
  'pedestrian-accident': { citeTitle: 'Pedestrian Accident Guide', sources: [{ name: 'NHTSA', url: 'https://www.nhtsa.gov/' }] },
  'bicycle-accident': { citeTitle: 'Bicycle Accident Guide', sources: [{ name: 'NHTSA', url: 'https://www.nhtsa.gov/' }] },
  'rideshare-accident': { citeTitle: 'Rideshare Accident Guide', sources: [{ name: 'HG.org', url: 'https://www.hg.org/' }] },
  'slip-and-fall': { citeTitle: 'Slip and Fall Guide', sources: [{ name: 'ABA', url: 'https://www.americanbar.org/' }] },
  'dog-bite': { citeTitle: 'Dog Bite Guide', sources: [{ name: 'AVMA', url: 'https://www.avma.org/' }] },
  'workplace-injury': { citeTitle: 'Workplace Injury Guide', sources: [{ name: 'OSHA', url: 'https://www.osha.gov/' }] },
  'wrongful-death': { citeTitle: 'Wrongful Death Guide', sources: [{ name: 'ABA', url: 'https://www.americanbar.org/' }] },
  'medical-malpractice': { citeTitle: 'Medical Malpractice Guide', sources: [{ name: 'AMA', url: 'https://www.ama-assn.org/' }] },
}

const PILLAR_FAQS: Record<string, { q: string; a: string }[]> = {
  'car-accident': [
    { q: 'How is a car accident settlement calculated?', a: 'Settlements use the multiplier method: economic damages are multiplied by 1.5x to 5x depending on injury severity.' },
    { q: 'Why is the first settlement offer always low?', a: 'Insurance companies expect negotiation. First offers are intentionally set 40–60% below final value.' },
    { q: 'How long do I have to file a car accident claim?', a: 'Statutes of limitation vary by state, typically 1 to 6 years. Most states fall in the 2–3 year range.' },
    { q: 'What evidence preserves my car accident claim?', a: 'In the first 72 hours: photograph vehicles and scene, collect witness contacts, request police report, preserve surveillance footage.' },
  ],
  'truck-accident': [
    { q: 'Why are truck accident settlements higher than car accidents?', a: 'Trucks weigh 20–30 times more than cars, causing catastrophic injuries. Truck companies carry higher insurance limits ($1M+).' },
    { q: 'What is Hours of Service (HOS) and why does it matter?', a: 'HOS limits truck drivers to 11 hours of driving per 14-hour work day. Violations are evidence of driver fatigue.' },
    { q: 'How do I preserve black box data after a truck accident?', a: 'Act immediately. Send a preservation letter to the trucking company demanding all electronic data records be preserved.' },
    { q: 'Can I sue the trucking company directly?', a: 'Yes. Trucking companies are vicariously liable for their drivers\' negligence.' },
  ],
  'motorcycle-accident': [
    { q: 'How do I overcome bias against motorcycle riders in a claim?', a: 'Overcoming bias requires objective evidence of the other party\'s liability.' },
    { q: 'Do I need a helmet to have a valid motorcycle accident claim?', a: 'Not wearing a helmet does not bar your recovery in most states.' },
    { q: 'What are the most common causes of motorcycle accidents?', a: 'Drivers failing to yield at intersections, making left turns, opening car doors, and rear-ending motorcycles.' },
    { q: 'What injuries are most common in motorcycle accidents?', a: 'Traumatic brain injury, spinal cord damage, multiple fractures, road rash, and amputation.' },
  ],
  'pedestrian-accident': [
    { q: 'What are vulnerable user standards in pedestrian accidents?', a: 'Vulnerable user standards hold drivers to a heightened duty of care around pedestrians.' },
    { q: 'How is liability determined in pedestrian accidents?', a: 'Drivers have a duty to avoid hitting pedestrians. Liability is often clear.' },
    { q: 'What surveillance footage is available after a pedestrian accident?', a: 'Footage may be available from nearby businesses, traffic cameras, ATMs, doorbell cameras.' },
    { q: 'What should I do immediately after being hit by a car as a pedestrian?', a: 'Seek medical attention first, photograph the scene, collect witness information, preserve surveillance footage.' },
  ],
  'bicycle-accident': [
    { q: 'What is "dooring" in bicycle accidents?', a: 'Dooring occurs when a driver opens a car door into a bike lane without looking, striking an oncoming cyclist.' },
    { q: 'What is a "right hook" bicycle accident?', a: 'A right hook happens when a driver makes a right turn across a cyclist\'s path.' },
    { q: 'Does not wearing a helmet hurt my bicycle accident claim?', a: 'No. Not wearing a helmet does not bar your recovery in most states.' },
    { q: 'How long do I have to file a bicycle accident claim?', a: 'Statutes of limitation vary by state, typically 1 to 6 years from the date of the accident.' },
  ],
  'rideshare-accident': [
    { q: 'Which insurance applies after a rideshare accident?', a: 'If the driver was actively transporting a passenger, the rideshare company\'s $1M+ policy applies.' },
    { q: 'Can I sue the rideshare company directly?', a: 'Yes. Rideshare companies are vicariously liable for their drivers\' negligence.' },
    { q: 'What evidence is critical after a rideshare accident?', a: 'Preserve GPS data and app records immediately — these prove whether the driver was transporting a passenger.' },
    { q: 'How do I prove the rideshare driver was negligent?', a: 'Driver negligence is proven through GPS data, app records, witness testimony, and accident reconstruction.' },
  ],
  'slip-and-fall': [
    { q: 'How do I prove a slip and fall claim?', a: 'Prove the property owner knew or should have known about the unsafe condition and failed to fix it.' },
    { q: 'What are the most common slip and fall hazards?', a: 'Wet floors, ice and snow, uneven surfaces, poor lighting, broken stairs, and debris.' },
    { q: 'Can I sue if I was distracted when I slipped?', a: 'Comparative negligence may reduce your recovery proportionally, but it does not usually bar a claim.' },
    { q: 'How long do I have to file a slip and fall claim?', a: 'Statutes of limitation vary by state, typically 1 to 6 years. Property owners destroy evidence quickly.' },
  ],
  'dog-bite': [
    { q: 'What is strict liability for dog bites?', a: 'Most states apply strict liability, meaning the dog owner is automatically liable for injuries their dog causes.' },
    { q: 'What damages can I recover in a dog bite case?', a: 'Damages include medical expenses, lost wages, pain and suffering, scarring, and psychological trauma.' },
    { q: 'Can I recover if I was partially at fault for the dog bite?', a: 'In most comparative negligence states, your recovery is reduced proportionally.' },
    { q: 'What should I do immediately after being bitten by a dog?', a: 'Seek immediate medical attention, identify the dog and owner, photograph injuries, report to animal control.' },
  ],
  'workplace-injury': [
    { q: "Can I sue my employer for a workplace injury?", a: "Generally no. Workers' comp bars lawsuits against your employer. You can pursue a third-party claim." },
    { q: 'What is a third-party workplace injury claim?', a: 'A third-party claim is a lawsuit against a negligent party who is not your employer.' },
    { q: "How do I protect my workers' comp claim?", a: 'Report the injury to your employer immediately and in writing. Seek medical attention right away.' },
    { q: "What's the difference between workers' comp and a third-party claim?", a: "Workers' comp pays medical bills and partial wages regardless of fault. A third-party claim can recover full damages." },
  ],
  'wrongful-death': [
    { q: 'Who can file a wrongful death claim?', a: 'Typically a spouse, children, or parents of the deceased — specific rules vary by state.' },
    { q: 'How are wrongful death damages calculated?', a: 'Damages include economic losses (lost income, benefits, funeral) and non-economic losses (pain and suffering).' },
    { q: 'Can punitive damages be awarded in wrongful death cases?', a: 'Yes. If the responsible party acted recklessly — such as in drunk driving cases.' },
    { q: 'How long do I have to file a wrongful death claim?', a: 'Statutes of limitation vary by state, typically 1 to 6 years from the date of death.' },
  ],
  'medical-malpractice': [
    { q: "Is a bad outcome the same as medical malpractice?", a: 'No. Malpractice requires that the provider breached the accepted standard of care.' },
    { q: "Do I need an expert to file a medical malpractice case?", a: 'In most states, yes. A certificate of merit from a qualified physician is typically required.' },
    { q: "How long do I have to file a medical malpractice claim?", a: 'Deadlines are short and vary by state — the clock may run from the date of the negligence or discovery.' },
    { q: "What is the difference between medical malpractice and medical negligence?", a: 'All malpractice is negligence, but not all negligence rises to malpractice level.' },
  ],
}

const KEY_FACTS: Record<string, string[]> = {
  'car-accident': ['Car accident settlements are calculated using the multiplier method: economic damages × 1.5x to 5x', 'Insurance adjusters make first offers 40–60% below final value to test your knowledge', 'Contributory negligence states (VA, MD, DC) bar 100% of recovery if you are found any % at fault', 'Surveillance footage is overwritten within 72 hours — preserve it immediately', 'Medical documentation is the primary driver of settlement value'],
  'truck-accident': ['Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars', 'Federal trucking regulations (HOS, maintenance) create additional liability exposure', 'Truck companies carry higher insurance limits ($1M+)', 'Black box data from trucks provides objective evidence', 'Trucking companies often carry multiple insurance policies'],
  'motorcycle-accident': ['Motorcycle accidents result in severe injuries at rates 28 times higher than car accidents', 'Insurance companies and juries apply bias against motorcycle riders', 'Overcoming bias requires clear evidence of the other party\'s liability', 'Motorcycle riders have limited protection, resulting in catastrophic injuries', 'Comprehensive medical documentation is critical to overcome bias'],
  'pedestrian-accident': ['Pedestrians have no protection from vehicle impact, resulting in severe injuries', 'Many jurisdictions apply vulnerable user standards to pedestrians', 'Drivers have a duty to avoid hitting pedestrians', 'Pedestrian accident liability is often clear', 'Surveillance footage from nearby businesses is often available'],
  'bicycle-accident': ['Most bike collisions are caused by drivers failing to yield, "dooring," or right-hook turns', 'Vulnerable-road-user laws hold drivers to a heightened duty of care around cyclists', 'Not wearing a helmet does not bar recovery in most states', 'Head and spinal injuries make bicycle claims high-value', 'Surveillance and traffic-camera footage is critical'],
  'rideshare-accident': ['Rideshare accidents involve complex liability because multiple parties may be responsible', 'Rideshare companies carry insurance that covers accidents during rides', 'Rideshare companies often dispute coverage and liability', 'The rideshare driver may be personally liable', 'Early legal action is critical to preserve evidence'],
  'slip-and-fall': ['Slip and fall claims are premises liability cases', 'Property owners must maintain safe conditions and warn visitors of known hazards', 'Proving premises liability requires showing the property owner knew or should have known', 'Property owners often dispute liability', 'Early evidence preservation (photographs, witness statements) is critical'],
  'dog-bite': ['Most states apply strict liability for dog bites', 'Dog bite injuries often require multiple surgeries and result in permanent scarring', 'Psychological trauma is a valid claim in dog bite cases', 'Dog owners have a duty to control their dogs', 'Early medical documentation is critical'],
  'workplace-injury': ["Workers' comp pays medical bills and partial wages regardless of fault", 'A third-party claim against a non-employer can recover full damages', 'Common third parties: equipment makers, subcontractors, property owners', "You can usually pursue workers' comp and a third-party claim at the same time", "Workers' comp deadlines are short — report the injury immediately"],
  'wrongful-death': ['Wrongful death claims allow family members to recover damages when a loved one dies due to negligence', 'Damages include lost income, funeral expenses, and pain and suffering', "The deceased's age and earning potential are primary factors in settlement value", 'Wrongful death claims are emotionally complex but legally straightforward', 'Early legal action is critical to preserve evidence'],
  'medical-malpractice': ["Malpractice requires a breach of the accepted standard of care", "Most states require an expert physician affidavit to file", "Many states cap non-economic damages in malpractice specifically", "Statutes of limitations are short and often run from discovery", "Common types: misdiagnosis, surgical error, medication error, birth injury"],
}

function buildBlocks(pillarSlug: string, spokeSlug: string) {
  const pillarName = PILLAR_NAMES[pillarSlug]
  const spokeLabel = SPOKE_LABELS[spokeSlug]
  const faqs = PILLAR_FAQS[pillarSlug] || []
  const keyFacts = KEY_FACTS[pillarSlug] || []
  const expert = EXPERT_DATA[pillarSlug]
  const sources = SOURCES_DATA[pillarSlug]

  const blocks: any[] = []

  // 1. articleDirectAnswer
  blocks.push({
    blockType: 'articleDirectAnswer',
    heading: `${spokeLabel} a ${pillarName}`,
    text: spokeSlug === 'what-to-do'
      ? `The first 72 hours after a ${pillarName.toLowerCase()} are the most critical for protecting your health and your claim.`
      : `Understanding ${pillarName.toLowerCase()} claims is essential for protecting your rights and maximizing your recovery.`,
  })

  // 2. articleKeyTakeaways
  blocks.push({
    blockType: 'articleKeyTakeaways',
    items: keyFacts.map(fact => ({ fact })),
  })

  // 3. Spoke-specific content block
  if (spokeSlug === 'what-to-do') {
    blocks.push({
      blockType: 'articleTimelineSteps',
      heading: `${pillarName} — Step by Step`,
      steps: [
        { stepName: '1. Ensure Safety and Seek Medical Attention', stepDescription: 'Move to safety if possible. Call 911. Seek immediate medical attention even if you feel fine — some injuries don\'t appear immediately.' },
        { stepName: '2. Document the Scene', stepDescription: 'Photograph vehicles, the scene, injuries, skid marks, and debris. Exchange information with all parties. Get contact info from witnesses.' },
        { stepName: '3. Report the Accident', stepDescription: 'File a police report. Contact your insurance company. Do not give recorded statements to the other driver\'s insurer.' },
        { stepName: '4. Preserve Evidence', stepDescription: 'Request surveillance footage from nearby businesses within 72 hours before it\'s overwritten. Keep a daily log of your injuries and treatment.' },
      ],
    })
  } else if (spokeSlug === 'settlement-amounts') {
    blocks.push({
      blockType: 'articleSettlementTable',
      heading: `Estimated ${pillarName} Settlement Ranges`,
      rows: [
        { severity: 'Minor Injury', description: 'Soft tissue, quick recovery', range: '$15K–$50K' },
        { severity: 'Moderate Injury', description: 'Fractures, ongoing treatment', range: '$50K–$100K' },
        { severity: 'Serious Injury', description: 'Permanent disability, chronic pain', range: '$100K–$250K' },
        { severity: 'Catastrophic Injury', description: 'TBI, spinal cord, amputation', range: '$250K+' },
      ],
      footnote: 'Settlement ranges are illustrative estimates. Your actual settlement depends on specific facts, state negligence rules, and evidence quality.',
    })
  } else if (spokeSlug === 'do-i-need-a-lawyer') {
    blocks.push({
      blockType: 'articleProseContent',
      sections: [
        { heading: 'When a Lawyer Is Strongly Recommended', body: 'For serious injuries, complex liability situations, or cases involving large insurance policies, a personal injury lawyer is strongly recommended. Insurance companies have teams of adjusters and lawyers working to minimize your claim.' },
        { heading: 'When You May Handle a Claim Yourself', body: 'For minor injuries with clear liability, minimal medical treatment, and small insurance policies, you may be able to handle a claim yourself. However, even these cases benefit from a free case review to understand your rights.' },
      ],
    })
  } else if (spokeSlug === 'statute-of-limitations') {
    blocks.push({
      blockType: 'articleStatuteBars',
      heading: `Statute of Limitations for ${pillarName} Claims`,
      bars: [
        { deadline: '2 Years', states: 'Most states (Texas, Florida, New York)', widthPercent: 65 },
        { deadline: '3 Years', states: 'California, Georgia, Louisiana, Montana', widthPercent: 20 },
        { deadline: '1 Year', states: 'Special circumstances (VA, MD, DC)', widthPercent: 15 },
      ],
      footnote: `Statutes of limitation vary by state. Consult a ${pillarName.toLowerCase()} attorney to confirm your exact deadline.`,
    })
  }

  // 4. articleFAQ
  blocks.push({
    blockType: 'articleFAQ',
    items: faqs.map(f => ({ question: f.q, answerText: f.a })),
  })

  // 5. articleSources
  if (sources) {
    blocks.push({
      blockType: 'articleSources',
      citeTitle: sources.citeTitle,
      sources: sources.sources,
    })
  }

  // 6. articleExpert
  if (expert) {
    blocks.push({
      blockType: 'articleExpert',
      quote: expert.quote,
      reviewerName: expert.reviewerName,
      credentials: expert.credentials,
    })
  }

  // 7. articleCTA
  blocks.push({
    blockType: 'articleCTA',
    title: 'Get a Free Case Review',
    subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.',
    buttonLabel: 'Check My Case',
    buttonLink: '/checkmycase',
  })

  // 8. articleRelatedGuides (same pillar spokes)
  const otherSpokes = SPOKE_SLUGS.filter(s => s !== spokeSlug).map(s => `${pillarSlug}-${s}`)
  // We'll add article IDs after we have them

  return blocks
}

async function run() {
  const payload = await getPayload({ config })

  // Get author ID
  const authorResult = await payload.find({ collection: 'authors', limit: 1 })
  const authorId = authorResult.docs[0]?.id
  if (!authorId) { console.error('No author found'); return }
  console.log(`Author: ${authorResult.docs[0].name} (ID: ${authorId})`)

  // Get article IDs for related guides
  const articleIdMap: Record<string, number> = {}
  for (const pillarSlug of PILLAR_SLUGS) {
    for (const spokeSlug of SPOKE_SLUGS) {
      const slug = `${pillarSlug}-${spokeSlug}`
      const r = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
      if (r.docs[0]) articleIdMap[slug] = r.docs[0].id
    }
  }
  console.log(`Found ${Object.keys(articleIdMap).length} articles`)

  let count = 0
  for (const pillarSlug of PILLAR_SLUGS) {
    for (const spokeSlug of SPOKE_SLUGS) {
      const slug = `${pillarSlug}-${spokeSlug}`
      const articleId = articleIdMap[slug]
      if (!articleId) { console.warn(`Missing article: ${slug}`); continue }

      let blocks = buildBlocks(pillarSlug, spokeSlug)

      // Add related guides block
      const otherSpokeSlugs = SPOKE_SLUGS.filter(s => s !== spokeSlug).map(s => `${pillarSlug}-${s}`)
      const relatedIds = otherSpokeSlugs.map(s => articleIdMap[s]).filter(Boolean)
      blocks.push({ blockType: 'articleRelatedGuides', articles: relatedIds })

      await payload.update({
        collection: 'guideArticles',
        id: articleId,
        data: { blocks, _isSeeding: true },
      })

      count++
      console.log(`✅ ${slug}: ${blocks.length} blocks (${relatedIds.length} related)`)
    }
  }

  console.log(`\nDone! Updated ${count} articles.`)
}

run().catch(e => { console.error(e.message); process.exit(1) })
