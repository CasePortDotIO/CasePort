import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RealTimeMetric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

export default function CompulsiveCheckingDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([
    {
      label: 'Your Rank',
      value: '#8',
      change: -1,
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-600',
    },
    {
      label: 'Wallet Balance',
      value: '$18,400',
      change: -450,
      trend: 'down',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-amber-600',
    },
    {
      label: 'Conversion Rate',
      value: '22.4%',
      change: 1.2,
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-600',
    },
    {
      label: 'New Opportunities',
      value: '3',
      change: 3,
      trend: 'neutral',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-blue-600',
    },
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [updateCount, setUpdateCount] = useState(0);

  // Simulate real-time updates every 2-4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => {
          // Randomly update metrics
          if (Math.random() > 0.5) {
            const change = Math.floor(Math.random() * 10) - 5;
            return {
              ...metric,
              change,
              trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
            };
          }
          return metric;
        })
      );
      setLastUpdate(new Date());
      setUpdateCount((prev) => prev + 1);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  const getUpdateLabel = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    if (diff < 1000) return 'just now';
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    return `${Math.floor(diff / 60000)}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground">Live Dashboard</h2>
          <p className="text-sm text-muted-foreground">Bloomberg Terminal for Law Firms</p>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-2 bg-primary/10 rounded-full"
        >
          <Zap className="w-5 h-5 text-primary" />
        </motion.div>
      </motion.div>

      {/* Real-time metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-4 border-border hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 bg-primary/10 rounded-lg ${metric.color}`}>
                      {metric.icon}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {metric.label}
                    </p>
                  </div>
                  {metric.change !== undefined && (
                    <motion.div
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className={`text-xs font-bold ${
                        metric.trend === 'up'
                          ? 'text-green-600'
                          : metric.trend === 'down'
                            ? 'text-red-600'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}{' '}
                      {Math.abs(metric.change)}
                    </motion.div>
                  )}
                </div>

                <motion.p
                  key={metric.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  {metric.value}
                </motion.p>

                {metric.change !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    {metric.trend === 'up' ? 'Improving' : metric.trend === 'down' ? 'Declining' : 'Stable'}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Update indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">
            Last update: <span className="font-semibold text-foreground">{getUpdateLabel()}</span>
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          {updateCount} updates
        </Badge>
      </motion.div>

      {/* Compulsive checking message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4"
      >
        <p className="text-sm text-foreground">
          <span className="font-semibold"> Pro Tip:</span> Firms who check this dashboard 15+ times daily see{' '}
          <span className="font-bold text-green-600">3.2x higher conversion rates</span>. Real-time insights drive
          faster decisions.
        </p>
      </motion.div>
    </div>
  );
}
