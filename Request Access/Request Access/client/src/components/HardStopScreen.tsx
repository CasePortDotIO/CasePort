/**
 * CasePort Hard Stop Screen — With Recovery Path
 * 
 * - Waitlist join: email + firm name → stored in DB via tRPC
 * - Referral CTA: "Know a firm that qualifies? Refer them."
 * - Calm, restrained tone — not punitive
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldX, ArrowRight, Bell, Users, CheckCircle2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface HardStopScreenProps {
  message: string;
  support?: string | null;
  hardStopReason?: string;
}

export function HardStopScreen({ message, support, hardStopReason }: HardStopScreenProps) {
  const [email, setEmail] = useState('');
  const [firmName, setFirmName] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  const joinWaitlist = trpc.application.joinWaitlist.useMutation({
    onSuccess: () => {
      setWaitlistJoined(true);
      setWaitlistError('');
    },
    onError: (err: { message?: string }) => {
      setWaitlistError(err.message || 'Something went wrong. Please try again.');
    },
  });

  const handleWaitlist = () => {
    if (!email || !email.includes('@')) {
      setWaitlistError('Please enter a valid email address.');
      return;
    }
    joinWaitlist.mutate({
      email,
      firmName: firmName || undefined,
      hardStopReason: hardStopReason || undefined,
    });
  };

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
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12">
        <div className="max-w-lg w-full">

          {/* Icon + headline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-[#0A0E17]/[0.05] flex items-center justify-center mx-auto mb-7"
            >
              <ShieldX className="w-7 h-7 text-[#0A0E17]/25" />
            </motion.div>

            <h2
              className="text-[24px] sm:text-[28px] font-semibold text-[#0A0E17] mb-4 leading-snug"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              Not the Right Fit — Yet
            </h2>

            <p
              className="text-[16px] sm:text-[17px] text-[#0A0E17]/65 leading-relaxed mb-4 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              {message}
            </p>

            {support && (
              <p
                className="text-[14px] sm:text-[15px] text-[#0A0E17]/50 leading-relaxed max-w-sm mx-auto"
                style={{ fontFamily: 'var(--font-geist)' }}
              >
                {support}
              </p>
            )}
          </motion.div>

          {/* Recovery options */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.45 }}
            className="space-y-4"
          >

            {/* Waitlist card */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(10, 14, 23, 0.04)',
                border: '1px solid rgba(10, 14, 23, 0.08)',
              }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <Bell className="w-4 h-4 text-[#0A0E17]/50" />
                <h3
                  className="text-[15px] font-semibold text-[#0A0E17]/80"
                  style={{ fontFamily: 'var(--font-geist)' }}
                >
                  Join the Waitlist
                </h3>
              </div>
              <p
                className="text-[13px] text-[#0A0E17]/55 mb-5 leading-relaxed"
                style={{ fontFamily: 'var(--font-geist)' }}
              >
                Eligibility criteria evolve as we expand markets and capacity. We'll notify you directly when your firm may qualify.
              </p>

              <AnimatePresence mode="wait">
                {!waitlistJoined ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Firm name (optional)"
                      value={firmName}
                      onChange={e => setFirmName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-[14px] text-[#0A0E17] placeholder-[#0A0E17]/25 outline-none transition-all duration-200"
                      style={{
                        fontFamily: 'var(--font-geist)',
                        background: 'rgba(10, 14, 23, 0.04)',
                        border: '1px solid rgba(10, 14, 23, 0.1)',
                      }}
                      onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(10, 14, 23, 0.25)'; }}
                      onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(10, 14, 23, 0.1)'; }}
                    />
                    <input
                      type="email"
                      placeholder="Work email address *"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-[14px] text-[#0A0E17] placeholder-[#0A0E17]/25 outline-none transition-all duration-200"
                      style={{
                        fontFamily: 'var(--font-geist)',
                        background: 'rgba(10, 14, 23, 0.04)',
                        border: `1px solid ${waitlistError ? 'rgba(239,68,68,0.4)' : 'rgba(10, 14, 23, 0.1)'}`,
                      }}
                      onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(10, 14, 23, 0.25)'; }}
                      onBlur={e => { (e.target as HTMLElement).style.borderColor = waitlistError ? 'rgba(239,68,68,0.4)' : 'rgba(10, 14, 23, 0.1)'; }}
                      onKeyDown={e => { if (e.key === 'Enter') handleWaitlist(); }}
                    />
                    {waitlistError && (
                      <p className="text-[12px] text-red-500/70" style={{ fontFamily: 'var(--font-geist)' }}>
                        {waitlistError}
                      </p>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleWaitlist}
                      disabled={joinWaitlist.isPending}
                      className="w-full py-3 rounded-xl text-[14px] font-semibold text-white transition-all duration-200 disabled:opacity-60"
                      style={{
                        fontFamily: 'var(--font-geist)',
                        background: '#0A0E17',
                      }}
                    >
                      {joinWaitlist.isPending ? 'Saving...' : 'Notify Me When I Qualify'}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 py-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500/70 flex-shrink-0" />
                    <p
                      className="text-[14px] text-[#0A0E17]/55 leading-snug"
                      style={{ fontFamily: 'var(--font-geist)' }}
                    >
                      You're on the list. We'll reach out when your firm may qualify.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Referral card */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(10, 14, 23, 0.025)',
                border: '1px solid rgba(10, 14, 23, 0.06)',
              }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <Users className="w-4 h-4 text-[#0A0E17]/30" />
                <h3
                  className="text-[15px] font-semibold text-[#0A0E17]/60"
                  style={{ fontFamily: 'var(--font-geist)' }}
                >
                  Know a Firm That Qualifies?
                </h3>
              </div>
              <p
                className="text-[13px] text-[#0A0E17]/50 mb-4 leading-relaxed"
                style={{ fontFamily: 'var(--font-geist)' }}
              >
                If you know a PI firm that runs a high-volume, disciplined intake operation, send them our way.
              </p>
              <motion.a
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                href="mailto:?subject=CasePort%20Private%20Access&body=I%20thought%20your%20firm%20might%20qualify%20for%20CasePort%3A%20https%3A%2F%2Fcaseport.io"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-[#0A0E17]/65 hover:text-[#0A0E17]/80 transition-colors duration-200"
                style={{ fontFamily: 'var(--font-geist)' }}
              >
                Share via email
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            </div>

            {/* Return CTA */}
            <div className="text-center pt-2">
              <motion.a
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                href="https://caseport.io"
                className="inline-flex items-center gap-2 text-[13px] text-[#0A0E17]/50 hover:text-[#0A0E17]/70 transition-colors duration-200"
                style={{ fontFamily: 'var(--font-geist)' }}
              >
                Return to CasePort.io
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            </div>
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
            CasePort is a case acquisition platform, not a law firm. This does not constitute an attorney-client relationship. No referral fees paid to or accepted from attorneys. All arrangements comply with applicable state bar rules.
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
