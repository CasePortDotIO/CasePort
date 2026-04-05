  DESIGN: "The Observatory" — Elevated Editorial with Atmospheric Depth
  CasePort Insights — 10/10 WORLD-CLASS VERSION
  Fonts: Space Grotesk (display headings), Geist Sans (body), JetBrains Mono (system labels)
  Colors: Navy #0A0E17, Cyan #22D3EE, Gold #F59E0B, Glass borders rgba(255,255,255,0.06)
  
  10/10 FEATURES:
  - Search bar in Editorial Grid
  - Category-specific thumbnail images on every card
  - Rich hover micro-interactions (glow, scale, border-light)
  - Count-up animation on stats
  - Staggered entrance animations
  - Generous whitespace throughout
  - No italic fonts — all Space Grotesk bold upright
  - Full semantic HTML + Schema.org markup
*/

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  Clock,
  Bookmark,
  Target,
  Filter as FilterIcon,
  Search,
  BarChart3,
  TrendingUp,
  Radio,
  Building2,
  ChevronRight,
  FileText,
  Layers,
  Zap,
  Users,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import AEOContent from "@/components/AEOContent";
import FAQSection from "@/components/FAQSection";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  articles,
  signals,
  topicClusters,
  categories,
  type Article,
  type Category,
} from "@/lib/articles";

// ─── Asset URLs ───
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/hero-bg-observatory-cif5ZiVFBsvUuiNxsoQwYm.webp";
const FEATURED_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/featured-article-intake-GmYBqecoGyFgqpaS7XnVzk.webp";
const NEWSLETTER_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/newsletter-bg-4jug9seXS8MyefNvfK6qrm.webp";

// ─── Scroll Reveal Wrapper ───
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={`fade-up ${isVisible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// ─── Category Color Map ───
function getCategoryColor(cat: Category): string {
  const map: Record<Category, string> = {
    "Case Acquisition": "#22D3EE",
    Intake: "#10B981",
    "Search & GEO": "#8B5CF6",
    "Lead Economics": "#F59E0B",
    "Law Firm Growth": "#F1F3F5",
    "Market Signals": "#22D3EE",
  };
  return map[cat] || "#22D3EE";
}

// ─── Topic Icon Map ───
function getTopicIcon(icon: string) {
  const size = 22;
  const map: Record<string, React.ReactNode> = {
    target: <Target size={size} />,
    funnel: <FilterIcon size={size} />,
    search: <Search size={size} />,
    chart: <BarChart3 size={size} />,
    signal: <Radio size={size} />,
    growth: <Building2 size={size} />,
  };
  return map[icon] || <TrendingUp size={size} />;
}

// ─── COUNT-UP ANIMATION HOOK ───
function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ─── READING PROGRESS BAR ───
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(scrollPercent, 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-cp-cyan to-cp-purple transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── BACK TO TOP BUTTON ───
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-md flex items-center justify-center text-cp-text-secondary hover:text-cp-cyan hover:border-cp-cyan/30 hover:bg-cp-cyan/5 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}

// ─── BREADCRUMB NAVIGATION ───
function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="container relative z-10 pt-24 pb-0">
      <ol className="flex items-center gap-2 text-[13px]" itemScope itemType="https://schema.org/BreadcrumbList">
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <a href="https://www.caseport.io" itemProp="item" className="text-cp-text-muted hover:text-cp-cyan transition-colors">
            <span itemProp="name">Home</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>
        <ChevronRight size={12} className="text-cp-text-muted/40" />
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <span itemProp="name" className="text-cp-cyan">Insights</span>
          <meta itemProp="position" content="2" />