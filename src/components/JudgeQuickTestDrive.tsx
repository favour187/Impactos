import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldAlert, Zap, FileText, ArrowRight } from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoScenarios';

export const JudgeQuickTestDrive: React.FC = () => {
  const navigate = useNavigate();

  const handleRunTestDrive = (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId) || DEMO_SCENARIOS[0];
    navigate('/analyze', {
      state: {
        inputData: {
          inputType: scenario.inputType,
          content: scenario.sampleInput,
          context: scenario.sampleContext,
          location: scenario.sampleLocation,
          imageBase64: scenario.sampleImage,
          scenarioId: scenario.id
        }
      }
    });
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-indigo-950/60 to-slate-900 border border-blue-500/30 backdrop-blur-xl shadow-2xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest block w-fit mb-1">
            HACKATHON JUDGE EXPRESS TEST DRIVE
          </span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Test IMPACTOS in 5 Seconds
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Click any scenario below to immediately execute a live analysis against Groq AI.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => handleRunTestDrive('scam')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-600/20"
          >
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span>Test Scam SMS</span>
          </button>

          <button
            onClick={() => handleRunTestDrive('rental')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20"
          >
            <FileText className="w-4 h-4 text-indigo-200" />
            <span>Test Lease Agreement</span>
          </button>

          <button
            onClick={() => handleRunTestDrive('electrical')}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-600/20"
          >
            <Zap className="w-4 h-4 text-yellow-200" />
            <span>Test Photo Hazard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
