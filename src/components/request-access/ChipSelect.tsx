"use client";

/**
 * CasePort Chip Select
 * 
 * LAYOUT: Uses a ResizeObserver to measure the container height and
 * set the chip grid height precisely. This bypasses the AnimatePresence
 * flex chain issue.
 * 
 * READABILITY: Search input 15px, chips 13px, count indicator 11px
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface ChipSelectProps {
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export function ChipSelect({ items, selected, onChange, placeholder }: ChipSelectProps) {
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const [chipGridHeight, setChipGridHeight] = useState<number>(200);

  // Measure available height for chip grid
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      
      // Get the visible viewport height by finding the scroll container
      let scrollParent = containerRef.current.parentElement;
      while (scrollParent && scrollParent.scrollHeight === scrollParent.clientHeight) {
        scrollParent = scrollParent.parentElement;
      }
      
      // Calculate space available from this container to bottom of visible scroll area
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollParentRect = scrollParent?.getBoundingClientRect() || { bottom: window.innerHeight };
      const spaceToBottom = Math.max(0, scrollParentRect.bottom - containerRect.top);
      
      const searchH = searchRef.current?.offsetHeight ?? 52;
      const selectedH = selectedRef.current?.offsetHeight ?? 0;
      const countH = countRef.current?.offsetHeight ?? 0;
      const gaps = 12 * 3; // 3 gaps of 12px
      const buttonH = 56; // Button height with padding
      const reserve = 20; // Extra buffer
      
      // Calculate available height for grid, ensuring button stays visible
      const available = spaceToBottom - searchH - selectedH - countH - gaps - buttonH - reserve;
      setChipGridHeight(Math.max(80, Math.min(available, 200)));
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [selected.length]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(item => item.toLowerCase().includes(q));
  }, [items, search]);

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter(s => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  const remove = (item: string) => {
    onChange(selected.filter(s => s !== item));
  };

  return (
    <div ref={containerRef} className="flex flex-col flex-1 min-h-0 gap-3">
      {/* Search input */}
      <div ref={searchRef} className="relative flex-shrink-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] 
                     text-[#E2E8F0] text-[15px] placeholder:text-white/25
                     focus:outline-none focus:border-[#22D3EE]/25 focus:bg-white/[0.06]
                     transition-all duration-200"
          style={{ fontFamily: 'var(--font-geist)' }}
        />
      </div>

      {/* Selected chips */}
      <AnimatePresence mode="popLayout">
        {selected.length > 0 && (
          <motion.div
            ref={selectedRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 flex-shrink-0 max-h-24 overflow-y-auto dark-scrollbar"
          >
            {selected.map(item => (
              <motion.button
                key={item}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                layout
                onClick={() => remove(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                           bg-[#22D3EE]/[0.1] border border-[#22D3EE]/20 
                           text-[#22D3EE]/90 text-[13px] font-medium
                           hover:bg-[#22D3EE]/[0.15] transition-colors duration-150"
                style={{ fontFamily: 'var(--font-geist)' }}
              >
                {item}
                <X className="w-3 h-3 opacity-60" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available items grid — uses measured height, scrolls internally */}
      <div
        className="dark-scrollbar"
        style={{
          maxHeight: `${chipGridHeight}px`,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'block',
          flexShrink: 0,
        }}
      >
        <div className="flex flex-wrap gap-2.5 pb-2">
          {filtered.map(item => {
            const isSelected = selected.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={`
                  px-3.5 py-2.5 rounded-lg text-[13px] font-medium
                  transition-all duration-150
                  ${isSelected
                    ? 'bg-[#22D3EE]/[0.12] border border-[#22D3EE]/30 text-[#22D3EE]/95'
                    : 'bg-white/[0.04] border border-white/[0.08] text-[#9BA3B0] hover:bg-white/[0.07] hover:text-[#C1C8D4] hover:border-white/[0.12]'
                  }
                `}
                style={{ fontFamily: 'var(--font-geist)' }}
              >
                {item}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-white/30 text-[14px] py-6 w-full text-center" style={{ fontFamily: 'var(--font-geist)' }}>
              No results found
            </p>
          )}
        </div>
      </div>

      {/* Count indicator */}
      {selected.length > 0 && (
        <div ref={countRef} className="text-right flex-shrink-0">
          <span
            className="text-[#22D3EE]/50"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em' }}
          >
            {selected.length} selected
          </span>
        </div>
      )}
    </div>
  );
}
