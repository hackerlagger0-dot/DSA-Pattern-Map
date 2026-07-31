import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  X,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Problem, SpacedRepetitionItem } from '../../types';

interface DueTodayProps {
  dueItems: { item: SpacedRepetitionItem; problem: Problem }[];
  onReviewSubmit: (problemId: string, grade: number, timeSeconds: number) => void;
  onLaunchMentor: (problem: Problem) => void;
}

export const DueToday: React.FC<DueTodayProps> = ({
  dueItems,
  onReviewSubmit,
  onLaunchMentor,
}) => {
  const [selectedReviewProblem, setSelectedReviewProblem] = useState<Problem | null>(null);
  const [reviewTimer, setReviewTimer] = useState<number>(0);

  // Guided Study Session state
  const [sessionQueue, setSessionQueue] = useState<{ item: SpacedRepetitionItem; problem: Problem }[]>([]);
  const [sessionIndex, setSessionIndex] = useState<number | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [completedSessionCount, setCompletedSessionCount] = useState<number>(0);

  // Timer interval for single review modal or active session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedReviewProblem || sessionIndex !== null) {
      interval = setInterval(() => setReviewTimer((t) => t + 1), 1000);
    } else {
      setReviewTimer(0);
    }
    return () => clearInterval(interval);
  }, [selectedReviewProblem, sessionIndex]);

  // Helper calculation for estimated review time per problem
  const getEstimatedTimeMinutes = (difficulty: string) => {
    if (difficulty === 'Easy') return 5;
    if (difficulty === 'Hard') return 12;
    return 8; // Medium
  };

  // Helper calculation for confidence score (1 to 5)
  const getConfidenceScore = (item?: SpacedRepetitionItem): number => {
    if (!item) return 3;
    if (item.easeFactor) {
      const mapped = Math.round(((item.easeFactor - 1.3) / 1.5) * 4 + 1);
      return Math.min(5, Math.max(1, mapped));
    }
    return 4;
  };

  const totalEstimatedMinutes = dueItems.reduce((acc, { problem }) => {
    return acc + getEstimatedTimeMinutes(problem.difficulty);
  }, 0);

  // Handle single problem review submission
  const handleSingleGradeSelection = (grade: number) => {
    if (!selectedReviewProblem) return;
    onReviewSubmit(selectedReviewProblem.id, grade, reviewTimer);
    setSelectedReviewProblem(null);
    setReviewTimer(0);
  };

  // Start Guided Session Mode
  const handleStartSession = () => {
    if (dueItems.length === 0) return;
    setSessionQueue([...dueItems]);
    setSessionIndex(0);
    setSessionCompleted(false);
    setCompletedSessionCount(0);
    setReviewTimer(0);
  };

  // Handle Session step submission
  const handleSessionGradeSelection = (grade: number) => {
    if (sessionIndex === null || !sessionQueue[sessionIndex]) return;
    const current = sessionQueue[sessionIndex];
    onReviewSubmit(current.problem.id, grade, reviewTimer);
    setCompletedSessionCount((prev) => prev + 1);

    if (sessionIndex + 1 < sessionQueue.length) {
      setSessionIndex(sessionIndex + 1);
      setReviewTimer(0);
    } else {
      setSessionIndex(null);
      setSessionCompleted(true);
    }
  };

  const currentSessionProblem = sessionIndex !== null && sessionQueue[sessionIndex] ? sessionQueue[sessionIndex].problem : null;
  const currentSessionItem = sessionIndex !== null && sessionQueue[sessionIndex] ? sessionQueue[sessionIndex].item : undefined;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-sm">
      {/* 1. Queue Header & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Today's Revision Queue
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
              {dueItems.length} Due
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Spaced repetition queue based on the SM-2 algorithm.
          </p>
        </div>

        {/* Header Stats & Start Session Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>~{totalEstimatedMinutes} mins total</span>
          </div>

          <button
            onClick={handleStartSession}
            disabled={dueItems.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
              dueItems.length > 0
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Session</span>
          </button>
        </div>
      </div>

      {/* 2. Problem Queue Cards List */}
      {dueItems.length === 0 ? (
        <div className="p-8 text-center bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">Revision Queue Completed!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              You are all caught up on spaced repetition for today. Great job keeping your streak active!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {dueItems.map(({ item, problem }) => {
            const confidence = getConfidenceScore(item);
            const estTime = getEstimatedTimeMinutes(problem.difficulty);
            const triggersPreview = problem.patternTriggers ? problem.patternTriggers.slice(0, 2) : [];

            return (
              <div
                key={problem.id}
                className="p-4 bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
              >
                {/* Problem Info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    {/* Pattern Badge */}
                    <span className="font-bold px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {problem.patternName}
                    </span>

                    {/* Difficulty Badge */}
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-md border ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {problem.difficulty}
                    </span>

                    {/* Review Number */}
                    <span className="font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Review #{item.repetition || 1}
                    </span>

                    {/* Previous Confidence Rating */}
                    <div className="flex items-center gap-1 text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>Conf: {confidence}/5</span>
                    </div>

                    {/* Estimated Time */}
                    <span className="text-slate-400 font-mono">
                      ~{estTime}m
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 truncate">
                    <span>{problem.title}</span>
                  </h4>

                  {/* Pattern Trigger Preview (1-2 keywords) */}
                  {triggersPreview.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="text-slate-500 font-medium">Triggers:</span>
                      {triggersPreview.map((trigger, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800/80 font-mono text-[10px]"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                  {/* Need a Hint Button */}
                  <button
                    onClick={() => onLaunchMentor(problem)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
                    title="Get a Socratic hint from AI Mentor"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Need a Hint</span>
                  </button>

                  {/* Open LeetCode Icon Button */}
                  <a
                    href={problem.leetcodeUrl || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(problem.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/25 hover:border-orange-500/50 rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-orange-500/10"
                    title="Open Problem on LeetCode"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                    <span className="hidden sm:inline">LeetCode</span>
                  </a>

                  {/* Practice Now Primary Button */}
                  <button
                    onClick={() => setSelectedReviewProblem(problem)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition-all duration-200 active:scale-95"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Practice Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Single Problem Review Modal */}
      {selectedReviewProblem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-indigo-400">Practice Review</span>
                <h3 className="text-lg font-bold text-white">{selectedReviewProblem.title}</h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-300 rounded-lg font-mono text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{reviewTimer}s</span>
              </div>
            </div>

            {/* Problem Statement Snapshot */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-slate-200">Question Summary:</p>
              <p className="leading-relaxed line-clamp-4">{selectedReviewProblem.statement}</p>
            </div>

            {/* Pattern Triggers */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-300">Pattern Triggers:</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedReviewProblem.patternTriggers.map((t, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Rating Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-200">
                  Rate your recall confidence:
                </p>
                <button
                  onClick={() => onLaunchMentor(selectedReviewProblem)}
                  className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Need a Hint?</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleSingleGradeSelection(1)}
                  className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold text-center transition-all"
                >
                  <span className="block text-sm">Forgot (1)</span>
                  <span className="text-[10px] opacity-80">Need to restudy</span>
                </button>
                <button
                  onClick={() => handleSingleGradeSelection(3)}
                  className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold text-center transition-all"
                >
                  <span className="block text-sm">Hard (3)</span>
                  <span className="text-[10px] opacity-80">Took time</span>
                </button>
                <button
                  onClick={() => handleSingleGradeSelection(4)}
                  className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold text-center transition-all"
                >
                  <span className="block text-sm">Good (4)</span>
                  <span className="text-[10px] opacity-80">Remembered well</span>
                </button>
                <button
                  onClick={() => handleSingleGradeSelection(5)}
                  className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center transition-all"
                >
                  <span className="block text-sm">Easy (5)</span>
                  <span className="text-[10px] opacity-80">Knew right away</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReviewProblem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Guided Study Session Step-by-Step Modal */}
      {sessionIndex !== null && currentSessionProblem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 relative">
            {/* Session Header & Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Step {sessionIndex + 1} of {sessionQueue.length}
                  </span>
                  <span className="text-xs text-slate-400">Guided Study Session</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-slate-300 rounded-lg font-mono text-xs border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{reviewTimer}s</span>
                  </div>

                  <button
                    onClick={() => setSessionIndex(null)}
                    className="text-slate-400 hover:text-white transition-colors p-1"
                    title="Exit Session"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${((sessionIndex + 1) / sessionQueue.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Problem Card Body */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-400">{currentSessionProblem.patternName}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-semibold text-slate-400">{currentSessionProblem.difficulty}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{currentSessionProblem.title}</h3>
                </div>

                {/* Open LeetCode in Session */}
                <a
                  href={currentSessionProblem.leetcodeUrl || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(currentSessionProblem.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/25 hover:border-orange-500/50 rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-orange-500/10 flex items-center gap-1.5"
                  title="Open Problem on LeetCode"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                  <span>LeetCode</span>
                </a>
              </div>

              {/* Problem Statement */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-slate-200">Problem Statement:</p>
                <p className="leading-relaxed max-h-36 overflow-y-auto pr-1">{currentSessionProblem.statement}</p>
              </div>

              {/* Trigger clues */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-300">Pattern Triggers:</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentSessionProblem.patternTriggers.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-200">
                  Rate your pattern recall confidence:
                </p>

                {/* Need a Hint inside Session */}
                <button
                  onClick={() => onLaunchMentor(currentSessionProblem)}
                  className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Need a Hint</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleSessionGradeSelection(1)}
                  className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold text-center transition-all active:scale-95"
                >
                  <span className="block text-sm">Forgot (1)</span>
                  <span className="text-[10px] opacity-80">Restudy soon</span>
                </button>
                <button
                  onClick={() => handleSessionGradeSelection(3)}
                  className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold text-center transition-all active:scale-95"
                >
                  <span className="block text-sm">Hard (3)</span>
                  <span className="text-[10px] opacity-80">Took effort</span>
                </button>
                <button
                  onClick={() => handleSessionGradeSelection(4)}
                  className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold text-center transition-all active:scale-95"
                >
                  <span className="block text-sm">Good (4)</span>
                  <span className="text-[10px] opacity-80">Recall good</span>
                </button>
                <button
                  onClick={() => handleSessionGradeSelection(5)}
                  className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center transition-all active:scale-95"
                >
                  <span className="block text-sm">Easy (5)</span>
                  <span className="text-[10px] opacity-80">Knew instantly</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Session Completed Dialog */}
      {sessionCompleted && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 text-center shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Study Session Completed!</h3>
              <p className="text-xs text-slate-400">
                You successfully reviewed {completedSessionCount} spaced repetition problems today.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-around text-xs font-mono">
              <div>
                <span className="block text-slate-400 text-[10px] uppercase">Reviewed</span>
                <span className="text-base font-bold text-white">{completedSessionCount}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="block text-slate-400 text-[10px] uppercase">XP Earned</span>
                <span className="text-base font-bold text-amber-400">+{completedSessionCount * 40} XP</span>
              </div>
            </div>

            <button
              onClick={() => setSessionCompleted(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/20"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
