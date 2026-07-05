import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const cohortData = [
  { month: 'Jan', retention: 100, churn: 0 },
  { month: 'Feb', retention: 92, churn: 8 },
  { month: 'Mar', retention: 85, churn: 15 },
  { month: 'Apr', retention: 78, churn: 22 },
  { month: 'May', retention: 72, churn: 28 },
  { month: 'Jun', retention: 68, churn: 32 },
];

const funnelData = [
  { stage: 'Opportunities', value: 1200, fill: '#0F6E56' },
  { stage: 'Contacted', value: 890, fill: '#1D9E75' },
  { stage: 'Signed', value: 450, fill: '#0A9E6D' },
  { stage: 'Completed', value: 320, fill: '#067D5A' },
];

const attributionData = [
  { source: 'Referral', roi: 3.2, cases: 145 },
  { source: 'Direct', roi: 2.8, cases: 98 },
  { source: 'Search', roi: 2.1, cases: 67 },
  { source: 'Social', roi: 1.5, cases: 34 },
];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Advanced Analytics</h1>
        <p className="text-muted-foreground">Cohort analysis, funnel metrics, and ROI attribution</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="p-4 border-dashed border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">LTV:CAC Ratio</div>
                <div className="text-2xl font-bold text-primary">3.2:1</div>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/50" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 border-dashed border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Avg Case Value</div>
                <div className="text-2xl font-bold">$12,450</div>
              </div>
              <DollarSign className="h-8 w-8 text-primary/50" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 border-dashed border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
                <div className="text-2xl font-bold">37.5%</div>
              </div>
              <Target className="h-8 w-8 text-primary/50" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 border-dashed border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Churn Rate</div>
                <div className="text-2xl font-bold">8.2%</div>
              </div>
              <Users className="h-8 w-8 text-primary/50" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Cohort Retention */}
      <Card className="p-6 border-dashed border-primary/30">
        <h2 className="text-lg font-bold mb-4">Cohort Retention Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cohortData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="retention" stroke="#0F6E56" strokeWidth={2} />
            <Line type="monotone" dataKey="churn" stroke="#E24B4A" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Funnel Analysis */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 border-dashed border-primary/30">
          <h2 className="text-lg font-bold mb-4">Conversion Funnel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0F6E56" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-dashed border-primary/30">
          <h2 className="text-lg font-bold mb-4">Funnel Breakdown</h2>
          <div className="space-y-3">
            {funnelData.map((item, idx) => {
              const percent = ((item.value / funnelData[0].value) * 100).toFixed(1);
              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.stage}</span>
                    <span className="text-muted-foreground">{item.value} ({percent}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.fill }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Attribution Analysis */}
      <Card className="p-6 border-dashed border-primary/30">
        <h2 className="text-lg font-bold mb-4">Channel Attribution & ROI</h2>
        <div className="grid grid-cols-4 gap-4">
          {attributionData.map((channel) => (
            <motion.div
              key={channel.source}
              className="p-4 rounded-lg bg-secondary/50"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-sm font-semibold text-muted-foreground">{channel.source}</div>
              <div className="text-2xl font-bold text-primary mt-1">{channel.roi}x</div>
              <div className="text-xs text-muted-foreground mt-2">{channel.cases} cases</div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
