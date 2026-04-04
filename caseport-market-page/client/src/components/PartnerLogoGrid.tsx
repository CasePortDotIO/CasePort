/**
 * PartnerLogoGrid — Shows active partner firm logos in detail panel
 * 
 * Displays 1-3 partner logos based on market status
 * Realistic placeholder logos for firms
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - Geist for firm names
 */

import { motion } from "framer-motion";
import type { Market } from "@/lib/marketData";

interface PartnerLogoGridProps {
  market: Market;
}

// Realistic partner firm names with logo URLs
const partnerFirms = [
  {
    name: "Apex Legal Group",
    initials: "ALG",
    color: "#00B4D8",
    logo: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&h=120&fit=crop",
  },
  {
    name: "Justice Partners",
    initials: "JP",
    color: "#5BB6C9",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=120&h=120&fit=crop",
  },
  {
    name: "Recovery Law Firm",
    initials: "RLF",
    color: "#7C5CFF",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=120&h=120&fit=crop",
  },
];

export default function PartnerLogoGrid({ market }: PartnerLogoGridProps) {
  // Simulate partner selection based on market ID
  const partnerCount = market.partnersActive;
  const selectedPartners = partnerFirms.slice(0, partnerCount);

  return (
    <div>
      <p className="text-[12px] text-[#6B7280] mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        ACTIVE PARTNERS ({partnerCount}/{market.maxPartners})
      </p>
      <div className="grid grid-cols-1 gap-3">
        {selectedPartners.map((partner, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-[10px]"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              className="w-10 h-10 rounded-[8px] flex items-center justify-center font-bold text-[12px] overflow-hidden"
              style={{ background: `${partner.color}20`, color: partner.color }}
            >
              <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#F1F3F5]">{partner.name}</p>
              <p className="text-[11px] text-[#6B7280]">Qualified Partner</p>
            </div>
          </motion.div>
        ))}
      </div>

      {partnerCount < market.maxPartners && (
        <div className="mt-4 p-3 rounded-[10px]" style={{ background: "rgba(34, 211, 238, 0.1)", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
          <p className="text-[12px] text-[#22D3EE]">
            <span className="font-bold">{market.maxPartners - partnerCount} slot{market.maxPartners - partnerCount > 1 ? "s" : ""} available</span>
            <br />
            <span className="text-[11px] text-[#6B7280]">Qualified firms only</span>
          </p>
        </div>
      )}
    </div>
  );
}
