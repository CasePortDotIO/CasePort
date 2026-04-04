/**
 * MarketCard — Individual market tile in the Access Grid
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - Labels: JetBrains Mono, 12px, 500, 1.8px tracking
 * - Numbers: Geist (not mono), cyan
 * - Body: Geist, #B0B8C4
 */

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Market, MarketStatus } from "@/lib/marketData";
import { analytics } from "@/lib/analytics";
import ScarcityTimer from "./ScarcityTimer";

const statusColors: Record<MarketStatus, string> = {
  active: "#10B981",
  limited: "#F59E0B",
  capped: "#6B7280",
  evaluation: "#22D3EE",
};

const statusLabels: Record<MarketStatus, string> = {
  active: "OPEN",
  limited: "LIMITED",
  capped: "CAPPED",
  evaluation: "IN REVIEW",
};

interface MarketCardProps {
  market: Market;
  index: number;
  onSelect: (market: Market) => void;
}

export default function MarketCard({ market, index, onSelect }: MarketCardProps) {
  const color = statusColors[market.status];
  const slotsRemaining = market.maxPartners - market.partnersActive;

  const handleClick = () => {
    analytics.logMarketClick(market.id, market.metro, market.mii, market.status);
    onSelect(market);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      role="listitem"
      aria-label={`${market.metro}, ${market.stateCode} — ${statusLabels[market.status]} — MII Score ${market.mii}`}
    >
      <button
        onClick={handleClick}
        className="w-full text-left group transition-all duration-300 hover:-translate-y-0.5"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "12px",
          backdropFilter: "blur(20px)",
        }}
        aria-label={`${market.metro}, ${market.stateCode} — ${statusLabels[market.status]} — MII Score ${market.mii} — ${slotsRemaining} slot${slotsRemaining !== 1 ? "s" : ""} open`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
      >
        <div className="p-4 sm:p-5">
          {/* Scarcity Timer */}
          <div className="mb-3">
            <ScarcityTimer market={market} />
          </div>

          {/* Metro Name */}
          <h3 className="text-[16px] font-bold text-[#F1F3F5] leading-tight mb-1 group-hover:text-white transition-colors">
            {market.metro}
          </h3>
          <p className="text-[11px] text-[#B0B8C4] mb-3">
            {market.casesAcquiredYearly} cases • {market.avgSettlement} avg
          </p>

          {/* Slot Visualization */}
          <div className="flex gap-1.5 mb-3">
            {Array.from({ length: market.maxPartners }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full"
                style={{
                  backgroundColor: i < market.partnersActive ? `${color}50` : "rgba(255,255,255,0.06)",
                }}
              />
            ))}
          </div>

          {/* Footer: Slots + Arrow */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {market.status === "capped"
                ? "Waitlist open"
                : market.status === "evaluation"
                ? "Evaluating"
                : `${slotsRemaining} slot${slotsRemaining !== 1 ? "s" : ""} open`}
            </span>
            <ArrowRight
              size={14}
              className="text-[#6B7280] group-hover:text-[#22D3EE] group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </div>
      </button>
    </motion.div>
  );
}
