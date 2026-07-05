import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CaseValueRevealProps {
  caseId: string;
  actualValue: number;
  conversionProbability: number;
  onAccept?: (caseId: string) => void;
  isAccepted?: boolean;
}

export default function CaseValueReveal({
  caseId,
  actualValue,
  conversionProbability,
  onAccept,
  isAccepted = false,
}: CaseValueRevealProps) {
  const [isRevealed, setIsRevealed] = useState(isAccepted);

  const handleAccept = () => {
    setIsRevealed(true);
    onAccept?.(caseId);
  };

  const getValueRange = () => {
    const min = Math.floor(actualValue * 0.6);
    const max = Math.ceil(actualValue * 1.4);
    return { min, max };
  };

  const { min, max } = getValueRange();

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-muted-foreground">
              Value hidden until acceptance
            </span>
            <span className="text-xs text-amber-600 font-semibold">
              Could be ${min.toLocaleString()}-${max.toLocaleString()}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <Unlock className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-foreground">
              ${actualValue.toLocaleString()}
            </span>
            <span className="text-xs text-green-600 font-semibold">
              {conversionProbability}% likely to convert
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            size="sm"
            variant="default"
            onClick={handleAccept}
            className="w-full"
          >
            Accept Case to Reveal Value
          </Button>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Inline version for table cells
 */
export function CaseValueBadge({
  actualValue,
  conversionProbability,
  isAccepted = false,
}: {
  actualValue: number;
  conversionProbability: number;
  isAccepted?: boolean;
}) {
  if (isAccepted) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-green-600">
          ${actualValue.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">
          {conversionProbability}%
        </span>
      </div>
    );
  }

  const min = Math.floor(actualValue * 0.6);
  const max = Math.ceil(actualValue * 1.4);

  return (
    <div className="flex items-center gap-2">
      <Lock className="w-3 h-3 text-amber-500" />
      <span className="text-xs text-amber-600 font-semibold">
        ${min.toLocaleString()}-${max.toLocaleString()}
      </span>
    </div>
  );
}
