import React, { useState, useEffect } from "react";
import { ChevronRight, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

const MotorcycleAccidentGuide = () => {
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
          "headline": "Motorcycle Accident Guide: Liability, Settlement Amounts & Legal Rights",
          "description": "Attorney-reviewed motorcycle accident guide covering distinct liability issues, settlement ranges, and how to maximize recovery.",
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
            <span style={{ color: '#1a4a5a' }}>Motorcycle Accident Guide</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight" style={{ color: '#1c2b32' }}>
            Motorcycle Accident Guide: Liability, Settlement Amounts & Legal Rights
          </h1>

          <div className="bg-[#f0f8f6] border-l-4 border-[#4a8c7e] p-6 rounded mb-8">
            <p className="text-lg font-semibold mb-3" style={{ color: '#1a4a5a' }}>Quick Answer:</p>
            <p style={{ color: '#555' }}>
              Motorcycle accident settlements average $100,000 to $1,500,000+ depending on injury severity. Motorcyclists face unique liability challenges due to bias and visibility issues. With an attorney, you typically receive 35-50% higher settlements. Federal regulations and helmet laws affect liability determination.
            </p>
          </div>

          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#555' }}>
            Attorney-reviewed guides that help accident victims get fair compensation. Everything you need to know about motorcycle accident liability, settlements, and your legal rights.
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
            Key Facts About Motorcycle Accidents
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>35-50%</div>
              <p style={{ color: '#555' }}>Higher settlements with an attorney</p>
            </div>
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>Bias</div>
              <p style={{ color: '#555' }}>Motorcyclists face prejudice in claims</p>
            </div>
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>$1.5M+</div>
              <p style={{ color: '#555' }}>Average severe injury settlement</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold" style={{ color: '#1a4a5a' }}>5 Things You Need to Know About Motorcycle Accidents:</h3>
            <ol className="space-y-4 list-decimal list-inside" style={{ color: '#555' }}>
              <li><strong>Motorcyclists face bias:</strong> Adjusters often assume motorcyclists are at fault</li>
              <li><strong>Visibility is a factor:</strong> "I didn't see the motorcycle" is a common excuse</li>
              <li><strong>Helmet laws vary by state:</strong> Helmet use affects liability and damages</li>
              <li><strong>Injuries are typically severe:</strong> Motorcycle accidents cause more serious injuries than car accidents</li>
              <li><strong>Attorney representation is critical:</strong> You need someone to counter bias and maximize recovery</li>
            </ol>
          </div>
        </div>
      </section>

      {/* DISTINCT LIABILITY ISSUES */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Distinct Liability Issues in Motorcycle Accidents
          </h2>

          <div className="space-y-6">
            <div className="bg-white border-l-4 border-[#c4714a] p-6 rounded">
              <h3 className="font-bold mb-3" style={{ color: '#1a4a5a' }}>Motorcyclist Bias & Stereotypes</h3>
              <p style={{ color: '#555' }}>Insurance adjusters often assume motorcyclists are reckless or at fault. Your attorney must counter this bias with evidence, expert testimony, and accident reconstruction.</p>
            </div>

            <div className="bg-white border-l-4 border-[#4a8c7e] p-6 rounded">
              <h3 className="font-bold mb-3" style={{ color: '#1a4a5a' }}>"I Didn't See the Motorcycle"</h3>
              <p style={{ color: '#555' }}>This common excuse is not a valid defense. Drivers have a duty to see and avoid motorcycles. Your attorney can use traffic laws and expert testimony to prove the driver was negligent.</p>
            </div>

            <div className="bg-white border-l-4 border-[#4a8c7e] p-6 rounded">
              <h3 className="font-bold mb-3" style={{ color: '#1a4a5a' }}>Helmet Law Complications</h3>
              <p style={{ color: '#555' }}>Some states have helmet laws; others don't. Adjusters may try to claim you were partially at fault if you weren't wearing a helmet. Your attorney will argue this doesn't reduce the other driver's liability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SETTLEMENT RANGES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Motorcycle Accident Settlement Ranges by Injury Severity
          </h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#1a4a5a' }}>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Injury Severity</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Typical Range</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Average Settlement</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">With Attorney</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Minor (soft tissue)</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$75,000 - $200,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$125,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$175,000 - $300,000</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f5ef' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Moderate (fractures)</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$200,000 - $750,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$400,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$600,000 - $1,000,000</td>
                </tr>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Severe (permanent injury)</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$750,000 - $2,000,000+</td>
                  <td className="border border-[#ddd] px-4 py-3">$1,200,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$1,500,000 - $2,500,000+</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm" style={{ color: '#999' }}>
            Data source: Motorcycle Accident Claims Analysis, 2024. Settlements vary based on injury severity, permanent disability, lost earning capacity, and state laws.
          </p>
        </div>
      </section>

      {/* WITH VS WITHOUT ATTORNEY */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Do You Need an Attorney for a Motorcycle Accident?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-[#4a8c7e] rounded-lg bg-white">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#4a8c7e' }}>With an Attorney</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>35-50% higher settlement</strong> on average</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>Counters motorcyclist bias</strong> with evidence</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>Accident reconstruction experts</strong> prove liability</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>No upfront cost</strong> (contingency fee)</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border border-[#c4714a] rounded-lg bg-white">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#c4714a' }}>Without an Attorney</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Adjusters exploit bias</strong> against motorcyclists</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>May accept lowball offers</strong> without understanding case value</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Cannot access expert witnesses</strong> for accident reconstruction</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Time-consuming process</strong> (6-12+ months)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Frequently Asked Questions About Motorcycle Accidents
          </h2>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                id: "definition",
                q: "Why do motorcyclists face bias in accident claims?",
                a: "Insurance adjusters often stereotype motorcyclists as reckless. This bias can unfairly reduce your settlement. An attorney counters this with evidence, expert testimony, and accident reconstruction to prove the other driver was at fault."
              },
              {
                id: "helmet",
                q: "Does not wearing a helmet reduce my settlement?",
                a: "No. The other driver's liability is separate from helmet use. While helmet laws vary by state, not wearing a helmet doesn't reduce the other driver's responsibility for the accident. Your attorney will argue this distinction."
              },
              {
                id: "visibility",
                q: "Is 'I didn't see the motorcycle' a valid defense?",
                a: "No. Drivers have a duty to see and avoid motorcycles. This is not a valid defense. Your attorney can use traffic laws and expert testimony to prove the driver was negligent for failing to see you."
              },
              {
                id: "settlement",
                q: "How long does a motorcycle accident settlement take?",
                a: "Motorcycle accident cases typically take 12-18 months to settle or go to trial. Complex cases may take 2+ years. Your attorney will work to maximize your settlement while protecting your interests."
              },
              {
                id: "cost",
                q: "How much does a motorcycle accident attorney cost?",
                a: "Personal injury attorneys typically work on contingency—they take 25-40% of your settlement as their fee. You pay nothing upfront. If you don't win, you don't pay. This aligns the attorney's interests with yours."
              }
            ].map((faq) => (
              <div key={faq.id} className="rounded-xl overflow-hidden bg-[#f9f5ef] border border-[#e8e2d8] transition hover:shadow-md" itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                <button onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition">
                  <h3 className="text-lg font-semibold text-left" style={{ color: '#1a4a5a' }} itemProp="name">
                    {faq.q}
                  </h3>
                  <ChevronRight size={20} className="flex-shrink-0 transition" style={{ color: '#999', transform: expandedFaq === faq.id ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-6 py-6 bg-white border-t border-[#e8e2d8]" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
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
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Related Guides
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <a href="/guide/car-accident" className="p-6 border border-[#e8e2d8] rounded-lg hover:shadow-lg transition bg-white">
              <h3 className="font-bold mb-2" style={{ color: '#1a4a5a' }}>Car Accident Guide</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Comprehensive guide to car accident claims and settlements</p>
            </a>
            <a href="/guide/truck-accident" className="p-6 border border-[#e8e2d8] rounded-lg hover:shadow-lg transition bg-white">
              <h3 className="font-bold mb-2" style={{ color: '#1a4a5a' }}>Truck Accident Guide</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Complete guide to truck accident liability and settlements</p>
            </a>
            <a href="tel:+18002273669" className="p-6 border border-[#c4714a] rounded-lg hover:shadow-lg transition bg-white">
              <h3 className="font-bold mb-2" style={{ color: '#c4714a' }}>Free Consultation</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Talk to an attorney about your motorcycle accident case</p>
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
                <li><a href="/guide/truck-accident" className="hover:text-white transition">Truck Accident Guide</a></li>
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

export default MotorcycleAccidentGuide;
