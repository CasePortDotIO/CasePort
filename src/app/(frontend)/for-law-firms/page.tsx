"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RealScarcityCounter } from "@/components/RealScarcityCounter";
import { VideoTestimonials } from "@/components/VideoTestimonials";
import { InteractiveDashboard } from "@/components/InteractiveDashboard";
import ROICalculator from "@/components/ROICalculator";
import { Button } from "@/components/ui/button";
import {
  Shield,
  BarChart3,
  Lock,
  Zap,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Users,
  TrendingUp,
  Target,
  Clock,
  Eye,
  FileCheck,
  Wallet,
  RefreshCw,
  Award,
  Globe,
  Phone,
  Mail,
  MapPin,
  Play,
  AlertCircle,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Intersection Observer Hook for scroll animations
   ───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    // bfcache immediate fix
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight && rect.bottom > 0) setInView(true);

    const obs = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setInView(true); 
          // Do not unobserve so standard event flow isn't short-circuited by Next.js cache 
        } 
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─────────────────────────────────────────────
   Reusable Section Wrapper
   ───────────────────────────────────────────── */
function Section({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-24 md:py-32 lg:py-40 ${className}`}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}
    >
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────
   System Label Component
   ───────────────────────────────────────────── */
function SystemLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="system-label inline-block mb-6" style={{ color: "oklch(60% .015 250)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Glass Card Component with Apple-level hover
   ───────────────────────────────────────────── */
function GlassCard({ children, className = "", hover = true, style }: { children: React.ReactNode; className?: string; hover?: boolean; style?: React.CSSProperties }) {
  return (
    <div
      className={`glass-panel p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] ${hover ? "transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stat Display Component
   ───────────────────────────────────────────── */
function StatBlock({ value, label, accent = "cyan" }: { value: string; label: string; accent?: "cyan" | "gold" | "green" }) {
  const colorMap = { cyan: "oklch(78% .13 195)", gold: "#F59E0B", green: "#10B981" };
  return (
    <div className="text-center">
      <div className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Geist', sans-serif", color: colorMap[accent], letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.15em" }}>
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FAQ Accordion Item
   ───────────────────────────────────────────── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group transition-colors duration-300 hover:text-white"
        aria-expanded={open}
      >
        <span className="text-base md:text-lg font-medium pr-4" style={{ color: "#F1F3F5" }}>{question}</span>
        {open ? <ChevronUp className="w-5 h-5 shrink-0 transition-colors duration-300" style={{ color: "oklch(78% .13 195)" }} /> : <ChevronDown className="w-5 h-5 shrink-0 transition-colors duration-300" style={{ color: "#6B7280" }} />}
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "500px" : "0px", opacity: open ? 1 : 0 }}
      >
        <p className="pb-6 text-base leading-relaxed" style={{ color: "#B0B8C4" }}>{answer}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Lead Scoring Visualization
   ───────────────────────────────────────────── */
function LeadScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const { ref, inView } = useInView(0.3);
  return (
    <div ref={ref} className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm" style={{ color: "#B0B8C4" }}>{label}</span>
        <span className="text-sm font-mono font-medium" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>{score}/100</span>
      </div>
      <div className="h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div
          className="h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: inView ? `${score}%` : "0%", background: color }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Qualification Form
   ───────────────────────────────────────────── */
function QualificationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ firmName: "", practiceArea: "", state: "", budget: "", email: "" });
  const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="w-full max-w-md">
      {/* Step 1: Firm Details */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="system-label block mb-3" style={{ color: "#6B7280" }}>Firm Name</label>
            <input
              type="text"
              value={formData.firmName}
              onChange={e => updateField("firmName", e.target.value)}
              placeholder="e.g., Smith & Associates"
              className="w-full h-12 px-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none transition-all duration-300 focus:bg-white/[0.06]"
            />
          </div>
          <div>
            <label className="system-label block mb-3" style={{ color: "#6B7280" }}>Practice Area</label>
            <select
              value={formData.practiceArea}
              onChange={e => updateField("practiceArea", e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white focus:border-primary/50 focus:outline-none transition-all duration-300 focus:bg-white/[0.06]"
            >
              <option value="" className="bg-[rgb(3,6,8)]">Select practice area</option>
              <option value="auto" className="bg-[rgb(3,6,8)]">Auto Accidents</option>
              <option value="slip" className="bg-[rgb(3,6,8)]">Slip & Fall</option>
              <option value="medical" className="bg-[rgb(3,6,8)]">Medical Malpractice</option>
              <option value="workers" className="bg-[rgb(3,6,8)]">Workers' Compensation</option>
            </select>
          </div>
          <div>
            <label className="system-label block mb-3" style={{ color: "#6B7280" }}>State</label>
            <input
              type="text"
              value={formData.state}
              onChange={e => updateField("state", e.target.value)}
              placeholder="e.g., California"
              className="w-full h-12 px-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none transition-all duration-300 focus:bg-white/[0.06]"
            />
          </div>
          <div>
            <label className="system-label block mb-3" style={{ color: "#6B7280" }}>Monthly Budget</label>
            <select
              value={formData.budget}
              onChange={e => updateField("budget", e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white focus:border-primary/50 focus:outline-none transition-all duration-300 focus:bg-white/[0.06]"
            >
              <option value="" className="bg-[rgb(3,6,8)]">Select budget range</option>
              <option value="5k-10k" className="bg-[rgb(3,6,8)]">$5,000 – $10,000</option>
              <option value="10k-25k" className="bg-[rgb(3,6,8)]">$10,000 – $25,000</option>
              <option value="25k-50k" className="bg-[rgb(3,6,8)]">$25,000 – $50,000</option>
              <option value="50k+" className="bg-[rgb(3,6,8)]">$50,000+</option>
            </select>
          </div>
          <Button variant="gradient" onClick={() => setStep(2)} className="w-full h-12 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105">
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Confirm Access */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="system-label block mb-3" style={{ color: "#6B7280" }}>Work Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => updateField("email", e.target.value)}
              placeholder="partner@yourfirm.com"
              className="w-full h-12 px-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none transition-all duration-300 focus:bg-white/[0.06]"
            />
          </div>
          
          {/* Pre-Funded Wallet Commitment */}
          <div className="glass-panel p-5 flex items-start gap-3 rounded-lg" style={{ background: "rgba(139, 92, 246, 0.05)", borderColor: "rgba(139, 92, 246, 0.2)" }}>
            <Wallet className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#8B5CF6" }} />
            <p className="text-sm leading-relaxed" style={{ color: "#B0B8C4" }}>
              <strong>Pre-Funded Wallet:</strong> You fund your wallet. We deliver qualified opportunities. You only pay when a case meets our mutual agreement.
            </p>
          </div>

          <div className="glass-panel p-5 flex items-start gap-3 rounded-lg">
            <Shield className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "oklch(78% .13 195)" }} />
            <p className="text-sm leading-relaxed" style={{ color: "#B0B8C4" }}>
              Your information is reviewed by our qualification team. We assess market fit, capacity, and commitment.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="cta-secondary flex-1 h-12 rounded-lg font-medium transition-all duration-300 hover:opacity-80">Back</button>
            <button
              onClick={() => {
                alert("Qualification request submitted. Our team will review your firm within 48 hours.");
              }}
              className="cta-primary flex-1 h-12 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Claim Your Market Access <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-xs" style={{ color: "#6B7280" }}>
            By submitting, you agree to our qualification review process. No payment required at this stage.
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */
export default function TestingLawFirmPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative overflow-hidden" style={{ background: "rgb(3, 6, 8)" }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>
      {/* ── Background Glow Orbs ── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="glow-orb absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)" }} />
        <div className="glow-orb absolute top-[40%] right-[-15%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", animationDelay: "3s" }} />
        <div className="glow-orb absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)", animationDelay: "6s" }} />
      </div>

      {/* ── Navigation ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrollY > 50 ? "rgba(3, 6, 8, 0.85)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
          borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
          <a href="/" className="flex items-center gap-2 group transition-opacity duration-300 hover:opacity-80">
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wider" style={{ color: "#F1F3F5", letterSpacing: "0.15em" }}>
                CASEPORT
              </span>
              <span className="text-xs" style={{ color: "oklch(78% .13 195)", letterSpacing: "0.1em", marginTop: "4px" }}>
                CASE FLOW WITHOUT GUESSWORK
              </span>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium transition-colors duration-300 hover:text-white" style={{ color: "#B0B8C4" }}>How It Works</a>
            <a href="#qualification" className="text-sm font-medium transition-colors duration-300 hover:text-white" style={{ color: "#B0B8C4" }}>Qualification</a>
            <a href="#faq" className="text-sm font-medium transition-colors duration-300 hover:text-white" style={{ color: "#B0B8C4" }}>FAQ</a>
            <Button variant="gradient" asChild className="text-sm h-10 px-5 flex items-center gap-1.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"><a href="#access" >
              Claim Your Access <ArrowRight className="w-3.5 h-3.5" />
            </a></Button>
          </div>
          <Button variant="gradient" asChild className="md:hidden text-sm h-10 px-5 flex items-center gap-1.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"><a href="#access" >
            Claim Access
          </a></Button>
        </div>
      </nav>

      <div className="relative z-10">
        {/* ═══════════════════════════════════════════
            SECTION 1: HERO — PASTOR: Problem + Amplify
            ═══════════════════════════════════════════ */}
        <section className="relative pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20">
          <div className="container">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
              {/* Left: Copy */}
              <div>
                
                
                <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all duration-300 mb-8 w-fit group backdrop-blur-md">
  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
  Back to Home
</Link>
<div className="block" />
<SystemLabel>Case Acquisition System</SystemLabel>
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight mb-5"
                  style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}
                >
                  Your Firm Deserves Disciplined Case Flow.
                  <br />
                  <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">Not Lead Roulette.</span>
                </h1>
                {/* Hidden H1 for SEO clarity */}
                <h1 style={{ display: "none" }}>Case Acquisition System for Personal Injury Law Firms - www.CasePort.io</h1>
                <p className="text-base md:text-lg leading-relaxed mb-4 max-w-xl" style={{ color: "#B0B8C4" }}>
                  Most personal injury firms waste <span style={{ color: "oklch(78% .13 195)" }}>$15,000–$50,000 monthly</span> on leads that never convert. Shared lists. Unqualified contacts. Zero accountability.
                </p>
                <p className="text-sm leading-relaxed mb-6 max-w-xl" style={{ color: "#B0B8C4" }}>
                  The average PI firm loses <span style={{ color: "oklch(78% .13 195)" }}>40–60% of its marketing spend to lead decay</span> — opportunities that go cold before intake touches them. We recover <span style={{ color: "oklch(78% .13 195)" }}>34% of those cold leads</span>. Minimum firm size: <span style={{ color: "oklch(78% .13 195)" }}>5+ attorneys</span>. Minimum monthly budget: <span style={{ color: "oklch(78% .13 195)" }}>$8,000</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Button variant="gradient" asChild className="text-sm h-10 px-5 flex items-center gap-1.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"><a href="/request-access" >
                    Claim Your Market Access <ArrowRight className="w-4 h-4" />
                  </a></Button>
                  <a href="#objections" className="cta-secondary h-12 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 hover:opacity-80">
                    See How It Works <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Trust Micro-Signals */}
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>
                    <Lock className="w-3.5 h-3.5" style={{ color: "oklch(78% .13 195)" }} /> Market-Capped Access
                  </span>
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>
                    <Shield className="w-3.5 h-3.5" style={{ color: "oklch(78% .13 195)" }} /> ABA Compliant
                  </span>
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>
                    <FileCheck className="w-3.5 h-3.5" style={{ color: "oklch(78% .13 195)" }} /> Review-First Onboarding
                  </span>
                </div>
              </div>

              {/* Right: System Status Card */}
              <div>
                <GlassCard>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
                    <span className="text-xs font-medium" style={{ color: "#10B981", letterSpacing: "0.1em", textTransform: "uppercase" }}>Operational</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm mb-2" style={{ color: "#6B7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Opportunities Routed Today</p>
                      <p className="text-4xl font-bold" style={{ color: "oklch(78% .13 195)" }}>47</p>
                    </div>
                    <div>
                      <p className="text-sm mb-2" style={{ color: "#6B7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Avg. Qualification Score</p>
                      <p className="text-4xl font-bold" style={{ color: "oklch(78% .13 195)" }}>84/100</p>
                    </div>
                    <div>
                      <p className="text-sm mb-2" style={{ color: "#6B7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Lead Decay Rate</p>
                      <p className="text-4xl font-bold" style={{ color: "#10B981" }}>0.0%</p>
                    </div>
                    <div className="pt-4 border-t border-white/[0.06]">
                      <p className="text-sm mb-2" style={{ color: "#6B7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Market Capacity</p>
                      <p className="text-lg font-bold" style={{ color: "#F59E0B" }}>2 slots available</p>
                      <p className="text-xs mt-2" style={{ color: "#6B7280" }}>3 firms per metro. Limited availability.</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 2: STATS STRIP
            ═══════════════════════════════════════════ */}
        <Section className="bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <StatBlock value="$2.4M+" label="Case Value Routed Monthly" accent="gold" />
              <StatBlock value="94%" label="Qualification Accuracy" accent="cyan" />
              <StatBlock value="0%" label="Lead Decay Rate" accent="green" />
              <StatBlock value="3" label="Firms Per Metro Cap" accent="cyan" />
            </div>
            <p className="text-center text-xs mt-12" style={{ color: "#6B7280" }}>Results vary based on market, practice areas, and firm capacity. For illustrative purposes only.</p>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 2.5: REAL SCARCITY COUNTER
            ═══════════════════════════════════════════ */}
        <Section>
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-2xl mx-auto">
            <RealScarcityCounter market="default" />
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 3: CASE STUDIES
            ═══════════════════════════════════════════ */}
        <Section>
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Real Results</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                Firms Are Signing Cases.
                <br />
                <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">Not Wasting Money.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { firm: "Texas PI Firm", quote: "Signed 23 cases in Q1. $1.8M case value. First time we've had predictable case flow.", metric: "23", label: "cases signed" },
                { firm: "California Slip & Fall", quote: "Replaced 3 lead vendors. Cut marketing spend by 40%. Better quality leads.", metric: "40%", label: "spend reduction" },
                { firm: "Florida Auto Accident", quote: "Went from 8 to 18 cases per month. Zero lead decay. System does the work.", metric: "+125%", label: "case volume" },
              ].map((item, i) => (
                <GlassCard key={i} className="group cursor-pointer transition-all duration-500 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <Award className="w-6 h-6" style={{ color: "oklch(78% .13 195)" }} />
                    <span className="text-xs font-medium" style={{ color: "oklch(78% .13 195)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Verified</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: "#F1F3F5" }}>{item.firm}</h3>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: "#B0B8C4" }}>"{item.quote}"</p>
                  <div className="pt-4 border-t border-white/[0.06]">
                    <p className="text-3xl font-bold mb-1" style={{ color: "oklch(78% .13 195)" }}>{item.metric}</p>
                    <p className="text-xs" style={{ color: "#6B7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>{item.label}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 4: LEAD SCORING
            ═══════════════════════════════════════════ */}
        <Section id="how-it-works">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Proprietary Intelligence</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                12-Dimension Lead Scoring.
                <br />
                <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">Built for PI Firms.</span>
              </h2>
              <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#B0B8C4" }}>
                Every case acquisition opportunity passes through our proprietary qualification engine — scoring across injury severity, liability indicators, insurance coverage signals, geographic relevance, and 8 additional dimensions specific to personal injury case viability.
              </p>
            </div>

            <GlassCard>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-lg font-bold mb-8" style={{ color: "#F1F3F5" }}>Scoring Dimensions</h3>
                  <LeadScoreBar label="Injury Severity" score={92} color="oklch(78% .13 195)" />
                  <LeadScoreBar label="Liability Strength" score={88} color="oklch(78% .13 195)" />
                  <LeadScoreBar label="Insurance Coverage" score={85} color="oklch(78% .13 195)" />
                  <LeadScoreBar label="Geographic Fit" score={91} color="oklch(78% .13 195)" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-8" style={{ color: "#F1F3F5" }}>Advanced Metrics</h3>
                  <LeadScoreBar label="Case Value Potential" score={87} color="#F59E0B" />
                  <LeadScoreBar label="Response Readiness" score={94} color="oklch(78% .13 195)" />
                  <LeadScoreBar label="Retention Probability" score={89} color="oklch(78% .13 195)" />
                  <LeadScoreBar label="Settlement Timeline" score={86} color="oklch(78% .13 195)" />
                </div>
              </div>
            </GlassCard>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 5: ZERO LEAD DECAY
            ═══════════════════════════════════════════ */}
        <Section>
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Recovery Protocol</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                Zero Lead Decay Protocol.
                <br />
                <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">34% Recovery Rate.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard>
                <RefreshCw className="w-8 h-8 mb-4" style={{ color: "oklch(78% .13 195)" }} />
                <h3 className="text-xl font-bold mb-3" style={{ color: "#F1F3F5" }}>Lead Recovery</h3>
                <p style={{ color: "#B0B8C4" }}>Opportunities that stall after first contact enter our structured recovery system. Follow-up sequences, re-engagement protocols, and timing-based outreach designed to recover value that would otherwise be lost.</p>
              </GlassCard>
              <GlassCard>
                <TrendingUp className="w-8 h-8 mb-4" style={{ color: "#F59E0B" }} />
                <h3 className="text-xl font-bold mb-3" style={{ color: "#F1F3F5" }}>Lead Recycling</h3>
                <p style={{ color: "#B0B8C4" }}>Cases that don't convert on first contact are automatically recycled through our system at optimal timing intervals. We've identified the precise windows when prospects are most receptive to re-engagement.</p>
              </GlassCard>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 5.5: ROI CALCULATOR
            ═══════════════════════════════════════════ */}
        <Section>
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Financial Impact</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                See Your Potential ROI.
                <br />
                <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">Real Numbers. Real Results.</span>
              </h2>
            </div>
            <ROICalculator />
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 6: QUALIFICATION STANDARDS
            ═══════════════════════════════════════════ */}
        <Section id="qualification">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Verified Standards</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                We Only Work With Firms That Meet Our Standards.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Users, title: "Firm Size", desc: "Minimum 5+ attorneys. We focus on firms with capacity to handle volume." },
                { icon: Wallet, title: "Budget Commitment", desc: "Minimum $8,000/month. This ensures serious commitment and allows us to build your market." },
                { icon: Target, title: "Practice Focus", desc: "Auto accidents, slip & fall, medical malpractice. We specialize in high-value PI cases." },
                { icon: FileCheck, title: "Intake Discipline", desc: "Your firm must have documented intake protocols. We can't fix broken internal processes." },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <GlassCard key={i}>
                    <Icon className="w-8 h-8 mb-4" style={{ color: "oklch(78% .13 195)" }} />
                    <h3 className="text-lg font-bold mb-3" style={{ color: "#F1F3F5" }}>{item.title}</h3>
                    <p style={{ color: "#B0B8C4" }}>{item.desc}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 7: RISK REVERSAL
            ═══════════════════════════════════════════ */}
        <Section>
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <GlassCard className="border-2" style={{ borderColor: "rgba(139, 92, 246, 0.3)", borderWidth: "2px" }}>
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 mt-1 shrink-0" style={{ color: "#8B5CF6" }} />
                <div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: "#F1F3F5" }}>90-Day Commitment Guarantee</h3>
                  <p className="mb-4" style={{ color: "#B0B8C4" }}>
                    Commit to 90 days with www.CasePort.io. If you don't see measurable case flow improvement (minimum 15% increase in signed cases or 20% reduction in cost-per-case), we'll refund your unused wallet balance. No questions. No fine print. Minimum commitment: $8,000. Refund processed within 5 business days.
                  </p>
                  <p style={{ color: "#6B7280", fontSize: "14px" }}>
                    This guarantee only applies to firms that meet our qualification standards and follow our onboarding protocol. We're betting on ourselves because we know the system works.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 8: TRANSPARENT REPORTING
            ═══════════════════════════════════════════ */}
        <Section>
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Full Transparency</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                You See Everything.
                <br />
                <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">No Black Box.</span>
              </h2>
            </div>

            <GlassCard>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left py-4 px-4" style={{ color: "#6B7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Metric</th>
                      <th className="text-left py-4 px-4" style={{ color: "#6B7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>This Month</th>
                      <th className="text-left py-4 px-4" style={{ color: "#6B7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { metric: "Opportunities Routed", value: "47", trend: "↑ 12%" },
                      { metric: "Avg. Qualification Score", value: "84/100", trend: "↑ 3%" },
                      { metric: "Lead Decay Rate", value: "0.0%", trend: "↓ 100%" },
                      { metric: "Cases Signed", value: "12", trend: "↑ 18%" },
                      { metric: "Avg. Case Value", value: "$67,500", trend: "↑ 8%" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors duration-300">
                        <td className="py-4 px-4" style={{ color: "#F1F3F5" }}>{row.metric}</td>
                        <td className="py-4 px-4" style={{ color: "oklch(78% .13 195)" }}>{row.value}</td>
                        <td className="py-4 px-4" style={{ color: "#10B981" }}>{row.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 9: COMPLIANCE
            ═══════════════════════════════════════════ */}
        <Section>
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Legal Compliance</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                Built for ABA Compliance.
                <br />
                <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">No Shortcuts.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard>
                <FileCheck className="w-8 h-8 mb-4" style={{ color: "oklch(78% .13 195)" }} />
                <h3 className="text-lg font-bold mb-3" style={{ color: "#F1F3F5" }}>ABA Rule 7.1 Compliance</h3>
                <p style={{ color: "#B0B8C4" }}>All communications are truthful and not misleading. No guaranteed outcomes. No false claims about case value or settlement amounts.</p>
              </GlassCard>
              <GlassCard>
                <Shield className="w-8 h-8 mb-4" style={{ color: "oklch(78% .13 195)" }} />
                <h3 className="text-lg font-bold mb-3" style={{ color: "#F1F3F5" }}>ABA Rule 1.6 Confidentiality</h3>
                <p style={{ color: "#B0B8C4" }}>Your firm's data, metrics, and case information are protected. We never share client data with other firms or third parties.</p>
              </GlassCard>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 8: VIDEO TESTIMONIALS
            ═══════════════════════════════════════════ */}
        <Section>
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Real Results From Real Attorneys</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                Watch How CasePort Transformed Their Practice.
              </h2>
            </div>
            <VideoTestimonials />
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 9: INTERACTIVE DASHBOARD
            ═══════════════════════════════════════════ */}
        <Section>
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Real-Time Intelligence</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                Your Dashboard.
                <br />
                <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">Full Transparency.</span>
              </h2>
              <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#B0B8C4" }}>
                Monitor every case from qualification through close. Real-time analytics, lead scoring transparency, and performance metrics all in one institutional-grade dashboard.
              </p>
            </div>
            <InteractiveDashboard />
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 10: FAQ
            ═══════════════════════════════════════════ */}
        <Section id="faq">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Questions</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                Everything You Want to Know.
              </h2>
            </div>

            <GlassCard hover={false}>
              <FAQItem
                question="What is a case acquisition system?"
                answer="A case acquisition system is end-to-end infrastructure that goes beyond simple lead generation. It encompasses demand capture, qualification screening, intake control, opportunity routing, and recovery protocols. Unlike buying leads from a vendor, a case acquisition system gives law firms more control over the entire pipeline from initial search intent to signed retainer."
              />
              <FAQItem
                question="How is www.CasePort.io different from other personal injury lead generation companies?"
                answer="Most lead gen companies sell shared leads to 5+ firms per market. We limit access to 3 firms per metro maximum. We also implement a 6-layer qualification framework before any opportunity reaches your intake, and we have structured recovery protocols for opportunities that stall. This is not just volume — it's disciplined, controlled case flow."
              />
              <FAQItem
                question="How do I get exclusive personal injury leads?"
                answer="Apply for access through our qualification process. We evaluate your firm size, capacity, practice areas, and commitment level. Once approved, we configure your market zone and activate demand capture infrastructure in your area. You'll receive screened case opportunities routed directly to your intake team."
              />
              <FAQItem
                question="What is the cost of personal injury lead generation with www.CasePort.io?"
                answer="Pricing varies based on market, case type, and volume tier. Minimum monthly commitment is $8,000. We discuss pricing during the review process. You fund a pre-funded wallet, and you only pay when a case meets our mutual agreement. No manual invoicing. No surprises."
              />
              <FAQItem
                question="How do you handle car accident cases and other case types?"
                answer="We specialize in high-intent personal injury cases: auto accidents, slip & fall, medical malpractice, and workers' compensation. Our qualification framework is built specifically for these case types. We score opportunities across injury severity, liability indicators, insurance coverage signals, and geographic relevance."
              />
              <FAQItem
                question="Are you compliant with ABA advertising rules?"
                answer="Yes. All communications are truthful and not misleading. We make no guaranteed outcomes. We comply with ABA Rule 7.1 (advertising standards) and ABA Rule 1.6 (confidentiality). Your firm's data and case information are protected and never shared with other firms."
              />
            </GlassCard>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SECTION 11: CTA FORM
            ═══════════════════════════════════════════ */}
        <Section id="access">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-2xl mx-auto">
            <div className="text-center mb-16">
              
                
                <SystemLabel>Get Started</SystemLabel>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: "#F1F3F5", letterSpacing: "-0.04em" }}>
                Ready to Stop Chasing Leads?
              </h2>
              <p className="text-lg" style={{ color: "#B0B8C4" }}>
                Apply for market access. Our team reviews your firm within 48 hours.
              </p>
            </div>

            <div className="flex justify-center">
              <QualificationForm />
            </div>
          </div>
        </Section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/[0.06] py-12 md:py-16">
          <div className="container">
            {/* Internal Linking for Topic Clusters */}
            <nav className="mb-12 pb-8 border-b border-white/[0.06]">
              <p className="text-xs font-bold mb-4" style={{ color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>Related Topics</p>
              <div className="flex flex-wrap gap-3">
                <a href="#how-it-works" className="text-sm px-3 py-2 rounded-lg transition-colors duration-300" style={{ background: "rgba(255,255,255,0.04)", color: "#B0B8C4" }}>How It Works</a>
                <a href="#lead-scoring" className="text-sm px-3 py-2 rounded-lg transition-colors duration-300" style={{ background: "rgba(255,255,255,0.04)", color: "#B0B8C4" }}>Lead Scoring</a>
                <a href="#qualification" className="text-sm px-3 py-2 rounded-lg transition-colors duration-300" style={{ background: "rgba(255,255,255,0.04)", color: "#B0B8C4" }}>Qualification</a>
                <a href="#faq" className="text-sm px-3 py-2 rounded-lg transition-colors duration-300" style={{ background: "rgba(255,255,255,0.04)", color: "#B0B8C4" }}>FAQ</a>
              </div>
            </nav>
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <p className="font-bold mb-4" style={{ color: "#F1F3F5" }}>CASEPORT</p>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>Case Acquisition System for Personal Injury Law Firms</p>
              </div>
              <div>
                <p className="font-bold mb-4" style={{ color: "#F1F3F5" }}>Product</p>
                <ul className="space-y-2">
                  <li><a href="#how-it-works" style={{ color: "#B0B8C4", fontSize: "14px" }} className="hover:text-white transition-colors duration-300">How It Works</a></li>
                  <li><a href="#qualification" style={{ color: "#B0B8C4", fontSize: "14px" }} className="hover:text-white transition-colors duration-300">Qualification</a></li>
                  <li><a href="#faq" style={{ color: "#B0B8C4", fontSize: "14px" }} className="hover:text-white transition-colors duration-300">FAQ</a></li>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-4" style={{ color: "#F1F3F5" }}>Legal</p>
                <ul className="space-y-2">
                  <li><a href="#" style={{ color: "#B0B8C4", fontSize: "14px" }} className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                  <li><a href="#" style={{ color: "#B0B8C4", fontSize: "14px" }} className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-4" style={{ color: "#F1F3F5" }}>Contact</p>
                <a href="mailto:access@caseport.io" style={{ color: "#B0B8C4", fontSize: "14px" }} className="hover:text-white transition-colors duration-300">access@caseport.io</a>
              </div>
            </div>
            <div className="border-t border-white/[0.06] pt-8 text-center">
              <p style={{ color: "#6B7280", fontSize: "12px" }}>© 2026 www.CasePort.io. All rights reserved. Market-capped. Review-first. For qualified firms only.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "name": "www.CasePort.io",
              "url": "https://www.caseport.io",
              "logo": "https://www.caseport.io/logo.png",
              "description": "Premium case acquisition system for personal injury law firms. Market-capped to 3 firms per metro. Review-first onboarding. Zero lead decay.",
              "sameAs": ["https://www.caseport.io"],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "access@caseport.io",
                "contactType": "Sales",
                "availableLanguage": "en"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              }
            },
            {
              "@type": "LocalBusiness",
              "name": "www.CasePort.io - Personal Injury Case Acquisition",
              "description": "Market-capped case acquisition system for personal injury law firms across the United States",
              "url": "https://www.caseport.io/for-law-firms",
              "areaServed": [{"@type": "State", "name": "US"}],
              "serviceArea": "US",
              "priceRange": "$$"
            },
            {
              "@type": "Service",
              "name": "Case Acquisition System for Personal Injury Law Firms",
              "description": "Market-capped, review-first case acquisition system with 12-dimension lead scoring, zero lead decay protocol, and pre-funded wallet model",
              "url": "https://www.caseport.io/for-law-firms",
              "provider": {
                "@type": "Organization",
                "name": "www.CasePort.io",
                "url": "https://www.caseport.io"
              },
              "areaServed": [{"@type": "Country", "name": "US"}],
              "serviceType": "Legal Lead Generation",
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "USD",
                "lowPrice": "8000",
                "highPrice": "50000",
                "offerCount": "4",
                "availability": "https://schema.org/LimitedAvailability"
              }
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.caseport.io"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "For Law Firms",
                  "item": "https://www.caseport.io/for-law-firms"
                }
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is a case acquisition system?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A case acquisition system is end-to-end infrastructure that goes beyond simple lead generation. It includes demand capture, qualification, routing, recovery, and retained value optimization. www.CasePort.io provides market-capped access (3 firms per metro), review-first onboarding, and zero lead decay guarantees."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is www.CasePort.io different from other personal injury lead generation companies?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We limit access to 3 firms per metro maximum with a 6-layer qualification framework. We guarantee zero lead decay, recover 34% of cold leads, and use 12-dimension lead scoring. Our review-first onboarding and pre-funded wallet model ensure accountability and alignment."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I get exclusive personal injury leads?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Apply for market access through our qualification form. We assess your firm's capacity, practice areas, and commitment. Minimum requirements: 5+ attorneys, $8,000+ monthly budget, auto accident or slip & fall focus. Qualified firms gain exclusive access to pre-screened opportunities in their metro area."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the cost of personal injury lead generation with www.CasePort.io?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pricing ranges from $8,000 to $50,000+ monthly based on practice area, market, and firm capacity. We use a pre-funded wallet model: you fund your account, we deliver qualified opportunities, you only pay when a case meets our mutual agreement. No manual invoicing. Transparent reporting dashboard included."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do you handle car accident cases and other case types?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We specialize in auto accidents, slip & fall, medical malpractice, and workers' compensation. Each case type has its own 12-dimension scoring framework. We route cases based on your firm's stated practice areas and capacity. Average case value ranges from $8,500 to $125,000 depending on case type and market."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are you compliant with ABA advertising rules?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. We comply with ABA Model Rules 7.1 (communications about services) and 1.6 (confidentiality). All case opportunities are pre-qualified and routed to ensure ethical compliance. We maintain strict confidentiality of firm data and case information. Our review-first onboarding ensures market-capped exclusivity and prevents conflicts."
                  }
                }
              ]
            }
          ]
        })}
      </script>
    
      {/* ── Scroll to Top Button ── */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#7C5CFF] text-white shadow-[0_0_20px_rgba(0,180,216,0.3)] transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-[0_0_30px_rgba(124,92,255,0.4)] ${
          scrollY > 400 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </main>

  );
}

