import React from 'react';
import { PhoneCall, Shield, AlertTriangle, ExternalLink } from 'lucide-react';

interface EmergencyHotlineWidgetProps {
  category: string;
}

export const EmergencyHotlineWidget: React.FC<EmergencyHotlineWidgetProps> = ({ category }) => {
  const getHotlines = () => {
    switch (category) {
      case 'DIGITAL SAFETY':
      case 'FINANCE':
        return {
          title: 'Cybercrime & Anti-Fraud Contacts',
          phone: '112 / Bank Anti-Fraud Line',
          agency: 'Cybercrime Reporting Portal & Consumer Protection',
          advice: 'Immediately contact your financial institution to place a temporary fraud hold if credentials were given.'
        };
      case 'ENERGY':
        return {
          title: 'Electrical & Power Emergency Service',
          phone: '112 / Regional Power Distribution Utility',
          agency: 'National Electricity Emergency Dispatch',
          advice: 'Maintain a minimum 10-meter clearance from uninsulated conductors or damaged transformers.'
        };
      case 'PUBLIC SAFETY':
      case 'ENVIRONMENT':
      case 'TRANSPORT':
        return {
          title: 'Public Safety & Disaster Management',
          phone: '112 / Emergency Management Agency',
          agency: 'Road Safety & Emergency Public Works',
          advice: 'Do not attempt to cross submerged roadways or approach unmonitored structural collapses.'
        };
      case 'HOUSING':
      case 'DOCUMENTS':
        return {
          title: 'Tenant Protection & Legal Advisory',
          phone: 'Residential Tenancy Ombudsman Advisory',
          agency: 'Legal Aid Council & Tenant Protection Center',
          advice: 'Request written modification of ambiguous fee clauses prior to signing or transferring deposits.'
        };
      default:
        return {
          title: 'Emergency Services Hotline',
          phone: '112 / National Emergency Number',
          agency: 'Civic Response Services',
          advice: 'Contact local emergency services immediately if there is an imminent physical threat.'
        };
    }
  };

  const hotline = getHotlines();

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
      <div className="flex items-center space-x-2 text-amber-400">
        <PhoneCall className="w-5 h-5 shrink-0" />
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
          {hotline.title}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">Emergency Hotline</span>
          <span className="font-mono font-bold text-amber-300 text-sm">{hotline.phone}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">Advisory Authority</span>
          <span className="font-semibold text-slate-200">{hotline.agency}</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 pt-1 leading-relaxed border-t border-slate-800/80">
        💡 <strong className="text-amber-300">Immediate Guidance:</strong> {hotline.advice}
      </p>
    </div>
  );
};
