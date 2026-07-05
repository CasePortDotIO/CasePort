import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import LeaderboardComponent from '@/firm/LeaderboardComponent';
import LeaderboardFilters from '@/firm/LeaderboardFilters';
import GamificationWidget from '@/firm/GamificationWidget';
import BenchmarkingWidget from '@/firm/BenchmarkingWidget';

export default function LeaderboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground mt-1">
              Benchmark your performance against other firms in your market
            </p>
          </div>
        </div>
      </motion.div>

      {/* Your own standing first: the anchor before the full board. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GamificationWidget />
        <BenchmarkingWidget />
      </div>

      {/* Filters */}
      <LeaderboardFilters />

      {/* Leaderboard Component */}
      <LeaderboardComponent />

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="border border-dashed border-primary/30 rounded-lg p-4 bg-primary/5">
          <h3 className="font-semibold text-foreground mb-2">Conversion Rate Insights</h3>
          <p className="text-sm text-muted-foreground">
            Top performers average 32% conversion rate. You're at 22.4% — increase response time by 30 minutes to reach 25%.
          </p>
        </div>
        <div className="border border-dashed border-primary/30 rounded-lg p-4 bg-primary/5">
          <h3 className="font-semibold text-foreground mb-2">Response Time Benchmark</h3>
          <p className="text-sm text-muted-foreground">
            Market average is 3.8 hours. Your 4.3h response time is costing you ~2% conversion rate.
          </p>
        </div>
        <div className="border border-dashed border-primary/30 rounded-lg p-4 bg-primary/5">
          <h3 className="font-semibold text-foreground mb-2">Revenue Opportunity</h3>
          <p className="text-sm text-muted-foreground">
            Moving to top 5 could increase annual revenue by $180k. Focus on conversion rate optimization.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
