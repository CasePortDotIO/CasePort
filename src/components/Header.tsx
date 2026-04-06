import Link from 'next/link';
import React from 'react'

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full flex justify-between items-center px-6 md:px-16 py-4 border-b border-white/5 backdrop-blur-md bg-caseport-bg/70 transition-all duration-[1200ms] opacity-0 animate-fade-in">
      <div className="flex flex-col">
        <div className="text-xl font-extrabold tracking-[2px] text-white leading-none">
          CASEPORT
        </div>
        <div className="text-[0.45rem] md:text-[0.55rem] text-slate-400 tracking-[1px] mt-1.5 uppercase font-medium">
          CASE FLOW WITHOUT GUESSWORK
        </div>
      </div>
      <nav className="hidden md:flex gap-8 text-[0.85rem] text-slate-400">
        <a href="#firms" className="hover:text-white transition-colors">
          For Law Firms
        </a>
        <a href="#market" className="hover:text-white transition-colors">
          Market
        </a>
        <a href="/insights" className="hover:text-white transition-colors">
          Insights
        </a>
        <a href="#intelligence" className="hover:text-white transition-colors">
          Intelligence
        </a>
        <a href="#injured" className="hover:text-white transition-colors">
          Injured? &nearr;
        </a>
      </nav>
      <div className="flex flex-col items-center">
        <div className="text-[0.45rem] md:text-[0.5rem] text-slate-400 tracking-[1px] mb-1.5 uppercase">
          FOR QUALIFIED FIRMS ONLY
        </div>
        <a
          href="#access"
          className="bg-gradient-to-r from-caseport-cyan to-caseport-purple text-white font-semibold text-[0.8rem] px-5 py-2.5 rounded-full hover:opacity-90 hover:-translate-y-[1px] transition-all"
        >
          Request Private Access
        </a>
      </div>
    </header>
  )
}
