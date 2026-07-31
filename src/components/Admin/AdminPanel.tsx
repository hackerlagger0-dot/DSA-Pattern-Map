import React, { useState } from 'react';
import {
  Download,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  Edit2,
  FileJson,
  Layers,
  ListOrdered,
} from 'lucide-react';
import { AdminAuditLog, Pattern, Problem } from '../../types';

interface AdminPanelProps {
  patterns: Pattern[];
  problems: Problem[];
  auditLogs: AdminAuditLog[];
  onAddPattern: (p: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAddProblem: (p: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeletePattern: (id: string) => void;
  onDeleteProblem: (id: string) => void;
  onBulkImport: (json: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  patterns,
  problems,
  auditLogs,
  onAddPattern,
  onAddProblem,
  onDeletePattern,
  onDeleteProblem,
  onBulkImport,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'patterns' | 'problems' | 'audit' | 'bulk'>('patterns');
  const [jsonText, setJsonText] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // New Pattern form state
  const [newPatName, setNewPatName] = useState('');
  const [newPatCategory, setNewPatCategory] = useState('Two Pointers & Sliding Window');
  const [newPatDesc, setNewPatDesc] = useState('');

  // New Problem form state
  const [newProbTitle, setNewProbTitle] = useState('');
  const [newProbPatternId, setNewProbPatternId] = useState(patterns[0]?.id || '');
  const [newProbStatement, setNewProbStatement] = useState('');

  const handleCreatePatternSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatName.trim()) return;
    onAddPattern({
      slug: newPatName.toLowerCase().replace(/\s+/g, '-'),
      name: newPatName,
      category: newPatCategory as any,
      difficulty: 'Medium',
      description: newPatDesc,
      whenToUse: ['Specified by admin.'],
      keyInvariants: ['Specified by admin.'],
      commonTraps: ['None recorded.'],
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      prerequisites: ['Arrays'],
      codeTemplate: { language: 'TypeScript', code: '// Custom template code' },
      confusedWith: [],
    });
    setNewPatName('');
    setNewPatDesc('');
  };

  const handleCreateProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProbTitle.trim()) return;
    const selectedPattern = patterns.find((p) => p.id === newProbPatternId);
    onAddProblem({
      slug: newProbTitle.toLowerCase().replace(/\s+/g, '-'),
      title: newProbTitle,
      difficulty: 'Medium',
      patternId: newProbPatternId,
      patternName: selectedPattern?.name || 'General',
      statement: newProbStatement,
      constraints: ['1 <= N <= 10^5'],
      examples: [{ input: 'Sample Input', output: 'Sample Output' }],
      patternTriggers: ['Custom Trigger'],
      commonWrongPatterns: [],
      hints: ['Analyze constraints.'],
      solutionExplanation: 'Admin specified problem.',
    });
    setNewProbTitle('');
    setNewProbStatement('');
  };

  const handleJsonImportSubmit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onBulkImport(parsed);
      setImportMessage('JSON Bulk Import completed successfully!');
      setJsonText('');
    } catch (err: any) {
      setImportMessage(`Invalid JSON format: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl font-bold text-white">Admin Management Panel</h2>
          </div>
          <p className="text-xs text-slate-400">
            Create, edit, soft-delete patterns & problems, view audit logs, or perform bulk JSON imports.
          </p>
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveAdminTab('patterns')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAdminTab === 'patterns'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Patterns ({patterns.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('problems')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAdminTab === 'problems'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Problems ({problems.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAdminTab === 'audit'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveAdminTab('bulk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAdminTab === 'bulk'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            JSON Import/Export
          </button>
        </div>
      </div>

      {/* Admin Tab Contents */}
      {activeAdminTab === 'patterns' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add New Pattern</span>
            </h3>
            <form onSubmit={handleCreatePatternSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Pattern Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monotonic Queue"
                  value={newPatName}
                  onChange={(e) => setNewPatName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Category</label>
                <select
                  value={newPatCategory}
                  onChange={(e) => setNewPatCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Two Pointers & Sliding Window">Two Pointers & Sliding Window</option>
                  <option value="Binary Search & Fast Search">Binary Search & Fast Search</option>
                  <option value="Trees & Graphs (BFS/DFS)">Trees & Graphs (BFS/DFS)</option>
                  <option value="Heaps & Priority Queues">Heaps & Priority Queues</option>
                  <option value="Backtracking & Subsets">Backtracking & Subsets</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief algorithm invariant summary..."
                  value={newPatDesc}
                  onChange={(e) => setNewPatDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors"
              >
                Create Pattern
              </button>
            </form>
          </div>

          {/* List Table */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Existing Patterns</h3>
            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {patterns.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.category}</p>
                  </div>
                  <button
                    onClick={() => onDeletePattern(p.id)}
                    className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                    title="Soft delete pattern"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'problems' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Problem Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add New Problem</span>
            </h3>
            <form onSubmit={handleCreateProblemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subarray Product Less Than K"
                  value={newProbTitle}
                  onChange={(e) => setNewProbTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target Pattern</label>
                <select
                  value={newProbPatternId}
                  onChange={(e) => setNewProbPatternId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {patterns.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Problem Statement</label>
                <textarea
                  rows={3}
                  placeholder="LeetCode problem prompt text..."
                  value={newProbStatement}
                  onChange={(e) => setNewProbStatement(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors"
              >
                Create Problem
              </button>
            </form>
          </div>

          {/* Existing Problems */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Existing Problems</h3>
            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {problems.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{p.title}</p>
                    <p className="text-[10px] text-indigo-400">{p.patternName}</p>
                  </div>
                  <button
                    onClick={() => onDeleteProblem(p.id)}
                    className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Admin Audit Log Trail</h3>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mr-2">
                    {log.action}
                  </span>
                  <span className="font-bold text-white">{log.entity} #{log.entityId}</span>
                  {log.details && <span className="text-slate-400 ml-2">— {log.details}</span>}
                </div>
                <div className="text-right text-[10px] text-slate-400 shrink-0">
                  <p className="font-medium text-slate-300">{log.actor}</p>
                  <p>{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminTab === 'bulk' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileJson className="w-4 h-4 text-indigo-400" />
              <span>Bulk JSON Import / Export</span>
            </h3>

            <button
              onClick={() => {
                const data = JSON.stringify({ patterns, problems }, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dsa_patterns_backup_${Date.now()}.json`;
                a.click();
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Current Database JSON</span>
            </button>
          </div>

          <div className="space-y-3">
            <textarea
              rows={8}
              placeholder='Paste JSON containing { "patterns": [...], "problems": [...] }'
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-indigo-200 font-mono p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <button
              onClick={handleJsonImportSubmit}
              disabled={!jsonText.trim()}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50"
            >
              Import JSON Records
            </button>

            {importMessage && (
              <p className="p-3 bg-slate-950 border border-slate-800 text-xs font-semibold text-rose-400 rounded-lg">
                {importMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
