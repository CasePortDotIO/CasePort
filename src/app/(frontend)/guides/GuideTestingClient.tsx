'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Search,
  X,
  Award,
  Calendar,
  CheckCircle,
  Star,
  BarChart3,
  Scale,
  BookOpen,
  Clock,
  ChevronDown,
  ArrowRight,
  Car,
  AlertTriangle,
  Truck,
  Stethoscope,
  Building2,
  Bike,
  Users,
  Dog,
  Heart,
  FileText,
  DollarSign,
  AlertCircle,
  Navigation,
} from 'lucide-react'
import SettlementCalculator from '@/components/SettlementCalculator'

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

interface QuickAnswer {
  id: string
  question: string
  directAnswer: string
  fullAnswer: string
  keyFacts: string[]
  sources?: string[]
}

interface GuidesHubClientProps {
  guides: Guide[]
  faqItems: FAQItem[]
}

const guideIcons: Record<string, React.ReactNode> = {
  'car-accident': <Car className="w-6 h-6" />,
  'slip-and-fall': <AlertTriangle className="w-6 h-6" />,
  'truck-accident': <Truck className="w-6 h-6" />,
  'medical-malpractice': <Stethoscope className="w-6 h-6" />,
  'workplace-injury': <Building2 className="w-6 h-6" />,
  'motorcycle-accident': <Bike className="w-6 h-6" />,
  'pedestrian-accident': <Users className="w-6 h-6" />,
  'dog-bite': <Dog className="w-6 h-6" />,
  'wrongful-death': <Heart className="w-6 h-6" />,
  'rideshare-accident': <Navigation className="w-6 h-6" />,
  'insurance-claim': <FileText className="w-6 h-6" />,
}

