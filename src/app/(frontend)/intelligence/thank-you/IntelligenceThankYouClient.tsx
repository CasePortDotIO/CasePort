'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Mail, Lock } from 'lucide-react'

/**
 * CasePort Intelligence Thank-You Page
 *
 * Premium confirmation page for Intelligence subscribers.
 * Confirms subscription, reinforces selectivity, directs to next best action.
 * Keeps user inside CasePort ecosystem.
 */
export default function IntelligenceThankYouPage() {
  const router = useRouter()
  const [showSampleModal, setShowSampleModal] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── STRIPPED HEADER ── */}
      <header className="border-b border-gray-800/50 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="font-bold text-lg text-white tracking-wider">CASEPORT</div>
          <button
            onClick={() => router.push('/intelligence')}
            className="text-xs text-gray-400 hover:text-cyan-400 transition-colors duration-200"
          >
            ← Back to Intelligence
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1">
        {/* SECTION 1: MAIN CONFIRMATION */}
        <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-background to-purple-950/5">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              You&#39;re in.
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Your first intelligence brief is on the way.
            </p>

            <p className="text-base text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              CasePort Intelligence is built for serious PI firms that care about intake leakage,
              qualification, routing, recovery, and signed-case conversion.
            </p>

            <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
              You now have access to a sharper layer of insight most firms never build around.
            </p>
          </div>
        </section>

        {/* SECTION 2: PREMIUM CONFIRMATION CARD */}
        <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-purple-950/5 to-background">
          <div className="max-w-2xl mx-auto">
            <div className="card-featured p-8 md:p-12 border-cyan-500/40 shadow-lg shadow-cyan-500/15 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
              <div className="text-eyebrow mb-6 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                WHAT YOU&#39;VE JOINED
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                Weekly operator-level briefings
              </h2>

              <div className="space-y-5">
                {[
                  {
                    title: 'Weekly operator-level briefings',
                    desc: 'Intelligence on case flow, intake, and conversion',
                  },
                  {
                    title: 'Insight built for serious PI firms',
                    desc: 'Select public access. Full value delivered through the brief',
                  },
                  {
                    title: 'No fluff. No broad legal newsletter.',
                    desc: 'Focused, practical, operator-focused content',
                  },
                  {
                    title: 'Selective access. Serious firms only.',
                    desc: 'Built for firms that think beyond raw lead volume',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: NEXT STEPS */}
        <section className="py-20 md:py-32 px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              What happens next
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Check your inbox',
                  desc: 'Look for your first email from CasePort Intelligence.',
                },
                {
                  step: '2',
                  title: 'Read the sample memo',
                  desc: 'See the kind of operator-level thinking you&#39;ll be receiving.',
                },
                {
                  step: '3',
                  title: 'Stay close to the signal',
                  desc: 'Future briefs will focus on intake leakage, qualification discipline, routing control, recovery, and signed-case economics.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: SAMPLE MEMO PREVIEW */}
        <section
          id="sample-memo-section"
          className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-background to-cyan-950/5"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Start with a sample memo
            </h2>

            <div className="card-featured p-8 md:p-10 border-cyan-500/40 shadow-lg shadow-cyan-500/15">
              <div className="text-eyebrow mb-4">SAMPLE MEMO</div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                The First 10 Minutes Quietly Decide More Than Most Firms Realize
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Most firms think the fight starts with lead generation. It does not.
              </p>

              <p className="text-gray-300 mb-8 leading-relaxed">
                The real separation often begins in the first few minutes after the inquiry lands.
                Speed alone is not enough. The winning firms combine speed with the right follow-up
                structure, the right intake posture, and the right qualification sequence.
              </p>

              <button
                onClick={() => setShowSampleModal(true)}
                className="w-full px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                Read sample memo
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Short, practical, operator-focused. No fluff. No generic legal newsletter content.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: SOFT BRIDGE TO CASEPORT */}
        <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-cyan-950/5 to-background">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Insight is only the beginning.
            </h2>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              CasePort Intelligence helps firms think more sharply.
            </p>

            <p className="text-base text-gray-400 mb-12 leading-relaxed">
              CasePort exists for firms that want more control over case acquisition, qualification,
              routing, and recovery. If you want to see the broader system, there is a next step.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowSampleModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                Read a Sample Memo
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 border border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400/10 hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
              >
                Explore CasePort
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              Built for serious PI firms. No fluff. No broad legal newsletter.
            </p>
          </div>
        </section>
      </main>

      {/* ── MINIMAL FOOTER ── */}
      <footer className="border-t border-gray-800/50 py-8 px-4 md:px-8 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 CasePort. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Compliance
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── SAMPLE MEMO MODAL ── */}
      {showSampleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20">
            <div className="sticky top-0 flex justify-end p-4 bg-gray-900 border-b border-gray-800/50">
              <button
                onClick={() => setShowSampleModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8 md:p-10">
              <div className="text-eyebrow mb-4">SAMPLE MEMO</div>
              <h2 className="text-3xl font-bold text-white mb-6">The First 10 Minutes</h2>

              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>Most firms think the fight starts with lead generation. It does not.</p>
                <p>
                  The real separation often begins in the first few minutes after the inquiry lands.
                  Speed alone is not enough. The winning firms combine speed with the right
                  follow-up structure, the right intake posture, and the right qualification
                  sequence.
                </p>
                <p>That is where signed-case economics start changing.</p>
                <p>
                  The firms that move fastest on qualified inquiries are not necessarily the ones
                  with the most leads. They are the ones with the tightest intake process. They have
                  pre-qualified their own team. They know exactly what they are looking for. They
                  have a response protocol that does not break under pressure.
                </p>
                <p>Want the full briefing? Subscribe below.</p>
              </div>

              <button
                onClick={() => setShowSampleModal(false)}
                className="mt-8 w-full px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300"
              >
                Subscribe to Intelligence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
