/**
 * TrustBadges — Credibility indicators in hero section
 * 
 * Displays:
 * - "Est. 2024"
 * - "847 cases acquired this year"
 * - "15 min avg response"
 * - "Pre-funded wallet"
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - JetBrains Mono for labels
 * - Geist for numbers
 */

import { motion } from "framer-motion";
import { CheckCircle2, Zap, Clock, Wallet } from "lucide-react";

const badges = [
  {
    icon: CheckCircle2,
    label: "ESTABLISHED",
    value: "2024",
    color: "#10B981",
  },
  {
    icon: Zap,
    label: "CASES ACQUIRED",
    value: "847",
    color: "#F59E0B",
  },
  {
    icon: Clock,
    label: "AVG RESPONSE",
    value: "15 min",
    color: "#22D3EE",
  },
  {
    icon: Wallet,
    label: "PAYMENT MODEL",
    value: "Pre-funded",
    color: "#7C5CFF",
  },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + idx * 0.05 }}
            className="rounded-[12px] p-4 flex flex-col items-center text-center"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Icon size={20} className="mb-2" style={{ color: badge.color }} />
            <p className="text-[10px] text-[#6B7280] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {badge.label}
            </p>
            <p className="text-[14px] font-bold text-[#F1F3F5]">{badge.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
