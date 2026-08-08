import React from 'react';
import { AlertCircle } from 'lucide-react';

export const SafetyDisclaimer: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs leading-relaxed flex items-start space-x-3">
      <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-bold text-amber-300 uppercase tracking-wider block mb-1">
          Decision Support Screening Notice
        </span>
        <p>
          IMPACTOS is an AI-powered screening and risk-awareness tool designed to assist in identifying potential hazards.
          Assessments are probabilistic and based on available input. This platform does not provide definitive legal advice, medical diagnosis, structural certification, or official emergency dispatch.
          In immediate emergency situations, contact local emergency response authorities directly.
        </p>
      </div>
    </div>
  );
};
