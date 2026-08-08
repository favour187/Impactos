import React from 'react';
import { DemoScenario } from '../types';
import { ShieldAlert, FileText, Zap, Waves, Briefcase, Sprout, TrendingDown, ArrowRight } from 'lucide-react';

interface ScenarioCardProps {
  scenario: DemoScenario;
  onSelect: (scenario: DemoScenario) => void;
}

const ICON_MAP: Record<string, any> = {
  ShieldAlert,
  FileText,
  Zap,
  Waves,
  Briefcase,
  Sprout,
  TrendingDown
};

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onSelect }) => {
  const Icon = ICON_MAP[scenario.iconName] || ShieldAlert;

  return (
    <button
      onClick={() => onSelect(scenario)}
      className="group flex flex-col text-left p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 relative overflow-hidden h-full"
    >
      {/* Top Banner Chip */}
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
          EXAMPLE SITUATION
        </span>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {scenario.category}
        </span>
      </div>

      <div className="flex items-start space-x-3 mb-2">
        <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
          {scenario.title}
        </h4>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 grow">
        {scenario.shortDesc}
      </p>

      <div className="flex items-center text-xs font-semibold text-blue-400 group-hover:text-blue-300 space-x-1.5 mt-auto">
        <span>Test This Input</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};