const quickAnswers: QuickAnswer[] = [
  {
    id: 'statute-of-limitations',
    question: 'What is the statute of limitations for personal injury cases?',
    directAnswer: 'The statute of limitations for personal injury cases is typically 2-3 years from the date of injury, though this varies by state.',
    fullAnswer: 'The statute of limitations is the legal deadline by which you must file a personal injury lawsuit. In most states, this deadline is 2-3 years from the date of injury. However, some states allow up to 4-6 years for certain injury types. Missing this deadline means you permanently lose your right to sue, regardless of how strong your case is.',
    keyFacts: ['Typical deadline: 2-3 years from injury date', 'Some states allow 4-6 years', 'Missing deadline = permanent loss of rights', 'Tolling rules may pause the deadline', 'Deadline varies by injury type and state'],
    sources: ['State Bar Associations', 'ABA Guidelines', 'Legal Precedent'],
  },
  {
    id: 'settlement-amounts',
    question: 'How much do personal injury cases typically settle for?',
    directAnswer: 'Personal injury settlements range from $5,000 for minor injuries to $500,000+ for severe injuries, with most cases settling between $25,000-$100,000.',
    fullAnswer: 'Settlement amounts vary dramatically based on injury severity, medical expenses, lost wages, pain and suffering, and liability strength. Minor injuries typically settle for $5,000-$25,000. Moderate injuries typically settle for $25,000-$100,000. Severe injuries typically settle for $100,000-$500,000+.',
    keyFacts: ['Minor injuries: $5K-$25K', 'Moderate injuries: $25K-$100K', 'Severe injuries: $100K-$500K+', 'Average settlement: ~$52,000', 'Attorney fees typically 25-40% of settlement'],
    sources: ['NHTSA Data', 'Insurance Industry Reports', 'Case Law Analysis'],
  },
  {
    id: 'do-i-need-attorney',
    question: 'Do I need an attorney for a personal injury case?',
    directAnswer: 'You need an attorney if you have a serious injury, disputed liability, or the insurance company is being difficult. For minor injuries with clear liability, you may handle it yourself.',
    fullAnswer: 'Whether you need an attorney depends on case complexity. For serious injuries, permanent disability, disputed liability, or when the insurance company denies your claim, an attorney is essential. Attorneys typically increase settlements by 25-40% more than self-representation.',
    keyFacts: ['Attorneys increase settlements 25-40%', 'Work on contingency (no upfront cost)', 'Essential for serious/complex cases', 'Good for disputed liability', 'Helpful when insurance denies claim'],
    sources: ['ABA Study', 'Insurance Negotiation Data', 'Settlement Analysis'],
  },
  {
    id: 'what-to-do-after-accident',
    question: 'What should I do immediately after an accident?',
    directAnswer: 'After an accident, seek medical attention, call police, document the scene with photos, get witness information, and contact an attorney within 24-48 hours.',
    fullAnswer: 'The first 72 hours after an accident are critical. First, seek medical attention immediately. Second, call police and get a police report number. Third, document everything with photos. Fourth, get contact information from all witnesses. Finally, contact an attorney within 24-48 hours.',
    keyFacts: ['Seek medical care immediately', 'Get police report', 'Document with photos', 'Collect witness information', "Don't admit fault", 'Contact attorney within 24-48 hours'],
    sources: ['NHTSA Guidelines', 'ABA Recommendations', 'Insurance Best Practices'],
  },
  {
    id: 'comparative-negligence',
    question: 'What is comparative negligence and how does it affect my case?',
    directAnswer: 'Comparative negligence reduces your settlement by your percentage of fault. For example, if you\'re 20% at fault, you recover 80% of damages.',
    fullAnswer: 'Comparative negligence is a legal rule that determines how fault is divided between you and the defendant. Your settlement is reduced by your percentage of fault. Rules vary by state.',
    keyFacts: ['Pure comparative: recover at any fault %', 'Modified comparative: ≤50% fault to recover', 'Contributory: no recovery if any fault', 'Settlement reduced by your fault %', 'Rules vary by state'],
    sources: ['State Statutes', 'Case Law', 'Legal Precedent'],
  },
  {
    id: 'medical-records',
    question: 'How important are medical records in a personal injury case?',
    directAnswer: 'Medical records are critical - they prove your injuries, treatment, and damages. Cases with comprehensive medical documentation settle for 3-5x more than cases without.',
    fullAnswer: 'Medical records are the foundation of your case. They document your injuries, treatment, and recovery timeline. Cases with comprehensive medical documentation settle for significantly more than cases without.',
    keyFacts: ['Prove injuries and treatment', 'Document recovery timeline', 'Increase settlement value 3-5x', 'Insurance uses them to calculate damages', 'Gaps reduce settlement amount'],
    sources: ['Insurance Claims Data', 'Settlement Analysis', 'Medical Evidence'],
  },
  {
    id: 'settlement-vs-trial',
    question: 'Should I settle or go to trial?',
    directAnswer: 'Most cases settle (90-95%). Trials are unpredictable, expensive, and time-consuming. Settle if the offer is fair and covers your damages.',
    fullAnswer: 'Settlement offers certainty and faster resolution. Trials are risky - you might win more or lose everything. Only go to trial if the settlement offer is unreasonably low.',
    keyFacts: ['90-95% of cases settle', 'Trials take 2-5 years', 'Trial costs: $10K-$50K+', 'Settlement = certainty', 'Trial = unpredictable outcome'],
    sources: ['Court Statistics', 'ABA Data', 'Case Outcomes'],
  },
]

