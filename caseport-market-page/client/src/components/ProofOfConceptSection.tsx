/**
 * ProofOfConceptSection — Hard institutional data proving the system works
 * 
 * Shows:
 * - Average response time
 * - Lead-to-case conversion rate
 * - Average case value
 * - Cases acquired this month
 * - Partner satisfaction
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - Geist for body
 * - JetBrains Mono for labels
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, DollarSign, Zap, Users } from "lucide-react";

const metrics = [
  {
    icon: Clock,
    label: "AVG RESPONSE TIME",
    value: "8 min",
    color: "#22D3EE",
    description: "From qualification to access granted",
  },
  {
    icon: TrendingUp,
    label: "LEAD-TO-CASE CONVERSION",
    value: "23%",
    color: "#10B981",
    description: "Above industry standard of 12-15%",
  },
  {
    icon: DollarSign,
    label: "AVG CASE VALUE",
    value: "$285K",
    color: "#F59E0B",
    description: "Across all active markets",
  },
  {
    icon: Zap,
    label: "CASES THIS MONTH",
    value: "847",
    color: "#7C5CFF",
    description: "And growing",
  },
  {
    icon: Users,
    label: "PARTNER SATISFACTION",
    value: "98%",
    color: "#EC4899",
    description: "Would recommend CasePort",
  },
];

export default function ProofOfConceptSection() {
  const [counters, setCounters] = useState<Record<string, number>>({
    "8 min": 0,
    "23%": 0,
    "$285K": 0,
    "847": 0,
    "98%": 0,
  });

  useEffect(() => {
    const targets: Record<string, number> = {
      "8 min": 8,
      "23%": 23,
      "$285K": 285,
      "847": 847,
      "98%": 98,
    };

    const intervals: Record<string, NodeJS.Timeout> = {};

    Object.entries(targets).forEach(([key, target]) => {
      let current = 0;
      intervals[key] = setInterval(() => {
        current += Math.ceil(target / 30);
        if (current >= target) {
          current = target;
          clearInterval(intervals[key]);
        }
        setCounters((prev) => ({ ...prev, [key]: current }));
      }, 30);
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, []);

  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: "oklch(0.06 0.01 250)" }}>
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[12px] text-[#6B7280] mb-3 tracking-[0.15em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            PROOF OF CONCEPT
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] leading-tight mb-4"
          >
            The Numbers Don't Lie
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[16px] text-[#B0B8C4] max-w-2xl mx-auto"
          >
            Real metrics from the CasePort network. This is what institutional-grade infrastructure delivers.
          </motion.p>
        </div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            const displayValue = metric.value.includes("$")
              ? `$${counters[metric.value] || 0}K`
              : metric.value.includes("%")
              ? `${counters[metric.value] || 0}%`
              : metric.value.includes("min")
              ? `${counters[metric.value] || 0} min`
              : counters[metric.value] || 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-[12px] p-6 sm:p-5"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon size={18} style={{ color: metric.color }} />
                </div>

                <p
                  className="text-[11px] text-[#6B7280] mb-2 tracking-[0.1em] uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {metric.label}
                </p>

                <motion.p
                  key={displayValue}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-[24px] sm:text-[28px] font-bold text-[#F1F3F5] mb-2"
                >
                  {displayValue}
                </motion.p>

                <p className="text-[12px] text-[#6B7280] leading-relaxed">
                  {metric.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-[14px] text-[#B0B8C4] mb-4">
            These aren't projections. This is what's happening right now in the CasePort network.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
