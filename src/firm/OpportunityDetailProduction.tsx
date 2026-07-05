import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, AlertCircle, CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import CollaborationPanel from '@/firm/CollaborationPanel';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'contact' | 'response' | 'outcome' | 'update';
}

interface Opportunity {
  id: string;
  caseType: string;
  market: string;
  status: 'Contacted' | 'Outcome Pending' | 'Signed' | 'Closed Lost' | 'Disputed';
  received: string;
  responseTime: number;
}

// Mock database of opportunities
const opportunitiesDB: Record<string, Opportunity> = {
  'CP-2026-000089': { id: 'CP-2026-000089', caseType: 'Auto Accident', market: 'Houston, TX', status: 'Contacted', received: '2 hours ago', responseTime: 6 },
  'CP-2026-000084': { id: 'CP-2026-000084', caseType: 'Auto Accident', market: 'Houston, TX', status: 'Outcome Pending', received: 'Yesterday', responseTime: 4 },
  'CP-2026-000081': { id: 'CP-2026-000081', caseType: 'Slip & Fall', market: 'Houston, TX', status: 'Outcome Pending', received: '2 days ago', responseTime: 31 },
  'CP-2026-000075': { id: 'CP-2026-000075', caseType: 'Medical Malpractice', market: 'Houston, TX', status: 'Signed', received: '3 days ago', responseTime: 12 },
};

const reasonCodes = [
  { code: 'NR-001', label: 'Not Retained - Client Declined' },
  { code: 'NR-002', label: 'Not Retained - Conflict of Interest' },
  { code: 'NR-003', label: 'Not Retained - Outside Practice Area' },
  { code: 'NR-004', label: 'Not Retained - No Liability' },
  { code: 'NR-005', label: 'Not Retained - Insufficient Damages' },
];

