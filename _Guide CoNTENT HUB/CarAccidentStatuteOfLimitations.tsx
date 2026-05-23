import React from 'react';
import guideCategories from '@/data/guideData';

export default function CarAccidentStatuteOfLimitations() {
  const category = guideCategories.find((cat: any) => cat.id === 'car-accident');
  const guide = category?.subGuides.find((g: any) => g.slug === 'statute-of-limitations');

  if (!guide) {
    return <div className="text-center py-20">Guide not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 h-16 bg-[#f9f5ef] border-b border-[#e8e2d8] shadow-md flex items-center px-7">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/guide" className="text-[#1a4a5a] hover:text-[#c4714a] font-semibold">
              CasePort
            </a>
          </div>
          <a
            href="tel:+18002273669"
            className="bg-[#c4714a] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md"
          >
            Free Case Review
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-[#666] mb-8">
          <a href="/guide" className="text-[#c4714a] hover:underline">Guides</a>
          {' > '}
          <a href="/guide/car-accident" className="text-[#c4714a] hover:underline">Car Accident</a>
          {' > '}
          <span>{guide.title}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
          {guide.title}
        </h1>

        {/* Last Updated */}
        <div className="text-sm text-[#999] mb-8">
          Last Updated: April 2026 | Attorney-Reviewed | ABA Compliant
        </div>

        {/* Direct Answer */}
        <div className="bg-[#f9f5ef] border-l-4 border-[#c4714a] p-6 rounded mb-12">
          <h2 className="font-bold mb-3" style={{ color: '#1a4a5a' }}>Direct Answer</h2>
          <p className="text-[#555] leading-relaxed">{guide.directAnswer}</p>
        </div>

        {/* TL;DR */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a4a5a' }}>TL;DR Action Plan</h2>
          <div className="space-y-4">
            {guide.tldrItems.map((item: any) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#c4714a] text-white flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-[#1a4a5a]">{item.action}</p>
                  {item.timeMin > 0 && (
                    <p className="text-sm text-[#999]">
                      {item.timeMin === item.timeMax
                        ? `${item.timeMin} minutes`
                        : `${item.timeMin}-${item.timeMax} minutes`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a4a5a' }}>Key Takeaways</h2>
          <ul className="space-y-3">
            {guide.keyTakeaways.map((takeaway: string, idx: number) => (
              <li key={idx} className="flex gap-3">
                <span className="text-[#4a8c7e] font-bold">✓</span>
                <span className="text-[#555]">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* State Ranges */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a4a5a' }}>Statute of Limitations by State</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f9f5ef]">
                  <th className="border border-[#e8e2d8] p-3 text-left font-semibold" style={{ color: '#1a4a5a' }}>State</th>
                  <th className="border border-[#e8e2d8] p-3 text-left font-semibold" style={{ color: '#1a4a5a' }}>Deadline</th>
                  <th className="border border-[#e8e2d8] p-3 text-left font-semibold" style={{ color: '#1a4a5a' }}>Range</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(guide.stateRanges).map(([state, range]: [string, any]) => (
                  <tr key={state} className="hover:bg-[#f9f5ef]">
                    <td className="border border-[#e8e2d8] p-3">{state}</td>
                    <td className="border border-[#e8e2d8] p-3">2-4 years</td>
                    <td className="border border-[#e8e2d8] p-3">${range.min.toLocaleString()}-${range.max.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a4a5a' }}>Real Settlement Examples</h2>
          <div className="space-y-4">
            {guide.realExamples.map((example: any, idx: number) => (
              <div key={idx} className="p-4 border border-[#e8e2d8] rounded-lg">
                <div className="font-bold text-[#c4714a]">${example.settlement.toLocaleString()}</div>
                <div className="font-semibold text-[#1a4a5a]">{example.injury}</div>
                <div className="text-sm text-[#999]">{example.timeline}</div>
                <div className="text-sm text-[#555] mt-2">{example.details}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a4a5a' }}>Frequently Asked Questions</h2>
          <div className="space-y-4">
            {guide.faqItems.map((item: any, idx: number) => (
              <details key={idx} className="border border-[#e8e2d8] rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold" style={{ color: '#1a4a5a' }}>
                  {item.q}
                </summary>
                <p className="text-[#555] mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Related Guides */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a4a5a' }}>Related Guides</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/guide/car-accident/what-to-do" className="p-4 border border-[#e8e2d8] rounded-lg hover:shadow-lg transition-all">
              <div className="font-semibold text-[#c4714a]">What To Do After a Car Accident</div>
              <div className="text-sm text-[#999] mt-1">Immediate action steps for accident victims</div>
            </a>
            <a href="/guide/car-accident/settlement-amounts" className="p-4 border border-[#e8e2d8] rounded-lg hover:shadow-lg transition-all">
              <div className="font-semibold text-[#c4714a]">Car Accident Settlement Amounts</div>
              <div className="text-sm text-[#999] mt-1">Real settlement data by injury type</div>
            </a>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-[#1a4a5a] text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Don't Navigate This Alone</h3>
          <p className="mb-6">Get a free consultation with an experienced car accident attorney. No upfront cost.</p>
          <a
            href="tel:+18002273669"
            className="inline-block bg-[#c4714a] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#d4855e] transition-all"
          >
            Call Now: 1-800-227-3669
          </a>
        </div>
      </div>
    </div>
  );
}
