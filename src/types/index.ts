export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type PatternCategory =
  | 'Two Pointers & Sliding Window'
  | 'Binary Search & Fast Search'
  | 'Trees & Graphs (BFS/DFS)'
  | 'Heaps & Priority Queues'
  | 'Backtracking & Subsets'
  | 'Dynamic Programming'
  | 'LinkedList Manipulation'
  | 'Monotonic Stack & Queue'
  | 'Trie & Prefix Tree'
  | 'Union Find & Graph Algorithms'
  | 'Bit Manipulation & Math';

export type MasteryLevel = 'New' | 'Learning' | 'Reviewing' | 'Mastered';

export type Role = 'USER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  points: number;
  createdAt: string;
}

export interface Pattern {
  id: string;
  slug: string;
  name: string;
  category: PatternCategory;
  difficulty: Difficulty;
  description: string;
  whenToUse: string[];
  keyInvariants: string[];
  commonTraps: string[];
  timeComplexity: string;
  spaceComplexity: string;
  prerequisites: string[];
  codeTemplate: {
    language: string;
    code: string;
  };
  confusedWith: {
    patternName: string;
    difference: string;
  }[];
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  leetcodeUrl?: string;
  difficulty: Difficulty;
  patternId: string;
  patternName: string;
  statement: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  patternTriggers: string[];
  commonWrongPatterns: string[];
  hints: string[];
  solutionExplanation: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpacedRepetitionItem {
  id: string;
  userId: string;
  problemId: string;
  repetition: number;
  intervalDays: number; // Days until next review
  easeFactor: number; // SM-2 ease factor (default 2.5)
  nextReviewDate: string; // ISO String or YYYY-MM-DD
  lastReviewedAt?: string;
  history: {
    date: string;
    rating: number; // 0..5
    timeTakenSeconds: number;
  }[];
  masteryLevel: MasteryLevel;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  completedAt: string;
  answers: {
    problemId: string;
    selectedPatternId: string;
    correctPatternId: string;
    isCorrect: boolean;
    timeSeconds: number;
  }[];
}

export interface AIPatternDetectionResult {
  problemTitle?: string;
  mostLikelyPattern: string;
  confidenceScore: number; // 0 - 100
  secondaryPattern?: string;
  triggersFound: string[];
  confusedWith: {
    patternName: string;
    whyDistinct: string;
  }[];
  commonTraps: string[];
  timeComplexity: string;
  spaceComplexity: string;
  prerequisites: string[];
  suggestedTemplate: string;
  reasoning: string;
}

export interface MentorMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  hintLevel?: number;
}

export interface ActivityHeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  actor: string;
  timestamp: string;
  details?: string;
}
