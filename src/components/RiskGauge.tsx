import React from 'react';
import { RiskLevel } from '../types';
import { RiskBadge } from './RiskBadge';

interface RiskGaugeProps {
  score: number; // 0 - 100
  overallRisk: RiskLevel;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, overallRisk }) => {
  // SVG Gauge calculations
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColorClass = () => {
    switch (overallRisk) {
      case 'LOW':
        return {
          stroke: '#10B981', // Emerald
          glow: 'glow-emerald',
          text: 'text-emerald-400',
          gradient: 'from-emerald-500/20 to-teal-500/5'
        };
      case 'CAUTION':
        return {
          stroke: '#F59E0B', // Amber
          glow: 'glow-amber',
          text: 'text-amber-400',
          gradient: 'from-amber-500/20 to-yellow-500/5'
        };
      case 'HIGH':
        return {
          stroke: '#F97316', // Orange
          glow: 'glow-orange',
          text: 'text-orange-400',
          gradient: 'from-orange-500/20 to-amber-600/5'
        };
      case 'CRITICAL':
        return {
          stroke: '#EF4444', // Red
          glow: 'glow-rose',
          text: 'text-rose-400',
          gradient: 'from-rose-500/20 to-red-600/5'
        };
      case 'UNKNOWN':
      default:
        return {
          stroke: '#6B7280', // Gray
          glow: '',
          text: 'text-slate-400',
          gradient: 'from-slate-500/20 to-gray-600/5'
        };
    }
  };

  const themeConfig = getColorClass();

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md bg-gradient-to-b ${themeConfig.gradient} ${themeConfig.glow}`}>
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background Track Circle */}
          <circle
            stroke="rgba(255, 255, 255, 0.08)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated Value Circle */}
          <circle
            stroke={themeConfig.stroke}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.2s ease-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Text Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">Risk Score</span>
          <div className="flex items-baseline">
            <span className={`text-4xl font-extrabold tracking-tight ${themeConfig.text}`}>
              {score}
            </span>
            <span className="text-xs text-slate-500 font-mono ml-0.5">/100</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <RiskBadge level={overallRisk} size="lg" />
      </div>
    </div>
  );
};
