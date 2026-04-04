/**
 * ExitIntentModal — Captures bouncing leads without being pushy
 * 
 * Triggers when user's mouse moves toward browser back button or tab close
 * Offers: "Get notified when your market opens a slot"
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - JetBrains Mono for labels
 * - Geist for body
 * - Gradient CTA
 */

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import { useState, useEffect } from "react";

interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export default function ExitIntentModal({ isOpen, onClose, onSubmit }: ExitIntentModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubmit(email);
      setSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setSubmitted(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-[12px] p-8"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/[0.08] rounded-[8px] transition-colors"
            >
              <X size={16} className="text-[#B0B8C4]" />
            </button>

            {!submitted ? (
              <>
                {/* Icon */}
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center mb-6" style={{ background: "rgba(34,211,238,0.15)" }}>
                  <Bell size={20} className="text-[#22D3EE]" />
                </div>

                {/* Headline */}
                <h2 className="text-[20px] font-bold text-[#F1F3F5] mb-2">Before you go.</h2>
                <p className="text-[14px] text-[#B0B8C4] mb-6 leading-relaxed">
                  Get notified the moment your market opens a slot. No spam. Just market updates.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#F1F3F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full font-bold text-[#030608] transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #00B4D8 0%, #5BB6C9 40%, #7C5CFF 100%)",
                    }}
                  >
                    Notify Me
                  </button>
                </form>

                {/* Dismiss */}
                <button
                  onClick={onClose}
                  className="w-full mt-3 py-2 text-[13px] text-[#B0B8C4] hover:text-[#F1F3F5] transition-colors"
                >
                  No thanks
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(16,185,129,0.15)" }}>
                  <Bell size={20} className="text-[#10B981]" />
                </div>
                <p className="text-[16px] font-bold text-[#F1F3F5] mb-2">You're all set.</p>
                <p className="text-[13px] text-[#B0B8C4]">We'll email you when your market opens.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
