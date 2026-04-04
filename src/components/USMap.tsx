import React, { useState } from "react";
import { motion } from "framer-motion";

interface StateData {
  name: string;
  abbreviation: string;
  caseVolume: number;
  cpa: number;
  stage: "early" | "growth" | "mature";
}

const stateData: Record<string, StateData> = {
  CA: { name: "California", abbreviation: "CA", caseVolume: 847, cpa: 210, stage: "mature" },
  TX: { name: "Texas", abbreviation: "TX", caseVolume: 623, cpa: 95, stage: "growth" },
  FL: { name: "Florida", abbreviation: "FL", caseVolume: 512, cpa: 165, stage: "mature" },
  NY: { name: "New York", abbreviation: "NY", caseVolume: 456, cpa: 185, stage: "mature" },
  IL: { name: "Illinois", abbreviation: "IL", caseVolume: 389, cpa: 140, stage: "growth" },
  PA: { name: "Pennsylvania", abbreviation: "PA", caseVolume: 334, cpa: 125, stage: "growth" },
  OH: { name: "Ohio", abbreviation: "OH", caseVolume: 298, cpa: 110, stage: "growth" },
  GA: { name: "Georgia", abbreviation: "GA", caseVolume: 267, cpa: 105, stage: "early" },
  NC: { name: "North Carolina", abbreviation: "NC", caseVolume: 245, cpa: 95, stage: "early" },
  MI: { name: "Michigan", abbreviation: "MI", caseVolume: 198, cpa: 85, stage: "early" },
  AZ: { name: "Arizona", abbreviation: "AZ", caseVolume: 176, cpa: 120, stage: "early" },
  TN: { name: "Tennessee", abbreviation: "TN", caseVolume: 154, cpa: 90, stage: "early" },
  MO: { name: "Missouri", abbreviation: "MO", caseVolume: 142, cpa: 80, stage: "early" },
  IN: { name: "Indiana", abbreviation: "IN", caseVolume: 128, cpa: 75, stage: "early" },
  CO: { name: "Colorado", abbreviation: "CO", caseVolume: 115, cpa: 110, stage: "early" },
  WA: { name: "Washington", abbreviation: "WA", caseVolume: 98, cpa: 135, stage: "early" },
  MA: { name: "Massachusetts", abbreviation: "MA", caseVolume: 87, cpa: 155, stage: "early" },
  MD: { name: "Maryland", abbreviation: "MD", caseVolume: 76, cpa: 125, stage: "early" },
  VA: { name: "Virginia", abbreviation: "VA", caseVolume: 65, cpa: 115, stage: "early" },
  WI: { name: "Wisconsin", abbreviation: "WI", caseVolume: 54, cpa: 70, stage: "early" },
};

const getColorByVolume = (volume: number, maxVolume: number) => {
  const intensity = volume / maxVolume;
  if (intensity > 0.7) return "from-cyan-500 to-cyan-600";
  if (intensity > 0.4) return "from-cyan-400 to-cyan-500";
  return "from-cyan-300 to-cyan-400";
};

const getStageColor = (stage: string) => {
  switch (stage) {
    case "mature":
      return "bg-gradient-to-br from-emerald-500 to-emerald-600";
    case "growth":
      return "bg-gradient-to-br from-amber-500 to-amber-600";
    case "early":
      return "bg-gradient-to-br from-slate-500 to-slate-600";
    default:
      return "bg-slate-500";
  }
};

export const USMap: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const maxVolume = Math.max(...Object.values(stateData).map((s) => s.caseVolume));
  const sortedStates = Object.entries(stateData).sort(
    ([, a], [, b]) => b.caseVolume - a.caseVolume
  );

  return (
    <div className="w-full space-y-8">
      {/* Map Container */}
      <div className="relative w-full bg-gradient-to-b from-slate-900/50 to-slate-900/20 rounded-2xl border border-cyan-500/20 p-8 backdrop-blur-sm">
        {/* State Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-8">
          {sortedStates.map(([abbr, state]) => {
            const isSelected = selectedState === abbr;
            const isHovered = hoveredState === abbr;
            const intensity = state.caseVolume / maxVolume;

            return (
              <motion.button
                key={abbr}
                onClick={() => setSelectedState(isSelected ? null : abbr)}
                onMouseEnter={() => setHoveredState(abbr)}
                onMouseLeave={() => setHoveredState(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-cyan-400 scale-110"
                    : isHovered
                      ? "ring-1 ring-cyan-300"
                      : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, rgba(34, 211, 238, ${0.2 + intensity * 0.6}), rgba(6, 182, 212, ${0.1 + intensity * 0.4}))`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid rgba(34, 211, 238, ${0.3 + intensity * 0.5})`,
                }}
              >
                <span className="text-white font-mono">{abbr}</span>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {state.caseVolume} cases
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            <span className="text-slate-300">Mature Market</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-amber-500 to-amber-600"></div>
            <span className="text-slate-300">Growth Stage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-slate-500 to-slate-600"></div>
            <span className="text-slate-300">Early Stage</span>
          </div>
        </div>
      </div>

      {/* State Details Panel */}
      {selectedState && stateData[selectedState] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-cyan-500/30 p-6 backdrop-blur-sm"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                {stateData[selectedState].name}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Case Volume</span>
                  <span className="text-cyan-400 font-semibold">
                    {stateData[selectedState].caseVolume} cases
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Average CPA</span>
                  <span className="text-cyan-400 font-semibold">
                    ${stateData[selectedState].cpa}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Market Stage</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStageColor(stateData[selectedState].stage)}`}
                  >
                    {stateData[selectedState].stage}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Market Insights</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {stateData[selectedState].stage === "mature"
                  ? "High saturation market with established competitors. Focus on differentiation and premium positioning."
                  : stateData[selectedState].stage === "growth"
                    ? "Growing market with expanding opportunities. Early movers have significant advantage."
                    : "Emerging market with untapped potential. First-mover advantage available."}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top States Summary */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-300">Top Markets by Volume</h4>
        <div className="grid gap-2">
          {sortedStates.slice(0, 5).map(([abbr, state], index) => (
            <motion.div
              key={abbr}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center">
                <span className="text-sm font-bold text-cyan-400">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{state.name}</span>
                  <span className="text-xs text-slate-400">{state.caseVolume} cases</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(state.caseVolume / maxVolume) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
