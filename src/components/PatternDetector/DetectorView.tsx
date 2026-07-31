import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Cpu,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AIPatternDetectionResult } from '../../types';

export const DetectorView: React.FC = () => {
  const [problemTitle, setProblemTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIPatternDetectionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleProblem = `Given an array of integers nums and an integer k, return the maximum sum of any contiguous subarray of size k.
Constraints:
- 1 <= nums.length <= 10^5
- 1 <= k <= nums.length
- Memory limit: O(1) auxiliary space`;

  const handleRunDetection = async () => {
    if (!problemStatement.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/detector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle,
          problemStatement,
        }),
      });

      if (!res.ok) {
        throw new Error('Pattern detection service request failed.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'AI Pattern Detection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTemplate = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.suggestedTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-6 space-y-2 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">AI Pattern Finder</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Paste any coding question here! Our AI will find the right pattern, explain the clues in simple words, and give you starter code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Paste Question Text</h3>
            <button
              onClick={() => {
                setProblemTitle('Maximum Subarray Sum of Size K');
                setProblemStatement(sampleProblem);
              }}
              className="text-[11px] text-indigo-400 hover:underline font-semibold"
            >
              Load Example Question
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Question Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Find largest sum in a subarray"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Question Details
              </label>
              <textarea
                rows={10}
                placeholder="Paste the problem description or question text here..."
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleRunDetection}
            disabled={!problemStatement.trim() || isLoading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Cpu className="w-4 h-4 animate-spin text-amber-300" />
                <span>Reading Question Clues...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Find Pattern with AI</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-md">
          {!result ? (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl space-y-3">
              <Cpu className="w-12 h-12 text-slate-700 animate-pulse" />
              <p className="text-sm font-semibold text-slate-300">Awaiting Problem Input</p>
              <p className="text-xs text-slate-400 max-w-sm">
                Paste a problem statement on the left and click predict to extract algorithm patterns, triggers, and templates.
              </p>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in">
              {/* Primary Prediction Gauge */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Primary Predicted Pattern
                  </span>
                  <h3 className="text-2xl font-bold text-white">{result.mostLikelyPattern}</h3>
                  {result.secondaryPattern && (
                    <p className="text-xs text-slate-400">
                      Secondary Pattern: <span className="text-slate-200 font-semibold">{result.secondaryPattern}</span>
                    </p>
                  )}
                </div>

                <div className="text-center bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-2xl shrink-0">
                  <span className="text-2xl font-extrabold text-emerald-400">{result.confidenceScore}%</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">Confidence</span>
                </div>
              </div>

              {/* Extracted Pattern Triggers */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pattern Triggers Found in Prompt</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.triggersFound.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Complexities */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block font-semibold">Expected Time:</span>
                  <span className="text-indigo-300 font-mono font-bold">{result.timeComplexity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Expected Space:</span>
                  <span className="text-indigo-300 font-mono font-bold">{result.spaceComplexity}</span>
                </div>
              </div>

              {/* Confused With Comparative Cards */}
              {result.confusedWith && result.confusedWith.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Often Confused With
                  </h4>
                  <div className="space-y-2">
                    {result.confusedWith.map((cw, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1 text-xs"
                      >
                        <p className="font-bold text-amber-300">{cw.patternName}</p>
                        <p className="text-slate-300 leading-relaxed">{cw.whyDistinct}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Code Skeleton */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" />
                    <span>Suggested Template Skeleton</span>
                  </h4>
                  <button
                    onClick={handleCopyTemplate}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto max-h-48">
                  <code>{result.suggestedTemplate}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
