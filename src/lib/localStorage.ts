import { SpacedRepetitionItem } from '../types';

const PROGRESS_STORAGE_KEY = 'dsa_pattern_map_progress_v1';
const SPACED_ITEMS_STORAGE_KEY = 'dsa_pattern_map_spaced_v1';

export interface LocalProgress {
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  points: number;
  solvedProblemIds: string[];
  masteredPatternIds: string[];
}

const DEFAULT_PROGRESS: LocalProgress = {
  streakDays: 7,
  lastActiveDate: new Date().toISOString().split('T')[0],
  points: 450,
  solvedProblemIds: ['prob-1', 'prob-2', 'prob-3', 'prob-4'],
  masteredPatternIds: ['pat-1', 'pat-2'],
};

export function getLocalProgress(): LocalProgress {
  try {
    const item = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      const today = new Date().toISOString().split('T')[0];
      
      let streak = parsed.streakDays ?? 1;
      const lastDate = parsed.lastActiveDate;

      if (lastDate) {
        const last = new Date(lastDate);
        const curr = new Date(today);
        const diffDays = Math.floor((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
        
        if (diffDays > 1) {
          streak = 1;
        }
      }

      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        streakDays: streak,
        lastActiveDate: today,
      };
    }
  } catch (e) {
    console.error('Failed to read local progress:', e);
  }
  return DEFAULT_PROGRESS;
}

export function saveLocalProgress(progress: Partial<LocalProgress>): LocalProgress {
  const current = getLocalProgress();
  const today = new Date().toISOString().split('T')[0];
  
  let streak = current.streakDays;
  if (current.lastActiveDate !== today) {
    const last = new Date(current.lastActiveDate);
    const curr = new Date(today);
    const diffDays = Math.floor((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  const updated: LocalProgress = {
    ...current,
    ...progress,
    streakDays: streak,
    lastActiveDate: today,
  };

  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save local progress:', e);
  }
  return updated;
}

export function getLocalSpacedItems(defaultItems: SpacedRepetitionItem[] = []): SpacedRepetitionItem[] {
  try {
    const item = localStorage.getItem(SPACED_ITEMS_STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read local spaced items:', e);
  }
  return defaultItems;
}

export function saveLocalSpacedItems(items: SpacedRepetitionItem[]): void {
  try {
    localStorage.setItem(SPACED_ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save local spaced items:', e);
  }
}
