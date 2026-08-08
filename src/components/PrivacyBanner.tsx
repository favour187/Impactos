import React from 'react';
import { Lock, EyeOff, Trash2, Shield } from 'lucide-react';
import { useAnalysisHistory } from '../context/AnalysisHistoryContext';

export const PrivacyBanner: React.FC = () => {
  const { clearHistory, history } = useAnalysisHistory();

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Privacy First Platform
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                Ephemeral Processing
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Your uploaded files, text, and photos are treated as sensitive and processed ephemerally. Analysis history stays stored strictly in your local browser storage.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 text-xs font-semibold flex items-center space-x-2 transition-all shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local History</span>
          </button>
        )}
      </div>
    </div>
  );
};
