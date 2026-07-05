import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BloombergClock() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      setTime(timeStr);
      setDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-6 px-6 py-4 border-b border-border bg-background/50 backdrop-blur-sm"
    >
      {/* Live Clock */}
      <div className="flex items-baseline gap-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Time</p>
        <div className="font-mono text-lg font-light tracking-tight text-foreground">
          {time || '00:00:00'}
          <span className="text-primary ml-1">●</span>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-baseline gap-2 border-l border-border pl-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</p>
        <p className="text-sm text-foreground">{date}</p>
      </div>

      {/* Market Status */}
      <div className="flex items-baseline gap-2 border-l border-border pl-6 ml-auto">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Market</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-sm text-foreground">Live</p>
        </div>
      </div>
    </motion.div>
  );
}
