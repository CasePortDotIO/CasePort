/**
 * ScarcityTimer — Shows countdown to market slot closure
 * 
 * Displays based on market status:
 * - Active: "Slot closing in 47 days"
 * - Limited: "Last slot filling fast"
 * - Capped: "Waitlist position: #47"
 * 
 * BRAND SYSTEM:
 * - Amber for Limited, Gray for Capped
 * - JetBrains Mono for labels
 */

import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import type { Market } from "@/lib/marketData";

interface ScarcityTimerProps {
  market: Market;
}

export default function ScarcityTimer({ market }: ScarcityTimerProps) {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    // Calculate days remaining based on market status
    // Simulated: Active markets have 30-90 days, Limited have 5-15 days
    const baseDays = market.status === "active" ? 47 : market.status === "limited" ? 8 : 0;
    setDaysRemaining(baseDays);
  }, [market.status]);

  if (market.status === "capped") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-[8px]" style={{ background: "rgba(107, 114, 128, 0.15)" }}>
        <AlertCircle size={14} className="text-[#6B7280]" />
        <span className="text-[12px] text-[#6B7280]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          WAITLIST #{Math.floor(Math.random() * 50) + 1}
        </span>
      </div>
    );
  }

  if (market.status === "limited") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-[8px] animate-pulse" style={{ background: "rgba(245, 158, 11, 0.15)" }}>
        <Clock size={14} className="text-[#F59E0B]" />
        <span className="text-[12px] text-[#F59E0B] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          LAST SLOT • {daysRemaining}D
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-[8px]" style={{ background: "rgba(34, 211, 238, 0.15)" }}>
      <Clock size={14} className="text-[#22D3EE]" />
      <span className="text-[12px] text-[#22D3EE]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        CLOSES IN {daysRemaining}D
      </span>
    </div>
  );
}
