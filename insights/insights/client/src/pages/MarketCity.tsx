import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface MarketCityProps {
  city: string;
  state: string;
  slug: string;
  cases: number;
  avgCPA: string;
  status: 'Open' | 'Expanding' | 'Waitlist';
  description: string;
  caseTypes: string[];
}

const cityData: Record<string, MarketCityProps> = {
  baltimore: {
    city: 'Baltimore',
    state: 'Maryland',
    slug: 'baltimore',
    cases: 412,
    avgCPA: '$285',
    status: 'Open',
    description: 'Baltimore is CasePort\'s strongest market in Maryland with consistent high-quality case flow.',
    caseTypes: ['Car Accidents', 'Truck Accidents', 'Slip & Fall', 'Workplace Injuries'],
  },
  houston: {
    city: 'Houston',
    state: 'Texas',
    slug: 'houston',
    cases: 389,
    avgCPA: '$195',
    status: 'Open',
    description: 'Houston represents significant opportunity in Texas with strong demand across multiple case types.',
    caseTypes: ['Car Accidents', 'Truck Accidents', 'Motorcycle Accidents', 'Workplace Injuries'],
  },
};

const MarketCity: React.FC<{ slug: string }> = ({ slug }) => {
  const market = cityData[slug];

  if (!market) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">City Not Found</h1>
          <Link href="/markets">
            <a className="text-cyan-400 hover:text-cyan-300">← Back to Markets</a>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'emerald';
      case 'Expanding':
        return 'amber';
      case 'Waitlist':
        return 'slate';
      default:
        return 'slate';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Breadcrumb */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm">
          <Link href="/">
            <a className="text-slate-400 hover:text-cyan-400 transition-colors">Home</a>
          </Link>
          <span className="text-slate-600">/</span>
          <Link href="/markets">
            <a className="text-slate-400 hover:text-cyan-400 transition-colors">Markets</a>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400">{market.city}</span>
        </div>
      </div>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${
              getStatusColor(market.status) === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
              getStatusColor(market.status) === 'amber' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
              'bg-slate-500/10 border-slate-500/30 text-slate-400'
            } uppercase tracking-wider`}>
              {market.status}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            {market.city}, {market.state}
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mb-12">
            {market.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{market.cases}</div>
              <div className="text-sm text-slate-400">Cases this month</div>
            </div>
            <div className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{market.avgCPA}</div>
              <div className="text-sm text-slate-400">Average CPA</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Case Types */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Supported Case Types
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {market.caseTypes.map((caseType) => (
              <motion.div
                key={caseType}
                whileHover={{ y: -5 }}
                className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-8"
              >
                <div className="text-2xl mb-3">⚖️</div>
                <h3 className="text-xl font-semibold text-white">{caseType}</h3>
                <p className="text-slate-400 mt-2">Active case flow in {market.city}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Dual Path CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32 border-t border-slate-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Law Firms */}
            <motion.div
              whileHover={{ y: -5 }}
              className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-12"
            >
              <h3 className="text-2xl font-bold text-white mb-4">For Law Firms</h3>
              <p className="text-slate-300 mb-6">
                {market.city} is an active market with consistent case flow. Request private access to start receiving cases.
              </p>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
                onClick={() => window.location.href = '/request-access'}
              >
                Request Private Access
              </Button>
            </motion.div>

            {/* For Injured People */}
            <motion.div
              whileHover={{ y: -5 }}
              className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-12"
            >
              <h3 className="text-2xl font-bold text-white mb-4">For Injured People</h3>
              <p className="text-slate-300 mb-6">
                If you've been injured in {market.city}, start a free case review with our local law firm partners.
              </p>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold"
              >
                Start Free Case Review
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default MarketCity;
