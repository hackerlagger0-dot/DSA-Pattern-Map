import React from 'react';
import { ArrowUpRight, Code, Clock, Layers } from 'lucide-react';
import { Pattern } from '../../types';

interface PatternCardProps {
  pattern: Pattern;
  problemCount: number;
  masteredCount: number;
  onOpenDetail: (pattern: Pattern) => void;
  onPracticePattern: (pattern: Pattern) => void;
}

export const PatternCard: React.FC<PatternCardProps> = ({
  pattern,
  problemCount,
  masteredCount,
  onOpenDetail,
  onPracticePattern,
}) => {
  const masteryPercentage =
    problemCount > 0 ? Math.round((masteredCount / problemCount) * 100) : 0;

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  }[pattern.difficulty];

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between gap-4 transition-all hover:shadow-lg group">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full truncate">
            {pattern.category}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full shrink-0 ${difficultyColors}`}
          >
            {pattern.difficulty}
          </span>
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
          <span>{pattern.name}</span>
          <button
            onClick={() => onOpenDetail(pattern)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="View full pattern template & invariants"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {pattern.description}
        </p>
      </div>

      {/* Complexities */}
      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
        <div>
          <span className="text-slate-400 block font-medium">Time:</span>
          <span className="text-slate-200 font-mono">{pattern.timeComplexity.split('-')[0]}</span>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Space:</span>
          <span className="text-slate-200 font-mono">{pattern.spaceComplexity.split('-')[0]}</span>
        </div>
      </div>

      {/* Progress & Actions */}
      <div className="space-y-3 pt-1">
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Learning Progress</span>
            <span className="text-indigo-300 font-semibold">{masteryPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <button
            onClick={() => onOpenDetail(pattern)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Guide</span>
          </button>

          <button
            onClick={() => onPracticePattern(pattern)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition-all duration-200 active:scale-95"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Practice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
