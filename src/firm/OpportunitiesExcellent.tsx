import { useState, useMemo } from 'react';
import { Search, Filter, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import ExportMenu from '@/firm/ExportMenu';
import EmptyState from '@/firm/EmptyState';
import { useFirmData, dollars, relativeTime, toOpportunityRows, type OpportunityRow } from '@/firm/useFirmData';

/**
 * The firm's opportunities, mapped from its real delivery records. Every row is a
 * real delivered case: its response time against the SLA, its status, and the
 * fixed fee actually billed. Nothing is fabricated. There is no invented case
 * value and no invented conversion probability here; those never existed as real
 * numbers, so they are not shown. The SCPS triage lives on the case detail, where
 * it is real and firm facing.
 */

const STATUSES: OpportunityRow['status'][] = ['Contacted', 'Awaiting Response'];
const SLAS: OpportunityRow['sla'][] = ['On time', 'Overdue', 'Pending'];

export default function OpportunitiesExcellent() {
  const [, navigate] = useLocation();
  const { data, loading } = useFirmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCaseType, setSelectedCaseType] = useState<string | null>(null);
  const [selectedSla, setSelectedSla] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const itemsPerPage = 10;
  const nowMs = Date.now();

  const allRows = useMemo(() => toOpportunityRows(data?.deliveries ?? []), [data]);
  const caseTypes = useMemo(() => [...new Set(allRows.map((r) => r.caseType))], [allRows]);

  const filtered = useMemo(() => {
    return allRows.filter((opp) => {
      const matchesSearch =
        opp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.caseType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || opp.status === selectedStatus;
      const matchesCaseType = !selectedCaseType || opp.caseType === selectedCaseType;
      const matchesSla = !selectedSla || opp.sla === selectedSla;
      return matchesSearch && matchesStatus && matchesCaseType && matchesSla;
    });
  }, [allRows, searchTerm, selectedStatus, selectedCaseType, selectedSla]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusBadge = (status: OpportunityRow['status']) =>
    status === 'Contacted' ? 'bg-chart-1/20 text-chart-1 border-chart-1/30' : 'bg-chart-3/20 text-chart-3 border-chart-3/30';
  const slaBadge = (sla: OpportunityRow['sla']) =>
    sla === 'Overdue'
      ? 'bg-destructive/20 text-destructive border-destructive/30'
      : sla === 'On time'
        ? 'bg-chart-1/20 text-chart-1 border-chart-1/30'
        : 'bg-muted/50 text-muted-foreground border-muted/50';

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-secondary px-8 py-6">
        <h1 className="text-2xl font-semibold text-foreground">Opportunities</h1>
        <p className="text-sm text-muted-foreground mt-1">Every case delivered to your market, with your response time against the SLA.</p>
      </div>

      <div className="p-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by reference or case type..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <ExportMenu data={filtered} filename="opportunities" title="Export Opportunities" />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="grid grid-cols-3 gap-4">
                  <FilterColumn label="Status" options={STATUSES} selected={selectedStatus} onSelect={(v) => { setSelectedStatus(v); setCurrentPage(1); }} />
                  <FilterColumn label="Case Type" options={caseTypes} selected={selectedCaseType} onSelect={(v) => { setSelectedCaseType(v); setCurrentPage(1); }} />
                  <FilterColumn label="SLA" options={SLAS} selected={selectedSla} onSelect={(v) => { setSelectedSla(v); setCurrentPage(1); }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : allRows.length === 0 ? (
          <div className="border border-border rounded-lg">
            <EmptyState
              icon={Inbox}
              title="No opportunities delivered yet"
              body="The moment a personal injury case is delivered to your market, it appears here with your response time and its status. Nothing is estimated."
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {paginated.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
              </p>
            </div>

            {paginated.length > 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-border rounded-lg overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary border-b border-border">
                    <tr>
                      <Th>Reference</Th>
                      <Th>Case Type</Th>
                      <Th>Delivered</Th>
                      <Th>Response Time</Th>
                      <Th>Status</Th>
                      <Th>SLA</Th>
                      <Th>Fee</Th>
                      <Th>Action</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {paginated.map((opp, idx) => (
                        <motion.tr
                          key={opp.deliveryId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-b border-border hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <button
                              onClick={() => navigate(`/opportunity/${opp.deliveryId}`)}
                              className="font-mono font-semibold text-primary hover:underline cursor-pointer"
                            >
                              {opp.id}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">{opp.caseType}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{relativeTime(opp.deliveredAt, nowMs)}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {opp.responseTimeMin != null ? `${opp.responseTimeMin} min` : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge(opp.status)}`}>
                              {opp.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${slaBadge(opp.sla)}`}>
                              {opp.sla}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-foreground">
                            {opp.feeCents != null ? `$${dollars(opp.feeCents)}` : '—'}
                          </td>
                          <td className="px-6 py-4 relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === opp.deliveryId ? null : opp.deliveryId)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              ⋮
                            </button>
                            <AnimatePresence>
                              {activeMenu === opp.deliveryId && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10"
                                >
                                  <button
                                    onClick={() => { navigate(`/opportunity/${opp.deliveryId}`); setActiveMenu(null); }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors border-b border-border text-foreground"
                                  >
                                    View Detail
                                  </button>
                                  <button
                                    onClick={() => { toast.info('Report the outcome for ' + opp.id); setActiveMenu(null); }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors text-foreground"
                                  >
                                    Report Outcome
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No opportunities match your filters.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{children}</th>;
}

function FilterColumn({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (v: string | null) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">{label}</label>
      <div className="space-y-2">
        <button
          onClick={() => onSelect(null)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            selected === null ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          }`}
        >
          All
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selected === opt ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
