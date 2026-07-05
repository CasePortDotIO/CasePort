import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
}

export default function AchievementsModal({ isOpen, onClose, badges }: AchievementsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl rounded-lg bg-background border border-dashed border-primary/30 p-8 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">All Achievements</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {badges.map((badge, idx) => (
                <motion.div
                  key={badge.id}
                  className="flex flex-col items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 hover:bg-primary/10 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="text-4xl">{badge.icon}</div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{badge.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{badge.description}</div>
                    <div className="text-xs text-primary mt-2">
                      {badge.unlockedAt.toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={onClose}
            >
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
