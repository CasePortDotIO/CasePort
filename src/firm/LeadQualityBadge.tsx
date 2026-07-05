import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LeadQualityBadgeProps {
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  score: number;
  probability: number;
  recommendation: string;
}

export default function LeadQualityBadge({
  tier,
  score,
  probability,
  recommendation,
}: LeadQualityBadgeProps) {
  const tierConfig = {
    platinum: {
      color: 'bg-yellow-500/20 text-yellow-700 border-yellow-300',
      icon: Star,
      label: 'Platinum',
      description: 'Highest quality lead',
    },
    gold: {
      color: 'bg-primary/20 text-primary border-primary/30',
      icon: Star,
      label: 'Gold',
      description: 'Strong opportunity',
    },
    silver: {
      color: 'bg-gray-500/20 text-gray-700 border-gray-300',
      icon: Zap,
      label: 'Silver',
      description: 'Moderate opportunity',
    },
    bronze: {
      color: 'bg-orange-500/20 text-orange-700 border-orange-300',
      icon: Zap,
      label: 'Bronze',
      description: 'Lower priority',
    },
  };

  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Badge className={`${config.color} border cursor-help`}>
              <Icon className="w-3 h-3 mr-1" />
              {config.label} ({score})
            </Badge>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">{config.label} Lead</p>
            <p className="text-xs">{config.description}</p>
            <p className="text-xs">
              <strong>Score:</strong> {score}/100
            </p>
            <p className="text-xs">
              <strong>Conversion Probability:</strong> {Math.round(probability * 100)}%
            </p>
            <p className="text-xs italic mt-2">{recommendation}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
