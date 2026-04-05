import { useState, useEffect } from "react";
import { Phone, CheckCircle2, ArrowRight, Star, AlertCircle, TrendingUp, Shield, Zap, Award } from "lucide-react";
import { getCityData, CityData } from "@/data/cityData";
import { useRoute } from "wouter";
import { injectSchemas, generateLocalBusinessSchema, generateServiceSchema, generateBreadcrumbSchema, generateFAQSchema, generateAggregateOfferSchema } from "@/lib/schemaGenerator";

/**
 * Per-City Landing Page Component
 * Dynamic route: /injured/[city-slug]
 * Example: /injured/los-angeles, /injured/chicago, etc.
 */

export default function CityPage() {
  const [route, params] = useRoute("/injured/:city");
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const [selectedInjuryType, setSelectedInjuryType] = useState("car-accident");
  const [qualificationStep, setQualificationStep] = useState(0);
  const [qualificationStatus, setQualificationStatus] = useState<"pending" | "qualified" | "not-qualified">("pending");

  useEffect(() => {
    if (params?.city) {
      const data = getCityData(params.city);
      setCityData(data);
      // Set default injury type to the first available
      setSelectedInjuryType(Object.keys(data.settlementRanges)[0]);

      // Inject JSON-LD schemas for SEO/AEO
      const schemas = [
        generateLocalBusinessSchema(data),
        generateServiceSchema(data),
        generateBreadcrumbSchema(data),
        generateAggregateOfferSchema(data),
        generateFAQSchema([
          { q: "Will I definitely get a settlement?", a: "Results vary by case. We connect you with vetted firms who evaluate your case honestly." },
          { q: "Do I have to pay anything upfront?", a: "Zero. Firms work on contingency—you only pay if you win." },
          { q: "Why should I trust CasePort?", a: "We reject 97% of firms. Only top 3% make our network." },
          { q: "What if I'm not qualified?", a: "We'll tell you straight. If your case doesn't meet criteria, we won't waste your time." },
        ]),
      ];
      injectSchemas(schemas);

      // Update page title and meta description
      document.title = `Personal Injury Lawyer in ${data.city}, ${data.stateCode} | CasePort.io`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", `Get connected to top 3% vetted personal injury lawyers in ${data.city}, ${data.stateCode} in 2 minutes. Free service for claimants.`);
      }
    }
  }, [params?.city]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      sections.forEach((section) => {
        const id = parseInt(section.getAttribute("data-section") || "0");
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setVisibleSections((prev) => Array.from(new Set([...prev, id])));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQualificationAnswer = (answer: boolean) => {
    if (qualificationStep < 2) {
      setQualificationStep(qualificationStep + 1);
    } else {
      setQualificationStatus(answer ? "qualified" : "not-qualified");
    }
  };

  if (!cityData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex flex-col">
            <div className="text-xl md:text-2xl font-bold tracking-tight uppercase">
              CASE<span className="accent-cyan">PORT</span>
            </div>
            <div className="text-xs font-bold text-gray-600 tracking-widest uppercase">{cityData.city}, {cityData.stateCode}</div>
          </div>
          <button className="btn-cta" aria-label="Call now to get matched with a firm">
            <Phone className="w-4 h-4 inline mr-2" />
            Call Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-white via-[#F8F9FB] to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-[#00D9FF]/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#00D9FF]/3 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="label-uppercase mb-6 text-center">INJURED IN {cityData.city.toUpperCase()}?</div>
            <h1 className="text-6xl md:text-7xl font-bold leading-[1.05] mb-6">
              {cityData.copy.headline}
              <br />
              <span className="accent-cyan">Get Justice Now.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              {cityData.copy.description}
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Get connected to a <span className="font-semibold accent-cyan">top 3% vetted firm in 2 minutes.</span> No waiting. No games.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="btn-cta text-lg px-8 py-4 hover:shadow-lg hover:shadow-[#00D9FF]/20 transition-all duration-300">
                <Phone className="w-5 h-5 inline mr-2" />
                Start My Case
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:border-[#00D9FF] hover:text-[#00D9FF] transition-all duration-300">
                Check Qualification
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { label: "CASES MATCHED IN " + cityData.city.toUpperCase(), value: cityData.stats.casesMatched, suffix: "this month" },
              { label: "AVG RESPONSE", value: cityData.stats.avgResponse, suffix: "minutes" },
              { label: "FIRM ACCEPTANCE", value: cityData.stats.firmAcceptance, suffix: "%" },
              { label: "QUALIFICATION RATE", value: "87", suffix: "%" },
            ].map((metric, idx) => (
              <div key={idx} className={`text-center p-4 rounded-lg glass-panel transition-all duration-500 ${visibleSections.includes(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className="label-uppercase text-xs mb-2">{metric.label}</div>
                <div className="text-3xl md:text-4xl font-bold accent-cyan">{metric.value}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.suffix}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Concerns */}
      <section data-section="2" className="py-16 px-4 md:px-8 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="label-uppercase mb-4">COMMON CONCERNS</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Questions, Answered</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Will I definitely get a settlement?", a: "Results vary by case. We connect you with vetted firms who evaluate your case honestly." },
              { q: "Do I have to pay anything upfront?", a: "Zero. Firms work on contingency—you only pay if you win." },
              { q: "Why should I trust CasePort?", a: "We reject 97% of firms. Only top 3% make our network." },
              { q: "What if I'm not qualified?", a: "We'll tell you straight. If your case doesn't meet criteria, we won't waste your time." },
            ].map((item, idx) => (
              <details key={idx} className={`p-6 rounded-lg glass-panel cursor-pointer group transition-all duration-500 ${visibleSections.includes(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                <summary className="font-semibold text-gray-900 flex items-center justify-between">
                  {item.q}
                  <ArrowRight className="w-5 h-5 text-[#00D9FF] group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-gray-600 mt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Qualification Gate */}
      <section data-section="3" className="py-16 px-4 md:px-8 bg-gradient-to-b from-[#F8F9FB] to-white">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="label-uppercase mb-4">QUICK CHECK</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Do You Qualify?</h2>
            <p className="text-gray-600">30 seconds. No commitment. Know your status instantly.</p>
          </div>

          {qualificationStatus === "pending" ? (
            <div className="glass-panel p-8 rounded-lg space-y-6">
              {qualificationStep === 0 && (
                <div className={`transition-all duration-500 ${visibleSections.includes(3) ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-gray-900 mb-4">Do you have medical records or documentation of your injury?</div>
                    <div className="flex gap-3">
                      <button onClick={() => handleQualificationAnswer(true)} className="flex-1 px-6 py-3 bg-[#00D9FF] text-gray-900 font-semibold rounded-lg hover:bg-[#00D9FF]/90 transition-all">Yes</button>
                      <button onClick={() => handleQualificationAnswer(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:border-[#00D9FF] transition-all">No</button>
                    </div>
                  </div>
                </div>
              )}

              {qualificationStep === 1 && (
                <div className={`transition-all duration-500 ${visibleSections.includes(3) ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-gray-900 mb-4">Did your injury happen within the last 2 years?</div>
                    <div className="flex gap-3">
                      <button onClick={() => handleQualificationAnswer(true)} className="flex-1 px-6 py-3 bg-[#00D9FF] text-gray-900 font-semibold rounded-lg hover:bg-[#00D9FF]/90 transition-all">Yes</button>
                      <button onClick={() => handleQualificationAnswer(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:border-[#00D9FF] transition-all">No</button>
                    </div>
                  </div>
                </div>
              )}

              {qualificationStep === 2 && (
                <div className={`transition-all duration-500 ${visibleSections.includes(3) ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-gray-900 mb-4">Are you willing to work with a lawyer to pursue your case?</div>
                    <div className="flex gap-3">
                      <button onClick={() => handleQualificationAnswer(true)} className="flex-1 px-6 py-3 bg-[#00D9FF] text-gray-900 font-semibold rounded-lg hover:bg-[#00D9FF]/90 transition-all">Yes</button>
                      <button onClick={() => handleQualificationAnswer(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:border-[#00D9FF] transition-all">No</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : qualificationStatus === "qualified" ? (
            <div className="glass-panel p-8 rounded-lg text-center bg-gradient-to-br from-[#00D9FF]/10 to-transparent border border-[#00D9FF]/20">
              <CheckCircle2 className="w-12 h-12 accent-cyan mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">You Likely Qualify</h3>
              <p className="text-gray-600 mb-6">Based on your answers, you're a strong candidate. Let's connect you with the right firm.</p>
              <button className="w-full btn-cta py-4 text-lg font-semibold">
                <Phone className="w-5 h-5 inline mr-2" />
                Get Matched Now
              </button>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-lg text-center bg-gradient-to-br from-gray-100 to-transparent border border-gray-200">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">You May Not Qualify</h3>
              <p className="text-gray-600 mb-6">Based on your answers, your case may not meet our criteria. But you can still call us.</p>
              <button className="w-full btn-cta py-4 text-lg font-semibold">
                <Phone className="w-5 h-5 inline mr-2" />
                Call for Honest Feedback
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Settlement Feed - City Specific */}
      <section data-section="4" className="py-16 px-4 md:px-8 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="label-uppercase mb-8 text-center">REAL SETTLEMENTS</div>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Claimants in {cityData.city} Winning</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">These are real settlements from claimants in {cityData.city}. Your case could be next.</p>
          <div className="space-y-3 max-w-2xl mx-auto">
            {cityData.settlements.map((settlement, idx) => (
              <div key={idx} className={`p-5 glass-panel rounded-lg border border-gray-200 hover:border-[#00D9FF] hover:shadow-lg hover:shadow-[#00D9FF]/10 transition-all duration-300 ${visibleSections.includes(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-[#00D9FF]" />
                      <div className="font-semibold text-gray-900">{settlement.name}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{settlement.city}, {settlement.stateCode} • {settlement.injury}</div>
                    <div className="text-xs text-gray-500">{settlement.timeframe}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold accent-cyan">{settlement.amount}</div>
                    <div className="text-xs text-gray-500 mt-1">Settlement</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Settlement Calculator - City Specific */}
      <section data-section="5" className="py-16 px-4 md:px-8 bg-gradient-to-b from-[#F8F9FB] to-white">
        <div className="container max-w-2xl mx-auto">
          <div className="label-uppercase mb-8 text-center">ESTIMATE YOUR CASE</div>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">What Could Your {cityData.city} Case Be Worth?</h2>
          <p className="text-center text-gray-600 mb-12">Based on injury type and {cityData.city} market data.</p>

          <div className={`glass-panel p-8 rounded-lg transition-all duration-500 ${visibleSections.includes(5) ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-4">Select Your Injury Type</label>
              <select
                value={selectedInjuryType}
                onChange={(e) => setSelectedInjuryType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all duration-300 font-semibold"
              >
                {Object.keys(cityData.settlementRanges).map((key) => (
                  <option key={key} value={key}>
                    {key === "car-accident" ? "Car Accident" : key === "slip-fall" ? "Slip & Fall" : key === "medical-malpractice" ? "Medical Malpractice" : "Workplace Injury"}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gradient-to-br from-[#00D9FF]/10 to-transparent p-6 rounded-lg border border-[#00D9FF]/20 mb-6">
              <div className="text-sm text-gray-600 mb-2">Estimated Settlement Range in {cityData.city}</div>
              <div className="text-4xl font-bold accent-cyan mb-2">{cityData.settlementRanges[selectedInjuryType].range}</div>
              <div className="text-sm text-gray-600">Average: {cityData.settlementRanges[selectedInjuryType].avg}</div>
              <div className="text-xs text-gray-500 mt-4 italic">*Estimates based on {cityData.city} market data. Results vary by case and jurisdiction.</div>
            </div>

            <button className="w-full btn-cta py-4 text-lg font-semibold">
              <Phone className="w-5 h-5 inline mr-2" />
              Get Matched Now
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Stop Waiting. Start Moving.</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your evidence is disappearing. <span className="font-semibold">Every day you wait, your case gets weaker.</span> Get connected to a top 3% vetted firm in 2 minutes.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="btn-cta text-lg px-8 py-4 hover:shadow-lg hover:shadow-[#00D9FF]/20 transition-all duration-300">
              <Phone className="w-5 h-5 inline mr-2" />
              Start My Case
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:border-[#00D9FF] hover:text-[#00D9FF] transition-all duration-300">
              Check Qualification
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-8">Available 24/7 • No commitment • Free for claimants</p>
        </div>
      </section>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 glass-panel">
        <div className="container flex items-center justify-between py-4">
          <div>
            <div className="font-semibold text-gray-900">Ready to get matched?</div>
            <div className="text-sm text-gray-600">{cityData.stats.casesMatched} claimants matched this month</div>
          </div>
          <button className="btn-cta px-6 py-3">
            <Phone className="w-4 h-4 inline mr-2" />
            Start Case
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-8 mt-20">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-gray-900 mb-4">CASEPORT</div>
              <div className="text-sm text-gray-600">Your Case Matters</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-4">Product</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/" className="hover:text-[#00D9FF] transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-[#00D9FF] transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-[#00D9FF] transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-4">Legal</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#00D9FF] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#00D9FF] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#00D9FF] transition-colors">Compliance</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-4">Contact</div>
              <div className="text-sm text-gray-600">
                <div>Phone: 1-800-CASE-PORT</div>
                <div>Email: support@caseport.io</div>
                <div>Available 24/7</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2026 CasePort.io. All rights reserved. | CasePort is not a law firm. We connect claimants with vetted attorneys.</p>
            <p className="mt-2">Results vary by case. For illustrative purposes only. See full disclaimers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
