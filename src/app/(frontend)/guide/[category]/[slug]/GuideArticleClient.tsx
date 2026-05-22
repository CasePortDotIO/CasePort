'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, CheckCircle2, ChevronRight } from 'lucide-react'
interface GuideArticleClientProps {
  article: any
  category: any
  headerNav?: any
  footerNav?: any
  isPreview?: boolean
}

export default function GuideArticleClient({ article, category, isPreview = false }: GuideArticleClientProps) {
  const [selectedState, setSelectedState] = useState('CA')
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const tldrItems = article.tldrItems || article.actionPlan || []
  const keyTakeaways = article.keyTakeaways || []
  const faqItems = article.faqSection || article.faqItems || []
  const realExamples = article.realExamples || article.testimonials || []
  const stateRanges = article.stateRanges || article.settlementData?.rangesByInjury || {}
  const relatedGuides = article.relatedGuides || []

  const currentStateRange = stateRanges[selectedState]

  const categorySlug = typeof category === 'object' ? category.slug : article.guideCategory?.slug
  const categoryTitle = typeof category === 'object' ? category.title : article.guideCategory?.title || 'Guide'

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* Sticky Header */}
      {showStickyHeader && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#f9f5ef] border-b border-[#e8e2d8] shadow-md z-40 flex items-center justify-between px-7">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#c4714a] rounded-lg flex items-center justify-center text-white font-bold text-sm">CP</div>
            <span className="text-sm font-semibold text-[#1a4a5a] truncate">{article.title}</span>
          </div>
          <a href="tel:+18002273669" className="bg-[#c4714a] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md whitespace-nowrap">
            Free Case Review
          </a>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#4a8c7e] mb-6">
          <Link href="/guide" className="hover:text-[#1a4a5a]">Guides</Link>
          <ChevronRight size={16} />
          <Link href={`/guide/${categorySlug}`} className="hover:text-[#1a4a5a]">{categoryTitle}</Link>
          <ChevronRight size={16} />
          <span className="text-[#1a4a5a] font-semibold truncate">{article.title}</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a4a5a] mb-4">{article.title}</h1>
          <p className="text-lg text-[#555] mb-6">
            {article.excerpt || article.metaDescription || `This guide covers everything you need to know about ${article.title.toLowerCase()}.`}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            {article.author?.name && (
              <div className="flex items-center gap-2 text-[#1a4a5a]">
                <span className="font-semibold">Author:</span> {article.author.name}
              </div>
            )}
            {article.updatedAt && (
              <div className="flex items-center gap-2 text-[#1a4a5a]">
                <span className="font-semibold">Updated:</span> {new Date(article.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            )}
            {article.readTime && (
              <div className="flex items-center gap-2 text-[#1a4a5a]">
                <span className="font-semibold">Read Time:</span> {article.readTime} minutes
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">✓ Attorney-Reviewed</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">✓ ABA Compliant</span>
            {article.lastFactVerified && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">✓ Fact-Checked: {new Date(article.lastFactVerified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            )}
          </div>
        </div>

        {/* Direct Answer Section */}
        {article.directAnswer && (
          <div className="bg-white border-l-4 border-[#c4714a] p-6 rounded-lg mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-4">Direct Answer</h2>
            <p className="text-lg text-[#555] leading-relaxed">{article.directAnswer}</p>
          </div>
        )}

        {/* TL;DR Section */}
        {tldrItems.length > 0 && (
          <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">TL;DR - Action Plan</h2>
            <div className="space-y-4">
              {tldrItems.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-[#e8e2d8] last:border-b-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#c4714a] text-white rounded-full flex items-center justify-center font-bold">
                    {item.step || item.number || idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a4a5a]">{item.action || item.title || item.text}</p>
                    {(item.timeMin || item.timeMax) && (
                      <p className="text-sm text-[#999]">
                        {item.timeMin || 0}-{item.timeMax || 60} {item.timeMax <= 60 ? 'min' : 'hrs'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Takeaways */}
        {keyTakeaways.length > 0 && (
          <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Key Takeaways</h2>
            <div className="space-y-3">
              {keyTakeaways.map((takeaway: string, idx: number) => (
                <div key={idx} className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#c4714a] flex-shrink-0 mt-0.5" />
                  <p className="text-[#555]">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settlement Ranges */}
        {Object.keys(stateRanges).length > 0 && (
          <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Settlement Ranges: State-by-State</h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1a4a5a] mb-2">Select Your State:</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-[#e8e2d8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c4714a]"
              >
                {Object.keys(stateRanges).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {currentStateRange && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-[#f9f5ef] p-4 rounded-lg">
                  <p className="text-sm text-[#999] mb-1">Minimum</p>
                  <p className="text-2xl font-bold text-[#c4714a]">
                    ${((currentStateRange.min || currentStateRange.minimum || 0) / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="bg-[#f9f5ef] p-4 rounded-lg">
                  <p className="text-sm text-[#999] mb-1">Average</p>
                  <p className="text-2xl font-bold text-[#c4714a]">
                    ${((currentStateRange.avg || currentStateRange.average || 0) / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="bg-[#f9f5ef] p-4 rounded-lg">
                  <p className="text-sm text-[#999] mb-1">Maximum</p>
                  <p className="text-2xl font-bold text-[#c4714a]">
                    ${((currentStateRange.max || currentStateRange.maximum || 0) / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            )}

            <div className="bg-[#f9f5ef] p-4 rounded-lg border border-[#e8e2d8]">
              <p className="text-[#555]">
                <strong>Statute of Limitations:</strong> {article.statuteOfLimitations?.years || 'Varies'} years from date of injury
              </p>
              <p className="text-[#555] mt-2">
                <strong>Key Insight:</strong> Settlements with attorney are typically 5x higher than without.
              </p>
            </div>
          </div>
        )}

        {/* Real Examples / Testimonials */}
        {realExamples.length > 0 && (
          <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Real Settlement Examples</h2>
            <div className="space-y-4">
              {realExamples.map((example: any, idx: number) => (
                <div key={idx} className="border border-[#e8e2d8] rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-2xl font-bold text-[#c4714a]">
                        ${((example.settlement || example.amount || 0) / 1000).toFixed(0)}K
                      </p>
                      <p className="text-sm text-[#999]">Settlement Amount</p>
                    </div>
                    {example.timeline && (
                      <div className="text-right">
                        <p className="font-semibold text-[#1a4a5a]">{example.timeline}</p>
                        <p className="text-sm text-[#999]">Time to Settle</p>
                      </div>
                    )}
                  </div>
                  {example.injury && (
                    <p className="text-[#555] mb-2"><strong>Injury:</strong> {example.injury}</p>
                  )}
                  {example.details && (
                    <p className="text-[#555]"><strong>Details:</strong> {example.details}</p>
                  )}
                  {example.quote && (
                    <p className="text-[#555] italic mt-3 border-l-2 border-[#c4714a] pl-4">{example.quote}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Body */}
        {article.content && (
          <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Full Guide</h2>
            <div className="prose prose-lg max-w-none text-[#333]">
              {typeof article.content === 'string' ? (
                <div className="whitespace-pre-wrap">{article.content}</div>
              ) : (
                <div>{JSON.stringify(article.content)}</div>
              )}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {faqItems.length > 0 && (
          <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqItems.map((item: any, idx: number) => (
                <details key={idx} className="border border-[#e8e2d8] rounded-lg p-4 cursor-pointer group">
                  <summary className="font-semibold text-[#1a4a5a] flex justify-between items-center">
                    {item.q || item.question || item.title}
                    <ChevronDown className="w-5 h-5 group-open:hidden" />
                    <ChevronUp className="w-5 h-5 hidden group-open:block" />
                  </summary>
                  <p className="text-[#555] mt-3">{item.a || item.answer || item.text}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedGuides.map((guide: any, idx: number) => (
                <Link
                  key={idx}
                  href={`/guide/${guide.guideCategory?.slug || categorySlug}/${guide.slug}`}
                  className="border border-[#e8e2d8] rounded-lg p-4 hover:border-[#4a8c7e] transition-colors"
                >
                  <div className="font-semibold text-[#1a4a5a] mb-1">{guide.title}</div>
                  {guide.excerpt && (
                    <p className="text-sm text-[#666] line-clamp-2">{guide.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <section className="bg-[#1a4a5a] text-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-3">Need Legal Help?</h2>
          <p className="mb-6 text-[#e8e2d8]">
            Get a free consultation with a personal injury attorney. No upfront cost.
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

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t-2 border-[#c4714a] shadow-2xl px-4 py-4 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#999] font-semibold tracking-wide mb-1">READY TO GET HELP?</p>
          <p className="text-sm font-bold text-[#1a4a5a]">Free Consultation Available</p>
        </div>
        <a
          href="tel:+18002273669"
          className="flex-shrink-0 bg-[#c4714a] hover:bg-[#d4855e] text-white px-4 py-3 rounded-lg font-bold text-sm"
        >
          Call Now
        </a>
      </div>
    </div>
  )
}