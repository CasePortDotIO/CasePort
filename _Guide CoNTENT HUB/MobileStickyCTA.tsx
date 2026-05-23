import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface MobileStickyCTAProps {
  category?: string;
  triggerSections?: number;
}

export function MobileStickyCTA({ category = 'Truck Accident', triggerSections = 5 }: MobileStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [sectionsScrolled, setSectionsScrolled] = useState(0);

  useEffect(() => {
    // Check if user previously dismissed this CTA
    const dismissed = sessionStorage.getItem('mobileCTA_dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;

      // Calculate approximate section height (viewport height)
      const sectionHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const currentSection = Math.floor(scrollPosition / sectionHeight);

      setSectionsScrolled(currentSection);

      // Show CTA after scrolling past trigger sections
      if (currentSection >= triggerSections && !isVisible) {
        setIsVisible(true);
        // Track analytics
        trackEvent('mobile_cta_impression', { category, section: currentSection });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed, isVisible, triggerSections, category]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('mobileCTA_dismissed', 'true');
    trackEvent('mobile_cta_dismissed', { category });
  };

  const handleCTA = () => {
    trackEvent('mobile_cta_click', { category, section: sectionsScrolled });
    window.location.href = 'tel:+18002273669';
  };

  // Only show on mobile
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null;
  }

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden animate-in slide-in-from-bottom-2 duration-300">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* CTA Card */}
      <div className="relative bg-white border-t-2 border-[#c4714a] shadow-2xl">
        <div className="px-4 py-4 flex items-center justify-between gap-3">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#999] font-semibold tracking-wide mb-1">READY TO GET HELP?</p>
            <h3 className="text-sm font-bold text-[#1a4a5a] leading-tight">
              Free Consultation Available Now
            </h3>
            <p className="text-xs text-[#666] mt-1">No upfront cost. Available 24/7.</p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCTA}
            className="flex-shrink-0 bg-[#c4714a] hover:bg-[#d4855e] text-white px-4 py-3 rounded-lg font-bold text-sm transition-all active:scale-95 min-h-[44px] flex items-center justify-center whitespace-nowrap"
          >
            Call Now
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-[#999] hover:text-[#1a4a5a] transition-colors p-1"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Analytics tracking helper
function trackEvent(eventName: string, data: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, data);
  }
  // Also log to console for development
  console.log(`[Analytics] ${eventName}`, data);
}
