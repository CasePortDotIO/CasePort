'use client'
import { ChevronRight, Search, X } from 'lucide-react'

interface Guide {
  id: string
  title: string
  description: string
  readTime: string
  tag: string
  url: string
  cornerstone?: boolean
  emoji?: string
}

interface Topic {
  id: string
  title: string
  description: string
  guides: Guide[]
}

export default function GuidesHubClient() {
  const allGuides: Guide[] = [
    {
      id: 'statute-of-limitations',
      title: 'Personal Injury Statute of Limitations by State (2026)',
      description: 'Complete state-by-state breakdown of filing deadlines, exceptions, and tolling rules. Know your deadline.',
      readTime: '12 min',
      tag: 'Cornerstone',
      url: '/guides/statute-of-limitations-by-state',
      cornerstone: true,
      emoji: '⏰',
    },
    {
      id: 'what-not-to-say',
      title: 'What Not to Say to Insurance After an Accident',
      description: 'Avoid these 7 critical mistakes that insurance companies use to deny or reduce your claim.',
      readTime: '8 min',
      tag: 'Essential',
      url: '/guides/what-not-to-say-to-insurance',
      cornerstone: true,
      emoji: '🚫',
    },
    {
      id: 'what-to-do-car-accident',
      title: 'What to Do After a Car Accident',
      description: 'Step-by-step guide to protecting your health, evidence, and legal rights in the first 72 hours.',
      readTime: '10 min',
      tag: 'Essential',
      url: '/guides/what-to-do-after-a-car-accident',
      cornerstone: true,
      emoji: '🚗',
    },
    {
      id: 'comparative-negligence',
      title: 'Comparative Negligence Explained in Plain Language',
      description: 'Understand how fault is calculated and how it affects your settlement in your state.',
      readTime: '7 min',
      tag: 'Legal Concepts',
      url: '/guides/comparative-negligence-explained',
    },
    {
      id: 'how-cases-work',
      title: 'How Personal Injury Cases Work',
      description: 'From investigation to settlement: the complete timeline and what to expect at each stage.',
      readTime: '11 min',
      tag: 'The Process',
      url: '/guides/how-personal-injury-cases-work',
    },
    {
      id: 'settlement-amounts',
      title: 'Average Car Accident Settlement Amounts',
      description: 'What cases typically settle for by injury type and state. Data-backed ranges you can trust.',
      readTime: '9 min',
      tag: 'Legal Concepts',
      url: '/guides/average-car-accident-settlement-amounts',
    },
    {
      id: 'do-i-need-lawyer',
      title: 'Do I Need a Lawyer After a Car Accident?',
      description: 'When hiring an attorney makes financial sense. The math that insurance companies don\'t want you to see.',
      readTime: '6 min',
      tag: 'Essential',
      url: '/guides/do-i-need-a-lawyer-after-a-car-accident',
    },
    {
      id: 'medical-records',
      title: 'Medical Records and Your Personal Injury Claim',
      description: 'How to obtain, organize, and use medical evidence to maximize your settlement.',
      readTime: '8 min',
      tag: 'The Process',
      url: '/guides/medical-records-personal-injury-claim',
    },
  ]

  const topics: Topic[] = [
    {
      id: 'essentials',
      title: 'The Essentials',
      description: 'What to do immediately after an accident. What to say. What not to say.',
      guides: allGuides.filter((g) => g.tag === 'Essential'),
    },
    {
      id: 'legal-concepts',
      title: 'Your Rights & The Law',
      description: 'Understand the legal framework: deadlines, fault, insurance, and what you\'re owed.',
      guides: allGuides.filter((g) => g.tag === 'Legal Concepts'),
    },
    {
      id: 'process',
      title: 'The Process',
      description: 'How cases work from start to finish. What happens at each stage.',
      guides: allGuides.filter((g) => g.tag === 'The Process'),
    },
  ]

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 px-7 flex items-center justify-between bg-[rgba(249,245,239,.93)] backdrop-blur-[16px]">
        <a href="/" className="flex flex-col gap-0.5">
          <div className="font-bold text-xs tracking-widest text-[#1a4a5a]">CASEPORT</div>
          <div className="text-[9px] font-semibold tracking-widest text-[#4a8c7e]">Injured? We can help.</div>
        </a>
        <div className="hidden sm:flex items-center gap-6">
          <a href="/guides" className="text-xs font-semibold text-[#1a4a5a] border-b-2 border-[#1a4a5a]">Guides</a>
          <a href="/insights" className="text-xs font-medium text-[#2e4350] hover:text-[#1a4a5a]">Insights</a>
          <a href="/personal-injury-leads" className="text-xs font-medium text-[#2e4350] hover:text-[#1a4a5a]">For Law Firms</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="tel:+18002273669" className="hidden sm:flex text-xs font-semibold text-[#2e4350] hover:text-[#1a4a5a]">📞 1-800-CASE-NOW</a>
          <a href="/injured#case-review" className="bg-[#c4714a] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#d4855e] transition-all">Free Case Review</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-12 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-end">
          <div className="opacity-0 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-5 h-0.5 bg-[#4a8c7e]"></div>
              <span className="text-xs font-bold tracking-widest text-[#4a8c7e] uppercase">Personal Injury Guides</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl font-medium leading-tight text-[#1c2b32] mb-6" style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}>
              Everything you need<br />to know. Nothing<br />you don&apos;t.
            </h1>
            <p className="text-lg text-[#2e4350] leading-relaxed mb-8 max-w-md">
              Clear, attorney-reviewed answers to personal injury law. What to do, what to say, what you&apos;re owed, and how much time you have.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a href="/injured#case-review" className="inline-flex items-center gap-2 bg-[#c4714a] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#d4855e] transition-all hover:shadow-lg">
                Start Free Case Review <ChevronRight size={16} />
              </a>
              <a href="#guides-all" className="text-sm font-semibold text-[#1a4a5a] border-b-2 border-[rgba(26,74,90,.2)] pb-0.5 hover:border-[#1a4a5a]">Browse all guides</a>
            </div>
          </div>
          <div className="space-y-3 opacity-0 animate-fade-in animation-delay-200">
            <div className="bg-white border border-[#e8e2d8] rounded-2xl p-5 hover:shadow-md transition-all hover:translate-x-1">
              <div className="font-serif text-3xl font-medium text-[#1a4a5a]">2 yrs</div>
              <div className="text-sm font-bold text-[#1c2b32] mt-1">The filing deadline in most states</div>
              <div className="text-xs text-[#7a9299] mt-1">Check yours → <a href="#statute-of-limitations" className="text-[#1a4a5a] font-semibold">statute of limitations guide</a></div>
            </div>
            <div className="bg-white border border-[#e8e2d8] rounded-2xl p-5 hover:shadow-md transition-all hover:translate-x-1">
              <div className="font-serif text-3xl font-medium text-[#1a4a5a]">72hrs</div>
              <div className="text-sm font-bold text-[#1c2b32] mt-1">Before traffic camera footage is deleted</div>
              <div className="text-xs text-[#7a9299] mt-1">Why acting fast on evidence is critical</div>
            </div>
            <div className="bg-white border border-[#e8e2d8] rounded-2xl p-5 hover:shadow-md transition-all hover:translate-x-1">
              <div className="font-serif text-3xl font-medium text-[#1a4a5a]">$0</div>
              <div className="text-sm font-bold text-[#1c2b32] mt-1">Cost to start a case review</div>
              <div className="text-xs text-[#7a9299] mt-1">PI attorneys work on contingency</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="py-8 px-6 max-w-5xl mx-auto">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[#7a9299]" size={18} />
          <input type="text" placeholder="Search guides..." className="w-full pl-14 pr-12 py-4 border-2 border-[#e8e2d8] rounded-full bg-white text-[#1c2b32] placeholder-[#7a9299] focus:outline-none focus:border-[#1a4a5a] focus:ring-2 focus:ring-[rgba(26,74,90,.1)] transition-all" />
        </div>
      </section>

      {/* FEATURED GUIDES */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-bold tracking-widest text-[#c4714a] uppercase">Featured</span>
          <div className="flex-1 h-px bg-[#e8e2d8]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allGuides.filter((g) => g.cornerstone).map((guide, idx) => (
            <a key={guide.id} href={guide.url} className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${idx === 0 ? 'bg-[#1a4a5a] border border-[#1a4a5a] text-white lg:col-span-1 lg:row-span-2' : 'bg-white border border-[#e8e2d8] hover:border-[#1a4a5a] hover:shadow-lg'}`}>
              <div className={`h-32 lg:h-40 flex items-center justify-center ${idx === 0 ? 'bg-gradient-to-br from-[rgba(255,255,255,.06)] to-[rgba(255,255,255,.02)]' : 'bg-gradient-to-br from-[#ebe3d5] to-[#f2ebe0]'}`}>
                <div className={`text-6xl lg:text-8xl opacity-${idx === 0 ? '15' : '30'} font-serif`}>{guide.emoji}</div>
              </div>
              <div className="p-5 lg:p-6 flex flex-col h-full">
                <div className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  {idx === 0 ? (
                    <span className="inline-flex items-center gap-1 bg-[rgba(201,168,76,.18)] border border-[rgba(201,168,76,.35)] px-2 py-1 rounded-full text-[#c9a84c]">★ Cornerstone</span>
                  ) : (
                    <span className={idx === 0 ? 'text-[rgba(201,168,76,.8)]' : 'text-[#4a8c7e]'}>{guide.tag}</span>
                  )}
                </div>
                <h3 className={`font-serif text-xl lg:text-2xl font-medium leading-tight mb-3 flex-1 ${idx === 0 ? 'text-white' : 'text-[#1c2b32]'}`} style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}>{guide.title}</h3>
                <p className={`text-sm leading-relaxed mb-4 ${idx === 0 ? 'text-[rgba(255,255,255,.65)]' : 'text-[#2e4350]'}`}>{guide.description}</p>
                <div className={`flex items-center justify-between pt-3 border-t ${idx === 0 ? 'border-[rgba(255,255,255,.12)]' : 'border-[#e8e2d8]'}`}>
                  <div className={`text-xs font-semibold flex items-center gap-1 ${idx === 0 ? 'bg-[rgba(201,168,76,.15)] text-[#c9a84c] px-2 py-1 rounded-full' : 'text-[#1c2b32] bg-[#fdf6e3] px-2 py-1 rounded-full'}`}>✓ Attorney-Reviewed</div>
                  <div className={`text-xs ${idx === 0 ? 'text-[rgba(255,255,255,.4)]' : 'text-[#7a9299]'}`}>{guide.readTime}</div>
                </div>
                <div className={`mt-3 flex items-center gap-1 text-xs font-bold group-hover:translate-x-1 transition-transform ${idx === 0 ? 'text-[rgba(255,255,255,.4)] group-hover:text-[rgba(255,255,255,.8)]' : 'text-[#7a9299] group-hover:text-[#1a4a5a]'}`}>
                  Read Guide <ChevronRight size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* TOPICS & GUIDES */}
      <section id="guides-all" className="py-16 px-6 max-w-5xl mx-auto">
        {topics.map((topic) => (
          <div key={topic.id} className="mb-20">
            <div className="mb-8">
              <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#1c2b32] mb-3" style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}>{topic.title}</h2>
              <p className="text-base text-[#2e4350] leading-relaxed max-w-2xl">{topic.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {topic.guides.map((guide) => (
                <a key={guide.id} href={guide.url} className="group bg-white border border-[#e8e2d8] rounded-xl p-5 hover:border-[#1a4a5a] hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-3 h-px bg-[#4a8c7e]"></div>
                    <span className="text-xs font-bold tracking-widest text-[#4a8c7e] uppercase">{guide.tag}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#1c2b32] leading-tight mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}>{guide.title}</h3>
                  <p className="text-sm text-[#2e4350] leading-relaxed mb-4 line-clamp-2">{guide.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-[#e8e2d8]">
                    <div className="text-xs font-semibold text-[#1c2b32] bg-[#fdf6e3] px-2 py-1 rounded-full">✓ Attorney-Reviewed</div>
                    <div className="text-xs text-[#7a9299]">{guide.readTime}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* SUBSCRIBE STRIP */}
      <section className="bg-[#ebe3d5] border-t border-b border-[#e8e2d8] py-9 px-6 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#1c2b32] mb-1" style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}>Stay informed</h3>
            <p className="text-sm text-[#2e4350]">Get updates on new guides and legal changes in your inbox.</p>
          </div>
          <form className="flex gap-2 w-full sm:w-auto">
            <input type="email" placeholder="Your email" className="flex-1 sm:flex-none px-4 py-3 border-2 border-[#e8e2d8] rounded-full bg-white text-[#1c2b32] placeholder-[#7a9299] focus:outline-none focus:border-[#1a4a5a] text-sm" />
            <button type="submit" className="px-5 py-3 bg-[#1a4a5a] text-white rounded-full font-bold text-sm hover:bg-[#255e72] transition-all whitespace-nowrap">Subscribe</button>
          </form>
        </div>
        <p className="text-xs text-[#7a9299] mt-4 text-center sm:text-left">We respect your privacy. Unsubscribe at any time.</p>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#1a4a5a] py-20 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-tl from-[rgba(201,168,76,.1)] to-transparent pointer-events-none opacity-50"></div>
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-gradient-to-br from-[rgba(74,140,126,.08)] to-transparent pointer-events-none opacity-50"></div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="text-xs font-bold tracking-widest text-[rgba(201,168,76,.75)] uppercase mb-4">Ready to move forward?</div>
          <h2 className="font-serif text-4xl lg:text-5xl font-medium text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}>Injured? We can help.</h2>
          <p className="text-lg text-[rgba(255,255,255,.7)] mb-8 leading-relaxed">Free case review. No obligation. No upfront cost. Our network of qualified attorneys is ready to evaluate your claim.</p>
          <a href="/injured#case-review" className="inline-flex items-center gap-2 bg-[#c4714a] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#d4855e] transition-all hover:shadow-xl hover:-translate-y-0.5">
            Start Your Free Case Review <ChevronRight size={18} />
          </a>
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs text-[rgba(255,255,255,.45)]">
            <span>Trusted by injured people</span><span>·</span><span>All 50 states</span><span>·</span><span>No upfront fees</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a4a5a] px-6 py-11">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between flex-wrap gap-5 mb-7">
            <a href="/" className="flex flex-col gap-0.5">
              <div className="font-bold text-xs tracking-widest text-[rgba(255,255,255,.55)]">CASEPORT</div>
              <div className="text-[9px] font-semibold tracking-widest text-[rgba(201,168,76,.55)]">Injured? We can help.</div>
            </a>
            <div className="flex gap-5 flex-wrap items-center">
              <a href="/" className="text-xs text-[rgba(255,255,255,.3)] hover:text-[rgba(255,255,255,.75)]">Home</a>
              <a href="/guide" className="text-xs text-[rgba(255,255,255,.3)] hover:text-[rgba(255,255,255,.75)]">Guides</a>
              <a href="/insights" className="text-xs text-[rgba(255,255,255,.3)] hover:text-[rgba(255,255,255,.75)]">Insights</a>
              <a href="/personal-injury-leads" className="text-xs text-[rgba(255,255,255,.3)] hover:text-[rgba(255,255,255,.75)]">For Law Firms</a>
              <a href="/privacy" className="text-xs text-[rgba(255,255,255,.3)] hover:text-[rgba(255,255,255,.75)]">Privacy</a>
            </div>
          </div>
          <div className="border-t border-[rgba(255,255,255,.07)] pt-5">
            <p className="text-xs text-[rgba(255,255,255,.2)] leading-relaxed">This is not legal advice. Guides are for informational purposes only. Always consult with a qualified attorney about your specific situation. www.CasePort.io is a personal injury case acquisition network connecting injured people with qualified independent attorneys.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animation-delay-200 { animation-delay: 0.16s; }
      `}</style>
    </div>
  )
}