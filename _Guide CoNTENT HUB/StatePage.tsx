import { useRoute } from "wouter";
import { ChevronLeft, ChevronRight, MapPin, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { getStatePageBySlug, getAllStatePages } from "@/lib/pageData";
import NotFound from "./NotFound";

/**
 * STATE PAGE COMPONENT
 * 
 * Dynamically renders state-specific personal injury law pages.
 * Each page includes:
 * - State-specific statute of limitations
 * - Settlement ranges by injury type
 * - Negligence laws
 * - Top cities
 * - Resources and links
 * - Full JSON-LD schema markup for AEO/SEO
 */

const StatePage = () => {
  const [match, params] = useRoute("/guides/states/:slug");

  if (!match) return null;

  const slug = params?.slug as string;
  const stateData = getStatePageBySlug(slug);

  if (!stateData) {
    return <NotFound />;
  }

  const allStates = getAllStatePages();
  const currentIndex = allStates.findIndex(s => s.slug === slug);
  const previousState = currentIndex > 0 ? allStates[currentIndex - 1] : null;
  const nextState = currentIndex < allStates.length - 1 ? allStates[currentIndex + 1] : null;

  // Generate JSON-LD schema for this state page
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Personal Injury Law in ${stateData.state}: Statute of Limitations & Settlement Ranges`,
    description: `Complete guide to personal injury law in ${stateData.state}. Statute of limitations: ${stateData.statuteOfLimitations.years} years. Average settlement: ${stateData.averageSettlement}.`,
    author: {
      "@type": "Organization",
      name: "CasePort.io",
      url: "https://www.caseport.io"
    },
    datePublished: "2026-04-24",
    dateModified: "2026-04-24",
    image: "https://www.caseport.io/og-image.png",
    keywords: `${stateData.state} personal injury lawyer, ${stateData.state} statute of limitations, ${stateData.state} settlement amounts`,
    inLanguage: "en-US"
  };

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 px-7 flex items-center justify-between bg-[rgba(249,245,239,.93)] border-b border-[#e8e2d8] shadow-sm">
        <a href="/" className="flex flex-col gap-0.5">
          <div className="font-bold text-xs tracking-widest text-[#1a4a5a]">CASEPORT</div>
          <div className="text-[9px] font-semibold tracking-widest text-[#4a8c7e]">Personal Injury Guides</div>
        </a>
        <div className="flex items-center gap-3">
          <a href="tel:+18002273669" className="hidden sm:flex text-xs font-semibold text-[#2e4350] hover:text-[#1a4a5a]">
            1-800-227-3669
          </a>
          <a href="/" className="px-4 py-2 text-xs font-semibold text-white bg-[#c4714a] rounded-full hover:bg-[#b35f3a] transition-colors">
            Free Case Review
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-7">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#4a8c7e] mb-8">
            <a href="/guides" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <a href="/guides/states" className="hover:text-[#1a4a5a]">States</a>
            <ChevronRight size={16} />
            <span className="text-[#1a4a5a] font-semibold">{stateData.state}</span>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={24} className="text-[#c4714a]" />
              <h1 className="text-4xl font-bold text-[#1a4a5a]">{stateData.state}</h1>
            </div>
            <p className="text-lg text-[#4a8c7e] mb-6">
              Personal Injury Law Guide: Statute of Limitations, Settlement Ranges & Your Rights
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Statute of Limitations</div>
                <div className="text-3xl font-bold text-[#1a4a5a]">{stateData.statuteOfLimitations.years} years</div>
                <p className="text-xs text-[#666] mt-2">{stateData.statuteOfLimitations.description}</p>
              </div>
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Negligence Type</div>
                <div className="text-lg font-bold text-[#1a4a5a]">{stateData.negligenceType}</div>
              </div>
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Average Settlement</div>
                <div className="text-lg font-bold text-[#1a4a5a]">{stateData.averageSettlement}</div>
              </div>
            </div>
          </div>

          {/* Statute of Limitations Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Statute of Limitations in {stateData.state}</h2>
            <div className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <p className="text-[#333] mb-4">
                {stateData.statuteOfLimitations.description}
              </p>
              <div className="bg-[#f0f8f6] border-l-4 border-[#4a8c7e] p-4 rounded">
                <h3 className="font-semibold text-[#1a4a5a] mb-3">Exceptions & Tolling</h3>
                <ul className="space-y-2">
                  {stateData.statuteOfLimitations.exceptions.map((exception, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#333]">
                      <CheckCircle size={16} className="text-[#4a8c7e] mt-0.5 flex-shrink-0" />
                      <span>{exception}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Settlement Ranges Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Settlement Ranges by Injury Type</h2>
            <div className="space-y-4">
              {stateData.settlementRanges.map((range, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-[#1a4a5a]">{range.injury}</h3>
                    <span className="text-lg font-bold text-[#c4714a]">{range.range}</span>
                  </div>
                  <p className="text-sm text-[#666]">
                    <strong>Key Factors:</strong> {range.factors.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Negligence Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Negligence Laws in {stateData.state}</h2>
            <div className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <h3 className="font-semibold text-[#1a4a5a] mb-3">{stateData.negligenceType}</h3>
              <p className="text-[#333]">{stateData.negligenceDescription}</p>
            </div>
          </section>

          {/* Top Cities Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Top Cities in {stateData.state}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stateData.topCities.map((city, idx) => (
                <a
                  key={idx}
                  href={`/guides/cities/${city.toLowerCase().replace(/\s+/g, '-')}-${stateData.abbreviation.toLowerCase()}`}
                  className="bg-white rounded-lg p-4 border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1a4a5a]">{city}, {stateData.abbreviation}</span>
                    <ChevronRight size={16} className="text-[#4a8c7e]" />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Resources Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Resources & References</h2>
            <div className="space-y-3">
              {stateData.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white rounded-lg p-4 border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-[#1a4a5a]">{resource.title}</div>
                  </div>
                  <ChevronRight size={16} className="text-[#4a8c7e]" />
                </a>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-[#1a4a5a] text-white rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-3">Need Legal Help in {stateData.state}?</h2>
            <p className="mb-6 text-[#e8e2d8]">
              Get a free consultation with a personal injury attorney who knows {stateData.state} law.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+18002273669"
                className="px-6 py-3 bg-[#c4714a] text-white font-semibold rounded-lg hover:bg-[#b35f3a] transition-colors text-center"
              >
                Call Now: 1-800-227-3669
              </a>
              <a
                href="/"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#1a4a5a] transition-colors text-center"
              >
                Free Case Review
              </a>
            </div>
          </section>

          {/* Navigation Between States */}
          <div className="flex items-center justify-between">
            {previousState ? (
              <a
                href={`/guides/states/${previousState.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
              >
                <ChevronLeft size={16} />
                <span className="text-sm font-semibold text-[#1a4a5a]">{previousState.state}</span>
              </a>
            ) : (
              <div />
            )}
            {nextState ? (
              <a
                href={`/guides/states/${nextState.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
              >
                <span className="text-sm font-semibold text-[#1a4a5a]">{nextState.state}</span>
                <ChevronRight size={16} />
              </a>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a4a5a] text-white py-12 px-7">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3">CasePort</h3>
              <p className="text-sm text-[#e8e2d8]">
                Attorney-reviewed personal injury guides. Updated quarterly. No jargon. No sales pitch.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/guides" className="text-[#e8e2d8] hover:text-white">Guides</a></li>
                <li><a href="/" className="text-[#e8e2d8] hover:text-white">Home</a></li>
                <li><a href="tel:+18002273669" className="text-[#e8e2d8] hover:text-white">Call Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <p className="text-sm text-[#e8e2d8]">
                <a href="tel:+18002273669" className="hover:text-white">1-800-227-3669</a>
              </p>
              <p className="text-sm text-[#e8e2d8] mt-2">
                <a href="/" className="hover:text-white">Free Case Review</a>
              </p>
            </div>
          </div>
          <div className="border-t border-[#2e4350] pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#e8e2d8]">
            <p>&copy; 2026 CasePort.io. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="/" className="hover:text-white">Privacy Policy</a>
              <a href="/" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StatePage;
