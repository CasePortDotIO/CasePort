import { motion } from 'framer-motion';
import { TrendingUp, Calendar, DollarSign, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RevenueMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

const revenueMetrics: RevenueMetric[] = [
  { label: 'Revenue This Month', value: '$78,000', change: 12, trend: 'up' },
  { label: 'Cost Per Case', value: '$2,240', change: -5, trend: 'up' },
  { label: 'Projected LTV', value: '$312,000', change: 8, trend: 'up' },
  { label: 'Avg Case Value', value: '$65,000', change: 3, trend: 'up' },
];

export default function RevenueAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Revenue & ROI</h2>
          <p className="text-sm text-muted-foreground">Financial performance overview</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
          <TrendingUp className="w-3 h-3 mr-1" />
          On Track
        </Badge>
      </div>

      {/* Revenue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueMetrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + idx * 0.05 }}
          >
            <Card className="p-4 border-border hover:border-primary/50 transition-colors">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                {metric.label}
              </p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-light tracking-tight text-foreground">
                  {metric.value}
                </p>
                <div
                  className={`text-xs font-semibold ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.trend === 'up' ? '+' : '-'}{Math.abs(metric.change)}%
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">This Month Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Cases Signed', value: '12', icon: Target },
              { label: 'Total Revenue', value: '$78,000', icon: DollarSign },
              { label: 'Avg Days to Close', value: '8.5 days', icon: Calendar },
              { label: 'Revenue vs. Last Month', value: '+$8,400', icon: TrendingUp },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + idx * 0.05 }}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground">{item.label}</p>
                  </div>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* ROI Projection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-primary/10 border border-primary/20 rounded-lg p-6"
      >
        <p className="text-sm font-semibold text-foreground mb-2">Lifetime Value Projection</p>
        <p className="text-3xl font-light tracking-tight text-primary mb-3">$312,000</p>
        <p className="text-xs text-muted-foreground">
          Based on current conversion rate (22.4%) and average case value ($65,000). At this pace, you'll reach $1M in annual revenue in 3.8 months.
        </p>
      </motion.div>
    </div>
  );
}
