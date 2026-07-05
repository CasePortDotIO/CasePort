import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CountUpMetricProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  onComplete?: () => void;
}

export function CountUpMetric({
  value,
  duration = 500,
  prefix = "",
  suffix = "",
  decimals = 0,
  onComplete,
}: CountUpMetricProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value === prevValueRef.current) return;

    setIsIncreasing(value > prevValueRef.current);
    const startValue = prevValueRef.current;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      const current = startValue + (endValue - startValue) * progress;
      setDisplayValue(Math.round(current * Math.pow(10, decimals)) / Math.pow(10, decimals));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
    prevValueRef.current = value;
  }, [value, duration, decimals, onComplete]);

  return (
    <motion.span
      animate={{
        color: isIncreasing ? "#1D9E75" : "#E24B4A",
      }}
      transition={{ duration: 0.3 }}
      className="font-mono"
    >
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}
