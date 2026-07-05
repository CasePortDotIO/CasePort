import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, TrendingUp, Award, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LeaderboardEntry {
  rank: number;
  firmId: string;
  firmName: string;
  conversionRate: number;
  responseTime: number; // hours
  revenue: number;
  signedCases: number;
  market: string;
}

export default function LeaderboardComponent() {
  const [showNames, setShowNames] = useState(false);
  const [sortBy, setSortBy] = useState<'conversion' | 'response' | 'revenue' | 'cases'>('conversion');
  const [userRank] = useState(8);
  const [totalFirms] = useState(156);

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      firmId: 'FIRM-001',
      firmName: 'Morrison & Associates',
      conversionRate: 34.2,
      responseTime: 2.1,
      revenue: 487500,
      signedCases: 45,
      market: 'Houston',
    },
    {
      rank: 2,
      firmId: 'FIRM-002',
      firmName: 'Sterling Legal Group',
      conversionRate: 31.8,
      responseTime: 2.4,
      revenue: 425000,
      signedCases: 38,
      market: 'Dallas',
    },
    {
      rank: 3,
      firmId: 'FIRM-003',
      firmName: 'Apex Law Partners',
      conversionRate: 29.5,
      responseTime: 2.8,
      revenue: 392000,
      signedCases: 35,
      market: 'Austin',
    },
    {
      rank: 4,
      firmId: 'FIRM-004',
      firmName: 'Justice & Co.',
      conversionRate: 28.1,
      responseTime: 3.2,
      revenue: 356000,
      signedCases: 31,
      market: 'San Antonio',
    },
    {
      rank: 5,
      firmId: 'FIRM-005',
      firmName: 'Victory Legal',
      conversionRate: 26.7,
      responseTime: 3.5,
      revenue: 325000,
      signedCases: 28,
      market: 'Houston',
    },
    {
      rank: 6,
      firmId: 'FIRM-006',
      firmName: 'Rights & Remedies',
      conversionRate: 25.3,
      responseTime: 3.8,
      revenue: 298000,
      signedCases: 25,
      market: 'Dallas',
    },
    {
      rank: 7,
      firmId: 'FIRM-007',
      firmName: 'Champions Legal',
      conversionRate: 23.9,
      responseTime: 4.1,
      revenue: 275000,
      signedCases: 22,
      market: 'Austin',
    },
    {
      rank: 8,
      firmId: 'FIRM-008',
      firmName: 'Chen & Associates',
      conversionRate: 22.4,
      responseTime: 4.3,
      revenue: 248000,
      signedCases: 20,
      market: 'Houston',
    },
    {
      rank: 9,
      firmId: 'FIRM-009',
      firmName: 'Pinnacle Partners',
      conversionRate: 21.1,
      responseTime: 4.6,
      revenue: 225000,
      signedCases: 18,
      market: 'San Antonio',
    },
    {
      rank: 10,
      firmId: 'FIRM-010',
      firmName: 'Elite Legal Solutions',
      conversionRate: 19.8,
      responseTime: 4.9,
      revenue: 198000,
      signedCases: 15,
      market: 'Dallas',
    },
  ];

  const sortedData = [...leaderboardData].sort((a, b) => {
    switch (sortBy) {
      case 'response':
        return a.responseTime - b.responseTime;
      case 'revenue':
        return b.revenue - a.revenue;
      case 'cases':
        return b.signedCases - a.signedCases;
      case 'conversion':
      default:
        return b.conversionRate - a.conversionRate;
    }
  });

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-orange-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Your Rank Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-dashed border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <p className="text-4xl font-bold text-primary">#{userRank}</p>
              <p className="text-sm text-muted-foreground mt-1">of {totalFirms} firms</p>
            </div>
            <div className="text-right">
              <Award className="w-12 h-12 text-primary/50 mb-2" />
              <p className="text-xs text-muted-foreground">Top 5%</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between gap-4"
      >
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'conversion' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('conversion')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Conversion
          </Button>
          <Button
            variant={sortBy === 'response' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('response')}
          >
            Response Time
          </Button>
          <Button
            variant={sortBy === 'revenue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('revenue')}
          >
            Revenue
          </Button>
          <Button
            variant={sortBy === 'cases' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('cases')}
          >
            Cases
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNames(!showNames)}
          className="gap-2"
        >
          {showNames ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Names
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Names
            </>
          )}
        </Button>
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-dashed border-primary/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Firm
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Market
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Conversion Rate
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Avg Response
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Revenue
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Cases
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((entry, idx) => (
                  <motion.tr
                    key={entry.firmId}
                    className={`border-b border-border hover:bg-secondary/20 transition-colors ${
                      entry.rank === userRank ? 'bg-primary/5' : ''
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {entry.rank <= 3 ? (
                          <Award className={`w-5 h-5 ${getMedalColor(entry.rank)}`} />
                        ) : (
                          <span className="font-semibold text-muted-foreground">#{entry.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-foreground">
                          {showNames ? entry.firmName : `Firm ${entry.rank}`}
                        </p>
                        {entry.rank === userRank && (
                          <Badge variant="outline" className="mt-1 text-xs bg-primary/10">
                            You
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{entry.market}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-foreground">{entry.conversionRate}%</span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                      {entry.responseTime}h
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-foreground">
                        ${(entry.revenue / 1000).toFixed(0)}k
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-foreground">{entry.signedCases}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-muted-foreground bg-secondary/20 rounded-lg p-3"
      >
        <p>
          <Zap className="w-3 h-3 inline mr-1" />
          Firm names are hidden by default to protect client confidentiality. Toggle "Show Names" to reveal firm identities.
        </p>
      </motion.div>
    </div>
  );
}