export default function OpportunityDetailProduction() {
  const [, navigate] = useLocation();
  const [params, setParams] = useState<{ id?: string }>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'timeline' | 'dispute'>('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showReasonCodes, setShowReasonCodes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Extract route params from URL
  useEffect(() => {
    const pathMatch = window.location.pathname.match(/\/opportunity\/([^/]+)/);
    if (pathMatch) {
      const opportunityId = pathMatch[1];
      setParams({ id: opportunityId });

      // Simulate loading
      setIsLoading(true);
      setTimeout(() => {
        const opp = opportunitiesDB[opportunityId];
        if (opp) {
          setOpportunity(opp);
          setError(null);
        } else {
          setError(`Opportunity ${opportunityId} not found`);
          setOpportunity(null);
        }
        setIsLoading(false);
      }, 500);
    }
  }, []);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes dialogs/menus
      if (e.key === 'Escape') {
        setShowConfirmDialog(false);
        setShowReasonCodes(false);
      }
      // Tab navigation for accessibility
      if (e.key === 'Tab') {
        // Allow natural tab flow
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowReasonCodes(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-2">Error Loading Opportunity</p>
          <p className="text-muted-foreground mb-6">{error || 'Opportunity not found'}</p>
          <button
            onClick={() => navigate('/opportunities')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  const handleOutcomeSubmit = (outcome: string) => {
    if (outcome === 'not-retained') {
      if (!showReasonCodes) {
        setShowReasonCodes(true);
        return;
      }
      if (!selectedReason) {
        toast.error('Please select a reason code');
        return;
      }
    }

    setConfirmAction(outcome);
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const outcomeLabel = confirmAction === 'retained' ? 'Retained' :
                          confirmAction === 'not-retained' ? `Not Retained (${selectedReason})` :
                          'Still Evaluating';

      toast.success(`Outcome submitted: ${outcomeLabel}`);
      setShowConfirmDialog(false);
      setShowReasonCodes(false);
      setSelectedReason(null);
      setConfirmAction(null);
    } catch (err) {
      toast.error('Failed to submit outcome. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timelineEvents: TimelineEvent[] = [
    {
      date: '2026-04-21 14:32',
      title: 'Case Received',
      description: 'Auto Accident case received from CasePort network',
      type: 'contact'
    },
    {
      date: '2026-04-21 14:38',
      title: 'Response Submitted',
      description: 'Firm responded to case inquiry within 6 minutes',
      type: 'response'
    },
    {
      date: '2026-04-21 15:15',
      title: 'Outcome Pending',
      description: 'Awaiting outcome submission from firm',
      type: 'update'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'dispute', label: 'Dispute' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/opportunities')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/opportunities')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1"
            aria-label="Back to opportunities list"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Opportunities
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
          >
            Dashboard
          </button>
          <ChevronRight className="w-4 h-4" />
          <button
            onClick={() => navigate('/opportunities')}
            className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
          >
            Opportunities
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-mono">{opportunity.id}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground font-mono">{opportunity.id}</h1>
            <p className="text-sm text-muted-foreground mt-1">{opportunity.caseType} · {opportunity.market}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-blue-500/20 text-blue-200 border-blue-500/30">
              {opportunity.status}
            </span>
            <span className="text-sm text-muted-foreground">{opportunity.received}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="px-8 flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveTab(tab.id as any);
                }
              }}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-t ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-3 gap-8"
            >
              {/* Left Column */}
              <div className="col-span-2 space-y-6">
                {/* Case Profile */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Case Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Case Type</p>
                      <p className="text-foreground mt-1">{opportunity.caseType}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Market</p>
                      <p className="text-foreground mt-1">{opportunity.market}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status of Limitations</p>
                      <p className="text-foreground mt-1">180 days remaining</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Received Date</p>
                      <p className="text-foreground mt-1">April 21, 2026</p>
                    </div>
                  </div>
                </div>

                {/* Outcome Buttons */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Submit Outcome</h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleOutcomeSubmit('retained')}
                      onKeyDown={(e) => e.key === 'Enter' && handleOutcomeSubmit('retained')}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg bg-chart-1/20 text-chart-1 border border-chart-1/30 hover:bg-chart-1/30 disabled:opacity-50 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-chart-1/50"
                      aria-label="Submit outcome: Retained"
                    >
                      {isSubmitting && confirmAction === 'retained' ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        'Retained'
                      )}
                    </button>
                    <button
                      onClick={() => handleOutcomeSubmit('not-retained')}
                      onKeyDown={(e) => e.key === 'Enter' && handleOutcomeSubmit('not-retained')}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 disabled:opacity-50 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-destructive/50"
                      aria-label="Submit outcome: Not Retained"
                    >
                      {isSubmitting && confirmAction === 'not-retained' ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        'Not Retained'
                      )}
                    </button>
                    <button
                      onClick={() => handleOutcomeSubmit('evaluating')}
                      onKeyDown={(e) => e.key === 'Enter' && handleOutcomeSubmit('evaluating')}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg bg-muted/50 text-muted-foreground border border-muted/50 hover:bg-muted/70 disabled:opacity-50 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label="Submit outcome: Still Evaluating"
                    >
                      {isSubmitting && confirmAction === 'evaluating' ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        'Still Evaluating ○'
                      )}
                    </button>
                  </div>

                  {/* Reason Codes */}
                  <AnimatePresence>
                    {showReasonCodes && (
                      <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                          Select Reason Code <span className="text-destructive">*</span>
                        </p>
                        <div className="space-y-2">
                          {reasonCodes.map(code => (
                            <button
                              key={code.code}
                              onClick={() => {
                                setSelectedReason(code.code);
                                toast.info(`Selected: ${code.label}`);
                              }}
                              onKeyDown={(e) => e.key === 'Enter' && setSelectedReason(code.code)}
                              className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                selectedReason === code.code
                                  ? 'bg-primary/20 text-primary border border-primary/30'
                                  : 'bg-muted/50 text-foreground hover:bg-muted'
                              }`}
                              aria-selected={selectedReason === code.code}
                              role="option"
                            >
                              <span className="font-mono text-primary">{code.code}</span> - {code.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Collaboration Panel */}
                <CollaborationPanel
                  resourceId={opportunity.id}
                  resourceType="opportunity"
                />

                {/* Response Performance */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Response Performance</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Response</p>
                      <p className="text-2xl font-bold text-chart-1 mt-1">{opportunity.responseTime} min</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Market Average</p>
                      <p className="text-muted-foreground mt-1">12 min</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Benchmark</p>
                      <p className="text-muted-foreground mt-1">8 min</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-4">
                      <div className="h-full bg-chart-1" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>

                {/* Intake Intelligence */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'intake' ? null : 'intake')}
                    onKeyDown={(e) => e.key === 'Enter' && setExpandedSection(expandedSection === 'intake' ? null : 'intake')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-expanded={expandedSection === 'intake'}
                    aria-label="Intake Intelligence section"
                  >
                    <h2 className="text-lg font-semibold text-foreground">Intake Intelligence</h2>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        expandedSection === 'intake' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSection === 'intake' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border px-6 py-4 space-y-3"
                      >
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Injury Type</p>
                          <p className="text-foreground mt-1">Whiplash, Soft Tissue</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Medical Treatment</p>
                          <p className="text-foreground mt-1">ER visit, Physical therapy</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estimated Damages</p>
                          <p className="text-foreground mt-1">$15,000 - $25,000</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* Intelligence Tab */}
          {activeTab === 'intelligence' && (
            <motion.div
              key="intelligence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Case Intelligence</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Injury Severity</p>
                    <p className="text-foreground mt-1">Moderate - Soft tissue injuries with ongoing treatment</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Liability Assessment</p>
                    <p className="text-foreground mt-1">Clear liability - Other party at fault, police report filed</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Insurance Coverage</p>
                    <p className="text-foreground mt-1">Defendant has commercial auto insurance, $100K limit</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Comparable Cases</p>
                    <p className="text-foreground mt-1">Similar cases in Houston market settle for $18K - $28K</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl"
            >
              <div className="space-y-6">
                {timelineEvents.map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        event.type === 'contact' ? 'bg-blue-500 border-blue-500' :
                        event.type === 'response' ? 'bg-chart-1 border-chart-1' :
                        event.type === 'outcome' ? 'bg-chart-3 border-chart-3' :
                        'bg-primary border-primary'
                      }`} />
                      {idx < timelineEvents.length - 1 && (
                        <div className="w-0.5 h-12 bg-border mt-2" />
                      )}
                    </div>

                    <div className="pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-mono text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <p className="text-foreground font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dispute Tab */}
          {activeTab === 'dispute' && (
            <motion.div
              key="dispute"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Dispute Information</h2>
                <p className="text-muted-foreground mb-6">No active disputes for this case.</p>
                <button
                  onClick={() => {
                    setConfirmAction('dispute');
                    setShowConfirmDialog(true);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (setConfirmAction('dispute'), setShowConfirmDialog(true))}
                  className="px-4 py-2 bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-colors font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive/50"
                  aria-label="Open dispute for this case"
                >
                  Open Dispute
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => !isSubmitting && setShowConfirmDialog(false)}
          >
            <motion.div
              ref={dialogRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-lg p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
            >
              <h2 id="dialog-title" className="text-lg font-semibold text-foreground mb-4">
                Confirm Action
              </h2>
              <p className="text-muted-foreground mb-6">
                {confirmAction === 'retained' && 'Are you sure you want to mark this case as Retained?'}
                {confirmAction === 'not-retained' && `Are you sure you want to mark this case as Not Retained (${selectedReason})?`}
                {confirmAction === 'evaluating' && 'Are you sure you want to mark this case as Still Evaluating?'}
                {confirmAction === 'dispute' && 'Are you sure you want to open a dispute for this case? This action cannot be undone.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-muted/50 text-muted-foreground hover:bg-muted disabled:opacity-50 transition-colors font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 ${
                    confirmAction === 'dispute'
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/50'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Confirming...
                    </span>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
