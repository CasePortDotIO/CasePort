  DESIGN: "The Observatory" — CasePort Insights Article Template (10/10 Apple-Level)
  LAYOUT:  Dark hero (Observatory theme) → Seamless gradient transition → White reading body (NYT/Atlantic style)
  READING BODY: Pure white (#FFFFFF) background, dark charcoal text (#1F2937)
  Typography: Space Grotesk (headings, bold), Geist Sans (body 20px / line-height 2.0), JetBrains Mono (system)
  No italic fonts anywhere. Dan Lok voice on CTAs. Backlink infrastructure baked in.
  
  APPLE-LEVEL WHITESPACE (reading body):
  - Section gaps: 160px (increased from 128px) — LUXURIOUS breathing room
  - Paragraph spacing: 48px (increased from 40px) — premium reading rhythm
  - Heading to body: 56px (increased from 48px) — commanding visual hierarchy
  - Card padding: 40-48px minimum (increased from 32px) — refined, luxurious
  - Reading column: max-w-[720px], centered with large side margins
  - Blockquote vertical: my-24 lg:my-32 — generous breathing room
  - H2 headings: text-[40px] lg:text-[48px] — prominent, commanding
  - All interactive elements: smooth hover states, micro-interactions
  - Scroll animations: fade-in, slide-up, stagger effects throughout
  
  APPLE-LEVEL REFINEMENTS:
  - Micro-interactions on all cards, buttons, links
  - Scroll animations (fade, slide, stagger)
  - Custom refined icons throughout
  - Visual separation via subtle backgrounds and borders
  - Seamless hero-to-white transition (200px gradient fade)
  - Refined color palette with intentional hierarchy
  - Success animations on interactions
  - Focus states for accessibility
  - SCROLL INDICATOR at bottom of hero (chevron pulse)
  - GRADIENT FADE at hero bottom suggesting content below
  - PARALLAX effect on hero as user scrolls
  - STAGGERED animations on all list items
  - GLOW effects on hover for cards and buttons
  - SMOOTH fade-in for all sections as they enter viewport
*/

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "wouter";
import {
  ArrowLeft, ArrowUp, Linkedin, Twitter, LinkIcon, Clock, Calendar,
  RefreshCw, ChevronRight, Check, AlertTriangle, ExternalLink, Copy,
  TrendingUp, BarChart3, Users, Award, CheckCircle2, Zap, Target,
  Lightbulb, Lock, Gauge, AlertCircle, ChevronDown, Download, MessageSquare,
  Eye, Share2, Bookmark, X
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articleContents, type ArticleSection } from "@/lib/articleContent";
import { articles } from "@/lib/articles";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

/* ─── Reading Progress Bar ─── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #06B6D4, #8B5CF6)"
        }}
      />
    </div>
  );
}
