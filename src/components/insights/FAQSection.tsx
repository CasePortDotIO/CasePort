'use client'
/*
  DESIGN: "The Observatory" — FAQ Section
  Visible FAQ for SEO/AEO — conversational voice-search patterns
  Uses semantic HTML for crawlability
  Fonts: Space Grotesk (headings), Geist Sans (body)
  WORLD-CLASS: Generous whitespace, large type, high contrast
*/

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={`fade-up ${isVisible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

const faqs = [
  {
    question: "What is a case acquisition system?",
    answer:
      "A case acquisition system is a structured infrastructure that helps personal injury law firms attract, qualify, route, and retain cases through disciplined processes. Unlike traditional lead buying, it controls the full path from demand generation through intake to signed retainer, maximizing retained case value at every stage.",
  },
  {
    question: "How do personal injury law firms get car accident cases?",
    answer:
      "Firms acquire car accident cases through paid search advertising, organic SEO, local service ads, referral networks, and case acquisition platforms. The most effective firms combine owned visibility through search optimization with structured intake systems that minimize response delay and maximize conversion from inquiry to signed retainer.",
  },
  {
    question: "What is the difference between SEO and GEO for lawyers?",
    answer:
      "SEO focuses on ranking in traditional organic search results. GEO (Generative Engine Optimization) focuses on making content retrievable and citable by AI answer engines like Google SGE, Bing Copilot, and Perplexity. Both are important for personal injury firms — SEO captures high-intent local searches, while GEO ensures visibility in AI-generated answers.",
  },
  {
    question: "How much do personal injury leads cost?",
    answer:
      "Costs vary by market and channel. Exclusive auto accident leads typically range from $150 to $500+ per lead. However, cost-per-lead is less meaningful than cost-per-signed-case, which factors in intake conversion rates and qualification standards. Markets with higher competition tend to see rising acquisition costs over time. Results vary based on market, practice area, and firm capacity.",
  },
  {
    question: "How can law firms improve intake conversion rates?",
    answer:
      "The most impactful improvement is response speed — firms that respond within minutes convert at significantly higher rates. Additional improvements include implementing structured qualification scripts, establishing clear routing protocols, training intake staff on empathetic communication, and tracking conversion metrics at each stage of the intake funnel.",
  },
  {
    question: "What is AEO and why does it matter for law firms?",
    answer:
      "AEO (Answer Engine Optimization) is the practice of structuring content so AI systems can easily retrieve, summarize, and cite it when answering user queries. For law firms, AEO matters because an increasing share of potential clients are getting answers from AI assistants rather than traditional search results. Firms that optimize for AEO appear in AI-generated responses to questions about legal services.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-32 lg:py-44" aria-labelledby="faq-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] to-[#0B1120]" />

      <div className="container relative z-10 max-w-[840px]">
        <Reveal>
          <span className="system-label text-cp-text-muted mb-5 block">Frequently Asked</span>
          <h2
            id="faq-heading"
            className="text-[36px] lg:text-[44px] font-bold text-cp-text-primary tracking-[-0.02em] mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-cp-cyan">&bull;</span> Questions We Hear Often
          </h2>
          <p className="text-[17px] text-cp-text-muted leading-[1.8] mb-16">
            Answers structured for people, search engines, and AI retrieval systems.
          </p>
        </Reveal>

        <div className="space-y-5" role="list" itemScope itemType="https://schema.org/FAQPage">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div
                className="glass-panel overflow-hidden"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                role="listitem"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-7 lg:p-8 text-left group"
                  aria-expanded={openIndex === i}
                >
                  <h3
                    itemProp="name"
                    className="text-[17px] lg:text-[18px] font-semibold text-cp-text-primary pr-6 group-hover:text-cp-cyan transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={20}
                    className={`text-cp-text-muted transition-transform duration-300 flex-shrink-0 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div className="px-7 pb-8 lg:px-8 lg:pb-9">
                    <p
                      itemProp="text"
                      className="text-[16px] text-cp-text-secondary leading-[1.85]"
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

