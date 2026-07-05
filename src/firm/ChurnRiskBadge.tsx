import { AlertCircle, TrendingDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChurnRiskBadgeProps {
  riskLevel: 'high' | 'medium' | 'low';
  daysSinceUpdate: number;
  conversionProbability: number;
  reason?: string;
}

export default function ChurnRiskBadge({
  riskLevel,
  daysSinceUpdate,
  conversionProbability,
  reason,
}: ChurnRiskBadgeProps) {
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-200';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'low':
        return 'bg-green-500/10 text-green-600 border-green-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const tooltipText = reason || `${daysSinceUpdate} days since last update. Conversion probability: ${conversionProbability}%`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium cursor-help transition-colors ${getRiskColor()}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getRiskIcon()}
            <span className="capitalize">{riskLevel} Risk</span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">Churn Risk Analysis</p>
            <p className="text-sm">{tooltipText}</p>
            {riskLevel === 'high' && (
              <p className="text-sm text-amber-200 font-medium">
                Action: Reach out within 24 hours to re-engage.
              </p>
            )}
            {riskLevel === 'medium' && (
              <p className="text-sm text-amber-200 font-medium">
                Action: Schedule follow-up within 48 hours.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
