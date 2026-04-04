/**
 * LeadQualityGuarantee — Objection-killing copy section
 * 
 * Addresses key objections:
 * - "What if the leads aren't qualified?"
 * - "What if I don't get ROI?"
 * - "How do I know I'm only paying for real leads?"
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - Geist for body
 * - JetBrains Mono for labels
 */

import { motion } from "framer-motion";
import { CheckCircle2, Shield, Zap, Lock } from "lucide-react";

const guarantees = [
  {
    icon: CheckCircle2,
    title: "Only Pay for Qualified Leads",
    description: "Leads that don't meet the contractually agreed definition are not charged to your wallet. Zero ambiguity.",
    color: "#10B981",
  },
  {
    icon: Shield,
    title: "Pre-Funded Wallet Model",
    description: "Fund your wallet upfront. Funds are only deducted upon delivery of a qualified case opportunity. No surprises.",
    color: "#22D3EE",
  },
  {
    icon: Zap,
    title: "15-Minute Response Guarantee",
    description: "Qualified firms are onboarded within 48 hours. Market-specific leads begin flowing immediately upon activation.",
    color: "#F59E0B",
  },
  {
    icon: Lock,
    title: "Territorial Control",
    description: "3 firms per market. No lead dilution. No competing with dozens of other attorneys for the same cases.",
    color: "#7C5CFF",
  },
];

export default function LeadQualityGuarantee() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: "oklch(0.06 0.01 250)" }}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[12px] text-[#6B7280] mb-3 tracking-[0.15em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            QUALITY ASSURANCE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] leading-tight mb-4"
          >
            No Guessing. No Surprises.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[16px] text-[#B0B8C4] max-w-2xl mx-auto"
          >
            Every guarantee is built into the infrastructure. You only pay for leads that meet your contract definition. Period.
          </motion.p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {guarantees.map((guarantee, idx) => {
            const Icon = guarantee.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-[12px] p-6 sm:p-8"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <Icon size={24} className="mb-4" style={{ color: guarantee.color }} />
                <h3 className="text-[18px] font-bold text-[#F1F3F5] mb-2">{guarantee.title}</h3>
                <p className="text-[14px] text-[#B0B8C4] leading-relaxed">{guarantee.description}</p>
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
          <p className="text-[14px] text-[#6B7280]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Questions about our guarantee? <span className="text-[#22D3EE] font-bold">Contact our team</span> — we're here to explain every detail.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
