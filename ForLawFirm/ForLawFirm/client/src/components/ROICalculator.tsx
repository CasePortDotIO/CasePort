import { useState, useMemo } from "react";
import { TrendingUp, DollarSign, Target } from "lucide-react";

export function ROICalculator() {
  const [monthlyBudget, setMonthlyBudget] = useState(15000);
  const [caseValue, setCaseValue] = useState(50000);
  const [conversionRate, setConversionRate] = useState(20);

  const calculations = useMemo(() => {
    // Estimate leads per month based on budget
    const leadsPerMonth = Math.floor((monthlyBudget / 500) * 1.5); // ~$500 per lead
    
    // Calculate cases from leads
    const casesPerMonth = Math.floor((leadsPerMonth * conversionRate) / 100);
    
    // Calculate case value
    const monthlyValue = casesPerMonth * caseValue;
    const annualValue = monthlyValue * 12;
    
    // Calculate ROI
    const annualSpend = monthlyBudget * 12;
    const roi = ((annualValue - annualSpend) / annualSpend) * 100;
    
    return {
      leadsPerMonth,
      casesPerMonth,
      monthlyValue,
      annualValue,
      annualSpend,
      roi: Math.max(0, roi),
      paybackMonths: casesPerMonth > 0 ? Math.ceil(annualSpend / (monthlyValue / 12)) : 0,
    };
  }, [monthlyBudget, caseValue, conversionRate]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Calculate Your ROI
          </h3>
          <p className="text-gray-400">
            See how much you could earn with CasePort's precision case acquisition system.
          </p>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Monthly Budget */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Monthly Budget
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="5000"
                max="100000"
                step="1000"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-cyan-400">
                  ${(monthlyBudget / 1000).toFixed(1)}k
                </span>
                <span className="text-xs text-gray-400">/month</span>
              </div>
            </div>
          </div>

          {/* Average Case Value */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <Target className="w-4 h-4 inline mr-2" />
              Avg Case Value
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={caseValue}
                onChange={(e) => setCaseValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple-400">
                  ${(caseValue / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Conversion Rate
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-400">
                  {conversionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Leads/Month",
              value: calculations.leadsPerMonth,
              unit: "",
              color: "from-cyan-500",
            },
            {
              label: "Cases/Month",
              value: calculations.casesPerMonth,
              unit: "",
              color: "from-blue-500",
            },
            {
              label: "Monthly Value",
              value: `$${(calculations.monthlyValue / 1000).toFixed(0)}k`,
              unit: "",
              color: "from-purple-500",
            },
            {
              label: "Annual ROI",
              value: `${calculations.roi.toFixed(0)}%`,
              unit: "",
              color: "from-green-500",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg bg-gradient-to-br ${stat.color}/10 border border-${stat.color.split("-")[1]}-500/30`}
            >
              <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-800/50 border border-cyan-500/20 mb-8">
          <div>
            <p className="text-sm text-gray-400 mb-1">Annual Revenue Generated</p>
            <p className="text-3xl font-bold text-cyan-400">
              ${(calculations.annualValue / 1000000).toFixed(1)}M
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Annual Spend</p>
            <p className="text-3xl font-bold text-purple-400">
              ${(calculations.annualSpend / 1000).toFixed(0)}k
            </p>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full px-6 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
          See How This Works For Your Firm
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Results vary based on market, practice areas, and firm capacity. For illustrative purposes only.
        </p>
      </div>
    </div>
  );
}
