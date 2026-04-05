import Link from 'next/link';
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useScrollReveal, fadeUp, scaleIn } from "@/hooks/useAnimations";

/*
 * ROI Calculator — The "golden moment" of the page.
 * Temperature shift: cyan → gold. This is where value becomes tangible.
 * Now embedded within Zone 4's golden background — no self-contained section wrapper.
 */

export default function ROICalculator() {
  const { ref, isInView } = useScrollReveal(0.1);
  const [leadsPerMonth, setLeadsPerMonth] = useState(20);
  const [avgCaseValue, setAvgCaseValue] = useState(75000);
  const [conversionRate, setConversionRate] = useState(15);

  const calculations = useMemo(() => {
    const signedCases = Math.round(leadsPerMonth * (conversionRate / 100));
    const monthlyRevenue = signedCases * avgCaseValue;
    const annualRevenue = monthlyRevenue * 12;
    const costPerLead = 750;
    const monthlyCost = leadsPerMonth * costPerLead;
    const monthlyProfit = monthlyRevenue - monthlyCost;
    const roi = monthlyCost > 0 ? ((monthlyProfit / monthlyCost) * 100) : 0;
    return { signedCases, monthlyRevenue, annualRevenue, monthlyCost, monthlyProfit, roi };
  }, [leadsPerMonth, avgCaseValue, conversionRate]);

  const formatCurrency = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
  };

  return (
    <div ref={ref} id="roi-calculator" className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-center"
      >
        <div className="system-label text-amber-400/80 mb-5">Value Projection</div>
        <h2 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] xl:text-[3.25rem] font-semibold tracking-[-0.03em] text-white leading-[1.05]">
          See What Controlled Case Flow
          <br />
          <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">Could Mean for Your Firm</span>
        </h2>
        <p className="mt-5 max-w-2xl mx-auto text-[1.0625rem] text-[#B0B8C4] leading-[1.75]">
          Adjust the inputs below to model your potential return. These projections are illustrative and based on the parameters you provide.
        </p>
      </motion.div>

      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay: 0.2 }}
        className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]"
      >
        {/* Input Panel */}
        <div className="rounded-2xl border border-amber-500/15 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-7 sm:p-8 backdrop-blur-xl">
          <div className="system-label text-amber-400/60 mb-7">Your Parameters</div>
          <div className="space-y-9">
            <SliderInput label="Qualified Leads per Month" value={leadsPerMonth} onChange={setLeadsPerMonth} min={5} max={100} step={5} display={`${leadsPerMonth}`} color="amber" />
            <SliderInput label="Average Case Settlement Value" value={avgCaseValue} onChange={setAvgCaseValue} min={10000} max={500000} step={5000} display={formatCurrency(avgCaseValue)} color="amber" />
            <SliderInput label="Estimated Conversion Rate" value={conversionRate} onChange={setConversionRate} min={5} max={40} step={1} display={`${conversionRate}%`} color="amber" />
          </div>
        </div>

        {/* Results Panel */}
        <div className="rounded-2xl border border-amber-500/20 p-7 sm:p-8 backdrop-blur-xl glow-gold" style={{ background: "linear-gradient(180deg, rgba(245,158,11,0.08) 0%, rgba(251,191,36,0.03) 50%, rgba(255,255,255,0.02) 100%)" }}>
          <div className="system-label text-amber-400/60 mb-7">Projected Outcome</div>
          <div className="space-y-5">
            <ResultRow label="Signed Cases / Month" value={`${calculations.signedCases}`} highlight />
            <ResultRow label="Monthly Revenue Potential" value={formatCurrency(calculations.monthlyRevenue)} highlight />
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <ResultRow label="Estimated Monthly Investment" value={formatCurrency(calculations.monthlyCost)} />
            <ResultRow label="Net Monthly Value" value={formatCurrency(calculations.monthlyProfit)} highlight />
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <ResultRow label="Projected Annual Revenue" value={formatCurrency(calculations.annualRevenue)} highlight large />
            <ResultRow label="Estimated ROI" value={`${Math.round(calculations.roi)}%`} highlight large />
          </div>
          <div className="mt-7 pt-5 border-t border-amber-500/10">
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              * These figures are illustrative projections only and do not constitute a guarantee of results. Actual outcomes depend on market conditions, case quality, firm capacity, and other factors. CasePort does not guarantee any specific number of leads, cases, or revenue.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay: 0.4 }}
        className="mt-10 text-center"
      >
        <button className="rounded-full px-8 py-3.5 text-sm font-semibold text-black shadow-[0_20px_60px_rgba(245,158,11,0.3)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(245,158,11,0.4)]" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%)" }}>
          Request Private Access
        </button>
        <p className="mt-3.5 text-[13px] text-[#6B7280]">
          Market-capped. Review-first. For qualified firms only.
        </p>
      </motion.div>
    </div>
  );
}

function SliderInput({
  label, value, onChange, min, max, step, display, color = "cyan",
}: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; display: string; color?: "cyan" | "amber";
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackColor = color === "amber" ? "#F59E0B" : "#00D4FF";

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2.5">
        <span className="text-[14px] text-[#9CA3AF]">{label}</span>
        <span className="text-xl font-semibold text-white font-mono tabular-nums">{display}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
            WebkitAppearance: "none",
          }}
        />
      </div>
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(245,158,11,0.4), 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid ${trackColor};
        }
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(245,158,11,0.4), 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid ${trackColor};
        }
      `}</style>
    </div>
  );
}

function ResultRow({ label, value, highlight = false, large = false }: { label: string; value: string; highlight?: boolean; large?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className={`text-[14px] ${highlight ? "text-[#D1D5DB]" : "text-[#6B7280]"}`}>{label}</span>
      <span className={`font-mono tabular-nums font-semibold ${large ? "text-xl sm:text-2xl" : "text-lg"} ${highlight ? "text-white" : "text-[#9CA3AF]"}`}>
        {value}
      </span>
    </div>
  );
}
