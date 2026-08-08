import React from 'react';
import { RiskLevel, SeverityLevel } from '../types';
import { AlertTriangle, ShieldCheck, AlertOctagon, Info, HelpCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel | SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const getStyles = () => {
    switch (level) {
      case 'LOW':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-500',
          icon: ShieldCheck,
          label: 'LOW RISK'
        };
      case 'CAUTION':
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
          label: level === 'CAUTION' ? 'CAUTION' : 'MEDIUM SEVERITY'
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          dot: 'bg-orange-500',
          icon: AlertOctagon,
          label: 'HIGH RISK'
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-500',
          icon: AlertOctagon,
          label: 'CRITICAL RISK'
        };
      case 'UNKNOWN':
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          dot: 'bg-slate-400',
          icon: HelpCircle,
          label: 'UNKNOWN'
        };
    }
  };

  const config = getStyles();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1 border rounded-md',
    md: 'text-xs font-semibold px-2.5 py-1 space-x-1.5 border rounded-lg',
    lg: 'text-sm font-bold px-3.5 py-1.5 space-x-2 border-2 rounded-xl'
  }[size];

  return (
    <span className={`inline-flex items-center tracking-wide uppercase ${config.bg} ${sizeClasses}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
