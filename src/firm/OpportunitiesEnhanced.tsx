import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge, NeonCard } from '@/firm/CasePortComponentsEnhanced';

export default function OpportunitiesEnhanced() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const opportunities = [
    {
      id: 'CP-2026-000089',
      type: 'Auto Accident',
      market: 'Houston',
      received: '2 hrs ago',
      time: '6 min ',
      status: 'Contacted',
      outcome: null,
    },
    {
      id: 'CP-2026-000084',
      type: 'Auto Accident',
      market: 'Houston',
      received: 'Yesterday',
      time: '4 min ',
      status: 'Outcome Pending',
      outcome: 'Pending',
    },
    {
      id: 'CP-2026-000081',
      type: 'Slip & Fall',
      market: 'Houston',
      received: '2 days ago',
      time: '31 min',
      status: 'Outcome Pending',
      outcome: 'Overdue',
    },
    {
      id: 'CP-2026-000078',
      type: 'Auto Accident',
      market: 'Houston',
      received: '3 days ago',
      time: '19 min',
      status: 'Signed',
      outcome: 'Submitted',
    },
    {
      id: 'CP-2026-000075',
      type: 'Premises Liability',
      market: 'Houston',
      received: '5 days ago',
      time: '8 min ',
      status: 'Closed Lost',
      outcome: 'Submitted',
    },
    {
      id: 'CP-2026-000072',
      type: 'Auto Accident',
      market: 'Houston',
      received: '7 days ago',
      time: '12 min',
      status: 'Disputed',
      outcome: 'Submitted',
    },
    {
      id: 'CP-2026-000069',
      type: 'Slip & Fall',
      market: 'Houston',
      received: '9 days ago',
      time: '5 min ',
      status: 'Outcome Pending',
      outcome: 'Overdue',
    },
    {
      id: 'CP-2026-000066',
      type: 'Auto Accident',
      market: 'Houston',
      received: '11 days ago',
      time: '15 min',
      status: 'Signed',
      outcome: 'Submitted',
    },
  ];

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === opportunities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(opportunities.map(o => o.id));
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Contacted':
        return 'default';
      case 'Outcome Pending':
        return 'warning';
      case 'Signed':
        return 'success';
      case 'Closed Lost':
        return 'error';
      case 'Disputed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getOutcomeVariant = (outcome: string | null) => {
    if (!outcome) return null;
    switch (outcome) {
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'error';
      case 'Submitted':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-secondary px-8 py-6"
      >
        <h1 className="text-2xl font-semibold text-foreground">Opportunities</h1>
      </motion.div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 items-center flex-wrap"
        >
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by CP-ID, case type, or market..."
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Status
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Case Type
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Date Range
            <ChevronDown className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <NeonCard dashed glow="cyan">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === opportunities.length}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Case Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Market
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Received
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Response Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Outcome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence>
                  {opportunities.map((opp, idx) => (
                    <motion.tr
                      key={opp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(opp.id)}
                          onChange={() => toggleSelect(opp.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <motion.a
                          whileHover={{ color: '#00D9FF' }}
                          href={`/opportunities/${opp.id}`}
                          className="font-mono font-semibold text-primary hover:text-primary/80 cursor-pointer"
                        >
                          {opp.id}
                        </motion.a>
                      </td>
                      <td className="px-4 py-3 text-sm">{opp.type}</td>
                      <td className="px-4 py-3 text-sm">{opp.market}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{opp.received}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{opp.time}</td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusVariant(opp.status)}>{opp.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {opp.outcome && (
                          <Badge variant={getOutcomeVariant(opp.outcome) || 'default'}>
                            {opp.outcome}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setExpandedMenu(expandedMenu === opp.id ? null : opp.id)
                            }
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </motion.button>
                          <AnimatePresence>
                            {expandedMenu === opp.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[180px]"
                              >
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors">
                                  View Detail
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors border-t border-border">
                                  Submit Outcome
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors border-t border-border text-destructive">
                                  Open Dispute
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </NeonCard>
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Showing {opportunities.length} of 28 opportunities
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="outline">Next</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
