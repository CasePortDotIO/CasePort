'use client'

import { ChevronRight, MapPin, CheckCircle } from 'lucide-react';

const dummyCityData = {
  slug: 'los-angeles-ca',
  city: 'Los Angeles',
  state: 'California',
  stateAbbreviation: 'CA',
  description: 'Los Angeles has one of the most active personal injury legal markets in the United States. With heavy traffic and diverse accident types, our attorneys have extensive experience handling LA-area cases.',
  population: '4M+',
  localStatute: '2 years from date of injury',
  averageSettlement: '$135,000',
  commonInjuries: ['Whiplash and neck injuries', 'Traumatic brain injuries', 'Spinal cord damage', 'Fractures and broken bones', 'Internal injuries', 'Soft tissue damage'],
  topLawFirms: '500+',
  resources: [
    { title: 'Los Angeles Superior Court', url: 'https://www.lacourt.org' },
    { title: 'California Courts - LA', url: 'https://www.courts.ca.gov' },
    { title: 'LA County Bar Association', url: 'https://www.lacba.org' }
  ]
};

export default function CityGuideTesting() {
  const data = dummyCityData;

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
            <a href="/guide/guide-testing/city" className="hover:text-[#1a4a5a]">Cities</a>
            <ChevronRight size={16} />
            <span className="text-[#1a4a5a] font-semibold">{data.city}, {data.stateAbbreviation}</span>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={24} className="text-[#c4714a]" />
              <h1 className="text-4xl font-bold text-[#1a4a5a]">Personal Injury Lawyer in {data.city}, {data.state}</h1>
            </div>
            <p className="text-lg text-[#4a8c7e] mb-6">{data.description}</p>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Population</div>
                <div className="text-3xl font-bold text-[#1a4a5a]">{data.population}</div>
              </div>
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Statute of Limitations</div>
                <div className="text-lg font-bold text-[#1a4a5a]">{data.localStatute}</div>
              </div>
              <div>
                <div className="text-sm text-[#4a8c7e] font-semibold mb-2">Average Settlement</div>
                <div className="text-lg font-bold text-[#1a4a5a]">{data.averageSettlement}</div>
              </div>
            </div>
          </div>

          {/* Common Injuries Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Common Injuries in {data.city}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.commonInjuries.map((injury, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-[#e8e2d8] flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#4a8c7e] mt-0.5 flex-shrink-0" />
                  <span className="text-[#333]">{injury}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Local Law Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Personal Injury Law in {data.city}</h2>
            <div className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <div className="mb-6">
                <h3 className="font-semibold text-[#1a4a5a] mb-2">Statute of Limitations</h3>
                <p className="text-[#333]">{data.localStatute}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a4a5a] mb-2">Average Settlement</h3>
                <p className="text-[#333]">{data.averageSettlement}</p>
              </div>
            </div>
          </section>

          {/* Legal Market Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Legal Market in {data.city}</h2>
            <div className="bg-white rounded-lg p-6 border border-[#e8e2d8]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#333]">Top Personal Injury Law Firms</span>
                <span className="text-2xl font-bold text-[#c4714a]">{data.topLawFirms}+</span>
              </div>
              <p className="text-sm text-[#666]">{data.city} has a competitive personal injury market with many experienced attorneys.</p>
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
              </ul>
            </div>
          </section>

          {/* Resources Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Local Resources</h2>
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
            <h2 className="text-2xl font-bold mb-3">Get a Free Consultation in {data.city}</h2>
            <p className="mb-6 text-[#e8e2d8]">Speak with an experienced personal injury attorney about your case. No upfront cost.</p>
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
              <p className="text-sm text-[#e8e2d8]">Attorney-reviewed personal injury guides.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/guide" className="text-[#e8e2d8] hover:text-white">Guides</a></li>
                <li><a href="/" className="text-[#e8e2d8] hover:text-white">Home</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Contact</h4>
              <p className="text-sm text-[#e8e2d8]"><a href="tel:+18002273669" className="hover:text-white">1-800-227-3669</a></p>
            </div>
          </div>
          <div className="border-t border-[#2e4350] pt-6 text-center text-sm text-[#e8e2d8]">
            <p>&copy; 2026 CasePort.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}