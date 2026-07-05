import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NeonCard, StatBox } from '@/firm/CasePortComponentsEnhanced';
import ExportMenu from '@/firm/ExportMenu';

export default function PerformanceEnhanced() {
  const chartData = [
    { week: 'Week 1', your: 8.2, benchmark: 7.5, market: 6.8 },
    { week: 'Week 2', your: 7.9, benchmark: 7.4, market: 6.9 },
    { week: 'Week 3', your: 8.5, benchmark: 7.6, market: 7.1 },
    { week: 'Week 4', your: 8.1, benchmark: 7.5, market: 7.0 },
    { week: 'Week 5', your: 8.8, benchmark: 7.7, market: 7.2 },
    { week: 'Week 6', your: 9.2, benchmark: 7.8, market: 7.3 },
    { week: 'Week 7', your: 8.9, benchmark: 7.9, market: 7.4 },
    { week: 'Week 8', your: 9.5, benchmark: 8.0, market: 7.5 },
    { week: 'Week 9', your: 9.8, benchmark: 8.1, market: 7.6 },
    { week: 'Week 10', your: 10.1, benchmark: 8.2, market: 7.7 },
    { week: 'Week 11', your: 10.5, benchmark: 8.3, market: 7.8 },
    { week: 'Week 12', your: 10.8, benchmark: 8.4, market: 7.9 },
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
        <h1 className="text-2xl font-semibold text-foreground">Performance</h1>
      </motion.div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Response Time Trend */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-foreground">RESPONSE TIME TREND</h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <NeonCard dashed>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="week" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1A1A',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="your"
                    stroke="#0F6E56"
                    strokeWidth={2}
                    name="Your Response Time (min)"
                    dot={{ fill: '#0F6E56' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#1D9E75"
                    strokeWidth={2}
                    name="Benchmark (min)"
                    dot={{ fill: '#1D9E75' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="market"
                    stroke="#888888"
                    strokeWidth={2}
                    name="Market Avg (min)"
                    dot={{ fill: '#888888' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </NeonCard>
          </motion.div>
        </motion.div>

        {/* Signed-Case Rate */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-foreground">SIGNED-CASE RATE</h2>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
            <NeonCard>
              <div className="space-y-4">
                <StatBox label="30-Day Rate" value="37.5%" trend="up" trendValue="+2.1%" />
                <p className="text-xs text-muted-foreground">
                  3 signed cases from 8 delivered
                </p>
              </div>
            </NeonCard>

            <NeonCard>
              <div className="space-y-4">
                <StatBox label="60-Day Rate" value="35.2%" trend="up" trendValue="+1.8%" />
                <p className="text-xs text-muted-foreground">
                  6 signed cases from 17 delivered
                </p>
              </div>
            </NeonCard>

            <NeonCard>
              <div className="space-y-4">
                <StatBox label="90-Day Rate" value="33.1%" trend="neutral" trendValue="Stable" />
                <p className="text-xs text-muted-foreground">
                  10 signed cases from 30 delivered
                </p>
              </div>
            </NeonCard>
          </motion.div>
        </motion.div>

        {/* Market Rank */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-foreground">MARKET RANK</h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <NeonCard dashed>
              <div className="space-y-4">
                {[
                  {
                    label: 'Response Time Rank',
                    rank: 'Rank 2 of 3',
                    status: 'Below benchmark',
                    color: 'text-chart-3',
                  },
                  {
                    label: 'Signed-Case Rate Rank',
                    rank: 'Rank 1 of 3',
                    status: 'Above benchmark',
                    color: 'text-chart-1',
                  },
                  {
                    label: 'Reporting Completeness',
                    rank: 'Rank 1 of 3',
                    status: '67% complete',
                    color: 'text-primary',
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between py-4 border-b border-border last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.status}</p>
                    </div>
                    <p className={`text-lg font-bold font-mono ${item.color}`}>{item.rank}</p>
                  </motion.div>
                ))}
              </div>
            </NeonCard>
          </motion.div>
        </motion.div>

        {/* ROI Summary */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-foreground">ROI SUMMARY (30-Day)</h2>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
            <NeonCard>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Opportunities
                </p>
                <p className="text-3xl font-bold text-primary">8</p>
                <p className="text-xs text-muted-foreground">Delivered this month</p>
              </div>
            </NeonCard>

            <NeonCard>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Signed Cases
                </p>
                <p className="text-3xl font-bold text-chart-1">3</p>
                <p className="text-xs text-muted-foreground">37.5% conversion rate</p>
              </div>
            </NeonCard>

            <NeonCard>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Gross Revenue
                </p>
                <p className="text-3xl font-bold text-primary">$1.2M</p>
                <p className="text-xs text-muted-foreground">Estimated case value</p>
              </div>
            </NeonCard>

            <NeonCard>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  ROI
                </p>
                <p className="text-3xl font-bold text-chart-1">267%</p>
                <p className="text-xs text-muted-foreground">Return on investment</p>
              </div>
            </NeonCard>
          </motion.div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-foreground">CASEPORT RECOMMENDATIONS</h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <NeonCard dashed>
              <div className="space-y-4 border-l-4 border-primary pl-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Improve Response Time</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    You're currently 1.4 minutes slower than benchmark. Reducing response time by 2
                    minutes could increase your signed-case rate by 3-5%.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Complete Overdue Outcomes
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    3 outcomes are overdue. Firms with 90%+ reporting completeness receive priority
                    routing. You're at 67%.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Maintain Signed-Case Rate</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your 37.5% rate is excellent. Continue focusing on high-quality intake and
                    follow-up.
                  </p>
                </div>
              </div>
            </NeonCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.a
              whileHover={{ x: 2 }}
              href="#"
              onClick={(e) => { e.preventDefault(); toast.info('Preparing your Case Economics report. It will download shortly.'); }}
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-semibold"
            >
              Download Full Case Economics Report
              <TrendingUp className="w-4 h-4" />
            </motion.a>
            <p className="text-xs text-muted-foreground mt-2">Next report: May 21, 2026</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
