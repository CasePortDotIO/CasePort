import { motion } from 'framer-motion';
import { TrendingUp, Target, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CompetitiveGap {
  metric: string;
  yourValue: number;
  targetValue: number;
  unit: string;
  gap: number;
}

const competitiveGaps: CompetitiveGap[] = [
  { metric: 'Conversion Rate', yourValue: 22.4, targetValue: 28, unit: '%', gap: 5.6 },
  { metric: 'Response Time', yourValue: 12, targetValue: 8, unit: 'min', gap: -4 },
  { metric: 'Cases Signed', yourValue: 35, targetValue: 45, unit: 'cases', gap: 10 },
];

export default function CompetitivePositioning() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Competitive Positioning</h2>
        <p className="text-sm text-muted-foreground">
          What it takes to reach the next tier
        </p>
      </div>

      {/* Current Position */}
      <Card className="p-6 border-border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Your Current Rank
            </p>
            <p className="text-4xl font-light tracking-tight text-foreground">#8</p>
            <p className="text-sm text-muted-foreground mt-1">of 156 firms (Top 5%)</p>
          </div>
          <div className="text-right">
            <Badge className="bg-green-500/20 text-green-700 border-green-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending Up
            </Badge>
          </div>
        </div>

        {/* Next Tier Target */}
        <div className="border-t border-border pt-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
            To Reach Top 5 (#1-5)
          </p>
          <div className="space-y-4">
            {competitiveGaps.map((gap, idx) => (
              <motion.div
                key={gap.metric}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{gap.metric}</p>
                    <p className="text-xs text-muted-foreground">
                      You: {gap.yourValue}{gap.unit} → Target: {gap.targetValue}{gap.unit}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${gap.gap > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                    {gap.gap > 0 ? '+' : ''}{gap.gap}{gap.unit}
                  </span>
                </div>
                <Progress value={(gap.yourValue / gap.targetValue) * 100} className="h-2" />
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actionable Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 border-border bg-secondary/50">
          <div className="flex items-start gap-3 mb-4">
            <Target className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-semibold text-foreground mb-2">How to Move Up</p>
              <ol className="text-sm space-y-2 text-muted-foreground">
                <li>1. Increase acceptance rate to 28% (currently 22.4%)</li>
                <li>2. Reduce response time to 8 minutes (currently 12 min)</li>
                <li>3. Sign 10 more cases this month (currently on pace for 35)</li>
              </ol>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Incentive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-primary/10 border border-primary/20 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Top 5 Benefit</p>
            <p className="text-xs text-muted-foreground">
              Firms in top 5 get priority access to premium cases and 10% wallet bonus on all deposits.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
