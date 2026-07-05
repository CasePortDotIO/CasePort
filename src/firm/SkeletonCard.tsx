import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="border border-dashed border-primary/30 rounded-lg p-5 bg-gradient-to-br from-background to-background/80"
    >
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <motion.div
          className="h-4 w-24 bg-muted rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="h-4 w-4 bg-muted rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Value skeleton */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <motion.div
            className="h-8 w-32 bg-muted rounded mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="h-4 w-20 bg-muted rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Sparkline skeleton */}
        <motion.div
          className="h-12 w-24 bg-muted rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}

export function SkeletonTable() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="border border-dashed border-primary/30 rounded-lg p-6 bg-gradient-to-br from-background to-background/80"
    >
      {/* Header skeleton */}
      <motion.div
        className="h-6 w-48 bg-muted rounded mb-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Table rows skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <motion.div
            key={idx}
            className="flex gap-4 p-3 rounded bg-muted/30"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: idx * 0.1,
            }}
          >
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
