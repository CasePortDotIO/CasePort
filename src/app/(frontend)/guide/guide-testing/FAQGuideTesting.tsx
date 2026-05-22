'use client'

import { ChevronRight, HelpCircle, Volume2 } from 'lucide-react';

const dummyFAQData = {
  slug: 'statute-of-limitations',
  question: 'What is the statute of limitations for personal injury cases?',
  category: 'personal-injury',
  shortAnswer: 'The statute of limitations for personal injury is typically 2-3 years from the date of injury, though this varies significantly by state and injury type.',
  longAnswer: `The statute of limitations is the legal deadline by which you must file a personal injury lawsuit. In most states, this deadline is 2-3 years from the date of injury.

However, there are important exceptions:
- Some states allow 4-6 years for certain injury types
- Claims against government entities often have shorter deadlines (6 months to 1 year)
- The discovery rule may extend the deadline if you didn't immediately know you were injured
- Minors may have their deadline tolled (paused) until they turn 18

Missing this deadline means you permanently lose your right to sue, regardless of how strong your case is. The insurance company will use this against you if you wait too long.

Why such a short timeframe? The legal system wants evidence to be fresh and witnesses' memories to be reliable. Over time, evidence degrades, witnesses move away, and records become harder to obtain.

This is why you should contact an attorney as soon as possible after an accident. We work on contingency, so you pay nothing upfront, and the consultation is free.`,
  keyPoints: [
    'The statute of limitations is typically 2-3 years from the date of injury',
    'Some states allow 4-6 years for certain injury types',
    'Claims against government entities often have shorter deadlines',
    'The discovery rule may extend the deadline for latent injuries',
    'Missing the deadline means you permanently lose your right to sue',
    'Contact an attorney immediately to protect your rights'
  ],
  relatedQuestions: ['how-do-i-file-a-personal-injury-claim', 'what damages-can-i-recover', 'do-i-need-an-attorney']
};

export default function FAQGuideTesting() {
  const data = dummyFAQData;

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
        <div className="max-w-3xl mx-auto px-7">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#4a8c7e] mb-8">
            <a href="/guide" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <a href="/guide/guide-testing/faq" className="hover:text-[#1a4a5a]">FAQ</a>
            <ChevronRight size={16} />
            <span className="text-[#1a4a5a] font-semibold">Question</span>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <HelpCircle size={32} className="text-[#c4714a] flex-shrink-0 mt-1" />
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a4a5a] leading-tight">{data.question}</h1>
            </div>

            {/* Category Badge */}
            <div className="inline-block px-3 py-1 bg-[#f0f8f6] border border-[#4a8c7e] rounded-full text-sm font-semibold text-[#4a8c7e] mb-6">
              {data.category.replace(/-/g, ' ')}
            </div>
          </div>

          {/* Quick Answer */}
          <section className="mb-12 bg-white rounded-lg p-6 border-l-4 border-[#c4714a]">
            <h2 className="text-lg font-bold text-[#1a4a5a] mb-3">Quick Answer</h2>
            <p className="text-[#333] text-lg leading-relaxed">{data.shortAnswer}</p>
          </section>

          {/* Full Answer */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Full Answer</h2>
            <div className="bg-white rounded-lg p-8 border border-[#e8e2d8] text-[#333] leading-relaxed whitespace-pre-wrap">
              {data.longAnswer}
            </div>
          </section>

          {/* Key Points */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Key Points to Remember</h2>
            <div className="space-y-3">
              {data.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-white rounded-lg p-4 border border-[#e8e2d8]">
                  <div className="text-[#c4714a] font-bold text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#f9f5ef] rounded">
                    {idx + 1}
                  </div>
                  <p className="text-[#333]">{point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Questions */}
          {data.relatedQuestions.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Related Questions</h2>
              <div className="space-y-3">
                {data.relatedQuestions.map((questionSlug, idx) => (
                  <a key={idx} href="/guide/guide-testing/faq" className="flex items-start gap-4 bg-white rounded-lg p-4 border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors">
                    <HelpCircle size={20} className="text-[#4a8c7e] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#1a4a5a]">{questionSlug.replace(/-/g, ' ')}</p>
                      <p className="text-sm text-[#666] mt-1">Click to read the full answer</p>
                    </div>
                    <ChevronRight size={16} className="text-[#4a8c7e] flex-shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Voice Search Optimization */}
          <section className="mb-12 bg-[#f0f8f6] rounded-lg p-6 border border-[#4a8c7e]">
            <div className="flex items-start gap-3 mb-3">
              <Volume2 size={20} className="text-[#4a8c7e] mt-0.5" />
              <h3 className="font-bold text-[#1a4a5a]">Ask Alexa, Siri, or Google Assistant</h3>
            </div>
            <p className="text-sm text-[#333]">
              This answer is optimized for voice search. Try asking your voice assistant: &quot;{data.question}&quot;
            </p>
          </section>

          {/* CTA Section */}
          <section className="bg-[#1a4a5a] text-white rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
            <p className="mb-6 text-[#e8e2d8]">Get personalized advice from a personal injury attorney. Free consultation, no upfront cost.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+18002273669" className="px-6 py-3 bg-[#c4714a] text-white font-semibold rounded-lg hover:bg-[#b35f3a] transition-colors text-center">Call Now: 1-800-227-3669</a>
              <a href="/" className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#1a4a5a] transition-colors text-center">Free Case Review</a>
            </div>
          </section>

          {/* Navigation Between FAQs */}
          <div className="flex items-center justify-between">
            <a href="/guide/faq" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors">
              <ChevronRight size={16} className="rotate-180" />
              <span className="text-sm font-semibold text-[#1a4a5a]">Previous</span>
            </a>
            <a href="/guide/guide-testing/faq" className="px-4 py-2 bg-white rounded-lg border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors text-sm font-semibold text-[#1a4a5a]">All FAQs</a>
            <a href="/guide/guide-testing/faq" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors">
              <span className="text-sm font-semibold text-[#1a4a5a]">Next</span>
              <ChevronRight size={16} />
            </a>
          </div>
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