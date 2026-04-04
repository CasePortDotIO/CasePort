/**
 * UnlistedMarketForm — Inline form for cities not in the grid
 * 
 * Shows when user searches a city not in the market list
 * Captures: Name, Email, Market, Phone
 * Leads to data moat + nurture sequence
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - Gradient CTA
 */

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";

interface UnlistedMarketFormProps {
  searchQuery: string;
  onSubmit: (data: { name: string; email: string; market: string; phone: string }) => void;
}

export default function UnlistedMarketForm({ searchQuery, onSubmit }: UnlistedMarketFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "", market: searchQuery, phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.market) {
      onSubmit(formData);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", market: searchQuery, phone: "" });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative py-20 sm:py-28"
      style={{ backgroundColor: "oklch(0.06 0.01 250)" }}
    >
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 mx-auto px-5 sm:px-6 lg:px-8 max-w-2xl">
        <div className="glass-panel p-8 sm:p-12 rounded-2xl" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px" }}>
          {!submitted ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: "rgba(34,211,238,0.15)" }}>
                  <MapPin size={18} className="text-[#22D3EE]" />
                </div>
                <div>
                  <h2 className="text-[24px] font-bold text-[#F1F3F5]">Market Not Listed?</h2>
                  <p className="text-[13px] text-[#6B7280]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    REQUEST PRIORITY EVALUATION
                  </p>
                </div>
              </div>

              <p className="text-[15px] text-[#B0B8C4] mb-8 leading-relaxed">
                {searchQuery} is not yet in the CasePort network. Submit your information and we'll evaluate this market for infrastructure deployment. Priority access requests are reviewed within 5 business days.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="px-4 py-3 rounded-[10px] text-[14px] text-[#F1F3F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                    style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="px-4 py-3 rounded-[10px] text-[14px] text-[#F1F3F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                    style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Market (City, State)"
                    value={formData.market}
                    onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                    required
                    className="px-4 py-3 rounded-[10px] text-[14px] text-[#F1F3F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                    style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-4 py-3 rounded-[10px] text-[14px] text-[#F1F3F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                    style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full font-bold text-[#030608] transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #00B4D8 0%, #5BB6C9 40%, #7C5CFF 100%)" }}
                >
                  Request Priority Access <ArrowRight size={16} className="inline ml-2" />
                </button>
              </form>

              <p className="text-[12px] text-[#6B7280] text-center mt-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                We evaluate markets based on demand density, case values, and infrastructure readiness.
              </p>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(16,185,129,0.15)" }}>
                <MapPin size={20} className="text-[#10B981]" />
              </div>
              <p className="text-[18px] font-bold text-[#F1F3F5] mb-2">Request Submitted</p>
              <p className="text-[14px] text-[#B0B8C4]">We'll review {formData.market} and contact you within 5 business days.</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
