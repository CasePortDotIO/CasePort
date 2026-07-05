import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricCard, RankIndicator, TrendIndicator } from '@/firm/CasePortComponents';

export default function Performance() {
  const responseTimeData = [
    { week: 'W1', your: 31, benchmark: 8, market: 22 },
    { week: 'W2', your: 28, benchmark: 8, market: 20 },
    { week: 'W3', your: 25, benchmark: 8, market: 19 },
    { week: 'W4', your: 23, benchmark: 8, market: 18 },
    { week: 'W5', your: 21, benchmark: 8, market: 17 },
    { week: 'W6', your: 19, benchmark: 8, market: 16 },
    { week: 'W7', your: 18, benchmark: 8, market: 16 },
    { week: 'W8', your: 17, benchmark: 8, market: 15 },
    { week: 'W9', your: 16, benchmark: 8, market: 15 },
    { week: 'W10', your: 15, benchmark: 8, market: 14 },
    { week: 'W11', your: 14, benchmark: 8, market: 14 },
    { week: 'W12', your: 19, benchmark: 8, market: 14 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <h1 className="text-2xl font-semibold text-foreground">Performance</h1>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Response Time Trend */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">RESPONSE TIME TREND</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="week" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#F5F5F5' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="your"
                  stroke="#0F6E56"
                  strokeWidth={2}
                  dot={false}
                  name="Your Response"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#FFFFFF"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Benchmark"
                />
                <Line
                  type="monotone"
                  dataKey="market"
                  stroke="#888888"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Market Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signed-Case Rate */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">SIGNED-CASE RATE</h2>
          <div className="grid grid-cols-3 gap-6">
            <MetricCard
              label="30-Day"
              value="37.5%"
              subtext="↑ from 24%"
              color="green"
            />
            <MetricCard
              label="60-Day"
              value="31%"
              subtext="↑ from 28%"
              color="green"
            />
            <MetricCard
              label="90-Day"
              value="24%"
              subtext="Stable"
            />
          </div>
        </div>

        {/* Market Rank */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">MARKET RANK — HOUSTON</h2>
          <div className="space-y-3">
            <RankIndicator
              label="Response Time"
              rank={2}
              total={3}
              status="warning"
            />
            <RankIndicator
              label="Signed-Case Rate"
              rank={1}
              total={3}
              status="good"
            />
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Signed-Case Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">Rank 1 of 3</span>
                <span className="text-xs text-green-400">↑ Moved up from Rank 2 last month</span>
              </div>
            </div>
            <RankIndicator
              label="Outcome Reporting"
              rank={3}
              total={3}
              status="critical"
            />
          </div>
        </div>

        {/* ROI Summary */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">ROI SUMMARY — 6 MONTH REVIEW</h2>
          <div className="grid grid-cols-2 gap-6">
            <MetricCard
              label="Opportunities Received"
              value="28"
            />
            <MetricCard
              label="Confirmed Signed Cases"
              value="7"
              color="green"
            />
            <MetricCard
              label="Estimated Gross Revenue"
              value="~$142,800"
              color="green"
            />
            <MetricCard
              label="Estimated ROI"
              value="170%"
              color="green"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Full Case Economics Report available · Next report: October 2026
          </p>
        </div>

        {/* Recommendations */}
        <div className="bg-card border-l-4 border-l-primary border border-border rounded-lg p-6 space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            CASEPORT RECOMMENDATIONS
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            Your B-tier signing rate is 0% in the past 30 days. Your A-tier rate is 44%. This pattern
            typically indicates a follow-up breakdown on lower-urgency cases, not a lead quality issue.
            Consider reviewing your secondary outreach process for cases where the claimant did not pick
            up on first call.
          </p>
        </div>
      </div>
    </div>
  );
}
