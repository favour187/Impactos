import React from 'react';
import { Lock, ShieldCheck, EyeOff, Trash2, Database, AlertCircle } from 'lucide-react';
import { useAnalysisHistory } from '../context/AnalysisHistoryContext';

export const PrivacyPage: React.FC = () => {
  const { clearHistory, history } = useAnalysisHistory();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-slate-800 pb-6">
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mx-auto border border-indigo-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Privacy & Data Handling Policy</h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          «Your uploaded content should be treated as sensitive.»
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-emerald-400" />
            Ephemeral Backend Processing
          </h3>
          <p>
            When you upload an image, contract document, URL, or message for risk analysis, the content is transmitted securely to our backend server to run the Gemini AI inference model. Files and image buffers are processed in memory and are NOT permanently stored on public web servers or databases.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Local Browser Storage
          </h3>
          <p>
            Your analysis history and personal dashboard statistics reside exclusively in your web browser's local storage (`localStorage`). No central user profiling or public activity tracking is linked to your device.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            User Controls & Data Deletion
          </h3>
          <p className="mb-4">
            You maintain full control over your local screening record. You can delete individual analysis entries or purge your entire local browser history at any time.
          </p>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center space-x-2 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge All Local History Now</span>
            </button>
          )}
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Remember: Avoid uploading unredacted passwords, full identity card numbers, or live banking credentials in raw text.
          </span>
        </div>
      </div>
    </div>
  );
};
