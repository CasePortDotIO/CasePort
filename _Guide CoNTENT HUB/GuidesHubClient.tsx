'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, Search } from 'lucide-react'

interface Guide {
  id: string
  title: string
  description: string
  topic: string
  readTime: number
}

interface FAQItem {
  question: string
  answerPlainText: string
}

interface GuidesHubClientProps {
  guides: Guide[]
  faqItems: FAQItem[]
}

export default function GuidesHubClient({ guides, faqItems }: GuidesHubClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const filteredGuides = useMemo(() => {
    if (!searchQuery) return guides
    return guides.filter(
      (guide) =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [guides, searchQuery])

  const topicClusters = useMemo(() => {
    const clusters: Record<string, Guide[]> = {}
    guides.forEach((guide) => {
      if (!clusters[guide.topic]) {
        clusters[guide.topic] = []
      }
      clusters[guide.topic].push(guide)
    })
    return clusters
  }, [guides])

  const featuredGuides = guides.slice(0, 3)

  return (
    <>
      {/* Search Section */}
      <section className="container py-12">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search all guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-lg focus:border-teal focus:outline-none"
            aria-label="Search all guides"
          />
        </div>

        {searchQuery && (
          <p className="text-sm text-gray-600">
            Found {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        )}
      </section>

      {/* Featured Guides Section */}
      {!searchQuery && (
        <section className="container py-12">
          <h2 className="mb-8 text-3xl font-bold">Featured Guides</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.id}`}
                className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-teal hover:shadow-lg"
              >
                <div className="mb-3 inline-block rounded-full bg-teal-light/10 px-3 py-1 text-sm font-semibold text-teal">
                  {guide.topic}
                </div>
                <h3 className="mb-2 text-xl font-bold text-ink group-hover:text-teal">{guide.title}</h3>
                <p className="mb-4 text-gray-600">{guide.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{guide.readTime} min read</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Topic Clusters Section */}
      {!searchQuery && (
        <section className="container py-12">
          <h2 className="mb-8 text-3xl font-bold">Browse by Topic</h2>
          {Object.entries(topicClusters).map(([topic, topicGuides]) => (
            <div key={topic} className="mb-12">
              <h3 className="mb-6 text-2xl font-bold">{topic}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {topicGuides.map((guide) => (
                  <Link
                    key={guide.id}
                    href={`/guides/${guide.id}`}
                    className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-teal hover:shadow-md"
                  >
                    <h4 className="mb-2 font-bold text-ink group-hover:text-teal">{guide.title}</h4>
                    <p className="mb-3 text-sm text-gray-600">{guide.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{guide.readTime} min</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Search Results */}
      {searchQuery && (
        <section className="container py-12">
          <div className="grid gap-4">
            {filteredGuides.length > 0 ? (
              filteredGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.id}`}
                  className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-teal hover:shadow-lg"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-xl font-bold text-ink group-hover:text-teal">{guide.title}</h3>
                    <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mb-3 text-gray-600">{guide.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="rounded-full bg-teal-light/10 px-3 py-1 text-teal">{guide.topic}</span>
                    <span>{guide.readTime} min read</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-600">No guides found matching your search. Try different keywords.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="container py-16">
        <h2 className="mb-8 text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={index}
              className="group rounded-lg border border-gray-200 bg-white"
              open={expandedFAQ === index}
              onToggle={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
            >
              <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-ink hover:bg-gray-50">
                <span>{item.question}</span>
                <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="faq-answer-inner border-t border-gray-200 bg-gray-50 p-6">
                <p className="text-gray-700">{item.answerPlainText}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="bg-teal py-12 text-white">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Stay Updated</h2>
          <p className="mb-6 text-lg">Get new guides and legal updates delivered to your inbox.</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg bg-white px-4 py-3 text-ink placeholder-gray-400 focus:outline-none"
              aria-label="Email for newsletter"
            />
            <button type="submit" className="btn-primary rounded-lg">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-terra py-12 text-white">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Need Legal Help?</h2>
          <p className="mb-6 text-lg">Get connected with a qualified personal injury attorney for a free case review.</p>
          <a href="/case-review" className="inline-block rounded-lg bg-white px-8 py-3 font-bold text-terra hover:bg-gray-100">
            Free Case Review
          </a>
        </div>
      </section>
    </>
  )
}
