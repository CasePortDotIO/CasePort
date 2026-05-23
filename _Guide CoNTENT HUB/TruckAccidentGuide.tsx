import React, { useState, useEffect } from "react";
import { ChevronRight, AlertCircle, CheckCircle, Truck, FileText, Users, MapPin, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";

/**
 * TRUCK ACCIDENT GUIDE - 10/10 AEO/GEO/SEO/VOICE OPTIMIZATION
 * 
 * TOP 0.01% OPTIMIZATION STRATEGY:
 * 
 * AEO (Answer Engine Optimization):
 * - Direct answers at top (AI extraction)
 * - FAQPage + Article + Dataset schemas
 * - Key facts highlighted
 * - Comparison tables (AI loves these)
 * - Numbered lists for featured snippets
 * 
 * SEO:
 * - Primary keyword: "truck accident guide"
 * - Secondary: "truck accident settlement", "truck accident liability"
 * - Internal linking to related pages
 * - Semantic HTML structure
 * 
 * GEO:
 * - State-specific statute of limitations
 * - Location-based settlement data
 * - Local context signals
 * 
 * VOICE INTENT:
 * - Conversational headlines
 * - Natural question phrasing
 * - Direct, concise answers
 * - "How to" and "What is" formats
 * 
 * SGE/AI OVERVIEWS:
 * - Multiple schema types
 * - Rich snippets
 * - Featured snippet targeting
 * - E-E-A-T signals
 */

const TruckAccidentGuide = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>("liability");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Schema markup for AI systems
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The Complete Truck Accident Guide: Settlement Amounts, Liability & Legal Rights",
    "description": "Attorney-reviewed truck accident guide covering liability, settlement ranges, federal regulations, and how to maximize your recovery.",
    "author": {
      "@type": "Organization",
      "name": "CasePort",
      "url": "https://caseport.io"
    },
    "datePublished": "2024-01-15",
    "dateModified": "2026-04-28",
    "publisher": {
      "@type": "Organization",
      "name": "CasePort",
      "logo": {
        "@type": "ImageObject",
        "url": "https://caseport.io/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

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

      {/* HERO SECTION - AEO OPTIMIZED */}
      <section className="pt-32 pb-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb with Schema */}
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#999' }}>
            <a href="/guide" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <span style={{ color: '#1a4a5a' }}>Truck Accident Guide</span>
          </div>

          {/* Main Headline - SEO & Voice Optimized */}
          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight" style={{ color: '#1c2b32' }}>
            Truck Accident Guide: Settlement Amounts, Liability & Legal Rights
          </h1>

          {/* Direct Answer - AEO Optimized */}
          <div className="bg-[#f0f8f6] border-l-4 border-[#4a8c7e] p-6 rounded mb-8">
            <p className="text-lg font-semibold mb-3" style={{ color: '#1a4a5a' }}>Quick Answer:</p>
            <p style={{ color: '#555' }}>
              Truck accident settlements average $75,000 to $1,000,000+ depending on injury severity. Multiple parties can be liable (driver, company, owner). With an attorney, you typically receive 30-50% higher settlements. Federal regulations (FMCSA) create additional liability that strengthens your case.
            </p>
          </div>

          {/* Subheadline */}
          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#555' }}>
            Attorney-reviewed guides that help accident victims get fair compensation. Everything you need to know about truck accident liability, settlements, and your legal rights.
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

      {/* KEY FACTS - AEO EXTRACTION OPTIMIZED */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Key Facts About Truck Accidents
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>30-50%</div>
              <p style={{ color: '#555' }}>Higher settlements with an attorney</p>
            </div>
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>5+</div>
              <p style={{ color: '#555' }}>Potentially liable parties in one case</p>
            </div>
            <div className="p-6 bg-[#f0f8f6] rounded-lg border border-[#4a8c7e]">
              <div className="text-4xl font-bold mb-2" style={{ color: '#c4714a' }}>$1M+</div>
              <p style={{ color: '#555' }}>Average severe injury settlement</p>
            </div>
          </div>

          {/* Numbered List for Featured Snippets */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold" style={{ color: '#1a4a5a' }}>5 Things You Need to Know About Truck Accidents:</h3>
            <ol className="space-y-4 list-decimal list-inside" style={{ color: '#555' }}>
              <li><strong>Multiple parties can be liable:</strong> The driver, trucking company, vehicle owner, cargo loader, or manufacturer</li>
              <li><strong>Federal regulations apply:</strong> FMCSA rules create additional liability and strengthen your case</li>
              <li><strong>Settlements are typically higher:</strong> Truck accidents cause more severe injuries than car accidents</li>
              <li><strong>Time is critical:</strong> Statute of limitations is 2-3 years in most states</li>
              <li><strong>Attorney representation matters:</strong> You typically receive 30-50% higher settlements with legal help</li>
            </ol>
          </div>
        </div>
      </section>

      {/* LIABILITY FRAMEWORK - GEO & SEO OPTIMIZED */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Who Is Liable in a Truck Accident?
          </h2>

          <div className="space-y-6">
            <p style={{ color: '#555' }}>
              Truck accidents differ from car accidents because multiple parties can be held liable. This is why truck accident settlements are typically 3-5x higher than car accident settlements.
            </p>

            <div className="bg-white border-l-4 border-[#c4714a] p-6 rounded">
              <h3 className="font-bold mb-4" style={{ color: '#1a4a5a' }}>Potentially Liable Parties:</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li><strong>1. Truck Driver:</strong> Negligent driving, speeding, fatigue, distraction, violating Hours of Service regulations</li>
                <li><strong>2. Trucking Company:</strong> Negligent hiring, inadequate training, poor maintenance, ignoring safety violations</li>
                <li><strong>3. Vehicle Owner:</strong> Failure to maintain brakes, tires, steering, lights, or other safety equipment</li>
                <li><strong>4. Cargo Loader:</strong> Improper loading causing weight imbalance, spillage, or cargo shift</li>
                <li><strong>5. Manufacturer:</strong> Defective brakes, steering, tires, or other components</li>
              </ul>
            </div>

            <div className="bg-[#fff8f0] border-l-4 border-[#c4714a] p-6 rounded">
              <h3 className="font-bold mb-3" style={{ color: '#1a4a5a' }}>Federal Regulations That Strengthen Your Case (FMCSA):</h3>
              <ul className="space-y-2" style={{ color: '#555' }}>
                <li>Hours of Service (HOS) - Drivers limited to 11 hours driving per 14-hour shift</li>
                <li>Vehicle Maintenance - Trucks must pass annual inspections</li>
                <li>Driver Qualifications - Background checks, medical exams, training required</li>
                <li>Load Securement - Cargo must be properly secured and balanced</li>
                <li>Electronic Logging Devices - Mandatory tracking of driver hours</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SETTLEMENT RANGES - AEO & GEO OPTIMIZED */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Truck Accident Settlement Ranges by Injury Severity
          </h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse" itemScope itemType="https://schema.org/Table">
              <thead>
                <tr style={{ backgroundColor: '#1a4a5a' }}>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Injury Severity</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Typical Settlement Range</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">Average Settlement</th>
                  <th className="border border-[#ddd] px-4 py-3 text-left text-white">With Attorney</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Minor</strong> (soft tissue, bruises)</td>
                  <td className="border border-[#ddd] px-4 py-3">$50,000 - $150,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$75,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$95,000 - $120,000</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f5ef' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Moderate</strong> (fractures, significant pain)</td>
                  <td className="border border-[#ddd] px-4 py-3">$150,000 - $500,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$300,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$400,000 - $600,000</td>
                </tr>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td className="border border-[#ddd] px-4 py-3"><strong>Severe</strong> (permanent injury, hospitalization)</td>
                  <td className="border border-[#ddd] px-4 py-3">$500,000 - $2,000,000+</td>
                  <td className="border border-[#ddd] px-4 py-3">$1,000,000</td>
                  <td className="border border-[#ddd] px-4 py-3">$1,500,000 - $2,500,000+</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm" style={{ color: '#999' }}>
            Data source: Commercial Vehicle Accident Claims Analysis, 2024. Settlements vary based on medical expenses, lost wages, liability clarity, state laws, and insurance limits. Truck accident settlements are 3-5x higher than car accidents due to injury severity and multiple liable parties.
          </p>
        </div>
      </section>

      {/* WITH VS WITHOUT ATTORNEY - COMPARISON OPTIMIZED */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Do You Need an Attorney for a Truck Accident?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-[#4a8c7e] rounded-lg bg-white">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#4a8c7e' }}>With an Attorney</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>30-50% higher settlement</strong> on average</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>Identifies all liable parties</strong> (driver, company, owner, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>Accesses federal violation records</strong> (FMCSA violations strengthen case)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>No upfront cost</strong> (contingency fee model)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} style={{ color: '#4a8c7e', flexShrink: 0 }} />
                  <span><strong>Handles all documentation</strong> and negotiations</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border border-[#c4714a] rounded-lg bg-white">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#c4714a' }}>Without an Attorney</h3>
              <ul className="space-y-3" style={{ color: '#555' }}>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>May miss multiple liable parties</strong> and lower settlement</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Trucking companies have experienced adjusters</strong> who negotiate against you</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Complex federal regulations</strong> (FMCSA) hard to navigate alone</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#c4714a', flexShrink: 0 }} />
                  <span><strong>Risk of settling too low</strong> without understanding case value</span>
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

      {/* FAQ SECTION - VOICE & AEO OPTIMIZED */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#1a4a5a' }}>
            Frequently Asked Questions About Truck Accidents
          </h2>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                id: "liability",
                q: "Who is liable in a truck accident?",
                a: "Multiple parties can be liable: the truck driver, the trucking company, the vehicle owner, the cargo loader, or the manufacturer. An attorney investigates all potential liable parties to maximize your recovery. This is why truck accident settlements are typically much higher than car accident settlements."
              },
              {
                id: "fmcsa",
                q: "What are FMCSA violations and how do they help my case?",
                a: "FMCSA violations (Hours of Service violations, maintenance failures, improper loading) prove negligence and significantly strengthen your case. Trucking companies that violate federal regulations are more likely to settle quickly and for higher amounts. Federal violations are powerful evidence in court."
              },
              {
                id: "settlement-timeline",
                q: "How long does a truck accident settlement take?",
                a: "Truck accident cases typically settle within 6-12 months with an attorney. Complex cases with multiple liable parties may take 12-18 months. Without an attorney, settlements often take 12-24 months or longer, and for lower amounts."
              },
              {
                id: "insurance-coverage",
                q: "What insurance covers truck accidents?",
                a: "Commercial trucks carry higher insurance limits than regular vehicles, typically $750,000 to $1,000,000 or more. The trucking company's insurance, the driver's insurance, and potentially other parties' insurance may all contribute to your recovery."
              },
              {
                id: "attorney-cost",
                q: "How much does a truck accident attorney cost?",
                a: "Personal injury attorneys typically work on contingency - they take 25-40% of your settlement as their fee. You pay nothing upfront. If you don't win, you don't pay. This aligns the attorney's interests with yours."
              }
            ].map((faq) => (
              <div
                key={faq.id}
                className="rounded-xl overflow-hidden bg-[#f9f5ef] border border-[#e8e2d8] transition hover:shadow-md"
                itemProp="mainEntity"
                itemScope
                itemType="https://schema.org/Question"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition"
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
            <a href="/guide/slip-and-fall" className="p-6 border border-[#e8e2d8] rounded-lg hover:shadow-lg transition bg-white">
              <h3 className="font-bold mb-2" style={{ color: '#1a4a5a' }}>Slip & Fall Guide</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Premises liability and slip & fall accident guide</p>
            </a>
            <a href="tel:+18002273669" className="p-6 border border-[#c4714a] rounded-lg hover:shadow-lg transition bg-white">
              <h3 className="font-bold mb-2" style={{ color: '#c4714a' }}>Free Consultation</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Talk to an attorney about your truck accident case</p>
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

export default TruckAccidentGuide;
