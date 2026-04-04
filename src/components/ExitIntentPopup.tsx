import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Only show once per session
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Check if mouse is leaving from top of viewport
      if (e.clientY <= 0) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md w-full mx-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl p-8">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 mb-4">
            <span className="text-xs font-semibold text-red-400 tracking-wider">WAIT! SPECIAL OFFER</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Hold On—We Have Something Special
          </h2>
          <p className="text-gray-300 text-sm">
            Get exclusive access to CasePort before you go.
          </p>
        </div>

        {/* Offer Box */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/30">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">LIMITED TIME OFFER</p>
            <p className="text-3xl font-bold text-cyan-400 mb-1">50% OFF</p>
            <p className="text-sm text-gray-300">First month of market access</p>
            <p className="text-xs text-gray-400 mt-2">+ Free consultation with our case acquisition specialist</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-4">
          <button
            onClick={() => {
              // Navigate to request access
              window.location.href = "/request-access";
            }}
            className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Claim My 50% Discount
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="w-full px-4 py-3 rounded-lg font-semibold text-gray-300 bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            No Thanks, I'll Pass
          </button>
        </div>

        {/* Trust Signal */}
        <div className="text-center text-xs text-gray-400">
          <p>✓ ABA Compliant • ✓ SOC 2 Certified • ✓ 200+ Law Firms Trust Us</p>
        </div>
      </div>
    </div>
  );
}
