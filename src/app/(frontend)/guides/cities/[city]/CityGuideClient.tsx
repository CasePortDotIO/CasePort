'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, MapPin, CheckCircle } from 'lucide-react'
interface CityGuideClientProps {
  article: any
  cityName: string
  headerNav?: any
  footerNav?: any
}

export default function CityGuideClient({ article, cityName }: CityGuideClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Personal Injury Lawyer in ${cityName}, ${article.targetStates?.[0] || 'State'}`,
    description: `${article.excerpt || ''} Get a free consultation with a personal injury attorney in ${cityName}.`,
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: {
        '@type': 'State',
        name: article.targetStates?.[0] || ''
      }
    },
    url: `https://www.caseport.io/guide/cities/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    telephone: '+1-800-227-3669',
    priceRange: 'Free Consultation',
    image: article.heroImage?.url || 'https://www.caseport.io/og-image.png',
    datePublished: article.publishedDate || article.createdAt,
    dateModified: article.updatedAt
  }

  const topCities = article.topCities || []
  const commonInjuries = article.commonInjuries || []
  const resources = article.resources || []
  const settlementRanges = article.settlementRanges || []

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 px-7 flex items-center justify-between bg-[rgba(249,245,239,.93)] border-b border-[#e8e2d8] shadow-sm">
        <Link href="/" className="flex flex-col gap-0.5">
          <div className="font-bold text-xs tracking-widest text-[#1a4a5a]">CASEPORT</div>
          <div className="text-[9px] font-semibold tracking-widest text-[#4a8c7e]">Personal Injury Guides</div>
        </Link>
        <div className="flex items-center gap-3">
          <a href="tel:+18002273669" className="hidden sm:flex text-xs font-semibold text-[#2e4350] hover:text-[#1a4a5a]">
            1-800-227-3669
          </a>
          <Link href="/" className="px-4 py-2 text-xs font-semibold text-white bg-[#c4714a] rounded-full hover:bg-[#b35f3a] transition-colors">
            Free Case Review
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#1a4a5a]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-14 md:hidden">
          <div className="p-4 space-y-4">
            <Link href="/guide" className="block py-2 text-[#1a4a5a] font-medium">All Guides</Link>
            <Link href="/guide/states" className="block py-2 text-[#1a4a5a] font-medium">State Guides</Link>
            <Link href="/guide/cities" className="block py-2 text-[#1a4a5a] font-medium">City Guides</Link>
            <Link href="/guide/faq" className="block py-2 text-[#1a4a5a] font-medium">FAQ</Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-7">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#4a8c7e] mb-8">
            <Link href="/guide" className="hover:text-[#1a4a5a]">Guides</Link>
            <ChevronRight size={16} />
            <Link href="/guide/cities" className="hover:text-[#1a4a5a]">Cities</Link>
            <ChevronRight size={16} />
            <span className="text-[#1a4a5a] font-semibold">{cityName}</span>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={24} className="text-[#c4714a]" />
              <h1 className="text-4xl font-bold text-[#1a4a5a]">
                Personal Injury Lawyer in {cityName}
              </h1>
            </div>
            <p className="text-lg text-[#4a8c7e] mb-6">
              {article.excerpt || article.metaDescription || `Personal Injury Law Guide for ${cityName}`}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Population</div>
                <div className="text-3xl font-bold text-[#1a4a5a]">{article.population || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Statute of Limitations</div>
                <div className="text-lg font-bold text-[#1a4a5a]">{article.statuteOfLimitations?.years || 'Varies'} years</div>
              </div>
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Average Settlement</div>
                <div className="text-lg font-bold text-[#1a4a5a]">{article.settlementData?.avg || article.averageSettlement || 'Varies'}</div>
              </div>
            </div>
          </div>

          {/* Direct Answer / Overview */}
          {article.directAnswer && (
            <section className="mb-12 bg-white rounded-lg p-6 border-l-4 border-[#c4714a]">
              <h2 className="text-xl font-bold text-[#1a4a5a] mb-3">Overview</h2>
              <p className="text-[#333] leading-relaxed">{article.directAnswer}</p>
            </section>
          )}

          {/* Common Injuries Section */}
          {commonInjuries.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Common Injuries in {cityName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonInjuries.map((injury: string, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-[#e8e2d8] flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#4a8c7e] mt-0.5 flex-shrink-0" />
                    <span className="text-[#333]">{injury}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Settlement Ranges */}
          {settlementRanges.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Settlement Ranges by Injury Type</h2>
              <div className="space-y-4">
                {settlementRanges.map((range: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-[#1a4a5a]">{range.injury || range.type}</h3>
                      <span className="text-lg font-bold text-[#c4714a]">{range.range || `$${range.min}K - $${range.max}K`}</span>
                    </div>
                    {range.factors && (
                      <p className="text-sm text-[#666]">
                        <strong>Key Factors:</strong> {Array.isArray(range.factors) ? range.factors.join(', ') : range.factors}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Top Cities Section */}
          {topCities.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Top Cities in {article.targetStates?.[0]}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topCities.map((city: string, idx: number) => (
                  <Link
                    key={idx}
                    href={`/guide/cities/${city.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-white rounded-lg p-4 border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1a4a5a]">{city}</span>
                      <ChevronRight size={16} className="text-[#4a8c7e]" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Resources Section */}
          {resources.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Local Resources</h2>
              <div className="space-y-3">
                {resources.map((resource: any, idx: number) => (
                  <a
                    key={idx}
                    href={resource.url || resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white rounded-lg p-4 border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-[#1a4a5a]">{resource.title || resource.name}</div>
                    </div>
                    <ChevronRight size={16} className="text-[#4a8c7e]" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="bg-[#1a4a5a] text-white rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-3">Get a Free Consultation in {cityName}</h2>
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
                <li><Link href="/guide" className="text-[#e8e2d8] hover:text-white">Guides</Link></li>
                <li><Link href="/" className="text-[#e8e2d8] hover:text-white">Home</Link></li>
                <li><a href="tel:+18002273669" className="text-[#e8e2d8] hover:text-white">Call Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <p className="text-sm text-[#e8e2d8]">
                <a href="tel:+18002273669" className="hover:text-white">1-800-227-3669</a>
              </p>
              <p className="text-sm text-[#e8e2d8] mt-2">
                <Link href="/" className="hover:text-white">Free Case Review</Link>
              </p>
            </div>
          </div>
          <div className="border-t border-[#2e4350] pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#e8e2d8]">
            <p>&copy; 2026 CasePort.io. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link href="/" className="hover:text-white">Privacy Policy</Link>
              <Link href="/" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}