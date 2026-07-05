import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  StatusBadge,
  CPIDCell,
  QualificationTierBadge,
  ResponseTimeIndicator,
  OutcomeButtonGroup,
} from '@/firm/CasePortComponents';

export default function OpportunityDetail() {
  const [, navigate] = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const opportunityId = 'CP-2026-000089';

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/opportunities')}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-muted-foreground">Opportunities</span>
        </div>

        <div className="flex items-center gap-4">
          <CPIDCell id={opportunityId} />
          <StatusBadge status="Contacted" />
          <span className="text-sm text-muted-foreground">Auto Accident</span>
          <span className="text-sm text-muted-foreground">Houston, TX</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="dispute">Dispute</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="grid grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="col-span-2 space-y-6">
              {/* Case Profile */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  CASE PROFILE
                </h3>

                <QualificationTierBadge tier="A" score={85} />

                <div className="space-y-2">
                  <p className="text-sm text-foreground leading-relaxed">
                    Rear-end collision. ER visit mentioned. Submitted within 48 hours of incident.
                    Three of four high-value signals present.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Value Tier</p>
                    <p className="text-sm font-semibold text-foreground mt-1">High</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Urgency</p>
                    <p className="text-sm font-semibold text-amber-400 mt-1">
                      Urgent — incident within 72 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Statute of Limitations */}
              <div className="bg-card border-l-4 border-l-primary border border-border rounded-lg p-6 space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  STATUTE OF LIMITATIONS
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">State</p>
                    <p className="text-sm font-semibold text-foreground mt-1">Texas</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Incident Date</p>
                    <p className="text-sm font-semibold text-foreground mt-1">April 18, 2026</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">SOL Deadline</p>
                    <p className="text-sm font-semibold text-foreground mt-1">April 18, 2028</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Days Remaining</p>
                    <p className="text-sm font-semibold text-green-400 mt-1">729 days</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                  CasePort monitoring active
                </p>
              </div>

              {/* Outcome */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  OUTCOME
                </h3>

                <OutcomeButtonGroup
                  onRetained={() => console.log('Retained')}
                  onNotRetained={() => console.log('Not Retained')}
                  onEvaluating={() => console.log('Evaluating')}
                />

                <p className="text-xs text-muted-foreground">
                  Submitting outcome improves your reporting score and routing priority
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Response Performance */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  RESPONSE PERFORMANCE
                </h3>

                <ResponseTimeIndicator time={6} benchmark={8} market={18} />
              </div>

              {/* Intake Intelligence */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('intake')}
                  className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    INTAKE INTELLIGENCE
                  </h3>
                  {expandedSection === 'intake' ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {expandedSection === 'intake' && (
                  <div className="border-t border-border p-6 space-y-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      Hi [Name], this is Chen & Associates — we received your request and wanted to
                      reach out right away. I understand you were in an accident...
                    </p>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Primary Questions
                      </p>
                      <ol className="text-sm text-foreground space-y-1 list-decimal list-inside">
                        <li>Were you injured in the accident?</li>
                        <li>Did you receive medical treatment?</li>
                        <li>Are you currently represented by an attorney?</li>
                        <li>What is the extent of your injuries?</li>
                      </ol>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">
                        Red Flags
                      </p>
                      <p className="text-sm text-foreground">Minor injuries, no medical treatment</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">
                        High Value Signals
                      </p>
                      <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
                        <li>ER visit mentioned</li>
                        <li>Submitted within 48 hours</li>
                        <li>Rear-end collision (liability clear)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="space-y-6">
                {[
                  {
                    time: 'April 20 9:14 AM',
                    event: 'Opportunity Received',
                    color: 'bg-primary',
                  },
                  {
                    time: 'April 20 9:14 AM',
                    event: 'Buyer Alert Sent',
                    color: 'bg-primary',
                    detail: 'All channels notified',
                  },
                  {
                    time: 'April 20 9:20 AM',
                    event: 'First Contact Verified',
                    color: 'bg-green-500',
                    detail: '6 minutes · Within SLA',
                  },
                  {
                    time: 'April 20 9:20 AM',
                    event: 'Delivery Confirmed',
                    color: 'bg-green-500',
                    detail: 'Charged to wallet',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      {idx < 3 && <div className="w-0.5 h-12 bg-border mt-2" />}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                      <p className="text-sm font-semibold text-foreground">{item.event}</p>
                      {item.detail && (
                        <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex gap-4 pt-4 border-t border-border">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full border-2 border-dashed border-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Outcome Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Intelligence Tab */}
          <TabsContent value="intelligence">
            <div className="bg-card border border-border rounded-lg p-8">
              <p className="text-muted-foreground">Intelligence data coming soon...</p>
            </div>
          </TabsContent>

          {/* Dispute Tab */}
          <TabsContent value="dispute">
            <div className="bg-card border border-border rounded-lg p-8">
              <p className="text-muted-foreground">Dispute information coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
