/**
 * ComparisonTable — CasePort vs Traditional Lead Gen (AGGRESSIVE REDESIGN)
 * 
 * Converts objections into advantages with visual punch
 * Shows structural superiority of the 3-firm cap model
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - Geist for body
 * - JetBrains Mono for labels
 */

import { motion } from "framer-motion";
import { Check, X, Zap, TrendingUp, Lock, Clock } from "lucide-react";

const comparisonData = [
  {
    feature: "Territorial Control",
    icon: Lock,
    caseport: true,
    traditional: false,
    description: "Your market. Your leads. No competition.",
  },
  {
    feature: "Firms Per Market",
    icon: Users,
    caseport: "3 (capped)",
    traditional: "10-50+",
    description: "Scarcity = Quality",
  },
  {
    feature: "Lead Dilution",
    icon: Zap,
    caseport: "None",
    traditional: "Severe",
    description: "Every lead is yours",
  },
  {
    feature: "Payment Model",
    icon: DollarSign,
    caseport: "Pre-funded wallet",
    traditional: "Pay-per-lead",
    description: "Control your spend",
  },
  {
    feature: "Lead Quality Guarantee",
    icon: ShieldCheck,
    caseport: true,
    traditional: false,
    description: "Qualified or refunded",
  },
  {
    feature: "Response Time",
    icon: Clock,
    caseport: "15 minutes",
    traditional: "24-48 hours",
    description: "Speed = Conversion",
  },
  {
    feature: "Conversion Rates",
    icon: TrendingUp,
    caseport: "25%+",
    traditional: "<2%",
    description: "12x better performance",
  },
];

// Icon imports
import { Users, DollarSign, ShieldCheck } from "lucide-react";

export default function ComparisonTable() {
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
            STRUCTURAL ADVANTAGE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] leading-tight mb-4"
          >
            Why CasePort Converts 12x Better
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[16px] text-[#B0B8C4] max-w-2xl mx-auto"
          >
            The 3-firm cap isn't artificial scarcity. It's the infrastructure requirement for maintaining lead quality and conversion rates.
          </motion.p>
        </div>

        {/* Comparison Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {comparisonData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="rounded-[12px] p-6 sm:p-5"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Icon + Feature */}
                <div className="flex items-start gap-3 mb-4">
                  <Icon size={20} className="text-[#22D3EE] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-[14px] font-bold text-[#F1F3F5]">{item.feature}</h3>
                    <p className="text-[12px] text-[#6B7280]">{item.description}</p>
                  </div>
                </div>

                {/* Comparison */}
                <div className="grid grid-cols-2 gap-3">
                  {/* CasePort */}
                  <div className="rounded-[8px] p-3" style={{ background: "rgba(34, 211, 238, 0.1)", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
                    <p className="text-[10px] text-[#6B7280] mb-2 tracking-[0.1em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      CasePort
                    </p>
                    <div className="flex items-center gap-2">
                      {typeof item.caseport === "boolean" ? (
                        item.caseport ? (
                          <Check size={16} className="text-[#10B981]" />
                        ) : (
                          <X size={16} className="text-[#6B7280]" />
                        )
                      ) : (
                        <span className="text-[13px] font-bold text-[#22D3EE]">{item.caseport}</span>
                      )}
                    </div>
                  </div>

                  {/* Traditional */}
                  <div className="rounded-[8px] p-3" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    <p className="text-[10px] text-[#6B7280] mb-2 tracking-[0.1em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Traditional
                    </p>
                    <div className="flex items-center gap-2">
                      {typeof item.traditional === "boolean" ? (
                        item.traditional ? (
                          <Check size={16} className="text-[#10B981]" />
                        ) : (
                          <X size={16} className="text-[#6B7280]" />
                        )
                      ) : (
                        <span className="text-[13px] font-bold text-[#6B7280]">{item.traditional}</span>
                      )}
                    </div>
                  </div>
                </div>
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
          className="text-center"
        >
          <p className="text-[14px] text-[#B0B8C4] mb-6">
            Ready to experience the difference? Your market might be ready.
          </p>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[#030608] transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #00B4D8 0%, #5BB6C9 40%, #7C5CFF 100%)",
            }}
          >
            Check Your Market
          </button>
        </motion.div>
      </div>
    </section>
  );
}
