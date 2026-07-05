import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Save, Trash2, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, string | string[]>;
  createdAt: number;
}

interface AdvancedFilterSystemProps {
  onFiltersChange: (filters: Record<string, string | string[]>) => void;
  onSearch: (query: string) => void;
}

const CASE_TYPES = [
  "Auto Accident",
  "Slip & Fall",
  "Medical Malpractice",
  "Product Liability",
  "Workplace Injury",
];

const MARKETS = ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"];

const STATUS_OPTIONS = [
  "Contacted",
  "Outcome Pending",
  "Signed",
  "Closed Lost",
  "Disputed",
];

export function AdvancedFilterSystem({
  onFiltersChange,
  onSearch,
}: AdvancedFilterSystemProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    caseType: [],
    market: [],
  });
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showPresets, setShowPresets] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [showSavePreset, setShowSavePreset] = useState(false);

  // Parse natural language search
  const parseNaturalLanguage = useCallback((query: string) => {
    const newFilters = { ...filters };

    // Check for case types
    CASE_TYPES.forEach((type) => {
      if (query.toLowerCase().includes(type.toLowerCase())) {
        newFilters.caseType = [type];
      }
    });

    // Check for markets
    MARKETS.forEach((market) => {
      if (query.toLowerCase().includes(market.toLowerCase())) {
        newFilters.market = [market];
      }
    });

    // Check for value keywords
    if (query.toLowerCase().includes("high value") || query.toLowerCase().includes("high-value")) {
      newFilters.valueRange = "high";
    } else if (query.toLowerCase().includes("low value")) {
      newFilters.valueRange = "low";
    }

    return newFilters;
  }, [filters]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.length > 3) {
        const parsedFilters = parseNaturalLanguage(query);
        setFilters(parsedFilters);
        onFiltersChange(parsedFilters);
        onSearch(query);
      }
    },
    [parseNaturalLanguage, onFiltersChange, onSearch]
  );

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const newFilters = { ...filters };
      const currentValue = newFilters[key];

      if (Array.isArray(currentValue)) {
        if (currentValue.includes(value)) {
          newFilters[key] = currentValue.filter((v) => v !== value);
        } else {
          newFilters[key] = [...currentValue, value];
        }
      } else {
        newFilters[key] = [value];
      }

      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [onFiltersChange]
  );

  const savePreset = useCallback(() => {
    if (!presetName.trim()) return;

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName,
      filters: { ...filters },
      createdAt: Date.now(),
    };

    setPresets([...presets, newPreset]);
    setPresetName("");
    setShowSavePreset(false);
  }, [presetName, filters, presets]);

  const loadPreset = useCallback((preset: FilterPreset) => {
    setFilters(preset.filters);
    onFiltersChange(preset.filters);
    setShowPresets(false);
  }, [onFiltersChange]);

  const deletePreset = useCallback((id: string) => {
    setPresets(presets.filter((p) => p.id !== id));
  }, [presets]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) return count + value.length;
      return count + (value ? 1 : 0);
    }, 0);
  }, [filters]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Natural Language Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder='Try: "Auto accidents in Houston" or "High value cases"'
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-muted/50 border-muted"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Status Filter */}
        <Select
          value={Array.isArray(filters.status) ? filters.status[0] || "" : ""}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="bg-muted/50 border-muted">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Case Type Filter */}
        <Select
          value={Array.isArray(filters.caseType) ? filters.caseType[0] || "" : ""}
          onValueChange={(value) => handleFilterChange("caseType", value)}
        >
          <SelectTrigger className="bg-muted/50 border-muted">
            <SelectValue placeholder="Case Type" />
          </SelectTrigger>
          <SelectContent>
            {CASE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Market Filter */}
        <Select
          value={Array.isArray(filters.market) ? filters.market[0] || "" : ""}
          onValueChange={(value) => handleFilterChange("market", value)}
        >
          <SelectTrigger className="bg-muted/50 border-muted">
            <SelectValue placeholder="Market" />
          </SelectTrigger>
          <SelectContent>
            {MARKETS.map((market) => (
              <SelectItem key={market} value={market}>
                {market}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded"
            >
              {activeFilterCount} active
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSavePreset(!showSavePreset)}
            className="p-2 hover:bg-muted rounded transition-colors"
            title="Save current filters as preset"
          >
            <Save className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPresets(!showPresets)}
            className="p-2 hover:bg-muted rounded transition-colors relative"
            title="Load saved presets"
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
            {presets.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Save Preset Input */}
      <AnimatePresence>
        {showSavePreset && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2"
          >
            <Input
              type="text"
              placeholder="Preset name (e.g., 'My High-Value Cases')"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="bg-muted/50 border-muted"
            />
            <Button
              size="sm"
              onClick={savePreset}
              disabled={!presetName.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              Save
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Presets List */}
      <AnimatePresence>
        {showPresets && presets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-muted/30 border border-muted rounded-lg p-3 space-y-2"
          >
            <p className="text-xs font-semibold text-muted-foreground">Saved Presets</p>
            {presets.map((preset) => (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between p-2 bg-background rounded hover:bg-muted/50 transition-colors"
              >
                <button
                  onClick={() => loadPreset(preset)}
                  className="flex-1 text-left text-sm text-foreground hover:text-primary transition-colors"
                >
                  {preset.name}
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deletePreset(preset.id)}
                  className="p-1 hover:bg-destructive/10 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
