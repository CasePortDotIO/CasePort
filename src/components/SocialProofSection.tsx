/**
 * SocialProofSection — Trust Amplification Layer
 *
 * Displays:
 * - Top 5 markets by MII
 * - Partner logos per market
 * - Case volume proof
 * - Rotating testimonials
 *
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - JetBrains Mono for labels
 * - Geist for body text
 */

import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, TrendingUp, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export default function SocialProofSection({ markets = [] }: { markets?: any[] }) {
  const topMarkets = useMemo(() => {
    // Basic sorting by MII (descending)
    return [...markets].sort((a, b) => (b.mii || 0) - (a.mii || 0)).slice(0, 5)
  }, [markets])

  const testimonialsAvailable = useMemo(() => {
    return markets.filter((m) => m.testimonial && m.testimonial.quote)
  }, [markets])

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  useEffect(() => {
    if (testimonialsAvailable.length === 0) return
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonialsAvailable.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [testimonialsAvailable.length])

  const currentTestimonial = testimonialsAvailable[currentTestimonialIndex]?.testimonial

  return (
    <section
      className="relative py-20 sm:py-28"
      style={{ backgroundColor: 'oklch(0.06 0.01 250)' }}
    >
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Label */}
        <div className="mb-16 text-center">
          <span className="system-label block mb-4" style={{ color: 'oklch(0.6 0.015 250)' }}>
            PROVEN INFRASTRUCTURE
          </span>
          <h2
            className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] leading-tight mb-4"
            style={{ letterSpacing: '-1.2px' }}
          >
            Top Markets by Intelligence Index
          </h2>
          <p className="text-[16px] text-[#B0B8C4] max-w-[640px] mx-auto">
            These markets are generating the highest-quality case opportunities. Real firms. Real
            results. Real infrastructure.
          </p>
        </div>

        {/* Top 5 Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {topMarkets.map((market, idx) => (
            <motion.div
              key={market.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="glass-panel p-5 flex flex-col rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
              }}
            >
              {/* Rank */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-[28px] font-bold text-[#F1F3F5]"
                  style={{ letterSpacing: '-1px' }}
                >
                  #{idx + 1}
                </span>
                <TrendingUp size={16} className="text-[#22D3EE]" />
              </div>

              {/* Market Name */}
              <h3 className="text-[14px] font-bold text-[#F1F3F5] mb-1">{market.metro}</h3>
              <p className="text-[12px] text-[#6B7280] mb-4">{market.state}</p>

              {/* MII Score */}
              <div className="mb-3">
                <span className="system-label text-[#6B7280]" style={{ fontSize: '9px' }}>
                  MII SCORE
                </span>
                <span className="text-[20px] font-bold text-[#22D3EE] block">{market.mii}</span>
              </div>

              {/* Case Volume */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.08]">
                <Briefcase size={12} className="text-[#F59E0B]" />
                <span className="text-[11px] text-[#B0B8C4]">
                  {market.casesAcquiredYearly.toLocaleString()} cases/year
                </span>
              </div>

              {/* Partner Count */}
              <div className="flex items-center gap-2">
                <Users size={12} className="text-[#10B981]" />
                <span className="text-[11px] text-[#B0B8C4]">
                  {market.partnersActive} of {market.maxPartners} partners
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Carousel */}
        <AnimatePresence mode="wait">
          {currentTestimonial && (
            <motion.div
              key={currentTestimonialIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-8 text-center rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
              }}
            >
              <p className="text-[18px] text-[#F1F3F5] leading-relaxed mb-6 italic">
                "{currentTestimonial.quote}"
              </p>
              <div>
                <p className="text-[14px] font-bold text-[#F1F3F5]">{currentTestimonial.author}</p>
                {currentTestimonial.firm && (
                  <p className="text-[12px] text-[#6B7280]">{currentTestimonial.firm}</p>
                )}
              </div>
              {/* Carousel Indicator */}
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {testimonialsAvailable.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonialIndex(idx)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      backgroundColor:
                        idx === currentTestimonialIndex ? '#22D3EE' : 'rgba(255,255,255,0.2)',
                    }}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
