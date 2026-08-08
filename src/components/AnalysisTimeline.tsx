import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Cpu } from 'lucide-react';

const STEPS = [
  'Receiving input...',
  'Understanding context...',
  'Looking for warning signs...',
  'Cross-checking risk patterns...',
  'Building assessment...'
];

export const AnalysisTimeline: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl max-w-lg mx-auto">
      {/* Animated AI Brain Icon */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="relative p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400">
          <Cpu className="w-10 h-10 animate-spin-slow" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Analyzing Risk & Hazards</h3>
      <p className="text-xs text-slate-400 mb-6 text-center">
        Gemini AI is examining your submission against multimodal safety heuristics.
      </p>

      {/* Steps List */}
      <div className="w-full space-y-3">
        {STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                isCurrent
                  ? 'bg-blue-950/40 border-blue-500/40 text-blue-200'
                  : isDone
                  ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                  : 'opacity-40 border-transparent text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-700 shrink-0" />
              )}
              <span className="text-sm font-medium">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
