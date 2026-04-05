/**
 * CasePort Option Card — Premium Edition
 * 
 * - Satisfying selection animation: border flashes cyan, left accent slides in, checkmark scales in
 * - Hover: subtle left-border preview, background lift
 * - Selected: cyan glow, gradient left border, bold label
 * - stretch=true: fills available height in flex column
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface OptionCardProps {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
  index: number;
  stretch?: boolean;
}

export function OptionCard({ label, sublabel, selected, onClick, index, stretch = false }: OptionCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, delay: 0.06 + index * 0.055, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      whileTap={{ scale: 0.988 }}
      className={`group relative w-full text-left rounded-xl overflow-hidden cursor-pointer ${stretch ? 'flex-1' : ''}`}
      style={{
        background: selected
          ? 'rgba(34, 211, 238, 0.06)'
          : 'rgba(255, 255, 255, 0.035)',
        border: selected
          ? '1px solid rgba(34, 211, 238, 0.28)'
          : '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: selected
          ? '0 0 0 1px rgba(34,211,238,0.08), 0 4px 20px rgba(34,211,238,0.06)'
          : 'none',
        transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
        minHeight: stretch ? '52px' : undefined,
      }}
      onMouseEnter={e => {
        if (!selected) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.065)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.13)';
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.035)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.07)';
        }
      }}
    >
      {/* Left accent bar — slides in on selection */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
        initial={false}
        animate={{
          scaleY: selected ? 1 : 0,
          opacity: selected ? 1 : 0,
        }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background: 'linear-gradient(180deg, #22D3EE 0%, #8B5CF6 100%)',
          transformOrigin: 'top',
        }}
      />

      {/* Hover glow — left-side radial */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 10% 50%, rgba(34,211,238,0.04) 0%, transparent 65%)',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Selected flash overlay — fades out quickly */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0.18 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ background: 'rgba(34, 211, 238, 0.12)' }}
          />
        )}
      </AnimatePresence>

      <div
        className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 h-full"
        style={{
          paddingTop: stretch ? '0' : '14px',
          paddingBottom: stretch ? '0' : '14px',
          minHeight: '52px',
        }}
      >
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: '15px',
              lineHeight: '1.4',
              fontWeight: selected ? 500 : 400,
              color: selected ? '#E8ECF0' : '#BDC5D1',
              transition: 'color 0.15s ease, font-weight 0.15s ease',
            }}
          >
            {label}
          </span>
          {sublabel && (
            <span
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: '12px',
                color: selected ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.25)',
                transition: 'color 0.15s ease',
              }}
            >
              {sublabel}
            </span>
          )}
        </div>

        {/* Checkmark circle */}
        <motion.div
          className="flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center"
          animate={{
            background: selected ? '#22D3EE' : 'transparent',
            borderColor: selected ? '#22D3EE' : 'rgba(255,255,255,0.18)',
            boxShadow: selected ? '0 0 14px rgba(34,211,238,0.35)' : 'none',
            scale: selected ? [1, 1.18, 1] : 1,
          }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          style={{
            border: '1.5px solid rgba(255,255,255,0.18)',
          }}
        >
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              >
                <Check className="w-[11px] h-[11px] text-[#0A0E17]" strokeWidth={3.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.button>
  );
}
