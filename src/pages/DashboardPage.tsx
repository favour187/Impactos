import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisHistory } from '../context/AnalysisHistoryContext';
import { RiskBadge } from '../components/RiskBadge';
import { PrivacyBanner } from '../components/PrivacyBanner';
import { 
  LayoutDashboard, ShieldAlert, AlertCircle, Compass, 
  Trash2, ArrowRight, Activity, Sparkles, Clock, RotateCcw
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, deleteHistoryItem, stats, patternsNoticed } = useAnalysisHistory();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block mb-1">
            PERSONAL ACTIVITY MONITOR
          </span>
          <h1 className="text-3xl font-extrabold text-white">Personal Safety Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your screening history, risk statistics, and personal activity patterns.
          </p>
        </div>

        <button
          onClick={() => navigate('/analyze')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Risk Analysis</span>
        </button>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Analyses Completed</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3 font-sans">
            {stats.totalAnalyses}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total items submitted</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">High Risk Detected</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 mt-3 font-sans">
            {stats.highRiskDetected}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Critical/High severity flagged</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Hazards Identified</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-3 font-sans">
            {stats.hazardsIdentified}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Warning sign factors pinpointed</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Categories Explored</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-3 font-sans">
            {stats.categoriesExplored}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Out of 12 real-world sectors</p>
        </div>
      </div>

      {/* Smart Insight: Patterns You're Noticing */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/30 space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Patterns You're Noticing</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-200">
          {patternsNoticed.map((pattern, idx) => (
            <li key={idx} className="flex items-start space-x-2.5">
              <span className="text-blue-400 font-bold">•</span>
              <span>«{pattern}»</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Analyses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <span>Your Recent Analyses ({history.length})</span>
          </h3>
        </div>

        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge level={item.result.overallRisk} size="sm" />
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                      {item.result.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.result.summary}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => navigate('/analyze', { state: { inputData: { inputType: item.inputType, content: item.title } } })}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Analyze</span>
                  </button>

                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/60"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <p className="text-sm text-slate-400">No recent analyses saved in your local history.</p>
            <button
              onClick={() => navigate('/analyze')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs inline-flex items-center space-x-2"
            >
              <span>Analyze Your First Situation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <PrivacyBanner />
    </div>
  );
};
