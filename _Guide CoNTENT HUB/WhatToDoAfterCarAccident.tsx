import React, { useState, useEffect } from "react";
import { ChevronRight, Clock, AlertCircle, CheckCircle, Camera, Phone, FileText, Users, MapPin, AlertTriangle, ArrowRight } from "lucide-react";

/**
 * WHAT TO DO AFTER CAR ACCIDENT - HIGHEST URGENCY PAGE
 * 
 * This is the #1 searched query at moment of injury.
 * Urgency trigger. Highest conversion potential.
 * 
 * OPTIMIZATION:
 * - FAQPage schema for AI extraction
 * - Direct answers (AI cites these)
 * - Step-by-step checklist (user saves/shares)
 * - Urgency signals (time-sensitive)
 * - Soft CTA (not pushy)
 * - Mobile-optimized (accident victims search on mobile)
 * 
 * TONE: Dan Lok voice - direct, action-oriented, empathetic
 */

const WhatToDoAfterCarAccident = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string>("police-report");

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

      {/* HERO - URGENCY FOCUSED */}
      <section className="pt-32 pb-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#999' }}>
            <a href="/guide" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <a href="/guide/car-accident" className="hover:text-[#1a4a5a]">Car Accident</a>
            <ChevronRight size={16} />
            <span style={{ color: '#1a4a5a' }}>What To Do After Car Accident</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight" style={{ color: '#1c2b32' }}>
            What To Do After a Car Accident
          </h1>

          {/* Subheadline - Direct Answer */}
          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#555' }}>
            Attorney-reviewed guides that help accident victims get fair compensation. The first 72 hours are critical for protecting your rights.
          </p>

          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg mb-12" style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #c4714a' }}>
            <AlertTriangle size={20} style={{ color: '#c4714a' }} />
            <span className="font-semibold" style={{ color: '#c4714a' }}>
              Time-sensitive: Evidence disappears. Memories fade. Act within 24-48 hours.
            </span>
          </div>

          {/* CTA - Soft, not pushy */}
          <a
            href="tel:+18002273669"
            className="inline-flex items-center gap-2 bg-[#c4714a] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#d4855e] transition-all shadow-lg"
          >
            Call Now: 1-800-227-3669
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* STEP-BY-STEP CHECKLIST - ACTIONABLE */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
            The 72-Hour Action Plan
          </h2>
          <p className="text-lg mb-16" style={{ color: '#555' }}>
            Follow these steps in order. This checklist protects your health, evidence, and legal rights.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="rounded-xl border-2 border-[#e8e2d8] p-8 hover:shadow-md transition">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#4a8c7e] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a4a5a' }}>
                    Seek Medical Attention Immediately
                  </h3>
                  <p className="mb-4" style={{ color: '#555' }}>
                    Do this first, even if you don't feel injured. Some injuries (concussions, internal bleeding, whiplash) appear hours or days later. Get medical documentation immediately - this is your proof of injury.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <CheckCircle size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Call 911 if anyone is injured or in danger</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Go to the ER or urgent care immediately</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Keep all medical records and receipts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border-2 border-[#e8e2d8] p-8 hover:shadow-md transition">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#4a8c7e] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a4a5a' }}>
                    Call Police and Get a Report Number
                  </h3>
                  <p className="mb-4" style={{ color: '#555' }}>
                    Never leave the scene without a police report. This is your official record of what happened. Insurance companies use this to determine fault.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <CheckCircle size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Call 911 or local police non-emergency line</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Get the police report number</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Get the officer's name and badge number</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border-2 border-[#e8e2d8] p-8 hover:shadow-md transition">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#4a8c7e] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a4a5a' }}>
                    Document Everything With Photos
                  </h3>
                  <p className="mb-4" style={{ color: '#555' }}>
                    Take photos immediately. Evidence disappears fast - tow trucks remove vehicles, scenes get cleaned up, weather changes. Your photos are irreplaceable proof.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <Camera size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Vehicle damage (multiple angles)</span>
                    </li>
                    <li className="flex gap-2">
                      <Camera size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Road conditions and scene</span>
                    </li>
                    <li className="flex gap-2">
                      <Camera size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Traffic signs and signals</span>
                    </li>
                    <li className="flex gap-2">
                      <Camera size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Your visible injuries (if any)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-xl border-2 border-[#e8e2d8] p-8 hover:shadow-md transition">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#4a8c7e] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a4a5a' }}>
                    Get Witness Information
                  </h3>
                  <p className="mb-4" style={{ color: '#555' }}>
                    Witnesses are gold. They corroborate your version of events. Get their contact information before they leave the scene.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <Users size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Full name, phone number, email</span>
                    </li>
                    <li className="flex gap-2">
                      <Users size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>What they saw (brief statement)</span>
                    </li>
                    <li className="flex gap-2">
                      <Users size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Get at least 2-3 witnesses</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="rounded-xl border-2 border-[#e8e2d8] p-8 hover:shadow-md transition">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#4a8c7e] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">5</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a4a5a' }}>
                    Contact an Attorney Within 24-48 Hours
                  </h3>
                  <p className="mb-4" style={{ color: '#555' }}>
                    This is critical. Attorneys preserve evidence, communicate with insurance, and protect your rights. The longer you wait, the more evidence disappears.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <Phone size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Call a personal injury attorney immediately</span>
                    </li>
                    <li className="flex gap-2">
                      <Phone size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>No upfront cost (contingency fee)</span>
                    </li>
                    <li className="flex gap-2">
                      <Phone size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ color: '#555' }}>Attorney handles insurance negotiations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT NOT TO DO - CRITICAL MISTAKES */}
      <section className="py-24 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
            Critical Mistakes to Avoid
          </h2>
          <p className="text-lg mb-16" style={{ color: '#555' }}>
            These mistakes can destroy your case. Don't make them.
          </p>

          <div className="space-y-4">
            {[
              {
                mistake: "Don't admit fault or apologize",
                reason: "Insurance will use this against you. Even 'I'm sorry' can be interpreted as admission of guilt."
              },
              {
                mistake: "Don't post about the accident on social media",
                reason: "Insurance adjusters monitor social media. Photos, statements, or check-ins can be used to deny your claim."
              },
              {
                mistake: "Don't accept the first settlement offer",
                reason: "First offers are always low. Attorneys increase settlements 25-40% on average."
              },
              {
                mistake: "Don't delay seeking medical attention",
                reason: "Gaps in medical treatment reduce your settlement. Insurance uses this to argue injuries aren't serious."
              },
              {
                mistake: "Don't sign anything without an attorney",
                reason: "Insurance forms contain language that limits your rights. Attorneys review everything."
              }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border-l-4 border-[#c4714a] bg-white p-6">
                <h3 className="font-bold mb-2" style={{ color: '#c4714a' }}>
                  {item.mistake}
                </h3>
                <p style={{ color: '#555' }}>
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - AI OPTIMIZED */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-16" style={{ color: '#1a4a5a' }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                id: "police-report",
                q: "What if I don't have a police report?",
                a: "You can still file a claim, but it's much harder. Police reports are official documentation of what happened. Without one, it's your word against theirs. Get a police report as soon as possible, even days after the accident."
              },
              {
                id: "no-witnesses",
                q: "What if there were no witnesses?",
                a: "Witnesses help, but aren't required. Your medical records, photos, and the police report are strong evidence. An attorney can also subpoena traffic camera footage or nearby business security cameras."
              },
              {
                id: "no-injuries",
                q: "What if I don't have visible injuries?",
                a: "Many serious injuries aren't visible (whiplash, concussions, internal injuries). Get medical documentation immediately. Medical records prove injury, not visible wounds."
              },
              {
                id: "insurance-call",
                q: "What should I tell the insurance company?",
                a: "Say as little as possible. Tell them: 'I was in an accident. I'm getting medical attention. I'll contact you once I've consulted with an attorney.' Then stop talking. Let your attorney handle it."
              },
              {
                id: "attorney-cost",
                q: "How much does an attorney cost?",
                a: "Most personal injury attorneys work on contingency - they get paid only if you win. Typical fees are 25-40% of your settlement. No upfront cost. No cost if you lose."
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

                {expandedFaq === faq.id ? (
                  <div className="px-6 py-6 bg-[#fafaf8] border-t border-[#e8e2d8]" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                    <p style={{ color: '#555' }} itemProp="text">
                      {faq.a}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-[#1a4a5a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            You've Done Everything Right
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Now let an attorney protect your rights. Get a free consultation with no obligation.
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

export default WhatToDoAfterCarAccident;
