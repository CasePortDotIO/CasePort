/**
 * CasePort Progress Bar
 * 
 * READABILITY: Phase labels 11px minimum, contrast white/25 inactive, cyan/70 active
 * Thicker progress track for visual presence
 */

import { PHASES } from '@/lib/formData';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentPhaseIndex: number;
  progressPercent: number;
}

export function ProgressBar({ currentPhaseIndex, progressPercent }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Phase labels */}
      <div className="flex items-center justify-between mb-3.5">
        {PHASES.map((phase, i) => (
          <div key={phase} className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`w-[6px] h-[6px] rounded-full transition-all duration-500 ${
                i < currentPhaseIndex
                  ? 'bg-[#22D3EE]/70'
                  : i === currentPhaseIndex
                  ? 'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                  : 'bg-white/12'
              }`}
            />
            <span
              className={`hidden sm:inline transition-colors duration-500 ${
                i <= currentPhaseIndex
                  ? 'text-[#22D3EE]/70'
                  : 'text-white/25'
              }`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}
            >
              {phase}
            </span>
          </div>
        ))}
      </div>

      {/* Progress track */}
      <div className="relative h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #22D3EE, #8B5CF6)',
            boxShadow: '0 0 8px rgba(34,211,238,0.3)',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
