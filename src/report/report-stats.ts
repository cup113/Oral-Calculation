import type { Milliseconds } from '@/util';

export interface DurationDistribution {
  readonly min: Milliseconds;
  readonly max: Milliseconds;
  readonly fast: Milliseconds;
  readonly slow: Milliseconds;
}

export function computeCorrectRatio(correctCount: number, totalCount: number): number {
  return correctCount / totalCount;
}

export function formatPercentage(ratio: number): string {
  return `${(ratio * 100).toFixed(0)}%`;
}

export function mapAndSortDurations(questions: { get_duration(): Milliseconds }[]): Milliseconds[] {
  const arr = questions.map(q => q.get_duration());
  arr.sort((a, b) => a - b);
  return arr;
}

export function computeDurationPercentiles(sortedDurations: Milliseconds[]): [Milliseconds, Milliseconds] {
  if (sortedDurations.length < 5)
    return [sortedDurations[0] - 1, sortedDurations[sortedDurations.length - 1] + 1];
  const oneFifth = Math.floor(sortedDurations.length / 5);
  return [
    sortedDurations[oneFifth - 1],
    sortedDurations[sortedDurations.length - oneFifth]
  ];
}

export function createDurationDistribution(
  sortedDurations: Milliseconds[],
  fast: Milliseconds,
  slow: Milliseconds,
): DurationDistribution {
  return Object.freeze({
    min: sortedDurations[0],
    max: sortedDurations[sortedDurations.length - 1],
    fast,
    slow,
  });
}

export function formatAverageDuration(totalMs: Milliseconds, count: number): string {
  return `${(totalMs / count / 1000).toFixed(3)}s`;
}

export function formatDuration(ms: Milliseconds): string {
  return `${(ms / 1000).toFixed(3)}s`;
}

export function formatResult(isCorrect: boolean, wrongCount: number): string {
  return isCorrect ? '✓' : wrongCount.toString();
}

export function computeProgressColorIndex(isFast: boolean, isCorrect: boolean, isSlow: boolean): number {
  return isFast ? 0 : (isCorrect ? (isSlow ? 2 : 1) : 3);
}

export function computeDurationBarRatio(
  duration: Milliseconds,
  minDur: Milliseconds,
  maxDur: Milliseconds,
): number {
  return 0.4 + 0.4 * (maxDur - duration + 1) / (maxDur - minDur + 2);
}
