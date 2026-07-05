import { useState } from 'react';
import { Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function Wallet() {
  const [autoTopUpEnabled, setAutoTopUpEnabled] = useState(true);

  const ledgerEntries = [
    {
      date: 'Apr 20 09:20',
      description: 'CP-2026-000089 · Auto Accident',
      type: 'Delivery',
      amount: -450,
      balance: 18400,
    },
    {
      date: 'Apr 20 09:14',
      description: 'CP-2026-000089',
      type: 'Hold Placed',
      amount: -450,
      balance: 18850,
      isPending: true,
    },
    {
      date: 'Apr 19 14:33',
      description: 'CP-2026-000084 · Auto Accident',
      type: 'Delivery',
      amount: -450,
      balance: 18850,
    },
    {
      date: 'Apr 18 10:11',
      description: 'Wallet Top-Up via Stripe',
      type: 'Top-Up',
      amount: 10000,
      balance: 19300,
    },
    {
      date: 'Apr 17 11:45',
      description: 'CP-2026-000081 · Slip & Fall',
      type: 'Delivery',
      amount: -350,
      balance: 9300,
    },
    {
      date: 'Apr 16 09:30',
      description: 'CP-2026-000077 · Auto Accident',
      type: 'Delivery',
      amount: -450,
      balance: 9650,
    },
    {
      date: 'Apr 15 16:22',
      description: 'Dispute Credit · CP-2026-000062',
      type: 'Credit',
      amount: 450,
      balance: 10100,
    },
    {
      date: 'Apr 14 08:55',
      description: 'CP-2026-000071 · Auto Accident',
      type: 'Delivery',
      amount: -450,
      balance: 9650,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <h1 className="text-2xl font-semibold text-foreground">Wallet</h1>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Balance Display */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Available Balance
          </p>
          <p className="text-5xl font-bold font-mono text-primary">$18,400.00</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <p className="text-sm text-green-400">Sufficient for delivery</p>
          </div>
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* On Hold Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <p className="text-sm font-semibold text-foreground">On Hold</p>
            <p className="text-2xl font-bold font-mono text-amber-400">$650</p>
            <p className="text-xs text-muted-foreground">
              2 opportunities pending first-touch confirmation
            </p>
          </div>

          {/* Auto Top-Up Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Auto Top-Up</p>
              <Switch checked={autoTopUpEnabled} onCheckedChange={setAutoTopUpEnabled} />
            </div>
            <p className="text-sm text-muted-foreground">
              Triggers at $2,000 · Adds $5,000
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-foreground">
            Top Up Wallet
          </Button>
          <button className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1">
            Configure Auto Top-Up <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Ledger */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">RECENT LEDGER</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ledgerEntries.map((entry, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-muted/50 transition-colors ${entry.isPending ? 'opacity-60' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground">{entry.date}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{entry.description}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{entry.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-mono font-semibold ${
                          entry.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {entry.amount > 0 ? '+' : ''}${Math.abs(entry.amount)}
                        {entry.isPending && <span className="text-xs text-muted-foreground ml-1">(hold)</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-foreground">
                      ${entry.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1">
            View Full History <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
