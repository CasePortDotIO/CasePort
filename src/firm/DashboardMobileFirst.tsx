import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Menu, X, ChevronRight, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BloombergClock from '@/firm/BloombergClock';
import RevenueAnalytics from '@/firm/RevenueAnalytics';
import LeadQualityBadge from '@/firm/LeadQualityBadge';
import ChurnRiskBadge from '@/firm/ChurnRiskBadge';

export default function DashboardMobileFirst() {
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('opportunities');

  const metrics = [
    { label: 'Conversion Rate', value: '22.4%', change: '+2.1%', icon: TrendingUp },
    { label: 'Cases Signed', value: '35', change: '+5%', icon: TrendingUp },
    { label: 'Wallet Balance', value: '$18,400', change: '-2400%', icon: AlertCircle },
    { label: 'Response Time', value: '12 min', change: '+3%', icon: TrendingUp },
  ];

  const opportunities = [
    {
      id: '1',
      type: 'Auto Accident',
      market: 'Houston',
      value: '$45K-$85K',
      conversion: 87,
      risk: 'low',
      status: 'new',
    },
    {
      id: '2',
      type: 'Slip & Fall',
      market: 'Dallas',
      value: '$15K-$35K',
      conversion: 72,
      risk: 'medium',
      status: 'new',
    },
    {
      id: '3',
      type: 'Workers Comp',
      market: 'Austin',
      value: '$25K-$55K',
      conversion: 65,
      risk: 'high',
      status: 'viewed',
    },
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              CP
            </div>
            <span className="text-sm font-semibold hidden sm:inline">CasePort</span>
          </div>

          {/* Desktop Clock */}
          <div className="hidden md:flex items-center gap-4">
            <BloombergClock />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Clock */}
        <div className="md:hidden px-4 py-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <span className="font-mono text-sm text-foreground">07:52:09</span>
            <span className="ml-2">Wed, Apr 22</span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-30 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r border-border p-4 space-y-2 overflow-y-auto">
              {['Dashboard', 'Opportunities', 'Wallet', 'Performance', 'Analytics', 'Leaderboard', 'Settings'].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setSidebarOpen(false)}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-6 max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Wednesday, April 22 — Houston Market</p>
        </div>

        {/* Metrics Grid - Mobile: 2 cols, Desktop: 4 cols */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-3 md:p-4 border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    {metric.label}
                  </p>
                  <p className="text-xl md:text-2xl font-light text-foreground mb-1">{metric.value}</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Icon className="w-3 h-3" />
                    {metric.change}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-3">
          {/* Recent Opportunities */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => toggleSection('opportunities')}
              className="w-full flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="text-left">
                <h2 className="font-semibold text-foreground">Recent Opportunities</h2>
                <p className="text-xs text-muted-foreground mt-1">Last 7 days activity</p>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  expandedSection === 'opportunities' ? 'rotate-90' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {expandedSection === 'opportunities' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 mt-2"
                >
                  {opportunities.map((opp, idx) => (
                    <motion.div
                      key={opp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="p-3 md:p-4 border-border">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-foreground text-sm">{opp.type}</p>
                            <p className="text-xs text-muted-foreground">{opp.market}</p>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-700 border-blue-300 text-xs">
                            {opp.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{opp.value}</span>
                          <LeadQualityBadge
                            tier={opp.conversion > 80 ? 'platinum' : opp.conversion > 70 ? 'gold' : 'silver'}
                            score={opp.conversion}
                            probability={opp.conversion / 100}
                            recommendation="Strong lead"
                          />
                        </div>
                        <div className="mt-2">
                          <ChurnRiskBadge
                            riskLevel={opp.risk as 'low' | 'medium' | 'high'}
                            daysSinceUpdate={2}
                            conversionProbability={opp.conversion / 100}
                          />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Revenue Analytics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => toggleSection('revenue')}
              className="w-full flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="text-left">
                <h2 className="font-semibold text-foreground">Revenue Analytics</h2>
                <p className="text-xs text-muted-foreground mt-1">This month performance</p>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  expandedSection === 'revenue' ? 'rotate-90' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {expandedSection === 'revenue' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2"
                >
                  <RevenueAnalytics />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Wallet Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Wallet Balance</p>
                  <p className="text-2xl font-light text-foreground mt-1">$18,400</p>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-300">20% Low</Badge>
              </div>
              <Button className="w-full bg-primary text-primary-foreground text-sm" onClick={() => navigate('/wallet')}>Add Funds</Button>
            </Card>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center"
        >
          <p className="text-sm text-foreground font-semibold mb-2">Your rank: #8 of 156</p>
          <p className="text-xs text-muted-foreground">Top 5% of firms. Keep accepting cases to climb higher.</p>
        </motion.div>
      </div>
    </div>
  );
}
