import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { Pattern, PatternCategory, Problem } from '../../types';
import { PatternCard } from '../Dashboard/PatternCard';

interface PatternListProps {
  patterns: Pattern[];
  problems: Problem[];
  onOpenDetail: (pattern: Pattern) => void;
  onPracticePattern: (pattern: Pattern) => void;
  searchQuery: string;
}

export const PatternList: React.FC<PatternListProps> = ({
  patterns,
  problems,
  onOpenDetail,
  onPracticePattern,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = [
    'All',
    'Two Pointers & Sliding Window',
    'Binary Search & Fast Search',
    'Trees & Graphs (BFS/DFS)',
    'Heaps & Priority Queues',
    'Backtracking & Subsets',
    'Dynamic Programming',
    'LinkedList Manipulation',
    'Monotonic Stack & Queue',
    'Trie & Prefix Tree',
    'Union Find & Graph Algorithms',
  ];

  const filteredPatterns = patterns.filter((pat) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      pat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.whenToUse.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || pat.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'All' || pat.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-bold text-slate-200">Category Filter</span>
        </div>

        {/* Categories scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-medium">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Pattern Cards Grid */}
      {filteredPatterns.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
          <p className="text-sm font-semibold text-slate-300">No patterns match your filter.</p>
          <p className="text-xs text-slate-400">Try adjusting your search terms or category selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatterns.map((pat) => {
            const patProbs = problems.filter((p) => p.patternId === pat.id);
            return (
              <PatternCard
                key={pat.id}
                pattern={pat}
                problemCount={patProbs.length}
                masteredCount={Math.floor(patProbs.length * 0.6)}
                onOpenDetail={onOpenDetail}
                onPracticePattern={onPracticePattern}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
