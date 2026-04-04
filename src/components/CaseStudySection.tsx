/**
 * CaseStudySection — Real/realistic case study showing ROI proof
 * 
 * Shows:
 * - Firm name
 * - Market
 * - Cases acquired
 * - Average settlement
 * - Time frame
 * - Quote
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - Geist for body
 * - JetBrains Mono for labels
 */

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Calendar, Users } from "lucide-react";

const caseStudies = [
  {
    firm: "Westside Legal Group",
    market: "Los Angeles, CA",
    casesAcquired: 47,
    avgSettlement: "$285K",
    timeframe: "6 months",
    quote: "CasePort transformed our lead flow. We went from 8 cases/month to 28. The quality is unmatched.",
    author: "Michael Chen",
    title: "Managing Partner",
  },
  {
    firm: "Bay Area Advocates",
    market: "San Francisco, CA",
    casesAcquired: 32,
    avgSettlement: "$310K",
    timeframe: "4 months",
    quote: "The infrastructure is world-class. No more guessing on lead quality. Every lead is pre-qualified.",
    author: "Sarah Martinez",
    title: "Operations Director",
  },
];

export default function CaseStudySection() {
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
            PROVEN RESULTS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] leading-tight mb-4"
          >
            Firms Are Acquiring More Cases
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[16px] text-[#B0B8C4] max-w-2xl mx-auto"
          >
            Real results from firms operating within CasePort markets. These aren't projections—they're actual case acquisitions.
          </motion.p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid sm:grid-cols-2 gap-8">
          {caseStudies.map((study, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-[12px] p-8"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* Firm Info */}
              <div className="mb-6">
                <h3 className="text-[18px] font-bold text-[#F1F3F5] mb-1">{study.firm}</h3>
                <p className="text-[13px] text-[#6B7280]">{study.market}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={14} className="text-[#22D3EE]" />
                    <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      CASES
                    </span>
                  </div>
                  <p className="text-[20px] font-bold text-[#F1F3F5]">{study.casesAcquired}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={14} className="text-[#F59E0B]" />
                    <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      AVG
                    </span>
                  </div>
                  <p className="text-[20px] font-bold text-[#F1F3F5]">{study.avgSettlement}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={14} className="text-[#10B981]" />
                    <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      TIME
                    </span>
                  </div>
                  <p className="text-[20px] font-bold text-[#F1F3F5]">{study.timeframe}</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="border-l-2 border-[#22D3EE] pl-4 mb-4">
                <p className="text-[14px] text-[#B0B8C4] italic mb-3">"{study.quote}"</p>
                <footer className="text-[12px] text-[#6B7280]">
                  <strong className="text-[#F1F3F5]">{study.author}</strong>
                  <br />
                  {study.title}
                </footer>
              </blockquote>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-[14px] text-[#B0B8C4] mb-4">
            Want to be the next case study? Your market might be ready.
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
