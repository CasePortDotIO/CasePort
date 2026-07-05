import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  MetricCard,
  StatusBadge,
  CPIDCell,
  TrendIndicator,
  SOLAlertCard,
} from '@/firm/CasePortComponents';

export default function Dashboard() {
  const [, navigate] = useLocation();

  const mockData = {
    greeting: 'Good morning, Michael',
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }),
    balance: 18400,
    delivered: 8,
    signed: 3,
    signedRate: 37.5,
    signedRateChange: 24,
    responseScore: 71,
  };

  const recentOpportunities = [
    {
      id: 'CP-2026-000089',
      caseType: 'Auto Accident',
      received: '2 hrs ago',
      responseTime: 6,
      status: 'Contacted' as const,
    },
    {
      id: 'CP-2026-000084',
      caseType: 'Auto Accident',
      received: 'Yesterday',
      responseTime: 4,
      status: 'Outcome Pending' as const,
    },
    {
      id: 'CP-2026-000081',
      caseType: 'Slip & Fall',
      received: '2 days ago',
      responseTime: 31,
      status: 'Outcome Pending' as const,
    },
    {
      id: 'CP-2026-000077',
      caseType: 'Auto Accident',
      received: '4 days ago',
      responseTime: 8,
      status: 'Signed' as const,
    },
    {
      id: 'CP-2026-000071',
      caseType: 'Auto Accident',
      received: '6 days ago',
      responseTime: 12,
      status: 'Closed Lost' as const,
    },
  ];

  const handleViewOpportunity = (id: string) => {
    navigate(`/opportunities/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">{mockData.greeting}</h1>
          <p className="text-sm text-muted-foreground">{mockData.date}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-6">
          <MetricCard
            label="Current Balance"
            value={`$${mockData.balance.toLocaleString()}`}
            subtext="Auto top-up at $2,000"
            color="green"
          />
          <MetricCard
            label="Delivered This Month"
            value={mockData.delivered}
            subtext="4 pending outcome"
          />
          <MetricCard
            label="Signed Cases"
            value={mockData.signed}
            subtext={`${mockData.signedRate}% rate · ↑ from ${mockData.signedRateChange}%`}
          />
          <MetricCard
            label="Response Score"
            value={`${mockData.responseScore}/100`}
            subtext="Below benchmark. Target: 85+"
            color="amber"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Recent Opportunities */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">RECENT OPPORTUNITIES</h2>
              <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Case Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Received
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Response Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOpportunities.map((opp) => (
                    <tr
                      key={opp.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleViewOpportunity(opp.id)}
                    >
                      <td className="px-6 py-4">
                        <CPIDCell id={opp.id} />
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{opp.caseType}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{opp.received}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            opp.responseTime <= 8
                              ? 'text-green-400'
                              : opp.responseTime <= 30
                                ? 'text-amber-400'
                                : 'text-red-400'
                          }`}
                        >
                          {opp.responseTime} min
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={opp.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-primary hover:text-primary/80 text-sm font-semibold">
                          Submit Outcome
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Account Health */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                ACCOUNT HEALTH
              </h3>

              <div className="space-y-3 bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Market Rank (Response)</span>
                  <span className="font-mono font-semibold text-foreground">Rank 2 of 3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Market Rank (Signed Rate)</span>
                  <span className="font-mono font-semibold text-green-400">Rank 1 of 3</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                REPORTING COMPLETENESS
              </h3>
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">67%</span>
                  <span className="text-xs text-muted-foreground">Target: 90%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '67%' }} />
                </div>
                <p className="text-xs text-muted-foreground">4 of 12 outcomes pending</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                SOL ALERT
              </h3>
              <SOLAlertCard
                id="CP-2026-000041"
                daysRemaining={87}
                caseType="Auto Accident"
                market="Texas"
              />
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90 text-foreground">
                Submit Overdue Outcomes (3)
              </Button>
              <Button variant="outline" className="w-full">
                Top Up Wallet
              </Button>
              <Button variant="outline" className="w-full">
                View Weekly Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
