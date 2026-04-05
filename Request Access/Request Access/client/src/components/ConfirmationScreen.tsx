/**
 * CasePort Confirmation Screen
 * 
 * READABILITY: Headline 26-30px, body 16-17px, card text 15-16px
 * All text minimum /30 contrast on ivory background
 * Enhanced success animation and visual hierarchy
 * ABA-compliant disclaimer in footer
 * Mobile: footer stacks vertically, no overlap
 */

import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Clock, CheckCircle2, Wallet } from 'lucide-react';

const NEXT_STEPS = [
  {
    icon: Clock,
    label: 'Manual review',
    detail: 'Our team evaluates your firm against current network standards. Typically 24–48 business hours.',
  },
  {
    icon: CheckCircle2,
    label: 'Decision notification',
    detail: 'You will receive a separate email with the outcome. If approved, onboarding instructions follow immediately.',
  },
  {
    icon: Wallet,
    label: 'Pre-funding & activation',
    detail: 'Approved firms complete a brief onboarding call and set up a pre-funded wallet before case flow begins. No manual invoicing.',
  },
];

export function ConfirmationScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="min-h-screen flex flex-col"
      style={{
        background: '#F5F1EC',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Header */}
      <header className="px-5 sm:px-8 pt-6 pb-3">
        <div className="max-w-5xl mx-auto">
          <a
            href="https://caseport.io"
            className="text-[#0A0E17]/65 text-[17px] font-bold tracking-[0.14em] hover:opacity-70 transition-opacity duration-300"
            style={{ fontFamily: 'var(--font-geist)' }}
          >
            CASEPORT
          </a>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10 sm:py-12">
        <div className="max-w-lg w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-[#0A0E17]/[0.06] flex items-center justify-center mx-auto mb-8"
            >
              <ShieldCheck className="w-7 h-7 text-[#0A0E17]/35" />
            </motion.div>

            {/* Headline */}
            <h2
              className="text-[24px] sm:text-[30px] font-semibold text-[#0A0E17] mb-5 leading-snug"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              Request received.<br />
              Your application is now under review.
            </h2>

            {/* Body */}
            <p
              className="text-[15px] sm:text-[17px] text-[#0A0E17]/65 leading-relaxed mb-10 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              We are reviewing your submission against current market fit, response capability, and operating readiness. This process is intentionally selective — it protects case quality for every firm in the network.
            </p>
          </motion.div>

          {/* What happens next — structured steps */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl p-6 sm:p-7 mb-8"
            style={{
              background: 'rgba(255, 255, 255, 0.55)',
              border: '1px solid rgba(10, 14, 23, 0.06)',
            }}
          >
            <h3
              className="text-[#0A0E17]/35 mb-5"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase' }}
            >
              What Happens Next
            </h3>
            <div className="space-y-5">
              {NEXT_STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(10, 14, 23, 0.05)' }}
                  >
                    <step.icon className="w-3.5 h-3.5 text-[#0A0E17]/40" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-[14px] font-semibold text-[#0A0E17]/70 mb-0.5"
                      style={{ fontFamily: 'var(--font-geist)' }}
                    >
                      {step.label}
                    </p>
                    <p
                      className="text-[13px] text-[#0A0E17]/55 leading-relaxed"
                      style={{ fontFamily: 'var(--font-geist)' }}
                    >
                      {step.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-center text-[13px] text-[#0A0E17]/50 mb-8"
            style={{ fontFamily: 'var(--font-geist)' }}
          >
            Applications are reviewed manually. Not all firms are accepted.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="flex flex-col items-center gap-5"
          >
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://caseport.io/insights"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl
                         bg-[#0A0E17] text-white text-[15px] font-semibold
                         hover:bg-[#0A0E17]/85 transition-all duration-250
                         shadow-[0_4px_20px_rgba(10,14,23,0.15)]
                         hover:shadow-[0_8px_32px_rgba(10,14,23,0.2)]"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              Explore Insights
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <a
              href="https://caseport.io"
              className="text-[14px] text-[#0A0E17]/60 hover:text-[#0A0E17]/75 transition-colors duration-200 underline decoration-[#0A0E17]/20 underline-offset-3"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              Return to CasePort.io
            </a>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-5 sm:px-8 py-5 border-t border-[#0A0E17]/[0.05]">
        <div className="max-w-5xl mx-auto">
          {/* ABA compliance disclaimer */}
          <p
            className="text-center text-[11px] text-[#0A0E17]/40 leading-relaxed mb-4 max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-geist)' }}
          >
            CasePort is a case acquisition platform, not a law firm. This application does not constitute an attorney-client relationship. CasePort does not pay referral fees to attorneys or accept referral fees from attorneys. All case flow arrangements comply with applicable state bar rules and professional responsibility guidelines. Submission does not guarantee approval, market access, or case volume.
          </p>
          {/* Brand + links — stacks on mobile to prevent overlap */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <span
              className="text-[#0A0E17]/40 text-center sm:text-left"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              CasePort — Case Flow Without Guesswork
            </span>
            <div className="flex items-center justify-center sm:justify-end gap-5">
              <a
                href="https://caseport.io/privacy"
                className="text-[#0A0E17]/40 hover:text-[#0A0E17]/60 transition-colors duration-200"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                Privacy
              </a>
              <a
                href="https://caseport.io/terms"
                className="text-[#0A0E17]/40 hover:text-[#0A0E17]/60 transition-colors duration-200"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
