'use client'

import { useState, useEffect } from 'react';
import { ChevronRight, Calendar } from 'lucide-react';
import Link from 'next/link';

interface GuideCategory {
  title: string;
  slug: string;
  description: string;
  subGuides?: Array<{ title: string; slug: string; description: string }>;
}

interface CategoryGuideTestingProps {
  categorySlug?: string;
}

const dummyCategoryData = {
  'truck-accident': {
    heroTitle: "You're Hurt. You're Scared. And You Deserve to Get Paid.",
    heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you didn't cause this. An 80,000-pound truck did. And right now, the insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
    quickAnswer: { average: '$250K', successRate: '92%', timeline: '12-18 months', upfront: '$0' },
    whyImportant: "Here's what separates truck accidents from everything else. When a regular car hits you, it's bad. When an 18-wheeler hits you at highway speed, your body doesn't just get injured—it gets erased. Spinal damage. Crushed limbs. Internal bleeding. Months of recovery. Lost wages. Lost time with your family. Lost normalcy. And the worst part? The trucking company's insurance company has already assigned a team of lawyers whose entire job is to pay you as little as possible.",
    recoveredAmount: '$2.3B+',
    recoveredAmountContext: 'Total Recovered for Clients',
    successRate: '92%',
    successRateContext: 'of cases result in settlement',
    casesWon: '5,000+',
    casesWonContext: 'people paid in full',
    avgSettlement: '$250K',
    avgSettlementContext: 'Your potential recovery',
    testimonials: [
      { name: 'Marcus T.', location: 'Texas', settlement: '$285K', quote: "I was hit by an 18-wheeler on I-35. Couldn't work for 6 months. Thought my life was over. Then I got $285K. My family is taken care of. I can breathe again.", rating: 5 },
      { name: 'David M.', location: 'California', settlement: '$420K', quote: "Spinal injury. The insurance company lowballed me at $80K. I almost took it. Then I got $420K. That's the difference between surviving and thriving.", rating: 5 },
      { name: 'James R.', location: 'Florida', settlement: '$195K', quote: "Broken leg. Couldn't walk for months. Lost my job. Got $195K. Now I'm back on my feet—literally and financially.", rating: 5 }
    ],
    settlementBreakdown: [
      { injuryType: 'Spinal Cord Injury', settlementAmount: '450000', settlementRange: { min: '300000', max: '750000' }, recoveryTime: '12+ months' },
      { injuryType: 'Traumatic Brain Injury', settlementAmount: '350000', settlementRange: { min: '200000', max: '600000' }, recoveryTime: '18+ months' },
      { injuryType: 'Multiple Fractures', settlementAmount: '225000', settlementRange: { min: '150000', max: '400000' }, recoveryTime: '6-9 months' },
      { injuryType: 'Crushed Leg & Fractures', settlementAmount: '275000', settlementRange: { min: '150000', max: '400000' }, recoveryTime: '6 months' },
      { injuryType: 'Broken Ribs & Injuries', settlementAmount: '125000', settlementRange: { min: '75000', max: '200000' }, recoveryTime: '3 months' }
    ],
    faqs: [
      { question: "How much can I get for a truck accident?", answer: "The average truck accident settlement is $250K, but it depends on your injuries, lost wages, and liability. Some cases settle for $50K, others for $1M+." },
      { question: "How long does a truck accident case take?", answer: "Most truck accident cases settle within 12-18 months. Some take longer if they go to trial." },
      { question: "Do I need an attorney for a truck accident?", answer: "Yes. Insurance companies have teams of lawyers. You need someone on your side who knows federal trucking regulations." },
      { question: "What if I was partially at fault?", answer: "Most states allow you to recover even if you're partially at fault." },
      { question: "How much does it cost to hire you?", answer: "We work on contingency. You pay nothing upfront." }
    ],
    statutes: [
      { state: 'California', years: '2' },
      { state: 'Texas', years: '2' },
      { state: 'Florida', years: '4' },
      { state: 'New York', years: '3' }
    ]
  },
  'car-accident': {
    heroTitle: "You Got Hit. The Other Driver Should Pay.",
    heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you didn't cause this accident. The other driver did. And right now, the other driver's insurance company is counting on you not knowing what to do next.",
    quickAnswer: { average: '$95K', successRate: '90%', timeline: '8-12 months', upfront: '$0' },
    whyImportant: "Here's what separates car accident cases from everything else. When another driver hits you, it's not an accident—it's negligence. Drivers have a legal duty to pay attention. They have a duty to obey traffic laws. They have a duty to avoid hitting other cars.",
    recoveredAmount: '$1.8B+',
    recoveredAmountContext: 'Total Recovered for Clients',
    successRate: '90%',
    successRateContext: 'of cases result in settlement',
    casesWon: '4,500+',
    casesWonContext: 'people paid in full',
    avgSettlement: '$95K',
    avgSettlementContext: 'Your potential recovery',
    testimonials: [
      { name: 'Andrew F.', location: 'California', settlement: '$165K', quote: "Hit by another car at a red light. Whiplash and back injury. Couldn't work for months. Got $165K.", rating: 5 },
      { name: 'Stephanie N.', location: 'Texas', settlement: '$125K', quote: "Hit by a car while stopped at a light. Broken arm. Got $125K.", rating: 5 },
      { name: 'Charles B.', location: 'Florida', settlement: '$85K', quote: "Hit by another car. Neck injury. Needed physical therapy. Got $85K.", rating: 5 }
    ],
    settlementBreakdown: [
      { injuryType: 'Spinal Injury', settlementAmount: '180000', settlementRange: { min: '100000', max: '300000' }, recoveryTime: '12+ months' },
      { injuryType: 'Traumatic Brain Injury', settlementAmount: '150000', settlementRange: { min: '80000', max: '250000' }, recoveryTime: '18+ months' },
      { injuryType: 'Multiple Fractures', settlementAmount: '100000', settlementRange: { min: '60000', max: '180000' }, recoveryTime: '6-9 months' },
      { injuryType: 'Whiplash & Back Injury', settlementAmount: '70000', settlementRange: { min: '40000', max: '120000' }, recoveryTime: '3-6 months' },
      { injuryType: 'Minor Injuries', settlementAmount: '40000', settlementRange: { min: '20000', max: '80000' }, recoveryTime: '1-3 months' }
    ],
    faqs: [
      { question: "How much can I get for a car accident?", answer: "The average car accident settlement is $95K, but it depends on your injuries, lost wages, and liability." },
      { question: "How long does a car accident case take?", answer: "Most car accident cases settle within 8-12 months." },
      { question: "Do I need an attorney for a car accident?", answer: "Yes. Insurance companies will deny your claim or lowball you." },
      { question: "What if I was partially at fault?", answer: "Most states allow you to recover even if you were partially at fault." },
      { question: "How much does it cost to hire you?", answer: "We work on contingency. You pay nothing upfront." }
    ],
    statutes: [
      { state: 'California', years: '2' },
      { state: 'Texas', years: '2' },
      { state: 'Florida', years: '4' },
      { state: 'New York', years: '3' }
    ]
  }
};

