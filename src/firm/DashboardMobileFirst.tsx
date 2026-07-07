import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Menu, X, ChevronRight, ShieldCheck, Inbox } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BloombergClock from '@/firm/BloombergClock';
import EmptyState from '@/firm/EmptyState';
import { useFirmData, dollars, relativeTime, toFirmMetrics, toOpportunityRows } from '@/firm/useFirmData';

/**
 * The mobile-first landing. Wired to the firm's real Glass Box: real balance,
 * real delivered opportunities, real response and SLA figures. No fabricated
 * case value ranges, no invented conversion scores, no market rank we do not
 * compute. Every number here is the firm's own.
 */
export default function DashboardMobileFirst() {
  const [, navigate] = useLocation();
  const { data, firmName, loading } = useFirmData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('opportunities');

  const nowMs = Date.now();
  const m = toFirmMetrics(data);
  const opportunities = toOpportunityRows(data?.deliveries ?? []).slice(0, 5);
  const lowBalance =
    data?.wallet.lowBalanceThresholdCents != null && data.wallet.balanceCents <= data.wallet.lowBalanceThresholdCents;

  const metricCards = [
    { label: 'Wallet Balance', value: `$${dollars(m.balanceCents)}` },
    { label: 'Delivered', value: String(m.delivered) },
    { label: 'Median Response', value: m.medianResponseMin != null ? `${m.medianResponseMin} min` : '—' },
    { label: 'SLA Adherence', value: m.slaAdherencePct != null ? `${m.slaAdherencePct}%` : '—' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">CP</div>
            <span className="text-sm font-semibold hidden sm:inline">CasePort</span>
          </div>
          <div className="hidden md:flex items-center gap-4"><BloombergClock /></div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0, x: -300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -300 }} className="fixed inset-0 z-30 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r border-border p-4 space-y-2 overflow-y-auto">
              {[['Dashboard', '/dashboard'], ['Opportunities', '/opportunities'], ['Wallet', '/wallet'], ['Performance', '/performance'], ['Analytics', '/analytics'], ['Leaderboard', '/leaderboard'], ['Settings', '/settings']].map(
                ([item, to]) => (
                  <button key={item} onClick={() => { navigate(to); setSidebarOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium">
                    {item}
                  </button>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{firmName ?? 'Your market'}</p>
        </div>

        {/* Metrics Grid, all real. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {(loading ? Array.from({ length: 4 }).map(() => null) : metricCards).map((metric, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="p-3 md:p-4 border-border">
                {metric ? (
                  <>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{metric.label}</p>
                    <p className="text-xl md:text-2xl font-light text-foreground">{metric.value}</p>
                  </>
                ) : (
                  <div className="h-12 rounded bg-muted/30 animate-pulse" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-3">
          {/* Recent Opportunities */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <button
              onClick={() => setExpandedSection(expandedSection === 'opportunities' ? null : 'opportunities')}
              className="w-full flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="text-left">
                <h2 className="font-semibold text-foreground">Recent Opportunities</h2>
                <p className="text-xs text-muted-foreground mt-1">Delivered to your market</p>
              </div>
              <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === 'opportunities' ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {expandedSection === 'opportunities' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 mt-2">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-lg bg-muted/30 animate-pulse" />)
                  ) : opportunities.length === 0 ? (
                    <Card className="border-border"><EmptyState icon={Inbox} title="No opportunities yet" body="Delivered cases will appear here the moment they arrive." compact /></Card>
                  ) : (
                    opportunities.map((opp, idx) => (
                      <motion.div key={opp.deliveryId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                        <button onClick={() => navigate(`/opportunity/${opp.id}`)} className="w-full text-left">
                          <Card className="p-3 md:p-4 border-border hover:bg-secondary/40 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-foreground text-sm">{opp.caseType}</p>
                                <p className="text-xs text-muted-foreground font-mono">{opp.id}</p>
                              </div>
                              <Badge className={opp.status === 'Contacted' ? 'bg-chart-1/20 text-chart-1 border-chart-1/30 text-xs' : 'bg-chart-3/20 text-chart-3 border-chart-3/30 text-xs'}>
                                {opp.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{relativeTime(opp.deliveredAt, nowMs)}</span>
                              <span className={opp.sla === 'Overdue' ? 'text-destructive' : opp.sla === 'On time' ? 'text-chart-1' : ''}>{opp.sla}</span>
                            </div>
                          </Card>
                        </button>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Wallet Status, real balance. */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="p-4 border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Wallet Balance</p>
                  <p className="text-2xl font-light text-foreground mt-1">${dollars(m.balanceCents)}</p>
                </div>
                {lowBalance && <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-300">Low balance</Badge>}
              </div>
              <Button className="w-full bg-primary text-primary-foreground text-sm" onClick={() => navigate('/wallet')}>Manage Wallet</Button>
            </Card>
          </motion.div>
        </div>

        {/* Trust line replaces the fabricated rank footer. */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 p-4 bg-primary/5 border border-primary/15 rounded-lg flex items-center gap-2.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#22c58d' }} />
          Every figure here traces to your ledger and your market. Nothing is estimated, nothing is shared.
        </motion.div>
      </div>
    </div>
  );
}
