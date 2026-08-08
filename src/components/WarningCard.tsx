import React from 'react';
import { WarningSign } from '../types';
import { RiskBadge } from './RiskBadge';
import { AlertCircle } from 'lucide-react';

interface WarningCardProps {
  sign: WarningSign;
  index: number;
}

export const WarningCard: React.FC<WarningCardProps> = ({ sign, index }) => {
  return (
    <div className="group relative p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 backdrop-blur-sm transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
              <h4 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                {sign.title}
              </h4>
            </div>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {sign.explanation}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <RiskBadge level={sign.severity} size="sm" />
        </div>
      </div>
    </div>
  );
};
