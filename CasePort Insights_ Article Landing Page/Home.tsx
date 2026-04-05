import { motion, AnimatePresence } from "framer-motion";
import {
  useScrollReveal,
  fadeUp,
  fadeIn,
  scaleIn,
  staggerContainer,
  staggerItem,
  slideInLeft,
  slideInRight,
} from "@/hooks/useAnimations";
import AnimatedCounter from "@/components/AnimatedCounter";
import ROICalculator from "@/components/ROICalculator";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  Zap,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Phone,
  Clock,
  Users,
  TrendingUp,
  Lock,
  Eye,
  Filter,
  Route,
  RefreshCw,
  Award,
  ChevronRight,
  Menu,
  ArrowUpRight,
  Play,
  Download,
  MessageCircle,
  AlertTriangle,
  Gauge,
  MapPin,
} from "lucide-react";

/*
 * ═══════════════════════════════════════════════════════════════
 * CASEPORT.IO — HOMEPAGE (POLISHED 10/10)
 * ═══════════════════════════════════════════════════════════════
 *
 * POLISH CHANGELOG:
 * 1. Removed dead space before footer — tighter zone transitions
 * 2. Brighter secondary text (#B8C0CC) — readable without losing premium
 * 3. Stronger proof sections — larger numbers, more visual weight
 * 4. Rhythm variety — alternating layouts, varied spacing
 * 5. Tighter section transitions — no awkward gaps
 * 6. Mobile polish — tighter vertical spacing, readable text
 * 7. Sticky CTA integrated into header — no floating bar
 * 8. Subtle card-hover interactions — lift on hover, no flashy animations
 * 9. Core System cards show step sequence visually
 * 10. Footer connected to final CTA — no void
 *
 * CONVERSION SEQUENCE (Optimized PASTOR):
 * ZONE 1 — DEEP SPACE:  Hero + Trust Bar + Spotlight (PROMISE)
 * ZONE 2 — EMERGENCE:   Market Intelligence + Problem + Transformation + Buyer Reality (PROBLEM + AMPLIFY)
 * ZONE 3 — REVELATION:  System Proof + Core Pillars + Specs + How It Works (STORY/SOLUTION)
 * ZONE 4 — GOLDEN:      ROI Calculator + Lead Magnet (OFFER)
 * ZONE 5 — PROOF:       Trust + Social Proof + Founder Video (TESTIMONY)
 * ZONE 6 — RESOLUTION:  FAQ + Scarcity + Final CTA (RESPONSE)
 */

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/nCnayMKq9Pz5mA74JpJ7kV/caseport-hero-abstract-kBJt36idRAGWzQHKVgWUij.webp";
const SYSTEM_VIZ = "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/nCnayMKq9Pz5mA74JpJ7kV/caseport-system-viz-GvikZj8cjQ4W4t5xEWt5hZ.webp";

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030608] text-white antialiased scroll-smooth">
      <Header />

      {/* AEO: Hidden semantic content for AI crawlers & voice search */}
      <div className="sr-only" role="region" aria-label="About CasePort">
        <h2>What is CasePort?</h2>
        <p>CasePort is a premium case acquisition system for personal injury law firms in the United States. Unlike traditional lead generation companies that sell shared leads to multiple firms, CasePort operates a market-capped model that limits partner firms to a maximum of 3 per metropolitan area. The system includes a 6-layer qualification framework, structured intake control, opportunity routing, and recovery protocols designed to reduce preventable case loss after initial inquiry.</p>
        <h2>Who is CasePort for?</h2>
        <p>CasePort is designed for growth-oriented personal injury law firms that handle auto accident, slip and fall, and other personal injury cases. The service is currently available in the United States, with coverage in major metropolitan areas including Los Angeles, Houston, Miami, New York, Chicago, Phoenix, Atlanta, Philadelphia, Dallas, and Las Vegas.</p>
        <h2>How much do personal injury leads cost?</h2>