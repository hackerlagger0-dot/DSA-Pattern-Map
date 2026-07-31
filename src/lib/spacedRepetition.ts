import { MasteryLevel, SpacedRepetitionItem } from '../types';

export function calculateSM2(
  grade: number, // 0 to 5
  previousRepetition: number,
  previousInterval: number,
  previousEaseFactor: number
) {
  let repetition = previousRepetition;
  let interval = previousInterval;
  let easeFactor = previousEaseFactor;

  // Grade must be 0..5
  const clampedGrade = Math.max(0, Math.min(5, Math.round(grade)));

  if (clampedGrade >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(previousInterval * previousEaseFactor);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor =
    easeFactor + (0.1 - (5 - clampedGrade) * (0.08 + (5 - clampedGrade) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate next review date
  const now = new Date();
  const nextDate = new Date(now.valueOf() + interval * 24 * 60 * 60 * 1000);
  const nextReviewDate = nextDate.toISOString().split('T')[0];

  let masteryLevel: MasteryLevel = 'New';
  if (repetition >= 4) {
    masteryLevel = 'Mastered';
  } else if (repetition >= 2) {
    masteryLevel = 'Reviewing';
  } else if (repetition >= 1) {
    masteryLevel = 'Learning';
  }

  return {
    repetition,
    intervalDays: interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewDate,
    masteryLevel,
  };
}

export function isItemDue(item: SpacedRepetitionItem): boolean {
  const todayStr = new Date().toISOString().split('T')[0];
  return item.nextReviewDate <= todayStr;
}

export function formatInterval(days: number): string {
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month' : `${months} months`;
}
