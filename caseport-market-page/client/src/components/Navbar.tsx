/**
 * CasePort Navigation Bar — Exact match to www.CasePort.io homepage
 * 
 * Structure (from homepage source):
 * <header> sticky top-0 z-50 border-b border-white/[0.06] bg-[#030608]/80 backdrop-blur-2xl
 *   <div> mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8
 *     Logo: "CASEPORT" (text-[17px] font-extrabold tracking-[0.28em] text-white sm:text-lg)
 *            + "Case Flow Without Guesswork" (system-label text-[#6B7280] mt-0.5 tracking-[0.22em] font-size:0.5rem)
 *     Nav: hidden lg:flex items-center gap-8 text-[13px] font-medium text-[#9CA3AF]
 *          Links: link-underline transition duration-200 hover:text-white
 *          "Injured?" has ArrowUpRight icon
 *     Right: "For qualified firms only" (text-[8px] uppercase tracking-[0.22em] text-[#6B7280] font-mono mb-1)
 *            CTA: rounded-full px-5 py-2 text-[13px] font-semibold text-white
 *                 bg: linear-gradient(135deg, #00B4D8 0%, #5BB6C9 40%, #7C5CFF 100%)
 *                 shadow-[0_0_24px_rgba(0,212,255,0.2)]
 *     Mobile: lg:hidden rounded-xl border border-white/10 bg-white/[0.04] p-2.5
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "For Law Firms", href: "https://www.caseport.io/for-law-firms" },
  { label: "Markets", href: "#", active: true },
  { label: "Insights", href: "https://www.caseport.io/insights" },
  { label: "Intelligence", href: "https://www.caseport.io/#intelligence" },
  { label: "Injured?", href: "https://www.caseport.io/#injured", hasIcon: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030608]/80 backdrop-blur-2xl transition-all duration-500"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="https://www.caseport.io" className="flex-shrink-0">
          <div className="text-[17px] font-extrabold tracking-[0.28em] text-white sm:text-lg">
            CASEPORT
          </div>
          <div
            className="system-label text-[#6B7280] mt-0.5 tracking-[0.22em]"
            style={{ fontSize: "0.5rem" }}
          >
            Case Flow Without Guesswork
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#9CA3AF] lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`transition duration-200 hover:text-white ${
                link.hasIcon ? "group flex items-center gap-1.5" : "link-underline"
              } ${link.active ? "text-white" : ""}`}
            >
              {link.label}
              {link.hasIcon && (
                <ArrowUpRight className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
              )}
            </a>
          ))}
        </nav>

        {/* Right Side — CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[8px] uppercase tracking-[0.22em] text-[#6B7280] font-mono mb-1">
              For qualified firms only
            </span>
            <a
              href="https://www.caseport.io/request-access"
              className="rounded-full px-5 py-2 text-[13px] font-semibold text-white shadow-[0_0_24px_rgba(0,212,255,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(0,212,255,0.35)] inline-block"
              style={{
                background: "linear-gradient(135deg, rgb(0, 180, 216) 0%, rgb(91, 182, 201) 40%, rgb(124, 92, 255) 100%)",
              }}
            >
              Request Private Access
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden rounded-xl border border-white/10 bg-white/[0.04] p-2.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <Menu className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-t border-white/[0.06] bg-[#030608]/95 backdrop-blur-2xl"
          >
            <div className="mx-auto max-w-7xl px-5 py-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`block px-3 py-3 text-[14px] font-medium transition duration-200 ${
                    link.active
                      ? "text-white"
                      : "text-[#9CA3AF] hover:text-white"
                  } ${link.hasIcon ? "flex items-center gap-1.5" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  {link.hasIcon && (
                    <ArrowUpRight className="h-3 w-3 opacity-50" />
                  )}
                </a>
              ))}
              <div className="pt-4 mt-2 border-t border-white/[0.06]">
                <span className="block text-[8px] uppercase tracking-[0.22em] text-[#6B7280] font-mono mb-2 text-center">
                  For qualified firms only
                </span>
                <a
                  href="https://www.caseport.io/request-access"
                  className="block w-full text-center rounded-full px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_24px_rgba(0,212,255,0.2)]"
                  style={{
                    background: "linear-gradient(135deg, rgb(0, 180, 216) 0%, rgb(91, 182, 201) 40%, rgb(124, 92, 255) 100%)",
                  }}
                >
                  Request Private Access
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
