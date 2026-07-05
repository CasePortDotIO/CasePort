import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BenchmarkMetric {
  label: string;
  yourValue: number;
  marketAverage: number;
  unit: string;
  trend: 'good' | 'bad' | 'neutral';
  gap: number;
}

const benchmarkData: BenchmarkMetric[] = [
  {
    label: 'Conversion Rate',
    yourValue: 22.4,
    marketAverage: 18.2,
    unit: '%',
    trend: 'good',
    gap: 4.2,
  },
  {
    label: 'Response Time',
    yourValue: 12,
    marketAverage: 18,
    unit: 'min',
    trend: 'good',
    gap: -6,
  },
  {
    label: 'Average Case Value',
    yourValue: 65000,
    marketAverage: 52000,
    unit: '$',
    trend: 'good',
    gap: 13000,
  },
  {
    label: 'Case Acceptance Rate',
    yourValue: 68,
    marketAverage: 55,
    unit: '%',
    trend: 'good',
    gap: 13,
  },
];

export default function BenchmarkingWidget() {
  const yourPercentile = Math.round((1 - 8 / 156) * 100); // Based on rank #8 of 156
  const improvementOpportunity = benchmarkData.filter((m) => m.trend === 'bad').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground">How You Compare</h2>
          <p className="text-sm text-muted-foreground">Your performance vs. market average</p>
        </div>
        <Badge className="bg-green-500/10 text-green-700 border-green-200">
          Top {yourPercentile}%
        </Badge>
      </motion.div>

      {/* Percentile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200/30">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Your Percentile</p>
                <p className="text-3xl font-bold text-green-600">{yourPercentile}th</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Rank</p>
              <p className="text-2xl font-bold text-foreground">#8 of 156</p>
            </div>
          </div>
          <Progress value={yourPercentile} className="h-2" />
          <p className="text-xs text-muted-foreground mt-3">
            You're performing better than {yourPercentile}% of firms in your market
          </p>
        </Card>
      </motion.div>

      {/* Benchmark Metrics */}
      <div className="space-y-3">
        {benchmarkData.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
          >
            <Card className="p-4 border-border hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground text-sm">{metric.label}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-primary">
                        {metric.yourValue.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">{metric.unit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="text-xs">vs.</span>
                      <span className="text-sm font-semibold">
                        {metric.marketAverage.toLocaleString()} {metric.unit}
                      </span>
                    </div>
                  </div>
                </div>
                {metric.trend === 'good' && (
                  <Badge className="bg-green-500/10 text-green-700 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Above Avg
                  </Badge>
                )}
                {metric.trend === 'bad' && (
                  <Badge className="bg-red-500/10 text-red-700 border-red-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Below Avg
                  </Badge>
                )}
              </div>

              {/* Comparison Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">You</span>
                  <span className="text-muted-foreground">Market Avg</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((metric.yourValue / metric.marketAverage) * 100, 100)}%`,
                      }}
                      transition={{ duration: 0.8, delay: 0.2 + idx * 0.05 }}
                      className={`h-full ${
                        metric.trend === 'good'
                          ? 'bg-green-500'
                          : metric.trend === 'bad'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground w-12 text-right">
                    {metric.trend === 'good' ? '+' : ''}{metric.gap.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Improvement Opportunities */}
      {improvementOpportunity === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-500/10 border border-green-200/30 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">You're Outperforming</h4>
              <p className="text-xs text-muted-foreground">
                You're beating market average on all key metrics. Keep up the momentum and maintain your competitive edge.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pro Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-primary/5 border border-primary/20 rounded-lg p-4"
      >
        <p className="text-sm text-foreground">
          <span className="font-semibold">Insight:</span> Firms in the top 10% focus on response time. Reducing your
          response time by 2 minutes could move you to the top 5%.
        </p>
      </motion.div>
    </div>
  );
}
