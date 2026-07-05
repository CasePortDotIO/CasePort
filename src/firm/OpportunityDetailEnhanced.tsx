import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Badge, NeonCard, OutcomeButtonGroup } from '@/firm/CasePortComponentsEnhanced';

export default function OpportunityDetailEnhanced() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const tabs = ['Overview', 'Intelligence', 'Timeline', 'Dispute'];

  const timelineEvents = [
    { time: '09:20 AM', event: 'Opportunity Delivered', status: 'completed' },
    { time: '09:22 AM', event: 'First Contact Attempt', status: 'completed' },
    { time: '09:26 AM', event: 'Contact Successful', status: 'completed' },
    { time: 'Pending', event: 'Outcome Submission Due', status: 'pending' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-secondary px-8 py-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate('/opportunities')}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <p className="text-xs text-muted-foreground">Opportunity Details</p>
            <h1 className="text-2xl font-semibold text-foreground font-mono">CP-2026-000089</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Badge variant="default">Contacted</Badge>
          <span className="text-sm text-muted-foreground">Auto Accident</span>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Houston, TX
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Tabs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex gap-1 border-b border-border"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              whileHover={{ y: -2 }}
              className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.toLowerCase()
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-3 gap-6"
            >
              {/* Left Column */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="col-span-2 space-y-6"
              >
                {/* Case Profile */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">CASE PROFILE</h2>
                  <NeonCard dashed>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Case Type
                          </p>
                          <p className="text-sm text-foreground mt-1">Auto Accident</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Injury Type
                          </p>
                          <p className="text-sm text-foreground mt-1">Soft Tissue</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Liability
                          </p>
                          <p className="text-sm text-foreground mt-1">Clear</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Claimant Age
                          </p>
                          <p className="text-sm text-foreground mt-1">34</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Incident Description
                        </p>
                        <p className="text-sm text-foreground mt-2">
                          Rear-end collision on I-45 near downtown Houston. Claimant was stopped at
                          traffic light when struck by sedan traveling approximately 35 mph.
                        </p>
                      </div>
                    </div>
                  </NeonCard>
                </motion.div>

                {/* SOL Information */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">STATUTE OF LIMITATIONS</h2>
                  <NeonCard>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">
                          Incident Date: March 21, 2024
                        </p>
                        <p className="text-sm text-chart-3 font-semibold">
                          2 years 1 month remaining
                        </p>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-primary"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        SOL expires: March 21, 2026
                      </p>
                    </div>
                  </NeonCard>
                </motion.div>

                {/* Outcome Submission */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">SUBMIT OUTCOME</h2>
                  <NeonCard dashed>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        What is the outcome of this opportunity?
                      </p>
                      <OutcomeButtonGroup
                        onRetained={() => alert('Outcome submitted: Retained')}
                        onNotRetained={() => alert('Outcome submission: Not Retained')}
                        onEvaluating={() => alert('Outcome submitted: Still Evaluating')}
                      />
                    </div>
                  </NeonCard>
                </motion.div>
              </motion.div>

              {/* Right Column */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Response Performance */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">RESPONSE PERFORMANCE</h2>
                  <NeonCard>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Delivered
                        </p>
                        <p className="text-sm text-foreground mt-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Apr 20, 09:20 AM
                        </p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          First Contact
                        </p>
                        <p className="text-sm text-foreground mt-1">Apr 20, 09:26 AM</p>
                        <p className="text-xs text-chart-1 font-semibold mt-1">6 minutes </p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Your Benchmark
                        </p>
                        <p className="text-sm text-foreground mt-1">7.5 minutes average</p>
                      </div>
                    </div>
                  </NeonCard>
                </motion.div>

                {/* Intake Intelligence */}
                <motion.div variants={itemVariants}>
                  <button
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === 'intelligence' ? null : 'intelligence'
                      )
                    }
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <h2 className="text-lg font-semibold text-foreground">INTAKE INTELLIGENCE</h2>
                    <motion.div
                      animate={{ rotate: expandedSection === 'intelligence' ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedSection === 'intelligence' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <NeonCard>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Defendant Information
                              </p>
                              <p className="text-sm text-foreground mt-1">
                                State Farm Mutual Auto Insurance Co.
                              </p>
                            </div>
                            <div className="border-t border-border pt-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Estimated Settlement Range
                              </p>
                              <p className="text-sm text-foreground mt-1">$25,000 - $75,000</p>
                            </div>
                            <div className="border-t border-border pt-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Case Fit Score
                              </p>
                              <p className="text-sm text-chart-1 font-semibold mt-1">92/100</p>
                            </div>
                          </div>
                        </NeonCard>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <NeonCard dashed>
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
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-4 h-4 rounded-full ${
                            event.status === 'completed' ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                        {idx < timelineEvents.length - 1 && (
                          <div className="w-0.5 h-12 bg-border mt-2" />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="text-xs font-semibold text-muted-foreground">{event.time}</p>
                        <p className="text-sm text-foreground mt-1">{event.event}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </NeonCard>
            </motion.div>
          )}

          {activeTab === 'intelligence' && (
            <motion.div
              key="intelligence"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <NeonCard dashed>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      Market Intelligence
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This case type has a 78% settlement rate in the Houston market. Average
                      settlement time is 8-12 months. Defendant carrier has good settlement history.
                    </p>
                  </div>
                  <div className="border-t border-border pt-6">
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      Claimant Profile
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      First-time claimant, employed, stable residence. Medical treatment ongoing.
                      No prior litigation history.
                    </p>
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          )}

          {activeTab === 'dispute' && (
            <motion.div
              key="dispute"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <NeonCard>
                <div className="flex items-center gap-3 p-4 bg-chart-3/10 border border-chart-3/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-chart-3 flex-shrink-0" />                  <p className="text-sm text-chart-3">                    No disputes currently filed for this opportunity.
                  </p>
                </div>
              </NeonCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
