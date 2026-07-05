import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChurnAlert {
  id: string;
  type: 'inactivity' | 'low_acceptance' | 'low_balance' | 'rank_drop';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
}

const churnAlerts: ChurnAlert[] = [
  {
    id: '1',
    type: 'inactivity',
    severity: 'critical',
    title: 'No Activity in 7 Days',
    description: 'You haven\'t reviewed any cases this week. Your rank may drop if this continues.',
    action: 'Review New Cases',
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: '2',
    type: 'low_acceptance',
    severity: 'warning',
    title: 'Acceptance Rate Below Average',
    description: 'Your acceptance rate (18%) is below market average (22%). You may be missing high-quality cases.',
    action: 'Improve Filters',
    icon: <TrendingDown className="w-5 h-5" />,
  },
  {
    id: '3',
    type: 'low_balance',
    severity: 'warning',
    title: 'Wallet Balance Low',
    description: 'Your wallet has $2,400 remaining. Top up to continue receiving cases.',
    action: 'Add Funds',
    icon: <AlertCircle className="w-5 h-5" />,
  },
  {
    id: '4',
    type: 'rank_drop',
    severity: 'info',
    title: 'Rank Dropped to #12',
    description: 'You dropped from #8 to #12 this week. Increase case acceptance to climb back up.',
    action: 'View Leaderboard',
    icon: <Zap className="w-5 h-5" />,
  },
];

export default function ChurnPreventionAlerts() {
  const severityConfig = {
    critical: {
      bg: 'bg-red-500/10',
      border: 'border-red-300',
      badge: 'bg-red-500/20 text-red-700 border-red-300',
      text: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-300',
      badge: 'bg-yellow-500/20 text-yellow-700 border-yellow-300',
      text: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-300',
      badge: 'bg-blue-500/20 text-blue-700 border-blue-300',
      text: 'text-blue-700',
    },
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Churn Prevention Alerts</h2>
        <p className="text-sm text-muted-foreground">
          We've identified {churnAlerts.length} areas that could improve your engagement
        </p>
      </div>

      <div className="space-y-3">
        {churnAlerts.map((alert, idx) => {
          const config = severityConfig[alert.severity];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`${config.bg} border ${config.border} p-4`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${config.text}`}>
                    {alert.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{alert.title}</h3>
                      <Badge className={`${config.badge} border`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      {alert.action}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Re-engagement Campaign */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6"
      >
        <p className="text-sm font-semibold text-foreground mb-2">Personalized Recommendation</p>
        <p className="text-xs text-muted-foreground mb-3">
          Based on your activity, we recommend focusing on Auto Accident cases in Houston market. You have 87% conversion rate on these.
        </p>
        <Button size="sm" className="bg-primary text-primary-foreground">
          View Recommended Cases
        </Button>
      </motion.div>
    </div>
  );
}
