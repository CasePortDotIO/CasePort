/**
 * Analytics & Data Logging Utility
 * 
 * Tracks:
 * - Market searches (intent signals)
 * - Market card clicks (interest signals)
 * - Detail panel opens (consideration signals)
 * - CTA clicks (conversion signals)
 * - Exit-intent captures (bounce prevention)
 * - Unlisted market requests (market expansion opportunities)
 * - Market alerts signup (nurture pipeline)
 * 
 * This data builds the data moat and informs market prioritization
 */

export interface AnalyticsEvent {
  type: "market_search" | "market_click" | "detail_open" | "cta_click" | "exit_intent" | "unlisted_request" | "alert_signup";
  market?: string;
  marketId?: string;
  miiScore?: number;
  status?: string;
  timestamp: number;
  sessionId: string;
  userAgent: string;
}

let sessionId = "";

// Initialize session ID
if (typeof window !== "undefined") {
  sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const analytics = {
  // Log market search
  logMarketSearch: (query: string) => {
    const event: AnalyticsEvent = {
      type: "market_search",
      market: query,
      timestamp: Date.now(),
      sessionId,
      userAgent: navigator.userAgent,
    };
    trackEvent(event);
  },

  // Log market card click
  logMarketClick: (marketId: string, marketName: string, miiScore: number, status: string) => {
    const event: AnalyticsEvent = {
      type: "market_click",
      marketId,
      market: marketName,
      miiScore,
      status,
      timestamp: Date.now(),
      sessionId,
      userAgent: navigator.userAgent,
    };
    trackEvent(event);
  },

  // Log detail panel open
  logDetailPanelOpen: (marketId: string, marketName: string) => {
    const event: AnalyticsEvent = {
      type: "detail_open",
      marketId,
      market: marketName,
      timestamp: Date.now(),
      sessionId,
      userAgent: navigator.userAgent,
    };
    trackEvent(event);
  },

  // Log CTA click
  logCTAClick: (marketId: string, marketName: string, ctaType: string) => {
    const event: AnalyticsEvent = {
      type: "cta_click",
      marketId,
      market: marketName,
      timestamp: Date.now(),
      sessionId,
      userAgent: navigator.userAgent,
    };
    trackEvent(event);
  },

  // Log exit-intent capture
  logExitIntentCapture: (email: string) => {
    const event: AnalyticsEvent = {
      type: "exit_intent",
      timestamp: Date.now(),
      sessionId,
      userAgent: navigator.userAgent,
    };
    trackEvent(event);
    // TODO: Send email to backend for nurture sequence
  },

  // Log unlisted market request
  logUnlistedMarketRequest: (market: string, name: string, email: string) => {
    const event: AnalyticsEvent = {
      type: "unlisted_request",
      market,
      timestamp: Date.now(),
      sessionId,
      userAgent: navigator.userAgent,
    };
    trackEvent(event);
    // TODO: Send to backend for market evaluation queue
  },

  // Log market alert signup
  logMarketAlertSignup: (market: string, email: string) => {
    const event: AnalyticsEvent = {
      type: "alert_signup",
      market,
      timestamp: Date.now(),
      sessionId,
      userAgent: navigator.userAgent,
    };
    trackEvent(event);
    // TODO: Send to backend for alert subscription
  },
};

// Internal tracking function
function trackEvent(event: AnalyticsEvent) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", event);
  }

  // TODO: Send to analytics backend
  // fetch("/api/analytics", { method: "POST", body: JSON.stringify(event) });
}

// Utility: Get session ID for debugging
export const getSessionId = () => sessionId;

// Utility: Get all events from session (for debugging)
export const getSessionEvents = () => {
  // TODO: Retrieve from localStorage or backend
  return [];
};
