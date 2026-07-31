import React from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  Search,
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  patternsLearned: number;
  totalPatterns: number;
  problemsSolved: number;
  dueTodayCount: number;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  patternsLearned,
  totalPatterns,
  problemsSolved,
  dueTodayCount,
  streakDays,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-slate-100 px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base leading-none text-slate-100 tracking-tight">
                DSA Pattern Map
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 leading-none">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5 hidden sm:block">
              Learn algorithms step-by-step
            </p>
          </div>
        </div>

        {/* Global Search Bar (Linear/Vercel Style) */}
        <div className="flex-1 max-w-sm hidden md:block relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patterns, problems, clues..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-12 py-1.5 bg-slate-900/80 hover:bg-slate-900 focus:bg-slate-900 text-xs border border-slate-800 focus:border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none transition-all font-mono"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60 pointer-events-none">
            /
          </kbd>
        </div>

        {/* Minimal Linear/Vercel Style Stats Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Stat 1: Patterns Learned */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/80 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Learned
              </span>
              <span className="text-xs font-mono font-semibold text-slate-100">
                {patternsLearned}/{totalPatterns || 12}
              </span>
            </div>
          </div>

          {/* Stat 2: Problems Solved */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/80 transition-colors">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Solved
              </span>
              <span className="text-xs font-mono font-semibold text-slate-100">
                {problemsSolved}
              </span>
            </div>
          </div>

          {/* Stat 3: Due Today */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border transition-colors ${
              dueTodayCount > 0
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-slate-900/90 border-slate-800/90 text-slate-300 hover:border-slate-700/80'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${dueTodayCount > 0 ? 'text-rose-400' : 'text-slate-400'}`} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Due
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  dueTodayCount > 0 ? 'text-rose-300' : 'text-slate-100'
                }`}
              >
                {dueTodayCount}
              </span>
            </div>
          </div>

          {/* Stat 4: Current Streak */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/80">
                Streak
              </span>
              <span className="text-xs font-mono font-semibold text-amber-300">
                {streakDays}d
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

