import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OutcomeButtonGroup } from '@/firm/CasePortComponents';

export default function OutcomeFeedback() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const overdueOpportunities = [
    {
      id: 'CP-2026-000065',
      caseType: 'Auto Accident',
      market: 'Houston',
      deliveredDaysAgo: 9,
      responseTime: 19,
    },
    {
      id: 'CP-2026-000058',
      caseType: 'Slip & Fall',
      market: 'Houston',
      deliveredDaysAgo: 12,
      responseTime: 7,
    },
    {
      id: 'CP-2026-000051',
      caseType: 'Auto Accident',
      market: 'Houston',
      deliveredDaysAgo: 16,
      responseTime: 4,
    },
  ];

  const pendingOpportunities = [
    {
      id: 'CP-2026-000089',
      caseType: 'Auto Accident',
      market: 'Houston',
      deliveredDaysAgo: 0,
      responseTime: 6,
    },
    {
      id: 'CP-2026-000084',
      caseType: 'Auto Accident',
      market: 'Houston',
      deliveredDaysAgo: 1,
      responseTime: 4,
    },
  ];

  const completedOutcomes = [
    { id: 'CP-2026-000077', result: 'Retained', date: 'Apr 20, 2026' },
    { id: 'CP-2026-000071', result: 'Not Retained', date: 'Apr 19, 2026' },
    { id: 'CP-2026-000062', result: 'Retained', date: 'Apr 18, 2026' },
    { id: 'CP-2026-000055', result: 'Not Retained', date: 'Apr 17, 2026' },
    { id: 'CP-2026-000048', result: 'Retained', date: 'Apr 16, 2026' },
    { id: 'CP-2026-000041', result: 'Still Evaluating', date: 'Apr 15, 2026' },
  ];

  const reasons = [
    'Unreachable claimant',
    'Already represented',
    'Insufficient injury',
    'Client declined',
    'Other firm was faster',
    'Wrong case type',
    'Other',
  ];

  const handleNotRetained = (id: string) => {
    setExpandedCard(id);
    setSelectedReason(null);
  };

  const handleSubmit = () => {
    console.log('Submitted outcome for', expandedCard, 'with reason:', selectedReason);
    setExpandedCard(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <h1 className="text-2xl font-semibold text-foreground">Outcome Feedback</h1>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Alert Bar */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300">
              3 outcomes are overdue. Firms with 90%+ reporting completeness receive priority routing.
            </p>
          </div>
        </div>

        {/* Reporting Completeness */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Reporting Completeness
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '67%' }} />
            </div>
            <span className="text-sm font-semibold text-foreground">67%</span>
            <span className="text-xs text-muted-foreground">Target: 90%</span>
          </div>
        </div>

        {/* Overdue Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">OVERDUE — ACTION REQUIRED</h2>

          {overdueOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-card border border-border rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono font-semibold text-primary text-lg">{opp.id}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {opp.caseType} · {opp.market}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Delivered {opp.deliveredDaysAgo} days ago · Response time: {opp.responseTime} min
                  </p>
                </div>
              </div>

              {expandedCard === opp.id ? (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Why wasn't this case retained?
                    </p>
                    <div className="space-y-2">
                      {reasons.map((reason) => (
                        <label key={reason} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name={`reason-${opp.id}`}
                            value={reason}
                            checked={selectedReason === reason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="rounded-full"
                          />
                          <span className="text-sm text-foreground">{reason}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedReason}
                    className="w-full bg-primary hover:bg-primary/90 text-foreground disabled:opacity-50"
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                <OutcomeButtonGroup
                  onRetained={() => console.log('Retained:', opp.id)}
                  onNotRetained={() => handleNotRetained(opp.id)}
                  onEvaluating={() => console.log('Evaluating:', opp.id)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Pending Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">PENDING (Last 14 days)</h2>

          {pendingOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-card border border-border rounded-lg p-6 space-y-4"
            >
              <div>
                <p className="font-mono font-semibold text-primary text-lg">{opp.id}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {opp.caseType} · {opp.market}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Delivered {opp.deliveredDaysAgo} days ago · Response time: {opp.responseTime} min
                </p>
              </div>

              <OutcomeButtonGroup
                onRetained={() => console.log('Retained:', opp.id)}
                onNotRetained={() => handleNotRetained(opp.id)}
                onEvaluating={() => console.log('Evaluating:', opp.id)}
              />
            </div>
          ))}
        </div>

        {/* Completed Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">COMPLETED</h2>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {completedOutcomes.map((outcome) => (
                  <tr key={outcome.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-primary">{outcome.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          outcome.result === 'Retained'
                            ? 'text-green-400'
                            : outcome.result === 'Not Retained'
                              ? 'text-red-400'
                              : 'text-amber-400'
                        }`}
                      >
                        {outcome.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{outcome.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
