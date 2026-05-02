<script lang="ts" setup>
import type { Question } from '@/question';
import type { Milliseconds } from '@/util';

const props = defineProps<{
  question: Question,
  num: number,
  durationDistribution: {
    min: Milliseconds,
    max: Milliseconds,
    slow: Milliseconds,
    fast: Milliseconds,
  }
}>();

const
  { slow: slowDur, fast: fastDur, min: minDur, max: maxDur } = props.durationDistribution,
  serialNum = props.num,
  duration = props.question.get_duration(),
  durationDisplay = (duration / 1000).toFixed(3) + 's',
  isCorrect = props.question.is_first_time_correct(),
  resultDisplay = isCorrect ? '✓' : props.question.wrongAnswers.size.toString(),
  isFast = duration <= fastDur,
  isSlow = duration >= slowDur,
  progressColorIndex = isFast ? 0 : (isCorrect ? (isSlow ? 2 : 1) : 3),
  ratio = 0.4 + 0.4 * (maxDur - duration + 1) / (maxDur - minDur + 2);

const colors = ['bg-cyan-400', 'bg-green-600', 'bg-orange-600', 'bg-red-500'];

</script>

<template>
  <div class="qs-item">
    <div class="qs-bar" :class="colors[progressColorIndex]" :style="{ '--ratio': ratio }"></div>
    <span class="qs-num">{{ serialNum }}</span>
    <span class="qs-duration">{{ durationDisplay }}</span>
    <span class="qs-result" :class="isCorrect ? 'qs-result-ok' : 'qs-result-ko'">{{ resultDisplay }}</span>
  </div>
</template>

<style lang="scss">
.qs-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
  margin-top: 0.125rem;
}

.qs-bar {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-sm);
  opacity: 0.35;
  width: calc(var(--ratio) * 100%);
  transition: width 0.4s ease;
}

.qs-num {
  width: 2rem;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--c-text-secondary);
  position: relative;
  z-index: 1;
}

.qs-duration {
  flex: 1;
  padding-left: 0.25rem;
  font-size: 0.8125rem;
  color: var(--c-text-secondary);
  position: relative;
  z-index: 1;
}

.qs-result {
  width: 2rem;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.qs-result-ok {
  color: var(--c-success);
}

.qs-result-ko {
  color: var(--c-error);
}
</style>
