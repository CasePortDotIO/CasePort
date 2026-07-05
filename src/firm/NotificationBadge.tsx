import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBadgeProps {
  count: number;
  pulse?: boolean;
}

export default function NotificationBadge({ count, pulse = true }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-0 right-0 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold ${
          pulse ? 'animate-pulse' : ''
        }`}
      >
        {count > 9 ? '9+' : count}
      </motion.div>
    </AnimatePresence>
  );
}
