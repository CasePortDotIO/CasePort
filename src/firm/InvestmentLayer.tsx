import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Wallet, TrendingUp, FileText, AlertCircle, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface InvestmentLayerProps {
  walletBalance: number;
  walletThreshold: number;
  currentRank: number;
  totalFirms: number;
  casesAccepted: number;
  conversionRate: number;
}

export default function InvestmentLayer({
  walletBalance,
  walletThreshold,
  currentRank,
  totalFirms,
  casesAccepted,
  conversionRate,
}: InvestmentLayerProps) {
  const [, navigate] = useLocation();
  const isLowBalance = walletBalance < walletThreshold;
  const rankPercentile = Math.round((1 - currentRank / totalFirms) * 100);
  const switchingCost = casesAccepted * 500; // Estimated value of case history

  return (
    <div className="space-y-6">
      {/* Wallet Sunk Cost */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 border-border bg-gradient-to-br from-background to-muted/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Pre-funded Wallet</h3>
                <p className="text-xs text-muted-foreground">Capital locked in CasePort</p>
              </div>
            </div>
            {isLowBalance && (
              <Badge variant="destructive" className="animate-pulse">
                Low Balance
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            {/* Balance Display */}
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-foreground">
                ${walletBalance.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {isLowBalance ? (
                  <span className="text-amber-600 font-semibold">
                    Top up soon to stay active
                  </span>
                ) : (
                  <span>
                    Threshold: ${walletThreshold.toLocaleString()}
                  </span>
                )}
              </p>
            </div>

            {/* Sunk Cost Message */}
            <div className="bg-amber-500/10 border border-amber-200/30 rounded-lg p-3">
              <p className="text-xs text-amber-900 font-semibold">
                Switching platforms means losing ${walletBalance.toLocaleString()} in pre-funded capital
              </p>
            </div>

            {/* Top Up Button */}
            {isLowBalance && (
              <Button className="w-full" variant="default" onClick={() => navigate('/wallet')}>
                Top Up Wallet
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Rank Position (Social Proof Sunk Cost) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6 border-border bg-gradient-to-br from-background to-muted/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Your Rank</h3>
                <p className="text-xs text-muted-foreground">Position among all firms</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
              Top {rankPercentile}%
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Rank Display */}
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Current Position</p>
              <p className="text-3xl font-bold text-foreground">
                #{currentRank} <span className="text-lg text-muted-foreground">of {totalFirms}</span>
              </p>
              <Progress value={rankPercentile} className="mt-3" />
            </div>

            {/* Switching Cost Message */}
            <div className="bg-blue-500/10 border border-blue-200/30 rounded-lg p-3">
              <p className="text-xs text-blue-900 font-semibold">
                Switching platforms means starting at rank #1 again
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Case History (Data Lock-in) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 border-border bg-gradient-to-br from-background to-muted/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Your Track Record</h3>
                <p className="text-xs text-muted-foreground">Cases & conversion history</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-200">
              ${switchingCost.toLocaleString()} value
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background rounded-lg p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Cases Accepted</p>
                <p className="text-2xl font-bold text-foreground">{casesAccepted}</p>
              </div>
              <div className="bg-background rounded-lg p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">{conversionRate}%</p>
              </div>
            </div>

            {/* Data Lock-in Message */}
            <div className="bg-red-500/10 border border-red-200/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-900 font-semibold">
                  Your track record ({casesAccepted} cases, {conversionRate}% conversion) is only available in CasePort
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Combined Switching Cost */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-1">Total Switching Cost</h4>
            <p className="text-xs text-muted-foreground mb-2">
              If you leave CasePort, you'd lose:
            </p>
            <ul className="text-xs text-foreground space-y-1 ml-4 list-disc">
              <li>${walletBalance.toLocaleString()} in pre-funded capital</li>
              <li>Your rank position (#{currentRank} → #1)</li>
              <li>Your case history ({casesAccepted} cases, {conversionRate}% conversion rate)</li>
            </ul>
            <p className="text-xs font-semibold text-primary mt-2">
              Estimated total value: ${(walletBalance + switchingCost).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
