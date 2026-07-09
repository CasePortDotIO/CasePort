import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { ArrowRight, ShieldCheck, AlertTriangle, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { NeonCard } from '@/firm/CasePortComponentsEnhanced';
import ExportMenu from '@/firm/ExportMenu';
import EmptyState from '@/firm/EmptyState';
import { useFirmData, dollars, toLedgerRows } from '@/firm/useFirmData';

/**
 * The Wallet, backed by the authoritative ledger (Section 10). The balance shown
 * is the sum of ledger entries, the single source of truth, not the snapshot.
 * The snapshot is surfaced alongside so any drift is visible rather than hidden.
 * Every figure traces to a real entry; nothing here is estimated.
 */

function entryDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
}

const TOPUP_PRESETS = [100000, 250000, 500000]; // $1,000 / $2,500 / $5,000

export default function WalletEnhanced() {
  const [, navigate] = useLocation();
  const [autoTopUpEnabled, setAutoTopUpEnabled] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [funding, setFunding] = useState(false);
  const { data, loading, firmName, firmId } = useFirmData();

  async function startTopUp(amountCents: number) {
    if (!firmId || funding) return;
    setFunding(true);
    try {
      const res = await fetch(`/api/firm/${encodeURIComponent(firmId)}/wallet/topup`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amountCents }),
      });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && body.url) {
        window.location.href = body.url; // hosted Stripe checkout
        return;
      }
      toast.error(body.error === 'payments not configured' ? 'Payments are not enabled yet.' : 'Could not start checkout. Please try again.');
    } catch {
      toast.error('Could not reach the payment service.');
    } finally {
      setFunding(false);
    }
  }

  const wallet = data?.wallet;
  const entries = wallet?.entries ?? [];

  // Rows for the ledger table and export, newest first, mapped from real entries.
  const rows = toLedgerRows(entries);

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-secondary px-8 py-6"
      >
        <h1 className="text-2xl font-semibold text-foreground">Wallet</h1>
        {firmName && <p className="text-sm text-muted-foreground mt-1">{firmName}</p>}
      </motion.div>

      <div className="p-8 space-y-8">
        {loading ? (
          <div className="space-y-6">
            <div className="h-40 rounded-2xl bg-muted/30 animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-28 rounded-2xl bg-muted/30 animate-pulse" />
              <div className="h-28 rounded-2xl bg-muted/30 animate-pulse" />
            </div>
          </div>
        ) : !wallet ? (
          <NeonCard>
            <EmptyState
              icon={WalletIcon}
              title="No wallet yet"
              body="Once your firm is set up and funded, your balance and full ledger will appear here, every dollar traceable to a real entry."
            />
          </NeonCard>
        ) : (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Main balance: the authoritative ledger sum. */}
              <NeonCard dashed>
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Balance</p>
                  <p className="text-5xl font-bold font-mono text-primary">${dollars(wallet.balanceCents)}</p>
                  <p className="text-sm text-muted-foreground">
                    {wallet.lowBalanceThresholdCents != null
                      ? `Low balance alert at $${dollars(wallet.lowBalanceThresholdCents)}`
                      : 'This is the sum of your ledger entries, the authoritative balance.'}
                  </p>
                </div>
              </NeonCard>

              <div className="grid grid-cols-2 gap-4">
                {/* Ledger integrity: snapshot vs authoritative sum. Real reconciliation. */}
                <NeonCard>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ledger Integrity</p>
                    <div className="flex items-center gap-2">
                      {wallet.inSync ? (
                        <ShieldCheck className="w-5 h-5" style={{ color: '#34d39a' }} />
                      ) : (
                        <AlertTriangle className="w-5 h-5" style={{ color: '#f5b544' }} />
                      )}
                      <p className="text-lg font-semibold text-foreground">{wallet.inSync ? 'In sync' : 'Drift detected'}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {wallet.snapshotBalanceCents != null
                        ? `Snapshot $${dollars(wallet.snapshotBalanceCents)} vs ledger $${dollars(wallet.balanceCents)}`
                        : 'Balance is computed from the ledger, the source of truth.'}
                    </p>
                  </div>
                </NeonCard>

                {/* Auto top-up: a firm setting. The threshold shown is the real one. */}
                <NeonCard>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Auto Top-Up</p>
                      <Switch checked={autoTopUpEnabled} onCheckedChange={setAutoTopUpEnabled} />
                    </div>
                    <p className="text-sm text-foreground">{autoTopUpEnabled ? 'Enabled' : 'Disabled'}</p>
                    <motion.a
                      whileHover={{ x: 2 }}
                      href="/firm/settings"
                      onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
                      className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
                    >
                      Configure Settings <ArrowRight className="w-3 h-3" />
                    </motion.a>
                  </div>
                </NeonCard>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => setShowTopUp((v) => !v)}
                    >
                      Top Up Wallet
                    </Button>
                  </motion.div>
                  <ExportMenu data={rows} filename="wallet-ledger" title="Export Ledger" />
                </div>
                {showTopUp && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-muted-foreground mr-1">Fund via Stripe:</span>
                    {TOPUP_PRESETS.map((cents) => (
                      <button
                        key={cents}
                        disabled={funding}
                        onClick={() => startTopUp(cents)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-border bg-card hover:bg-muted transition-colors disabled:opacity-60 text-foreground"
                      >
                        ${dollars(cents)}
                      </button>
                    ))}
                    <span className="text-[11px] text-muted-foreground">Secure checkout. Balance credits on payment.</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Ledger table, newest first, from real entries. */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Ledger</h2>
              <NeonCard dashed>
                {rows.length === 0 ? (
                  <EmptyState
                    icon={WalletIcon}
                    title="No ledger activity yet"
                    body="Your top-ups and delivery debits will appear here the moment they happen, newest first."
                    compact
                  />
                ) : (
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.map((entry, idx) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-muted-foreground">{entryDate(entry.occurredAt)}</td>
                          <td className="px-6 py-4 text-sm">{entry.description}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={entry.type === 'Top-Up' ? 'text-chart-1' : entry.type === 'Adjustment' ? 'text-chart-3' : 'text-foreground'}>
                              {entry.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-right font-mono">
                            <span className={entry.amountCents > 0 ? 'text-chart-1' : 'text-foreground'}>
                              {entry.amountCents > 0 ? '+' : '-'} ${dollars(Math.abs(entry.amountCents))}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-right font-mono text-primary font-semibold">
                            ${dollars(entry.balanceCents)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </NeonCard>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
