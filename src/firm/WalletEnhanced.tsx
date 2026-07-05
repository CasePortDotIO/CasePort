import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { NeonCard, ProgressBar } from '@/firm/CasePortComponentsEnhanced';
import ExportMenu from '@/firm/ExportMenu';
import InvestmentLayer from '@/firm/InvestmentLayer';

export default function WalletEnhanced() {
  const [, navigate] = useLocation();
  const [autoTopUpEnabled, setAutoTopUpEnabled] = useState(true);

  const ledgerEntries = [
    {
      date: 'Apr 20 09:20',
      description: 'CP-2026-000089 · Auto Accident',
      type: 'Delivery',
      amount: -450,
      balance: 18400,
    },
    {
      date: 'Apr 20 09:14',
      description: 'CP-2026-000089',
      type: 'Hold Placed',
      amount: -450,
      balance: 18850,
      isPending: true,
    },
    {
      date: 'Apr 19 14:33',
      description: 'CP-2026-000084 · Auto Accident',
      type: 'Delivery',
      amount: -450,
      balance: 18850,
    },
    {
      date: 'Apr 18 10:11',
      description: 'Wallet Top-Up via Stripe',
      type: 'Top-Up',
      amount: 10000,
      balance: 19300,
    },
    {
      date: 'Apr 17 11:45',
      description: 'CP-2026-000081 · Slip & Fall',
      type: 'Delivery',
      amount: -350,
      balance: 9300,
    },
    {
      date: 'Apr 16 09:30',
      description: 'CP-2026-000077 · Auto Accident',
      type: 'Delivery',
      amount: -450,
      balance: 9750,
    },
    {
      date: 'Apr 15 16:45',
      description: 'Wallet Top-Up via Stripe',
      type: 'Top-Up',
      amount: 5000,
      balance: 10200,
    },
    {
      date: 'Apr 14 12:20',
      description: 'CP-2026-000072 · Auto Accident',
      type: 'Delivery',
      amount: -450,
      balance: 5200,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-secondary px-8 py-6"
      >
        <h1 className="text-2xl font-semibold text-foreground">Wallet</h1>
      </motion.div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Investment Layer - Sunk Cost Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <InvestmentLayer
            walletBalance={18400}
            walletThreshold={2000}
            currentRank={8}
            totalFirms={156}
            casesAccepted={35}
            conversionRate={22.4}
          />
        </motion.div>

        {/* Balance Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Main Balance Card */}
          <motion.div variants={itemVariants}>
            <NeonCard dashed>
              <div className="space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Current Balance
                </p>
                <p className="text-5xl font-bold font-mono text-primary">$18,400.00</p>
                <p className="text-sm text-muted-foreground">
                  Auto top-up enabled at $2,000 threshold
                </p>
              </div>
            </NeonCard>
          </motion.div>

          {/* Status Cards Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            {/* On Hold Card */}
            <NeonCard>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  On Hold
                </p>
                <p className="text-2xl font-bold font-mono text-primary">$450.00</p>
                <p className="text-xs text-muted-foreground italic">
                  Pending outcome for CP-2026-000089
                </p>
              </div>
            </NeonCard>

            {/* Auto Top-Up Card */}
            <NeonCard>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Auto Top-Up
                  </p>
                  <Switch
                    checked={autoTopUpEnabled}
                    onCheckedChange={setAutoTopUpEnabled}
                  />
                </div>
                <p className="text-sm text-foreground">
                  {autoTopUpEnabled ? 'Enabled' : 'Disabled'}
                </p>
                <motion.a
                  whileHover={{ x: 2 }}
                  href="/firm/settings"
                  onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
                  className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
                >
                  Configure Settings <ArrowRight className="w-3 h-3" />
                </motion.a>
              </div>
            </NeonCard>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => toast.info('Wallet funding is processed securely through Stripe.')}
              >
                Top Up Wallet
              </Button>
            </motion.div>
            <ExportMenu
              data={ledgerEntries}
              filename="wallet-ledger"
              title="Export Ledger"
            />
            <motion.a
              whileHover={{ x: 2 }}
              href="#ledger"
              onClick={(e) => { e.preventDefault(); toast.info('The full ledger is shown below, newest first.'); }}
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-semibold ml-auto"
            >
              View Full History <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Ledger Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground">RECENT LEDGER</h2>

          <NeonCard dashed>
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ledgerEntries.map((entry, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground">{entry.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={entry.isPending ? 'italic text-muted-foreground' : ''}>
                        {entry.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={
                          entry.type === 'Top-Up'
                            ? 'text-chart-1'
                            : entry.type === 'Hold Placed'
                              ? 'text-chart-3'
                              : 'text-foreground'
                        }
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono">
                      <span
                        className={
                          entry.amount > 0 ? 'text-chart-1' : 'text-foreground'
                        }
                      >
                        {entry.amount > 0 ? '+' : ''} ${Math.abs(entry.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono text-primary font-semibold">
                      ${entry.balance.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </NeonCard>
        </motion.div>
      </div>
    </div>
  );
}
