import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface ConfidenceIndicatorProps {
  confidence: number; // 0 - 100
  limitations: string[];
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ confidence, limitations }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-bold text-slate-200">Analysis Confidence</span>
        </div>
        <span className="text-sm font-mono font-bold text-blue-400">{confidence}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-1000"
          style={{ width: `${confidence}%` }}
        />
      </div>

      {limitations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 mb-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Scope & Limitations</span>
          </div>
          <ul className="space-y-1 pl-4 list-disc text-xs text-slate-400">
            {limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
