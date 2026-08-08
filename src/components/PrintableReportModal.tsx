import React, { useRef } from 'react';
import { RiskAnalysisResult } from '../types';
import { Printer, Shield, Check, X, FileText, Download } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface PrintableReportModalProps {
  result: RiskAnalysisResult;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({ result, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        {/* Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Official Risk Assessment Certificate</h3>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content Container */}
        <div ref={printRef} className="space-y-6 text-slate-100 print:text-black print:bg-white print:p-6 print:rounded-none">
          {/* Official Document Header */}
          <div className="flex items-center justify-between border-b pb-6 border-slate-800 print:border-gray-300">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-blue-500 print:text-blue-700" />
                <span className="text-2xl font-extrabold tracking-tight text-white print:text-black">
                  IMPACTOS
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 font-mono">
                Real-World Risk & Danger Detection Report
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 print:text-gray-500 block">Report Timestamp</span>
              <span className="text-xs font-mono font-bold text-slate-200 print:text-black">
                {new Date(result.analyzedAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Overall Assessment Banner */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 print:text-gray-600 block mb-1">
                Category: {result.category}
              </span>
              <h2 className="text-xl font-bold text-white print:text-black">
                Overall Risk Assessment: {result.overallRisk}
              </h2>
              <p className="text-xs text-slate-300 print:text-gray-700 mt-1 max-w-xl">
                {result.summary}
              </p>
            </div>

            <div className="text-center px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 print:border-gray-400 shrink-0">
              <span className="text-[10px] uppercase font-mono text-slate-400 print:text-gray-500 block">Risk Score</span>
              <span className="text-2xl font-extrabold text-blue-400 print:text-blue-800 font-mono">
                {result.riskScore}/100
              </span>
            </div>
          </div>

          {/* Warning Signs Checklist */}
          {result.warningSigns.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 print:text-black border-b pb-1 print:border-gray-300">
                Flagged Warning Signs
              </h4>
              <div className="space-y-2">
                {result.warningSigns.map((sign, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 print:border-gray-300 print:bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white print:text-black">
                        #{i + 1} {sign.title}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 print:text-amber-800 border print:border-amber-400">
                        {sign.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 print:text-gray-700">
                      {sign.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Next Steps */}
          {result.recommendedActions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 print:text-black border-b pb-1 print:border-gray-300">
                Actionable Recommendations Checklist
              </h4>
              <ol className="space-y-2 text-xs text-slate-200 print:text-black">
                {result.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="font-mono font-bold text-blue-400 print:text-blue-800 shrink-0">[{i + 1}]</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Official Verification Disclaimer Footer */}
          <div className="pt-4 border-t border-slate-800 print:border-gray-300 text-[10px] text-slate-400 print:text-gray-600 flex items-center justify-between">
            <span>IMPACTOS Risk Screening Platform</span>
            <span>Confidence Level: {result.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
