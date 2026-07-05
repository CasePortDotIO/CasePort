'use client'

import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter'
import { TooltipProvider } from '@/components/ui/tooltip'
import CasePortLayoutEnhanced from '@/firm/CasePortLayoutEnhanced'
import DashboardMobileFirst from '@/firm/DashboardMobileFirst'
import DashboardInstitutional from '@/firm/DashboardInstitutional'
import OpportunitiesExcellent from '@/firm/OpportunitiesExcellent'
import OpportunityDetailProduction from '@/firm/OpportunityDetailProduction'
import WalletEnhanced from '@/firm/WalletEnhanced'
import OutcomeFeedbackEnhanced from '@/firm/OutcomeFeedbackEnhanced'
import PerformanceEnhanced from '@/firm/PerformanceEnhanced'
import AnalyticsDashboard from '@/firm/AnalyticsDashboard'
import SettingsPage from '@/firm/SettingsPage'
import LeaderboardPage from '@/firm/LeaderboardPage'

/**
 * The ported Manus Law Firm dashboard, mounted as a single client island under
 * /firm/*. Client-side routing is handled by wouter with base="/firm", so the
 * internal paths (/dashboard, /wallet, ...) match the prototype exactly while
 * the browser URL stays under /firm. No deviation from the prototype layout.
 */
function FirmRouter() {
  const [location] = useLocation()

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
        <Route path="/performance" component={PerformanceEnhanced} />
        <Route path="/feedback" component={OutcomeFeedbackEnhanced} />
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/leaderboard" component={LeaderboardPage} />
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