const featuredGuidesData = [
  { title: 'Car Accident - Rear-End', link: '/guide/car-accident/rear-end', key: 'car-accident', description: 'Rear-end collision liability, settlement ranges by state, and why you need an attorney. Get the facts immediately.' },
  { title: 'Car Accident - T-Bone', link: '/guide/car-accident/t-bone', key: 'car-accident', description: 'T-bone collision injuries, liability rules, and catastrophic damage settlements. Understand your rights.' },
  { title: 'Car Accident - Hit & Run', link: '/guide/car-accident/hit-and-run', key: 'car-accident', description: 'Hit-and-run claims, uninsured motorist coverage, and recovery without finding the driver. Know your options.' },
  { title: 'Car Accident - Intersection', link: '/guide/car-accident/intersection', key: 'car-accident', description: 'Intersection collision liability, traffic signal rules, and settlement expectations. Protect your claim.' },
  { title: 'Car Accident - Parking Lot', link: '/guide/car-accident/parking-lot', key: 'car-accident', description: 'Parking lot accident liability, comparative negligence, and quick settlements. Handle minor collisions right.' },
  { title: 'Car Accident - Multi-Vehicle', link: '/guide/car-accident/multi-vehicle', key: 'car-accident', description: 'Pile-up liability, multiple defendants, and complex settlement negotiations. Maximize your recovery.' },
  { title: 'Car Accident (General)', link: '/guide/car-accident', key: 'car-accident', description: 'Understand liability, insurance claims, and settlement expectations after a motor vehicle collision. Learn what damages you can recover.' },
  { title: 'Slip & Fall', link: '/guide/slip-and-fall', key: 'slip-and-fall', description: 'Property owner liability, premises liability laws, and how to prove negligence. Get the facts before negotiating.' },
  { title: 'Motorcycle Accident', link: '/guide/motorcycle-accident', key: 'motorcycle-accident', description: 'Bias against riders, insurance tactics, and catastrophic injury settlements. Know the landscape.' },
  { title: 'Truck Accident', link: '/guide/truck-accident', key: 'truck-accident', description: 'Commercial liability, federal regulations, and why truck accidents settle for more. Discover your rights.' },
  { title: 'Medical Malpractice', link: '/guide/medical-malpractice', key: 'medical-malpractice', description: 'Standard of care, expert testimony requirements, and complex damages. Navigate medical negligence claims.' },
  { title: 'Workplace Injury', link: '/guide/workplace-injury', key: 'workplace-injury', description: "Workers' compensation vs personal injury lawsuits. Understand your options and maximum recovery." },
  { title: 'Pedestrian Accident', link: '/guide/pedestrian-accident', key: 'pedestrian-accident', description: 'Right-of-way laws, hit-and-run claims, and serious injury settlements. Protect your interests.' },
  { title: 'Dog Bite', link: '/guide/dog-bite', key: 'dog-bite', description: 'Strict liability laws, insurance coverage, and scarring/disfigurement damages. Learn your claim value.' },
  { title: 'Wrongful Death', link: '/guide/wrongful-death', key: 'wrongful-death', description: "Surviving family compensation, punitive damages, and filing deadlines. Honor your loved one's memory." },
  { title: 'Rideshare Accident', link: '/guide/rideshare-accident', key: 'rideshare-accident', description: 'Uber/Lyft liability, insurance coverage gaps, and passenger rights. Understand platform accountability.' },
  { title: 'Insurance Claims', link: '/guide/insurance-claim', key: 'insurance-claim', description: 'Claim process, denial tactics, and appeal strategies. Fight back against unfair denials.' },
  { title: 'View All Guides', link: '/guide', key: 'all-guides', description: 'Browse our complete library of 43+ injury guides with real settlement data, state-specific laws, and AI-optimized content.' },
]

