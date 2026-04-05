import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  const [leads, setLeads] = useState(20);
  const [caseValue, setCaseValue] = useState(75000);
  const [conversionRate, setConversionRate] = useState(15);

  const potentialGain = (leads * caseValue * (conversionRate / 100) * 12).toLocaleString();

  const faqs = [
    {
      question: "How is CasePort different from other lead generation companies?",
      answer: "Most lead generation companies sell volume to multiple firms. CasePort is market-capped, meaning we limit access to 50 firms per market for exclusivity. We also implement a review-first onboarding process and enforce verified intake standards.",
    },
    {
      question: "What happens if the leads do not convert?",
      answer: "We have a structured recovery protocol. If leads don't convert within our expected timeframe, we have automated follow-up systems and re-engagement sequences to maximize conversion.",
    },
    {
      question: "How do you qualify opportunities before routing them?",
      answer: "We use a 6-layer qualification screening process that includes intent verification, case viability assessment, firm fit analysis, and market protection checks.",
    },
    {
      question: "What does 'market-capped' actually mean?",
      answer: "Market-capped means we limit the number of firms in each geographic market who have access to our leads. This ensures exclusivity and reduces competition for cases.",
    },
    {
      question: "Can I see the system before committing?",
      answer: "Yes. We offer a private demo where you can see the Case Flow Engine in action, review sample leads, and understand how our qualification process works.",
    },
    {
      question: "Why should I trust a new company in this space?",
      answer: "We're built by operators who understand PI law. Our team has 50+ years combined experience in case acquisition, intake optimization, and legal operations.",
    },
    {
      question: "What is the pricing model?",
      answer: "We use a performance-based model. You only pay for qualified leads that meet our standards. No monthly retainers, no volume commitments.",
    },
    {
      question: "How quickly can I expect to see results?",
      answer: "Most firms see measurable results within 30 days. We typically see 8-12% conversion improvement within 90 days.",
    },
  ];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="text-white font-bold text-lg hover:text-cyan-400 transition">
              CASEPORT CASE FLOW WITHOUT GUESSWORK
            </a>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition text-sm">
              For Law Firms
            </a>
            <Link href="/insights">
              <a className="text-gray-300 hover:text-cyan-400 transition text-sm">
                Insights
              </a>
            </Link>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition text-sm">
              Intelligence
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition text-sm">
              Injured?
            </a>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full font-semibold transition text-sm">
              Request Private Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block bg-cyan-500/20 border border-cyan-500/50 rounded-full px-4 py-2 mb-8">
            <p className="text-cyan-400 text-sm font-semibold tracking-wide">
              FOR GROWTH-ORIENTED PERSONAL INJURY LAW FIRMS
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Stop Buying Leads.{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Start Controlling
            </span>{" "}
            Case Flow.
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            CasePort is a premium case acquisition system for personal injury law firms that want more control over demand, intake quality, follow-up, and recovery — without relying on inconsistent channels alone.
          </p>
          <div className="flex gap-4 mb-6">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-semibold transition">
              Request Private Access
            </button>
            <button className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 rounded-full font-semibold transition flex items-center gap-2">
              See How It Works <ArrowRight size={18} />
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            Review-first. Market-capped. Built for firms that care about intake quality.
          </p>
        </div>

        {/* Case Flow Engine Diagram */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">The Case Flow Engine™</h3>
            <span className="text-cyan-400 text-xs font-semibold bg-cyan-500/20 px-3 py-1 rounded-full">
              Private View
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-8">
            A more controlled path from search intent to signed case opportunity
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {["01 Search Intent", "02 Demand Capture", "03 Qualification", "04 Routing", "05 Recovery", "06 Retained Value"].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-cyan-400 font-bold text-sm mb-2">{step.split(" ")[0]}</div>
                <p className="text-gray-400 text-xs">{step.split(" ").slice(1).join(" ")}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <p className="text-gray-400">Protected market signal active</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <p className="text-gray-400">Qualification layer engaged</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <p className="text-gray-400">Review-first access in progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-4 gap-6">
        {[
          { title: "Market-Capped Access", desc: "Limited to 50 firms per market" },
          { title: "Review-First Onboarding", desc: "We vet your firm before access" },
          { title: "Verified Standards", desc: "Intake quality enforced" },
          { title: "Controlled Case Distribution", desc: "Smart routing, no conflicts" },
        ].map((feature, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h4 className="text-white font-bold mb-2">{feature.title}</h4>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Core Message */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-xl mb-4">
          You are not losing case opportunities because there is no demand.
        </p>
        <p className="text-cyan-400 text-3xl font-bold">
          You are losing them because value breaks down after inquiry.
        </p>
      </section>

      {/* Market Intelligence */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-white mb-6">The Opportunity Is Massive</h2>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl">
          The personal injury market is one of the largest and most competitive legal verticals in the United States. The firms that control case flow — not just lead flow — will dominate the next decade.
        </p>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { value: "$39B", label: "U.S. Personal Injury Market" },
            { value: "4M+", label: "Auto Accidents Per Year" },
            { value: "$941", label: "Average Cost Per Lead" },
            { value: "$31K–500K", label: "Average Case Value" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-cyan-400 mb-2">{stat.value}</div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">See Your Potential Gain</h2>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
          <div className="space-y-8 mb-8">
            <div>
              <label className="text-gray-400 text-sm mb-4 block">
                Monthly Leads: <span className="text-cyan-400 font-bold">{leads}</span>
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={leads}
                onChange={(e) => setLeads(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-4 block">
                Average Case Value: <span className="text-cyan-400 font-bold">${caseValue.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={caseValue}
                onChange={(e) => setCaseValue(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-4 block">
                Current Conversion Rate: <span className="text-cyan-400 font-bold">{conversionRate}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-lg p-6 mb-8">
            <p className="text-gray-400 text-sm mb-2">Potential Annual Gain</p>
            <p className="text-4xl font-bold text-cyan-400">${potentialGain}</p>
            <p className="text-gray-500 text-xs mt-2">Based on +8% conversion improvement</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-semibold transition flex-1">
              Request Private Access
            </button>
            <button className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 rounded-full font-semibold transition flex-1">
              Download Free Playbook
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-900/50 hover:bg-slate-900 transition"
              >
                <span className="text-white font-semibold text-left">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-cyan-400 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {expandedFaq === i && (
                <div className="px-6 py-4 bg-slate-950 border-t border-slate-800">
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Control Your Case Flow?</h2>
        <p className="text-gray-400 mb-8">
          Request private access to CasePort. We'll review your firm and get you set up within 48 hours.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-semibold transition">
            Request Private Access
          </button>
          <a href="mailto:access@caseport.io" className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 rounded-full font-semibold transition">
            Email Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition text-sm">For Law Firms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition text-sm">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition text-sm">ROI Projection</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition text-sm">Why CasePort</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition text-sm">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/insights"><a className="text-gray-400 hover:text-cyan-400 transition text-sm">Insights</a></Link></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition text-sm">Intelligence</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition text-sm">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">access@caseport.io</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 CasePort. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
