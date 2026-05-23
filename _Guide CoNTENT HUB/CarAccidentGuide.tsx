import React, { useState, useEffect } from "react";
import { ChevronRight, BookOpen, ArrowRight, TrendingUp, Shield, Clock, AlertCircle, CheckCircle, DollarSign, Users } from "lucide-react";

/**
 * CAR ACCIDENT GUIDE - PILLAR PAGE (AUTHORITY)
 * 
 * This is the comprehensive guide that ties together all sub-guides.
 * Highest volume category. Pillar page. Authority builder.
 * 
 * OPTIMIZATION:
 * - Comprehensive topical coverage (AI loves depth)
 * - Internal linking to sub-guides
 * - FAQPage schema for AI extraction
 * - Data tables for settlement ranges
 * - Comparison matrices
 * - Direct answers (AI cites these)
 * - 3000+ word content (topical authority)
 * 
 * TONE: Dan Lok voice - authoritative, comprehensive, actionable
 */

const CarAccidentGuide = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string>("statute-limitations");

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

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#999' }}>
            <a href="/guide" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <span style={{ color: '#1a4a5a' }}>Car Accident Guide</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight" style={{ color: '#1c2b32' }}>
            The Complete Car Accident Guide
          </h1>

          {/* Subheadline */}
          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#555' }}>
            Attorney-reviewed guides that help accident victims get fair compensation. Everything you need to know from the moment of impact to settlement.
          </p>

          {/* CTA */}
          <a
            href="tel:+18002273669"
            className="inline-flex items-center gap-2 bg-[#c4714a] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#d4855e] transition-all shadow-lg"
          >
            Get Free Case Review
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* TABLE OF CONTENTS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#1a4a5a' }}>
            What You'll Learn
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: AlertCircle, title: "Immediate Steps", desc: "What to do in the first 24 hours" },
              { icon: BookOpen, title: "Legal Rights", desc: "Your rights under the law" },
              { icon: DollarSign, title: "Settlement Amounts", desc: "What your case is worth" },
              { icon: Shield, title: "Insurance Claims", desc: "How to deal with insurance" },
              { icon: Users, title: "Attorney Help", desc: "When and why you need one" },
              { icon: TrendingUp, title: "Case Timeline", desc: "How long cases take" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href="#"
                  className="rounded-xl border-2 border-[#e8e2d8] p-6 hover:shadow-md transition hover:border-[#4a8c7e]"
                >
                  <Icon size={24} style={{ color: '#4a8c7e', marginBottom: '0.75rem' }} />
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1a4a5a' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#555', fontSize: '0.875rem' }}>
                    {item.desc}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* IMMEDIATE STEPS SECTION */}
      <section className="py-24 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
            Immediate Steps After a Car Accident
          </h2>
          <p className="text-lg mb-16" style={{ color: '#555' }}>
            The first 72 hours are critical. Here's exactly what to do.
          </p>

          <div className="space-y-6">
            {[
              { step: 1, title: "Seek Medical Attention", desc: "Even if you don't feel injured, get medical documentation immediately. Some injuries appear hours later." },
              { step: 2, title: "Call Police", desc: "Get a police report number. This is your official record of what happened." },
              { step: 3, title: "Document Everything", desc: "Take photos of vehicle damage, road conditions, traffic signs, and your injuries." },
              { step: 4, title: "Get Witness Information", desc: "Collect names, phone numbers, and statements from at least 2-3 witnesses." },
              { step: 5, title: "Contact an Attorney", desc: "Within 24-48 hours. Attorneys preserve evidence and protect your rights." }
            ].map((item) => (
              <div key={item.step} className="rounded-xl border-l-4 border-[#4a8c7e] bg-white p-6 hover:shadow-md transition">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#4a8c7e] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#1a4a5a' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#555' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-xl" style={{ backgroundColor: '#e8f3f5', borderLeft: '4px solid #4a8c7e' }}>
            <p className="font-semibold mb-2" style={{ color: '#4a8c7e' }}>
              Read the full guide:
            </p>
            <a href="/guide/car-accident/what-to-do" className="text-[#4a8c7e] font-semibold hover:underline flex items-center gap-2">
              What To Do After Car Accident <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* SETTLEMENT AMOUNTS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
            Car Accident Settlement Amounts
          </h2>
          <p className="text-lg mb-16" style={{ color: '#555' }}>
            What is your case worth? Here's what similar cases have settled for.
          </p>

          <div className="overflow-x-auto rounded-xl border border-[#e8e2d8]">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#1a4a5a' }}>
                  <th className="px-6 py-4 text-left text-white font-bold">Injury Type</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Typical Range</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Factors</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { injury: "Minor Injuries (bruises, sprains)", range: "$5,000 - $25,000", factors: "Medical bills, lost wages" },
                  { injury: "Moderate Injuries (fractures, whiplash)", range: "$25,000 - $100,000", factors: "Ongoing treatment, disability" },
                  { injury: "Serious Injuries (permanent damage)", range: "$100,000 - $500,000+", factors: "Liability clarity, insurance limits" },
                  { injury: "Catastrophic Injuries (paralysis, death)", range: "$500,000+", factors: "Lifetime care, lost earning potential" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e8e2d8', backgroundColor: idx % 2 === 0 ? '#fafaf8' : 'white' }}>
                    <td className="px-6 py-4" style={{ color: '#1a4a5a', fontWeight: '500' }}>{row.injury}</td>
                    <td className="px-6 py-4" style={{ color: '#c4714a', fontWeight: 'bold' }}>{row.range}</td>
                    <td className="px-6 py-4" style={{ color: '#555' }}>{row.factors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 p-6 rounded-xl" style={{ backgroundColor: '#fef9f6', borderLeft: '4px solid #c4714a' }}>
            <p className="font-semibold mb-2" style={{ color: '#c4714a' }}>
              Important:
            </p>
            <p style={{ color: '#555' }}>
              These are averages. Your case value depends on injury severity, liability clarity, medical expenses, lost wages, and insurance limits. Attorneys increase settlements 25-40% on average.
            </p>
          </div>
        </div>
      </section>

      {/* DO I NEED AN ATTORNEY */}
      <section className="py-24 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
            Do You Need an Attorney?
          </h2>
          <p className="text-lg mb-16" style={{ color: '#555' }}>
            Most car accident cases benefit from attorney representation.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* With Attorney */}
            <div className="rounded-xl border-2 border-[#4a8c7e] p-8" style={{ backgroundColor: '#f0faf9' }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#1a4a5a' }}>
                With Attorney
              </h3>
              <ul className="space-y-3">
                {[
                  "Settlement 25-40% higher",
                  "No upfront cost (contingency)",
                  "Insurance negotiations handled",
                  "Evidence preserved",
                  "Deadlines managed",
                  "Maximum recovery"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                    <span style={{ color: '#555' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="/guide/car-accident/do-i-need-a-lawyer" className="mt-6 inline-flex items-center gap-2 text-[#4a8c7e] font-semibold hover:underline">
                Learn more <ArrowRight size={16} />
              </a>
            </div>

            {/* Without Attorney */}
            <div className="rounded-xl border-2 border-[#e8e2d8] p-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#1a4a5a' }}>
                Without Attorney
              </h3>
              <ul className="space-y-3">
                {[
                  "Lower settlement offers",
                  "You handle negotiations",
                  "Insurance has advantage",
                  "Evidence may be lost",
                  "You manage deadlines",
                  "Potential missed recovery"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <AlertCircle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                    <span style={{ color: '#555' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-16" style={{ color: '#1a4a5a' }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                id: "statute-limitations",
                q: "What's the statute of limitations for car accidents?",
                a: "It varies by state, but typically 2-4 years. In California, it's 2 years. In New York, it's 3 years. Don't wait - file within 1 year to preserve evidence and witness memory."
              },
              {
                id: "insurance-settlement",
                q: "How long does insurance settlement take?",
                a: "With an attorney, typically 3-6 months. Without an attorney, 6-12 months. Attorneys know the system and move faster."
              },
              {
                id: "partial-fault",
                q: "What if I was partially at fault?",
                a: "Depends on your state. Some states use comparative negligence (you recover a percentage). Others use contributory negligence (you recover nothing if you're partially at fault). Attorneys know your state's rules."
              },
              {
                id: "no-police-report",
                q: "What if there's no police report?",
                a: "You can still file a claim, but it's harder. Police reports are official documentation. If there's no report, get one as soon as possible, even days after the accident."
              },
              {
                id: "insurance-denial",
                q: "What if insurance denies my claim?",
                a: "You can appeal or sue. Attorneys handle appeals and lawsuits. Don't accept a denial without fighting it."
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

      {/* RELATED GUIDES */}
      <section className="py-24 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12" style={{ color: '#1a4a5a' }}>
            Related Guides
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "What To Do After Car Accident", desc: "Step-by-step guide for the first 72 hours", link: "/guide/car-accident/what-to-do" },
              { title: "Do I Need a Lawyer?", desc: "Decision matrix and cost-benefit analysis", link: "/guide/car-accident/do-i-need-a-lawyer" },
              { title: "Settlement Amounts", desc: "What your case is worth by injury type", link: "#" },
              { title: "Insurance Claims", desc: "How to deal with insurance companies", link: "#" }
            ].map((guide, idx) => (
              <a
                key={idx}
                href={guide.link}
                className="rounded-xl border-2 border-[#e8e2d8] p-6 hover:shadow-md transition hover:border-[#4a8c7e]"
              >
                <h3 className="font-bold text-lg mb-2" style={{ color: '#1a4a5a' }}>
                  {guide.title}
                </h3>
                <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {guide.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-[#4a8c7e] font-semibold text-sm">
                  Read <ArrowRight size={14} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-[#1a4a5a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to Protect Your Rights?
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Get a free consultation with an attorney. No obligation. No upfront cost.
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
                <li><a href="/guide/car-accident/do-i-need-a-lawyer" className="hover:text-white transition">Do I Need a Lawyer?</a></li>
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

export default CarAccidentGuide;
