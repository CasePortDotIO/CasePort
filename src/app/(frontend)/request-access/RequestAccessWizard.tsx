"use client";
/**
 * CasePort — Request Private Access
 * 
 * Design: "The Command Layer" — Institutional Command Interface
 * 
 * LAYOUT STRATEGY:
 * - Mobile: min-h-screen with natural scroll (no overflow-hidden trap)
 * - Desktop (sm+): h-screen overflow-hidden with internal panel scroll
 * - The form panel is the HERO — it dominates the viewport
 * - A slim intro bar above the form (collapses after first interaction)
 * - The sidebar sits alongside the form panel on desktop only
 * 
 * Typography: Geist Sans (body), JetBrains Mono (system labels)
 * Colors: Navy #0A0E17, Cyan #22D3EE, Gold #F59E0B, Ivory #F5F1EC
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from '@/hooks/useFormState';
import { ProgressBar } from '@/components/request-access/ProgressBar';
import { FormScreen } from '@/components/request-access/FormScreen';
import { EvaluationSidebar } from '@/components/request-access/EvaluationSidebar';
import { HardStopScreen } from '@/components/request-access/HardStopScreen';
import { SoftFailModal } from '@/components/request-access/SoftFailModal';
import { ConfirmationScreen } from '@/components/request-access/ConfirmationScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, RotateCcw } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const {
    state,
    currentScreenConfig,
    currentPhaseIndex,
    totalScreens,
    progressPercent,
    restoredFromSave,
    dismissRestoreNotice,
    resetProgress,
    selectOption,
    setMultiSelect,
    updateContactInfo,
    goNext,
    goBack,
    dismissSoftFail,
      dismissHardStop,
      submitApplication,
    } = useFormState();
  const [heroExpanded, setHeroExpanded] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // Ref for the scrollable form panel — used for scroll-to-top on screen change
  const scrollPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Collapse hero on short viewports or after first interaction
  useEffect(() => {
    if (window.innerHeight < 700 || state.currentScreen > 1 || Object.keys(state.answers).length > 0) {
      setHeroExpanded(false);
    }
  }, [state.currentScreen, state.answers]);

  // Scroll-to-top on every screen transition
  useEffect(() => {
    if (scrollPanelRef.current) {
      scrollPanelRef.current.scrollTop = 0;
    }
    // Also scroll window to top on mobile (where the panel is not fixed-height)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.currentScreen]);

  // Enter key to advance — only on single-choice screens with a selection
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'button') return;

    const screen = currentScreenConfig;
    if (!screen) return;

    if (screen.type === 'single-choice') {
      const selected = state.answers[state.currentScreen];
      if (selected && state.status === 'active') {
        goNext();
      }
    }
  }, [currentScreenConfig, state.answers, state.currentScreen, state.status, goNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Derived submitting state
  const isSubmitting = state.status === 'submitting';
  const submitError = state.submitError ?? null;

  // Hard stop screen
  if (state.status === 'hard-stop' && state.hardStopMessage) {
    return (
      <HardStopScreen
        message={state.hardStopMessage}
        support={state.hardStopSupport}
        hardStopReason={state.hardStopMessage}
        onBack={dismissHardStop}
      />
    );
  }

  // Success screen
  if (state.status === 'submitted') {
    return <ConfirmationScreen />;
  }

  const selectedOption = state.answers[state.currentScreen] as string | undefined;
  const multiSelectValues = (state.answers[state.currentScreen] as string[]) || [];

  return (
    <div
      className="min-h-screen text-[#F1F3F5] overflow-hidden flex flex-col"
      style={{
        background: '#0A0E17',
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Soft fail modal */}
      <SoftFailModal
        message={state.status === 'soft-fail' ? state.softFailMessage : null}
        onDismiss={dismissSoftFail}
      />

      {/* === Background layers === */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, #131B2E 0%, #0A0E17 60%)',
        }}
      />
      <motion.div
        className="fixed pointer-events-none"
        style={{
          width: '700px',
          height: '500px',
          left: '50%',
          top: '30%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.035) 0%, rgba(139,92,246,0.015) 50%, transparent 70%)',
          borderRadius: '50%',
        }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.97, 1.03, 0.97] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* === Header === */}
      <header className="relative z-10 px-5 sm:px-8 py-5 sm:py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[13px] text-white/35 hover:text-white/60 transition-colors duration-200 group group-hover:-translate-x-0.5"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              ← Back
            </button>
            <a
              href="https://caseport.io"
              className="text-[#F1F3F5] font-bold tracking-[0.14em] hover:opacity-70 transition-opacity duration-300"
              style={{ fontFamily: 'var(--font-geist)', fontSize: '17px', fontWeight: 700 }}
            >
              CASEPORT
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 animate-pulse" />
            <span
              className="text-white/40 hidden sm:inline"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}
            >
              Private Access Application
            </span>
          </div>
        </div>
      </header>

      {/* === Restore Banner === */}
      <AnimatePresence>
        {restoredFromSave && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 px-5 sm:px-8 py-2.5 flex-shrink-0"
            style={{ background: 'rgba(34, 211, 238, 0.07)', borderBottom: '1px solid rgba(34, 211, 238, 0.12)' }}
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <RotateCcw className="w-3.5 h-3.5 text-[#22D3EE]/60 flex-shrink-0" />
                <span
                  className="text-[12px] text-[#22D3EE]/70 truncate"
                  style={{ fontFamily: 'var(--font-geist)' }}
                >
                  Your progress has been restored from your last session.
                </span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <button
                  onClick={resetProgress}
                  className="text-[11px] text-white/25 hover:text-white/45 transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                  Start Over
                </button>
                <button
                  onClick={dismissRestoreNotice}
                  className="text-[11px] text-[#22D3EE]/50 hover:text-[#22D3EE]/80 transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                  Continue ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Main === */}
      <main className="relative z-10 flex-1 flex flex-col px-4 sm:px-8 pb-4 sm:pb-5">
        <div className="max-w-6xl mx-auto w-full flex flex-col flex-1">

          {/* Intro bar — ultra-compact single-line, collapses after first interaction */}
          <AnimatePresence>
            {heroExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 6 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-white/[0.04] flex-shrink-0"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="min-w-0">
                    <p
                      className="text-[#22D3EE]/50 mb-2.5"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}
                    >
                      For PI firms built for speed, discipline, and funded growth
                    </p>
                    <h1
                      className="text-[24px] sm:text-[32px] font-bold text-[#F1F3F5] leading-[1.15]"
                      style={{ fontFamily: 'var(--font-geist)', fontWeight: 700 }}
                    >
                      Request Private Access
                    </h1>
                  </div>
                  <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0">
                    <Shield className="w-3.5 h-3.5 text-white/25" />
                    <span className="text-[12px] text-white/40" style={{ fontFamily: 'var(--font-geist)', fontWeight: 500 }}>
                      Reviewed manually. Not all firms are accepted.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed title */}
          <AnimatePresence>
            {!heroExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-5 sm:mb-6 pt-2 text-center"
              >
                <h2
                  className="text-[20px] sm:text-[26px] font-bold text-[#F1F3F5]"
                  style={{ fontFamily: 'var(--font-geist)', fontWeight: 700 }}
                >
                  Request Private Access
                </h2>
                <p className="text-[13px] text-white/45 mt-1.5" style={{ fontFamily: 'var(--font-geist)', fontWeight: 500 }}>
                  Qualification in progress
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress */}
          <div className="mb-5 sm:mb-6 flex-shrink-0">
            <ProgressBar
              currentPhaseIndex={currentPhaseIndex}
              progressPercent={progressPercent}
            />
          </div>

          {/* Form row */}
          <div className="flex gap-5 lg:gap-8 flex-1 min-h-0">

            {/* Form panel */}
            <div className="flex-1 min-w-0 max-w-[660px] flex flex-col min-h-0">
              <div
                className="rounded-2xl relative flex-1 min-h-0 flex flex-col overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(24px)',
                  minHeight: '320px',
                }}
              >
                {/* Top accent shimmer */}
                <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden rounded-t-2xl">
                  <motion.div
                    className="h-full w-full shimmer-line"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.3) 30%, rgba(139,92,246,0.2) 70%, transparent 100%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>

                {/* Scrollable content area — always scrollable so cards never get clipped */}
                <div
                  ref={scrollPanelRef}
                  className="p-6 sm:p-10 flex-1 flex flex-col overflow-y-auto dark-scrollbar"
                  style={{ paddingBottom: '32px' }}
                >
                  <FormScreen
                    screen={currentScreenConfig}
                    selectedOption={selectedOption}
                    multiSelectValues={multiSelectValues}
                    contactInfo={state.contactInfo}
                    onSelectOption={selectOption}
                    onMultiSelect={setMultiSelect}
                    onUpdateContact={updateContactInfo}
                    onNext={goNext}
                    onBack={goBack}
                    onSubmit={submitApplication}
                    canGoBack={state.currentScreen > 1}
                    direction={state.direction}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                  />
                </div>
              </div>

              {/* Microcopy */}
              <div className="mt-2 sm:mt-2.5 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3 text-white/25 flex-shrink-0" />
                <span className="text-[11px] text-white/35" style={{ fontFamily: 'var(--font-geist)' }}>
                  Reviewed manually. Not all firms are accepted.
                </span>
              </div>
            </div>

            {/* Evaluation sidebar — desktop only */}
            <EvaluationSidebar screenId={state.currentScreen} answers={state.answers} />
          </div>
        </div>
      </main>

      {/* === Footer === */}
      <footer
        className="relative z-10 px-4 sm:px-8 py-3 sm:py-3.5 flex-shrink-0 border-t border-white/[0.04]"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-6xl mx-auto">
          {/* ABA compliance — visible on sm+ only */}
          <p
            className="text-center text-white/[0.25] mb-2 leading-relaxed hidden sm:block"
            style={{ fontFamily: 'var(--font-geist)', fontSize: '10px' }}
          >
            CasePort is a case acquisition platform, not a law firm. No attorney-client relationship is formed. No referral fees paid to or accepted from attorneys. All arrangements comply with applicable state bar rules.
          </p>
          {/* Brand + links row — stacks on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <span
              className="text-white/25 text-center sm:text-left"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              CasePort — Case Flow Without Guesswork
            </span>
            <div className="flex items-center justify-center sm:justify-end gap-5">
              <a
                href="https://caseport.io/privacy"
                className="text-white/25 hover:text-white/45 transition-colors duration-200"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                Privacy
              </a>
              <a
                href="https://caseport.io/terms"
                className="text-white/25 hover:text-white/45 transition-colors duration-200"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
