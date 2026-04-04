'use client'

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, CheckCircle, MapPin, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CityMarketPage() {
  const params = useParams()
  const router = useRouter()
  const cityId = typeof params?.slug === 'string' ? params.slug.toLowerCase() : ''
  const [market, setMarket] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!cityId) return

    fetch(`/api/markets?where[slug][equals]=${cityId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.docs && data.docs.length > 0) {
          setMarket(data.docs[0])
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [cityId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030608]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-t-[#00B4D8] border-b-transparent"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!market) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030608]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-[32px] font-bold text-[#F1F3F5] mb-4">Market Not Found</h1>
          <p className="text-[#B0B8C4] mb-8">
            This market doesn't exist yet. Check the markets list.
          </p>
          <Button
            onClick={() => router.push('/markets')}
            className="bg-[#00B4D8] text-black hover:bg-[#5BB6C9]"
          >
            Back to Markets
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const statusColor = {
    active: '#10B981',
    limited: '#F59E0B',
    capped: '#6B7280',
    evaluation: '#8B5CF6',
  }

  const statusLabel = {
    active: 'Open',
    limited: 'Limited',
    capped: 'Capped',
    evaluation: 'In Review',
  }

  // Use backend data or dynamic defaults
  const headline = market.heroHeadline || `${market.metro || 'Metro'}'s Personal Injury Market`
  const subline =
    market.heroSubline ||
    `Exclusive market access. ${(market.casesAcquiredYearly || 0).toLocaleString()} cases acquired yearly. MII Score: ${market.mii || 0}.`

  const defaultWhyThisMarket = [
    {
      title: 'Consistent Case Flow',
      desc: `${market.metro || 'Metro'} is a key market in the CasePort network. Average settlement: ${market.avgSettlement || '$0'}.`,
    },
    {
      title: 'Qualified Partners Only',
      desc: `${market.maxPartners || 3} firms maximum. No dilution. No competition.`,
    },
    {
      title: 'Pre-Funded Wallet Model',
      desc: 'Only pay for qualified leads. Money stays in your wallet until delivery.',
    },
    {
      title: '15-Minute Response Time',
      desc: 'Access to leads within 15 minutes of qualification. Speed = conversion.',
    },
  ]

  const whyThisMarket =
    market.whyThisMarket && market.whyThisMarket.length > 0
      ? market.whyThisMarket
      : defaultWhyThisMarket

  const defaultFaqs = [
    {
      question: `What's the average case value in ${market.metro}?`,
      answer: `The average settlement range is ${market.avgSettlement}. This varies based on case type and severity.`,
    },
    {
      question: `How many firms are active in ${market.metro}?`,
      answer: `Currently ${market.partnersActive} of ${market.maxPartners} partner slots are active. The market is capped at ${market.maxPartners} firms to maintain lead quality.`,
    },
    {
      question: 'How quickly will I receive leads?',
      answer:
        'Qualified leads are delivered within 15 minutes of your market activation. All leads are pre-qualified based on your contract definition.',
    },
    {
      question: "What if a lead doesn't meet my contract definition?",
      answer:
        "You're not charged. The pre-funded wallet model means you only pay for leads that meet your mutually agreed contract definition. Full transparency.",
    },
    {
      question: `Is ${market.metro} a good market for my firm?`,
      answer: `${market.metro} has ${(market.casesAcquiredYearly || 0).toLocaleString()} cases acquired yearly with an MII score of ${market.mii}. Request a strategy call to determine fit.`,
    },
    {
      question: 'What happens when the market caps?',
      answer:
        'Once all partner slots are filled, the market closes to new applications. You can join the waitlist for priority access if a slot opens.',
    },
  ]

  const faqs = market.faqs && market.faqs.length > 0 ? market.faqs : defaultFaqs

  return (
    <div className="min-h-screen bg-[#030608] selection:bg-[#00B4D8]/30">
      <style>{`
        html { scroll-behavior: smooth; }
      `}</style>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #22D3EE 0%, transparent 50%)',
          }}
        />
        <div className="container max-w-4xl relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-[14px]">
              <Link
                href="/markets"
                className="text-[#6B7280] hover:text-[#B0B8C4] transition-colors"
              >
                Markets
              </Link>
              <span className="text-[#6B7280]">/</span>
              <span className="text-[#F1F3F5] font-medium">{market.metro}</span>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    statusColor[market.status as keyof typeof statusColor] ||
                    statusColor.evaluation,
                }}
              />
              <span className="text-[12px] font-bold text-[#F1F3F5] tracking-widest uppercase">
                {statusLabel[market.status as keyof typeof statusLabel] || market.status}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[36px] sm:text-[48px] font-bold leading-tight mb-6 tracking-tight">
              <span className="text-[#F1F3F5]">{headline}</span>
              <br />
              <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">
                MII Score: {market.mii}.
              </span>
            </h1>

            {/* Subline */}
            <p className="text-[18px] text-[#B0B8C4] mb-8 max-w-[640px] leading-relaxed">
              {subline}
            </p>

            {/* CTA */}
            <Button
              variant="gradient"
              size="lg"
              className="rounded-full shadow-lg shadow-[#00B4D8]/20"
              onClick={() => router.push('/markets')}
            >
              Request Access <ArrowRight size={16} className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 sm:py-20 border-t border-white/[0.04]">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'MII Score', value: market.mii, icon: TrendingUp },
              {
                label: 'Cases/Year',
                value: (market.casesAcquiredYearly || 0).toLocaleString(),
                icon: Briefcase,
              },
              {
                label: 'Active Partners',
                value: `${market.partnersActive}/${market.maxPartners}`,
                icon: Users,
              },
              { label: 'Avg Settlement', value: market.avgSettlement, icon: MapPin },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon size={14} className="text-[#00B4D8]" />
                  <span className="text-[#6B7280] text-[9px] font-mono tracking-wider uppercase">
                    {metric.label}
                  </span>
                </div>
                <span className="text-[20px] font-bold text-[#F1F3F5]">{metric.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Details */}
      <section className="py-16 sm:py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-[28px] font-bold text-[#F1F3F5] mb-8 tracking-tight">
            Market Overview
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8"
            >
              <h3 className="text-[16px] font-bold text-[#F1F3F5] mb-6">Market Intelligence</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                  <span className="text-[#B0B8C4] text-sm">Population:</span>
                  <span className="text-[#F1F3F5] font-semibold text-sm">{market.population}</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                  <span className="text-[#B0B8C4] text-sm">Monthly Search Volume:</span>
                  <span className="text-[#F1F3F5] font-semibold text-sm">
                    {market.monthlySearchVolume}
                  </span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                  <span className="text-[#B0B8C4] text-sm">Response Time:</span>
                  <span className="text-[#F1F3F5] font-semibold text-sm">
                    {market.responseTime}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-[#B0B8C4] text-sm">Market Activated:</span>
                  <span className="text-[#F1F3F5] font-semibold text-sm">
                    {market.activatedDate
                      ? new Date(market.activatedDate).toLocaleDateString()
                      : 'Pending'}
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-center"
            >
              <h3 className="text-[16px] font-bold text-[#F1F3F5] mb-4">Case Value Range</h3>
              <p className="text-[32px] font-bold bg-gradient-to-r from-[#00B4D8] to-[#5BB6C9] bg-clip-text text-transparent mb-4">
                {market.avgCaseValue}
              </p>
              <p className="text-[#B0B8C4] text-sm leading-relaxed mb-6">
                Average settlement range for personal injury cases evaluated in the {market.metro}{' '}
                sector.
              </p>
              {market.testimonial?.quote && (
                <div className="mt-auto pt-6 border-t border-white/[0.06]">
                  <p className="text-[14px] text-[#B0B8C4] italic mb-3 leading-relaxed">
                    "{market.testimonial.quote}"
                  </p>
                  <p className="text-[12px] font-bold text-[#F1F3F5]">
                    — {market.testimonial.author}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why This Market Section */}
      <section className="py-16 sm:py-20 bg-white/[0.01]">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-[28px] font-bold text-[#F1F3F5] mb-8 tracking-tight">
            Why {market.metro}?
          </h2>
          <div className="space-y-4">
            {whyThisMarket.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="flex gap-4 p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:bg-white/[0.04] transition-colors"
              >
                <CheckCircle size={22} className="text-[#00B4D8] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[15px] font-bold text-[#F1F3F5] mb-2">{item.title}</h3>
                  <p className="text-[14px] text-[#B0B8C4] leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* City-Specific FAQ */}
      <section className="py-16 sm:py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-[28px] font-bold text-[#F1F3F5] mb-8 tracking-tight">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((item: any, idx: number) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-2 overflow-hidden hover:bg-white/[0.04] transition-colors data-[state=open]:bg-white/[0.05]"
              >
                <AccordionTrigger className="text-[15px] font-bold text-[#F1F3F5] hover:text-[#00B4D8] hover:no-underline transition-colors py-4 text-left">
                  {item.question || item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#B0B8C4] leading-relaxed pb-4 pt-1">
                  {item.answer || item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container max-w-2xl mx-auto text-center px-4">
          <h2 className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] mb-4 tracking-tight">
            Ready to Access {market.metro}?
          </h2>
          <p className="text-[16px] text-[#B0B8C4] mb-8">
            {market.status === 'capped'
              ? `This market is at capacity. Join the waitlist (Position #${market.waitlistPosition}).`
              : `${market.partnersActive === 0 ? 'All slots available.' : `${market.maxPartners - market.partnersActive} slot${market.maxPartners - market.partnersActive === 1 ? '' : 's'} remaining.`}`}
          </p>
          <Button
            variant="gradient"
            size="lg"
            className="rounded-full shadow-lg shadow-[#00B4D8]/20"
            onClick={() => router.push('/markets')}
          >
            Request Access <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
