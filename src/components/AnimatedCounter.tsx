import { useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 2,
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const [hasRevealed, setHasRevealed] = useState(false);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView && !hasRevealed) {
      setHasRevealed(true);
    }
  }, [inView, hasRevealed]);

  useEffect(() => {
    if (!hasRevealed) return;
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate(value) {
        setDisplay(
          decimals > 0
            ? value.toFixed(decimals)
            : Math.round(value).toLocaleString()
        );
      },
    });
    return () => controls.stop();
  }, [hasRevealed, target, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
