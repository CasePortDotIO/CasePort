import React, { useState } from 'react';
import { Clock, AlertCircle, CheckCircle, ArrowRight, ChevronDown, Phone, MessageCircle } from 'lucide-react';

export default function InjuredPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const testimonials = [
    {
      name: "Sarah M.",
      injury: "Car Accident - Spinal Injury",
      settlement: "$285,000",
      quote: "I was terrified after my accident. The team walked me through every step and got me a settlement that changed my life."
    },
    {
      name: "James T.",
      injury: "Slip & Fall - Broken Leg",
      settlement: "$125,000",
      quote: "I thought my case was worthless. They showed me exactly how much it was worth and delivered results."
    },
    {
      name: "Maria L.",
      injury: "Truck Accident - Multiple Fractures",
      settlement: "$450,000",
      quote: "Professional, compassionate, and results-driven. They treated my case like it was their own."
    }
  ];

  const processSteps = [
    { number: 1, title: "Free Consultation", description: "Tell us about your injury. No obligation. No upfront cost." },
    { number: 2, title: "Investigation", description: "We gather evidence, medical records, and build your case." },
    { number: 3, title: "Negotiation", description: "We negotiate with insurance companies for maximum value." },
    { number: 4, title: "Settlement or Trial", description: "We settle when it makes sense or take your case to trial." },
    { number: 5, title: "You Get Paid", description: "You receive your settlement. We take our fee from the proceeds." }
  ];

  const faqItems = [
    {
      question: "What if I can't afford an attorney?",
      answer: "You don't have to. We work on contingency, which means you pay nothing upfront. We only get paid if you win. This aligns our interests with yours."
    },
    {
      question: "How quickly can I get help?",
      answer: "Call us today for a free consultation. We can often review your case within 24 hours and start working immediately. Time is critical in personal injury cases."
    },
    {
      question: "What if I'm partially at fault?",
      answer: "You can still recover damages in most states. Your recovery is reduced by your percentage of fault. For example, if you're 20% at fault, you recover 80% of damages."
    },
    {
      question: "How long will my case take?",
      answer: "Simple cases typically settle in 3-6 months. Complex cases can take 1-3 years. We never rush settlements—we fight for maximum value."
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1ED' }}>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <h1 className="text-6xl sm:text-7xl font-bold mb-6 leading-tight" style={{ color: '#1F4D5C' }}>
            You've Been Injured. We Know What to Do.
          </h1>
          
          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#5A6B73' }}>
            You're confused. You're in pain. You don't know your rights. We've helped thousands of injured people get the compensation they deserve. Let us help you too.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="px-8 py-4 text-white rounded-lg font-semibold transition hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: '#C4714A' }}>
              <Phone size={20} />
              Call Now: 1-800-227-3669
            </button>
            <button className="px-8 py-4 rounded-lg font-semibold transition hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: '#FFFFFF', color: '#1F4D5C', border: '2px solid #1F4D5C' }}>
              <MessageCircle size={20} />
              Chat with Attorney
            </button>
          </div>

          <div className="flex items-center gap-2 p-4 rounded-lg" style={{ backgroundColor: '#E8F3F5' }}>
            <CheckCircle size={20} style={{ color: '#4A9BA8' }} />
            <span style={{ color: '#1F4D5C' }}>Free consultation. No upfront cost. We work on contingency.</span>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Statute of Limitations */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: '#FFF4F1', border: '2px solid #E8A89A' }}>
            <div className="flex items-center gap-3 mb-4">
              <Clock size={24} style={{ color: '#C4714A' }} />
              <h3 className="text-xl font-bold" style={{ color: '#1F4D5C' }}>Statute of Limitations</h3>
            </div>
            <p className="mb-4" style={{ color: '#5A6B73' }}>
              You have a legal deadline to file your case. In most states, it's 2-3 years from the date of injury. Missing this deadline means you permanently lose your right to sue.
            </p>
            <p className="text-sm font-semibold" style={{ color: '#C4714A' }}>
              Don't wait. Call today.
            </p>
          </div>

          {/* Evidence Disappears */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: '#FFF4F1', border: '2px solid #E8A89A' }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} style={{ color: '#C4714A' }} />
              <h3 className="text-xl font-bold" style={{ color: '#1F4D5C' }}>Evidence Disappears</h3>
            </div>
            <p className="mb-4" style={{ color: '#5A6B73' }}>
              Witness memories fade. Security footage gets deleted. Medical evidence becomes harder to obtain. The sooner you act, the stronger your case becomes.
            </p>
            <p className="text-sm font-semibold" style={{ color: '#C4714A' }}>
              Every day matters.
            </p>
          </div>

          {/* Early Action Pays */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: '#FFF4F1', border: '2px solid #E8A89A' }}>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={24} style={{ color: '#C4714A' }} />
              <h3 className="text-xl font-bold" style={{ color: '#1F4D5C' }}>Early Action Pays</h3>
            </div>
            <p className="mb-4" style={{ color: '#5A6B73' }}>
              Cases that start early settle for more. Insurance companies know when you're desperate. We build your case from day one to maximize your settlement.
            </p>
            <p className="text-sm font-semibold" style={{ color: '#C4714A' }}>
              Act now, get more.
            </p>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-16" style={{ color: '#1F4D5C' }}>What Happens Next</h2>

        <div className="grid md:grid-cols-5 gap-4 mb-12">
          {processSteps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D9D0' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg" style={{ backgroundColor: '#E8F3F5', color: '#4A9BA8' }}>
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#1F4D5C' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: '#5A6B73' }}>{step.description}</p>
              </div>
              {idx < processSteps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <ArrowRight size={20} style={{ color: '#4A9BA8' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: '#1F4D5C' }}>
          <p className="text-lg mb-6 text-white">
            This process removes the fear and uncertainty. You'll know exactly what to expect at every step.
          </p>
          <button className="px-8 py-4 text-white rounded-lg font-semibold transition hover:opacity-90" style={{ backgroundColor: '#C4714A' }}>
            Start Your Free Consultation
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-16" style={{ color: '#1F4D5C' }}>Real Results from Real People</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="rounded-2xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D9D0' }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#C4714A' }}>★</span>
                ))}
              </div>
              <p className="mb-6" style={{ color: '#5A6B73' }}>"{testimonial.quote}"</p>
              <div style={{ borderTop: '1px solid #E0D9D0' }}>
                <p className="mt-4 font-semibold" style={{ color: '#1F4D5C' }}>{testimonial.name}</p>
                <p className="text-sm" style={{ color: '#5A6B73' }}>{testimonial.injury}</p>
                <p className="text-sm font-semibold" style={{ color: '#4A9BA8' }}>Settlement: {testimonial.settlement}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-16" style={{ color: '#1F4D5C' }}>Why Injured People Choose Us</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Award-Winning", description: "$500M+ in settlements recovered for our clients" },
            { title: "Attorney-Reviewed", description: "Every guide and recommendation reviewed by licensed attorneys" },
            { title: "ABA Compliant", description: "All marketing and practices comply with ABA rules" },
            { title: "Confidential", description: "Your privacy is protected. We never share your information." },
            { title: "24/7 Available", description: "Call us anytime. We're here when you need us." },
            { title: "No Upfront Cost", description: "We work on contingency. You pay nothing unless you win." }
          ].map((signal, idx) => (
            <div key={idx} className="rounded-2xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D9D0' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#E8F3F5' }}>
                <CheckCircle size={24} style={{ color: '#4A9BA8' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F4D5C' }}>{signal.title}</h3>
              <p style={{ color: '#5A6B73' }}>{signal.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-16" style={{ color: '#1F4D5C' }}>Common Questions</h2>

        <div className="space-y-4 max-w-3xl mx-auto">
          {faqItems.map((item, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D9D0' }}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-semibold text-left" style={{ color: '#1F4D5C' }}>{item.question}</h3>
                <ChevronDown
                  size={20}
                  className="flex-shrink-0 transition"
                  style={{ color: '#5A6B73', transform: expandedFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {expandedFaq === idx && (
                <div className="px-6 py-4" style={{ backgroundColor: '#FAFAF8', borderTop: '1px solid #E0D9D0' }}>
                  <p className="leading-relaxed" style={{ color: '#5A6B73' }}>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: '#1F4D5C' }}>
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Get Help?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
            Don't navigate this alone. Call us today for a free consultation. We'll review your case and tell you exactly what it's worth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 text-white rounded-lg font-semibold transition hover:opacity-90" style={{ backgroundColor: '#C4714A' }}>
              Call Now: 1-800-227-3669
            </button>
            <button className="px-8 py-4 rounded-lg font-semibold transition hover:opacity-90 text-white" style={{ backgroundColor: 'transparent', border: '2px solid white' }}>
              Chat with Attorney
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#1F4D5C' }}>
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-300">
          <p>&copy; 2026 CasePort.io. All rights reserved. Attorney-Reviewed. ABA Compliant.</p>
        </div>
      </footer>
    </div>
  );
}
