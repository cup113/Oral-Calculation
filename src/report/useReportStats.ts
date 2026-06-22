import type { Question } from '@/question';
import type { Milliseconds } from '@/util';
import { computed } from 'vue';
import {
  computeCorrectRatio,
  formatPercentage,
  mapAndSortDurations,
  computeDurationPercentiles,
  createDurationDistribution,
  formatAverageDuration,
} from './report-stats';

export interface ReportStats {
  totalQuestions: number;
  correctCnt: number;
  accumulatedDuration: Milliseconds;
  correctRatio: number;
  correctRatioDisplay: string;
  avgDuration: Milliseconds;
  avgDurationDisplay: string;
  sortedDurations: Milliseconds[];
  fastDuration: Milliseconds;
  slowDuration: Milliseconds;
  durationDistribution: {
    min: Milliseconds;
    max: Milliseconds;
    slow: Milliseconds;
    fast: Milliseconds;
  };
}

export function useReportStats(
  questions: Question[],
  correctCnt: number,
  accumulatedDuration: Milliseconds,
) {
  const totalQuestions = computed(() => questions.length);

  const correctRatio = computed(() =>
    computeCorrectRatio(correctCnt, totalQuestions.value)
  );

  const correctRatioDisplay = computed(() =>
    formatPercentage(correctRatio.value)
  );

  const avgDuration = computed(() =>
    totalQuestions.value > 0 ? accumulatedDuration / totalQuestions.value : 0
  );

  const avgDurationDisplay = computed(() =>
    formatAverageDuration(accumulatedDuration, totalQuestions.value || 1)
  );

  const sortedDurations = computed(() =>
    mapAndSortDurations(questions)
  );

  const durationPercentiles = computed(() =>
    sortedDurations.value.length > 0
      ? computeDurationPercentiles(sortedDurations.value)
      : [0, 0] as [Milliseconds, Milliseconds]
  );

  const fastDuration = computed(() => durationPercentiles.value[0]);
  const slowDuration = computed(() => durationPercentiles.value[1]);

  const durationDistribution = computed(() =>
    sortedDurations.value.length > 0
      ? createDurationDistribution(
          sortedDurations.value,
          fastDuration.value,
          slowDuration.value,
        )
      : { min: 0, max: 0, fast: 0, slow: 0 }
  );

  return {
    totalQuestions,
    correctRatio,
    correctRatioDisplay,
    avgDuration,
    avgDurationDisplay,
    sortedDurations,
    fastDuration,
    slowDuration,
    durationDistribution,
  };
}

export type UseReportStatsReturn = ReturnType<typeof useReportStats>;
