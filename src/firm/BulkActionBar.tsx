import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionBarProps {
  selectedCount: number;
  onSubmitOutcomes: () => void;
  onOpenDispute: () => void;
  onExport: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedCount,
  onSubmitOutcomes,
  onOpenDispute,
  onExport,
  onClearSelection,
}: BulkActionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background border border-primary rounded-lg p-4 shadow-lg z-40"
        >
          <div className="flex items-center justify-between gap-6 max-w-2xl">
            {/* Selection info */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full"
              >
                <span className="text-sm font-bold text-primary">{selectedCount}</span>
              </motion.div>
              <span className="text-sm font-medium text-foreground">
                {selectedCount} case{selectedCount !== 1 ? "s" : ""} selected
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSubmitOutcomes}
                className="flex items-center gap-2 px-3 py-2 bg-chart-1/10 hover:bg-chart-1/20 text-chart-1 rounded transition-colors"
                title="Submit outcomes for selected cases"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Submit</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenDispute}
                className="flex items-center gap-2 px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded transition-colors"
                title="Open dispute for selected cases"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Dispute</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExport}
                className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
                title="Export selected cases"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </motion.button>

              <div className="w-px h-6 bg-muted" />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearSelection}
                className="p-2 hover:bg-muted rounded transition-colors"
                title="Clear selection"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
