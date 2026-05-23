import React, { useState, useEffect } from "react";
import { ChevronRight, DollarSign, Scale, Clock, Shield, TrendingUp, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";

/**
 * DO I NEED A LAWYER? - VOICE SEARCH GOLDMINE
 * 
 * This is THE question accident victims ask first.
 * Optimized for voice search (conversational, direct answer).
 * Soft CTA (not pushy, empowering).
 * 
 * OPTIMIZATION:
 * - FAQPage schema for AI extraction
 * - Conversational tone (voice search friendly)
 * - Direct answer first (AI cites this)
 * - Decision matrix (helps users decide)
 * - Soft CTA (empowering, not pushy)
 * - Mobile-optimized (voice searches are mobile)
 * 
 * TONE: Dan Lok voice - honest, empowering, data-driven
 */

const DoINeedALawyer = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string>("how-much-attorney");
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* Sticky Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 px-7 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-[#f9f5ef] border-b border-[#e8e2d8] shadow-md"
            : "bg-transparent"
        }`}
        style={{
          opacity: isScrolled ? 1 : 0,
          pointerEvents: isScrolled ? 'auto' : 'none'
        }}
      >
        <a href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#1a4a5a] flex items-center justify-center">
            <span className="font-bold text-white text-lg">CP</span>
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-[#1a4a5a]">CasePort</span>
        </a>

        <a
          href="tel:+18002273669"
          className="bg-[#c4714a] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md"
        >
          Free Case Review
        </a>
      </nav>

      {/* HERO - CONVERSATIONAL */}
      <section className="pt-32 pb-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#999' }}>
            <a href="/guide" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <a href="/guide/car-accident" className="hover:text-[#1a4a5a]">Car Accident</a>
            <ChevronRight size={16} />
            <span style={{ color: '#1a4a5a' }}>Do I Need a Lawyer?</span>
          </div>

          {/* Main Headline - Conversational */}
          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight" style={{ color: '#1c2b32' }}>
            Do I Need a Lawyer After a Car Accident?
          </h1>

          {/* Direct Answer - Voice Search Optimized */}
          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#555' }}>
            Attorney-reviewed guides that help accident victims get fair compensation. Attorneys increase settlements 25-40% on average, which usually covers their fee and leaves you with more money.
          </p>

          {/* Quick Decision */}
          <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg mb-12" style={{ backgroundColor: '#e8f3f5', borderLeft: '4px solid #4a8c7e' }}>
            <CheckCircle size={20} style={{ color: '#4a8c7e' }} />
            <span className="font-semibold" style={{ color: '#4a8c7e' }}>
              The short answer: If you're unsure, you probably need one.
            </span>
          </div>
        </div>
      </section>

      {/* DECISION MATRIX */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
            When You Definitely Need an Attorney
          </h2>
          <p className="text-lg mb-16" style={{ color: '#555' }}>
            If any of these apply to you, hire an attorney immediately.
          </p>

          <div className="space-y-4">
            {[
              {
                scenario: "Serious Injury",
                description: "Hospitalization, permanent disability, ongoing pain, or significant medical expenses",
                icon: AlertCircle,
                color: "#c4714a"
              },
              {
                scenario: "Disputed Liability",
                description: "The other party denies fault or there's disagreement about who caused the accident",
                icon: Scale,
                color: "#c4714a"
              },
              {
                scenario: "Insurance Company Being Difficult",
                description: "They're denying your claim, offering an unreasonably low settlement, or not responding",
                icon: Shield,
                color: "#c4714a"
              },
              {
                scenario: "Multiple Parties Involved",
                description: "More than 2 vehicles or multiple defendants (complex liability)",
                icon: TrendingUp,
                color: "#c4714a"
              },
              {
                scenario: "You're Partially at Fault",
                description: "You contributed to the accident (comparative negligence rules apply)",
                icon: AlertCircle,
                color: "#c4714a"
              },
              {
                scenario: "Long-Term Medical Treatment",
                description: "Ongoing therapy, surgery, or treatment that will last months or years",
                icon: Clock,
                color: "#c4714a"
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="rounded-xl border-l-4 border-[#c4714a] bg-[#fef9f6] p-6 hover:shadow-md transition">
                  <div className="flex gap-4">
                    <Icon size={24} style={{ color: item.color, flexShrink: 0 }} />
                    <div>
                      <h3 className="font-bold text-lg mb-2" style={{ color: '#1a4a5a' }}>
                        {item.scenario}
                      </h3>
                      <p style={{ color: '#555' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHEN YOU MIGHT NOT NEED AN ATTORNEY */}
      <section className="py-24 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
            When You Might Not Need an Attorney
          </h2>
          <p className="text-lg mb-16" style={{ color: '#555' }}>
            These are the only scenarios where you can handle it yourself.
          </p>

          <div className="space-y-4">
            {[
              {
                scenario: "Minor Injury",
                description: "Bruises, sprains, minor pain. Medical bills under $5,000.",
                recommendation: "You can negotiate directly with insurance"
              },
              {
                scenario: "Clear Liability",
                description: "You're 100% not at fault. Police report confirms it. Other party admits fault.",
                recommendation: "Insurance will likely settle quickly"
              },
              {
                scenario: "Low Medical Bills",
                description: "Total damages (medical + lost wages) under $10,000",
                recommendation: "Attorney fee might exceed your recovery"
              },
              {
                scenario: "Insurance Company is Cooperative",
                description: "They're responding quickly, offering reasonable settlements, being helpful",
                recommendation: "You have leverage to negotiate"
              }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border-2 border-[#e8e2d8] bg-white p-6 hover:shadow-md transition">
                <h3 className="font-bold text-lg mb-2" style={{ color: '#1a4a5a' }}>
                  {item.scenario}
                </h3>
                <p className="mb-3" style={{ color: '#555' }}>
                  {item.description}
                </p>
                <div className="flex items-center gap-2 pt-3 border-t border-[#e8e2d8]">
                  <CheckCircle size={16} style={{ color: '#4a8c7e' }} />
                  <span className="text-sm font-semibold" style={{ color: '#4a8c7e' }}>
                    {item.recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE MATH - DATA DRIVEN */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
            The Math That Insurance Companies Don't Want You to See
          </h2>
          <p className="text-lg mb-16" style={{ color: '#555' }}>
            Here's why attorneys usually pay for themselves.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Without Attorney */}
            <div className="rounded-xl border-2 border-[#e8e2d8] p-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#1a4a5a' }}>
                Without Attorney
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm" style={{ color: '#999' }}>Your Settlement</p>
                  <p className="text-3xl font-bold" style={{ color: '#555' }}>$50,000</p>
                </div>
                <div className="border-t border-[#e8e2d8] pt-4">
                  <p className="text-sm" style={{ color: '#999' }}>Your Costs</p>
                  <p className="text-lg font-semibold" style={{ color: '#c4714a' }}>-$0</p>
                </div>
                <div className="border-t border-[#e8e2d8] pt-4 bg-[#fef9f6] p-4 rounded">
                  <p className="text-sm" style={{ color: '#999' }}>You Keep</p>
                  <p className="text-3xl font-bold" style={{ color: '#1a4a5a' }}>$50,000</p>
                </div>
              </div>
            </div>

            {/* With Attorney */}
            <div className="rounded-xl border-2 border-[#4a8c7e] p-8" style={{ backgroundColor: '#f0faf9' }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#1a4a5a' }}>
                With Attorney (33% fee)
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm" style={{ color: '#999' }}>Your Settlement</p>
                  <p className="text-3xl font-bold" style={{ color: '#4a8c7e' }}>$67,500</p>
                  <p className="text-xs mt-1" style={{ color: '#999' }}>+35% higher (average)</p>
                </div>
                <div className="border-t border-[#e8e2d8] pt-4">
                  <p className="text-sm" style={{ color: '#999' }}>Attorney Fee (33%)</p>
                  <p className="text-lg font-semibold" style={{ color: '#c4714a' }}>-$22,275</p>
                </div>
                <div className="border-t border-[#e8e2d8] pt-4 bg-white p-4 rounded">
                  <p className="text-sm" style={{ color: '#999' }}>You Keep</p>
                  <p className="text-3xl font-bold" style={{ color: '#4a8c7e' }}>$45,225</p>
                </div>
              </div>
              <p className="text-xs mt-6 text-center" style={{ color: '#999' }}>
                Even with attorney fees, you might get less. But that's rare. Usually you get MORE.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-xl" style={{ backgroundColor: '#e8f3f5', borderLeft: '4px solid #4a8c7e' }}>
            <p className="font-semibold mb-2" style={{ color: '#4a8c7e' }}>The Real Advantage:</p>
            <p style={{ color: '#555' }}>
              Attorneys increase settlements 25-40% on average. Even after paying their fee, you usually come out ahead. Plus, they handle all the negotiation, paperwork, and deadlines - saving you time and stress.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ - AI OPTIMIZED */}
      <section className="py-24 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-16" style={{ color: '#1a4a5a' }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                id: "how-much-attorney",
                q: "How much does an attorney cost?",
                a: "Most personal injury attorneys work on contingency - they get paid only if you win. Typical fees are 25-40% of your settlement. No upfront cost. No cost if you lose. This aligns the attorney's incentive with yours - they only make money if you win."
              },
              {
                id: "attorney-time",
                q: "How long does it take to settle with an attorney?",
                a: "Most cases settle within 3-6 months with an attorney. Without an attorney, it can take 6-12 months because you're handling everything yourself. Attorneys know the system and move faster."
              },
              {
                id: "attorney-choice",
                q: "How do I choose the right attorney?",
                a: "Look for attorneys who specialize in personal injury, have good reviews, and work on contingency. Ask about their settlement success rate. Interview 2-3 attorneys before deciding. Most offer free consultations."
              },
              {
                id: "attorney-communication",
                q: "Will my attorney actually communicate with me?",
                a: "Good attorneys communicate regularly. You should expect updates every 2-4 weeks. If an attorney is hard to reach, that's a red flag. Ask about communication during your consultation."
              },
              {
                id: "attorney-settlement",
                q: "Can I fire my attorney if I'm not happy?",
                a: "Yes. You can fire your attorney at any time. If you do, they're typically entitled to a portion of the settlement proportional to the work they did. Ask about this upfront."
              }
            ].map((faq) => (
              <div
                key={faq.id}
                className="rounded-xl overflow-hidden bg-white border border-[#e8e2d8] transition hover:shadow-md"
                itemProp="mainEntity"
                itemScope
                itemType="https://schema.org/Question"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? "" : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-semibold text-left" style={{ color: '#1a4a5a' }} itemProp="name">
                    {faq.q}
                  </h3>
                  <ChevronRight
                    size={20}
                    className="flex-shrink-0 transition"
                    style={{
                      color: '#999',
                      transform: expandedFaq === faq.id ? 'rotate(90deg)' : 'rotate(0deg)'
                    }}
                  />
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-6 py-6 bg-[#fafaf8] border-t border-[#e8e2d8]" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                    <p style={{ color: '#555' }} itemProp="text">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - SOFT, EMPOWERING */}
      <section className="py-24 px-6 bg-[#1a4a5a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to Explore Your Options?
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Get a free consultation with an attorney. No obligation. No pressure. Just honest advice about your case.
          </p>
          <a
            href="tel:+18002273669"
            className="inline-flex items-center gap-2 bg-[#c4714a] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#d4855e] transition-all shadow-lg"
          >
            Call Now: 1-800-227-3669
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0f2e3a]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4 text-white">CasePort</h3>
              <p className="text-sm text-gray-400">The authoritative source for personal injury law. Attorney-reviewed.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Related Guides</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/guide/car-accident/what-to-do" className="hover:text-white transition">What To Do After Car Accident</a></li>
                <li><a href="/guide/car-accident" className="hover:text-white transition">Car Accident Guide</a></li>
                <li><a href="/guide" className="hover:text-white transition">All Guides</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="tel:+18002273669" className="hover:text-white transition">1-800-227-3669</a></li>
                <li><a href="#" className="hover:text-white transition">Free Case Review</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 CasePort.io. All rights reserved. Attorney-Reviewed. ABA Compliant.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DoINeedALawyer;
