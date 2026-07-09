'use client'

import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter'
import { TooltipProvider } from '@/components/ui/tooltip'
import CasePortLayoutEnhanced from '@/firm/CasePortLayoutEnhanced'
import DashboardMobileFirst from '@/firm/DashboardMobileFirst'
import DashboardInstitutional from '@/firm/DashboardInstitutional'
import OpportunitiesExcellent from '@/firm/OpportunitiesExcellent'
import OpportunityDetailProduction from '@/firm/OpportunityDetailProduction'
import WalletEnhanced from '@/firm/WalletEnhanced'
import SettingsPage from '@/firm/SettingsPage'
import FirmLogin from '@/firm/FirmLogin'
import FirmForgot from '@/firm/FirmForgot'
import FirmActivate from '@/firm/FirmActivate'
import ComingSoon from '@/firm/ComingSoon'

/*
 * Surfaces not yet backed by real data are routed to an honest placeholder
 * rather than shown with fabricated numbers (performance, analytics, ranking,
 * and the outcome-feedback rollup). Real outcome reporting lives on each
 * opportunity's closing kit; these rollups activate once real cases accumulate.
 */
const PerformanceSoon = () => (
  <ComingSoon title="Performance" blurb="Response-time trends and your true cost per signed case will appear here once your firm has delivered and reported on real cases." />
);
const AnalyticsSoon = () => (
  <ComingSoon title="Advanced Analytics" blurb="Cohort, funnel, and channel-attribution views build from your own delivered cases and reported outcomes. They activate as that history accumulates." />
);
const LeaderboardSoon = () => (
  <ComingSoon title="Market Standing" blurb="Benchmarks against your market are shown only when there is enough real, comparable activity to be meaningful and fair. Never a fabricated rank." />
);
const FeedbackSoon = () => (
  <ComingSoon title="Outcome Feedback" blurb="Report outcomes with one tap on each opportunity's closing kit. A portfolio rollup of your reported outcomes will appear here as they accumulate." />
);

/**
 * The ported Manus Law Firm dashboard, mounted as a single client island under
 * /firm/*. Client-side routing is handled by wouter with base="/firm", so the
 * internal paths (/dashboard, /wallet, ...) match the prototype exactly while
 * the browser URL stays under /firm. No deviation from the prototype layout.
 */
function FirmRouter() {
  const [location] = useLocation()

  // Auth surfaces stand alone, without the dashboard chrome.
  if (location === '/login') return <FirmLogin />
  if (location === '/forgot') return <FirmForgot />
  if (location === '/activate') return <FirmActivate />

  const getCurrentScreen = () => {
    if (location.startsWith('/opportunities') || location.startsWith('/opportunity')) return 'opportunities'
    if (location === '/wallet') return 'wallet'
    if (location === '/performance') return 'performance'
    if (location === '/feedback') return 'feedback'
    if (location === '/analytics') return 'analytics'
    if (location === '/leaderboard') return 'leaderboard'
    if (location === '/settings') return 'settings'
    return 'dashboard'
  }

  return (
    <CasePortLayoutEnhanced currentScreen={getCurrentScreen()}>
      <Switch>
        <Route path="/" component={DashboardMobileFirst} />
        <Route path="/dashboard" component={DashboardInstitutional} />
        <Route path="/opportunities" component={OpportunitiesExcellent} />
        <Route path="/opportunity/:id" component={OpportunityDetailProduction} />
        <Route path="/wallet" component={WalletEnhanced} />
        <Route path="/performance" component={PerformanceSoon} />
        <Route path="/feedback" component={FeedbackSoon} />
        <Route path="/analytics" component={AnalyticsSoon} />
        <Route path="/leaderboard" component={LeaderboardSoon} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={DashboardMobileFirst} />
      </Switch>
    </CasePortLayoutEnhanced>
  )
}

export default function FirmApp() {
  return (
    <div className="firm-root dark">
      <WouterRouter base="/firm">
        <TooltipProvider>
          <FirmRouter />
        </TooltipProvider>
      </WouterRouter>
    </div>
  )
}
