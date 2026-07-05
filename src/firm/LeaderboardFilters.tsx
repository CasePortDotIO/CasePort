import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface FilterOptions {
  market?: string;
  firmType?: string;
  timeRange?: string;
}

interface LeaderboardFiltersProps {
  onFilterChange?: (filters: FilterOptions) => void;
}

export default function LeaderboardFilters({ onFilterChange }: LeaderboardFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const markets = [
    'All Markets',
    'Personal Injury',
    'Auto Accidents',
    'Slip & Fall',
    'Medical Malpractice',
    'Product Liability',
    'Workplace Injury',
  ];

  const firmTypes = [
    'All Types',
    'Solo Practitioner',
    'Small Firm (2-5)',
    'Mid Firm (6-20)',
    'Large Firm (20+)',
  ];

  const timeRanges = [
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Quarter', value: 'quarter' },
    { label: 'All Time', value: 'all' },
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-4 space-y-4 border-primary/20 bg-primary/5">
            {/* Market Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Market
              </label>
              <div className="flex flex-wrap gap-2">
                {markets.map((market) => (
                  <Badge
                    key={market}
                    variant={filters.market === market ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleFilterChange('market', market)}
                  >
                    {market}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Firm Type Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Firm Type
              </label>
              <div className="flex flex-wrap gap-2">
                {firmTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={filters.firmType === type ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleFilterChange('firmType', type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Time Range
              </label>
              <div className="flex flex-wrap gap-2">
                {timeRanges.map((range) => (
                  <Badge
                    key={range.value}
                    variant={filters.timeRange === range.value ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleFilterChange('timeRange', range.value)}
                  >
                    {range.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Filter Summary */}
            {activeFilterCount > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Showing results for:{' '}
                  {Object.entries(filters)
                    .filter(([, v]) => v)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')}
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}
