'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface CategoryGuideClientProps {
  category: any
  articles: any[]
  blocks: any[]
  headerNav?: any
  footerNav?: any
}

export default function CategoryGuideClient({ category, articles, blocks }: CategoryGuideClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categorySlug = category?.slug || ''
  const categoryTitle = category?.title || ''
  const heroImageUrl = category?.heroImage?.url || ''
  const heroTitle = category?.heroTitle || `Your Guide to ${categoryTitle} Claims`
  const heroSubtitle = category?.heroSubtitle || category?.description || ''

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 px-4 sm:px-7 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "bg-white border-b border-[#e8e2d8] shadow-md" : "bg-transparent"
        }`}
        style={{
          opacity: isScrolled ? 1 : 0,
          pointerEvents: isScrolled ? 'auto' : 'none',
        }}
      >
        <Link href="/" className="flex items-center gap-1 sm:gap-2">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-[#1a4a5a] flex items-center justify-center">
            <span className="font-bold text-white text-xs sm:text-lg">CP</span>
          </div>
          <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-[#1a4a5a]">CasePort</span>
        </Link>
        <a
          href="/checkmycase"
          className="bg-[#c4714a] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md"
        >
          Free Case Review
        </a>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] flex items-end overflow-hidden bg-black">
        {heroImageUrl && (
          <img src={heroImageUrl} alt={`${categoryTitle} scene`} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        <div className="relative z-10 w-full px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-24 lg:pb-32 pt-20 sm:pt-32">
          <div className="max-w-5xl">
            <nav className="mb-6 sm:mb-8" aria-label="breadcrumb">
              <ol className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li className="text-white/50"><ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" /></li>
                <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li className="text-white/50"><ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" /></li>
                <li className="text-white font-medium">{categoryTitle}</li>
              </ol>
            </nav>

            <p className="text-[#a8d5e2] text-xs font-semibold mb-2 sm:mb-4 tracking-widest uppercase opacity-90">
              {categoryTitle}
            </p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-sans font-bold mb-3 sm:mb-6 leading-tight text-white"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)', letterSpacing: '-0.02em', maxWidth: 'none' }}>
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white/85 mb-6 sm:mb-10 leading-relaxed font-light"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                {heroSubtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <a href="/checkmycase"
                className="inline-flex items-center justify-center bg-[#c4714a] text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg hover:shadow-xl min-h-[44px] sm:min-h-[48px] text-center text-xs sm:text-sm md:text-base">
                Get Your Free Consultation
              </a>
              <a href="#testimonials"
                className="inline-flex items-center justify-center bg-white/15 text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg font-semibold hover:bg-white/25 transition-all border border-white/30 min-h-[44px] sm:min-h-[48px] backdrop-blur-sm text-xs sm:text-sm md:text-base">
                See What Others Got Paid
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Block Renderer ─────────────────────────────────────────── */}
      {blocks.map((block: any, idx: number) => {
        switch (block.blockType) {

          // ── Quick Answer Stats ─────────────────────────────────────
          case 'categoryQuickAnswerStats': {
            const { average, successRate, timeline, upfront } = block
            if (!average && !successRate && !timeline && !upfront) return null
            return (
              <div key={idx} id="quick-answer" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef] border-b border-[#e8e2d8]">
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {average && (
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Average Settlement</p>
                        <p className="text-2xl sm:text-3xl font-bold text-[#c4714a]">{average}</p>
                      </div>
                    )}
                    {successRate && (
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Success Rate</p>
                        <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{successRate}</p>
                      </div>
                    )}
                    {timeline && (
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Timeline</p>
                        <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{timeline}</p>
                      </div>
                    )}
                    {upfront && (
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Upfront Cost</p>
                        <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{upfront}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          }

          // ── Credibility / Track Record ─────────────────────────────
          case 'categoryCredibility': {
            const { recoveredAmount, successRate, casesWon, avgSettlement, recoveryNote } = block
            if (!recoveredAmount && !successRate && !casesWon && !avgSettlement) return null
            return (
              <div key={idx} id="credibility" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-5xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
                    <div>
                      <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-4">Our Track Record</p>
                      {recoveredAmount && <div className="text-6xl sm:text-7xl font-bold text-[#c4714a] mb-2">{recoveredAmount}</div>}
                      <p className="text-sm text-[#666] mb-12">Total Recovered for Clients</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {successRate && (
                        <div>
                          <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">of cases result in settlement</p>
                          <div className="text-4xl sm:text-5xl font-bold text-[#1a4a5a] mb-2">{successRate}</div>
                          <p className="text-sm text-[#666]">Verified by state bar associations</p>
                        </div>
                      )}
                      {casesWon && (
                        <div>
                          <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">people paid in full</p>
                          <div className="text-4xl sm:text-5xl font-bold text-[#1a4a5a] mb-2">{casesWon}</div>
                          <p className="text-sm text-[#666]">Verified by state bar associations</p>
                        </div>
                      )}
                      <div className="col-span-2">
                        <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Your potential recovery</p>
                        <div className="text-4xl sm:text-5xl font-bold text-[#c4714a]">{avgSettlement}</div>
                        {recoveryNote && <p className="text-sm text-[#666] mt-2">{recoveryNote}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          // ── Why This Matters ────────────────────────────────────────
          case 'categoryWhyImportant': {
            const { intro, points } = block
            if (!intro && (!points || points.length === 0)) return null
            return (
              <div key={idx} id="why-matters" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-8 leading-tight">
                    Why Your Case Is Worth More Than You Think
                  </h2>
                  {intro && (
                    <p className="text-lg text-[#555] leading-relaxed mb-12 font-light">{intro}</p>
                  )}
                  {points && points.length > 0 && (
                    <div className="space-y-8">
                      {points.map((point: any, i: number) => (
                        <div key={i} className="border-l-4 border-[#c4714a] pl-6">
                          <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2">{point.heading}</h3>
                          {point.body && <p className="text-[#666] leading-relaxed">{point.body}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          }

          // ── Client Testimonials ─────────────────────────────────────
          case 'categoryTestimonials': {
            const items = block.items || []
            if (items.length === 0) return null
            return (
              <div key={idx} id="testimonials" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-4 leading-tight">
                    Real People. Real Money. Real Relief.
                  </h2>
                  <p className="text-lg text-[#666] mb-16 font-light">
                    These aren't hypothetical numbers. These are real settlements from real people.
                  </p>
                  <div className="grid md:grid-cols-3 gap-8 md:gap-6">
                    {items.map((t: any, i: number) => (
                      <div
                        key={i}
                        className="bg-white border border-[#e8e2d8] p-8 rounded-lg"
                        style={{ marginTop: i === 1 ? '2rem' : i === 2 ? '4rem' : '0' }}
                      >
                        <p className="text-[#555] text-base leading-relaxed mb-6 italic font-light">"{t.quote}"</p>
                        <div className="border-t border-[#e8e2d8] pt-4">
                          <p className="font-semibold text-[#1a4a5a] mb-1">{t.name}</p>
                          <p className="text-sm text-[#999] mb-3">{t.location}</p>
                          <p className="text-lg font-bold text-[#c4714a]">{t.settlement}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          }

          // ── Settlement Breakdown Table ──────────────────────────────
          case 'categorySettlementBreakdown': {
            const items = block.items || []
            if (items.length === 0) return null
            return (
              <div key={idx} id="settlement-breakdown" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
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
                        {items.map((item: any, i: number) => (
                          <tr key={i} className="border-b border-[#e8e2d8] hover:bg-white transition-colors">
                            <td className="py-4 font-medium text-[#1a4a5a]">{item.injuryType}</td>
                            <td className="py-4 font-bold text-[#c4714a]">{item.settlementAmount}</td>
                            <td className="py-4 text-[#666]">{item.minAmount} – {item.maxAmount}</td>
                            <td className="py-4 text-[#666]">{item.recoveryTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          }

          // ── Attorney Comparison ─────────────────────────────────────
          case 'categoryAttorneyComparison': {
            const items = block.items || []
            if (items.length === 0) return null
            return (
              <div key={idx} id="attorney-comparison" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-16 leading-tight">
                    Here's the Truth: You Need an Attorney
                  </h2>
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1a4a5a] mb-6">Going It Alone</h3>
                      <div className="space-y-4">
                        {items.map((item: any, i: number) => (
                          <div key={i} className="flex gap-4">
                            <div className="text-[#c4714a] font-bold text-xl">—</div>
                            <p className="text-[#666]">{item.withoutAttorney}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-px bg-[#e8e2d8]" />
                    <div>
                      <h3 className="text-2xl font-bold text-[#1a4a5a] mb-6">With Legal Representation</h3>
                      <div className="space-y-4">
                        {items.map((item: any, i: number) => (
                          <div key={i} className="flex gap-4">
                            <div className="text-[#c4714a] font-bold text-xl">+</div>
                            <p className="text-[#666]">{item.withAttorney}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          // ── Statute of Limitations ─────────────────────────────────
          case 'categoryStatuteDeadlines': {
            const { description, byState } = block
            const states = byState || []
            if (states.length === 0) return null
            return (
              <div key={idx} id="urgency" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a4a5a] to-[#2d6a7a] text-white">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-6 leading-tight">
                    Your Deadline is Real. And It's Ticking.
                  </h2>
                  <p className="text-lg text-white/80 mb-4 leading-relaxed font-light">
                    Statute of Limitations by State:
                  </p>
                  <p className="text-2xl font-bold text-[#a8d5e2] mb-12">
                    {states.map((s: any, i: number) =>
                      `${s.state}: ${s.years} year${s.years !== 1 ? 's' : ''}${i < states.length - 1 ? ' | ' : ''}`
                    ).join('')}
                  </p>
                  {description && (
                    <p className="text-lg text-white/80 mb-12 leading-relaxed font-light">{description}</p>
                  )}
                  <a href="/checkmycase"
                    className="inline-flex items-center justify-center bg-[#c4714a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg hover:shadow-xl min-h-[48px]">
                    Get Your Free Consultation Now
                  </a>
                </div>
              </div>
            )
          }

          // ── FAQ Accordion ───────────────────────────────────────────
          case 'categoryFAQ': {
            const items = block.items || []
            if (items.length === 0) return null
            return (
              <div key={idx} id="faq" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-12 leading-tight">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
                    {items.map((faq: any, i: number) => (
                      <details key={i} open className="group border border-[#e8e2d8] rounded-lg bg-white"
                        itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                        <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors"
                          itemProp="name">
                          {faq.question}
                          <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                        </summary>
                        <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]"
                          itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                          <p itemProp="text">{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            )
          }

          // ── People Also Ask ─────────────────────────────────────────
          case 'categoryPeopleAlsoAsk': {
            const items = block.items || []
            if (items.length === 0) return null
            return (
              <div key={idx} id="people-also-ask" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-12 leading-tight">
                    People Also Ask
                  </h2>
                  <div className="space-y-4">
                    {items.map((item: any, i: number) => (
                      <details key={i} open className="group border border-[#e8e2d8] rounded-lg bg-white">
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
            )
          }

          default:
            return null
        }
      })}

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
            <a href="/checkmycase"
              className="inline-flex items-center justify-center bg-[#c4714a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg hover:shadow-xl min-h-[48px]">
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
                  href={`/guides/${categorySlug}/${article.slug}`}
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

          <Link href="/guides" className="block bg-[#1a4a5a] text-white p-6 rounded-lg hover:bg-[#2d6a7a] transition-colors">
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
        <a href="/checkmycase" className="shrink-0 bg-[#c4714a] hover:bg-[#d4855e] text-white px-4 py-3 rounded-lg font-bold text-sm">
          Call Now
        </a>
      </div>
    </div>
  )
}