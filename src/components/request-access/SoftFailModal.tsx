"use client";

/**
 * CasePort Soft Fail Modal
 * 
 * READABILITY: Title 15px, body 14-15px, button 14px
 * Enhanced glassmorphic overlay with amber accent glow
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface SoftFailModalProps {
  message: string | null;
  onDismiss: () => void;
}

export function SoftFailModal({ message, onDismiss }: SoftFailModalProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{ background: 'rgba(10, 14, 23, 0.8)', backdropFilter: 'blur(16px)' }}
          onClick={onDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-md w-full rounded-2xl p-7"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 60px rgba(245,158,11,0.04)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/[0.1] flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4.5 h-4.5 text-[#F59E0B]/70" />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-[15px] font-semibold text-[#F1F3F5] mb-2.5"
                  style={{ fontFamily: 'var(--font-geist)' }}
                >
                  Note
                </h4>
                <p
                  className="text-[14px] sm:text-[15px] text-[#A0AAB8] leading-relaxed mb-6"
                  style={{ fontFamily: 'var(--font-geist)' }}
                >
                  {message}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDismiss}
                  className="px-6 py-3 rounded-xl text-[14px] font-medium text-white/90
                             bg-white/[0.08] border border-white/[0.1]
                             hover:bg-white/[0.12] hover:text-white transition-all duration-200"
                  style={{ fontFamily: 'var(--font-geist)' }}
                >
                  Understood, Continue
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
