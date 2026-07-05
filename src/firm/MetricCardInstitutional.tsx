import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricCardInstitutionalProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  delay?: number;
}

export default function MetricCardInstitutional({
  label,
  value,
  unit,
  change,
  trend,
  description,
  delay = 0,
}: MetricCardInstitutionalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-6 border-border hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          {trend && change !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : null}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-3xl font-light tracking-tight text-foreground">
            {value}
          </p>
          {unit && <p className="text-sm text-muted-foreground">{unit}</p>}
        </div>

        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </Card>
    </motion.div>
  );
}
