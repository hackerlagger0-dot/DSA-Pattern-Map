import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AdminAuditLog, Pattern, Problem, SpacedRepetitionItem } from './types';
import {
  getLocalProgress,
  saveLocalProgress,
  getLocalSpacedItems,
  saveLocalSpacedItems,
  LocalProgress,
} from './lib/localStorage';
import { calculateSM2 } from './lib/spacedRepetition';
import { isAdminAllowed } from './lib/auth';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StatsCard } from './components/Dashboard/StatsCard';
import { Heatmap } from './components/Dashboard/Heatmap';
import { PatternCard } from './components/Dashboard/PatternCard';
import { DueToday } from './components/Dashboard/DueToday';
import { PatternList } from './components/PatternLibrary/PatternList';
import { PatternDetailModal } from './components/PatternLibrary/PatternDetailModal';
import { DecisionTreeView } from './components/DecisionTree/DecisionTreeView';
import { QuizRunner } from './components/Quiz/QuizRunner';
import { AIMentorModal } from './components/Mentor/AIMentorModal';
import { DetectorView } from './components/PatternDetector/DetectorView';
import { AdminPanel } from './components/Admin/AdminPanel';
import { LearningProgressCard } from './components/Dashboard/LearningProgressCard';

export function App() {
  const [localProgress, setLocalProgress] = useState<LocalProgress>(() => getLocalProgress());

  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [spacedItems, setSpacedItems] = useState<SpacedRepetitionItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedPatternModal, setSelectedPatternModal] = useState<Pattern | null>(null);
  const [mentorProblemModal, setMentorProblemModal] = useState<Problem | null>(null);

  // Load initial data from API and Local Storage
  const fetchData = async () => {
    try {
      const [pRes, prRes, srRes] = await Promise.all([
        fetch('/api/patterns').then((r) => r.json()).catch(() => []),
        fetch('/api/problems').then((r) => r.json()).catch(() => []),
        fetch('/api/spaced-repetition').then((r) => r.json()).catch(() => []),
      ]);

      if (Array.isArray(pRes)) setPatterns(pRes);
      if (Array.isArray(prRes)) setProblems(prRes);
      if (Array.isArray(srRes)) {
        const items = getLocalSpacedItems(srRes);
        setSpacedItems(items);
      }

      if (isAdminAllowed()) {
        const aRes = await fetch('/api/admin/audit-logs').then((r) => r.json()).catch(() => []);
        if (Array.isArray(aRes)) setAuditLogs(aRes);
      }
    } catch (err) {
      console.error('Failed to load API data:', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Check URL path/hash on initial load
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash.replace('#', '');
    if (currentPath === '/admin' || currentHash === 'admin') {
      if (isAdminAllowed()) {
        setActiveTab('admin');
      } else {
        window.history.replaceState(null, '', '/');
        setActiveTab('dashboard');
      }
    }
  }, []);

  // Production safeguard: Redirect away from admin if not allowed
  useEffect(() => {
    if (activeTab === 'admin' && !isAdminAllowed()) {
      setActiveTab('dashboard');
    }
  }, [activeTab]);

  const handleReviewSubmit = async (problemId: string, grade: number, timeSeconds: number) => {
    try {
      // 1. Update points & solved problems in local storage
      const updatedPoints = localProgress.points + grade * 10;
      const updatedSolved = Array.from(new Set([...localProgress.solvedProblemIds, problemId]));
      
      const newProgress = saveLocalProgress({
        points: updatedPoints,
        solvedProblemIds: updatedSolved,
      });
      setLocalProgress(newProgress);

      // 2. Update spaced repetition item algorithm in local state & local storage
      const existingItemIndex = spacedItems.findIndex((i) => i.problemId === problemId);
      let updatedItems = [...spacedItems];
      if (existingItemIndex >= 0) {
        const item = spacedItems[existingItemIndex];
        const sm2 = calculateSM2(grade, item.repetition, item.intervalDays, item.easeFactor);
        const newItem: SpacedRepetitionItem = {
          ...item,
          repetition: sm2.repetition,
          intervalDays: sm2.intervalDays,
          easeFactor: sm2.easeFactor,
          nextReviewDate: sm2.nextReviewDate,
          lastReviewedAt: new Date().toISOString(),
          masteryLevel: sm2.masteryLevel,
        };
        updatedItems[existingItemIndex] = newItem;
      }
      setSpacedItems(updatedItems);
      saveLocalSpacedItems(updatedItems);

      // Optional backend sync
      fetch('/api/spaced-repetition/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, grade, timeTakenSeconds: timeSeconds }),
      }).catch(() => {});
    } catch (err) {
      console.error('Review submit failed:', err);
    }
  };

  const handleAddPattern = async (newPat: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPat),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Add pattern error:', err);
    }
  };

  const handleAddProblem = async (newProb: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProb),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Add problem error:', err);
    }
  };

  const handleDeletePattern = async (id: string) => {
    try {
      await fetch(`/api/patterns/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Delete pattern error:', err);
    }
  };

  const handleDeleteProblem = async (id: string) => {
    try {
      await fetch(`/api/problems/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Delete problem error:', err);
    }
  };

  const handleBulkImport = async (json: any) => {
    try {
      await fetch('/api/admin/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });
      fetchData();
    } catch (err) {
      console.error('Bulk import error:', err);
    }
  };

  // Due problems mapping
  const dueItemsMapped = spacedItems
    .map((item) => {
      const problem = problems.find((p) => p.id === item.problemId);
      return problem ? { item, problem } : null;
    })
    .filter(Boolean) as { item: SpacedRepetitionItem; problem: Problem }[];

  // Stats calculation for Navbar & Dashboard
  const solvedProblemIdsSet = new Set(localProgress.solvedProblemIds);
  const learnedPatternIds = new Set<string>(localProgress.masteredPatternIds);
  problems.forEach((prob) => {
    if (solvedProblemIdsSet.has(prob.id) && prob.patternId) {
      learnedPatternIds.add(prob.patternId);
    }
  });
  const patternsLearnedCount = learnedPatternIds.size;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        patternsLearned={patternsLearnedCount}
        totalPatterns={patterns.length}
        problemsSolved={localProgress.solvedProblemIds.length}
        dueTodayCount={dueItemsMapped.length}
        streakDays={localProgress.streakDays}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          dueCount={dueItemsMapped.length}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: REVISION DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Key Patterns"
                  value={patterns.length}
                  subtitle="Core problem templates"
                  icon={Layers}
                  color="indigo"
                />
                <StatsCard
                  title="Ready for Review"
                  value={dueItemsMapped.length}
                  subtitle="Problems to practice today"
                  icon={Clock}
                  color="rose"
                />
                <StatsCard
                  title="Total Problems"
                  value={problems.length}
                  subtitle="Classic practice questions"
                  icon={CheckCircle}
                  color="emerald"
                />
                <StatsCard
                  title="Your Practice XP"
                  value={localProgress.points}
                  subtitle={`${localProgress.streakDays} day practice streak`}
                  icon={Zap}
                  color="amber"
                />
              </div>

              {/* Heatmap Section */}
              <Heatmap />

              {/* Due Today Queue */}
              <DueToday
                dueItems={dueItemsMapped}
                onReviewSubmit={handleReviewSubmit}
                onLaunchMentor={(prob) => setMentorProblemModal(prob)}
              />

              {/* Featured Patterns Showcase */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    <span>Popular Patterns to Start With</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('library')}
                    className="text-xs text-indigo-400 hover:underline font-semibold"
                  >
                    See All {patterns.length} Patterns →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patterns.slice(0, 3).map((pat) => {
                    const patProbs = problems.filter((p) => p.patternId === pat.id);
                    return (
                      <PatternCard
                        key={pat.id}
                        pattern={pat}
                        problemCount={patProbs.length}
                        masteredCount={Math.floor(patProbs.length * 0.7)}
                        onOpenDetail={(p) => setSelectedPatternModal(p)}
                        onPracticePattern={(p) => {
                          const matchingProb = problems.find((prob) => prob.patternId === p.id);
                          if (matchingProb) setMentorProblemModal(matchingProb);
                          else setSelectedPatternModal(p);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PATTERN LIBRARY */}
          {activeTab === 'library' && (
            <div className="animate-in fade-in">
              <PatternList
                patterns={patterns}
                problems={problems}
                onOpenDetail={(p) => setSelectedPatternModal(p)}
                onPracticePattern={(p) => {
                  const matchingProb = problems.find((prob) => prob.patternId === p.id);
                  if (matchingProb) setMentorProblemModal(matchingProb);
                  else setSelectedPatternModal(p);
                }}
                searchQuery={searchQuery}
              />
            </div>
          )}

          {/* TAB 3: DECISION TREE MAP */}
          {activeTab === 'decision-tree' && (
            <div className="animate-in fade-in">
              <DecisionTreeView
                patterns={patterns}
                onSelectPattern={(p) => setSelectedPatternModal(p)}
              />
            </div>
          )}

          {/* TAB 4: PATTERN QUIZ */}
          {activeTab === 'quiz' && (
            <div className="animate-in fade-in">
              <QuizRunner
                problems={problems}
                patterns={patterns}
                onQuizCompleted={() => fetchData()}
              />
            </div>
          )}

          {/* TAB 5: AI PATTERN DETECTOR */}
          {activeTab === 'detector' && (
            <div className="animate-in fade-in">
              <DetectorView />
            </div>
          )}

          {/* TAB 6: ADMIN PANEL */}
          {activeTab === 'admin' && isAdminAllowed() && (
            <div className="animate-in fade-in">
              <AdminPanel
                patterns={patterns}
                problems={problems}
                auditLogs={auditLogs}
                onAddPattern={handleAddPattern}
                onAddProblem={handleAddProblem}
                onDeletePattern={handleDeletePattern}
                onDeleteProblem={handleDeleteProblem}
                onBulkImport={handleBulkImport}
              />
            </div>
          )}

          {/* TAB 7: LEARNING PROGRESS */}
          {(activeTab === 'progress' || activeTab === 'specs') && (
            <div className="animate-in fade-in">
              <LearningProgressCard
                patterns={patterns}
                problems={problems}
                spacedItems={spacedItems}
                localProgress={localProgress}
              />
            </div>
          )}
        </main>
      </div>

      {/* Pattern Detail Modal */}
      {selectedPatternModal && (
        <PatternDetailModal
          pattern={selectedPatternModal}
          problems={problems}
          onClose={() => setSelectedPatternModal(null)}
          onSelectProblem={(prob) => {
            setSelectedPatternModal(null);
            setMentorProblemModal(prob);
          }}
        />
      )}

      {/* Socratic AI Mentor Modal */}
      {mentorProblemModal && (
        <AIMentorModal
          problem={mentorProblemModal}
          onClose={() => setMentorProblemModal(null)}
        />
      )}
    </div>
  );
}

export default App;
