'use client'

import { ChevronRight, MapPin, CheckCircle } from 'lucide-react';

const dummyStateData = {
  slug: 'california',
  state: 'California',
  abbreviation: 'CA',
  statuteOfLimitations: {
    years: '2',
    description: 'In California, the statute of limitations for personal injury is 2 years from the date of injury. For claims against government entities, you have only 6 months to file.',
    exceptions: ['6 months for claims against government entities', 'Tolling for minors (time paused until age 18)', 'Discovery rule for latent injuries']
  },
  negligenceType: 'Pure Comparative Fault',
  negligenceDescription: 'California follows pure comparative fault. You can recover damages even if you are 99% at fault, but your recovery is reduced by your percentage of fault.',
  averageSettlement: '$127,500',
  settlementRanges: [
    { injury: 'Minor (whiplash, sprains)', range: '$15K - $50K', factors: ['Soft tissue damage', 'Minimal medical treatment', 'Quick recovery'] },
    { injury: 'Moderate (fractures, significant pain)', range: '$50K - $150K', factors: ['Required medical treatment', 'Some lost wages', 'Partial recovery'] },
    { injury: 'Severe (permanent disability)', range: '$150K - $500K', factors: ['Surgery required', 'Long-term care', 'Lost earning capacity'] },
    { injury: 'Catastrophic (life-threatening)', range: '$500K - $2M+', factors: ['Traumatic brain injury', 'Spinal cord damage', 'Permanent disability'] }
  ],
  topCities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Oakland'],
  resources: [
    { title: 'California Courts Self-Help', url: 'https://www.courts.ca.gov' },
    { title: 'State Bar of California', url: 'https://www.calbar.ca.gov' },
    { title: 'California Department of Insurance', url: 'https://www.insurance.ca.gov' }
  ]
};

export default function StateGuideTesting() {
  const data = dummyStateData;

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 px-7 flex items-center justify-between bg-[rgba(249,245,239,.93)] border-b border-[#e8e2d8] shadow-sm">
        <a href="/" className="flex flex-col gap-0.5">
          <div className="font-bold text-xs tracking-widest text-[#1a4a5a]">CASEPORT</div>
          <div className="text-[9px] font-semibold tracking-widest text-[#4a8c7e]">Personal Injury Guides</div>
        </a>
        <div className="flex items-center gap-3">
          <a href="tel:+18002273669" className="hidden sm:flex text-xs font-semibold text-[#2e4350] hover:text-[#1a4a5a]">1-800-227-3669</a>
          <a href="/" className="px-4 py-2 text-xs font-semibold text-white bg-[#c4714a] rounded-full hover:bg-[#b35f3a] transition-colors">Free Case Review</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-7">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#4a8c7e] mb-8">
            <a href="/guide" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <a href="/guide/guide-testing/state" className="hover:text-[#1a4a5a]">States</a>
            <ChevronRight size={16} />
            <span className="text-[#1a4a5a] font-semibold">{data.state}</span>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={24} className="text-[#c4714a]" />
              <h1 className="text-4xl font-bold text-[#1a4a5a]">{data.state}</h1>
            </div>
            <p className="text-lg text-[#4a8c7e] mb-6">Personal Injury Law Guide: Statute of Limitations, Settlement Ranges & Your Rights</p>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Statute of Limitations</div>
                <div className="text-3xl font-bold text-[#1a4a5a]">{data.statuteOfLimitations.years} years</div>
                <p className="text-xs text-[#666] mt-2">{data.statuteOfLimitations.description}</p>
              </div>
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Negligence Type</div>
                <div className="text-lg font-bold text-[#1a4a5a]">{data.negligenceType}</div>
              </div>
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Average Settlement</div>
                <div className="text-lg font-bold text-[#1a4a5a]">{data.averageSettlement}</div>
              </div>
            </div>
          </div>

          {/* Statute of Limitations Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Statute of Limitations in {data.state}</h2>
            <div className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <p className="text-[#333] mb-4">{data.statuteOfLimitations.description}</p>
              <div className="bg-[#f0f8f6] border-l-4 border-[#4a8c7e] p-4 rounded">
                <h3 className="font-semibold text-[#1a4a5a] mb-3">Exceptions & Tolling</h3>
                <ul className="space-y-2">
                  {data.statuteOfLimitations.exceptions.map((exception, idx) => (
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
              {data.settlementRanges.map((range, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-[#1a4a5a]">{range.injury}</h3>
                    <span className="text-lg font-bold text-[#c4714a]">{range.range}</span>
                  </div>
                  <p className="text-sm text-[#666]"><strong>Key Factors:</strong> {range.factors.join(', ')}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Negligence Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Negligence Laws in {data.state}</h2>
            <div className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <h3 className="font-semibold text-[#1a4a5a] mb-3">{data.negligenceType}</h3>
              <p className="text-[#333]">{data.negligenceDescription}</p>
            </div>
          </section>

          {/* Top Cities Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Top Cities in {data.state}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.topCities.map((city, idx) => (
                <a key={idx} href="/guide/guide-testing/city" className="bg-white rounded-lg p-4 border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1a4a5a]">{city}, {data.abbreviation}</span>
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
              {data.resources.map((resource, idx) => (
                <a key={idx} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white rounded-lg p-4 border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors">
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
            <h2 className="text-2xl font-bold mb-3">Need Legal Help in {data.state}?</h2>
            <p className="mb-6 text-[#e8e2d8]">Get a free consultation with a personal injury attorney who knows {data.state} law.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+18002273669" className="px-6 py-3 bg-[#c4714a] text-white font-semibold rounded-lg hover:bg-[#b35f3a] transition-colors text-center">Call Now: 1-800-227-3669</a>
              <a href="/" className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#1a4a5a] transition-colors text-center">Free Case Review</a>
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
              <p className="text-sm text-[#e8e2d8]">Attorney-reviewed personal injury guides. Updated quarterly.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/guide" className="text-[#e8e2d8] hover:text-white">Guides</a></li>
                <li><a href="/" className="text-[#e8e2d8] hover:text-white">Home</a></li>
                <li><a href="tel:+18002273669" className="text-[#e8e2d8] hover:text-white">Call Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Contact</h4>
              <p className="text-sm text-[#e8e2d8]"><a href="tel:+18002273669" className="hover:text-white">1-800-227-3669</a></p>
            </div>
          </div>
          <div className="border-t border-[#2e4350] pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#e8e2d8]">
            <p>&copy; 2026 CasePort.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}