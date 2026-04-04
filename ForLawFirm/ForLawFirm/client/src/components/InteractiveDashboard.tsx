import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, CheckCircle } from "lucide-react";

interface DashboardTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: DashboardTab[] = [
  { id: "overview", label: "📊 Overview", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "cases", label: "📋 Cases", icon: <CheckCircle className="w-4 h-4" /> },
  { id: "analytics", label: "📈 Analytics", icon: <TrendingUp className="w-4 h-4" /> },
  { id: "leads", label: "👥 Leads", icon: <Users className="w-4 h-4" /> },
];

export function InteractiveDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [animateIn, setAnimateIn] = useState(true);

  useEffect(() => {
    setAnimateIn(false);
    const timer = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={`space-y-6 transition-all duration-500 ${animateIn ? "opacity-100" : "opacity-0"}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Cases", value: "127", change: "+12%" },
                { label: "This Month", value: "23", change: "+8%" },
                { label: "Conversion Rate", value: "18.5%", change: "+23%" },
                { label: "Avg Case Value", value: "$52k", change: "+5.2%" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
                  style={{
                    animation: `slideUp 0.5s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
                  <p className="text-xs text-green-400 mt-2">{stat.change}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "cases":
        return (
          <div className={`space-y-4 transition-all duration-500 ${animateIn ? "opacity-100" : "opacity-0"}`}>
            <div className="space-y-3">
              {[
                { stage: "Qualified Leads", count: 85, color: "from-cyan-500" },
                { stage: "In Review", count: 34, color: "from-yellow-500" },
                { stage: "Signed Cases", count: 23, color: "from-green-500" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">{item.stage}</span>
                    <span className="text-sm font-bold text-cyan-400">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} to-purple-600 rounded-full transition-all duration-1000`}
                      style={{
                        width: `${(item.count / 85) * 100}%`,
                        animation: animateIn ? `fillBar 1s ease-out ${idx * 0.2}s both` : "none",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className={`space-y-6 transition-all duration-500 ${animateIn ? "opacity-100" : "opacity-0"}`}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { metric: "Lead Quality", score: 94, unit: "/100" },
                { metric: "Qualification Accuracy", score: 94, unit: "%" },
                { metric: "Lead Decay Rate", score: 0, unit: "%" },
                { metric: "Conversion Rate", score: 18.5, unit: "%" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-800/50 border border-cyan-500/20">
                  <p className="text-xs text-gray-400 mb-3">{item.metric}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-cyan-400">{item.score}</span>
                    <span className="text-sm text-gray-400">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "leads":
        return (
          <div className={`space-y-4 transition-all duration-500 ${animateIn ? "opacity-100" : "opacity-0"}`}>
            <div className="space-y-3">
              {[
                { practice: "Auto Accidents", leads: 47, status: "Active" },
                { practice: "Slip & Fall", leads: 23, status: "Active" },
                { practice: "Medical Malpractice", leads: 12, status: "Active" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-800/50 border border-cyan-500/20 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-white">{item.practice}</p>
                    <p className="text-xs text-gray-400">{item.leads} leads</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 p-4 border-b border-cyan-500/20 bg-slate-900/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">{renderContent()}</div>

        {/* Footer CTA */}
        <div className="px-6 md:px-8 pb-6 border-t border-cyan-500/20 bg-slate-900/30">
          <p className="text-sm text-gray-400 mb-4 text-center">
            Get full access to the CasePort dashboard and start managing your case flow with precision.
          </p>
          <button className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl">
            Request Access
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fillBar {
          from {
            width: 0;
          }
          to {
            width: var(--bar-width, 100%);
          }
        }
      `}</style>
    </div>
  );
}
