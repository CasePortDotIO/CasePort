import React, { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Shield, Lock, CheckCircle, Phone, Calendar } from 'lucide-react';
import { BaltimoreSchema, BaltimoreArticleSchema } from '@/components/BaltimoreSchema';

export default function BaltimoreInjured() {
  const [showForm, setShowForm] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setShowStickyCTA(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BaltimoreSchema />
      <BaltimoreArticleSchema />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">CASEPORT</div>
          <a href="tel:1-800-CASE-NOW" className="text-sm text-muted-foreground hover:text-foreground">
            Questions? 1-800-CASE-NOW
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0A0A0A] to-[#1a1a1a] text-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="space-y-6">
              <div className="inline-block text-sm font-semibold text-[#C9A96E] tracking-wider">
                INJURED IN BALTIMORE?
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight">
                Get Connected to a Maryland Attorney in 2 Minutes
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Baltimore car accidents, truck collisions, and serious injuries require immediate action. We match you with experienced Maryland attorneys who handle personal injury cases. No upfront costs. No obligation.
              </p>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-4 bg-[#C9A96E] text-black font-semibold rounded-lg hover:bg-[#B8956A] transition-colors"
                >
                  Start Secure Case Check
                </button>
                <a
                  href="tel:1-800-CASE-NOW"
                  className="px-8 py-4 border border-[#C9A96E] text-[#C9A96E] font-semibold rounded-lg hover:bg-[#C9A96E]/10 transition-colors"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Right: Preview Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-[#C9A96E]/20 to-transparent rounded-2xl blur-3xl"></div>
              <div className="relative bg-[#1a1a1a] border border-[#C9A96E]/30 rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#C9A96E]">SECURE CASE CHECK</h3>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Ready</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">Guided intake • 5 phases</p>
                <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C9A96E] w-1/3"></div>
                </div>
                <div className="flex gap-2 text-xs text-gray-400">
                  <span className="text-[#C9A96E]">Accident</span>
                  <span>Treatment</span>
                  <span>Fit</span>
                  <span>Documents</span>
                  <span>Contact</span>
                </div>
                <div className="bg-[#0A0A0A] rounded-lg p-6 space-y-4 border border-gray-700">
                  <p className="text-xs text-gray-500">EXAMPLE QUESTION</p>
                  <p className="text-white font-semibold">Where did the accident happen?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 border border-[#C9A96E] text-[#C9A96E] text-sm rounded hover:bg-[#C9A96E]/10">
                      Baltimore
                    </button>
                    <button className="px-3 py-2 border border-gray-600 text-gray-400 text-sm rounded hover:bg-gray-700">
                      Maryland
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    AES-256 Encrypted
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    ~2 min to complete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Trust Bar */}
      <section className="bg-[#0A0A0A] text-white py-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-[#C9A96E]" />
              <div>
                <p className="text-xs text-gray-400">ACTIVE IN</p>
                <p className="font-semibold">Maryland & DC Region</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-700"></div>
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[#C9A96E]" />
              <div>
                <p className="text-xs text-gray-400">MATCHED</p>
                <p className="font-semibold">15,000+ Baltimore Claimants</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-700"></div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#C9A96E]" />
              <div>
                <p className="text-xs text-gray-400">RESPONSE TIME</p>
                <p className="font-semibold">Within 1 Business Day</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Strip */}
      <section className="bg-[#FAF7F2] py-6 border-b border-[#E0D9CC]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center text-sm text-gray-700">
            <p>⚠️ If this is a medical emergency, call 911 now.</p>
            <p className="hidden md:block text-gray-400">|</p>
            <p>Submitting information does not create an attorney-client relationship.</p>
          </div>
        </div>
      </section>

      {/* Baltimore-Specific Context Section */}
      <section className="bg-[#FAF7F2] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#C9A96E] tracking-wider mb-4">WHY BALTIMORE MATTERS</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Baltimore Accident Statistics & Your Rights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Baltimore sees over 15,000 reported traffic accidents annually. Understanding your rights under Maryland law is critical to securing fair compensation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-8 border border-[#E0D9CC] hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#C9A96E]/20 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="text-[#C9A96E]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">I-95 & Inner Harbor Collisions</h3>
              <p className="text-gray-600">
                High-speed accidents on I-95, I-83, and Inner Harbor routes account for 40% of serious injuries in Baltimore. These require specialized legal expertise.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-8 border border-[#E0D9CC] hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#C9A96E]/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-[#C9A96E]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Maryland Comparative Fault Law</h3>
              <p className="text-gray-600">
                Maryland follows a "contributory negligence" rule. You may still recover even if partially at fault, but timing matters. Act within 3 years.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-8 border border-[#E0D9CC] hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#C9A96E]/20 rounded-lg flex items-center justify-center mb-4">
                <Lock className="text-[#C9A96E]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Insurance Company Tactics</h3>
              <p className="text-gray-600">
                Baltimore insurers often contact claimants within hours. Speaking with an attorney first protects your rights and maximizes your settlement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#C9A96E] tracking-wider mb-4">HOW IT WORKS</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Your Path to Fair Compensation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We guide you through a simple process to understand your situation and connect you with the right attorney.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                title: 'Quick Assessment',
                desc: 'Answer 5 simple questions about your accident. Takes 2 minutes. No documents needed yet.'
              },
              {
                num: '2',
                title: 'Attorney Matching',
                desc: 'We match you with a Maryland attorney experienced in your specific injury type and location.'
              },
              {
                num: '3',
                title: 'Direct Connection',
                desc: 'The attorney contacts you within 1 business day. No middlemen. No pressure. Just answers.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#FAF7F2] rounded-xl p-8 border border-[#E0D9CC]">
                <div className="w-12 h-12 bg-[#C9A96E] text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {item.num}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="bg-[#FAF7F2] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#C9A96E] tracking-wider mb-4">YOUR PRIVACY MATTERS</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Clear, Private, and Built to Help You Move Faster
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Lock, label: 'Bank-level encryption', desc: 'AES-256 Encrypted' },
              { icon: Shield, label: 'GDPR & CCPA compliant', desc: 'Your data is protected' },
              { icon: CheckCircle, label: 'SOC 2 Type II certified', desc: 'Independently audited' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white p-6 rounded-lg border border-[#E0D9CC]">
                <item.icon className="text-[#C9A96E]" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#C9A96E] tracking-wider mb-4">COMMON QUESTIONS</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Questions People Often Ask
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'Do I need a lawyer after a Baltimore car accident?',
                a: 'If you have injuries or significant property damage, yes. Insurance companies have teams of lawyers. You should too.'
              },
              {
                q: 'What if I was partly at fault?',
                a: 'Maryland law allows recovery even if you\'re partially at fault. Your compensation is reduced by your percentage of fault.'
              },
              {
                q: 'How soon should I act?',
                a: 'Immediately. The statute of limitations in Maryland is 3 years, but evidence degrades and memories fade. Act within days, not months.'
              },
              {
                q: 'What if the insurance company already called me?',
                a: 'Don\'t give a recorded statement without an attorney. Insurance adjusters are trained to minimize payouts. We protect your interests.'
              },
              {
                q: 'Do I pay anything upfront?',
                a: 'No. We work on contingency. You only pay if we win. No hidden fees. No surprises.'
              }
            ].map((item, i) => (
              <details key={i} className="group border border-[#E0D9CC] rounded-lg p-6 cursor-pointer hover:bg-[#FAF7F2] transition-colors">
                <summary className="flex items-center justify-between font-semibold text-gray-900">
                  {item.q}
                  <ChevronRight className="group-open:rotate-90 transition-transform" size={20} />
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0A0A0A] text-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-serif font-bold">
            See if You Qualify in 2 Minutes
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            No documents needed. No obligation. Just honest answers about your situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-[#C9A96E] text-black font-semibold rounded-lg hover:bg-[#B8956A] transition-colors"
            >
              Start Secure Case Check
            </button>
            <a
              href="tel:1-800-CASE-NOW"
              className="px-8 py-4 border border-[#C9A96E] text-[#C9A96E] font-semibold rounded-lg hover:bg-[#C9A96E]/10 transition-colors"
            >
              Call Now
            </a>
          </div>
          <p className="text-sm text-gray-500 pt-4">
            ⚠️ If this is a medical emergency, call 911 now. | Submitting information does not create an attorney-client relationship.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-gray-800 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-bold text-white mb-4">CASEPORT</p>
              <p className="text-sm">Connecting injured Baltimoreans with experienced Maryland attorneys.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">For Law Firms</a></li>
                <li><a href="#" className="hover:text-white">Insights</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Contact</p>
              <p className="text-sm">
                <a href="tel:1-800-CASE-NOW" className="hover:text-white">1-800-CASE-NOW</a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>© 2026 www.CasePort.io. All rights reserved. | Disclaimer: This is not legal advice.</p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      {showStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-gray-800 p-4 md:hidden z-50 animate-slideUp">
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="flex-1 px-4 py-3 bg-[#C9A96E] text-black font-semibold rounded-lg text-sm"
            >
              Start Case Check
            </button>
            <a
              href="tel:1-800-CASE-NOW"
              className="flex-1 px-4 py-3 border border-[#C9A96E] text-[#C9A96E] font-semibold rounded-lg text-sm text-center"
            >
              Call Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
