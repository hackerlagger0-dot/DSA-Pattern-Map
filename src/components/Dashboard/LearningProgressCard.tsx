import React from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  TrendingUp,
  BookOpen,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Pattern, Problem, SpacedRepetitionItem } from '../../types';
import { LocalProgress } from '../../lib/localStorage';

interface LearningProgressCardProps {
  patterns: Pattern[];
  problems: Problem[];
  spacedItems: SpacedRepetitionItem[];
  localProgress: LocalProgress;
  weeklyTarget?: number;
}

export const LearningProgressCard: React.FC<LearningProgressCardProps> = ({
  patterns,
  problems,
  spacedItems,
  localProgress,
  weeklyTarget = 10,
}) => {
  const solvedSet = new Set(localProgress.solvedProblemIds);
  const problemsSolvedCount = solvedSet.size;

  // Pattern mastery calculation
  const patternProgressList = patterns.map((pattern) => {
    const patternProblems = problems.filter((p) => p.patternId === pattern.id);
    const solvedCount = patternProblems.filter((p) => solvedSet.has(p.id)).length;
    const totalCount = patternProblems.length || 1;
    const percentage = Math.round((solvedCount / totalCount) * 100);
    const isMastered = percentage >= 75 || localProgress.masteredPatternIds.includes(pattern.id);

    return {
      pattern,
      solvedCount,
      totalCount,
      percentage,
      isMastered,
    };
  });

  const patternsMasteredCount = patternProgressList.filter((p) => p.isMastered).length;
  const totalPatterns = patterns.length || 1;
  const patternMasteryPercentage = Math.round((patternsMasteredCount / totalPatterns) * 100);

  // Difficulty stats
  const easySolved = problems.filter((p) => p.difficulty === 'Easy' && solvedSet.has(p.id)).length;
  const mediumSolved = problems.filter((p) => p.difficulty === 'Medium' && solvedSet.has(p.id)).length;
  const hardSolved = problems.filter((p) => p.difficulty === 'Hard' && solvedSet.has(p.id)).length;

  // Weekly Goal Progress (Default 10 problems per week)
  const weeklySolvedCount = Math.min(problemsSolvedCount, weeklyTarget);
  const weeklyPercentage = Math.min(Math.round((weeklySolvedCount / weeklyTarget) * 100), 100);

  // Streak
  const streakDays = localProgress.streakDays || 1;

  // Days of week consistency mock / dynamic status
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Main Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Learning Progress & Statistics</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time tracking of pattern mastery, problem solving counts, active daily streaks, and weekly goals.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{localProgress.points} Practice XP</span>
        </div>
      </div>

      {/* 4 Core Stat Cards (shadcn/ui style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Patterns Mastered */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Patterns Mastered</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono">{patternsMasteredCount}</span>
              <span className="text-xs text-slate-400">/ {totalPatterns} total</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">
              {patternMasteryPercentage}% patterns mastered
            </p>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${patternMasteryPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Problems Solved */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono">{problemsSolvedCount}</span>
              <span className="text-xs text-slate-400">/ {problems.length} solved</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
              <span className="text-emerald-400">{easySolved} Easy</span>
              <span>•</span>
              <span className="text-amber-400">{mediumSolved} Med</span>
              <span>•</span>
              <span className="text-rose-400">{hardSolved} Hard</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${problems.length ? (easySolved / problems.length) * 100 : 0}%` }}
            />
            <div
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${problems.length ? (mediumSolved / problems.length) * 100 : 0}%` }}
            />
            <div
              className="h-full bg-rose-500 transition-all"
              style={{ width: `${problems.length ? (hardSolved / problems.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Current Streak */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono">{streakDays}</span>
              <span className="text-xs text-slate-400">Days Active</span>
            </div>
            <p className="text-[11px] text-amber-400 font-medium mt-1">
              {streakDays >= 7 ? '🔥 Master Consistency!' : 'Keep practice going today'}
            </p>
          </div>
          {/* Consistency dots for current week */}
          <div className="flex items-center justify-between pt-1">
            {daysOfWeek.map((day, idx) => {
              const isPastOrToday = idx <= todayIndex;
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-mono text-slate-500">{day}</span>
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isPastOrToday
                        ? 'bg-amber-400 ring-2 ring-amber-400/30'
                        : 'bg-slate-800 border border-slate-700'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Metric 4: Weekly Goal Progress */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Weekly Goal</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono">{weeklySolvedCount}</span>
              <span className="text-xs text-slate-400">/ {weeklyTarget} Target</span>
            </div>
            <p className="text-[11px] text-indigo-300 font-medium mt-1">
              {weeklySolvedCount >= weeklyTarget
                ? '🎉 Weekly target achieved!'
                : `${weeklyTarget - weeklySolvedCount} problems left this week`}
            </p>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${weeklyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pattern Detailed Mastery Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Pattern Mastery Breakdown</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {patternsMasteredCount} of {totalPatterns} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {patternProgressList.map(({ pattern, solvedCount, totalCount, percentage, isMastered }) => (
            <div
              key={pattern.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{pattern.name}</h4>
                  {isMastered ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      Mastered
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                      In Progress
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{solvedCount} / {totalCount} solved</span>
                  <span>•</span>
                  <span>{pattern.difficulty}</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isMastered ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="text-right font-mono text-xs font-bold shrink-0 text-slate-300">
                {percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Schema Note for Database Connection */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-400 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-300">Dynamic Database Interface</p>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Learning statistics are reactively computed from client local storage and easily bound to PostgreSQL / Prisma <code className="text-indigo-300 font-mono">User</code> and <code className="text-indigo-300 font-mono">SpacedRepetitionItem</code> tables when server backend mode is connected.
          </p>
        </div>
      </div>
    </div>
  );
};