export default function GuideTestingClient({ guides, faqItems }: GuidesHubClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredAnswers, setFilteredAnswers] = useState<QuickAnswer[]>([])
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useMemo(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 600)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = quickAnswers.filter(
        (qa) =>
          qa.question.toLowerCase().includes(query.toLowerCase()) ||
          qa.fullAnswer.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredAnswers(filtered)
    } else {
      setFilteredAnswers([])
    }
  }

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
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* Sticky Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 px-7 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'bg-[#f9f5ef] border-b border-[#e8e2d8] shadow-md' : 'bg-transparent'
        }`}
        style={{
          opacity: isScrolled ? 1 : 0,
          pointerEvents: isScrolled ? 'auto' : 'none',
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#1a4a5a] flex items-center justify-center">
            <span className="font-bold text-white text-lg">CP</span>
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-[#1a4a5a]">CasePort</span>
        </Link>
        <a
          href="tel:+18002273669"
          className="bg-[#c4714a] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md"
        >
          Free Case Review
        </a>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-24 px-6 bg-[#f9f5ef]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-xs font-bold tracking-widest text-[#4a8c7e] mb-4 uppercase">
            Personal Injury Guides
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-[#1c2b32] mb-6 leading-tight">
            The Authoritative Source
            <br />
            for Personal Injury Law
          </h1>
          <p className="text-lg text-[#555] mb-8 max-w-3xl mx-auto leading-relaxed">
            Attorney-reviewed guides that help accident victims get fair compensation. Updated quarterly.
            No jargon. No sales pitch.
          </p>

          {/* Credibility Signals */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#666] mb-12">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#4a8c7e]" />
              <span>Attorney-Reviewed</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#4a8c7e]" />
              <span>Updated April 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4a8c7e]" />
              <span>ABA Compliant</span>
            </div>
          </div>

          {/* Search Bar with Live Results */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-4" size={20} style={{ color: '#999' }} />
              <input
                type="text"
                placeholder="Search answers... (e.g., 'statute of limitations', 'settlement', 'attorney')"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e8e2d8] bg-white text-[#555] placeholder-[#999] focus:outline-none focus:border-[#4a8c7e]"
              />
              {searchQuery && (
                <button onClick={() => handleSearch('')} className="absolute right-4 top-4">
                  <X size={20} style={{ color: '#999' }} />
                </button>
              )}
            </div>

            {/* Live Search Results */}
            {filteredAnswers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-[#e8e2d8] shadow-lg z-10">
                {filteredAnswers.map((answer) => (
                  <div
                    key={answer.id}
                    className="p-4 border-b border-[#e8e2d8] last:border-b-0 hover:bg-[#f9f5ef] cursor-pointer"
                  >
                    <h3 className="font-semibold text-[#1a4a5a]">{answer.question}</h3>
                    <p className="text-sm text-[#555] mt-1">{answer.directAnswer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK ANSWERS SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#1a4a5a' }}>
            Quick Answers
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {quickAnswers.map((answer) => (
              <div
                key={answer.id}
                className="p-6 rounded-xl border border-[#e8e2d8] bg-[#f9f5ef] hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold mb-3" style={{ color: '#1a4a5a' }}>
                  {answer.question}
                </h3>
                <p className="text-sm mb-4" style={{ color: '#555' }}>
                  {answer.directAnswer}
                </p>
                <div className="space-y-2 mb-4">
                  {answer.keyFacts.slice(0, 2).map((fact, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: '#4a8c7e' }}
                      />
                      <span className="text-xs" style={{ color: '#666' }}>
                        {fact}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href={
                    answer.id === 'statute-of-limitations'
                      ? '/guide/car-accident/statute-of-limitations'
                      : answer.id === 'settlement-amounts'
                        ? '/guide/car-accident/settlement-amounts'
                        : answer.id === 'do-i-need-attorney'
                          ? '/guide/car-accident/do-i-need-a-lawyer'
                          : answer.id === 'what-to-do-after-accident'
                            ? '/guide/car-accident/what-to-do'
                            : answer.id === 'comparative-negligence'
                              ? '/guide/car-accident/what-to-do'
                              : answer.id === 'medical-records'
                                ? '/guide/car-accident/what-to-do'
                                : answer.id === 'settlement-vs-trial'
                                  ? '/guide/car-accident/settlement-amounts'
                                  : '/guide'
                  }
                  className="text-sm font-semibold"
                  style={{ color: '#c4714a' }}
                >
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES SECTION */}
      <section className="py-16 px-6 bg-[#1a4a5a]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {[
              { icon: Star, label: '4.9/5 Rating', value: '2,847 Reviews' },
              { icon: BarChart3, label: '500K+ Cases', value: 'Resolved' },
              { icon: CheckCircle, label: 'ABA Compliant', value: 'Attorney-Reviewed' },
              { icon: Award, label: 'Award-Winning', value: 'Industry Leader' },
              { icon: Scale, label: '100% Confidential', value: 'Your Privacy Protected' },
            ].map((badge, idx) => (
              <div key={idx} className="text-white">
                <badge.icon className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold text-sm">{badge.label}</p>
                <p className="text-xs mt-1 opacity-80">{badge.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#1a4a5a' }}>
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah M.',
                rating: 5,
                quote: "CasePort's guides were incredibly helpful. I understood my rights before even calling an attorney.",
              },
              {
                name: 'James T.',
                rating: 5,
                quote: 'The settlement calculator gave me realistic expectations. Highly recommend.',
              },
              {
                name: 'Maria L.',
                rating: 5,
                quote: 'Clear, honest information without the legal jargon. Exactly what I needed.',
              },
              {
                name: 'David K.',
                rating: 5,
                quote:
                  "After my truck accident, I felt lost. CasePort's step-by-step guides gave me confidence to negotiate fairly. Saved me thousands.",
              },
              {
                name: 'Jennifer R.',
                rating: 5,
                quote:
                  'The statute of limitations section was a lifesaver. I almost missed my deadline. This site should be required reading.',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-[#e8e2d8] bg-[#f9f5ef]">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#c4714a]"
                      style={{ color: '#c4714a' }}
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm" style={{ color: '#555' }}>
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="font-semibold text-sm" style={{ color: '#1a4a5a' }}>
                  — {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED GUIDES SECTION */}
      <section className="py-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#1a4a5a' }}>
            Featured Guides
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredGuidesData.map((guide, idx) => (
              <a
                key={idx}
                href={guide.link}
                className="p-6 rounded-xl border border-[#e8e2d8] bg-white hover:shadow-lg hover:border-[#4a8c7e] transition-all"
              >
                <div className="mb-3 text-[#4a8c7e]">
                  {guide.key === 'all-guides' ? (
                    <BookOpen className="w-6 h-6" />
                  ) : (
                    guideIcons[guide.key]
                  )}
                </div>
                <h3 className="font-semibold" style={{ color: '#1a4a5a' }}>
                  {guide.title}
                </h3>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: '#666' }}>
                  {guide.description}
                </p>
                <p className="text-sm mt-4" style={{ color: '#4a8c7e' }}>
                  Learn more →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SETTLEMENT CALCULATOR SECTION */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
              Know Your Case Value
            </h2>
            <p className="text-lg" style={{ color: '#666' }}>
              Get a free, personalized settlement estimate in just 2 minutes. No attorney needed—understand
              what your case is worth before you make any decisions.
            </p>
          </div>
          <SettlementCalculator />
        </div>
      </section>

      {/* SETTLEMENT CALCULATION BREAKDOWN */}
      <section className="py-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#1a4a5a' }}>
            How Your Settlement is Calculated
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-[#e8e2d8] bg-white">
              <div className="text-2xl font-bold mb-2" style={{ color: '#c4714a' }}>
                1
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#1a4a5a' }}>
                Economic Damages
              </h3>
              <p className="text-sm" style={{ color: '#555' }}>
                Medical bills + lost wages + future medical care
              </p>
            </div>
            <div className="p-6 rounded-lg border border-[#e8e2d8] bg-white">
              <div className="text-2xl font-bold mb-2" style={{ color: '#c4714a' }}>
                2
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#1a4a5a' }}>
                Pain & Suffering Multiplier
              </h3>
              <p className="text-sm" style={{ color: '#555' }}>
                1.5x - 5x based on injury severity
              </p>
            </div>
            <div className="p-6 rounded-lg border border-[#e8e2d8] bg-white">
              <div className="text-2xl font-bold mb-2" style={{ color: '#c4714a' }}>
                3
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#1a4a5a' }}>
                Total Settlement
              </h3>
              <p className="text-sm" style={{ color: '#555' }}>
                Economic damages + pain & suffering
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REAL SETTLEMENT EXAMPLES */}
      <section className="py-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#1a4a5a' }}>
            Real Settlement Examples
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { case: 'Car Accident', injury: 'Broken leg & back injury', settlement: '$185,000' },
              { case: 'Slip & Fall', injury: 'Hip fracture, surgery required', settlement: '$92,500' },
              { case: 'Medical Malpractice', injury: 'Surgical error, permanent damage', settlement: '$425,000' },
            ].map((story, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-[#e8e2d8] bg-white">
                <div className="text-3xl font-bold mb-2" style={{ color: '#c4714a' }}>
                  {story.settlement}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#1a4a5a' }}>
                  {story.case}
                </h3>
                <p className="text-sm" style={{ color: '#555' }}>
                  {story.injury}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW SETTLEMENTS ARE CALCULATED */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#1a4a5a' }}>
            How Settlement Amounts Are Calculated
          </h2>
          <div className="space-y-4">
            {[
              { factor: 'Medical Expenses', desc: 'All past and future medical treatment costs' },
              { factor: 'Lost Wages', desc: 'Income lost due to injury and recovery' },
              { factor: 'Pain & Suffering', desc: 'Compensation for physical and emotional pain' },
              { factor: 'Permanent Disability', desc: 'Long-term or permanent loss of function' },
              { factor: 'Liability Strength', desc: "How clear the defendant's fault is" },
              { factor: 'Insurance Limits', desc: 'Maximum the insurance company will pay' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-4 bg-[#f9f5ef] rounded-lg border border-[#e8e2d8]"
              >
                <div
                  className="w-12 h-12 rounded-lg bg-[#4a8c7e] flex items-center justify-center text-white font-bold flex-shrink-0"
                >
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#1a4a5a' }}>
                    {item.factor}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#555' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATUTE OF LIMITATIONS TABLE */}
      <section className="py-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a4a5a' }}>
            Statute of Limitations by State
          </h2>
          <p className="text-lg mb-8" style={{ color: '#555' }}>
            Time is critical. Know your deadline.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1a4a5a] text-white">
                  <th className="px-4 py-3 text-left">State</th>
                  <th className="px-4 py-3 text-left">Deadline</th>
                  <th className="px-4 py-3 text-left">Starts From</th>
                  <th className="px-4 py-3 text-left">Exceptions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    state: 'California',
                    deadline: '2 years',
                    startDate: 'From date of injury',
                    exceptions: '1 year for government entities',
                  },
                  {
                    state: 'Texas',
                    deadline: '2 years',
                    startDate: 'From date of injury',
                    exceptions: '4 years for property damage',
                  },
                  {
                    state: 'Florida',
                    deadline: '4 years',
                    startDate: 'From date of injury',
                    exceptions: '2 years for medical malpractice',
                  },
                  {
                    state: 'New York',
                    deadline: '3 years',
                    startDate: 'From date of injury',
                    exceptions: '1 year for government entities',
                  },
                  {
                    state: 'Illinois',
                    deadline: '2 years',
                    startDate: 'From date of injury',
                    exceptions: 'Tolling for minors',
                  },
                  {
                    state: 'Pennsylvania',
                    deadline: '2 years',
                    startDate: 'From date of injury',
                    exceptions: '6 years for fraud cases',
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f5ef]'}
                  >
                    <td className="px-4 py-3 font-semibold" style={{ color: '#1a4a5a' }}>
                      {row.state}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#555' }}>
                      {row.deadline}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#555' }}>
                      {row.startDate}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#555' }}>
                      {row.exceptions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SETTLEMENT RANGES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#1a4a5a' }}>
            Settlement Ranges by Injury Type
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                injuryType: 'Minor (bruises, sprains)',
                minAmount: 5000,
                maxAmount: 25000,
                averageAmount: 12500,
              },
              {
                injuryType: 'Moderate (fractures, significant pain)',
                minAmount: 25000,
                maxAmount: 100000,
                averageAmount: 52000,
              },
              {
                injuryType: 'Severe (permanent disability)',
                minAmount: 100000,
                maxAmount: 500000,
                averageAmount: 250000,
              },
              {
                injuryType: 'Catastrophic (life-threatening)',
                minAmount: 500000,
                maxAmount: 5000000,
                averageAmount: 1500000,
              },
            ].map((range, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-[#e8e2d8] bg-[#f9f5ef]">
                <h3 className="font-semibold mb-4" style={{ color: '#1a4a5a' }}>
                  {range.injuryType}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: '#555' }}>
                      Range:
                    </span>
                    <span className="font-semibold" style={{ color: '#c4714a' }}>
                      ${(range.minAmount / 1000).toFixed(0)}K - ${(range.maxAmount / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: '#555' }}>
                      Average:
                    </span>
                    <span className="font-semibold" style={{ color: '#1a4a5a' }}>
                      ${(range.averageAmount / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WITH vs WITHOUT ATTORNEY */}
      <section className="py-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#1a4a5a' }}>
            With Attorney vs. Without Attorney
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1a4a5a] text-white">
                  <th className="px-4 py-3 text-left">Factor</th>
                  <th className="px-4 py-3 text-left">With Attorney</th>
                  <th className="px-4 py-3 text-left">Without Attorney</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { factor: 'Average Settlement', with: '$52,000', without: '$35,000' },
                  { factor: 'Attorney Fees', with: '25-40%', without: 'N/A' },
                  { factor: 'Net Recovery', with: '$31,200', without: '$35,000' },
                  { factor: 'Time to Settle', with: '1-3 years', without: '6 months - 2 years' },
                  { factor: 'Success Rate', with: '85%+', without: '60%' },
                  { factor: 'Upfront Cost', with: '$0', without: '$0' },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f0f8f6]'}
                  >
                    <td className="px-4 py-3 font-semibold" style={{ color: '#1a4a5a' }}>
                      {row.factor}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#555' }}>
                      {row.with}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#555' }}>
                      {row.without}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PEOPLE ALSO ASK */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#1a4a5a' }}>
            People Also Ask
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How long do personal injury cases take?',
                a: 'Most personal injury cases take 1-3 years to settle. Simple cases may settle in 6 months, while complex cases can take 5+ years.',
              },
              {
                q: 'Can I sue if I was partially at fault?',
                a: "Yes, in most states. Your settlement is reduced by your percentage of fault. Some states allow recovery even if you're 99% at fault.",
              },
              {
                q: 'What if the defendant has no insurance?',
                a: 'You can still sue. You may recover from your own uninsured motorist coverage or pursue a judgment against the defendant.',
              },
              {
                q: 'Do I have to go to court?',
                a: 'Most cases settle without trial. Only 5-10% of personal injury cases go to trial. Your attorney will advise on your best option.',
              },
              {
                q: 'How much does an attorney cost?',
                a: 'Most personal injury attorneys work on contingency - they take 25-40% of your settlement. You pay nothing upfront.',
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-lg border border-[#e8e2d8] p-4 bg-[#f9f5ef]">
                <h3 className="font-semibold" style={{ color: '#1a4a5a' }}>
                  {item.q}
                </h3>
                <p className="mt-2 text-sm" style={{ color: '#555' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMON MISTAKES */}
      <section className="py-20 px-6 bg-[#f9f5ef]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#1a4a5a' }}>
            Common Mistakes to Avoid
          </h2>
          <div className="space-y-4">
            {[
              'Admitting fault or apologizing at the scene',
              'Posting about your accident on social media',
              'Accepting the first settlement offer',
              'Delaying medical treatment',
              'Signing documents without attorney review',
              'Missing the statute of limitations deadline',
            ].map((mistake, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-lg border border-[#e8e2d8] flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#c4714a' }} />
                <span style={{ color: '#555' }}>{mistake}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION - Click to Expand */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#1a4a5a' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-[#e8e2d8] overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full p-4 bg-[#f9f5ef] hover:bg-[#f0f8f6] transition-all flex items-center justify-between"
                >
                  <h3 className="font-semibold text-left" style={{ color: '#1a4a5a' }}>
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      expandedFAQ === idx ? 'rotate-180' : ''
                    }`}
                    style={{ color: '#4a8c7e' }}
                  />
                </button>
                {expandedFAQ === idx && (
                  <div className="p-4 bg-white border-t border-[#e8e2d8]">
                    <p style={{ color: '#555' }}>{item.answerPlainText}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-[#1a4a5a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Discuss Your Case?</h2>
          <p className="text-lg mb-8 text-gray-200">
            Get a free consultation with an attorney. No upfront cost. We work on contingency.
          </p>
          <a
            href="tel:+18002273669"
            className="inline-flex items-center gap-2 bg-[#c4714a] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#d4855e] transition-all shadow-lg"
          >
            Call Now: 1-800-227-3669
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* FOOTER - 4 Columns */}
      <footer className="py-12 px-6 bg-[#0f2e3a]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4 text-white">CasePort</h3>
              <p className="text-sm text-gray-400">
                The authoritative source for personal injury law. Attorney-reviewed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Guides</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/guide/car-accident" className="hover:text-white transition">
                    Car Accident
                  </a>
                </li>
                <li>
                  <a href="/guide/slip-and-fall" className="hover:text-white transition">
                    Slip & Fall
                  </a>
                </li>
                <li>
                  <a href="/guide/truck-accident" className="hover:text-white transition">
                    Truck Accident
                  </a>
                </li>
                <li>
                  <a href="/guide/medical-malpractice" className="hover:text-white transition">
                    Medical Malpractice
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">More Guides</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/guide/workplace-injury" className="hover:text-white transition">
                    Workplace Injury
                  </a>
                </li>
                <li>
                  <a href="/guide/motorcycle-accident" className="hover:text-white transition">
                    Motorcycle Accident
                  </a>
                </li>
                <li>
                  <a href="/guide/pedestrian-accident" className="hover:text-white transition">
                    Pedestrian Accident
                  </a>
                </li>
                <li>
                  <a href="/guide/dog-bite" className="hover:text-white transition">
                    Dog Bite
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="tel:+18002273669" className="hover:text-white transition">
                    1-800-227-3669
                  </a>
                </li>
                <li>
                  <a href="/guide/wrongful-death" className="hover:text-white transition">
                    Wrongful Death
                  </a>
                </li>
                <li>
                  <a href="/guide/rideshare-accident" className="hover:text-white transition">
                    Rideshare Accident
                  </a>
                </li>
                <li>
                  <a href="/guide/insurance-claim" className="hover:text-white transition">
                    Insurance Claims
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 CasePort.io. All rights reserved. Attorney-Reviewed. ABA Compliant.</p>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 sm:hidden z-30 p-4 bg-[#1a4a5a]"
        style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.15)' }}
      >
        <a
          href="/case-review"
          className="block w-full text-center bg-[#c4714a] text-white font-bold py-3 rounded-lg"
        >
          Free Case Review
        </a>
      </div>
    </div>
  )
}