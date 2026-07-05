import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard, Badge, NeonCard, StatBox, ProgressBar } from '@/firm/CasePortComponentsEnhanced';

export default function DashboardEnhanced() {
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
        className="border-b border-border bg-secondary px-8 py-6 space-y-2"
      >
        <h1 className="text-2xl font-semibold text-foreground">Good morning, Michael</h1>
        <p className="text-sm text-muted-foreground">Tuesday, April 21</p>
      </motion.div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Metric Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants}>
            <MetricCard
              label="Current Balance"
              value="$18,400"
              subtext="Auto top-up at $2,000"
              highlight
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <MetricCard
              label="Delivered This Month"
              value="8"
              subtext="4 pending outcome"
              highlight
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <MetricCard
              label="Signed Cases"
              value="3"
              subtext="37.5% rate ↑ from 24%"
              highlight
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <MetricCard
              label="Response Score"
              value="71/100"
              subtext="Below benchmark. Target: 85+"
            />
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Recent Opportunities */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="col-span-2 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">RECENT OPPORTUNITIES</h2>
              <motion.a
                whileHover={{ x: 4 }}
                href="/opportunities"
                className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-semibold"
              >
                View All <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>

            <NeonCard dashed glow="cyan">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Case Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Received
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Response Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    {
                      id: 'CP-2026-000089',
                      type: 'Auto Accident',
                      received: '2 hrs ago',
                      time: '6 min ✓',
                      status: 'Contacted',
                    },
                    {
                      id: 'CP-2026-000084',
                      type: 'Auto Accident',
                      received: 'Yesterday',
                      time: '4 min ✓',
                      status: 'Outcome Pending',
                    },
                    {
                      id: 'CP-2026-000081',
                      type: 'Slip & Fall',
                      received: '2 days ago',
                      time: '31 min',
                      status: 'Outcome Pending',
                    },
                    {
                      id: 'CP-2026-000078',
                      type: 'Auto Accident',
                      received: '3 days ago',
                      time: '19 min',
                      status: 'Signed',
                    },
                    {
                      id: 'CP-2026-000075',
                      type: 'Premises Liability',
                      received: '5 days ago',
                      time: '8 min ✓',
                      status: 'Closed Lost',
                    },
                  ].map((row, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-primary">{row.id}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{row.type}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{row.received}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{row.time}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            row.status === 'Contacted'
                              ? 'default'
                              : row.status === 'Outcome Pending'
                                ? 'warning'
                                : row.status === 'Signed'
                                  ? 'success'
                                  : 'error'
                          }
                        >
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="text-primary hover:text-primary/80 text-sm font-semibold"
                        >
                          Submit Outcome
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </NeonCard>
          </motion.div>

          {/* Right Column - Account Health */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground">ACCOUNT HEALTH</h2>

            <NeonCard glow="cyan">
              <div className="space-y-6">
                <StatBox label="Market Rank (Response)" value="Rank 2 of 3" />
                <StatBox label="Market Rank (Signed Rate)" value="Rank 1 of 3" />

                <div className="border-t border-border pt-4">
                  <ProgressBar
                    label="Reporting Completeness"
                    value={67}
                    max={100}
                    showPercent
                    color="cyan"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Target: 90%</p>
                </div>

                <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-destructive">SOL ALERT</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono font-semibold text-primary">CP-2026-000841</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Auto Accident · Texas</p>
                  <p className="text-lg font-bold text-destructive">87 days remaining</p>
                </div>
              </div>
            </NeonCard>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">QUICK ACTIONS</h3>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Submit Overdue Outcome
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full">
                  Top Up Wallet
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full">
                  View Weekly Report
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
