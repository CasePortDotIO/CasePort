/**
 * MarketDetailPanel — Expanded slide-over detail view for a selected market
 *
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - Labels: JetBrains Mono, 12px, 500, 1.8px tracking, uppercase
 * - Numbers: Geist (not mono), cyan or amber
 * - Body: Geist, 18px, #B0B8C4
 * - CTA: 3-stop gradient, 12px radius
 */

import { Button } from '@/components/ui/button'
import type { Market, MarketStatus } from '@/lib/marketData'
import { motion } from 'framer-motion'
import { ArrowRight, DollarSign, Search, TrendingUp, Users, X } from 'lucide-react'
import Link from 'next/link'
import PartnerLogoGrid from './PartnerLogoGrid'

const statusColors: Record<MarketStatus, string> = {
  active: '#10B981',
  limited: '#F59E0B',
  capped: '#6B7280',
  evaluation: '#22D3EE',
}

const statusLabels: Record<MarketStatus, string> = {
  active: 'Active',
  limited: 'Limited',
  capped: 'Capped',
  evaluation: 'Under Review',
}

const statusDescriptions: Record<MarketStatus, string> = {
  active: 'Market is open with available slots',
  limited: 'Only 1-2 slots remaining',
  capped: 'All 3 partner slots filled',
  evaluation: 'Market under evaluation for launch',
}

interface MarketDetailPanelProps {
  market: Market
  onClose: () => void
}

export default function MarketDetailPanel({ market, onClose }: MarketDetailPanelProps) {
  const color = statusColors[market.status]
  const slotsRemaining = market.maxPartners - market.partnersActive
  const isCapped = market.status === 'capped'
  const isEval = market.status === 'evaluation'

  const ctaText = isCapped
    ? 'Join Waitlist'
    : isEval
      ? 'Request Priority Access'
      : 'Request Access for This Market'

  const ctaHref = `/request-access?market=${encodeURIComponent(market.metro)}&state=${market.stateCode}`

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] z-[100] overflow-y-auto bg-[#030608] border-l border-white/[0.08]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between bg-[#030608]/95 backdrop-blur-xl border-b border-white/[0.08]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
            Market Intelligence
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-[10px] hover:bg-white/[0.05] transition-colors text-[#6B7280] hover:text-[#F1F3F5]"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-8">
          {/* Market Name */}
          <div className="mb-8">
            <h2
              className="text-[32px] font-bold text-[#F1F3F5] leading-tight mb-1"
              style={{ letterSpacing: '-1.2px' }}
            >
              {market.metro}
            </h2>
            <p className="text-[16px] text-[#6B7280]">{market.state}</p>
            <div className="flex items-center gap-3 mt-4">
              <span
                className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.15em] uppercase px-3 py-1.5 rounded-[8px]"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: color,
                  backgroundColor: `${color}14`,
                  border: `1px solid ${color}30`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-breathe"
                  style={{ backgroundColor: color }}
                />
                {statusLabels[market.status]}
              </span>
              <span className="text-[12px] text-[#6B7280]">
                {statusDescriptions[market.status]}
              </span>
            </div>
          </div>

          {/* Partner Logos */}
          <div className="mb-6">
            <PartnerLogoGrid market={market} />
          </div>

          {/* MII Score — Large */}
          <div className="bg-white/[0.03] border border-white/[0.08] p-6 mb-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="system-label" style={{ color: 'oklch(0.6 0.015 250)' }}>
                Market Intelligence Index
              </span>
              <TrendingUp size={16} className="text-[#22D3EE]" />
            </div>
            <div className="flex items-end gap-3">
              <span
                className="text-[56px] font-bold text-[#F1F3F5] leading-none"
                style={{ letterSpacing: '-2px' }}
              >
                {market.mii}
              </span>
              <span className="text-[14px] text-[#6B7280] mb-2">/100</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${market.mii}%` }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, #22D3EE, ${color})` }}
              />
            </div>
            <p className="text-[11px] text-[#6B7280] mt-3">
              Composite score based on search intent volume, competition density, average case
              value, and market growth trajectory.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Search size={14} className="text-[#22D3EE]" />
                <span className="system-label text-[#6B7280]" style={{ fontSize: '9px' }}>
                  Monthly Searches
                </span>
              </div>
              <span className="text-[20px] font-bold text-[#F1F3F5]">
                {market.monthlySearchVolume}
              </span>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={14} className="text-[#F59E0B]" />
                <span className="system-label text-[#6B7280]" style={{ fontSize: '9px' }}>
                  Avg. Case Value
                </span>
              </div>
              <span className="text-[16px] font-bold text-[#F1F3F5]">{market.avgCaseValue}</span>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-[#10B981]" />
                <span className="system-label text-[#6B7280]" style={{ fontSize: '9px' }}>
                  Metro Population
                </span>
              </div>
              <span className="text-[20px] font-bold text-[#F1F3F5]">{market.population}</span>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border-2"
                  style={{ borderColor: color }}
                />
                <span className="system-label text-[#6B7280]" style={{ fontSize: '9px' }}>
                  Partner Slots
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[20px] font-bold text-[#F1F3F5]">
                  {market.partnersActive}
                </span>
                <span className="text-[14px] text-[#6B7280]">of {market.maxPartners}</span>
              </div>
            </div>
          </div>

          {/* Slots Visualization */}
          <div className="bg-white/[0.03] border border-white/[0.08] p-5 mb-6 rounded-2xl">
            <span className="system-label block mb-4" style={{ color: 'oklch(0.6 0.015 250)' }}>
              Port Capacity
            </span>
            <div className="flex gap-3">
              {Array.from({ length: market.maxPartners }).map((_, i) => (
                <div key={i} className="flex-1">
                  <div
                    className="h-12 rounded-[10px] flex items-center justify-center text-[11px] font-medium transition-all"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      backgroundColor:
                        i < market.partnersActive ? `${color}20` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${i < market.partnersActive ? `${color}40` : 'rgba(255,255,255,0.06)'}`,
                      color: i < market.partnersActive ? color : '#6B7280',
                    }}
                  >
                    {i < market.partnersActive ? 'ACTIVE' : 'OPEN'}
                  </div>
                </div>
              ))}
            </div>
            {!isCapped && (
              <p className="text-[12px] text-[#B0B8C4] mt-3">
                {slotsRemaining} partner {slotsRemaining === 1 ? 'slot' : 'slots'} remaining in this
                metro area.
              </p>
            )}
            {isCapped && (
              <p className="text-[12px] text-[#6B7280] mt-3">
                This market has reached capacity. Join the waitlist to be notified when a slot
                opens.
              </p>
            )}
          </div>

          {/* CTA */}
          <Button variant="gradient" className="w-full text-[14px] mb-3 h-12" asChild>
            <a href={ctaHref}>
              {ctaText}
              <ArrowRight size={16} />
            </a>
          </Button>

          {/* View Full Market Page Link */}
          <Link
            href={`/markets/${(market as any).slug || market.id}`}
            className="w-full px-4 py-3 rounded-[12px] border border-[#22D3EE]/30 bg-[#22D3EE]/5 text-[#22D3EE] text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#22D3EE]/10 transition-colors mb-4"
          >
            View Market Details
            <ArrowRight size={14} />
          </Link>

          {isCapped && (
            <p
              className="text-[11px] text-[#6B7280] text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Waitlist position is determined by application date and firm qualification score.
            </p>
          )}

          {!isCapped && !isEval && (
            <p
              className="text-[11px] text-[#6B7280] text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Review-first onboarding. Access is subject to firm evaluation and market availability.
            </p>
          )}
        </div>
      </motion.div>
    </>
  )
}
