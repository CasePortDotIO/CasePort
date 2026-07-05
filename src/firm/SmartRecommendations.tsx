import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: "high" | "medium" | "low";
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "1",
    title: "Improve Response Time",
    description: "Respond to 3 overdue cases to improve your score by 12%",
    action: "View Overdue Cases",
    priority: "high",
  },
  {
    id: "2",
    title: "Below Market Average",
    description: "You're 15% below market average on response time. Focus on quick responses.",
    action: "View Benchmark",
    priority: "high",
  },
  {
    id: "3",
    title: "High-Performing Case Type",
    description: "Auto accident cases have 40% higher sign rate. Prioritize these.",
    action: "Filter Auto Accidents",
    priority: "medium",
  },
  {
    id: "4",
    title: "Strong Performance",
    description: "Your ROI is up 8% this month. Maintain this momentum.",
    action: "View Performance",
    priority: "low",
  },
  {
    id: "5",
    title: "Wallet Alert",
    description: "Your wallet balance is below $5K. Consider topping up.",
    action: "Top Up Wallet",
    priority: "high",
  },
];

export function SmartRecommendations() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Rotate recommendations every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RECOMMENDATIONS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const filteredRecommendations = RECOMMENDATIONS.filter(
    (rec) => !dismissed.has(rec.id)
  );

  if (filteredRecommendations.length === 0) {
    return null;
  }

  const current = filteredRecommendations[currentIndex % filteredRecommendations.length];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-destructive/50 bg-destructive/5";
      case "medium":
        return "border-chart-3/50 bg-chart-3/5";
      default:
        return "border-primary/50 bg-primary/5";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`border rounded-lg p-4 ${getPriorityColor(current.priority)}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-1"
            >
              <Lightbulb className="w-5 h-5 text-primary" />
            </motion.div>
            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-semibold text-foreground"
              >
                {current.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-sm text-muted-foreground mt-1"
              >
                {current.description}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
            >
              {current.action}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newDismissed = new Set(dismissed);
                newDismissed.add(current.id);
                setDismissed(newDismissed);
              }}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>
        </div>

        {/* Recommendation counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-1 mt-3"
        >
          {filteredRecommendations.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-1 rounded-full transition-all ${
                idx === currentIndex % filteredRecommendations.length
                  ? "w-4 bg-primary"
                  : "w-2 bg-muted"
              }`}
              animate={{
                width:
                  idx === currentIndex % filteredRecommendations.length ? 16 : 8,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
