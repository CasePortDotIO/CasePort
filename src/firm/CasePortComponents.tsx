import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/* Status Badge Component */
export function StatusBadge({
  status,
}: {
  status: 'Contacted' | 'Outcome Pending' | 'Signed' | 'Closed Lost' | 'Disputed';
}) {
  const statusColors: Record<string, string> = {
    Contacted: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
    'Outcome Pending': 'bg-chart-3/20 text-chart-3 border-chart-3/30',
    Signed: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
    'Closed Lost': 'bg-muted/50 text-muted-foreground border-muted/50',
    Disputed: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]}`}>
      {status}
    </span>
  );
}

/* Outcome Badge Component */
export function OutcomeBadge({
  outcome,
}: {
  outcome: 'Pending' | 'Submitted' | 'Overdue';
}) {
  const outcomeColors: Record<string, string> = {
    Pending: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
    Submitted: 'bg-muted/50 text-muted-foreground border-muted/50',
    Overdue: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${outcomeColors[outcome]}`}>
      {outcome}
    </span>
  );
}

/* Metric Card Component */
export function MetricCard({
  label,
  value,
  subtext,
  color = 'teal',
}: {
  label: string;
  value: string | number;
  subtext?: string;
  color?: 'teal' | 'amber' | 'green' | 'red';
}) {
  const colorClasses: Record<string, string> = {
    teal: 'text-primary',
    amber: 'text-chart-3',
    green: 'text-chart-1',
    red: 'text-destructive',
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-2 font-mono ${colorClasses[color]}`}>{value}</p>
      {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
    </div>
  );
}

/* Qualification Tier Badge */
export function QualificationTierBadge({ tier, score }: { tier: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary">{tier}</span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Qualification Tier</p>
        <p className="text-sm font-semibold text-foreground">{score}/100 Score</p>
      </div>
    </div>
  );
}

/* Response Time Indicator */
export function ResponseTimeIndicator({
  time,
  benchmark,
  market,
}: {
  time: number;
  benchmark: number;
  market: number;
}) {
  const isGood = time <= benchmark;
  const color = isGood ? 'text-chart-1' : time <= market ? 'text-chart-3' : 'text-destructive';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Your response</span>
        <span className={`font-mono font-semibold ${color}`}>{time} min</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Market average</span>
        <span className="font-mono text-muted-foreground">{market} min</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Benchmark</span>
        <span className="font-mono text-muted-foreground">{benchmark} min</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mt-4">
        <div
          className={`h-full ${isGood ? 'bg-chart-1' : 'bg-chart-3'}`}
          style={{ width: `${Math.min((time / market) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

/* Table Cell with CP-ID */
export function CPIDCell({ id }: { id: string }) {
  return <span className="font-mono text-primary font-semibold">{id}</span>;
}

/* Trend Indicator */
export function TrendIndicator({ value, isUp }: { value: string; isUp: boolean }) {
  const Icon = isUp ? TrendingUp : TrendingDown;
  const color = isUp ? 'text-chart-1' : 'text-destructive';

  return (
    <div className={`flex items-center gap-1 ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

/* SOL Alert Card */
export function SOLAlertCard({
  id,
  daysRemaining,
  caseType,
  market,
}: {
  id: string;
  daysRemaining: number;
  caseType: string;
  market: string;
}) {
  const isUrgent = daysRemaining < 90;

  return (
    <div className={`border-l-4 rounded-lg p-4 ${isUrgent ? 'border-chart-3 bg-chart-3/10' : 'border-chart-1 bg-chart-1/10'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-sm font-semibold text-foreground">{id}</p>
          <p className="text-xs text-muted-foreground mt-1">{caseType} · {market}</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold font-mono ${isUrgent ? 'text-chart-3' : 'text-chart-1'}`}>
            {daysRemaining} days
          </p>
          <p className="text-xs text-muted-foreground">remaining</p>
        </div>
      </div>
    </div>
  );
}

/* Outcome Button Group */
export function OutcomeButtonGroup({
  onRetained,
  onNotRetained,
  onEvaluating,
}: {
  onRetained: () => void;
  onNotRetained: () => void;
  onEvaluating: () => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onRetained}
        className="flex-1 px-4 py-2 rounded-lg bg-chart-1/20 text-chart-1 border border-chart-1/30 hover:bg-chart-1/30 transition-colors font-semibold text-sm"
      >
        Retained ✓
      </button>
      <button
        onClick={onNotRetained}
        className="flex-1 px-4 py-2 rounded-lg bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-colors font-semibold text-sm"
      >
        Not Retained ✗
      </button>
      <button
        onClick={onEvaluating}
        className="flex-1 px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground border border-muted/50 hover:bg-muted/70 transition-colors font-semibold text-sm"
      >
        Still Evaluating ○
      </button>
    </div>
  );
}

/* Rank Indicator */
export function RankIndicator({
  label,
  rank,
  total,
  status,
}: {
  label: string;
  rank: number;
  total: number;
  status: 'good' | 'warning' | 'critical';
}) {
  const statusColors: Record<string, string> = {
    good: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
    warning: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
    critical: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  const statusDots: Record<string, string> = {
    good: 'bg-chart-1',
    warning: 'bg-chart-3',
    critical: 'bg-destructive',
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${statusColors[status]}`}>
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${statusDots[status]}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="font-mono font-semibold">
        Rank {rank} of {total}
      </span>
    </div>
  );
}
