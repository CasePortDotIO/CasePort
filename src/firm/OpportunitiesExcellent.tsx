import { useState, useMemo } from 'react';
import { ChevronRight, Search, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { Badge } from '@/firm/CasePortComponentsEnhanced';
import ExportMenu from '@/firm/ExportMenu';
import ChurnRiskBadge from '@/firm/ChurnRiskBadge';
import { CaseValueBadge } from '@/firm/CaseValueReveal';


interface Opportunity {
  id: string;
  caseType: string;
  received: string;
  responseTime: number;
  status: 'Contacted' | 'Outcome Pending' | 'Signed' | 'Closed Lost' | 'Disputed';
  outcome?: 'Pending' | 'Submitted' | 'Overdue';
  market: string;
  value?: number;
  conversionProbability?: number;
}

const allOpportunities: Opportunity[] = [
  { id: 'CP-2026-000089', caseType: 'Auto Accident', received: '2 hrs ago', responseTime: 6, status: 'Contacted', outcome: 'Pending', market: 'Houston', value: 45000, conversionProbability: 87 },
  { id: 'CP-2026-000084', caseType: 'Auto Accident', received: 'Yesterday', responseTime: 4, status: 'Outcome Pending', outcome: 'Pending', market: 'Houston', value: 32000, conversionProbability: 72 },
  { id: 'CP-2026-000081', caseType: 'Slip & Fall', received: '2 days ago', responseTime: 31, status: 'Outcome Pending', outcome: 'Overdue', market: 'Houston', value: 28000, conversionProbability: 45 },
  { id: 'CP-2026-000075', caseType: 'Medical Malpractice', received: '3 days ago', responseTime: 12, status: 'Signed', market: 'Houston', value: 125000, conversionProbability: 95 },
  { id: 'CP-2026-000071', caseType: 'Product Liability', received: '4 days ago', responseTime: 8, status: 'Closed Lost', market: 'Houston', value: 89000, conversionProbability: 68 },
  { id: 'CP-2026-000065', caseType: 'Auto Accident', received: '5 days ago', responseTime: 19, status: 'Outcome Pending', outcome: 'Overdue', market: 'Houston', value: 52000, conversionProbability: 58 },
  { id: 'CP-2026-000058', caseType: 'Slip & Fall', received: '6 days ago', responseTime: 7, status: 'Outcome Pending', outcome: 'Overdue', market: 'Houston', value: 38000, conversionProbability: 64 },
  { id: 'CP-2026-000051', caseType: 'Auto Accident', received: '7 days ago', responseTime: 4, status: 'Disputed', market: 'Houston', value: 41000, conversionProbability: 52 },
  { id: 'CP-2026-000048', caseType: 'Wrongful Death', received: '8 days ago', responseTime: 15, status: 'Signed', market: 'Houston', value: 250000, conversionProbability: 98 },
  { id: 'CP-2026-000041', caseType: 'Auto Accident', received: '9 days ago', responseTime: 5, status: 'Contacted', outcome: 'Pending', market: 'Houston', value: 48000, conversionProbability: 81 },
  { id: 'CP-2026-000035', caseType: 'Premises Liability', received: '10 days ago', responseTime: 22, status: 'Outcome Pending', outcome: 'Submitted', market: 'Houston', value: 65000, conversionProbability: 71 },
  { id: 'CP-2026-000028', caseType: 'Auto Accident', received: '11 days ago', responseTime: 9, status: 'Signed', market: 'Houston', value: 55000, conversionProbability: 89 },
  { id: 'CP-2026-000022', caseType: 'Slip & Fall', received: '12 days ago', responseTime: 6, status: 'Closed Lost', market: 'Houston', value: 22000, conversionProbability: 39 },
  { id: 'CP-2026-000015', caseType: 'Medical Malpractice', received: '13 days ago', responseTime: 25, status: 'Outcome Pending', outcome: 'Pending', market: 'Houston', value: 180000, conversionProbability: 76 },
  { id: 'CP-2026-000008', caseType: 'Auto Accident', received: '14 days ago', responseTime: 3, status: 'Signed', market: 'Houston', value: 78000, conversionProbability: 92 },
];

const caseTypes = ['Auto Accident', 'Slip & Fall', 'Medical Malpractice', 'Product Liability', 'Wrongful Death', 'Premises Liability'];
const statuses = ['Contacted', 'Outcome Pending', 'Signed', 'Closed Lost', 'Disputed'];

export default function OpportunitiesExcellent() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCaseType, setSelectedCaseType] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const itemsPerPage = 8;

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter(opp => {
      const matchesSearch = opp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opp.caseType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || opp.status === selectedStatus;
      const matchesCaseType = !selectedCaseType || opp.caseType === selectedCaseType;
      const matchesOutcome = !selectedOutcome || opp.outcome === selectedOutcome;

      return matchesSearch && matchesStatus && matchesCaseType && matchesOutcome;
    });
  }, [searchTerm, selectedStatus, selectedCaseType, selectedOutcome]);

  // Paginate
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const paginatedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedOpportunities.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedOpportunities.map(o => o.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleNavigateToDetail = (id: string) => {
    navigate(`/opportunity/${id}`);
  };

  const handleActionMenuClick = (action: string, id: string) => {
    switch (action) {
      case 'detail':
        handleNavigateToDetail(id);
        break;
      case 'outcome':
        toast.info('Submit outcome for ' + id);
        break;
      case 'dispute':
        toast.error('Open dispute for ' + id);
        break;
    }
    setActiveMenu(null);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Contacted':
        return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
      case 'Outcome Pending':
        return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
      case 'Signed':
        return 'bg-chart-1/20 text-chart-1 border-chart-1/30';
      case 'Closed Lost':
        return 'bg-muted/50 text-muted-foreground border-muted/50';
      case 'Disputed':
        return 'bg-purple-500/20 text-purple-200 border-purple-500/30';
      default:
        return '';
    }
  };

  const getOutcomeBadgeColor = (outcome: string | undefined) => {
    if (!outcome) return '';
    switch (outcome) {
      case 'Pending':
        return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
      case 'Submitted':
        return 'bg-muted/50 text-muted-foreground border-muted/50';
      case 'Overdue':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <h1 className="text-2xl font-semibold text-foreground">Opportunities</h1>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by CP-ID or case type..."
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
            <ExportMenu
              data={filteredOpportunities}
              filename="opportunities"
              title="Export Opportunities"
            />
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card border border-border rounded-lg p-4 space-y-4"
              >
                <div className="grid grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                      Status
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedStatus(null);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedStatus === null
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        All
                      </button>
                      {statuses.map(status => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatus(status);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedStatus === status
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Case Type Filter */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                      Case Type
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedCaseType(null);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCaseType === null
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        All
                      </button>
                      {caseTypes.map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            setSelectedCaseType(type);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCaseType === type
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Outcome Filter */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                      Outcome
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedOutcome(null);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedOutcome === null
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        All
                      </button>
                      {['Pending', 'Submitted', 'Overdue'].map(outcome => (
                        <button
                          key={outcome}
                          onClick={() => {
                            setSelectedOutcome(outcome);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedOutcome === outcome
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {outcome}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedOpportunities.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredOpportunities.length)} of {filteredOpportunities.length} opportunities
          </p>
        </div>

        {/* Table */}
        {paginatedOpportunities.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-border rounded-lg overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === paginatedOpportunities.length && paginatedOpportunities.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Case Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Received</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Response Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Outcome</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedOpportunities.map((opp, idx) => (
                    <motion.tr
                      key={opp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(opp.id)}
                          onChange={() => handleSelectItem(opp.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleNavigateToDetail(opp.id)}
                          className="font-mono font-semibold text-primary hover:underline cursor-pointer"
                        >
                          {opp.id}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{opp.caseType}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{opp.received}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{opp.responseTime} min</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(opp.status)}`}>
                          {opp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {opp.outcome && (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getOutcomeBadgeColor(opp.outcome)}`}>
                            {opp.outcome}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <CaseValueBadge
                          actualValue={opp.value || 0}
                          conversionProbability={opp.conversionProbability || 0}
                          isAccepted={opp.status === 'Signed'}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <ChurnRiskBadge
                          riskLevel={opp.responseTime > 20 ? 'high' : opp.responseTime > 10 ? 'medium' : 'low'}
                          daysSinceUpdate={opp.responseTime}
                          conversionProbability={opp.status === 'Signed' ? 100 : opp.status === 'Contacted' ? 45 : 25}
                        />
                      </td>
                      <td className="px-6 py-4 relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === opp.id ? null : opp.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          ⋮
                        </button>
                        <AnimatePresence>
                          {activeMenu === opp.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10"
                            >
                              <button
                                onClick={() => handleActionMenuClick('detail', opp.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors border-b border-border text-foreground"
                              >
                                View Detail
                              </button>
                              <button
                                onClick={() => handleActionMenuClick('outcome', opp.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors border-b border-border text-foreground"
                              >
                                Submit Outcome
                              </button>
                              <button
                                onClick={() => handleActionMenuClick('dispute', opp.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors text-destructive"
                              >
                                Open Dispute
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No opportunities found matching your filters.</p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
            >
              ← Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:bg-muted'
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
      </div>
    </div>
  );
}
