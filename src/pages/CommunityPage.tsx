import React, { useState, useEffect } from 'react';
import { CommunityMap } from '../components/CommunityMap';
import { CommunityReport } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { MapPin, ShieldAlert, ThumbsUp, ThumbsDown, Filter, Plus } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (e) {
      console.error('Failed to fetch community reports:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReport = async (reportData: Omit<CommunityReport, 'id' | 'createdAt' | 'confirmations' | 'disagreements' | 'isVerified'>) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (res.ok) {
        const newReport = await res.json();
        setReports(prev => [newReport, ...prev]);
      }
    } catch (e) {
      console.error('Error adding community report:', e);
    }
  };

  const handleVote = async (id: string, type: 'confirm' | 'disagree') => {
    try {
      const res = await fetch(`/api/reports/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      if (res.ok) {
        const updated = await res.json();
        setReports(prev => prev.map(r => (r.id === id ? updated : r)));
      }
    } catch (e) {
      console.error('Error voting on report:', e);
    }
  };

  const filteredReports = activeCategoryFilter === 'ALL'
    ? reports
    : reports.filter(r => r.category === activeCategoryFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
            CROWDSOURCED HAZARD MONITOR
          </span>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            Community Hazard Map
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              UNVERIFIED COMMUNITY REPORTS
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Spot local physical risks (flooding, electrical line faults, washouts). Reported by community — not independently verified.
          </p>
        </div>
      </div>

      {/* Interactive Map Component */}
      <CommunityMap
        reports={filteredReports}
        onAddReport={handleAddReport}
        onVote={handleVote}
      />

      {/* Reports List Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span>Recent Community Reports ({filteredReports.length})</span>
          </h3>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'PUBLIC SAFETY', 'ENERGY', 'TRANSPORT', 'HOUSING'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeCategoryFilter === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List of Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                  COMMUNITY REPORT
                </span>
                <RiskBadge level={report.severity} size="sm" />
              </div>

              <h4 className="text-base font-bold text-white">{report.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{report.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>📍 {report.locationName}</span>
                <span className="text-[10px] italic">By {report.reporterName}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote(report.id, 'confirm')}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Confirm ({report.confirmations})</span>
                  </button>

                  <button
                    onClick={() => handleVote(report.id, 'disagree')}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Disagree ({report.disagreements})</span>
                  </button>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  Not independently verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
