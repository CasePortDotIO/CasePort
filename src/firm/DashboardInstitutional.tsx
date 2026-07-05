import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { ArrowRight, ArrowUpRight, ArrowDownRight, Phone, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firm/useAuth';
import GamificationWidget from '@/firm/GamificationWidget';
import BenchmarkingWidget from '@/firm/BenchmarkingWidget';
import WalletReplenishmentWidget from '@/firm/WalletReplenishmentWidget';
import BloombergClock from '@/firm/BloombergClock';
import RevenueAnalytics from '@/firm/RevenueAnalytics';

/*
 * Calibrated semantic palette. Kept separate from the brand teal so meaning
 * (good / attention / critical) never competes with identity. These shades are
 * tuned for legibility on the near black ground, brighter than Tailwind's
 * default -600/-700 which read muddy on dark.
 */
const POS = '#34d39a'; // emerald, positive movement
const NEG = '#fb7185'; // rose, negative movement
const WARN = '#f5b544'; // amber, needs attention
const TEAL = '#22c58d'; // brightened brand accent for key moments

interface Metric {
  label: string;
  hint: string;
  value: string;
  unit?: string;
  delta: string;
  deltaTone: 'pos' | 'neg' | 'flat';
  series: number[];
}

const primaryMetrics: Metric[] = [
  { label: 'Cost per signed case', hint: 'Your true acquisition cost. The number that beats Google Ads.', value: '$2,240', delta: '38% under Google Ads', deltaTone: 'pos', series: [4100, 3800, 3400, 3100, 2900, 2600, 2400, 2240] },
  { label: 'Cases signed', hint: 'Signed this month across your markets.', value: '35', delta: '+5 vs. last month', deltaTone: 'pos', series: [22, 24, 23, 27, 29, 31, 33, 35] },
  { label: 'Conversion rate', hint: 'Delivered opportunities that became signed cases.', value: '22.4', unit: '%', delta: '+2.1 pts', deltaTone: 'pos', series: [17, 18, 18.5, 19.4, 20, 21, 21.6, 22.4] },
  { label: 'Response time', hint: 'Median time to first contact. Your SLA is 15 min.', value: '12', unit: 'min', delta: '3 min faster', deltaTone: 'pos', series: [21, 19, 18, 16, 15, 14, 13, 12] },
];

interface Opp {
  id: string;
  type: string;
  market: string;
  status: 'New' | 'Contacted' | 'Signed';
  probability: string;
  waiting?: string;
}

const recentOpportunities: Opp[] = [
  { id: 'CP-2026-000089', type: 'Auto Accident', market: 'Houston', status: 'New', probability: '87%', waiting: '6 min ago' },
  { id: 'CP-2026-000090', type: 'Truck Accident', market: 'Houston', status: 'New', probability: '81%', waiting: '14 min ago' },
  { id: 'CP-2026-000088', type: 'Slip & Fall', market: 'Dallas', status: 'Signed', probability: '92%' },
  { id: 'CP-2026-000087', type: 'Workers Comp', market: 'Austin', status: 'Contacted', probability: '71%' },
];

/* A dependency free SVG sparkline. Area fill plus an emphasized endpoint. */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 104;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const last = pts[pts.length - 1];
  const id = `sg-${color.replace('#', '')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={color} />
    </svg>
  );
}

const statusStyle: Record<Opp['status'], { dot: string; text: string; bg: string }> = {
  New: { dot: WARN, text: '#f7c873', bg: 'rgba(245,181,68,0.12)' },
  Contacted: { dot: '#6ea8ff', text: '#a9c8ff', bg: 'rgba(110,168,255,0.12)' },
  Signed: { dot: POS, text: '#7fe3ba', bg: 'rgba(52,211,154,0.12)' },
};

export default function DashboardInstitutional() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const firstName = (user?.name ?? 'Partner').split(' ')[0];
  const newCount = recentOpportunities.filter((o) => o.status === 'New').length;

  return (
    <div className="min-h-screen bg-background">
      <BloombergClock />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/[0.07] bg-background/70 backdrop-blur-md sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-8 py-7">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 className="text-[28px] leading-none font-light tracking-tight text-foreground mb-2">
                Good afternoon, {firstName}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Houston market
                <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: POS }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: POS, boxShadow: `0 0 8px ${POS}` }} />
                  Exclusive · live
                </span>
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.18em] mb-1">Market rank</p>
              <p className="text-2xl font-semibold text-foreground tabular-nums">#8<span className="text-muted-foreground text-base font-normal"> / 156</span></p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 py-9">
        {/* Hero: what needs you now. The single most important navigation cue. */}
        {newCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/opportunities')}
            className="group w-full text-left mb-8 rounded-2xl border p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors"
            style={{ borderColor: 'rgba(245,181,68,0.28)', background: 'linear-gradient(120deg, rgba(245,181,68,0.10), rgba(245,181,68,0.02) 60%)' }}
          >
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 w-11 h-11 rounded-full grid place-items-center" style={{ background: 'rgba(245,181,68,0.16)' }}>
                <Phone className="w-5 h-5" style={{ color: WARN }} />
              </span>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {newCount} {newCount === 1 ? 'opportunity needs' : 'opportunities need'} your first call
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Call inside your 15 minute window while the claimant is still expecting you.
                </p>
              </div>
            </div>
            <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold pr-1" style={{ color: WARN }}>
              Review now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </motion.button>
        )}

        {/* Primary metrics with sparklines. First card is the hero metric. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {primaryMetrics.map((m, idx) => {
            const tone = m.deltaTone === 'pos' ? POS : m.deltaTone === 'neg' ? NEG : 'var(--muted-foreground)';
            const isHero = idx === 0;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + idx * 0.05 }}
              >
                <Card
                  title={m.hint}
                  className="relative p-5 h-full border-white/[0.08] overflow-hidden transition-all hover:border-white/20 hover:-translate-y-0.5"
                  style={{
                    background: isHero
                      ? 'linear-gradient(150deg, rgba(34,197,141,0.10), rgba(255,255,255,0.02))'
                      : 'linear-gradient(160deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))',
                    borderColor: isHero ? 'rgba(34,197,141,0.28)' : undefined,
                  }}
                >
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.13em] mb-3 pr-2">
                    {m.label}
                  </p>
                  <div className="flex items-end justify-between gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[32px] leading-none font-light tracking-tight text-foreground tabular-nums">{m.value}</span>
                      {m.unit && <span className="text-sm text-muted-foreground">{m.unit}</span>}
                    </div>
                    <Sparkline data={m.series} color={isHero ? TEAL : tone === POS ? POS : 'var(--muted-foreground)'} />
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium" style={{ color: tone }}>
                    {m.deltaTone === 'pos' ? <ArrowUpRight className="w-3.5 h-3.5" /> : m.deltaTone === 'neg' ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
                    {m.delta}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Two column: opportunities + summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Recent opportunities</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Delivered to your markets, newest first</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/opportunities')}>
                View all <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            <Card className="border-white/[0.08] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)' }}>
              <div className="divide-y divide-white/[0.06]">
                {recentOpportunities.map((opp, idx) => {
                  const s = statusStyle[opp.status];
                  return (
                    <motion.button
                      key={opp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      onClick={() => navigate(`/opportunity/${opp.id}`)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="font-medium text-foreground">{opp.type}</span>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: s.text, background: s.bg }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                            {opp.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                          <span className="font-mono text-[12px]">{opp.id}</span>
                          <span>{opp.market}</span>
                          {opp.waiting && <span style={{ color: WARN }}>{opp.waiting}</span>}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">This month</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Your performance summary</p>
            </div>

            <div className="space-y-4">
              <Card className="p-5 border-white/[0.08]" title="Share of delivered opportunities your firm accepted." style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.13em]">Acceptance rate</p>
                  <span className="text-sm font-semibold" style={{ color: POS }}>68%</span>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-1.5 rounded-full" style={{ width: '68%', background: `linear-gradient(90deg, ${TEAL}, ${POS})` }} />
                </div>
              </Card>

              <Card className="p-5 border-white/[0.08]" title="Average signed case value across your markets." style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.13em] mb-2">Avg case value</p>
                <p className="text-[28px] leading-none font-light tracking-tight text-foreground tabular-nums">$65,000</p>
                <p className="text-xs mt-2 flex items-center gap-1" style={{ color: POS }}><ArrowUpRight className="w-3.5 h-3.5" />12% above market average</p>
              </Card>

              <Card className="p-5 border-white/[0.08]" title="Signed cases this month, pacing to quarter." style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.13em] mb-2">Cases this month</p>
                <p className="text-[28px] leading-none font-light tracking-tight text-foreground tabular-nums">12</p>
                <p className="text-xs text-muted-foreground mt-2">On pace for 45 this quarter</p>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Trust line: the Glass Box promise, quietly stated. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12 flex items-center gap-2.5 text-[13px] text-muted-foreground"
        >
          <ShieldCheck className="w-4 h-4" style={{ color: TEAL }} />
          Every figure here traces to your ledger and your market. Nothing is estimated, nothing is shared.
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
          <RevenueAnalytics />
        </motion.div>

        <div className="space-y-12 mt-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-foreground">Market comparison</h2>
              <p className="text-sm text-muted-foreground mt-0.5">How you compare to market averages</p>
            </div>
            <BenchmarkingWidget />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}>
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-foreground">Wallet &amp; billing</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Manage your pre-funded wallet</p>
            </div>
            <WalletReplenishmentWidget />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.66 }}>
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-foreground">Performance &amp; achievements</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Track your progress</p>
            </div>
            <GamificationWidget />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
