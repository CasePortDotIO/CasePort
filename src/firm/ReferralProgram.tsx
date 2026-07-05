import { motion } from 'framer-motion';
import { Share2, Users, DollarSign, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Referral {
  id: string;
  firmName: string;
  status: 'pending' | 'active' | 'earned';
  commissionEarned: number;
}

const referrals: Referral[] = [
  { id: '1', firmName: 'Smith & Associates', status: 'active', commissionEarned: 0 },
  { id: '2', firmName: 'Johnson Law Group', status: 'active', commissionEarned: 1200 },
  { id: '3', firmName: 'Williams Legal', status: 'earned', commissionEarned: 2400 },
];

export default function ReferralProgram() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://www.caseport.io/ref/CHEN123';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalEarnings = referrals.reduce((sum, ref) => sum + ref.commissionEarned, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Referral Program</h2>
        <p className="text-sm text-muted-foreground">
          Earn wallet credits for every firm you refer
        </p>
      </div>

      {/* Program Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Earned', value: `$${totalEarnings}`, icon: DollarSign },
          { label: 'Active Referrals', value: referrals.filter(r => r.status === 'active').length, icon: Users },
          { label: 'Commission Rate', value: '15%', icon: Share2 },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-4 border-border text-center">
                <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-light text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Share Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 border-border">
          <p className="text-sm font-semibold text-foreground mb-4">Your Referral Link</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Share this link with other firms. When they sign up and fund their wallet, you earn 15% commission.
          </p>
        </Card>
      </motion.div>

      {/* Referral List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">Your Referrals</h3>
        <div className="space-y-3">
          {referrals.map((ref, idx) => (
            <motion.div
              key={ref.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05 }}
            >
              <Card className="p-4 border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{ref.firmName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ref.status === 'pending' && 'Awaiting signup'}
                      {ref.status === 'active' && 'Active member'}
                      {ref.status === 'earned' && 'Commission earned'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        ref.status === 'pending'
                          ? 'bg-gray-500/20 text-gray-700 border-gray-300'
                          : ref.status === 'active'
                          ? 'bg-blue-500/20 text-blue-700 border-blue-300'
                          : 'bg-green-500/20 text-green-700 border-green-300'
                      }
                    >
                      {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                    </Badge>
                    {ref.commissionEarned > 0 && (
                      <p className="text-sm font-semibold text-primary mt-2">
                        +${ref.commissionEarned}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-primary/10 border border-primary/20 rounded-lg p-4"
      >
        <p className="text-sm font-semibold text-foreground mb-3">How It Works</p>
        <ol className="text-xs space-y-2 text-muted-foreground">
          <li>1. Share your referral link with other firms</li>
          <li>2. They sign up and fund their wallet</li>
          <li>3. You earn 15% of their first wallet deposit</li>
          <li>4. Commission is added to your wallet automatically</li>
        </ol>
      </motion.div>
    </div>
  );
}
