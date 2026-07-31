import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Layers,
  X,
} from 'lucide-react';
import { Pattern, Problem } from '../../types';

interface PatternDetailModalProps {
  pattern: Pattern | null;
  problems: Problem[];
  onClose: () => void;
  onSelectProblem: (prob: Problem) => void;
}

export const PatternDetailModal: React.FC<PatternDetailModalProps> = ({
  pattern,
  problems,
  onClose,
  onSelectProblem,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!pattern) return null;

  const relatedProblems = problems.filter((p) => p.patternId === pattern.id);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pattern.codeTemplate.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 my-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {pattern.category}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {pattern.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{pattern.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
          {pattern.description}
        </p>

        {/* When To Use (Triggers) */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>When to Use This Pattern (Look for Clues)</span>
          </h4>
          <ul className="space-y-1.5">
            {pattern.whenToUse.map((item, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80"
              >
                <span className="text-emerald-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Invariants */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Important Rules to Remember</span>
          </h4>
          <ul className="space-y-1.5">
            {pattern.keyInvariants.map((item, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80"
              >
                <span className="text-indigo-400 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Code Template */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Starter Code Template ({pattern.codeTemplate.language})</span>
            </h4>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto">
            <code>{pattern.codeTemplate.code}</code>
          </pre>
        </div>

        {/* Common Traps */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Common Mistakes to Avoid</span>
          </h4>
          <ul className="space-y-1.5">
            {pattern.commonTraps.map((trap, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-300 flex items-start gap-2 bg-rose-500/5 p-2 rounded-lg border border-rose-500/20"
              >
                <span className="text-rose-400 font-bold">⚠️</span>
                <span>{trap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Confused With Table */}
        {pattern.confusedWith && pattern.confusedWith.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Often Confused With
            </h4>
            <div className="space-y-2">
              {pattern.confusedWith.map((cw, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1 text-xs"
                >
                  <p className="font-bold text-amber-300">{cw.patternName}</p>
                  <p className="text-slate-300 leading-relaxed">{cw.difference}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Problems */}
        <div className="space-y-2 border-t border-slate-800 pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Practice Problems ({relatedProblems.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {relatedProblems.map((prob) => (
              <button
                key={prob.id}
                onClick={() => onSelectProblem(prob)}
                className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-white">{prob.title}</p>
                  <p className="text-[10px] text-slate-400">{prob.difficulty}</p>
                </div>
                <span className="text-xs text-indigo-400 font-semibold">Solve →</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
