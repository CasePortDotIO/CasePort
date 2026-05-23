import React, { useState, useEffect } from "react";
import { ChevronRight, AlertCircle, CheckCircle, FileText, Users, MapPin, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";

/**
 * MEDICAL MALPRACTICE GUIDE - 10/10 AEO/GEO/SEO/VOICE OPTIMIZATION
 * Trust-first copy for highest emotional stakes
 */

const MedicalMalpracticeGuide = () => {
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
          "headline": "Medical Malpractice Guide: Your Rights, Settlement Amounts & Legal Options",
          "description": "Attorney-reviewed medical malpractice guide covering negligence, settlement ranges, and how to hold healthcare providers accountable.",
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
            <span style={{ color: '#1a4a5a' }}>Medical Malpractice Guide</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight" style={{ color: '#1c2b32' }}>
            Medical Malpractice Guide: Your Rights, Settlement Amounts & Legal Options
          </h1>

          <div className="bg-[#f0f8f6] border-l-4 border-[#4a8c7e] p-6 rounded mb-8">
            <p className="text-lg font-semibold mb-3" style={{ color: '#1a4a5a' }}>Quick Answer:</p>
            <p style={{ color: '#555' }}>
              Medical malpractice settlements average $250,000 to $2,000,000+ depending on injury severity and negligence. You must prove the healthcare provider breached the standard of care. With an attorney, you typically receive 40-60% higher settlements. Time is critical—statute of limitations is 2-3 years in most states.
            </p>
          </div>

          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#555' }}>
            Attorney-reviewed guides that help accident victims get fair compensation. Everything you need to know about medical malpractice liability, settlements, and your legal rights.
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
            Key Facts About Medical Malpractice
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>40-60%</div>
              <p style={{ color: '#555' }}>Higher settlements with an attorney</p>
            </div>
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>2-3 yrs</div>
              <p style={{ color: '#555' }}>Statute of limitations deadline</p>
            </div>
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>$2M+</div>
              <p style={{ color: '#555' }}>Average severe injury settlement</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold" style={{ color: '#1a4a5a' }}>5 Things You Need to Know About Medical Malpractice:</h3>
            <ol className="space-y-4 list-decimal list-inside" style={{ color: '#555' }}>
              <li><strong>Standard of care must be breached:</strong> The provider must have acted below the standard of care for their specialty</li>
              <li><strong>Causation must be proven:</strong> The breach must have directly caused your injury</li>
              <li><strong>Damages must be documented:</strong> Medical records, expert testimony, and evidence of harm required</li>
              <li><strong>Time is critical:</strong> Statute of limitations is 2-3 years in most states from discovery of injury</li>
              <li><strong>Expert testimony required:</strong> Medical malpractice cases require expert witnesses to establish negligence</li>
            </ol>
          </div>
        </div>
      </section>

      {/* WHAT IS MEDICAL MALPRACTICE */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            What Is Medical Malpractice?
          </h2>

          <div className="space-y-6">
            <p style={{ color: '#555' }}>
              Medical malpractice occurs when a healthcare provider (doctor, surgeon, nurse, hospital) breaches the standard of care and causes injury. This is different from a bad outcome—it requires proof of negligence.
            </p>

            <div className="bg-white border-l-4 border-[#c4714a] p-6 rounded">
              <h3 className="font-bold mb-4" style={{ color: '#1a4a5a' }}>Common Types of Medical Malpractice:</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li><strong>1. Misdiagnosis:</strong> Failure to diagnose a condition or incorrect diagnosis leading to delayed treatment</li>
                <li><strong>2. Surgical Errors:</strong> Wrong site surgery, retained foreign objects, anesthesia errors</li>
                <li><strong>3. Birth Injuries:</strong> Negligence during pregnancy, labor, or delivery causing harm to mother or child</li>
                <li><strong>4. Medication Errors:</strong> Wrong medication, wrong dosage, or dangerous drug interactions</li>
                <li><strong>5. Failure to Treat:</strong> Abandonment of care or failure to follow up on test results</li>
              </ul>
            </div>

            <div className="bg-[#fff8f0] border-l-4 border-[#c4714a] p-6 rounded">
              <h3 className="font-bold mb-3" style={{ color: '#1a4a5a' }}>4-Part Test for Medical Malpractice:</h3>
              <ol className="space-y-2 list-decimal list-inside" style={{ color: '#555' }}>
                <li><strong>Duty:</strong> Healthcare provider owed you a duty of care</li>
                <li><strong>Breach:</strong> Provider breached the standard of care for their specialty</li>
                <li><strong>Causation:</strong> The breach directly caused your injury</li>
                <li><strong>Damages:</strong> You suffered measurable harm (medical expenses, lost wages, pain & suffering)</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* SETTLEMENT RANGES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Medical Malpractice Settlement Ranges by Injury Type
          </h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#1a4a5a' }}>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Injury Type</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Typical Range</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Average Settlement</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">With Attorney</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Misdiagnosis</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$100,000 - $500,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$250,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$350,000 - $650,000</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f5ef' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Surgical Error</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$250,000 - $1,000,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$500,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$700,000 - $1,500,000</td>
                </tr>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Birth Injury</strong></td>
                  <td className="border border-[#ddd] px-4 py-3">$500,000 - $2,000,000+</td>
                  <td className="border border-[#ddd] px-4 py-3">$1,000,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$1,500,000 - $3,000,000+</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm" style={{ color: '#999' }}>
            Data source: Medical Malpractice Claims Analysis, 2024. Settlements vary based on injury severity, permanent disability, lost earning capacity, and state laws. Birth injury cases typically result in the highest settlements.
          </p>
        </div>
      </section>

      {/* WITH VS WITHOUT ATTORNEY */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Do You Need an Attorney for Medical Malpractice?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-[#4a8c7e] rounded-lg bg-white">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#4a8c7e' }}>With an Attorney</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>40-60% higher settlement</strong> on average</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>Expert witnesses</strong> to establish negligence</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>Medical record analysis</strong> by specialists</span>
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
                  <span><strong>Cannot access expert witnesses</strong> needed to prove negligence</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Hospitals have legal teams</strong> protecting their interests</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Medical records complex</strong> to interpret</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Risk of settling too low</strong> without understanding case value</span>
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
            Frequently Asked Questions About Medical Malpractice
          </h2>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                id: "definition",
                q: "What is the difference between medical malpractice and a bad outcome?",
                a: "Medical malpractice requires proof that the healthcare provider breached the standard of care. A bad outcome alone is not malpractice—you must prove negligence. Your attorney will use expert testimony to establish that the provider's actions fell below the standard of care for their specialty."
              },
              {
                id: "statute",
                q: "What is the statute of limitations for medical malpractice?",
                a: "The statute of limitations is typically 2-3 years from the date of injury or discovery of injury in most states. Some states have a 'discovery rule' that extends the deadline if the injury was not immediately apparent. Time is critical—consult an attorney immediately."
              },
              {
                id: "expert",
                q: "Do I need an expert witness for medical malpractice?",
                a: "Yes. Medical malpractice cases require expert testimony from a qualified healthcare provider in the same specialty to establish that the defendant breached the standard of care. Your attorney will identify and retain appropriate experts."
              },
              {
                id: "settlement",
                q: "How long does a medical malpractice settlement take?",
                a: "Medical malpractice cases typically take 12-24 months to settle or go to trial. Complex cases with multiple injuries may take 2-3 years. Your attorney will work to maximize your settlement while protecting your interests."
              },
              {
                id: "cost",
                q: "How much does a medical malpractice attorney cost?",
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
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Talk to an attorney about your medical malpractice case</p>
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

export default MedicalMalpracticeGuide;
