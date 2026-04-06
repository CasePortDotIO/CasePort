/*
  DESIGN: Brand-aligned 404 page for CasePort Insights
  Matches the dark editorial system — deep navy, Space Grotesk, glass panels
*/

import { ArrowLeft, Radio } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center px-6">
      {/* Atmospheric Orb */}
      <div className="atmo-orb w-[500px] h-[500px] bg-cp-cyan/6 top-[20%] left-[10%]" />

      <div className="relative z-10 max-w-[520px] text-center">
        {/* Signal icon */}
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-10">
          <Radio size={28} className="text-cp-cyan/60" />
        </div>

        {/* 404 number */}
        <div
          className="text-[100px] lg:text-[120px] font-bold text-white/[0.04] leading-none tracking-[-0.05em] select-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          404
        </div>

        <h1
          className="text-[28px] lg:text-[36px] font-bold text-cp-text-primary tracking-[-0.02em] -mt-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Signal Not Found
        </h1>

        <p className="mt-6 text-[16px] text-cp-text-muted leading-[1.8] max-w-[400px] mx-auto">
          The page you are looking for does not exist or has been moved.
          Return to the intelligence hub to continue browsing.
        </p>

        <button
          onClick={() => setLocation("/")}
          className="mt-10 cta-gradient inline-flex items-center gap-2.5"
        >
          <ArrowLeft size={16} /> Back to Insights
        </button>
      </div>
    </div>
  );
}
