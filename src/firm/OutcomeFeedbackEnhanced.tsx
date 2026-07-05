import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { OutcomeButtonGroup } from '@/firm/CasePortComponents';

interface CompletedOutcome {
  id: string;
  result: 'Retained' | 'Not Retained' | 'Still Evaluating';
  date: string;
  reason?: string;
}

interface OverdueOpportunity {
  id: string;
  caseType: string;
  market: string;
  deliveredDaysAgo: number;
  responseTime: number;
}

export default function OutcomeFeedbackEnhanced() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportingCompleteness, setReportingCompleteness] = useState(67);

  const [completedOutcomes, setCompletedOutcomes] = useState<CompletedOutcome[]>([
    { id: 'CP-2026-000077', result: 'Retained', date: 'Apr 20, 2026' },
    { id: 'CP-2026-000071', result: 'Not Retained', date: 'Apr 19, 2026' },
    { id: 'CP-2026-000062', result: 'Retained', date: 'Apr 18, 2026' },
    { id: 'CP-2026-000055', result: 'Not Retained', date: 'Apr 17, 2026' },
    { id: 'CP-2026-000048', result: 'Retained', date: 'Apr 16, 2026' },
    { id: 'CP-2026-000041', result: 'Still Evaluating', date: 'Apr 15, 2026' },
  ]);

  const [overdueOpportunities, setOverdueOpportunities] = useState<OverdueOpportunity[]>([
    {
      id: 'CP-2026-000065',
      caseType: 'Auto Accident',
      market: 'Houston',
      deliveredDaysAgo: 9,
      responseTime: 19,
    },
    {
      id: 'CP-2026-000058',
      caseType: 'Slip & Fall',
      market: 'Houston',
      deliveredDaysAgo: 12,
      responseTime: 7,
    },
    {
      id: 'CP-2026-000051',
      caseType: 'Auto Accident',
      market: 'Houston',
      deliveredDaysAgo: 16,
      responseTime: 4,
    },
  ]);

  const [pendingOpportunities, setPendingOpportunities] = useState([
    {
      id: 'CP-2026-000089',
      caseType: 'Auto Accident',
      market: 'Houston',
      deliveredDaysAgo: 0,
      responseTime: 6,
    },
    {
      id: 'CP-2026-000084',
      caseType: 'Auto Accident',
      market: 'Houston',
      deliveredDaysAgo: 1,
      responseTime: 4,
    },
  ]);

  const reasons = [
    'Unreachable claimant',
    'Already represented',
    'Insufficient injury',
    'Client declined',
    'Other firm was faster',
    'Wrong case type',
    'Other',
  ];

  const handleRetained = (id: string) => {
    submitOutcome(id, 'Retained', undefined);
  };

  const handleNotRetained = (id: string) => {
    setExpandedCard(id);
    setSelectedReason(null);
  };

  const handleEvaluating = (id: string) => {
    submitOutcome(id, 'Still Evaluating', undefined);
  };

  const submitOutcome = async (id: string, result: 'Retained' | 'Not Retained' | 'Still Evaluating', reason?: string) => {
    if (result === 'Not Retained' && !reason) {
      toast.error('Please select a reason');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find and remove from overdue/pending
    const opportunity = overdueOpportunities.find(o => o.id === id) || pendingOpportunities.find(o => o.id === id);
    if (opportunity) {
      setOverdueOpportunities(prev => prev.filter(o => o.id !== id));
      setPendingOpportunities(prev => prev.filter(o => o.id !== id));

      // Add to completed
      const newCompleted: CompletedOutcome = {
        id,
        result,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        reason,
      };
      setCompletedOutcomes(prev => [newCompleted, ...prev]);

      // Update reporting completeness
      setReportingCompleteness(prev => Math.min(prev + 8, 100));

      // Show success toast
      toast.success(`Outcome submitted: ${result}`);
    }

    setIsSubmitting(false);
    setExpandedCard(null);
    setSelectedReason(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <h1 className="text-2xl font-semibold text-foreground">Outcome Feedback</h1>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Alert Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              {overdueOpportunities.length} outcomes are overdue. Firms with 90%+ reporting completeness receive priority routing.
            </p>
          </div>
        </motion.div>

        {/* Reporting Completeness */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Reporting Completeness
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '67%' }}
                animate={{ width: `${reportingCompleteness}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-primary"
              />
            </div>
            <span className="text-sm font-semibold text-foreground">{reportingCompleteness}%</span>
            <span className="text-xs text-muted-foreground">Target: 90%</span>
          </div>
        </motion.div>

        {/* Overdue Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">OVERDUE — ACTION REQUIRED</h2>

          <AnimatePresence>
            {overdueOpportunities.map((opp, idx) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-lg p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono font-semibold text-primary text-lg">{opp.id}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {opp.caseType} · {opp.market}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Delivered {opp.deliveredDaysAgo} days ago · Response time: {opp.responseTime} min
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedCard === opp.id ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-border"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-3">
                          Why wasn't this case retained?
                        </p>
                        <div className="space-y-2">
                          {reasons.map((reason) => (
                            <label key={reason} className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`reason-${opp.id}`}
                                value={reason}
                                checked={selectedReason === reason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="rounded-full"
                              />
                              <span className="text-sm text-foreground">{reason}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2"
                      >
                        <Button
                          onClick={() => submitOutcome(opp.id, 'Not Retained', selectedReason || undefined)}
                          disabled={!selectedReason || isSubmitting}
                          className="flex-1 bg-primary hover:bg-primary/90 text-foreground disabled:opacity-50"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Button
                          onClick={() => setExpandedCard(null)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <OutcomeButtonGroup
                        onRetained={() => handleRetained(opp.id)}
                        onNotRetained={() => handleNotRetained(opp.id)}
                        onEvaluating={() => handleEvaluating(opp.id)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {overdueOpportunities.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-chart-1/10 border border-chart-1/30 rounded-lg p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-chart-1" />
              <p className="text-sm font-semibold text-chart-1">All overdue outcomes submitted!</p>
            </motion.div>
          )}
        </div>

        {/* Pending Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">PENDING (Last 14 days)</h2>

          <AnimatePresence>
            {pendingOpportunities.map((opp, idx) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-lg p-6 space-y-4"
              >
                <div>
                  <p className="font-mono font-semibold text-primary text-lg">{opp.id}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {opp.caseType} · {opp.market}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Delivered {opp.deliveredDaysAgo} days ago · Response time: {opp.responseTime} min
                  </p>
                </div>

                <OutcomeButtonGroup
                  onRetained={() => handleRetained(opp.id)}
                  onNotRetained={() => handleNotRetained(opp.id)}
                  onEvaluating={() => handleEvaluating(opp.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Completed Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">COMPLETED</h2>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence>
                  {completedOutcomes.map((outcome, idx) => (
                    <motion.tr
                      key={outcome.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-primary">{outcome.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            outcome.result === 'Retained'
                              ? 'text-chart-1'
                              : outcome.result === 'Not Retained'
                                ? 'text-destructive'
                                : 'text-chart-3'
                          }`}
                        >
                          {outcome.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{outcome.date}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
