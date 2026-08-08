import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SECTORS } from '../data/sectors';
import { SectorCategory } from '../types';
import { ContractComparisonTool } from '../components/ContractComparisonTool';
import { 
  ShieldCheck, Home, AlertTriangle, Waves, Sprout, Zap, 
  Car, Store, FileText, DollarSign, Heart, UserCheck, 
  ArrowRight, Search, Sparkles, Filter
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  ShieldCheck, Home, AlertTriangle, Waves, Sprout, Zap,
  Car, Store, FileText, DollarSign, Heart, UserCheck
};

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<SectorCategory | null>(SECTORS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSectors = SECTORS.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.examples.some(ex => ex.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLaunchAnalysis = (example: string, category: string) => {
    navigate('/analyze', {
      state: {
        inputData: {
          inputType: 'text',
          content: `Checking hazard risk for ${category}: ${example}`,
          context: `Requesting risk screening for ${category} scenario.`
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>REAL-WORLD SECTOR RISK EXPLORER</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white">
          Explore Hazard Categories
        </h1>
        <p className="text-sm text-slate-300">
          IMPACTOS automatically identifies warning signs across 12 primary real-world sectors. Select a category below to view common threat vectors and sample scenarios.
        </p>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sectors or hazards (e.g. electrical, lease, flood)..."
            className="w-full rounded-2xl bg-slate-900 border border-slate-800 pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Side-by-Side Comparison Tool Feature */}
      <ContractComparisonTool />

      {/* Grid of Sector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSectors.map((sector) => {
          const Icon = ICON_MAP[sector.icon] || ShieldCheck;
          const isSelected = selectedCategory?.id === sector.id;

          return (
            <div
              key={sector.id}
              onClick={() => setSelectedCategory(sector)}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 w-fit">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{sector.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {sector.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-blue-400 flex items-center space-x-1">
                  <span>View Example Problems</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Sector Details Box */}
      {selectedCategory && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              {React.createElement(ICON_MAP[selectedCategory.icon] || ShieldCheck, { className: 'w-8 h-8' })}
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block">
                SELECTED CATEGORY
              </span>
              <h2 className="text-2xl font-bold text-white">{selectedCategory.title}</h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {selectedCategory.description}
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Common Example Situations Analyzed:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedCategory.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-3"
                >
                  <span className="text-xs text-slate-200 font-medium">"{ex}"</span>
                  <button
                    onClick={() => handleLaunchAnalysis(ex, selectedCategory.title)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1 pt-2 border-t border-slate-800/80"
                  >
                    <span>Analyze this situation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
