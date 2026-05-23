import React, { useState, useEffect } from "react";
import { ChevronRight, AlertCircle, CheckCircle, Camera, FileText, Users, MapPin, AlertTriangle, ArrowRight } from "lucide-react";

/**
 * SLIP & FALL GUIDE - PREMISES LIABILITY PILLAR
 * 
 * Premises liability is the core of slip & fall cases.
 * Property owners have a duty to maintain safe premises.
 * 
 * OPTIMIZATION:
 * - FAQPage schema for AI extraction
 * - Direct answers (AI cites these)
 * - Premises liability framework
 * - Settlement ranges by injury severity
 * - With/without attorney comparison
 * - Empathetic, care-first copy
 * 
 * TONE: Dan Lok voice - direct, action-oriented, empathetic
 */

const SlipAndFallGuide = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>("premises-liability");

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

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#999' }}>
            <a href="/guide" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <span style={{ color: '#1a4a5a' }}>Slip & Fall Guide</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight" style={{ color: '#1c2b32' }}>
            The Complete Slip & Fall Guide
          </h1>

          {/* Subheadline */}
          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#555' }}>
            Attorney-reviewed guides that help accident victims get fair compensation. Everything you need to know about premises liability and slip & fall cases.
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

      {/* PREMISES LIABILITY FRAMEWORK */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            What is Premises Liability?
          </h2>

          <div className="space-y-6">
            <p style={{ color: '#555' }}>
              Premises liability is the legal responsibility of a property owner to maintain safe premises for visitors. If you slip and fall due to a hazardous condition that the property owner knew about (or should have known about), you may have a case.
            </p>

            <div className="bg-[#f0f8f6] border-l-4 border-[#4a8c7e] p-6 rounded">
              <h3 className="font-bold mb-3" style={{ color: '#1a4a5a' }}>The Three Elements of Premises Liability:</h3>
              <ol className="space-y-3" style={{ color: '#555' }}>
                <li><strong>1. Hazardous Condition:</strong> There was a dangerous condition (wet floor, broken step, debris)</li>
                <li><strong>2. Knowledge:</strong> The property owner knew (or should have known) about the hazard</li>
                <li><strong>3. Negligence:</strong> The property owner failed to fix it or warn visitors</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* SETTLEMENT RANGES */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Slip & Fall Settlement Ranges
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#1a4a5a' }}>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Injury Type</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Typical Range</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Average Settlement</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3">Minor (bruises, sprains)</td>
                  <td className="border border-[#ddd] px-4 py-3">$5,000 - $25,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$12,000</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f5ef' }}>
                  <td className="border border-[#ddd] px-4 py-3">Moderate (fractures, significant pain)</td>
                  <td className="border border-[#ddd] px-4 py-3">$25,000 - $100,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$50,000</td>
                </tr>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3">Severe (permanent injury, hospitalization)</td>
                  <td className="border border-[#ddd] px-4 py-3">$100,000 - $500,000+</td>
                  <td className="border border-[#ddd] px-4 py-3">$250,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-sm" style={{ color: '#999' }}>
            Data source: Insurance Claims Analysis, 2024. Actual settlements vary based on medical expenses, lost wages, liability strength, and state laws.
          </p>
        </div>
      </section>

      {/* WITH VS WITHOUT ATTORNEY */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            With Attorney vs. Without Attorney
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-[#e8e2d8] rounded-lg">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#c4714a' }}>With Attorney</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span>Average 25-40% higher settlement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span>No upfront cost (contingency fee)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span>Handles all documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span>Negotiates with insurance</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border border-[#e8e2d8] rounded-lg">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#999' }}>Without Attorney</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span>Lower settlements (insurance knows you're inexperienced)</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span>Your time and effort required</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span>Risk of missing deadlines</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span>May miss valuable evidence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                id: "premises-liability",
                q: "What is premises liability?",
                a: "Premises liability is the legal duty of a property owner to maintain safe premises. If a property owner knew (or should have known) about a hazardous condition and failed to fix it or warn visitors, they may be liable for injuries."
              },
              {
                id: "statute-of-limitations",
                q: "What is the statute of limitations for slip and fall cases?",
                a: "The statute of limitations for slip and fall cases is typically 2-3 years from the date of injury, though this varies by state. Some states allow up to 4-6 years. Missing this deadline means you permanently lose your right to sue."
              },
              {
                id: "comparative-negligence",
                q: "What if I was partially at fault?",
                a: "Many states use comparative negligence rules. If you're 20% at fault, you can still recover 80% of damages. Some states don't allow recovery if you're more than 50% at fault. Rules vary by state."
              },
              {
                id: "insurance-settlement",
                q: "How long does a slip and fall settlement take?",
                a: "Most slip and fall cases settle within 3-6 months with an attorney. Without an attorney, it may take 6-12 months or longer. The timeline depends on injury severity, liability clarity, and insurance company responsiveness."
              },
              {
                id: "attorney-cost",
                q: "How much does a slip and fall attorney cost?",
                a: "Personal injury attorneys typically work on contingency - they take 25-40% of your settlement as their fee. You pay nothing upfront. If you don't win, you don't pay."
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
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
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
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Related Guides
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <a href="/guide/car-accident" className="p-6 border border-[#e8e2d8] rounded-lg hover:shadow-lg transition">
              <h3 className="font-bold mb-2" style={{ color: '#1a4a5a' }}>Car Accident Guide</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Comprehensive guide to car accident claims and settlements</p>
            </a>
            <a href="/guide" className="p-6 border border-[#e8e2d8] rounded-lg hover:shadow-lg transition">
              <h3 className="font-bold mb-2" style={{ color: '#1a4a5a' }}>All Guides</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Browse all personal injury guides</p>
            </a>
            <a href="tel:+18002273669" className="p-6 border border-[#c4714a] rounded-lg hover:shadow-lg transition">
              <h3 className="font-bold mb-2" style={{ color: '#c4714a' }}>Free Consultation</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Talk to an attorney about your case</p>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#1a4a5a' }} className="py-12 px-6 text-white">
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
                <li><a href="tel:+18002273669" className="hover:text-white transition">Free Case Review</a></li>
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

export default SlipAndFallGuide;
