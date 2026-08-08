import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisInput } from '../components/AnalysisInput';
import { ScenarioCard } from '../components/ScenarioCard';
import { JudgeQuickTestDrive } from '../components/JudgeQuickTestDrive';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { SECTORS } from '../data/sectors';
import { AnalysisInputData, DemoScenario } from '../types';
import { 
  ShieldAlert, Sparkles, ArrowRight, Eye, ShieldCheck, 
  HelpCircle, CheckCircle2, FileQuestion, MessageSquare, 
  Building2, Briefcase, Waves, FileText, ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartAnalysis = (data: AnalysisInputData) => {
    navigate('/analyze', { state: { inputData: data } });
  };

  const handleScenarioSelect = (scenario: DemoScenario) => {
    const inputData: AnalysisInputData = {
      inputType: scenario.inputType,
      content: scenario.sampleInput,
      context: scenario.sampleContext,
      location: scenario.sampleLocation,
      imageBase64: scenario.sampleImage,
      scenarioId: scenario.id
    };
    navigate('/analyze', { state: { inputData } });
  };

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-16 pb-8 overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          {/* Top Tagline Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spot the risk before it becomes a problem.</span>
          </div>

          {/* Large Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Could there be <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">danger</span> here?
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Upload it. Describe it. Let AI help you spot what you might be missing.
          </p>

          <p className="text-xs font-mono text-slate-400 max-w-lg mx-auto pt-1">
            «Show us what's happening. We'll help you spot what you might be missing.»
          </p>
        </div>

        {/* Hackathon Judge Quick Test Drive */}
        <div className="mt-10 max-w-4xl mx-auto px-4 relative z-10">
          <JudgeQuickTestDrive />
        </div>

        {/* Universal Analyzer Panel */}
        <div className="mt-8 px-4 relative z-10">
          <AnalysisInput onAnalyze={handleStartAnalysis} />
        </div>
      </section>

      {/* TRY A REAL-WORLD SCENARIO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block mb-1">
              EXAMPLE SITUATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Try a real-world scenario
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Click any situation to automatically populate the analyzer with real input data.
            </p>
          </div>

          <button
            onClick={() => navigate('/analyze')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>Open Custom Analyzer</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_SCENARIOS.slice(0, 4).map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onSelect={handleScenarioSelect}
            />
          ))}
        </div>
      </section>

      {/* LANDING PAGE STORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              THE CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              The world gives us warning signs.
            </h2>
            <p className="text-base text-slate-300">
              In busy everyday life, people often miss subtle manipulation, structural defects, contract traps, or physical hazards.
            </p>
          </div>

          {/* Example Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <MessageSquare className="w-6 h-6 text-rose-400" />
              <h4 className="text-sm font-bold text-white">A suspicious message</h4>
              <p className="text-xs text-slate-400">Urgent prize claims asking for fees and security OTP codes.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <Building2 className="w-6 h-6 text-amber-400" />
              <h4 className="text-sm font-bold text-white">A dangerous building</h4>
              <p className="text-xs text-slate-400">Exposed wiring, structural cracks, or missing safety covers.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <Briefcase className="w-6 h-6 text-blue-400" />
              <h4 className="text-sm font-bold text-white">A questionable job offer</h4>
              <p className="text-xs text-slate-400">Demanding upfront payment for onboarding equipment.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <Waves className="w-6 h-6 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">A flooded road</h4>
              <p className="text-xs text-slate-400">Standing water masking washed-out asphalt and deep culverts.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <FileText className="w-6 h-6 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">A confusing contract</h4>
              <p className="text-xs text-slate-400">Hidden non-refundable fees and unilateral eviction terms.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-slate-900 border border-blue-500/20 text-center">
            <h3 className="text-xl font-bold text-white">
              IMPACTOS helps you see the warning signs.
            </h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto mt-2">
              Groq AI cross-checks visual indicators, language manipulation, structural patterns, and contract terms in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
            SIMPLE WORKFLOW
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            How IMPACTOS Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-sm flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-wider">SHOW US</h4>
            <p className="text-xs text-slate-400">Upload a photo, paste text, enter a URL, or describe what happened.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-sm flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-wider">UNDERSTAND</h4>
            <p className="text-xs text-slate-400">Groq AI evaluates the situation against risk and safety heuristics.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 font-bold text-sm flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-wider">SPOT THE RISK</h4>
            <p className="text-xs text-slate-400">Warning signs and severity levels are highlighted with clear explanations.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center justify-center mx-auto">
              4
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-wider">KNOW WHAT TO DO</h4>
            <p className="text-xs text-slate-400">Get practical step-by-step next steps and targeted questions to verify.</p>
          </div>
        </div>
      </section>

      {/* SECTOR CATEGORIES GRID PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Covering Every Sector of Daily Life</h2>
            <p className="text-xs text-slate-400 mt-1">Automated classification across 12 real-world categories.</p>
          </div>

          <button
            onClick={() => navigate('/explore')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>Explore All Sectors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {SECTORS.map((sector) => (
            <button
              key={sector.id}
              onClick={() => navigate('/explore')}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 text-left hover:bg-slate-800/60 transition-all group"
            >
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-300 mb-1">
                {sector.title}
              </h4>
              <span className="text-[10px] text-slate-500 line-clamp-1">{sector.examples[0]}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
