import { Phone, TrendingUp, Info, Sparkles } from "lucide-react";

interface SettlementRange {
  min: number;
  max: number;
  avg: number;
}

interface CalculatorProps {
  ranges: Record<string, { range: string; avg: string }>;
  city?: string;
}

/**
 * Enhanced Settlement Calculator with Glassmorphism
 * Features:
 * - Interactive injury type selector
 * - Real-time settlement range visualization
 * - Glassmorphism design with blur effects
 * - Smooth animations and transitions
 * - Mobile responsive
 */

export default function SettlementCalculator({ ranges, city = "your area" }: CalculatorProps) {
  const [selectedInjury, setSelectedInjury] = useState(Object.keys(ranges)[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const injuryTypes = [
    { key: "car-accident", label: "Car Accident", icon: "🚗" },
    { key: "slip-fall", label: "Slip & Fall", icon: "⚠️" },
    { key: "medical-malpractice", label: "Medical Malpractice", icon: "🏥" },
    { key: "workplace-injury", label: "Workplace Injury", icon: "🏭" },
  ];

  const selectedRange = ranges[selectedInjury];

  // Parse range string to numbers
  const parseRange = (rangeStr: string): SettlementRange => {
    const matches = rangeStr.match(/\$(\d+)K\s*-\s*\$(\d+)K\+?/);
    if (matches) {
      const min = parseInt(matches[1]) * 1000;
      const max = parseInt(matches[2]) * 1000;
      return { min, max, avg: (min + max) / 2 };
    }
    return { min: 0, max: 0, avg: 0 };
  };

  const range = useMemo(() => parseRange(selectedRange.range), [selectedRange.range]);
  const avgAmount = useMemo(() => parseRange(selectedRange.avg).avg, [selectedRange.avg]);