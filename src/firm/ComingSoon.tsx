import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { LineChart, ArrowLeft } from 'lucide-react';

/**
 * An honest placeholder for a surface that is not yet backed by real data.
 *
 * The Glass Box promise is that every figure traces to the firm's own ledger and
 * market, and nothing is estimated. Rather than show fabricated performance,
 * analytics, or ranking numbers next to the real Wallet and Opportunities, these
 * surfaces say plainly that they activate as real cases and outcomes accumulate.
 * Honesty is the product; a fake chart would undo it.
 */
export default function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-secondary px-8 py-6">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      </div>
      <div className="max-w-2xl mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className="grid place-items-center rounded-2xl mx-auto mb-6"
            style={{ width: 60, height: 60, background: 'rgba(34,197,141,0.10)', border: '1px solid rgba(34,197,141,0.22)' }}
          >
            <LineChart className="w-7 h-7" style={{ color: '#22c58d' }} />
          </div>
          <h2 className="text-xl font-medium text-foreground mb-3 tracking-tight">Activates with your data</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-8">{blurb}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to your dashboard
          </button>
          <p className="mt-10 text-[13px] text-muted-foreground">
            We would rather show you nothing than a number we cannot trace to your ledger and your market.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
