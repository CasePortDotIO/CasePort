'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react'

interface CategoryGuideClientProps {
  category: any
  articles: any[]
  headerNav?: any
  footerNav?: any
}

export default function CategoryGuideClient({ category, articles }: CategoryGuideClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]))
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categorySlug = typeof category === 'object' ? category.slug : category
  const categoryTitle = typeof category === 'object' ? category.title : category

  const categoryData = articles[0] || {}
  const testimonials = category.testimonials || categoryData.testimonials || []
  const settlementData = category.settlementData || categoryData.settlementData || {}
  const quickAnswer = {
    average: settlementData.average || settlementData.avgSettlement || '$95K',
    successRate: settlementData.successRate || '90%',
    timeline: settlementData.timeline || '12-18 months',
    upfront: '$0'
  }

  const getHeroImage = (slug: string): string => {
    const heroImages: Record<string, string> = {
      'truck-accident': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/truck-accident-hero-cinematic-BuaBVcavTY6uCvLnKDG3NW.webp',
      'slip-and-fall': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/slip-fall-hero-cinematic-EhGT9QEfjB7Q7hisW7bL7U.webp',
      'medical-malpractice': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/medical-malpractice-hero-cinematic-3A3GTJRVmT2hGZooye3LHr.webp',
      'workplace-injury': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/workplace-injury-hero-cinematic-JP3hFtfn295MMbWXYoQS8F.webp',
      'pedestrian-accident': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/pedestrian-accident-hero-cinematic-GjC5fqyYhn5RbSKGwXaMqY.webp',
      'dog-bite': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/dog-bite-hero-cinematic-QBByqPayzL3T3HfvZKxmDH.webp',
      'wrongful-death': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/wrongful-death-hero-cinematic-9YVsp64mfN5BFDsq9hHRKH.webp',
      'rideshare-accident': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/rideshare-accident-hero-cinematic-P7zRxKycUvstyVeH8qx3Qg.webp',
      'insurance-claims': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/insurance-claims-hero-cinematic-M48wXi39TR9DspEkJH5KKR.webp',
      'car-accident': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/car-accident-hero-cinematic-5XuBYED4tqcgRTzqoFncRS.webp'
    }
    return heroImages[slug] || heroImages['car-accident']
  }

  const heroTitle = category.heroTitle || `Your Guide to ${categoryTitle} Claims`
  const heroSubtitle = category.heroSubtitle || category.description || `Learn about ${categoryTitle.toLowerCase()} settlements, legal rights, and how to get fair compensation.`
  const whyImportant = category.whyImportant || "Understanding your rights and the factors that affect your settlement is critical to getting the compensation you deserve."
  const recoveredAmount = settlementData.totalRecovered || '$1.8B+'
  const successRate = settlementData.successRate || '90%'
  const casesWon = settlementData.casesWon || '4,500+'
  const avgSettlement = settlementData.avgSettlement || settlementData.average || '$95K'

  const faqItems = category.faqSection || articles[0]?.faqSection || []

  const defaultTestimonials = [
    { name: 'Andrew F.', location: 'California', settlement: '$165K', injuryType: 'Whiplash & back injury', quote: "Hit by another car at a red light. Whiplash and back injury. Couldn't work for months. Got $165K." },
    { name: 'Stephanie N.', location: 'Texas', settlement: '$125K', injuryType: 'Broken arm', quote: "Hit by a car while stopped at a light. Got $125K." },
    { name: 'Charles B.', location: 'Florida', settlement: '$85K', injuryType: 'Neck injury', quote: "Hit by another car. Neck injury. Got $85K." }
  ]

  const settlementBreakdown = settlementData.rangesByInjury || [
    { injuryType: 'Spinal Injury', settlementAmount: '180000', settlementRange: { min: '100000', max: '300000' }, recoveryTime: '12+ months' },
    { injuryType: 'Traumatic Brain Injury', settlementAmount: '150000', settlementRange: { min: '80000', max: '250000' }, recoveryTime: '18+ months' },
    { injuryType: 'Multiple Fractures', settlementAmount: '100000', settlementRange: { min: '60000', max: '180000' }, recoveryTime: '6-9 months' },
    { injuryType: 'Whiplash & Back Injury', settlementAmount: '70000', settlementRange: { min: '40000', max: '120000' }, recoveryTime: '3-6 months' },
    { injuryType: 'Minor Injuries', settlementAmount: '40000', settlementRange: { min: '20000', max: '80000' }, recoveryTime: '1-3 months' }
  ]

  const statutes = category.statuteOfLimitations?.byState || [
    { state: 'California', years: '2' },
    { state: 'Texas', years: '2' },
    { state: 'Florida', years: '4' },
    { state: 'New York', years: '3' }
  ]

  const toggleFAQ = (idx: number) => {
    setOpenFAQs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(idx)) {
        newSet.delete(idx)
      } else {
        newSet.add(idx)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 px-4 sm:px-7 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-white border-b border-[#e8e2d8] shadow-md"
            : "bg-transparent"
        }`}
        style={{
          opacity: isScrolled ? 1 : 0,
          pointerEvents: isScrolled ? 'auto' : 'none'
        }}
      >
        <Link href="/" className="flex items-center gap-1 sm:gap-2">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-[#1a4a5a] flex items-center justify-center">
              <span className="font-bold text-white text-xs sm:text-lg">CP</span>
            </div>
            <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-[#1a4a5a]">CasePort</span>
          </Link>
        <a
          href="tel:+18002273669"
          className="bg-[#c4714a] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md"
        >
          Free Case Review
        </a>
      </nav>

      {/* Hero Section - Cinematic Full-Bleed with Breadcrumb Inside */}
      <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] flex items-end overflow-hidden bg-black">
        <img
          src={getHeroImage(categorySlug)}
          alt={`${categoryTitle} scene`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>

        <div className="relative z-10 w-full px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-24 lg:pb-32 pt-20 sm:pt-32">
          <div className="max-w-2xl">
            <nav className="mb-6 sm:mb-8" aria-label="breadcrumb">
              <ol className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li className="text-white/50"><ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" /></li>
                <li><Link href="/guide" className="hover:text-white transition-colors">Guides</Link></li>
                <li className="text-white/50"><ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" /></li>
                <li className="text-white font-medium">{categoryTitle}</li>
              </ol>
            </nav>

            <p className="text-[#a8d5e2] text-xs font-semibold mb-2 sm:mb-4 tracking-widest uppercase opacity-90">
              {categoryTitle}
            </p>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-sans font-bold mb-3 sm:mb-6 leading-tight text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)', letterSpacing: '-0.02em' }}>
              {heroTitle}
            </h1>

            <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white/85 mb-6 sm:mb-10 leading-relaxed max-w-xl font-light"
               style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <a
                href="tel:+18002273669"
                className="inline-flex items-center justify-center bg-[#c4714a] text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg hover:shadow-xl min-h-[44px] sm:min-h-[48px] text-center text-xs sm:text-sm md:text-base"
              >
                Get Your Free Consultation
              </a>
              <a
                href="#testimonials"
                className="inline-flex items-center justify-center bg-white/15 text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg font-semibold hover:bg-white/25 transition-all border border-white/30 min-h-[44px] sm:min-h-[48px] backdrop-blur-sm text-xs sm:text-sm md:text-base"
              >
                See What Others Got Paid
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Answer Stats */}
      <div id="quick-answer" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef] border-b border-[#e8e2d8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Average Settlement</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#c4714a]">{quickAnswer.average}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Success Rate</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{quickAnswer.successRate}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Timeline</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{quickAnswer.timeline}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Upfront Cost</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{quickAnswer.upfront}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Credibility Section */}
      <div id="credibility" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-4">Our Track Record</p>
              <div className="text-6xl sm:text-7xl font-bold text-[#c4714a] mb-2">{recoveredAmount}</div>
              <p className="text-sm text-[#666] mb-12">Total Recovered for Clients</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">of cases result in settlement</p>
                <div className="text-4xl sm:text-5xl font-bold text-[#1a4a5a] mb-2">{successRate}</div>
                <p className="text-sm text-[#666]">Verified by state bar associations</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">people paid in full</p>
                <div className="text-4xl sm:text-5xl font-bold text-[#1a4a5a] mb-2">{casesWon}</div>
                <p className="text-sm text-[#666]">Verified by state bar associations</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Your potential recovery</p>
                <div className="text-4xl sm:text-5xl font-bold text-[#c4714a]">{avgSettlement}</div>
                <p className="text-sm text-[#666] mt-2">5x more than going it alone</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div id="why-matters" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-8 leading-tight">
            Why Your Case Is Worth More Than You Think
          </h2>
          <p className="text-lg text-[#555] leading-relaxed mb-12 font-light">
            {whyImportant}
          </p>

          <div className="space-y-8">
            <div className="border-l-4 border-[#c4714a] pl-6">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2">Catastrophic Injuries = Massive Settlements</h3>
              <p className="text-[#666] leading-relaxed">Your settlement reflects the severity of your injuries—not what the insurance company wants to pay.</p>
            </div>

            <div className="border-l-4 border-[#c4714a] pl-6">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2">Insurance Companies Count On You Doing Nothing</h3>
              <p className="text-[#666] leading-relaxed">They bet that you won't fight back. Don't prove them right.</p>
            </div>

            <div className="border-l-4 border-[#c4714a] pl-6">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2">Multiple Defendants = Multiple Pockets</h3>
              <p className="text-[#666] leading-relaxed">More defendants means more insurance coverage. More ways to get compensated.</p>
            </div>

            <div className="border-l-4 border-[#c4714a] pl-6">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2">Evidence Is Everything</h3>
              <p className="text-[#666] leading-relaxed">Medical records, police reports, witness statements—they tell the truth about what happened.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-4 leading-tight">
            Real People. Real Money. Real Relief.
          </h2>
          <p className="text-lg text-[#666] mb-16 font-light">
            These aren't hypothetical numbers. These are real settlements from real people.
          </p>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {(testimonials.length > 0 ? testimonials : defaultTestimonials).map((testimonial: any, idx: number) => (
              <div
                key={idx}
                className="bg-white border border-[#e8e2d8] p-8 rounded-lg"
                style={{ marginTop: idx === 1 ? '2rem' : idx === 2 ? '4rem' : '0' }}
              >
                <p className="text-[#555] text-base leading-relaxed mb-6 italic font-light">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-[#e8e2d8] pt-4">
                  <p className="font-semibold text-[#1a4a5a] mb-1">{testimonial.name}</p>
                  <p className="text-sm text-[#999] mb-3">{testimonial.location}</p>
                  <p className="text-lg font-bold text-[#c4714a]">{testimonial.settlement || testimonial.settlementAmount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settlement Breakdown Table */}
      <div id="settlement-breakdown" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-8 leading-tight">
            Settlement Breakdown by Injury Type
          </h2>

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
                {settlementBreakdown.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#e8e2d8] hover:bg-white transition-colors">
                    <td className="py-4 font-medium text-[#1a4a5a]">{item.injuryType}</td>
                    <td className="py-4 font-bold text-[#c4714a]">${Number(item.settlementAmount).toLocaleString()}</td>
                    <td className="py-4 text-[#666]">${Number(item.settlementRange?.min || 0).toLocaleString()} - ${Number(item.settlementRange?.max || 0).toLocaleString()}</td>
                    <td className="py-4 text-[#666]">{item.recoveryTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Attorney Comparison */}
      <div id="attorney-comparison" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-16 leading-tight">
            Here's the Truth: You Need an Attorney
          </h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-[#1a4a5a] mb-6">Going It Alone</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">—</div>
                  <p className="text-[#666]">Insurance company knows you're scared and desperate</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">—</div>
                  <p className="text-[#666]">You don't know your case value (they do)</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">—</div>
                  <p className="text-[#666]">You don't have expert witnesses or evidence</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">—</div>
                  <p className="text-[#666]">You accept their first lowball offer</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">—</div>
                  <p className="text-[#666]">Average settlement: $30K-$50K</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#e8e2d8]"></div>

            <div>
              <h3 className="text-2xl font-bold text-[#1a4a5a] mb-6">With Legal Representation</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">+</div>
                  <p className="text-[#666]">Insurance company knows you have backup—they negotiate differently</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">+</div>
                  <p className="text-[#666]">We know your case value (and we fight for it)</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">+</div>
                  <p className="text-[#666]">We hire expert witnesses and gather evidence</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">+</div>
                  <p className="text-[#666]">We negotiate aggressively (they know we'll go to trial)</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">+</div>
                  <p className="text-[#666]">Average settlement: $150K-$300K (5x more)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Open Accordions */}
      <div id="faq" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-12 leading-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {faqItems.length > 0 ? faqItems.map((faq: any, idx: number) => (
              <details
                key={idx}
                open
                className="group border border-[#e8e2d8] rounded-lg bg-white"
                itemProp="mainEntity"
                itemScope
                itemType="https://schema.org/Question"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors" itemProp="name">
                  {faq.question || faq.q || faq.title}
                  <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <p itemProp="text">{faq.answer || faq.a || faq.text}</p>
                </div>
              </details>
            )) : (
              <>
                <details open className="group border border-[#e8e2d8] rounded-lg bg-white">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors">How much can I get for a {categoryTitle.toLowerCase()} case?<ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" /></summary>
                  <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]">The average settlement depends on injury severity, medical costs, and liability. Contact us for a free evaluation.</div>
                </details>
                <details open className="group border border-[#e8e2d8] rounded-lg bg-white">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors">How long does a case take?<ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" /></summary>
                  <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]">Most cases settle within 12-18 months. We work efficiently to get you compensated.</div>
                </details>
                <details open className="group border border-[#e8e2d8] rounded-lg bg-white">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors">Do I need an attorney?<ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" /></summary>
                  <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]">Yes. Insurance companies have teams of lawyers. You need someone on your side who knows the law.</div>
                </details>
                <details open className="group border border-[#e8e2d8] rounded-lg bg-white">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors">How much does it cost?<ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" /></summary>
                  <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]">We work on contingency. You pay nothing upfront. We only get paid if you win.</div>
                </details>
                <details open className="group border border-[#e8e2d8] rounded-lg bg-white">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors">What if I was partially at fault?<ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" /></summary>
                  <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]">Most states allow recovery even if you were partially at fault. The key is proving the other party was MORE at fault.</div>
                </details>
              </>
            )}
          </div>
        </div>
      </div>

      {/* People Also Ask */}
      <div id="people-also-ask" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-12 leading-tight">
            People Also Ask
          </h2>

          <div className="space-y-4">
            {[
              { question: `What should I do after a ${categoryTitle.toLowerCase()}?`, answer: "Call 911, get medical attention, document the scene, exchange information, and contact an attorney immediately. Do not admit fault." },
              { question: "How much is my case worth?", answer: "Your case value depends on injury severity, medical costs, lost wages, and liability. Contact us for a free evaluation." },
              { question: "What if the insurance company denies my claim?", answer: "Don't accept a denial. Insurance companies often deny valid claims. We can appeal and fight for your rights." },
              { question: "Can I still recover if I was partially at fault?", answer: "Yes. Most states allow recovery even if you're partially at fault. We've won many cases with partial fault." }
            ].map((item, idx) => (
              <details
                key={idx}
                open
                className="group border border-[#e8e2d8] rounded-lg bg-white"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors">
                  {item.question}
                  <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Urgency Section */}
      <div id="urgency" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a4a5a] to-[#2d6a7a] text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-6 leading-tight">
            Your Deadline is Real. And It's Ticking.
          </h2>
          <p className="text-lg text-white/80 mb-4 leading-relaxed font-light">
            Statute of Limitations by State:
          </p>
          <p className="text-2xl font-bold text-[#a8d5e2] mb-12">
            {statutes.map((s: any, i: number) => `${s.state}: ${s.years} year${s.years !== '1' ? 's' : ''}${i < statutes.length - 1 ? ' | ' : ''}`).join('')}
          </p>
          <p className="text-lg text-white/80 mb-12 leading-relaxed font-light">
            You have 2-4 years to file a lawsuit (depending on your state). After that, you lose your right to recover. Forever.
          </p>

          <a
            href="tel:+18002273669"
            className="inline-flex items-center justify-center bg-[#c4714a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg hover:shadow-xl min-h-[48px]"
          >
            Get Your Free Consultation Now
          </a>
        </div>
      </div>

      {/* Final CTA */}
      <div id="final-cta" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-8 leading-tight">
            You've Read This Far. You're Ready.
          </h2>
          <p className="text-lg text-[#666] mb-12 leading-relaxed font-light">
            You know you deserve to get paid. You know an attorney can help. You know the deadline is real.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+18002273669"
              className="inline-flex items-center justify-center bg-[#c4714a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg hover:shadow-xl min-h-[48px]"
            >
              Get Your Free Consultation
            </a>
          </div>
          <p className="text-sm text-[#999] mt-8">Available 24/7. Confidential. No pressure.</p>
        </div>
      </div>

      {/* Guides Section */}
      <div id="guides" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-sans font-bold text-[#1a4a5a] mb-8">Want to Learn More?</h3>

          {articles.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {articles.slice(0, 3).map((article: any, idx: number) => (
                <Link
                  key={idx}
                  href={`/guide/${categorySlug}/${article.slug}`}
                  className="bg-white p-6 rounded-lg border border-[#e8e2d8] hover:border-[#c4714a] transition-colors block"
                >
                  <h4 className="text-base font-semibold text-[#1a4a5a] mb-2">{article.title}</h4>
                  <p className="text-[#666] text-sm mb-3 font-light line-clamp-2">{article.excerpt || article.description || ''}</p>
                  <div className="flex items-center text-[#c4714a] font-semibold text-sm">
                    Read <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link href="/guide" className="block bg-[#1a4a5a] text-white p-6 rounded-lg hover:bg-[#2d6a7a] transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h4 className="font-semibold mb-1">Browse All {categoryTitle} Guides</h4>
                  <p className="text-sm opacity-80">Explore our complete library</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#c4714a] shrink-0" />
              </div>
          </Link>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t-2 border-[#c4714a] shadow-2xl px-4 py-4 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#999] font-semibold tracking-wide mb-1">READY TO GET HELP?</p>
          <p className="text-sm font-bold text-[#1a4a5a]">Free Consultation Available</p>
        </div>
        <a href="tel:+18002273669" className="shrink-0 bg-[#c4714a] hover:bg-[#d4855e] text-white px-4 py-3 rounded-lg font-bold text-sm">
          Call Now
        </a>
      </div>
    </div>
  )
}