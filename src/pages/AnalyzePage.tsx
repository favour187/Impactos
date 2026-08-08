import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnalysisInput } from '../components/AnalysisInput';
import { AnalysisTimeline } from '../components/AnalysisTimeline';
import { RiskGauge } from '../components/RiskGauge';
import { WarningCard } from '../components/WarningCard';
import { ConfidenceIndicator } from '../components/ConfidenceIndicator';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { PrivacyBanner } from '../components/PrivacyBanner';
import { RiskChatAssistant } from '../components/RiskChatAssistant';
import { useAnalysisHistory } from '../context/AnalysisHistoryContext';
import { AnalysisInputData, RiskAnalysisResult } from '../types';
import { 
  ShieldCheck, AlertTriangle, ArrowLeft, Download, Share2, 
  RotateCcw, Check, Sparkles, HelpCircle, ListOrdered, FileText
} from 'lucide-react';

export const AnalyzePage: React.FC = () => {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { addHistoryItem } = useAnalysisHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysisResult | null>(null);
  const [currentInput, setCurrentInput] = useState<AnalysisInputData | null>(null);
  const [copied, setCopied] = useState(false);

  // Check if state was passed from homepage or example situation
  useEffect(() => {
    if (routerLocation.state && routerLocation.state.inputData) {
      handleAnalyze(routerLocation.state.inputData);
    }
  }, [routerLocation.state]);

  const handleAnalyze = async (data: AnalysisInputData) => {
    setIsLoading(true);
    setCurrentInput(data);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('inputType', data.inputType);
      if (data.content) formData.append('content', data.content);
      if (data.location) formData.append('location', data.location);
      if (data.context) formData.append('context', data.context);
      if (data.scenarioId) formData.append('scenarioId', data.scenarioId);

      if (data.imageFile) {
        formData.append('file', data.imageFile);
      } else if (data.imageBase64) {
        formData.append('imageBase64', data.imageBase64);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: RiskAnalysisResult = await response.json();
      setAnalysisResult(result);

      // Save to local user history context if overallRisk is known
      if (result.overallRisk !== 'UNKNOWN' || result.riskScore > 0) {
        const title = data.context || data.content?.slice(0, 40) || `${result.category} Analysis`;
        addHistoryItem(result, data.inputType, title);
      }

    } catch (err) {
      console.error('Analysis request error:', err);
      const fallbackResult: RiskAnalysisResult = {
        overallRisk: 'UNKNOWN',
        riskScore: 0,
        category: 'OTHER',
        summary: 'Unable to complete automated screening due to network communication error or backend server configuration.',
        warningSigns: [],
        possibleConsequences: ['Verification required through direct secondary review.'],
        recommendedActions: ['Retry submission or verify backend server setup.'],
        questionsToVerify: ['Is GEMINI_API_KEY configured in backend environment variables?'],
        confidence: 0,
        limitations: ['Network or server communication error.'],
        analyzedAt: new Date().toISOString()
      };
      setAnalysisResult(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!analysisResult) return;
    const text = `IMPACTOS RISK ASSESSMENT
Category: ${analysisResult.category}
Overall Risk: ${analysisResult.overallRisk} (${analysisResult.riskScore}/100)
Summary: ${analysisResult.summary}
Confidence: ${analysisResult.confidence}%`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setCurrentInput(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            Universal AI Risk Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multimodal risk detection powered by Gemini AI. Input text, photos, URLs, or documents.
          </p>
        </div>

        {analysisResult && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Analyze Another Item</span>
          </button>
        )}
      </div>

      {/* Input Section when no result is actively being displayed */}
      {!analysisResult && !isLoading && (
        <div className="space-y-8">
          <AnalysisInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            initialType={currentInput?.inputType}
            initialContent={currentInput?.content}
            initialContext={currentInput?.context}
          />

          <PrivacyBanner />
        </div>
      )}

      {/* Loading Timeline Animation */}
      {isLoading && (
        <div className="py-12">
          <AnalysisTimeline />
        </div>
      )}

      {/* RISK RESULT UI DISPLAY */}
      {analysisResult && !isLoading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Banner & Risk Gauge */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Risk Score Gauge Component */}
              <div className="shrink-0 w-full md:w-auto">
                <RiskGauge
                  score={analysisResult.riskScore}
                  overallRisk={analysisResult.overallRisk}
                />
              </div>

              {/* Assessment Summary Details */}
              <div className="space-y-4 grow">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                    RISK ASSESSMENT
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300 uppercase tracking-wider">
                    CATEGORY: {analysisResult.category}
                  </span>
                </div>

                <p className="text-base text-slate-200 leading-relaxed font-medium">
                  {analysisResult.summary}
                </p>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleCopySummary}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-2 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? 'Copied Summary' : 'Share / Copy Summary'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* WHAT WE NOTICED (Warning Signs) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">What We Noticed</h3>
            </div>

            {analysisResult.warningSigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.warningSigns.map((sign, index) => (
                  <WarningCard key={index} sign={sign} index={index} />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
                No specific warning signs flagged for this submission.
              </div>
            )}
          </div>

          {/* WHY THIS MATTERS (Possible Consequences) */}
          {analysisResult.possibleConsequences.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Why This Matters
              </h3>
              <p className="text-xs text-slate-400">
                Potential real-world consequences expressed in simple human language:
              </p>
              <ul className="space-y-2.5">
                {analysisResult.possibleConsequences.map((cons, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-2" />
                    <span>{cons}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* WHAT YOU SHOULD DO (Actionable Recommendations) */}
          {analysisResult.recommendedActions.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-emerald-400" />
                What You Should Do
              </h3>
              <p className="text-xs text-slate-400">
                Recommended practical next steps to protect yourself or verify safety:
              </p>
              <ol className="space-y-3">
                {analysisResult.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{action}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* QUESTIONS TO VERIFY */}
          {analysisResult.questionsToVerify.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                Questions to Verify
              </h3>
              <p className="text-xs text-slate-400">
                Questions you should ask or investigate further before proceeding:
              </p>
              <ul className="space-y-2.5">
                {analysisResult.questionsToVerify.map((q, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence Indicator & Limitations */}
          <ConfidenceIndicator
            confidence={analysisResult.confidence}
            limitations={analysisResult.limitations}
          />

          {/* Interactive AI Follow-up Chat Assistant */}
          <RiskChatAssistant analysisResult={analysisResult} />

          {/* Safety Advisory Banner */}
          <SafetyDisclaimer />
        </div>
      )}
    </div>
  );
};
