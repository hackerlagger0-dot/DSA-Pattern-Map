import { INITIAL_PATTERNS } from '../data/patterns';
import { INITIAL_PROBLEMS } from '../data/problems';
import { calculateSM2 } from '../lib/spacedRepetition';
import {
  AdminAuditLog,
  Pattern,
  Problem,
  QuizAttempt,
  SpacedRepetitionItem,
  UserProfile,
} from '../types';

class MemoryStorage {
  private patterns: Map<string, Pattern> = new Map();
  private problems: Map<string, Problem> = new Map();
  private spacedItems: Map<string, SpacedRepetitionItem> = new Map();
  private quizAttempts: QuizAttempt[] = [];
  private auditLogs: AdminAuditLog[] = [];
  private userProfile: UserProfile = {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'vc274577@gmail.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    streakDays: 7,
    lastActiveDate: new Date().toISOString().split('T')[0],
    points: 420,
    createdAt: '2026-01-01T00:00:00Z',
  };

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    INITIAL_PATTERNS.forEach((p) => this.patterns.set(p.id, { ...p }));
    INITIAL_PROBLEMS.forEach((prob) => {
      this.problems.set(prob.id, { ...prob });

      // Create initial spaced repetition items
      const todayStr = new Date().toISOString().split('T')[0];
      this.spacedItems.set(prob.id, {
        id: `sr-${prob.id}`,
        userId: 'usr-1',
        problemId: prob.id,
        repetition: 0,
        intervalDays: 1,
        easeFactor: 2.5,
        nextReviewDate: todayStr,
        history: [],
        masteryLevel: 'New',
      });
    });

