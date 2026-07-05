import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

/*
 * The calm empty state. Never a blank void and never a fake number: when a
 * surface has no data yet, it says plainly what will appear here and what, if
 * anything, the partner should do. This is what a first time firm sees before a
 * single case has flowed, and it is how the platform teaches itself with no
 * guidance.
 */
export default function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center text-center px-6 ${compact ? 'py-10' : 'py-16'}`}
    >
      <div
        className="grid place-items-center rounded-2xl mb-5"
        style={{ width: 56, height: 56, background: 'rgba(34,197,141,0.10)', border: '1px solid rgba(34,197,141,0.22)' }}
      >
        <Icon className="w-6 h-6" style={{ color: '#22c58d' }} />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
