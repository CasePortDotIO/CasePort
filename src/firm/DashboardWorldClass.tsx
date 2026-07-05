import { motion } from "framer-motion";
import { Calendar, TrendingUp, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { MetricCardWithSparkline } from "@/firm/MetricCardWithSparkline";
import { SmartRecommendations } from "@/firm/SmartRecommendations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GamificationWidget from "@/firm/GamificationWidget";
import ActivityFeed from "@/firm/ActivityFeed";
import MentionNotificationCenter from "@/firm/MentionNotificationCenter";
import NotificationCenter from "@/firm/NotificationCenter";
import CompulsiveCheckingDashboard from "@/firm/CompulsiveCheckingDashboard";
import BenchmarkingWidget from "@/firm/BenchmarkingWidget";
import WalletReplenishmentWidget from "@/firm/WalletReplenishmentWidget";

// Mock sparkline data (7 days)
const balanceSparkline = [
  { value: 16800 },
  { value: 17200 },
  { value: 16900 },
  { value: 17500 },
  { value: 17800 },
  { value: 18100 },
  { value: 18400 },
];

const deliveredSparkline = [
  { value: 8 },
  { value: 9 },
  { value: 9 },
  { value: 10 },
  { value: 11 },
  { value: 12 },
  { value: 13 },
];

const signedSparkline = [
  { value: 4 },
  { value: 5 },
  { value: 5 },
  { value: 6 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
];

const responseSparkline = [
  { value: 78 },
  { value: 80 },
  { value: 82 },
  { value: 84 },
  { value: 85 },
  { value: 86 },
  { value: 87 },
];

const recentOpportunities = [
  {
    id: "CP-2024-001",
    caseType: "Auto Accident",
    market: "Houston",
    status: "Contacted",
    value: "$45,000",
    daysOpen: 3,
  },
  {
    id: "CP-2024-002",
    caseType: "Slip & Fall",
    market: "Dallas",
    status: "Outcome Pending",
    value: "$32,000",
    daysOpen: 7,
  },
  {
    id: "CP-2024-003",
    caseType: "Auto Accident",
    market: "Austin",
    status: "Signed",
    value: "$78,000",
    daysOpen: 2,
  },
  {
    id: "CP-2024-004",
    caseType: "Medical Malpractice",
    market: "Houston",
    status: "Contacted",
    value: "$125,000",
    daysOpen: 5,
  },
  {
    id: "CP-2024-005",
    caseType: "Product Liability",
    market: "San Antonio",
    status: "Outcome Pending",
    value: "$89,000",
    daysOpen: 4,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Contacted":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case "Outcome Pending":
      return "bg-amber-500/10 text-amber-600 border-amber-200";
    case "Signed":
      return "bg-green-500/10 text-green-600 border-green-200";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200";
  }
};

export default function DashboardWorldClass() {
  const [, navigate] = useLocation();
  
  const today = new Date();
  const greeting =
    today.getHours() < 12
      ? "Good morning"
      : today.getHours() < 18
        ? "Good afternoon"
        : "Good evening";
  
  const handleTopUpWallet = () => {
    navigate('/wallet');
  };
  
  const handleViewWeeklyReport = () => {
    navigate('/performance');
  };

  return (
    <div className="space-y-8">
      {/* Greeting & Date */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, Michael
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <MentionNotificationCenter />
          <Badge variant="outline" className="bg-primary/5 border-primary/20">
            Houston Market
          </Badge>
        </div>
      </motion.div>

      {/* Gamification Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <GamificationWidget />
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
      >
        <ActivityFeed />
      </motion.div>

      {/* Compulsive Checking Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.14 }}
      >
        <CompulsiveCheckingDashboard />
      </motion.div>

      {/* Benchmarking Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
      >
        <BenchmarkingWidget />
      </motion.div>

      {/* Wallet Replenishment Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
      >
        <WalletReplenishmentWidget />
      </motion.div>

      {/* Smart Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <SmartRecommendations />
      </motion.div>

      {/* Metric Cards with Sparklines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCardWithSparkline
          title="Current Balance"
          value="$18,400.00"
          change={9.5}
          sparklineData={balanceSparkline}
          helpText="Available funds in your wallet. Top up when low."
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCardWithSparkline
          title="Delivered This Month"
          value="13"
          change={62.5}
          sparklineData={deliveredSparkline}
          helpText="Cases successfully closed this month."
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <MetricCardWithSparkline
          title="Signed Cases"
          value="8"
          change={100}
          sparklineData={signedSparkline}
          helpText="Total cases signed this month."
          icon={<Zap className="w-5 h-5" />}
        />
        <MetricCardWithSparkline
          title="Response Score"
          value="87/100"
          change={11.4}
          sparklineData={responseSparkline}
          helpText="How quickly you respond to cases. Target: 90+"
          icon={<AlertCircle className="w-5 h-5" />}
        />
      </motion.div>

      {/* Recent Opportunities Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="border border-dashed border-primary rounded-lg p-6 bg-gradient-to-br from-background to-background/80"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recent Opportunities
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-muted">
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  CP-ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Case Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Market
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Days Open
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOpportunities.map((opp, idx) => (
                <motion.tr
                  key={opp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="border-b border-muted hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-primary font-semibold">
                      {opp.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {opp.caseType}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {opp.market}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(opp.status)}`}
                    >
                      {opp.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-foreground">
                    {opp.value}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {opp.daysOpen}d
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Account Health Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Market Rank */}
        <div className="border border-dashed border-primary rounded-lg p-5 bg-gradient-to-br from-background to-background/80">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Market Rank
          </h3>
          <div className="text-2xl font-bold text-primary mb-2">#12</div>
          <p className="text-xs text-muted-foreground">
            Out of 145 firms in Houston market
          </p>
        </div>

        {/* Reporting Completeness */}
        <div className="border border-dashed border-primary rounded-lg p-5 bg-gradient-to-br from-background to-background/80">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Reporting Completeness
          </h3>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-chart-1">67%</div>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className="bg-chart-1 h-full rounded-full transition-all"
                style={{ width: "67%" }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Target: 90%</p>
        </div>

        {/* SOL Alert */}
        <div className="border border-dashed border-destructive/50 rounded-lg p-5 bg-destructive/5">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            SOL Alert
          </h3>
          <div className="text-2xl font-bold text-destructive mb-2">3 Cases</div>
          <p className="text-xs text-muted-foreground">
            Approaching statute of limitations
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex gap-3 flex-wrap"
      >
        <Button className="bg-primary hover:bg-primary/90">
          Submit Overdue Outcomes
        </Button>
        <Button variant="outline" onClick={handleTopUpWallet}>Top Up Wallet</Button>
        <Button variant="outline" onClick={handleViewWeeklyReport}>View Weekly Report</Button>
      </motion.div>
    </div>
  );
}
