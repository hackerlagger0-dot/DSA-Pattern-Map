import React from 'react';
import {
  BookOpen,
  Bot,
  Compass,
  GitFork,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Role } from '../types';
import { isAdminAllowed } from '../lib/auth';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  dueCount: number;
  userRole?: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  dueCount,
  userRole,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Daily Practice',
      icon: LayoutDashboard,
      badge: dueCount > 0 ? `${dueCount} Due` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'library',
      label: 'Pattern Library',
      icon: BookOpen,
    },
    {
      id: 'decision-tree',
      label: 'Pattern Flowchart',
      icon: GitFork,
      badge: 'Easy Map',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'quiz',
      label: 'Quick Quiz',
      icon: Compass,
    },
    {
      id: 'detector',
      label: 'AI Pattern Finder',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'progress',
      label: 'Learning Progress',
      icon: TrendingUp,
    },
  ];

  if (isAdminAllowed()) {
    navItems.push({
      id: 'admin',
      label: 'Admin Control',
      icon: ShieldAlert,
      badge: 'Admin',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    });
  }

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Teacher Quick Callout */}
      <div className="mt-8 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-300 text-xs space-y-2">
        <div className="flex items-center gap-2 font-semibold text-indigo-300">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span>Friendly AI Teacher</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          Get simple clues step by step without spoiling the answer!
        </p>
      </div>
    </aside>
  );
};
