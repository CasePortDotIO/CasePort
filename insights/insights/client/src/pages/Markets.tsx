import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Markets = () => {
  const [activeTab, setActiveTab] = useState<'firms' | 'injured'>('firms');

  const marketStatuses = {
    active: [
      { name: 'Maryland', slug: 'maryland', status: 'Open', availability: 'Accepting new partners' },
      { name: 'Texas', slug: 'texas', status: 'Open', availability: 'Accepting new partners' },
      { name: 'Florida', slug: 'florida', status: 'Open', availability: 'Accepting new partners' },
    ],
    expanding: [
      { name: 'California', slug: 'california', status: 'Expanding', availability: 'Opening Q2 2026' },
      { name: 'New York', slug: 'new-york', status: 'Expanding', availability: 'Opening Q2 2026' },
    ],
    waitlist: [
      { name: 'Illinois', slug: 'illinois', status: 'Waitlist', availability: 'Priority access Q3 2026' },
      { name: 'Georgia', slug: 'georgia', status: 'Waitlist', availability: 'Priority access Q3 2026' },
    ],
  };

  const featuredMarkets = [
    {
      name: 'Maryland',
      slug: 'maryland',
      city: 'Baltimore',
      cases: 847,
      avgCPA: '$285',
      status: 'Open',
    },
    {
      name: 'Texas',
      slug: 'texas',
      city: 'Houston',
      cases: 623,
      avgCPA: '$195',
      status: 'Open',
    },
    {
      name: 'Florida',
      slug: 'florida',
      city: 'Miami',
      cases: 512,
      avgCPA: '$310',
      status: 'Open',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
      case 'Expanding':
        return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
      case 'Waitlist':
        return 'bg-slate-500/20 border-slate-500/50 text-slate-400';
      default:
        return 'bg-slate-500/20 border-slate-500/50 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <main className="flex-1 pt-[72px]">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden py-20 sm:py-32"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Explore Active and Expanding</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">CasePort Markets</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mb-12">
            See where CasePort currently supports law firm growth and claimant routing, with additional markets opening over time.
          </p>

          {/* Dual Path CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('firms')}
              className={`p-6 rounded-lg border transition-all backdrop-blur-md ${
                activeTab === 'firms'
                  ? 'bg-cyan-500/20 border-cyan-500/50'
                  : 'bg-slate-800/30 border-slate-700/50 hover:border-cyan-400/30'
              }`}
            >
              <div className="text-2xl mb-2">🏢</div>
              <div className="font-semibold text-white">For Law Firms</div>
              <div className="text-sm text-slate-400">Check market availability & apply</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('injured')}
              className={`p-6 rounded-lg border transition-all backdrop-blur-md ${
                activeTab === 'injured'
                  ? 'bg-cyan-500/20 border-cyan-500/50'
                  : 'bg-slate-800/30 border-slate-700/50 hover:border-cyan-400/30'
              }`}
            >
              <div className="text-2xl mb-2">⚖️</div>
              <div className="font-semibold text-white">For Injured People</div>
              <div className="text-sm text-slate-400">Find your local path</div>
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Market Availability Explanation */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            How Market Availability Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                status: 'Open',
                color: 'emerald',
                description: 'Actively accepting new law firm partners. Full access to case flow.',
              },
              {
                status: 'Expanding',
                color: 'amber',
                description: 'Market opening soon. Early interest welcome. Priority access for early movers.',
              },
              {
                status: 'Waitlist',
                color: 'slate',
                description: 'High demand. Join priority waitlist for guaranteed access when available.',
              },
              {
                status: 'Not Yet Open',
                color: 'slate',
                description: 'Future market. Express interest to be notified when available.',
              },
            ].map((item) => (
              <motion.div
                key={item.status}
                whileHover={{ y: -5 }}
                className={`backdrop-blur-md bg-${item.color}-500/10 border border-${item.color}-500/30 rounded-lg p-6`}
              >
                <div className={`text-sm font-bold text-${item.color}-400 mb-3 uppercase tracking-wider`}>
                  {item.status}
                </div>
                <p className="text-slate-300 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Market Categories */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Active Markets */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8">
              <span className="text-emerald-400">●</span> Active Markets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {marketStatuses.active.map((market) => (
                <Link key={market.slug} href={`/markets/${market.slug}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="backdrop-blur-md bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 cursor-pointer block"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">{market.name}</h4>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                        {market.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{market.availability}</p>
                    <div className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">
                      Explore Market →
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Expanding Markets */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8">
              <span className="text-amber-400">●</span> Expanding Markets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketStatuses.expanding.map((market) => (
                <motion.div
                  key={market.slug}
                  whileHover={{ y: -5 }}
                  className="backdrop-blur-md bg-amber-500/10 border border-amber-500/30 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">{market.name}</h4>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full">
                      {market.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{market.availability}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Waitlist Markets */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">
              <span className="text-slate-400">●</span> Priority Waitlist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketStatuses.waitlist.map((market) => (
                <motion.div
                  key={market.slug}
                  whileHover={{ y: -5 }}
                  className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">{market.name}</h4>
                    <span className="text-xs font-bold text-slate-400 bg-slate-500/20 px-3 py-1 rounded-full">
                      {market.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{market.availability}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Markets */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32 border-t border-slate-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Featured Markets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMarkets.map((market) => (
              <Link key={market.slug} href={`/markets/${market.slug}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-lg p-8 cursor-pointer block"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">{market.name}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(market.status)}`}>
                      {market.status}
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Primary City</div>
                      <div className="text-lg font-semibold text-white">{market.city}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Cases This Month</div>
                        <div className="text-xl font-bold text-cyan-400">{market.cases}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Avg CPA</div>
                        <div className="text-xl font-bold text-cyan-400">{market.avgCPA}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">
                    View Market Details →
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Dual Path CTA Section */}
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
                Check if your target market is open, see current availability, and apply for private access to CasePort's case flow.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-3 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Market availability check</span>
                </li>
                <li className="flex gap-3 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Real-time case flow data</span>
                </li>
                <li className="flex gap-3 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Apply for private access</span>
                </li>
              </ul>
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
                Find help in your area. Select your state or city to start a free case review with a local law firm partner.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-3 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Free case review</span>
                </li>
                <li className="flex gap-3 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Local law firm match</span>
                </li>
                <li className="flex gap-3 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  <span>No upfront costs</span>
                </li>
              </ul>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold"
                onClick={() => window.location.href = '/injured'}
              >
                Start Free Case Review
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default Markets;
