import React, { useState, useEffect } from "react";
import { ChevronRight, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

const PedestrianAccidentGuide = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>("definition");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Pedestrian Accident Guide: Liability, Settlement Amounts & Legal Rights",
          "description": "Attorney-reviewed pedestrian accident guide covering urban liability, settlement ranges, and how to maximize recovery.",
          "author": { "@type": "Organization", "name": "CasePort" },
          "datePublished": "2024-01-15",
          "dateModified": "2026-04-28"
        })}
      </script>

      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 px-7 flex items-center justify-between transition-all duration-300 ${isScrolled ? "bg-[#f9f5ef] border-b border-[#e8e2d8] shadow-md" : "bg-transparent"}`} style={{ opacity: isScrolled ? 1 : 0, pointerEvents: isScrolled ? 'auto' : 'none' }}>
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

      <section className="pt-32 pb-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#999' }}>
            <a href="/guide" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <span style={{ color: '#1a4a5a' }}>Pedestrian Accident Guide</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight" style={{ color: '#1c2b32' }}>
            Pedestrian Accident Guide: Liability, Settlement Amounts & Legal Rights
          </h1>

          <div className="bg-[#f0f8f6] border-l-4 border-[#4a8c7e] p-6 rounded mb-8">
            <p className="text-lg font-semibold mb-3" style={{ color: '#1a4a5a' }}>Quick Answer:</p>
            <p style={{ color: '#555' }}>
              Pedestrian accident settlements average $150,000 to $1,000,000+ depending on injury severity. Drivers have a duty to avoid pedestrians. With an attorney, you typically receive 40-55% higher settlements. Urban high-volume accidents are common and highly recoverable.
            </p>
          </div>

          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#555' }}>
            Attorney-reviewed guides that help accident victims get fair compensation. Everything you need to know about pedestrian accident liability, settlements, and your legal rights.
          </p>

          <a href="tel:+18002273669" className="inline-flex items-center gap-2 bg-[#c4714a] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#d4855e] transition-all shadow-lg">
            Get Free Case Review
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Key Facts About Pedestrian Accidents
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>40-55%</div>
              <p style={{ color: '#555' }}>Higher settlements with an attorney</p>
            </div>
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>Urban</div>
              <p style={{ color: '#555' }}>High-volume category</p>
            </div>
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>$1M+</div>
              <p style={{ color: '#555' }}>Average severe injury settlement</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold" style={{ color: '#1a4a5a' }}>5 Things You Need to Know About Pedestrian Accidents:</h3>
            <ol className="space-y-4 list-decimal list-inside" style={{ color: '#555' }}>
              <li><strong>Drivers have a duty to avoid pedestrians:</strong> Even if you were jaywalking, the driver may still be liable</li>
              <li><strong>Comparative negligence applies:</strong> Your recovery may be reduced if you were partially at fault</li>
              <li><strong>Injuries are typically severe:</strong> Pedestrians have no protection, resulting in serious injuries</li>
              <li><strong>Damages include pain & suffering:</strong> You can recover for physical pain, emotional trauma, and lost quality of life</li>
              <li><strong>Attorney representation is critical:</strong> Drivers' insurance companies will try to minimize your recovery</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Pedestrian Accident Settlement Ranges by Injury Severity
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
                  <td className="border border-[#ddd] px-4 py-3"><strong>Minor (soft tissue, bruises)</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$100,000 - $300,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$150,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$200,000 - $400,000</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f5ef' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Moderate (fractures, significant pain)</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$300,000 - $750,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$500,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$700,000 - $1,000,000</td>
                </tr>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Severe (permanent injury, hospitalization)</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$750,000 - $2,000,000+</td>
                  <td className="border border-[#ddd] px-4 py-3">$1,000,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$1,500,000 - $2,500,000+</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm" style={{ color: '#999' }}>
            Data source: Pedestrian Accident Claims Analysis, 2024. Settlements vary based on injury severity, permanent disability, lost earning capacity, and state laws.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Frequently Asked Questions About Pedestrian Accidents
          </h2>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                id: "definition",
                q: "Can I recover if I was jaywalking?",
                a: "Yes. Even if you were jaywalking, the driver may still be liable if they failed to exercise reasonable care to avoid hitting you. Your recovery may be reduced based on comparative negligence, but you can still recover damages."
              },
              {
                id: "duty",
                q: "What duty do drivers have to pedestrians?",
                a: "Drivers have a duty to exercise reasonable care to avoid hitting pedestrians. This includes watching for pedestrians, maintaining safe speeds, and obeying traffic signals. Failure to do so constitutes negligence."
              },
              {
                id: "comparative",
                q: "What is comparative negligence in pedestrian accidents?",
                a: "Comparative negligence means your recovery is reduced by your percentage of fault. If you were 20% at fault and the driver was 80% at fault, you can recover 80% of your damages."
              },
              {
                id: "settlement",
                q: "How long does a pedestrian accident settlement take?",
                a: "Pedestrian accident cases typically take 12-18 months to settle or go to trial. Complex cases may take 2+ years. Your attorney will work to maximize your settlement while protecting your interests."
              },
              {
                id: "attorney",
                q: "Do I need an attorney for a pedestrian accident?",
                a: "Yes. An attorney can maximize your settlement by countering insurance company tactics, gathering evidence, and negotiating on your behalf. Most work on contingency—you pay nothing upfront."
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
            <a href="/guide/slip-and-fall" className="p-6 border border-[#e8e2d8] rounded-lg hover:shadow-lg transition bg-white">
              <h3 className="font-bold mb-2" style={{ color: '#1a4a5a' }}>Slip & Fall Guide</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Premises liability and slip & fall accident guide</p>
            </a>
            <a href="tel:+18002273669" className="p-6 border border-[#c4714a] rounded-lg hover:shadow-lg transition bg-white">
              <h3 className="font-bold mb-2" style={{ color: '#c4714a' }}>Free Consultation</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Talk to an attorney about your pedestrian accident case</p>
            </a>
          </div>
        </div>
      </section>

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

export default PedestrianAccidentGuide;
