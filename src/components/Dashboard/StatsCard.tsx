import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}) => {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      iconBg: 'bg-indigo-500/20 text-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-500/10 border-amber-500/20',
      iconBg: 'bg-amber-500/20 text-amber-400',
    },
    rose: {
      bg: 'bg-rose-500/10 border-rose-500/20',
      iconBg: 'bg-rose-500/20 text-rose-400',
    },
    purple: {
      bg: 'bg-purple-500/10 border-purple-500/20',
      iconBg: 'bg-purple-500/20 text-purple-400',
    },
  }[color];

  return (
    <div className={`p-4 rounded-xl border ${colorStyles.bg} flex items-center justify-between`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorStyles.iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
