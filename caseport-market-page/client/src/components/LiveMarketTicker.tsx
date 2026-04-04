/**
 * LiveMarketTicker — Shows market activity in real-time (FOMO trigger)
 * 
 * Displays:
 * - "Miami just filled its last slot"
 * - "Houston opened 1 slot"
 * - "Denver market activated"
 * 
 * BRAND SYSTEM:
 * - Animated ticker bar
 * - Geist for text
 * - JetBrains Mono for labels
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const tickerEvents = [
  { type: "filled", market: "Miami", action: "just filled its last slot" },
  { type: "opened", market: "Houston", action: "opened 1 slot" },
  { type: "activated", market: "Denver", action: "market activated" },
  { type: "filled", market: "Atlanta", action: "just filled its last slot" },
  { type: "opened", market: "Phoenix", action: "opened 2 slots" },
  { type: "activated", market: "Portland", action: "market activated" },
];

export default function LiveMarketTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerEvents.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const event = tickerEvents[currentIndex];
  const color = event.type === "filled" ? "#F59E0B" : event.type === "opened" ? "#10B981" : "#22D3EE";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-3 rounded-full flex items-center gap-3"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <Zap size={14} style={{ color }} className="animate-pulse" />
      <motion.span
        key={currentIndex}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="text-[12px] text-[#F1F3F5] whitespace-nowrap"
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color }}>
          {event.market}
        </span>
        {" "}
        <span className="text-[#B0B8C4]">{event.action}</span>
      </motion.span>
    </motion.div>
  );
}
