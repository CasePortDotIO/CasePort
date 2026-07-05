import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GamificationWidget from '@/firm/GamificationWidget';
import BenchmarkingWidget from '@/firm/BenchmarkingWidget';
import WalletReplenishmentWidget from '@/firm/WalletReplenishmentWidget';
import BloombergClock from '@/firm/BloombergClock';
import RevenueAnalytics from '@/firm/RevenueAnalytics';

interface MetricRow {
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const primaryMetrics: MetricRow[] = [
  { label: 'Conversion Rate', value: '22.4', unit: '%', change: 2.1, trend: 'up' },
  { label: 'Cases Signed', value: '35', change: 5, trend: 'up' },
  { label: 'Wallet Balance', value: '$18,400', change: -2400, trend: 'down' },
  { label: 'Response Time', value: '12 min', change: -3, trend: 'up' },
];

const recentOpportunities = [
  {
    id: 'CP-2026-000089',
    type: 'Auto Accident',
    market: 'Houston',
    status: 'Contacted',
    probability: '87%',
  },
  {
    id: 'CP-2026-000088',
    type: 'Slip & Fall',
    market: 'Dallas',
    status: 'Signed',
    probability: '92%',
  },
  {
    id: 'CP-2026-000087',
    type: 'Workers Comp',
    market: 'Austin',
    status: 'Contacted',
    probability: '71%',
  },
];

export default function DashboardInstitutional() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-background">
      {/* Bloomberg Clock */}
      <BloombergClock />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Wednesday, April 22 — Houston Market
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Rank</p>
              <p className="text-2xl font-semibold text-foreground">#8 of 156</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Primary Metrics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {primaryMetrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              <Card className="p-6 border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {metric.label}
                  </p>
                  {metric.trend && (
                    <div
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(metric.change || 0)}%
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-light tracking-tight text-foreground">
                    {metric.value}
                  </p>
                  {metric.unit && <p className="text-sm text-muted-foreground">{metric.unit}</p>}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Recent Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Opportunities</h2>
                <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/opportunities')}>
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Last 7 days activity across your markets
              </p>
            </div>

            <Card className="border-border overflow-hidden">
              <div className="divide-y divide-border">
                {recentOpportunities.map((opp, idx) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + idx * 0.05 }}
                    className="p-6 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium text-foreground">{opp.type}</p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              opp.status === 'Signed'
                                ? 'bg-green-500/10 text-green-700 border-green-200'
                                : 'bg-blue-500/10 text-blue-700 border-blue-200'
                            }`}
                          >
                            {opp.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{opp.id}</span>
                          <span>{opp.market}</span>
                          <span>Conversion: {opp.probability}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/opportunity/${opp.id}`)}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Key Metrics</h2>
              <p className="text-sm text-muted-foreground">Performance summary</p>
            </div>

            <div className="space-y-4">
              <Card className="p-6 border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Acceptance Rate
                </p>
                <p className="text-3xl font-light tracking-tight text-foreground mb-3">68%</p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }} />
                </div>
              </Card>

              <Card className="p-6 border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Avg Case Value
                </p>
                <p className="text-3xl font-light tracking-tight text-foreground">$65,000</p>
                <p className="text-xs text-green-600 mt-2">+12% vs. market avg</p>
              </Card>

              <Card className="p-6 border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Cases This Month
                </p>
                <p className="text-3xl font-light tracking-tight text-foreground">12</p>
                <p className="text-xs text-muted-foreground mt-2">On track for 45 this quarter</p>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Revenue Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
        >
          <RevenueAnalytics />
        </motion.div>

        {/* Secondary Sections */}
        <div className="space-y-12">
          {/* Benchmarking Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Market Comparison</h2>
              <p className="text-sm text-muted-foreground">
                How your performance compares to market averages
              </p>
            </div>
            <BenchmarkingWidget />
          </motion.div>

          {/* Wallet Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Wallet & Billing</h2>
              <p className="text-sm text-muted-foreground">Manage your pre-funded wallet</p>
            </div>
            <WalletReplenishmentWidget />
          </motion.div>

          {/* Gamification Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Performance & Achievements</h2>
              <p className="text-sm text-muted-foreground">Track your progress and unlock badges</p>
            </div>
            <GamificationWidget />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
