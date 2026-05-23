import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface GuideData {
  id: string;
  title: string;
  category: string;
  injuryType: string;
  settlementMin: number;
  settlementMax: number;
  settlementAvg: number;
  statuteOfLimitations: number;
  directAnswer: string;
  tldrItems: Array<{ step: number; action: string; timeMin: number; timeMax: number }>;
  keyTakeaways: string[];
  stateRanges: Record<string, { min: number; max: number; avg: number }>;
  realExamples: Array<{ settlement: number; injury: string; timeline: string; details: string }>;
  faqItems: Array<{ q: string; a: string }>;
}

interface GuideTemplateProps {
  guide: GuideData;
}

export default function GuideTemplate({ guide }: GuideTemplateProps) {
  const [selectedState, setSelectedState] = useState('CA');
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentStateRange = guide.stateRanges[selectedState];

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* Sticky Header */}
      {showStickyHeader && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#f9f5ef] border-b border-[#e8e2d8] shadow-md z-40 flex items-center justify-between px-7">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#c4714a] rounded-lg flex items-center justify-center text-white font-bold text-sm">CP</div>
            <span className="text-sm font-semibold text-[#1a4a5a] truncate">{guide.title}</span>
          </div>
          <a href="tel:+18002273669" className="bg-[#c4714a] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md whitespace-nowrap">
            Free Case Review
          </a>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a4a5a] mb-4">{guide.title}</h1>
          <p className="text-lg text-[#555] mb-6">The first 24 hours after a {guide.injuryType.toLowerCase()} are critical. This guide walks you through exactly what to do.</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-[#1a4a5a]">
              <span className="font-semibold">Author:</span> Sarah Mitchell, Esq.
            </div>
            <div className="flex items-center gap-2 text-[#1a4a5a]">
              <span className="font-semibold">Updated:</span> April 28, 2026
            </div>
            <div className="flex items-center gap-2 text-[#1a4a5a]">
              <span className="font-semibold">Read Time:</span> 6 minutes
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">✓ Attorney-Reviewed</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">✓ ABA Compliant</span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">✓ Last Updated: April 28, 2026</span>
          </div>
        </div>

        {/* Direct Answer Section */}
        <div className="bg-white border-l-4 border-[#c4714a] p-6 rounded-lg mb-12 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1a4a5a] mb-4">Direct Answer</h2>
          <p className="text-lg text-[#555] leading-relaxed">{guide.directAnswer}</p>
        </div>

        {/* TL;DR Section */}
        <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">TL;DR - {guide.injuryType} Action Plan</h2>
          <div className="space-y-4">
            {guide.tldrItems.map((item) => (
              <div key={item.step} className="flex gap-4 pb-4 border-b border-[#e8e2d8] last:border-b-0">
                <div className="flex-shrink-0 w-8 h-8 bg-[#c4714a] text-white rounded-full flex items-center justify-center font-bold">{item.step}</div>
                <div>
                  <p className="font-semibold text-[#1a4a5a]">{item.action}</p>
                  <p className="text-sm text-[#999]">{item.timeMin}-{item.timeMax} {item.timeMax <= 60 ? 'min' : 'hrs'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Key Takeaways</h2>
          <div className="space-y-3">
            {guide.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#c4714a] flex-shrink-0 mt-0.5" />
                <p className="text-[#555]">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settlement Ranges */}
        <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">{guide.injuryType} Settlement Ranges: State-by-State</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1a4a5a] mb-2">Select Your State:</label>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-[#e8e2d8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c4714a]"
            >
              {Object.keys(guide.stateRanges).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {currentStateRange && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#f9f5ef] p-4 rounded-lg">
                <p className="text-sm text-[#999] mb-1">Minimum</p>
                <p className="text-2xl font-bold text-[#c4714a]">${(currentStateRange.min / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-[#f9f5ef] p-4 rounded-lg">
                <p className="text-sm text-[#999] mb-1">Average</p>
                <p className="text-2xl font-bold text-[#c4714a]">${(currentStateRange.avg / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-[#f9f5ef] p-4 rounded-lg">
                <p className="text-sm text-[#999] mb-1">Maximum</p>
                <p className="text-2xl font-bold text-[#c4714a]">${(currentStateRange.max / 1000).toFixed(0)}K</p>
              </div>
            </div>
          )}

          <div className="bg-[#f9f5ef] p-4 rounded-lg border border-[#e8e2d8]">
            <p className="text-[#555]"><strong>Statute of Limitations:</strong> {guide.statuteOfLimitations} years from date of injury</p>
            <p className="text-[#555] mt-2"><strong>Key Insight:</strong> Settlements with attorney are typically 5x higher than without.</p>
          </div>
        </div>

        {/* Real Examples */}
        <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Real {guide.injuryType} Settlement Examples</h2>
          <div className="space-y-4">
            {guide.realExamples.map((example, idx) => (
              <div key={idx} className="border border-[#e8e2d8] rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-2xl font-bold text-[#c4714a]">${(example.settlement / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-[#999]">Settlement Amount</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1a4a5a]">{example.timeline}</p>
                    <p className="text-sm text-[#999]">Time to Settle</p>
                  </div>
                </div>
                <p className="text-[#555] mb-2"><strong>Injury:</strong> {example.injury}</p>
                <p className="text-[#555]"><strong>Details:</strong> {example.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {guide.faqItems.map((item, idx) => (
              <details key={idx} className="border border-[#e8e2d8] rounded-lg p-4 cursor-pointer group">
                <summary className="font-semibold text-[#1a4a5a] flex justify-between items-center">
                  {item.q}
                  <ChevronDown className="w-5 h-5 group-open:hidden" />
                  <ChevronUp className="w-5 h-5 hidden group-open:block" />
                </summary>
                <p className="text-[#555] mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Related Guides */}
        <div className="bg-white p-8 rounded-lg mb-12 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1a4a5a] mb-6">Related Injury Guides</h2>
          <p className="text-[#555] mb-6">Explore other personal injury guides to understand your legal options and settlement expectations across different accident types.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/guide/truck-accident/what-to-do" className="border border-[#e8e2d8] rounded-lg p-4 hover:shadow-md transition-all">
              <p className="font-semibold text-[#1a4a5a] mb-2">Truck Accident Guide</p>
              <p className="text-sm text-[#555]">Liability, insurance claims, and settlement expectations after a commercial truck collision</p>
            </a>
            <a href="/guide" className="border border-[#e8e2d8] rounded-lg p-4 hover:shadow-md transition-all">
              <p className="font-semibold text-[#1a4a5a] mb-2">All Injury Guides</p>
              <p className="text-sm text-[#555]">Browse all personal injury guides and find the one that matches your situation</p>
            </a>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-[#c4714a] to-[#d4855e] text-white p-12 rounded-lg text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Don't Navigate This Alone</h2>
          <p className="text-lg mb-6">{guide.injuryType} cases are complex. Insurance companies have teams of adjusters working to minimize your payout. You need an experienced attorney to fight for maximum compensation.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              <span>Free case evaluation - no obligation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              <span>No upfront costs - contingency basis only</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              <span>Expert negotiators who know {guide.category.toLowerCase()} law</span>
            </div>
          </div>
          <a href="tel:+18002273669" className="inline-block bg-white text-[#c4714a] px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#f9f5ef] transition-all">
            Get Free Case Evaluation
          </a>
          <p className="text-sm mt-4">100% Confidential. Your information is protected by attorney-client privilege.</p>
        </div>
      </div>
    </div>
  );
}
