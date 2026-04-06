import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useRoute } from 'wouter';

interface MarketStateProps {
  state: string;
  slug: string;
  cities: string[];
  status: 'Open' | 'Expanding' | 'Waitlist';
  cases: number;
  avgCPA: string;
  description: string;
}

const marketData: Record<string, MarketStateProps> = {
  maryland: {
    state: 'Maryland',
    slug: 'maryland',
    cities: ['Baltimore', 'Annapolis', 'Bethesda'],
    status: 'Open',
    cases: 847,
    avgCPA: '$285',
    description: 'Maryland is an active CasePort market with strong case flow in Baltimore and surrounding areas.',
  },
  texas: {
    state: 'Texas',
    slug: 'texas',
    cities: ['Houston', 'Dallas', 'Austin'],
    status: 'Open',
    cases: 623,
    avgCPA: '$195',
    description: 'Texas represents significant opportunity with active markets in Houston, Dallas, and Austin.',
  },
  florida: {
    state: 'Florida',
    slug: 'florida',
    cities: ['Miami', 'Tampa', 'Jacksonville'],
    status: 'Open',
    cases: 512,
    avgCPA: '$310',
    description: 'Florida is a mature market with consistent case flow across Miami, Tampa, and Jacksonville.',
  },
};

const MarketState: React.FC<{ slug: string }> = ({ slug }) => {
  const market = marketData[slug];

  if (!market) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Market Not Found</h1>
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
          <span className="text-cyan-400">{market.state}</span>
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
            CasePort in {market.state}
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mb-12">
            {market.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{market.cases}</div>
              <div className="text-sm text-slate-400">Cases this month</div>
            </div>
            <div className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{market.avgCPA}</div>
              <div className="text-sm text-slate-400">Average CPA</div>
            </div>
            <div className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{market.cities.length}</div>
              <div className="text-sm text-slate-400">Active cities</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Cities */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Active Cities in {market.state}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {market.cities.map((city) => (
              <Link key={city} href={`/markets/${city.toLowerCase().replace(/\s+/g, '-')}`}>
                <motion.a
                  whileHover={{ y: -5 }}
                  className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-8 cursor-pointer block"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">{city}</h3>
                  <p className="text-slate-400 mb-6">Explore {city} market details and case flow.</p>
                  <div className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">
                    View City Details →
                  </div>
                </motion.a>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32 border-t border-slate-800/50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Interested in {market.state}?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            {market.status === 'Open' 
              ? `${market.state} is currently open for new partners. Request private access to learn more.`
              : `${market.state} is coming soon. Join the waitlist to be notified when available.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
              onClick={() => window.location.href = '/request-access'}
            >
              Request Private Access
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800/50"
            >
              Back to Markets
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default MarketState;
