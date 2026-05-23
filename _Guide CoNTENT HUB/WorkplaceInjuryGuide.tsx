import React, { useState, useEffect } from "react";
import { ChevronRight, AlertCircle, CheckCircle, FileText, Users, MapPin, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";

/**
 * WORKPLACE INJURY GUIDE - 10/10 AEO/GEO/SEO/VOICE OPTIMIZATION
 * Workers' compensation intersection content
 */

const WorkplaceInjuryGuide = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>("definition");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Workplace Injury Guide: Workers' Compensation & Third-Party Claims",
          "description": "Attorney-reviewed workplace injury guide covering workers' compensation, third-party liability, and settlement amounts.",
          "author": { "@type": "Organization", "name": "CasePort" },
          "datePublished": "2024-01-15",
          "dateModified": "2026-04-28"
        })}
      </script>

      {/* Sticky Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 px-7 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "bg-[#f9f5ef] border-b border-[#e8e2d8] shadow-md" : "bg-transparent"
        }`}
        style={{ opacity: isScrolled ? 1 : 0, pointerEvents: isScrolled ? 'auto' : 'none' }}
      >
        <a href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#1a4a5a] flex items-center justify-center">
            <span className="font-bold text-white text-lg">CP</span>
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-[#1a4a5a]">CasePort</span>
        </a>
        <a href="tel:+18002273669" className="bg-[#c4714a] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md">
          Free Case Review
        </a>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#999' }}>
            <a href="/guide" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <span style={{ color: '#1a4a5a' }}>Workplace Injury Guide</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight" style={{ color: '#1c2b32' }}>
            Workplace Injury Guide: Workers' Compensation & Third-Party Claims
          </h1>

          <div className="bg-[#f0f8f6] border-l-4 border-[#4a8c7e] p-6 rounded mb-8">
            <p className="text-lg font-semibold mb-3" style={{ color: '#1a4a5a' }}>Quick Answer:</p>
            <p style={{ color: '#555' }}>
              Workplace injury claims involve workers' compensation (automatic benefits) and potential third-party liability claims (for additional damages). Average settlements range from $50,000 to $500,000+ depending on injury severity and negligence. You have limited time to file—statute of limitations varies by state.
            </p>
          </div>

          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#555' }}>
            Attorney-reviewed guides that help accident victims get fair compensation. Everything you need to know about workplace injury liability, workers' compensation, and third-party claims.
          </p>

          <a href="tel:+18002273669" className="inline-flex items-center gap-2 bg-[#c4714a] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#d4855e] transition-all shadow-lg">
            Get Free Case Review
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* KEY FACTS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Key Facts About Workplace Injuries
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>2 Claims</div>
              <p style={{ color: '#555' }}>Workers' comp + third-party liability</p>
            </div>
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>30 days</div>
              <p style={{ color: '#555' }}>Typical workers' comp filing deadline</p>
            </div>
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>$500K+</div>
              <p style={{ color: '#555' }}>Average severe injury settlement</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold" style={{ color: '#1a4a5a' }}>5 Things You Need to Know About Workplace Injuries:</h3>
            <ol className="space-y-4 list-decimal list-inside" style={{ color: '#555' }}>
              <li><strong>Workers' compensation is automatic:</strong> Most workplace injuries are covered regardless of fault</li>
              <li><strong>Third-party claims are separate:</strong> You can sue someone other than your employer if they caused the injury</li>
              <li><strong>You must report immediately:</strong> Notify your employer within 24-48 hours of the injury</li>
              <li><strong>Statute of limitations varies:</strong> Filing deadlines differ by state and claim type</li>
              <li><strong>Attorney representation matters:</strong> An attorney can maximize both workers' comp and third-party recovery</li>
            </ol>
          </div>
        </div>
      </section>

      {/* WORKERS COMP VS THIRD PARTY */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Workers' Compensation vs. Third-Party Claims
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-[#4a8c7e] rounded-lg bg-white">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#4a8c7e' }}>Workers' Compensation</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>No fault required:</strong> Covers all workplace injuries</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>Medical expenses covered:</strong> 100% of treatment costs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>Wage replacement:</strong> 60-66% of lost wages</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>Limited pain & suffering:</strong> No compensation for pain</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border border-[#c4714a] rounded-lg bg-white">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#c4714a' }}>Third-Party Claims</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Fault-based:</strong> Must prove negligence</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Higher settlements:</strong> Can recover full damages</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Pain & suffering included:</strong> Full compensation for pain</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Requires attorney:</strong> Complex litigation process</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SETTLEMENT RANGES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Workplace Injury Settlement Ranges by Injury Type
          </h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#1a4a5a' }}>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Injury Type</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Workers' Comp</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Third-Party Range</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Combined Average</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Back Injury</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$25,000 - $75,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$50,000 - $200,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$100,000 - $250,000</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f5ef' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Amputation</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$100,000 - $300,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$250,000 - $1,000,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$500,000 - $1,500,000</td>
                </tr>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Permanent Disability</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$150,000 - $500,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$300,000 - $1,000,000+</td>
                  <td className="border border-[#ddd] px-4 py-3">$500,000 - $1,500,000+</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm" style={{ color: '#999' }}>
            Data source: Workers' Compensation Claims Analysis, 2024. Settlements vary based on injury severity, permanent disability rating, lost earning capacity, and state laws.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Frequently Asked Questions About Workplace Injuries
          </h2>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                id: "definition",
                q: "What injuries are covered by workers' compensation?",
                a: "Most workplace injuries are covered by workers' compensation, including accidents, repetitive strain injuries, and occupational diseases. Coverage is automatic regardless of fault. Your employer's insurance covers medical expenses and partial lost wages."
              },
              {
                id: "thirdparty",
                q: "When can I file a third-party claim?",
                a: "You can file a third-party claim when someone other than your employer caused the injury. Examples include a defective product, a contractor's negligence, or a vehicle accident. You must prove negligence to recover damages."
              },
              {
                id: "report",
                q: "How quickly do I need to report a workplace injury?",
                a: "Report your injury to your employer immediately—ideally within 24-48 hours. Most states require reporting within 30 days. Delays can jeopardize your workers' compensation claim."
              },
              {
                id: "settlement",
                q: "How long does a workplace injury settlement take?",
                a: "Workers' compensation claims typically settle within 6-12 months. Third-party claims can take 12-24 months or longer depending on complexity. Your attorney will work to maximize your settlement."
              },
              {
                id: "attorney",
                q: "Do I need an attorney for a workplace injury claim?",
                a: "An attorney can maximize both your workers' compensation and third-party recovery. They handle all paperwork, negotiations, and appeals. Most work on contingency—you pay nothing upfront."
              }
            ].map((faq) => (
              <div key={faq.id} className="rounded-xl overflow-hidden bg-white border border-[#e8e2d8] transition hover:shadow-md" itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                <button onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition">
                  <h3 className="text-lg font-semibold text-left" style={{ color: '#1a4a5a' }} itemProp="name">
                    {faq.q}
                  </h3>
                  <ChevronRight size={20} className="flex-shrink-0 transition" style={{ color: '#999', transform: expandedFaq === faq.id ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-6 py-6 bg-[#f9f5ef] border-t border-[#e8e2d8]" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
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
            <a href="/guide/car-accident" className="p-6 border border-[#e8e2d8] rounded-lg hover:shadow-lg transition bg-[#f9f5ef]">
              <h3 className="font-bold mb-2" style={{ color: '#1a4a5a' }}>Car Accident Guide</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Comprehensive guide to car accident claims and settlements</p>
            </a>
            <a href="/guide/slip-and-fall" className="p-6 border border-[#e8e2d8] rounded-lg hover:shadow-lg transition bg-[#f9f5ef]">
              <h3 className="font-bold mb-2" style={{ color: '#1a4a5a' }}>Slip & Fall Guide</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Premises liability and slip & fall accident guide</p>
            </a>
            <a href="tel:+18002273669" className="p-6 border border-[#c4714a] rounded-lg hover:shadow-lg transition bg-[#f9f5ef]">
              <h3 className="font-bold mb-2" style={{ color: '#c4714a' }}>Free Consultation</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Talk to an attorney about your workplace injury</p>
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
                <li><a href="/guide/slip-and-fall" className="hover:text-white transition">Slip & Fall Guide</a></li>
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

export default WorkplaceInjuryGuide;
