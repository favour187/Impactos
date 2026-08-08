import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080B11] border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-base font-extrabold text-white">IMPACTOS</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              AI-powered Real-World Risk & Danger Detection Platform. Spot the risk before it becomes a problem.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Powered by Google Gemini Multimodal Vision & Reasoning
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Navigation</h5>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home / Overview</Link></li>
              <li><Link to="/analyze" className="hover:text-blue-400 transition-colors">Universal Analyzer</Link></li>
              <li><Link to="/explore" className="hover:text-blue-400 transition-colors">Risk Explorer (12 Sectors)</Link></li>
              <li><Link to="/community" className="hover:text-blue-400 transition-colors">Community Hazard Map</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Personal Dashboard</Link></li>
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Sectors Covered</h5>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>Digital Safety & Phishing</li>
              <li>Energy & Electrical Hazards</li>
              <li>Public Safety & Flooding</li>
              <li>Housing & Rental Contracts</li>
              <li>Agriculture & Crop Health</li>
              <li>Business Financial Anomalies</li>
            </ul>
          </div>

          {/* Safety & Hackathon */}
          <div>
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Safety & Privacy</h5>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-400" /> Privacy & Local Storage</Link></li>
              <li><a href="https://ngn-hacks-2026.devpost.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-1">NGN Hacks 2026 <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
              AI Screening Tool — Not a substitute for emergency services or licensed professionals.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-slate-500">
            © 2026 IMPACTOS AI. Built for real-world danger detection.
          </p>
          <p className="text-slate-500 flex items-center gap-1">
            Created with AI decision support principles.
          </p>
        </div>
      </div>
    </footer>
  );
};
