/**
 * seed-markets.ts
 *
 * Populates the `markets` Payload collection with dummy data sourced from
 * the caseport-market-page reference project.
 *
 * Run: npx tsx seed-markets.ts
 */

import dotenv from 'dotenv'
dotenv.config()

import { getPayload } from 'payload'
import config from './src/payload.config'

// ---------------------------------------------------------------------------
// Static market data shaped for the Payload collection schema
// ---------------------------------------------------------------------------

const marketsData = [
  // ── WEST ──────────────────────────────────────────────────────────────────
  {
    metro: 'Los Angeles',
    slug: 'los-angeles',
    state: 'CA',
    status: 'limited' as const,
    mii: 97,
    partnersActive: 2,
    maxPartners: 3,
    casesAcquiredYearly: 1847,
    population: '13.2M',
    monthlySearchVolume: '74,200',
    responseTime: '24 hours',
    activatedDate: '2023-03-15T00:00:00.000Z',
    avgSettlement: '$185K–$320K',
    avgCaseValue: '$85K–$520K',
    heroHeadline: 'Los Angeles Personal Injury Lead Network',
    heroSubline:
      'The most competitive PI market in the country — with 74,200 monthly searches and only 3 partner slots. One seat remains.',
    testimonial: {
      quote:
        'CasePort transformed our lead flow. We went from 8 cases/month to 28. The quality is unmatched.',
      author: 'Michael Chen — Westside Legal',
    },
    whyThisMarket: [
      {
        title: 'Highest MII in the West',
        desc: 'LA scores 97/100 on our Market Intelligence Index — the highest in the Western region. Demand is consistent year-round.',
      },
      {
        title: 'Only 1 Slot Remaining',
        desc: 'Two of the three partner seats are filled. The firm that claims the last slot locks out all future competition.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'LA leads are reviewed and matched within 24 hours. Speed is critical in this volume market.',
      },
    ],
    faqs: [
      {
        question: 'How many firms compete for LA leads?',
        answer:
          'A maximum of 3 firms. Once all slots are filled, no new partners are accepted for this market.',
      },
      {
        question: 'What case types does CasePort focus on in LA?',
        answer:
          'Personal injury, primarily motor vehicle accidents, rideshare, and pedestrian incidents.',
      },
      {
        question: 'Is there a minimum monthly commitment?',
        answer:
          'No monthly minimum. Your wallet funds deploy only when qualified leads are delivered.',
      },
    ],
  },
  {
    metro: 'San Francisco',
    slug: 'san-francisco',
    state: 'CA',
    status: 'active' as const,
    mii: 88,
    partnersActive: 1,
    maxPartners: 3,
    casesAcquiredYearly: 1203,
    population: '4.7M',
    monthlySearchVolume: '31,400',
    responseTime: '48 hours',
    activatedDate: '2023-06-22T00:00:00.000Z',
    avgSettlement: '$210K–$380K',
    avgCaseValue: '$92K–$480K',
    heroHeadline: 'San Francisco Personal Injury Lead Network',
    heroSubline:
      'High average settlements, 31,400 monthly PI searches, and 2 open slots. A premium Bay Area market with room to grow.',
    testimonial: {
      quote: 'The infrastructure is world-class. No more guessing on lead quality.',
      author: 'Sarah Martinez — Bay Area Advocates',
    },
    whyThisMarket: [
      {
        title: 'Premium Settlement Values',
        desc: 'SF cases average $210K–$380K in settlement — among the highest in California.',
      },
      {
        title: '2 Partner Slots Open',
        desc: 'Only one firm is currently active in SF. Two seats remain for qualifying partners.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '48-Hour Response SLA',
        desc: 'Leads are reviewed and matched within 48 hours of qualification.',
      },
    ],
    faqs: [
      {
        question: 'What is the average case value in San Francisco?',
        answer:
          'Average case values range from $92K to $480K depending on injury severity and liability.',
      },
      {
        question: 'How many open partner slots are available?',
        answer: 'Two slots are currently open in the San Francisco market.',
      },
      {
        question: 'How are leads qualified?',
        answer:
          'Each lead passes a multi-step intake review covering injury, liability, and treatment status before delivery.',
      },
    ],
  },
  {
    metro: 'San Diego',
    slug: 'san-diego',
    state: 'CA',
    status: 'active' as const,
    mii: 82,
    partnersActive: 0,
    maxPartners: 3,
    casesAcquiredYearly: 892,
    population: '3.3M',
    monthlySearchVolume: '22,800',
    responseTime: '48 hours',
    activatedDate: '2023-09-10T00:00:00.000Z',
    avgSettlement: '$155K–$280K',
    avgCaseValue: '$68K–$410K',
    heroHeadline: 'San Diego Personal Injury Lead Network',
    heroSubline:
      'All 3 partner slots available. 22,800 monthly searches, solid MII of 82, and zero competition from other CasePort partners.',
    testimonial: undefined,
    whyThisMarket: [
      {
        title: 'No Current Competition',
        desc: 'No partner has claimed a San Diego slot yet. Be the first firm in this market.',
      },
      {
        title: 'Steady Case Volume',
        desc: 'San Diego generates approximately 892 qualified cases per year across PI categories.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '48-Hour Response SLA',
        desc: 'Leads are reviewed and matched within 48 hours of qualification.',
      },
    ],
    faqs: [
      {
        question: 'Is the San Diego market exclusive to 3 firms?',
        answer: 'Yes. A maximum of 3 firms can be active in San Diego at any time.',
      },
      {
        question: 'What case types are most common in San Diego?',
        answer:
          'Motor vehicle accidents, pedestrian incidents, and rideshare cases are the most frequent.',
      },
      {
        question: 'Can I join the waitlist if slots fill up?',
        answer:
          'Yes. If all slots are taken, you can join the waitlist to be notified when a slot opens.',
      },
    ],
  },
  {
    metro: 'Phoenix',
    slug: 'phoenix',
    state: 'AZ',
    status: 'limited' as const,
    mii: 89,
    partnersActive: 2,
    maxPartners: 3,
    casesAcquiredYearly: 1456,
    population: '4.9M',
    monthlySearchVolume: '38,900',
    responseTime: '24 hours',
    activatedDate: '2023-04-18T00:00:00.000Z',
    avgSettlement: '$145K–$265K',
    avgCaseValue: '$62K–$420K',
    heroHeadline: 'Phoenix Personal Injury Lead Network',
    heroSubline:
      'Second-fastest growing PI market in the Southwest. 38,900 monthly searches and only 1 partner slot left.',
    testimonial: {
      quote:
        "Best decision we made. The 3-firm cap ensures we're never competing with 10 other firms for the same lead.",
      author: 'James Rodriguez — Desert Law Partners',
    },
    whyThisMarket: [
      {
        title: 'Explosive Market Growth',
        desc: 'Phoenix is one of the fastest-growing metro areas in the US. PI case volume is up 22% year-over-year.',
      },
      {
        title: 'Only 1 Slot Remaining',
        desc: 'Two partner seats are filled. One slot remains before this market caps.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'High-velocity market. Leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'How competitive is the Phoenix market?',
        answer:
          'Phoenix has an MII of 89 — very competitive. Only 1 slot remains before the market is capped.',
      },
      {
        question: 'What is the typical response time for leads?',
        answer: 'All Phoenix leads have a 24-hour response SLA from qualification to delivery.',
      },
      {
        question: 'Can I upgrade to a higher volume tier?',
        answer:
          'Yes. Volume tiers are available for partners who want priority access within their market.',
      },
    ],
  },
  {
    metro: 'Las Vegas',
    slug: 'las-vegas',
    state: 'NV',
    status: 'capped' as const,
    mii: 91,
    partnersActive: 3,
    maxPartners: 3,
    waitlistPosition: 47,
    casesAcquiredYearly: 1623,
    population: '2.3M',
    monthlySearchVolume: '28,700',
    responseTime: '24 hours',
    activatedDate: '2022-11-08T00:00:00.000Z',
    avgSettlement: '$175K–$310K',
    avgCaseValue: '$72K–$450K',
    heroHeadline: 'Las Vegas Personal Injury Lead Network',
    heroSubline:
      'Market is fully capped. 47 firms are on the waitlist. Join now to secure your position when a slot opens.',
    testimonial: {
      quote:
        "The system works. We're signing 35+ cases a month. The infrastructure is bulletproof.",
      author: 'David Thompson — Vegas Legal Group',
    },
    whyThisMarket: [
      {
        title: 'Fully Capped — Join the Waitlist',
        desc: 'All 3 partner slots are filled. 47 firms are waiting. Join the waitlist to be first in line.',
      },
      {
        title: 'High Case Volume',
        desc: 'Las Vegas generates 1,623 qualified PI cases per year — exceptional for a metro of its size.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'All leads are reviewed and matched within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'Can I still join if the market is capped?',
        answer:
          'Yes. You can join the waitlist. When a partner slot opens, waitlist firms are contacted in order.',
      },
      {
        question: 'How long is the typical wait?',
        answer:
          'Wait times vary. Slot availability depends on partner contract renewals and market activity.',
      },
      {
        question: 'Is there a cost to join the waitlist?',
        answer: 'No. Joining the waitlist is free and non-binding.',
      },
    ],
  },
  {
    metro: 'Seattle',
    slug: 'seattle',
    state: 'WA',
    status: 'active' as const,
    mii: 79,
    partnersActive: 1,
    maxPartners: 3,
    casesAcquiredYearly: 1134,
    population: '4.0M',
    monthlySearchVolume: '24,100',
    responseTime: '48 hours',
    activatedDate: '2023-07-30T00:00:00.000Z',
    avgSettlement: '$165K–$295K',
    avgCaseValue: '$78K–$390K',
    heroHeadline: 'Seattle Personal Injury Lead Network',
    heroSubline:
      'Two open slots in a growing Pacific Northwest market. 24,100 monthly PI searches with premium case values.',
    testimonial: {
      quote: "The quality of leads is exceptional. We're closing 18% of them.",
      author: 'Emily Zhang — Pacific Northwest Legal',
    },
    whyThisMarket: [
      {
        title: '2 Open Partner Slots',
        desc: 'Only one firm is currently active in Seattle. Two seats remain for qualifying partners.',
      },
      {
        title: 'High Close Rates',
        desc: 'Seattle partners report above-average close rates due to thorough pre-screening.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '48-Hour Response SLA',
        desc: 'Leads are reviewed and matched within 48 hours of qualification.',
      },
    ],
    faqs: [
      {
        question: 'What is the close rate for Seattle leads?',
        answer: 'Partners in Seattle report approximately 18% close rate on delivered leads.',
      },
      {
        question: 'What injury types are most common in Seattle?',
        answer:
          'Motor vehicle accidents are the most common, followed by pedestrian and cyclist incidents.',
      },
      {
        question: 'Are there long-term contracts?',
        answer: 'No long-term contracts. Partners operate on a flexible pre-funded wallet model.',
      },
    ],
  },
  {
    metro: 'Denver',
    slug: 'denver',
    state: 'CO',
    status: 'limited' as const,
    mii: 84,
    partnersActive: 2,
    maxPartners: 3,
    casesAcquiredYearly: 1289,
    population: '2.9M',
    monthlySearchVolume: '26,500',
    responseTime: '24 hours',
    activatedDate: '2023-05-22T00:00:00.000Z',
    avgSettlement: '$155K–$285K',
    avgCaseValue: '$65K–$400K',
    heroHeadline: 'Denver Personal Injury Lead Network',
    heroSubline:
      "One slot left in Colorado's largest PI market. MII of 84, consistent case flow, 24-hour SLA.",
    testimonial: {
      quote: 'We went from 6 cases/month to 22. The infrastructure is incredible.',
      author: 'Robert Williams — Rocky Mountain Legal',
    },
    whyThisMarket: [
      {
        title: 'Only 1 Slot Remaining',
        desc: 'Two of three partner seats are active. One seat remains before Denver caps.',
      },
      {
        title: 'Tech-Driven Market',
        desc: "Denver's growing professional population drives high-value PI cases with strong liability profiles.",
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'Denver leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'How does Denver compare to other Mountain West markets?',
        answer:
          'Denver leads all Mountain West markets with an MII of 84 and 1,289 qualified cases per year.',
      },
      {
        question: 'Is there a setup fee?',
        answer:
          'No setup fee. Fund your wallet and start receiving leads immediately after onboarding.',
      },
      {
        question: 'What happens when Denver caps?',
        answer:
          'No new partners will be accepted once the third slot is filled. Waitlist forms become available.',
      },
    ],
  },

  // ── SOUTH ─────────────────────────────────────────────────────────────────
  {
    metro: 'Houston',
    slug: 'houston',
    state: 'TX',
    status: 'capped' as const,
    mii: 96,
    partnersActive: 3,
    maxPartners: 3,
    waitlistPosition: 62,
    casesAcquiredYearly: 2847,
    population: '7.1M',
    monthlySearchVolume: '62,300',
    responseTime: '24 hours',
    activatedDate: '2022-08-10T00:00:00.000Z',
    avgSettlement: '$195K–$350K',
    avgCaseValue: '$75K–$500K',
    heroHeadline: 'Houston Personal Injury Lead Network',
    heroSubline:
      'Capped. 62 firms on the waitlist. The highest-volume Texas market — join now to secure your place.',
    testimonial: {
      quote: 'Houston is our best market. 47 cases last month alone. The system is flawless.',
      author: 'Patricia Johnson — Houston Legal Group',
    },
    whyThisMarket: [
      {
        title: 'Largest Texas PI Market',
        desc: 'Houston generates 2,847 qualified PI cases per year — more than any other Texas metro.',
      },
      {
        title: 'Market Fully Capped',
        desc: 'All 3 slots are filled. 62 firms are on the waitlist. Join now to hold your position.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'Houston leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'Is Houston accepting new partners?',
        answer:
          'No. The market is fully capped. New firms can join the waitlist to be notified when a slot opens.',
      },
      {
        question: 'How many firms are on the Houston waitlist?',
        answer: '62 firms are currently on the waitlist for the Houston market.',
      },
      {
        question: 'Is there a cost to join the waitlist?',
        answer: 'No. Joining the waitlist is free and non-binding.',
      },
    ],
  },
  {
    metro: 'Dallas–Fort Worth',
    slug: 'dallas-fort-worth',
    state: 'TX',
    status: 'limited' as const,
    mii: 93,
    partnersActive: 2,
    maxPartners: 3,
    casesAcquiredYearly: 2134,
    population: '7.6M',
    monthlySearchVolume: '54,800',
    responseTime: '24 hours',
    activatedDate: '2023-02-14T00:00:00.000Z',
    avgSettlement: '$175K–$320K',
    avgCaseValue: '$70K–$480K',
    heroHeadline: 'Dallas–Fort Worth Personal Injury Lead Network',
    heroSubline:
      'Largest DFW metro in the country by PI volume. 54,800 monthly searches and 1 open partner slot.',
    testimonial: {
      quote: "The DFW market is massive. We're signing 35+ cases/month. Best investment we made.",
      author: 'Kevin Lee — DFW Legal Partners',
    },
    whyThisMarket: [
      {
        title: 'Highest Volume Texas Suburb Market',
        desc: 'DFW combines the volume of two major cities. 2,134 qualified cases yearly with consistent demand.',
      },
      {
        title: 'Only 1 Slot Left',
        desc: '2 of 3 slots are filled. One seat remains before DFW caps permanently.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'Leads are matched and delivered within 24 hours of qualification.',
      },
    ],
    faqs: [
      {
        question: 'Does CasePort cover both Dallas and Fort Worth?',
        answer:
          'Yes. The DFW market covers the entire metro area including both cities and surrounding suburbs.',
      },
      {
        question: 'What is the MII for DFW?',
        answer:
          'DFW scores 93/100 on our Market Intelligence Index — one of the highest in the South.',
      },
      {
        question: 'When will DFW cap?',
        answer: 'DFW will cap when the third partner slot is filled. Only one slot remains.',
      },
    ],
  },
  {
    metro: 'Miami',
    slug: 'miami',
    state: 'FL',
    status: 'capped' as const,
    mii: 95,
    partnersActive: 3,
    maxPartners: 3,
    waitlistPosition: 38,
    casesAcquiredYearly: 2456,
    population: '6.2M',
    monthlySearchVolume: '58,100',
    responseTime: '24 hours',
    activatedDate: '2022-09-18T00:00:00.000Z',
    avgSettlement: '$205K–$380K',
    avgCaseValue: '$80K–$510K',
    heroHeadline: 'Miami Personal Injury Lead Network',
    heroSubline:
      'Capped. 38 firms on the waitlist. Miami is our top-performing Florida market — join the waitlist now.',
    testimonial: {
      quote: 'Miami is our flagship market. 40+ cases/month. The infrastructure is world-class.',
      author: 'Carlos Fernandez — Miami Legal Group',
    },
    whyThisMarket: [
      {
        title: "Florida's #1 PI Market",
        desc: 'Miami leads all Florida metros with 58,100 monthly searches and an MII of 95.',
      },
      {
        title: 'Fully Capped — Join Waitlist',
        desc: 'All 3 partner slots are filled. 38 firms are on the waitlist. Secure your place today.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'All Miami leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'Is Miami open for new partners?',
        answer: 'No. Miami is fully capped. Firms can join the waitlist for future availability.',
      },
      {
        question: 'How many firms are on the Miami waitlist?',
        answer: '38 firms are currently on the waitlist for the Miami market.',
      },
      {
        question: 'What types of cases does Miami produce?',
        answer:
          'Miami specializes in motor vehicle accidents, rideshare incidents, and multi-vehicle collisions.',
      },
    ],
  },
  {
    metro: 'Tampa',
    slug: 'tampa',
    state: 'FL',
    status: 'limited' as const,
    mii: 85,
    partnersActive: 2,
    maxPartners: 3,
    casesAcquiredYearly: 1567,
    population: '3.2M',
    monthlySearchVolume: '29,400',
    responseTime: '24 hours',
    activatedDate: '2023-03-28T00:00:00.000Z',
    avgSettlement: '$155K–$285K',
    avgCaseValue: '$60K–$400K',
    heroHeadline: 'Tampa Personal Injury Lead Network',
    heroSubline:
      'One slot left before Tampa caps. Fast-growing Florida market with 29,400 monthly searches.',
    testimonial: {
      quote: 'Tampa is booming. 24 cases last month. The quality is exceptional.',
      author: 'Jennifer Davis — Tampa Legal Partners',
    },
    whyThisMarket: [
      {
        title: 'Only 1 Slot Left',
        desc: 'Two of three partner seats are taken. One seat remains before Tampa caps.',
      },
      {
        title: 'Fast-Growing Market',
        desc: 'Tampa Bay is among the top 5 fastest-growing metros in the US. PI demand is rising rapidly.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'Tampa leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'What is the MII score for Tampa?',
        answer: 'Tampa scores 85/100 on our Market Intelligence Index.',
      },
      {
        question: 'Will Tampa cap soon?',
        answer:
          'With only 1 slot remaining, Tampa is expected to cap shortly after the final partner is confirmed.',
      },
      {
        question: 'Is there a trial period for new partners?',
        answer:
          'There is no formal trial period, but the pre-funded wallet model means you only spend when leads are delivered.',
      },
    ],
  },
  {
    metro: 'Atlanta',
    slug: 'atlanta',
    state: 'GA',
    status: 'limited' as const,
    mii: 92,
    partnersActive: 2,
    maxPartners: 3,
    casesAcquiredYearly: 1876,
    population: '6.1M',
    monthlySearchVolume: '45,200',
    responseTime: '24 hours',
    activatedDate: '2023-01-30T00:00:00.000Z',
    avgSettlement: '$175K–$315K',
    avgCaseValue: '$68K–$460K',
    heroHeadline: 'Atlanta Personal Injury Lead Network',
    heroSubline:
      "Southeast's most active PI market. 45,200 monthly searches, MII of 92, and 1 open slot remaining.",
    testimonial: {
      quote: 'Atlanta is our second-best market. 32 cases/month. The system is perfect.',
      author: 'Thomas Anderson — Atlanta Legal Group',
    },
    whyThisMarket: [
      {
        title: "Southeast's Largest PI Market",
        desc: 'Atlanta leads the Southeast with 45,200 monthly PI searches and an MII of 92.',
      },
      {
        title: '1 Open Slot',
        desc: 'Two slots are active. One seat remains. Act before Atlanta caps.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'Leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'Does CasePort cover the entire Atlanta metro?',
        answer: 'Yes, including Fulton, DeKalb, Cobb, Gwinnett, and surrounding counties.',
      },
      {
        question: 'What is the average settlement in Atlanta?',
        answer:
          'Average settlements range from $175K to $315K depending on case type and severity.',
      },
      {
        question: 'Are there any exclusivity guarantees?',
        answer: 'Yes. No more than 3 firms operate in any single CasePort market simultaneously.',
      },
    ],
  },
  {
    metro: 'Nashville',
    slug: 'nashville',
    state: 'TN',
    status: 'active' as const,
    mii: 74,
    partnersActive: 1,
    maxPartners: 3,
    casesAcquiredYearly: 756,
    population: '2.0M',
    monthlySearchVolume: '16,200',
    responseTime: '48 hours',
    activatedDate: '2023-09-12T00:00:00.000Z',
    avgSettlement: '$140K–$260K',
    avgCaseValue: '$58K–$380K',
    heroHeadline: 'Nashville Personal Injury Lead Network',
    heroSubline:
      'Two open slots in one of the fastest-growing cities in the South. 16,200 monthly searches and room to grow.',
    testimonial: {
      quote: 'Nashville is solid. 12 leads/month. Great conversion.',
      author: 'Rebecca White — Nashville Legal Group',
    },
    whyThisMarket: [
      {
        title: '2 Open Slots',
        desc: 'One firm is currently active. Two seats remain for qualifying Nashville partners.',
      },
      {
        title: 'High Growth Trajectory',
        desc: "Nashville's population grew 20% in the last decade. PI case volume is following the same curve.",
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '48-Hour Response SLA',
        desc: 'Leads are reviewed and matched within 48 hours of qualification.',
      },
    ],
    faqs: [
      {
        question: 'Is Nashville a good market for smaller firms?',
        answer:
          "Yes. Nashville's volume is ideal for firms scaling intake — enough to grow without being overwhelmed.",
      },
      {
        question: 'What case types are common in Nashville?',
        answer:
          'Motor vehicle accidents are the most common, driven by high interstate traffic through the metro.',
      },
      {
        question: 'How do I get started?',
        answer:
          'Request access through the form. If your firm qualifies, a CasePort representative will reach out within 48 hours.',
      },
    ],
  },

  // ── NORTHEAST ─────────────────────────────────────────────────────────────
  {
    metro: 'New York City',
    slug: 'new-york-city',
    state: 'NY',
    status: 'capped' as const,
    mii: 98,
    partnersActive: 3,
    maxPartners: 3,
    waitlistPosition: 84,
    casesAcquiredYearly: 3456,
    population: '20.1M',
    monthlySearchVolume: '89,400',
    responseTime: '24 hours',
    activatedDate: '2022-05-12T00:00:00.000Z',
    avgSettlement: '$225K–$420K',
    avgCaseValue: '$95K–$600K',
    heroHeadline: 'New York City Personal Injury Lead Network',
    heroSubline:
      'Fully capped. 84 firms on the waitlist. NYC is our highest-volume market in the country — join the waitlist now.',
    testimonial: {
      quote: 'NYC is our flagship. 52 cases/month. The infrastructure changed our business.',
      author: 'Jonathan Harris — NYC Legal Group',
    },
    whyThisMarket: [
      {
        title: 'Highest Volume Market in the US',
        desc: 'New York City generates 3,456 qualified PI cases per year — more than any other CasePort market.',
      },
      {
        title: 'Fully Capped',
        desc: 'All 3 slots are filled. 84 firms are on the waitlist. Join now to hold your position.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'NYC leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'Is NYC open to new partners?',
        answer: 'No. NYC is fully capped. Firms can join the waitlist for future availability.',
      },
      {
        question: 'How long is the typical wait in NYC?',
        answer:
          'Wait times vary. With 84 firms on the waitlist, we recommend joining early to hold your position.',
      },
      {
        question: 'What case types does NYC produce?',
        answer:
          'NYC has a diverse mix: motor vehicle accidents, slip and fall, pedestrian incidents, and transit accidents.',
      },
    ],
  },
  {
    metro: 'Philadelphia',
    slug: 'philadelphia',
    state: 'PA',
    status: 'limited' as const,
    mii: 90,
    partnersActive: 2,
    maxPartners: 3,
    casesAcquiredYearly: 1654,
    population: '6.2M',
    monthlySearchVolume: '42,300',
    responseTime: '24 hours',
    activatedDate: '2023-02-20T00:00:00.000Z',
    avgSettlement: '$165K–$305K',
    avgCaseValue: '$72K–$450K',
    heroHeadline: 'Philadelphia Personal Injury Lead Network',
    heroSubline:
      "One slot remains in the Northeast's third-largest PI market. 42,300 monthly searches and an MII of 90.",
    testimonial: {
      quote: 'Philadelphia is a powerhouse market. 28 cases/month. Incredible system.',
      author: 'Margaret Sullivan — Philadelphia Legal Group',
    },
    whyThisMarket: [
      {
        title: 'Northeast Powerhouse',
        desc: 'Philadelphia ranks third among all Northeast markets with 42,300 monthly PI searches.',
      },
      {
        title: '1 Slot Left',
        desc: 'Two of three partner seats are filled. One seat remains before Philadelphia caps.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'Philadelphia leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'Does CasePort cover South Jersey too?',
        answer:
          'The Philadelphia market covers the greater metro area including South Jersey and Delaware County.',
      },
      {
        question: 'What is the average case value in Philadelphia?',
        answer:
          'Average case values range from $72K to $450K depending on injury severity and jurisdiction.',
      },
      {
        question: 'When will Philadelphia cap?',
        answer:
          'Philadelphia will cap when the third partner slot is filled. Only one slot remains.',
      },
    ],
  },
  {
    metro: 'Boston',
    slug: 'boston',
    state: 'MA',
    status: 'active' as const,
    mii: 87,
    partnersActive: 1,
    maxPartners: 3,
    casesAcquiredYearly: 1423,
    population: '4.9M',
    monthlySearchVolume: '38,700',
    responseTime: '48 hours',
    activatedDate: '2023-04-15T00:00:00.000Z',
    avgSettlement: '$195K–$360K',
    avgCaseValue: '$88K–$520K',
    heroHeadline: 'Boston Personal Injury Lead Network',
    heroSubline:
      "Two open slots in New England's most valuable PI market. Premium settlements averaging $195K–$360K.",
    testimonial: {
      quote: 'Boston market is excellent. 22 leads/month. Top-tier quality.',
      author: 'Christopher Lee — Boston Legal Partners',
    },
    whyThisMarket: [
      {
        title: 'Premium Settlement Market',
        desc: 'Boston PI cases average $195K–$360K in settlement — among the highest in the Northeast.',
      },
      {
        title: '2 Open Slots',
        desc: 'One firm is active. Two seats remain for qualifying Boston partners.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '48-Hour Response SLA',
        desc: 'Leads are reviewed and matched within 48 hours of qualification.',
      },
    ],
    faqs: [
      {
        question: 'Does Boston include Cambridge and Somerville?',
        answer:
          'Yes. The Boston market covers the broader Greater Boston metro including all surrounding municipalities.',
      },
      {
        question: 'What makes Boston settlements higher than average?',
        answer:
          'Massachusetts has strong plaintiff-friendly laws and high medical costs that typically drive up settlement values.',
      },
      {
        question: 'How do I qualify for the Boston market?',
        answer:
          'Submit a partner application. CasePort reviews firm history, capacity, and case volume before approving.',
      },
    ],
  },
  {
    metro: 'Washington, D.C.',
    slug: 'washington-dc',
    state: 'DC',
    status: 'limited' as const,
    mii: 86,
    partnersActive: 2,
    maxPartners: 3,
    casesAcquiredYearly: 1512,
    population: '6.3M',
    monthlySearchVolume: '35,600',
    responseTime: '24 hours',
    activatedDate: '2023-03-10T00:00:00.000Z',
    avgSettlement: '$180K–$340K',
    avgCaseValue: '$80K–$480K',
    heroHeadline: 'Washington D.C. Personal Injury Lead Network',
    heroSubline:
      'One slot remaining in the capital region. 35,600 monthly searches, MII of 86, and premium settlement values.',
    testimonial: {
      quote: 'DC is a premium market. 26 cases/month. The infrastructure is exceptional.',
      author: 'Victoria Chen — DC Legal Group',
    },
    whyThisMarket: [
      {
        title: 'Capital Region Premium',
        desc: 'DC PI cases benefit from Maryland, Virginia, and DC jurisdictions — driving exceptional settlement values.',
      },
      {
        title: '1 Slot Left',
        desc: 'Two of three partner seats are filled. One seat remains before DC caps.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'DC leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'Does the DC market include Maryland and Virginia suburbs?',
        answer:
          'Yes. The DC market covers the full DMV region including Northern Virginia and suburban Maryland.',
      },
      {
        question: 'What is the average settlement in DC?',
        answer:
          'Average settlements range from $180K to $340K depending on injury severity and jurisdiction.',
      },
      {
        question: 'When will DC cap?',
        answer: 'DC will cap when the third partner slot is filled. Only one slot remains.',
      },
    ],
  },

  // ── MIDWEST ───────────────────────────────────────────────────────────────
  {
    metro: 'Chicago',
    slug: 'chicago',
    state: 'IL',
    status: 'capped' as const,
    mii: 99,
    partnersActive: 3,
    maxPartners: 3,
    waitlistPosition: 91,
    casesAcquiredYearly: 3124,
    population: '9.6M',
    monthlySearchVolume: '78,900',
    responseTime: '24 hours',
    activatedDate: '2022-06-15T00:00:00.000Z',
    avgSettlement: '$210K–$390K',
    avgCaseValue: '$85K–$550K',
    heroHeadline: 'Chicago Personal Injury Lead Network',
    heroSubline:
      'Fully capped. 91 firms on the waitlist. Chicago is our highest-rated Midwest market — join the waitlist now.',
    testimonial: {
      quote: 'Chicago is our best market. 58 cases/month. The system is perfect.',
      author: 'James Murphy — Chicago Legal Group',
    },
    whyThisMarket: [
      {
        title: 'Highest MII in the Midwest',
        desc: 'Chicago scores 99/100 on our Market Intelligence Index — the highest rating in the Midwest.',
      },
      {
        title: 'Fully Capped',
        desc: 'All 3 slots are filled. 91 firms are on the waitlist. Join now to hold your position.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'Chicago leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'Is Chicago open to new partners?',
        answer: 'No. Chicago is fully capped. Firms can join the waitlist for future availability.',
      },
      {
        question: 'How many firms are on the Chicago waitlist?',
        answer: '91 firms are currently on the waitlist for the Chicago market.',
      },
      {
        question: 'What is the MII for Chicago?',
        answer: 'Chicago scores 99/100 — the highest in the Midwest.',
      },
    ],
  },
  {
    metro: 'Minneapolis–St. Paul',
    slug: 'minneapolis-st-paul',
    state: 'MN',
    status: 'limited' as const,
    mii: 81,
    partnersActive: 2,
    maxPartners: 3,
    casesAcquiredYearly: 1289,
    population: '3.6M',
    monthlySearchVolume: '28,400',
    responseTime: '24 hours',
    activatedDate: '2023-05-08T00:00:00.000Z',
    avgSettlement: '$155K–$285K',
    avgCaseValue: '$68K–$420K',
    heroHeadline: 'Minneapolis–St. Paul Personal Injury Lead Network',
    heroSubline:
      'One slot remaining in the Twin Cities. 28,400 monthly searches and 1,289 qualified cases per year.',
    testimonial: {
      quote: 'MSP is growing fast. 20 cases/month. Great quality.',
      author: 'Susan Anderson — Twin Cities Legal',
    },
    whyThisMarket: [
      {
        title: 'Only 1 Slot Left',
        desc: 'Two of three partner seats are filled. One seat remains before the Twin Cities market caps.',
      },
      {
        title: 'Underserved Regional Market',
        desc: 'MSP is the largest Midwest market outside Chicago — with far less competition for partner slots.',
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '24-Hour Response SLA',
        desc: 'MSP leads are matched and delivered within 24 hours.',
      },
    ],
    faqs: [
      {
        question: 'Does MSP include St. Paul and suburbs?',
        answer:
          'Yes. The Minneapolis–St. Paul market covers the full Twin Cities metro including all suburbs.',
      },
      {
        question: 'What is the case volume for MSP?',
        answer: 'MSP generates approximately 1,289 qualified PI cases per year.',
      },
      {
        question: 'When will MSP cap?',
        answer: 'MSP will cap when the third partner slot is filled. Only one slot remains.',
      },
    ],
  },
  {
    metro: 'Detroit',
    slug: 'detroit',
    state: 'MI',
    status: 'active' as const,
    mii: 72,
    partnersActive: 1,
    maxPartners: 3,
    casesAcquiredYearly: 834,
    population: '4.3M',
    monthlySearchVolume: '18,600',
    responseTime: '48 hours',
    activatedDate: '2023-08-12T00:00:00.000Z',
    avgSettlement: '$135K–$250K',
    avgCaseValue: '$55K–$360K',
    heroHeadline: 'Detroit Personal Injury Lead Network',
    heroSubline:
      "Two open partner slots in Michigan's largest PI market. 18,600 monthly searches with 2 open slots.",
    testimonial: {
      quote: 'Detroit market is solid. 13 leads/month. Good conversion.',
      author: 'Mark Wilson — Detroit Legal Partners',
    },
    whyThisMarket: [
      {
        title: '2 Open Slots',
        desc: 'One firm is active. Two seats remain for qualifying Detroit partners.',
      },
      {
        title: 'Michigan No-Fault Reform Impact',
        desc: "Michigan's no-fault reform continues to generate complex PI cases. Attorneys with PI expertise are in demand.",
      },
      {
        title: 'Pre-Funded Wallet Model',
        desc: 'Only pay for qualified leads. Funds remain in your wallet until a verified lead is delivered.',
      },
      {
        title: '48-Hour Response SLA',
        desc: 'Detroit leads are reviewed and matched within 48 hours.',
      },
    ],
    faqs: [
      {
        question: "How has Michigan's no-fault reform affected the PI market?",
        answer:
          'The 2019 reform created more complexity and litigation, increasing demand for experienced PI attorneys.',
      },
      {
        question: 'Does Detroit cover metro suburbs like Troy and Dearborn?',
        answer: 'Yes. The Detroit market covers the full Greater Detroit metro area.',
      },
      {
        question: 'What is the close rate for Detroit leads?',
        answer: 'Partners in Detroit report approximately 13% close rate on delivered leads.',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Seed runner
// ---------------------------------------------------------------------------

async function run() {
  const payload = await getPayload({ config })
  console.log('Seeding markets...\n')

  let created = 0
  let skipped = 0

  for (const market of marketsData) {
    // Check if market already exists to avoid duplicates
    const existing = await payload.find({
      collection: 'markets',
      where: { slug: { equals: market.slug } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      console.log(`  ⟳  Skipped (already exists): ${market.metro}`)
      skipped++
      continue
    }

    const { testimonial, whyThisMarket, faqs, ...rest } = market

    await payload.create({
      collection: 'markets',
      data: {
        ...rest,
        ...(testimonial ? { testimonial } : {}),
        whyThisMarket,
        faqs,
      },
    })

    console.log(`  ✓  Created: ${market.metro}`)
    created++
  }

  console.log(`\nDone. Created: ${created}  Skipped: ${skipped}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
