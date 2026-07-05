import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'contact' | 'response' | 'outcome' | 'update';
}

export default function OpportunityDetailExcellent() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'timeline' | 'dispute'>('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showReasonCodes, setShowReasonCodes] = useState(false);

  // Mock data
  const opportunityId = 'CP-2026-000089';
  const caseType = 'Auto Accident';
  const market = 'Houston, TX';
  const status = 'Contacted';
  const received = '2 hours ago';
  const responseTime = 6;

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

  const reasonCodes = [
    { code: 'NR-001', label: 'Not Retained - Client Declined' },
    { code: 'NR-002', label: 'Not Retained - Conflict of Interest' },
    { code: 'NR-003', label: 'Not Retained - Outside Practice Area' },
    { code: 'NR-004', label: 'Not Retained - No Liability' },
    { code: 'NR-005', label: 'Not Retained - Insufficient Damages' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'dispute', label: 'Dispute' },
  ];

  const handleOutcomeSubmit = (outcome: string) => {
    if (outcome === 'not-retained' && !showReasonCodes) {
      setShowReasonCodes(true);
      return;
    }
    toast.success(`Outcome submitted: ${outcome}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/opportunities')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Opportunities
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground font-mono">{opportunityId}</h1>
            <p className="text-sm text-muted-foreground mt-1">{caseType} · {market}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-blue-500/20 text-blue-200 border-blue-500/30">
              {status}
            </span>
            <span className="text-sm text-muted-foreground">{received}</span>
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
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
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
                      <p className="text-foreground mt-1">{caseType}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Market</p>
                      <p className="text-foreground mt-1">{market}</p>
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
                      className="w-full px-4 py-3 rounded-lg bg-chart-1/20 text-chart-1 border border-chart-1/30 hover:bg-chart-1/30 transition-colors font-semibold"
                    >
                      Retained
                    </button>
                    <button
                      onClick={() => handleOutcomeSubmit('not-retained')}
                      className="w-full px-4 py-3 rounded-lg bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-colors font-semibold"
                    >
                      Not Retained
                    </button>
                    <button
                      onClick={() => handleOutcomeSubmit('evaluating')}
                      className="w-full px-4 py-3 rounded-lg bg-muted/50 text-muted-foreground border border-muted/50 hover:bg-muted/70 transition-colors font-semibold"
                    >
                      Still Evaluating ○
                    </button>
                  </div>

                  {/* Reason Codes */}
                  <AnimatePresence>
                    {showReasonCodes && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Select Reason Code</p>
                        <div className="space-y-2">
                          {reasonCodes.map(code => (
                            <button
                              key={code.code}
                              onClick={() => {
                                toast.success(`Submitted: ${code.label}`);
                                setShowReasonCodes(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm rounded-lg bg-muted/50 text-foreground hover:bg-muted transition-colors"
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
                {/* Response Performance */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Response Performance</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Response</p>
                      <p className="text-2xl font-bold text-chart-1 mt-1">{responseTime} min</p>
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
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
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
                    {/* Timeline Dot */}
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

                    {/* Event Content */}
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
                  onClick={() => toast.info('Dispute process initiated')}
                  className="px-4 py-2 bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-colors font-semibold rounded-lg"
                >
                  Open Dispute
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
