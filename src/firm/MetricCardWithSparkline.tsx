import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardWithSparklineProps {
  title: string;
  value: string | number;
  change?: number;
  sparklineData: Array<{ value: number }>;
  helpText?: string;
  icon?: React.ReactNode;
}

export function MetricCardWithSparkline({
  title,
  value,
  change,
  sparklineData,
  helpText,
  icon,
}: MetricCardWithSparklineProps) {
  const isPositive = change !== undefined && change >= 0;
  const trendColor = isPositive ? "#1D9E75" : "#E24B4A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative border border-dashed border-primary rounded-lg p-5 bg-gradient-to-br from-background to-background/80 hover:border-primary/80 transition-colors"
    >
      {/* Header with title and help icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary">{icon}</div>}
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {helpText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help hover:text-primary transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              {helpText}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Main value with sparkline */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-foreground font-mono"
          >
            {value}
          </motion.div>
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-sm font-medium mt-1 ${
                isPositive ? "text-chart-1" : "text-destructive"
              }`}
            >
              {isPositive ? "↑" : "↓"} {Math.abs(change)}%
            </motion.div>
          )}
        </div>

        {/* Sparkline chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-24 h-12"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={trendColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