const heroImages: Record<string, string> = {
  'truck-accident': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/truck-accident-hero-cinematic-BuaBVcavTY6uCvLnKDG3NW.webp',
  'car-accident': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/car-accident-hero-cinematic-5XuBYED4tqcgRTzqoFncRS.webp'
};

const dummyCategory: GuideCategory = {
  title: 'Truck Accident',
  slug: 'truck-accident',
  description: 'Complete guide to truck accident claims',
  subGuides: [
    { title: 'What To Do After a Truck Accident', slug: 'what-to-do', description: 'Step-by-step guide for the first 72 hours after a truck accident' },
    { title: 'Truck Accident Settlements', slug: 'settlements', description: 'Average settlements and factors that affect your case value' },
    { title: 'Filing a Truck Accident Claim', slug: 'filing-claim', description: 'How to file a claim against the trucking company' }
  ]
};

export default function CategoryGuideTesting({ categorySlug = 'truck-accident' }: CategoryGuideTestingProps) {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]));
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (idx: number) => {
    setOpenFAQs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const data = dummyCategoryData[categorySlug as keyof typeof dummyCategoryData] || dummyCategoryData['truck-accident'];
  const heroImage = heroImages[categorySlug as keyof typeof heroImages] || heroImages['truck-accident'];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 px-4 sm:px-7 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "bg-white border-b border-[#e8e2d8] shadow-md" : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-[#1a4a5a] flex items-center justify-center">
            <span className="font-bold text-white text-xs sm:text-lg">CP</span>
          </div>
          <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-[#1a4a5a]">CasePort</span>
        </Link>
        <a href="tel:+18002273669" className="bg-[#c4714a] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md">
          Free Case Review
        </a>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] flex items-end overflow-hidden bg-black">
        <img src={heroImage} alt="Truck accident scene" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>

        <div className="relative z-10 w-full px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-24 lg:pb-32 pt-20 sm:pt-32">
          <div className="max-w-2xl">
            <nav className="mb-6 sm:mb-8">
              <ol className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li className="text-white/50">/</li>
                <li><Link href="/guide/guide-testing" className="hover:text-white transition-colors">Guides</Link></li>
                <li className="text-white/50">/</li>
                <li className="text-white font-medium">{dummyCategory.title}</li>
              </ol>
            </nav>

            <p className="text-[#a8d5e2] text-xs font-semibold mb-2 sm:mb-4 tracking-widest uppercase opacity-90">
              {dummyCategory.title}
            </p>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-sans font-bold mb-3 sm:mb-6 leading-tight text-white">
              {data.heroTitle}
            </h1>

            <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white/85 mb-6 sm:mb-10 leading-relaxed max-w-xl font-light">
              {data.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <a href="tel:+18002273669" className="inline-flex items-center justify-center bg-[#c4714a] text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg min-h-[44px] sm:min-h-[48px] text-center text-xs sm:text-sm">
                Get Your Free Consultation
              </a>
              <a href="#testimonials" className="inline-flex items-center justify-center bg-white/15 text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg font-semibold hover:bg-white/25 transition-all border border-white/30 min-h-[44px] sm:min-h-[48px] backdrop-blur-sm text-xs sm:text-sm">
                See What Others Got Paid
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Answer */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef] border-b border-[#e8e2d8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Average Settlement</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#c4714a]">{data.quickAnswer.average}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Success Rate</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{data.quickAnswer.successRate}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Timeline</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{data.quickAnswer.timeline}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Upfront Cost</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{data.quickAnswer.upfront}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Credibility */}
      <div className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-4">Our Track Record</p>
              <div className="text-6xl sm:text-7xl font-bold text-[#c4714a] mb-2">{data.recoveredAmount}</div>
              <p className="text-sm text-[#666] mb-12">{data.recoveredAmountContext}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">{data.successRateContext}</p>
                <div className="text-4xl sm:text-5xl font-bold text-[#1a4a5a] mb-2">{data.successRate}</div>
                <p className="text-sm text-[#666]">Verified by state bar associations</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">{data.casesWonContext}</p>
                <div className="text-4xl sm:text-5xl font-bold text-[#1a4a5a] mb-2">{data.casesWon}</div>
                <p className="text-sm text-[#666]">Verified by state bar associations</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">{data.avgSettlementContext}</p>
                <div className="text-4xl sm:text-5xl font-bold text-[#c4714a]">{data.avgSettlement}</div>
                <p className="text-sm text-[#666] mt-2">5x more than going it alone</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-8 leading-tight">Why Your Case Is Worth More Than You Think</h2>
          <p className="text-lg text-[#555] leading-relaxed mb-12 font-light">{data.whyImportant}</p>

          <div className="space-y-8">
            <div className="border-l-4 border-[#c4714a] pl-6">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2">Catastrophic Injuries = Massive Settlements</h3>
              <p className="text-[#666] leading-relaxed">Truck accidents don&apos;t cause minor injuries. They cause life-altering trauma. Spinal damage. Crushed limbs. Permanent disability.</p>
            </div>
            <div className="border-l-4 border-[#c4714a] pl-6">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2">Federal Regulations Are Your Weapon</h3>
              <p className="text-[#666] leading-relaxed">Trucking companies are drowning in regulations. Speed limiters. Hours-of-service rules. Maintenance requirements.</p>
            </div>
            <div className="border-l-4 border-[#c4714a] pl-6">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2">Multiple Defendants = Multiple Pockets</h3>
              <p className="text-[#666] leading-relaxed">The driver. The trucking company. The truck manufacturer. Each one has insurance. Each one is liable.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-4 leading-tight">Real People. Real Money. Real Relief.</h2>
          <p className="text-lg text-[#666] mb-16 font-light">These aren&apos;t hypothetical numbers. These are real settlements from real people.</p>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {data.testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white border border-[#e8e2d8] p-8 rounded-lg" style={{ marginTop: idx === 1 ? '2rem' : idx === 2 ? '4rem' : '0' }}>
                <p className="text-[#555] text-base leading-relaxed mb-6 italic font-light">"{testimonial.quote}"</p>
                <div className="border-t border-[#e8e2d8] pt-4">
                  <p className="font-semibold text-[#1a4a5a] mb-1">{testimonial.name}</p>
                  <p className="text-sm text-[#999] mb-3">{testimonial.location}</p>
                  <p className="text-lg font-bold text-[#c4714a]">{testimonial.settlement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settlement Breakdown */}
      <div className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-8 leading-tight">Settlement Breakdown by Injury Type</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-[#c4714a]">
                  <th className="pb-4 font-semibold text-[#1a4a5a]">Injury Type</th>
                  <th className="pb-4 font-semibold text-[#1a4a5a]">Average Settlement</th>
                  <th className="pb-4 font-semibold text-[#1a4a5a]">Range</th>
                  <th className="pb-4 font-semibold text-[#1a4a5a]">Recovery Time</th>
                </tr>
              </thead>
              <tbody>
                {data.settlementBreakdown.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#e8e2d8] hover:bg-white transition-colors">
                    <td className="py-4 font-medium text-[#1a4a5a]">{item.injuryType}</td>
                    <td className="py-4 font-bold text-[#c4714a]">${item.settlementAmount}</td>
                    <td className="py-4 text-[#666]">${item.settlementRange.min} - ${item.settlementRange.max}</td>
                    <td className="py-4 text-[#666]">{item.recoveryTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-12 leading-tight">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {data.faqs.map((faq, idx) => (
              <details key={idx} open className="group border border-[#e8e2d8] rounded-lg bg-white">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors">
                  {faq.question}
                  <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Urgency Section */}
      <div className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a4a5a] to-[#2d6a7a] text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-6 leading-tight">Your Deadline is Real. And It&apos;s Ticking.</h2>
          <p className="text-lg text-white/80 mb-4 leading-relaxed font-light">Statute of Limitations by State:</p>
          <p className="text-2xl font-bold text-[#a8d5e2] mb-12">California: 2 years | Texas: 2 years | Florida: 4 years | New York: 3 years</p>
          <p className="text-lg text-white/80 mb-12 leading-relaxed font-light">You have 2-4 years to file a lawsuit (depending on your state). After that, you lose your right to recover. Forever.</p>

          <a href="tel:+18002273669" className="inline-flex items-center justify-center bg-[#c4714a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg min-h-[48px]">
            Get Your Free Consultation Now
          </a>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-8 leading-tight">You&apos;ve Read This Far. You&apos;re Ready.</h2>
          <p className="text-lg text-[#666] mb-12 leading-relaxed font-light">You know you deserve to get paid. You know an attorney can help. You know the deadline is real.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18002273669" className="inline-flex items-center justify-center bg-[#c4714a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg min-h-[48px]">
              Get Your Free Consultation
            </a>
            <a href="#" className="inline-flex items-center justify-center bg-[#f9f5ef] text-[#1a4a5a] px-8 py-4 rounded-lg font-semibold hover:bg-[#e8e2d8] transition-all border border-[#e8e2d8] min-h-[48px]">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule a Call
            </a>
          </div>
          <p className="text-sm text-[#999] mt-8">Available 24/7. Confidential. No pressure.</p>
        </div>
      </div>

      {/* Guides Section */}
      <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-sans font-bold text-[#1a4a5a] mb-8">Want to Learn More?</h3>

          {dummyCategory.subGuides && dummyCategory.subGuides.slice(0, 3).length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {dummyCategory.subGuides.slice(0, 3).map((guide, idx) => (
                <Link key={idx} href={`/guide/guide-testing/${categorySlug || 'truck-accident'}/${guide.slug}`} className="bg-white p-6 rounded-lg border border-[#e8e2d8] hover:border-[#c4714a] transition-colors block">
                  <h4 className="text-base font-semibold text-[#1a4a5a] mb-2">{guide.title}</h4>
                  <p className="text-[#666] text-sm mb-3 font-light">{guide.description}</p>
                  <div className="flex items-center text-[#c4714a] font-semibold text-sm">
                    Read <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link href="/guide/guide-testing" className="block bg-[#1a4a5a] text-white p-6 rounded-lg hover:bg-[#2d6a7a] transition-colors">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h4 className="font-semibold mb-1">Browse All {dummyCategory.title} Guides</h4>
                <p className="text-sm opacity-80">Explore our complete library</p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#c4714a] flex-shrink-0" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}