import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { ArrowRight, Phone, ShieldCheck, LineChart, TrendingUp, CreditCard, Trophy, Inbox } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firm/useAuth';
import BloombergClock from '@/firm/BloombergClock';
import DashboardFirstRun from '@/firm/DashboardFirstRun';
import EmptyState from '@/firm/EmptyState';
import { useFirmData, dollars, relativeTime, reviewNowTarget, toFirmMetrics, toOpportunityRows, type OpportunityRow } from '@/firm/useFirmData';

/* Where the depth lives. The dashboard is the cockpit; each of these opens a
 * dedicated page carrying the detail that used to crowd the landing screen. */
const wayfinding = [
  { to: '/wallet', icon: CreditCard, label: 'Wallet', desc: 'Pre-funded balance and full ledger', soon: false },
  { to: '/performance', icon: LineChart, label: 'Performance', desc: 'Response trends and cost per signed case', soon: true },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', desc: 'Cohorts, funnel, and channel attribution', soon: true },
  { to: '/leaderboard', icon: Trophy, label: 'Standing', desc: 'Your market benchmarks', soon: true },
] as const;

/* Calibrated semantic palette, kept separate from the brand teal so meaning
 * never competes with identity. */
const POS = '#34d39a';
const WARN = '#f5b544';
const TEAL = '#22c58d';

const statusStyle: Record<OpportunityRow['status'], { dot: string; text: string; bg: string }> = {
  'Awaiting Response': { dot: WARN, text: '#f7c873', bg: 'rgba(245,181,68,0.12)' },
  Contacted: { dot: '#6ea8ff', text: '#a9c8ff', bg: 'rgba(110,168,255,0.12)' },
};

interface MetricCardProps {
  label: string;
  hint: string;
  value: string;
  unit?: string;
  sub?: string;
  hero?: boolean;
}

function MetricCard({ label, hint, value, unit, sub, hero }: MetricCardProps) {
  return (
    <Card
      title={hint}
      className="relative p-5 h-full border-white/[0.08] overflow-hidden transition-all hover:border-white/20 hover:-translate-y-0.5"
      style={{
        background: hero
          ? 'linear-gradient(150deg, rgba(34,197,141,0.10), rgba(255,255,255,0.02))'
          : 'linear-gradient(160deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))',
        borderColor: hero ? 'rgba(34,197,141,0.28)' : undefined,
      }}
    >
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.13em] mb-3 pr-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-[32px] leading-none font-light tracking-tight text-foreground tabular-nums">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {sub && <div className="mt-3 text-xs text-muted-foreground">{sub}</div>}
    </Card>
  );
}

