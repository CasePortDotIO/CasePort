import { useRoute } from "wouter";
import { ChevronLeft, ChevronRight, HelpCircle, Volume2 } from "lucide-react";
import { getFAQPageBySlug, getAllFAQPages } from "@/lib/pageData";
import NotFound from "./NotFound";

/**
 * FAQ PAGE COMPONENT
 * 
 * Dynamically renders FAQ pages optimized for:
 * - Voice search (Speakable schema)
 * - AI extraction (FAQPage schema)
 * - Featured snippets (answer formatting)
 * - Conversational keywords
 */

const FAQPage = () => {
  const [match, params] = useRoute("/guides/faq/:slug");

  if (!match) return null;

  const slug = params?.slug as string;
  const faqData = getFAQPageBySlug(slug);

  if (!faqData) {
    return <NotFound />;
  }

  const allFAQs = getAllFAQPages();
  const currentIndex = allFAQs.findIndex(f => f.slug === slug);
  const previousFAQ = currentIndex > 0 ? allFAQs[currentIndex - 1] : null;
  const nextFAQ = currentIndex < allFAQs.length - 1 ? allFAQs[currentIndex + 1] : null;

  // Generate JSON-LD schema with Speakable for voice search
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: {
      "@type": "Question",
      name: faqData.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqData.longAnswer,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#answer-text"]
        }
      }
    },
    datePublished: "2026-04-24",
    dateModified: "2026-04-24",
    author: {
      "@type": "Organization",
      name: "CasePort.io",
      url: "https://www.caseport.io"
    }
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
        <div className="max-w-3xl mx-auto px-7">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#4a8c7e] mb-8">
            <a href="/guides" className="hover:text-[#1a4a5a]">Guides</a>
            <ChevronRight size={16} />
            <a href="/guides/faq" className="hover:text-[#1a4a5a]">FAQ</a>
            <ChevronRight size={16} />
            <span className="text-[#1a4a5a] font-semibold">Question</span>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <HelpCircle size={32} className="text-[#c4714a] flex-shrink-0 mt-1" />
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a4a5a] leading-tight">
                {faqData.question}
              </h1>
            </div>

            {/* Category Badge */}
            <div className="inline-block px-3 py-1 bg-[#f0f8f6] border border-[#4a8c7e] rounded-full text-sm font-semibold text-[#4a8c7e] mb-6">
              {faqData.category.replace(/-/g, " ")}
            </div>
          </div>

          {/* Quick Answer */}
          <section className="mb-12 bg-white rounded-lg p-6 border-l-4 border-[#c4714a]">
            <h2 className="text-lg font-bold text-[#1a4a5a] mb-3">Quick Answer</h2>
            <p className="text-[#333] text-lg leading-relaxed">{faqData.shortAnswer}</p>
          </section>

          {/* Full Answer */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Full Answer</h2>
            <div id="answer-text" className="prose prose-lg max-w-none">
              <div className="bg-white rounded-lg p-8 border border-[#e8e2d8] text-[#333] leading-relaxed whitespace-pre-wrap">
                {faqData.longAnswer}
              </div>
            </div>
          </section>

          {/* Key Points */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Key Points to Remember</h2>
            <div className="space-y-3">
              {faqData.keyPoints.map((point, idx) => (
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
          {faqData.relatedQuestions.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Related Questions</h2>
              <div className="space-y-3">
                {faqData.relatedQuestions.map((questionSlug, idx) => {
                  const relatedFAQ = getAllFAQPages().find(f => f.slug === questionSlug);
                  if (!relatedFAQ) return null;
                  return (
                    <a
                      key={idx}
                      href={`/guides/faq/${questionSlug}`}
                      className="flex items-start gap-4 bg-white rounded-lg p-4 border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
                    >
                      <HelpCircle size={20} className="text-[#4a8c7e] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-[#1a4a5a]">{relatedFAQ.question}</p>
                        <p className="text-sm text-[#666] mt-1">{relatedFAQ.shortAnswer}</p>
                      </div>
                      <ChevronRight size={16} className="text-[#4a8c7e] flex-shrink-0 mt-0.5" />
                    </a>
                  );
                })}
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
              This answer is optimized for voice search. Try asking your voice assistant: "{faqData.question}"
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

          {/* Navigation Between FAQs */}
          <div className="flex items-center justify-between">
            {previousFAQ ? (
              <a
                href={`/guides/faq/${previousFAQ.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
              >
                <ChevronLeft size={16} />
                <span className="text-sm font-semibold text-[#1a4a5a] line-clamp-1">Previous</span>
              </a>
            ) : (
              <div />
            )}
            <a
              href="/guides/faq"
              className="px-4 py-2 bg-white rounded-lg border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors text-sm font-semibold text-[#1a4a5a]"
            >
              All FAQs
            </a>
            {nextFAQ ? (
              <a
                href={`/guides/faq/${nextFAQ.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#e8e2d8] hover:border-[#4a8c7e] transition-colors"
              >
                <span className="text-sm font-semibold text-[#1a4a5a] line-clamp-1">Next</span>
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

export default FAQPage;
