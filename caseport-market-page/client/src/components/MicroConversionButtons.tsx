/**
 * MicroConversionButtons — Low-friction conversion points on market cards
 * 
 * Buttons:
 * - "Add to Watchlist" (saves market for later)
 * - "Get Market Alert" (email notification when slot opens)
 * 
 * BRAND SYSTEM:
 * - Subtle glass buttons
 * - Icons from lucide-react
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Bell, Check } from "lucide-react";
import type { Market } from "@/lib/marketData";
import { analytics } from "@/lib/analytics";

interface MicroConversionButtonsProps {
  market: Market;
  onAlert: (market: Market) => void;
}

export default function MicroConversionButtons({ market, onAlert }: MicroConversionButtonsProps) {
  const [watchlisted, setWatchlisted] = useState(false);
  const [alerted, setAlerted] = useState(false);

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchlisted(!watchlisted);
    analytics.logMarketClick(market.id, market.metro, market.mii, "watchlist");
  };

  const handleAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAlerted(true);
    onAlert(market);
    setTimeout(() => setAlerted(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWatchlist}
        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[10px] text-[12px] font-bold transition-all"
        style={{
          background: watchlisted ? "rgba(34, 211, 238, 0.15)" : "rgba(255, 255, 255, 0.04)",
          border: watchlisted ? "1px solid rgba(34, 211, 238, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
          color: watchlisted ? "#22D3EE" : "#B0B8C4",
        }}
        title="Add to watchlist"
      >
        <Eye size={14} />
        <span className="hidden sm:inline">Watch</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAlert}
        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[10px] text-[12px] font-bold transition-all"
        style={{
          background: alerted ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.04)",
          border: alerted ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
          color: alerted ? "#10B981" : "#B0B8C4",
        }}
        title="Get notified when a slot opens"
      >
        {alerted ? <Check size={14} /> : <Bell size={14} />}
        <span className="hidden sm:inline">{alerted ? "Added" : "Alert"}</span>
      </motion.button>
    </div>
  );
}