    this.auditLogs.push({
      id: 'log-1',
      action: 'SEED_INITIALIZATION',
      entity: 'System',
      entityId: 'sys-1',
      actor: 'System Admin',
      timestamp: new Date().toISOString(),
      details: 'Initialized 15 classic DSA Patterns and 16 LeetCode Problems.',
    });
  }

  // User Profile
  public getUser(): UserProfile {
    return this.userProfile;
  }

  public updateUserRole(role: 'USER' | 'ADMIN'): UserProfile {
    this.userProfile.role = role;
    return this.userProfile;
  }

  // Patterns
  public getPatterns(): Pattern[] {
    return Array.from(this.patterns.values()).filter((p) => !p.isDeleted);
  }

  public getPatternById(id: string): Pattern | undefined {
    const p = this.patterns.get(id);
    return p && !p.isDeleted ? p : undefined;
  }

  public addPattern(pattern: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'>): Pattern {
    const id = `pat-${Date.now()}`;
    const newPat: Pattern = {
      ...pattern,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.patterns.set(id, newPat);
    this.addAuditLog('CREATE_PATTERN', 'Pattern', id, newPat.name);
    return newPat;
  }

  public updatePattern(id: string, updates: Partial<Pattern>): Pattern | undefined {
    const existing = this.patterns.get(id);
    if (!existing || existing.isDeleted) return undefined;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.patterns.set(id, updated);
    this.addAuditLog('UPDATE_PATTERN', 'Pattern', id, updated.name);
    return updated;
  }

  public deletePattern(id: string): boolean {
    const existing = this.patterns.get(id);
    if (!existing) return false;
    existing.isDeleted = true;
    this.patterns.set(id, existing);
    this.addAuditLog('SOFT_DELETE_PATTERN', 'Pattern', id, existing.name);
    return true;
  }

  // Problems
  public getProblems(): Problem[] {
    return Array.from(this.problems.values()).filter((p) => !p.isDeleted);
  }

  public getProblemById(id: string): Problem | undefined {
    const p = this.problems.get(id);
    return p && !p.isDeleted ? p : undefined;
  }

  public addProblem(prob: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>): Problem {
    const id = `prob-${Date.now()}`;
    const newProb: Problem = {
      ...prob,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.problems.set(id, newProb);

    // Add corresponding Spaced Repetition queue item
    const todayStr = new Date().toISOString().split('T')[0];
    this.spacedItems.set(id, {
      id: `sr-${id}`,
      userId: 'usr-1',
      problemId: id,
      repetition: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      nextReviewDate: todayStr,
      history: [],
      masteryLevel: 'New',
    });

    this.addAuditLog('CREATE_PROBLEM', 'Problem', id, newProb.title);
    return newProb;
  }

  public updateProblem(id: string, updates: Partial<Problem>): Problem | undefined {
    const existing = this.problems.get(id);
    if (!existing || existing.isDeleted) return undefined;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.problems.set(id, updated);
    this.addAuditLog('UPDATE_PROBLEM', 'Problem', id, updated.title);
    return updated;
  }

  public deleteProblem(id: string): boolean {
    const existing = this.problems.get(id);
    if (!existing) return false;
    existing.isDeleted = true;
    this.problems.set(id, existing);
    this.addAuditLog('SOFT_DELETE_PROBLEM', 'Problem', id, existing.title);
    return true;
  }

  // Spaced Repetition
  public getSpacedItems(): SpacedRepetitionItem[] {
    return Array.from(this.spacedItems.values());
  }

  public reviewSpacedItem(problemId: string, grade: number, timeTakenSeconds: number) {
    let item = this.spacedItems.get(problemId);
    if (!item) {
      item = {
        id: `sr-${problemId}`,
        userId: 'usr-1',
        problemId,
        repetition: 0,
        intervalDays: 1,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString().split('T')[0],
        history: [],
        masteryLevel: 'New',
      };
    }

    const sm2 = calculateSM2(
      grade,
      item.repetition,
      item.intervalDays,
      item.easeFactor
    );

    const updatedItem: SpacedRepetitionItem = {
      ...item,
      repetition: sm2.repetition,
      intervalDays: sm2.intervalDays,
      easeFactor: sm2.easeFactor,
      nextReviewDate: sm2.nextReviewDate,
      lastReviewedAt: new Date().toISOString(),
      masteryLevel: sm2.masteryLevel,
      history: [
        ...item.history,
        {
          date: new Date().toISOString(),
          rating: grade,
          timeTakenSeconds,
        },
      ],
    };

    this.spacedItems.set(problemId, updatedItem);
    this.userProfile.points += grade * 10;
    return updatedItem;
  }

  // Quiz
  public logQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): QuizAttempt {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `quiz-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    this.quizAttempts.push(newAttempt);
    this.userProfile.points += attempt.score * 15;
    return newAttempt;
  }

  public getQuizAttempts(): QuizAttempt[] {
    return this.quizAttempts;
  }

  // Audit Logs
  public getAuditLogs(): AdminAuditLog[] {
    return this.auditLogs;
  }

  private addAuditLog(action: string, entity: string, entityId: string, details?: string) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      action,
      entity,
      entityId,
      actor: this.userProfile.name,
      timestamp: new Date().toISOString(),
      details,
    });
  }

  // Bulk JSON Import
  public bulkImport(data: { patterns?: Pattern[]; problems?: Problem[] }) {
    let importedPatterns = 0;
    let importedProblems = 0;

    if (data.patterns && Array.isArray(data.patterns)) {
      data.patterns.forEach((p) => {
        if (p.name && p.category) {
          this.addPattern({
            slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
            name: p.name,
            category: p.category,
            difficulty: p.difficulty || 'Medium',
            description: p.description || '',
            whenToUse: p.whenToUse || [],
            keyInvariants: p.keyInvariants || [],
            commonTraps: p.commonTraps || [],
            timeComplexity: p.timeComplexity || 'O(N)',
            spaceComplexity: p.spaceComplexity || 'O(1)',
            prerequisites: p.prerequisites || [],
            codeTemplate: p.codeTemplate || { language: 'TypeScript', code: '// Template' },
            confusedWith: p.confusedWith || [],
          });
          importedPatterns++;
        }
      });
    }

    if (data.problems && Array.isArray(data.problems)) {
      data.problems.forEach((p) => {
        if (p.title && p.patternId) {
          this.addProblem({
            slug: p.slug || p.title.toLowerCase().replace(/\s+/g, '-'),
            title: p.title,
            leetcodeUrl: p.leetcodeUrl,
            difficulty: p.difficulty || 'Medium',
            patternId: p.patternId,
            patternName: p.patternName || 'General',
            statement: p.statement || '',
            constraints: p.constraints || [],
            examples: p.examples || [],
            patternTriggers: p.patternTriggers || [],
            commonWrongPatterns: p.commonWrongPatterns || [],
            hints: p.hints || [],
            solutionExplanation: p.solutionExplanation || '',
          });
          importedProblems++;
        }
      });
    }

    return { importedPatterns, importedProblems };
  }
}

export const storage = new MemoryStorage();
