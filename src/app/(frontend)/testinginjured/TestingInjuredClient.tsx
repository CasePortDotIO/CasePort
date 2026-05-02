'use client'
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown, Clock, Shield, Zap, FileText } from "lucide-react"

const BRAND_COLORS = {
  cream: "#f9f5ef",
  creamAlt: "#f2ebe0",
  creamDeep: "#ebe3d5",
  teal: "#1a4a5a",
  tealMid: "#255e72",
  tealSoft: "#e4f0f3",
  terra: "#c4714a",
  terraHover: "#d4855e",
  terraPale: "#fdf0ea",
  sage: "#4a8c7e",
  gold: "#c9a84c",
  goldPale: "#fdf6e3",
  ink: "#1c2b32",
  bodyText: "#3c5260",
  muted: "#7a9299",
  border: "#ddd5c8",
  borderSoft: "#e8e2d8",
  white: "#ffffff",
  green: "#4caf7d",
}

export default function TestingInjuredClient() {
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToForm = () => {
    const formElement = document.getElementById("case-review")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 z-[1000] pointer-events-none opacity-[0.028]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise'/%3E%3C/filter%3E%3Crect width='400' height='400' fill='%23000' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* AEO Hidden Blocks */}
      <div className="sr-only aeo-hero" aria-label="Quick answer: what to do after a car accident">
        Hurt in an accident? Get medical attention first even if you feel fine. Call the police. Document everything. Do not give recorded statements to insurers before understanding your rights. Start a free 2-minute case review.
      </div>

      <div className="sr-only aeo-steps" aria-label="Step by step guide what to do after car accident">
        What to do after a car accident: (1) Get medical attention immediately (2) Call the police and file an official report (3) Photograph the scene (4) Do not give recorded statements (5) Start a free case review.
      </div>

      <div className="sr-only aeo-case" aria-label="Do I have a personal injury case">
        You likely have a personal injury case if: someone else caused the accident, you sustained injuries, the accident happened within your state filing deadline, and you sought medical treatment.
      </div>

      <main className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.cream }}>
        {/* NAV */}
        <nav
          ref={navRef}
          className="fixed top-0 left-0 right-0 z-40 h-[58px] transition-all duration-300"
          style={{
            backgroundColor: isScrolled ? "rgba(249,245,239,0.95)" : "rgba(249,245,239,0.9)",
            backdropFilter: "blur(16px)",
            borderBottom: isScrolled ? `1px solid ${BRAND_COLORS.borderSoft}` : "none",
            boxShadow: isScrolled ? `0 1px 12px rgba(26,74,90,0.06)` : "none",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <a href="/" className="flex flex-col no-underline">
              <div className="text-sm font-bold tracking-widest" style={{ color: BRAND_COLORS.teal, letterSpacing: "0.16em" }}>CASEPORT</div>
              <div className="text-xs font-semibold tracking-wider uppercase" style={{ color: BRAND_COLORS.sage, letterSpacing: "0.1em" }}>Injured? We can help.</div>
            </a>
            <div className="flex items-center gap-4">
              <a href="tel:+18002273669" className="hidden sm:flex items-center gap-2 text-sm font-semibold" style={{ color: BRAND_COLORS.bodyText }}>📞 1-800-CASE-NOW</a>
              <Button onClick={scrollToForm} className="text-xs sm:text-sm font-bold px-4 sm:px-[18px] py-2 rounded-full" style={{ background: BRAND_COLORS.terra, color: BRAND_COLORS.white }}>Start Free Review</Button>
            </div>
          </div>
        </nav>

        {/* BREADCRUMB */}
        <div className="pt-[72px] pb-6 px-6" style={{ backgroundColor: BRAND_COLORS.cream }}>
          <div className="max-w-2xl mx-auto">
            <nav className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: BRAND_COLORS.muted }}>
              <a href="/" className="hover:text-teal transition-colors" style={{ color: BRAND_COLORS.muted }}>Home</a>
              <span aria-hidden="true">›</span>
              <span aria-current="page" style={{ color: BRAND_COLORS.muted }}>Injured in an Accident</span>
            </nav>
          </div>
        </div>

        {/* HERO */}
        <motion.section
          className="relative min-h-[calc(100vh-58px)] flex items-center justify-center px-6 py-16 overflow-hidden"
          style={{ backgroundColor: BRAND_COLORS.cream }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 35%, rgba(201,168,76,0.11) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(74,140,126,0.08) 0%, transparent 60%)` }} />
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <motion.div className="mb-8 flex justify-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-lg" role="img" aria-label="Two hands reaching toward each other">
                <circle cx="110" cy="110" r="105" fill={BRAND_COLORS.terraPale} opacity="0.3" />
                <path d="M 60 140 Q 40 120 50 90 Q 60 70 80 75 Q 85 85 80 100 Q 75 115 70 130" fill={BRAND_COLORS.terra} stroke={BRAND_COLORS.terra} strokeWidth="2" />
                <path d="M 160 140 Q 180 120 170 90 Q 160 70 140 75 Q 135 85 140 100 Q 145 115 150 130" fill={BRAND_COLORS.sage} stroke={BRAND_COLORS.sage} strokeWidth="2" />
                <circle cx="110" cy="105" r="8" fill={BRAND_COLORS.gold} />
                <circle cx="110" cy="105" r="12" fill="none" stroke={BRAND_COLORS.gold} strokeWidth="1" opacity="0.5" />
              </svg>
            </motion.div>
            <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: BRAND_COLORS.ink }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
              Hurt in an accident?<br /><span style={{ color: BRAND_COLORS.teal }}>We can help.</span>
            </motion.h1>
            <motion.p className="text-lg sm:text-xl mb-8 leading-relaxed" style={{ color: BRAND_COLORS.bodyText }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
              Free private 2-minute case review. Attorney matched within 15 minutes. No obligation. Active in 38 states.
            </motion.p>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <Button onClick={scrollToForm} className="text-base font-bold px-8 py-3 rounded-full" style={{ background: BRAND_COLORS.terra, color: BRAND_COLORS.white }}>
                Start Your Free Review
              </Button>
            </motion.div>
            <motion.div className="mt-12 flex justify-center" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown size={24} style={{ color: BRAND_COLORS.teal }} />
            </motion.div>
          </div>
        </motion.section>

        {/* PULL QUOTE */}
        <motion.section className="py-16 sm:py-24 px-6" style={{ backgroundColor: BRAND_COLORS.teal }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="max-w-2xl mx-auto text-center">
            <blockquote className="text-2xl sm:text-3xl font-light leading-relaxed" style={{ color: BRAND_COLORS.white }}>
              "The first serious response often wins. Speed is one of the few levers that can let a smaller player beat a bigger one."
            </blockquote>
            <p className="mt-4 text-sm" style={{ color: BRAND_COLORS.tealSoft }}>— CasePort Intelligence Report</p>
          </div>
        </motion.section>

        {/* CASE TYPES */}
        <motion.section className="py-16 sm:py-24 px-6" style={{ backgroundColor: BRAND_COLORS.creamAlt }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center" style={{ color: BRAND_COLORS.ink }}>We handle all accident types</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Auto Accidents", "Truck Accidents", "Motorcycle Accidents", "Other Injuries"].map((type, idx) => (
                <motion.div key={idx} className="px-6 py-4 rounded-full text-center font-semibold" style={{ backgroundColor: BRAND_COLORS.white, color: BRAND_COLORS.teal, border: `1px solid ${BRAND_COLORS.borderSoft}` }} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>{type}</motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* WHY NOW */}
        <motion.section className="py-16 sm:py-24 px-6" style={{ backgroundColor: BRAND_COLORS.cream }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center" style={{ color: BRAND_COLORS.ink }}>Why timing matters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[{ icon: Clock, title: "Evidence degrades", desc: "Photos fade, witnesses move away, memories become unreliable." }, { icon: Shield, title: "Statute of limitations", desc: "Most states give you 2 years to file. Acting now protects your rights." }, { icon: Zap, title: "Speed wins", desc: "The first serious response often wins. Quick action creates advantage." }].map((item, idx) => (
                <motion.div key={idx} className="p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.borderSoft}` }} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <item.icon size={32} style={{ color: BRAND_COLORS.terra, marginBottom: "12px" }} />
                  <h3 className="font-bold mb-2" style={{ color: BRAND_COLORS.ink }}>{item.title}</h3>
                  <p style={{ color: BRAND_COLORS.bodyText, fontSize: "14px" }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* MID-PAGE CTA */}
        <motion.section className="py-16 sm:py-24 px-6" style={{ backgroundColor: BRAND_COLORS.tealSoft }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: BRAND_COLORS.teal }}>Ready to get started?</h2>
            <p className="text-lg mb-8" style={{ color: BRAND_COLORS.bodyText }}>Your free case review takes just 2 minutes. No obligation. No upfront cost.</p>
            <Button onClick={scrollToForm} className="text-base font-bold px-8 py-3 rounded-full" style={{ background: BRAND_COLORS.terra, color: BRAND_COLORS.white }}>
              Get Your Free Review
            </Button>
          </div>
        </motion.section>

        {/* HOW IT WORKS */}
        <motion.section className="py-16 sm:py-24 px-6" style={{ backgroundColor: BRAND_COLORS.white }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center" style={{ color: BRAND_COLORS.ink }}>How it works</h2>
            <div className="space-y-8">
              {[{ step: "1", title: "Answer a few guided questions", desc: "Tell us about your accident, injuries, and where things stand today. No legal expertise needed. Mostly tap-based. Takes about 2 minutes.", tag: "🔒 AES-256 encrypted end to end" }, { step: "2", title: "We review your situation honestly", desc: "We look at accident type, timing, location, and injury status. We do not send everyone through. If it does not fit, we tell you that directly.", tag: "✅ Submitting does not create an attorney-client relationship" }, { step: "3", title: "If it fits, we make the right connection", desc: "If your situation aligns, we connect you with an independent qualified attorney in your area. No pressure. No upfront cost to you.", tag: "⚡ Attorney matched within 15 minutes" }].map((item, idx) => (
                <motion.div key={idx} className="flex gap-6" initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1, duration: 0.5 }} viewport={{ once: true }}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: BRAND_COLORS.tealSoft, color: BRAND_COLORS.teal, border: `2px solid ${BRAND_COLORS.teal}` }}>{item.step}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2" style={{ color: BRAND_COLORS.ink }}>{item.title}</h3>
                    <p style={{ color: BRAND_COLORS.bodyText, marginBottom: "10px" }}>{item.desc}</p>
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `rgba(74,140,126,0.08)`, color: BRAND_COLORS.sage, border: `1px solid rgba(74,140,126,0.18)` }}>{item.tag}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* WHAT HAPPENS NEXT */}
        <motion.section className="py-16 sm:py-24 px-6" style={{ backgroundColor: BRAND_COLORS.creamAlt }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center" style={{ color: BRAND_COLORS.ink }}>Here is exactly what happens next</h2>
            <div className="space-y-8">
              {[{ icon: FileText, title: "You submit your intake", time: "Immediately" }, { icon: Shield, title: "We evaluate your case", time: "Within 2 minutes" }, { icon: Zap, title: "Attorney matched to your case", time: "Within 15 minutes" }].map((item, idx) => (
                <motion.div key={idx} className="flex gap-6 relative" initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1, duration: 0.5 }} viewport={{ once: true }}>
                  {idx < 2 && <div className="absolute left-6 top-12 w-0.5 h-12" style={{ background: `linear-gradient(to bottom, ${BRAND_COLORS.border}, transparent)` }} />}
                  <div className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.white, border: `2px solid ${BRAND_COLORS.borderSoft}` }}><item.icon size={24} style={{ color: BRAND_COLORS.teal }} /></div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold" style={{ color: BRAND_COLORS.ink }}>{item.title}</h3>
                    <p style={{ color: BRAND_COLORS.muted, fontSize: "14px" }}>{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* TESTIMONIALS */}
        <motion.section className="py-16 sm:py-24 px-6" style={{ backgroundColor: BRAND_COLORS.white }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center" style={{ color: BRAND_COLORS.ink }}>What people are saying</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[{ quote: "I was overwhelmed after my accident. CasePort made it simple.", author: "Sarah M.", location: "Texas" }, { quote: "Connected with an attorney within minutes. No hassle.", author: "James R.", location: "California" }].map((testimonial, idx) => (
                <motion.div key={idx} className="p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.creamAlt, border: `1px solid ${BRAND_COLORS.borderSoft}` }} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <p className="mb-4 italic" style={{ color: BRAND_COLORS.bodyText }}>"{testimonial.quote}"</p>
                  <p className="font-semibold" style={{ color: BRAND_COLORS.ink }}>{testimonial.author}</p>
                  <p style={{ color: BRAND_COLORS.muted, fontSize: "14px" }}>{testimonial.location}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* TRUST */}
        <motion.section className="py-16 sm:py-24 px-6" style={{ backgroundColor: BRAND_COLORS.creamAlt }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center" style={{ color: BRAND_COLORS.ink }}>Why you can trust us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[{ stat: "38", label: "States covered" }, { stat: "15", label: "Minutes to match" }, { stat: "100%", label: "Confidential" }, { stat: "0", label: "Upfront cost" }].map((item, idx) => (
                <motion.div key={idx} className="text-center p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.borderSoft}` }} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <div className="text-4xl font-bold mb-2" style={{ color: BRAND_COLORS.gold }}>{item.stat}</div>
                  <p style={{ color: BRAND_COLORS.bodyText }}>{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section className="py-16 sm:py-24 px-6" style={{ backgroundColor: BRAND_COLORS.cream }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center" style={{ color: BRAND_COLORS.ink }}>Frequently asked questions</h2>
            <div className="space-y-4">
              {[{ q: "Is this free?", a: "Yes. Your case review is completely free. If you are matched with an attorney, they work on contingency — no upfront cost." }, { q: "How long does it take?", a: "Your case review takes about 2 minutes. If your case qualifies, you are matched with an attorney within 15 minutes." }, { q: "Is my information private?", a: "Absolutely. All your information is encrypted end-to-end using AES-256 encryption. We never share your data without your consent." }, { q: "What if I am partially at fault?", a: "You may still have a case. Many states follow comparative fault rules. An attorney can evaluate your specific situation." }].map((item, idx) => (
                <motion.div key={idx} className="p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.borderSoft}` }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: idx * 0.05, duration: 0.4 }} viewport={{ once: true }}>
                  <h3 className="font-bold mb-2" style={{ color: BRAND_COLORS.ink }}>{item.q}</h3>
                  <p className="faq-answer-inner" style={{ color: BRAND_COLORS.bodyText, fontSize: "14px" }}>{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FORM CTA */}
        <motion.section id="case-review" className="py-16 sm:py-24 px-6" style={{ backgroundColor: BRAND_COLORS.teal }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: BRAND_COLORS.white }}>Start your free case review</h2>
            <p className="text-lg mb-8" style={{ color: BRAND_COLORS.tealSoft }}>Answer a few quick questions. Get matched with a qualified attorney. No obligation.</p>
            <div className="p-8 rounded-lg" style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.borderSoft}` }}>
              <p style={{ color: BRAND_COLORS.bodyText }}>Intake form will be embedded here. For now, this is a placeholder.</p>
            </div>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="py-12 px-6" style={{ backgroundColor: BRAND_COLORS.teal }}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-4" style={{ color: BRAND_COLORS.white }}>CasePort</h3>
                <p style={{ color: BRAND_COLORS.tealSoft, fontSize: "14px" }}>Private case acquisition system for personal injury law firms.</p>
              </div>
              <div>
                <h3 className="font-bold mb-4" style={{ color: BRAND_COLORS.white }}>Contact</h3>
                <a href="tel:+18002273669" style={{ color: BRAND_COLORS.tealSoft, fontSize: "14px" }} className="block mb-2">1-800-CASE-NOW</a>
                <a href="mailto:access@caseport.io" style={{ color: BRAND_COLORS.tealSoft, fontSize: "14px" }}>access@caseport.io</a>
              </div>
              <div>
                <h3 className="font-bold mb-4" style={{ color: BRAND_COLORS.white }}>Legal</h3>
                <a href="/privacy" style={{ color: BRAND_COLORS.tealSoft, fontSize: "14px" }} className="block mb-2">Privacy Policy</a>
                <a href="/terms" style={{ color: BRAND_COLORS.tealSoft, fontSize: "14px" }}>Terms of Service</a>
              </div>
            </div>
            <div className="pt-8 border-t" style={{ borderColor: `rgba(255,255,255,0.1)` }}>
              <p style={{ color: BRAND_COLORS.tealSoft, fontSize: "12px", textAlign: "center" }}>© 2026 CasePort. All rights reserved. | Not legal advice. Consult with a qualified attorney for legal guidance.</p>
            </div>
          </div>
        </footer>

        {/* MOBILE STICKY BAR */}
        <motion.div className="fixed bottom-0 left-0 right-0 sm:hidden z-30 p-4" style={{ backgroundColor: BRAND_COLORS.terra, boxShadow: "0 -2px 8px rgba(0,0,0,0.1)" }} initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 1, duration: 0.5 }}>
          <Button onClick={scrollToForm} className="w-full text-base font-bold py-3 rounded-full" style={{ background: BRAND_COLORS.terra, color: BRAND_COLORS.white, border: `2px solid ${BRAND_COLORS.white}` }}>
            Get Free Review
          </Button>
        </motion.div>
      </main>
    </>
  )
}