import { useRoute } from "wouter";
import { ChevronLeft, ChevronRight, MapPin, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { getCityPageBySlug, getAllCityPages } from "@/lib/pageData";
import NotFound from "./NotFound";

/**
 * CITY PAGE COMPONENT
 * 
 * Dynamically renders city-specific personal injury law pages.
 * Each page includes:
 * - City-specific statute of limitations
 * - Average settlements
 * - Common injuries
 * - Top law firms
 * - Local resources
 * - Full JSON-LD schema markup for AEO/SEO/GEO
 */

const CityPage = () => {
  const [match, params] = useRoute("/guides/cities/:slug");

  if (!match) return null;

  const slug = params?.slug as string;
  const cityData = getCityPageBySlug(slug);

  if (!cityData) {
    return <NotFound />;
  }

  const allCities = getAllCityPages();
  const currentIndex = allCities.findIndex(c => c.slug === slug);
  const previousCity = currentIndex > 0 ? allCities[currentIndex - 1] : null;
  const nextCity = currentIndex < allCities.length - 1 ? allCities[currentIndex + 1] : null;

  // Generate JSON-LD schema for this city page with LocalBusiness
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Personal Injury Lawyer in ${cityData.city}, ${cityData.state}`,
    description: `${cityData.description} Get a free consultation with a personal injury attorney in ${cityData.city}, ${cityData.state}.`,
    areaServed: {
      "@type": "City",
      name: cityData.city,
      containedInPlace: {
        "@type": "State",
        name: cityData.state
      }
    },
    url: `https://www.caseport.io/guides/cities/${slug}`,
    telephone: "+1-800-227-3669",
    priceRange: "Free Consultation",
    image: "https://www.caseport.io/og-image.png",
    keywords: `${cityData.city} personal injury lawyer, ${cityData.city} ${cityData.state} accident attorney`,
    datePublished: "2026-04-24",
    dateModified: "2026-04-24"
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
            <a href="/guides/cities" className="hover:text-[#1a4a5a]">Cities</a>
            <ChevronRight size={16} />
            <span className="text-[#1a4a5a] font-semibold">{cityData.city}, {cityData.stateAbbreviation}</span>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={24} className="text-[#c4714a]" />
              <h1 className="text-4xl font-bold text-[#1a4a5a]">
                Personal Injury Lawyer in {cityData.city}, {cityData.state}
              </h1>
            </div>
            <p className="text-lg text-[#4a8c7e] mb-6">
              {cityData.description}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Population</div>
                <div className="text-3xl font-bold text-[#1a4a5a]">{cityData.population}</div>
              </div>
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Statute of Limitations</div>
                <div className="text-lg font-bold text-[#1a4a5a]">{cityData.localStatute}</div>
              </div>
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Average Settlement</div>
                <div className="text-lg font-bold text-[#1a4a5a]">{cityData.averageSettlement}</div>
              </div>
            </div>
          </div>

          {/* Common Injuries Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Common Injuries in {cityData.city}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cityData.commonInjuries.map((injury, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-[#e8e2d8] flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#4a8c7e] mt-0.5 flex-shrink-0" />
                  <span className="text-[#333]">{injury}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Local Law Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Personal Injury Law in {cityData.city}</h2>
            <div className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <div className="mb-6">
                <h3 className="font-semibold text-[#1a4a5a] mb-2">Statute of Limitations</h3>
                <p className="text-[#333]">{cityData.localStatute}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a4a5a] mb-2">Average Settlement</h3>
                <p className="text-[#333]">{cityData.averageSettlement}</p>
              </div>
            </div>
          </section>

          {/* Legal Market Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Legal Market in {cityData.city}</h2>
            <div className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#333]">Top Personal Injury Law Firms</span>
                <span className="text-2xl font-bold text-[#c4714a]">{cityData.topLawFirms}+</span>
              </div>
              <p className="text-sm text-[#666]">
                {cityData.city} has a competitive personal injury market with many experienced attorneys. When choosing a lawyer, look for:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-3 text-sm text-[#333]">
                  <CheckCircle size={16} className="text-[#4a8c7e] mt-0.5 flex-shrink-0" />
                  <span>Years of experience in personal injury law</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#333]">
                  <CheckCircle size={16} className="text-[#4a8c7e] mt-0.5 flex-shrink-0" />
                  <span>Track record of successful settlements</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#333]">
                  <CheckCircle size={16} className="text-[#4a8c7e] mt-0.5 flex-shrink-0" />
                  <span>Contingency fee arrangement (no upfront cost)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#333]">
                  <CheckCircle size={16} className="text-[#4a8c7e] mt-0.5 flex-shrink-0" />
                  <span>Free initial consultation</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Resources Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Local Resources</h2>
            <div className="space-y-3">
              {cityData.resources.map((resource, idx) => (
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
            <h2 className="text-2xl font-bold mb-3">Get a Free Consultation in {cityData.city}</h2>
            <p className="mb-6 text-[#e8e2d8]">
              Speak with an experienced personal injury attorney about your case. No upfront cost.
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

          {/* Navigation Between Cities */}
          <div className="flex items-center justify-between">
            {previousCity ? (
              <a
                href={`/guides/cities/${previousCity.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
              >
                <ChevronLeft size={16} />
                <span className="text-sm font-semibold text-[#1a4a5a]">{previousCity.city}</span>
              </a>
            ) : (
              <div />
            )}
            {nextCity ? (
              <a
                href={`/guides/cities/${nextCity.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
              >
                <span className="text-sm font-semibold text-[#1a4a5a]">{nextCity.city}</span>
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

export default CityPage;