export default function DashboardInstitutional() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data, firmName, loading } = useFirmData();
  const firstName = (user?.name ?? 'Partner').split(' ')[0];
  const nowMs = Date.now();

  const metrics = toFirmMetrics(data);
  const rows = toOpportunityRows(data?.deliveries ?? []);
  const recent = rows.slice(0, 4);
  // "Review now" takes the partner straight to the calls they owe, never the full
  // past-cases archive: one call lands on that claimant's detail, more than one on
  // the opportunities list scoped to exactly those calls (reviewNowTarget).
  const reviewTarget = reviewNowTarget(rows);

  // First login, before any case has flowed. Driven by a preview flag, or by the
  // honest live signal: a resolved firm with no deliveries yet.
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const params = new URLSearchParams(search);
  if (params.has('new')) {
    return <DashboardFirstRun firstName={firstName} walletFunded={params.has('funded')} />;
  }

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
                {firmName ?? 'Your market'}
                <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: POS }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: POS, boxShadow: `0 0 8px ${POS}` }} />
                  Exclusive · live
                </span>
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.18em] mb-1">Balance</p>
              <p className="text-2xl font-semibold text-foreground tabular-nums">${dollars(metrics.balanceCents)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 py-9">
        {/* Hero: what needs you now, from real awaiting-response deliveries. */}
        {metrics.awaitingCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(reviewTarget)}
            className="group w-full text-left mb-8 rounded-2xl border p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors"
            style={{ borderColor: 'rgba(245,181,68,0.28)', background: 'linear-gradient(120deg, rgba(245,181,68,0.10), rgba(245,181,68,0.02) 60%)' }}
          >
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 w-11 h-11 rounded-full grid place-items-center" style={{ background: 'rgba(245,181,68,0.16)' }}>
                <Phone className="w-5 h-5" style={{ color: WARN }} />
              </span>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {metrics.awaitingCount} {metrics.awaitingCount === 1 ? 'opportunity needs' : 'opportunities need'} your first call
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Call inside your callback window while the claimant is still expecting you.
                </p>
              </div>
            </div>
            <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold pr-1" style={{ color: WARN }}>
              Review now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </motion.button>
        )}

        {/* Primary metrics, every one real. No sparklines: we do not fabricate a
            history we do not have. */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 rounded-xl bg-muted/30 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <MetricCard hero label="Wallet balance" hint="Your authoritative pre-funded balance, the ledger sum." value={`$${dollars(metrics.balanceCents)}`} sub="Delivery fees debit against this." />
            <MetricCard label="Opportunities delivered" hint="Cases delivered to your exclusive market." value={String(metrics.delivered)} sub={metrics.awaitingCount > 0 ? `${metrics.awaitingCount} awaiting your first call` : 'All responded'} />
            <MetricCard label="Median response time" hint="Median time to first contact across responded cases." value={metrics.medianResponseMin != null ? String(metrics.medianResponseMin) : '—'} unit={metrics.medianResponseMin != null ? 'min' : undefined} sub="Faster contact wins more cases." />
            <MetricCard label="SLA adherence" hint="Share of delivered cases you responded to within SLA." value={metrics.slaAdherencePct != null ? String(metrics.slaAdherencePct) : '—'} unit={metrics.slaAdherencePct != null ? '%' : undefined} sub="Within your contractual callback window." />
          </div>
        )}

        {/* Two column: recent opportunities + this-month summary, all real. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Recent opportunities</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Delivered to your market, newest first</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/opportunities')}>
                View all <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            <Card className="border-white/[0.08] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)' }}>
              {loading ? (
                <div className="p-5 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 rounded bg-muted/30 animate-pulse" />)}</div>
              ) : recent.length === 0 ? (
                <EmptyState icon={Inbox} title="No opportunities yet" body="The moment a personal injury case is delivered to your market, it appears here and we call you to act within your window." compact />
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {recent.map((opp, idx) => {
                    const s = statusStyle[opp.status];
                    return (
                      <motion.button
                        key={opp.deliveryId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 + idx * 0.05 }}
                        onClick={() => navigate(`/opportunity/${opp.deliveryId}`)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="font-medium text-foreground">{opp.caseType}</span>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: s.text, background: s.bg }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                              {opp.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                            <span className="font-mono text-[12px]">{opp.id}</span>
                            <span>{relativeTime(opp.deliveredAt, nowMs)}</span>
                            {opp.sla === 'Overdue' && <span style={{ color: WARN }}>SLA overdue</span>}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Your market</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Real, from your own record</p>
            </div>

            <div className="space-y-4">
              <Card className="p-5 border-white/[0.08]" title="Delivered cases you have already responded to." style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.13em]">SLA adherence</p>
                  <span className="text-sm font-semibold" style={{ color: POS }}>{metrics.slaAdherencePct != null ? `${metrics.slaAdherencePct}%` : '—'}</span>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${metrics.slaAdherencePct ?? 0}%`, background: `linear-gradient(90deg, ${TEAL}, ${POS})` }} />
                </div>
              </Card>

              <Card className="p-5 border-white/[0.08]" title="Fixed per-opportunity fees billed to date." style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.13em] mb-2">Fees billed</p>
                <p className="text-[28px] leading-none font-light tracking-tight text-foreground tabular-nums">${dollars(metrics.feesPaidCents)}</p>
                <p className="text-xs text-muted-foreground mt-2">A fixed fee per delivered opportunity, never a share of any outcome.</p>
              </Card>

              <Card className="p-5 border-white/[0.08]" title="Opportunities delivered to your market." style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.13em] mb-2">Delivered</p>
                <p className="text-[28px] leading-none font-light tracking-tight text-foreground tabular-nums">{metrics.delivered}</p>
                <p className="text-xs text-muted-foreground mt-2">{metrics.awaitingCount > 0 ? `${metrics.awaitingCount} awaiting a first call` : 'All responded to'}</p>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Trust line: the Glass Box promise, now literally true. */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }} className="mb-12 flex items-center gap-2.5 text-[13px] text-muted-foreground">
          <ShieldCheck className="w-4 h-4" style={{ color: TEAL }} />
          Every figure here traces to your ledger and your market. Nothing is estimated, nothing is shared.
        </motion.div>

        {/* Wayfinding. The depth lives on its own pages. */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Go deeper</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Everything else is one click away</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {wayfinding.map((w) => {
              const Icon = w.icon;
              return (
                <button
                  key={w.to}
                  onClick={() => navigate(w.to)}
                  className="text-left rounded-xl p-5 border border-white/[0.08] hover:border-white/20 hover:-translate-y-0.5 transition-all group"
                  style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.032), rgba(255,255,255,0.008))' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-5 h-5" style={{ color: TEAL }} />
                    {w.soon ? (
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">Soon</span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                  <div className="text-sm font-semibold text-foreground">{w.label}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{w.desc}</div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
