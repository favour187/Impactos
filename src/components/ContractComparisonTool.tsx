import React, { useState } from 'react';
import { RiskAnalysisResult } from '../types';
import { ArrowLeftRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

export const ContractComparisonTool: React.FC = () => {
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultA, setResultA] = useState<RiskAnalysisResult | null>(null);
  const [resultB, setResultB] = useState<RiskAnalysisResult | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optionA || !optionB) {
      alert('Please paste content into both Option A and Option B fields to run a comparative analysis.');
      return;
    }

    setIsAnalyzing(true);
    setResultA(null);
    setResultB(null);

    try {
      const formDataA = new FormData();
      formDataA.append('inputType', 'text');
      formDataA.append('content', optionA);

      const formDataB = new FormData();
      formDataB.append('inputType', 'text');
      formDataB.append('content', optionB);

      const [resA, resB] = await Promise.all([
        fetch('/api/analyze', { method: 'POST', body: formDataA }),
        fetch('/api/analyze', { method: 'POST', body: formDataB })
      ]);

      if (resA.ok && resB.ok) {
        setResultA(await resA.json());
        setResultB(await resB.json());
      }
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <ArrowLeftRight className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Side-by-Side Risk Comparison Tool
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              DECISION SUPPORT
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Compare two contracts, job offers, or proposals side-by-side to pinpoint which option contains higher risk terms.
          </p>
        </div>
      </div>

      <form onSubmit={handleCompare} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
              Option A (e.g. Lease Draft #1 / Offer #1)
            </label>
            <textarea
              rows={5}
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="Paste text excerpt for Option A..."
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Option B */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
              Option B (e.g. Lease Draft #2 / Offer #2)
            </label>
            <textarea
              rows={5}
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="Paste text excerpt for Option B..."
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !optionA || !optionB}
          className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>{isAnalyzing ? 'Comparing Risk Parameters...' : 'Compare Option A vs Option B'}</span>
        </button>
      </form>

      {/* Comparison Results */}
      {resultA && resultB && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 animate-in fade-in duration-300">
          {/* Result A */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase">Option A Assessment</span>
              <RiskBadge level={resultA.overallRisk} size="sm" />
            </div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono">
              Score: {resultA.riskScore}/100
            </div>
            <p className="text-xs text-slate-300">{resultA.summary}</p>
            <div className="text-[11px] text-slate-400 font-medium">
              Flagged Warning Signs: {resultA.warningSigns.length}
            </div>
          </div>

          {/* Result B */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase">Option B Assessment</span>
              <RiskBadge level={resultB.overallRisk} size="sm" />
            </div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono">
              Score: {resultB.riskScore}/100
            </div>
            <p className="text-xs text-slate-300">{resultB.summary}</p>
            <div className="text-[11px] text-slate-400 font-medium">
              Flagged Warning Signs: {resultB.warningSigns.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
