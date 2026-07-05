import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'pending';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-primary/20 text-primary border border-primary/50',
    success: 'bg-chart-1/20 text-chart-1 border border-chart-1/50',
    warning: 'bg-chart-3/20 text-chart-3 border border-chart-3/50',
    error: 'bg-destructive/20 text-destructive border border-destructive/50',
    pending: 'bg-chart-3/20 text-chart-3 border border-chart-3/50',
  };

  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all',
        variants[variant],
        className
      )}
    >
      {children}
    </motion.span>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
  className?: string;
}

export function MetricCard({ label, value, subtext, highlight, className }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        'bg-card border border-border rounded-lg p-6 space-y-2 transition-all',
        'hover:border-primary/50 hover:shadow-lg',
        highlight && 'border-dashed border-primary',
        className
      )}
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={cn('text-2xl font-bold font-mono text-primary', highlight && 'text-primary')}>
        {value}
      </p>
      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </motion.div>
  );
}

interface OutcomeButtonGroupProps {
  onRetained: () => void;
  onNotRetained: () => void;
  onEvaluating: () => void;
  disabled?: boolean;
}

export function OutcomeButtonGroup({
  onRetained,
  onNotRetained,
  onEvaluating,
  disabled,
}: OutcomeButtonGroupProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRetained}
        disabled={disabled}
        className="px-4 py-2 rounded-lg bg-chart-1/20 text-chart-1 border border-chart-1/50 text-sm font-semibold hover:bg-chart-1/30 transition-all disabled:opacity-50"
      >
        Retained
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNotRetained}
        disabled={disabled}
        className="px-4 py-2 rounded-lg bg-destructive/20 text-destructive border border-destructive/50 text-sm font-semibold hover:bg-destructive/30 transition-all disabled:opacity-50"
      >
        Not Retained
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onEvaluating}
        disabled={disabled}
        className="px-4 py-2 rounded-lg bg-chart-3/20 text-chart-3 border border-chart-3/50 text-sm font-semibold hover:bg-chart-3/30 transition-all disabled:opacity-50"
      >
        Still Evaluating
      </motion.button>
    </div>
  );
}

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  dashed?: boolean;
  glow?: 'cyan' | 'lime' | 'none';
}

export function NeonCard({ children, className, dashed, glow = 'none' }: NeonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'bg-card rounded-lg p-6 transition-all',
        dashed && 'border-dashed border-primary',
        !dashed && 'border border-border',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface StatBoxProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function StatBox({ label, value, trend, trendValue }: StatBoxProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-bold text-primary font-mono">{value}</p>
        {trend && trendValue && (
          <span
            className={cn(
              'text-xs font-semibold',
            trend === 'up' && 'text-chart-1',
            trend === 'down' && 'text-destructive',
              trend === 'neutral' && 'text-muted-foreground'
            )}
          >
            {trend === 'up' && '↑'} {trend === 'down' && '↓'} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'cyan' | 'lime' | 'amber' | 'green' | 'red';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent,
  color = 'cyan',
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  const colorClasses = {
    cyan: 'bg-primary',
    lime: 'bg-chart-1',
    amber: 'bg-chart-3',
    green: 'bg-chart-1',
    red: 'bg-destructive',
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          {showPercent && <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</p>}
        </div>
      )}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', colorClasses[color])}
        />
      </div>
    </div>
  );
}

interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  className?: string;
}

export function NeonTable({ headers, rows, className }: TableProps) {
  return (
    <div className={cn('bg-card border border-border rounded-lg overflow-hidden', className)}>
      <table className="w-full">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, rowIdx) => (
            <motion.tr
              key={rowIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: rowIdx * 0.05 }}
              className="hover:bg-muted/30 transition-colors"
            >
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-6 py-4 text-sm text-foreground">
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
