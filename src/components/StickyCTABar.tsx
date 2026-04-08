import Link from 'next/link';
/**
 * StickyCTABar — Persistent conversion point at bottom of viewport
 * 
 * Shows when user scrolls past hero
 * Market-specific messaging: "Request Access for [Market]"
 * Only shows when hovering over a market card
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border
 * - Gradient CTA
 */

import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Market } from "@/lib/marketData";

interface StickyCTABarProps {
  market: Market | null;
  onClose: () => void;
}

export default function StickyCTABar({ market, onClose }: StickyCTABarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      // Show when scrolled past hero (>600px)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!market || !isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[320px] sm:rounded-full sm:border-0"
      style={{
        background: "rgba(10, 14, 23, 0.95)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-4 sm:py-3 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-2">
        <div className="text-center sm:text-left flex-1">
          <p className="text-[11px] text-[#6B7280] hidden sm:block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {market.metro}, {market.stateCode}
          </p>
          <p className="text-[14px] font-bold text-[#F1F3F5] sm:hidden">
            {market.metro}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/request-access"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-full font-bold text-[#030608] transition-all hover:scale-105 text-[13px] sm:text-[14px]"
            style={{
              background: "linear-gradient(135deg, #00B4D8 0%, #5BB6C9 40%, #7C5CFF 100%)",
            }}
          >
            <span className="hidden sm:inline">Request Access</span>
            <span className="sm:hidden">Request</span>
            <ArrowRight size={14} className="hidden sm:inline" />
          </Link>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/[0.08] rounded-[8px] transition-colors"
          >
            <X size={16} className="text-[#B0B8C4]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
