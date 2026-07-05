import { motion } from 'framer-motion';
import { ShieldCheck, Timer, PenLine, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';

/*
 * Market Standing. The institutional reframing of the old gamification widget:
 * no levels, no points, no streaks to "keep up", no emoji badges. A managing
 * partner sees where the firm ranks, its percentile, its SLA consistency, and a
 * factual track record. Terminal grade, not consumer app.
 */
export default function GamificationWidget() {
  const standing = {
    rank: 8,
    totalFirms: 156,
    slaStreakDays: 23,
    trackRecord: [
      { icon: Timer, label: 'Responses logged', value: '100+' },
      { icon: PenLine, label: 'Cases signed', value: '50' },
      { icon: Gauge, label: 'Median response', value: '12m' },
    ],
  };
  const percentile = Math.round((1 - standing.rank / standing.totalFirms) * 100);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.13em] text-muted-foreground">Market standing</div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[32px] leading-none font-light tabular-nums text-foreground">#{standing.rank}</span>
            <span className="text-sm text-muted-foreground">of {standing.totalFirms} firms in Houston</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.13em] text-muted-foreground">Percentile</div>
          <div className="mt-1.5 text-2xl font-light tabular-nums" style={{ color: 'var(--pos)' }}>Top {100 - percentile}%</div>
        </div>
      </div>

      <div className="h-1.5 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          className="h-1.5 rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--accent-bright), var(--pos))' }}
          initial={{ width: 0 }}
          animate={{ width: `${percentile}%` }}
          transition={{ duration: 1 }}
        />
      </div>

      <div className="flex items-center gap-2.5 rounded-lg p-3 mb-6" style={{ background: 'rgba(245,181,68,0.09)', border: '1px solid rgba(245,181,68,0.18)' }}>
        <ShieldCheck className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--warn)' }} />
        <span className="text-sm text-foreground">
          <b className="font-semibold">{standing.slaStreakDays} consecutive days</b> meeting your contractual callback window.
        </span>
      </div>

      <div className="text-[11px] uppercase tracking-[0.13em] text-muted-foreground mb-3">Track record</div>
      <div className="grid grid-cols-3 gap-3">
        {standing.trackRecord.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="rounded-lg p-3.5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Icon className="h-4 w-4 text-muted-foreground mb-2.5" />
              <div className="text-xl font-light tabular-nums text-foreground">{t.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{t.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
