/**
 * Seed script — populate Car Accidents category with block-format data.
 * Run: npx tsx seed-category-blocks.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

const run = async () => {
  const payload = await getPayload({ config })

  // ─── Find Car Accidents category ─────────────────────────────────────────────
  let category = await payload.find({
    collection: 'guideCategories',
    where: { slug: { equals: 'car-accidents' } },
    limit: 1,
  }).then(r => r.docs[0])

  if (!category) {
    throw new Error('Car Accidents category not found. Run the main seed first.')
  }

  // eslint-disable-next-line no-console
  console.log(`Found category: ${category.title} (id: ${category.id})`)

  // ─── Block data matching the old hardcoded values ──────────────────────────
  const blocks = [
    // ── Quick Answer Stats ─────────────────────────────────────────────────
    {
      blockType: 'categoryQuickAnswerStats',
      average: '$85,000 – $500,000+',
      successRate: '97%',
      timeline: '2–4 months',
      upfront: '$0 upfront',
    },
    // ── Credibility / Track Record ─────────────────────────────────────────
    {
      blockType: 'categoryCredibility',
      recoveredAmount: '$1.8B+',
      successRate: '97%',
      casesWon: '4,500+',
      avgSettlement: '$185,000',
      recoveryNote: 'Average client receives 5x more than going it alone',
    },
    // ── Why This Matters ──────────────────────────────────────────────────
    {
      blockType: 'categoryWhyImportant',
      intro:
        'Your car accident claim is worth significantly more than the insurance company initially offers. Studies show that victims with legal representation recover settlements that are on average 3–5× higher than those who handle claims alone.',
      points: [
        {
          heading: 'Catastrophic Injuries = Massive Settlements',
          body: 'Your settlement reflects the severity of your injuries—not what the insurance company wants to pay.',
        },
        {
          heading: 'Insurance Companies Count On You Doing Nothing',
          body: "They bet that you won't fight back. Don't prove them right.",
        },
        {
          heading: 'Multiple Defendants = Multiple Pockets',
          body: 'More defendants means more insurance coverage. More ways to get compensated.',
        },
        {
          heading: 'Evidence Is Everything',
          body: 'Medical records, police reports, witness statements—they tell the truth about what happened.',
        },
      ],
    },
    // ── Client Testimonials ────────────────────────────────────────────────
    {
      blockType: 'categoryTestimonials',
      items: [
        {
          name: 'Marcus T.',
          location: 'Houston, TX',
          settlement: '$340,000',
          quote:
            'The insurance company offered me $12,000 the day after my accident. After hiring CasePort-connected attorneys, my settlement was over 28× higher. I had no idea how much my case was really worth.',
        },
        {
          name: 'Sandra R.',
          location: 'Los Angeles, CA',
          settlement: '$185,000',
          quote:
            "I thought I didn't need a lawyer for a rear-end collision. I was wrong. The attorney uncovered the driver's history of accidents and we discovered they were underinsured. Without legal help, I would've gotten nothing.",
        },
        {
          name: 'James W.',
          location: 'Miami, FL',
          settlement: '$510,000',
          quote:
            'A drunk driver hit me on the interstate. My CasePort attorney handled everything — medical bills, lost wages, pain and suffering — while I focused on recovery. The result spoke for itself.',
        },
      ],
    },
    // ── Settlement Breakdown ───────────────────────────────────────────────
    {
      blockType: 'categorySettlementBreakdown',
      items: [
        { injuryType: 'Whiplash / Neck Injury', settlementAmount: '$75,000', minAmount: '$10,000', maxAmount: '$150,000', recoveryTime: '2–6 months' },
        { injuryType: 'Herniated Disc', settlementAmount: '$150,000', minAmount: '$50,000', maxAmount: '$350,000', recoveryTime: '4–12 months' },
        { injuryType: 'Back Injury (Lumbar)', settlementAmount: '$125,000', minAmount: '$30,000', maxAmount: '$300,000', recoveryTime: '3–10 months' },
        { injuryType: 'Broken Bones / Fractures', settlementAmount: '$100,000', minAmount: '$25,000', maxAmount: '$250,000', recoveryTime: '2–8 months' },
        { injuryType: 'Concussion / TBI', settlementAmount: '$200,000', minAmount: '$50,000', maxAmount: '$500,000', recoveryTime: '6–18 months' },
        { injuryType: 'Lacerations / Scarring', settlementAmount: '$60,000', minAmount: '$15,000', maxAmount: '$125,000', recoveryTime: '2–5 months' },
        { injuryType: 'Wrongful Death', settlementAmount: '$1,000,000+', minAmount: '$250,000', maxAmount: 'No limit', recoveryTime: '12–36 months' },
      ],
    },
    // ── Attorney Comparison ───────────────────────────────────────────────
    {
      blockType: 'categoryAttorneyComparison',
      items: [
        {
          label: 'Initial Settlement Offer',
          withoutAttorney: 'Insurance company offers the bare minimum — or nothing at all.',
          withAttorney: 'Attorneys counter with evidence-backed demand letters backed by evidence and state law.',
        },
        {
          label: 'Proving Fault',
          withoutAttorney: 'You navigate complicated liability rules alone.',
          withAttorney: 'Attorneys gather accident reports, CCTV footage, expert witnesses, and reconstruct the scene.',
        },
        {
          label: 'Medical Evidence',
          withoutAttorney: 'You manage your own records and risk missing critical documentation.',
          withAttorney: 'Attorneys work with medical professionals to fully document every injury and future impact.',
        },
        {
          label: 'Statute of Limitations',
          withoutAttorney: 'One missed deadline can destroy your entire case forever.',
          withAttorney: 'Attorneys track every legal deadline so you never lose your right to compensation.',
        },
        {
          label: 'Dealing With Insurance',
          withoutAttorney: 'Insurers use trained adjusters to minimize every claim.',
          withAttorney: 'Your attorney handles all communication and refuses lowball tactics.',
        },
        {
          label: 'Maximum Compensation',
          withoutAttorney: 'Average claimant receives a small fraction of what their case is worth.',
          withAttorney: 'Clients with legal representation recover 3–5× more on average.',
        },
      ],
    },
    // ── Statute of Limitations ───────────────────────────────────────────
    {
      blockType: 'categoryStatuteDeadlines',
      description:
        'Every state sets a deadline — called the statute of limitations — for filing a car accident lawsuit. If you miss it, your claim is permanently barred. The clock starts on the date of the accident in most states.',
      byState: [
        { state: 'California', years: 2 },
        { state: 'Texas', years: 2 },
        { state: 'Florida', years: 4 },
        { state: 'New York', years: 3 },
        { state: 'Illinois', years: 2 },
        { state: 'Pennsylvania', years: 2 },
        { state: 'Ohio', years: 2 },
        { state: 'Georgia', years: 2 },
        { state: 'North Carolina', years: 3 },
        { state: 'Michigan', years: 3 },
      ],
    },
    // ── FAQ ───────────────────────────────────────────────────────────────
    {
      blockType: 'categoryFAQ',
      items: [
        {
          question: 'How much is my car accident claim worth?',
          answer:
            'Every case is different. Factors include the severity of your injuries, medical expenses, lost wages, property damage, and the strength of evidence showing the other driver was at fault. CasePort-connected attorneys offer free case reviews so you understand what your specific claim could be worth — with no obligation.',
        },
        {
          question: "What if the accident was partially my fault?",
          answer:
            'You may still recover compensation. Most states use comparative fault rules, meaning your settlement is reduced by your percentage of fault — but not eliminated unless you were more than 50% responsible. An attorney helps build the strongest possible case to minimize your fault and maximize your recovery.',
        },
        {
          question: 'Do I need a lawyer for a minor car accident?',
          answer:
            'Even minor accidents can result in injuries that appear weeks later — like whiplash or concussions. Insurance companies often come back months later to reconsider claims they\'ve paid. Having an attorney from the start ensures your rights are protected from day one and that any settlement reflects the true value of your injuries.',
        },
        {
          question: 'How long does a car accident claim take?',
          answer:
            'Most car accident claims settle within 2–6 months if liability is clear. Cases involving serious injuries, disputed fault, or multiple defendants can take 12–18 months or longer. Your attorney will give you a realistic timeline based on the specific facts of your case — and will never rush a settlement that undersells your claim.',
        },
        {
          question: 'What does a car accident attorney cost?',
          answer:
            'Most car accident attorneys — including those in the CasePort network — work on a contingency fee basis, meaning you pay nothing upfront and the attorney only gets paid if you win. Their fee is typically a percentage of your settlement (usually 25%–40%), which is clearly outlined before you sign any agreement.',
        },
        {
          question: 'What should I do right after a car accident?',
          answer:
            'First, call 911 and get medical attention — even if you feel fine, some injuries don\'t show symptoms immediately. Then, if possible: take photos of vehicles and the scene, exchange information with the other driver, get witness contact info, and file a police report. Do not admit fault at the scene. Then contact a car accident attorney as soon as possible.',
        },
      ],
    },
    // ── People Also Ask ───────────────────────────────────────────────────
    {
      blockType: 'categoryPeopleAlsoAsk',
      items: [
        {
          question: 'How is pain and suffering calculated in a car accident settlement?',
          answer:
            'Pain and suffering is typically calculated using either the "multiplier method" (multiplying your medical costs by a number between 1.5 and 5 based on injury severity) or the "per diem method" (assigning a daily rate for each day you suffer). Insurance companies use their own formulas, which is why having an attorney ensures you fight for a fair number.',
        },
        {
          question: 'Can I sue the other driver\'s insurance company directly?',
          answer:
            'Yes, you can — and often must — file a claim or lawsuit against the at-fault driver\'s insurance company to recover compensation. If their insurer refuses to pay fairly, your attorney can file suit in civil court. This is different from your own insurance policy, which covers your damages up to your policy limits.',
        },
        {
          question: 'What if the at-fault driver has no insurance?',
          answer:
            'If the driver who caused your accident has no insurance (or too little), you can file a claim through your own uninsured/underinsured motorist (UM/UIM) coverage, if you have it. An attorney can also explore other sources of compensation, such as suing the at-fault driver personally or pursuing other potentially liable parties.',
        },
        {
          question: 'Will my car accident settlement be taxed?',
          answer:
            'In most cases, car accident settlements for physical injuries and emotional distress are not taxable as income under IRS rules. However, portions of your settlement for lost wages or punitive damages may be taxable. Your attorney and a tax professional can help you understand what portions of your settlement may have tax implications.',
        },
        {
          question: 'What if the accident was a hit and run?',
          answer:
            'If you were the victim of a hit and run, you can file a claim through your own uninsured motorist coverage if you have it. If the driver is later identified, you can pursue a claim directly against them. CasePort-connected attorneys can help you navigate these situations and protect your right to compensation even when the at-fault driver cannot be immediately located.',
        },
      ],
    },
  ]

  // ─── Update category with blocks ───────────────────────────────────────────
  const updated = await payload.update({
    collection: 'guideCategories',
    id: category.id,
    data: {
      blocks,
      heroTitle: 'Your Complete Guide to Car Accident Claims',
      heroSubtitle:
        'From the first 72 hours after your accident to the moment you receive your settlement — everything you need to know, written by attorneys who have won millions for clients.',
    },
  })

  // eslint-disable-next-line no-console
  console.log(`Updated category "${updated.title}" with ${blocks.length} blocks.`)
}

run().catch(console.error)