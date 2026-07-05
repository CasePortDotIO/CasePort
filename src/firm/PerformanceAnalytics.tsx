import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";
import { analyticsEngine } from "@/firm/analyticsEngine";

export function PerformanceAnalytics() {
  const metrics = analyticsEngine.getMetrics();
  const funnel = analyticsEngine.getFunnelAnalysis();
  const retention = analyticsEngine.getRetentionAnalysis();
  const attribution = analyticsEngine.getAttributionAnalysis();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-muted/30 border border-muted rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {metrics.conversionRate.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-chart-1" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-muted/30 border border-muted rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold text-foreground">
                {metrics.avgResponseTime.toFixed(0)}h
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-muted/30 border border-muted rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Case Value</p>
              <p className="text-2xl font-bold text-foreground">
                ${(metrics.avgCaseValue / 1000).toFixed(0)}k
              </p>
            </div>
            <PieChart className="w-8 h-8 text-chart-3" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-muted/30 border border-muted rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Churn Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {metrics.churnRate.toFixed(1)}%
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-destructive" />
          </div>
        </motion.div>
      </div>

      {/* Funnel Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-muted/30 border border-muted rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Conversion Funnel</h3>
        <div className="space-y-3">
          {funnel.map((step, idx) => (
            <motion.div
              key={step.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{step.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {step.count} ({step.conversionRate.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${step.conversionRate}%` }}
                    transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Retention Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-muted/30 border border-muted rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Retention Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {retention.map((metric, idx) => (
            <motion.div
              key={metric.period}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="bg-background rounded-lg p-4 border border-muted/50"
            >
              <p className="text-sm text-muted-foreground mb-2">{metric.period}</p>
              <p className="text-2xl font-bold text-chart-1 mb-3">
                {metric.retentionRate.toFixed(1)}%
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-chart-1">Retained: {metric.retained}</span>
                <span className="text-destructive">Churned: {metric.churned}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Attribution Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-muted/30 border border-muted rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Channel Attribution</h3>
        <div className="space-y-3">
          {attribution.map((channel, idx) => (
            <motion.div
              key={channel.channel}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + idx * 0.1 }}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-muted/50"
            >
              <div>
                <p className="font-medium text-foreground capitalize">{channel.channel}</p>
                <p className="text-sm text-muted-foreground">
                  {channel.conversions} conversions • ${channel.revenue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-chart-1">{channel.roi.toFixed(0)}% ROI</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
