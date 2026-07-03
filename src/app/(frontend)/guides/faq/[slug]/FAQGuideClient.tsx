'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HelpCircle, ChevronRight, ChevronLeft, Volume2 } from 'lucide-react'
interface FAQGuideClientProps {
  article: any
  headerNav?: any
  footerNav?: any
}

export default function FAQGuideClient({ article }: FAQGuideClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: {
      '@type': 'Question',
      name: article.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: article.content || article.excerpt || '',
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['#answer-text']
        }
      }
    },
    datePublished: article.publishedDate || article.createdAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'CasePort.io',
      url: 'https://www.caseport.io'
    }
  }

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
            <Link href="/guides" className="block py-2 text-[#1a4a5a] font-medium">All Guides</Link>
            <Link href="/guides/states" className="block py-2 text-[#1a4a5a] font-medium">State Guides</Link>
            <Link href="/guides/cities" className="block py-2 text-[#1a4a5a] font-medium">City Guides</Link>
            <Link href="/guides/faq" className="block py-2 text-[#1a4a5a] font-medium">FAQ</Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-7">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#4a8c7e] mb-8">
            <Link href="/guides" className="hover:text-[#1a4a5a]">Guides</Link>
            <ChevronRight size={16} />
            <Link href="/guides/faq" className="hover:text-[#1a4a5a]">FAQ</Link>
            <ChevronRight size={16} />
            <span className="text-[#1a4a5a] font-semibold">Question</span>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <HelpCircle size={32} className="text-[#c4714a] flex-shrink-0 mt-1" />
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a4a5a] leading-tight">
                {article.title}
              </h1>
            </div>

            {/* Category Badge */}
            {article.guideCategory && (
              <div className="inline-block px-3 py-1 bg-[#f0f8f6] border border-[#4a8c7e] rounded-full text-sm font-semibold text-[#4a8c7e] mb-6">
                {typeof article.guideCategory === 'object' ? article.guideCategory.title : 'FAQ'}
              </div>
            )}
          </div>

          {/* Quick Answer */}
          {article.directAnswer && (
            <section className="mb-12 bg-white rounded-lg p-6 border-l-4 border-[#c4714a]">
              <h2 className="text-lg font-bold text-[#1a4a5a] mb-3">Quick Answer</h2>
              <p className="text-[#333] text-lg leading-relaxed">{article.directAnswer}</p>
            </section>
          )}

          {/* Full Answer */}
          {article.content && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Full Answer</h2>
              <div id="answer-text" className="prose prose-lg max-w-none">
                <div className="bg-white rounded-lg p-8 border border-[#e8e2d8] text-[#333] leading-relaxed">
                  {typeof article.content === 'string' ? article.content : JSON.stringify(article.content)}
                </div>
              </div>
            </section>
          )}

          {/* Key Points */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Key Points to Remember</h2>
              <div className="space-y-3">
                {article.keyTakeaways.map((point: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 bg-white rounded-lg p-4 border border-[#e8e2d8]">
                    <div className="text-[#c4714a] font-bold text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#f9f5ef] rounded">
                      {idx + 1}
                    </div>
                    <p className="text-[#333]">{point}</p>
                  </div>
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
              This answer is optimized for voice search. Try asking your voice assistant: &ldquo;{article.title}&rdquo;
            </p>
          </section>

          {/* CTA Section */}
          <section className="bg-[#1a4a5a] text-white rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
            <p className="mb-6 text-[#e8e2d8]">
              Get personalized advice from a personal injury attorney. Free consultation, no upfront cost.
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
                <li><Link href="/guides" className="text-[#e8e2d8] hover:text-white">Guides</Link></li>
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