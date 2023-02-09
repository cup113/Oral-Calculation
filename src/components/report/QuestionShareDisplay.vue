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

</script>

<template>
  <div class="question-share-item rounded-xl my-1 flex relative">
    <div
      class="bar absolute rounded-xl h-full"
      :class="['bg-cyan-400', 'bg-green-600', 'bg-orange-600', 'bg-red-500'][progressColorIndex]"
      :style="{ '--ratio': ratio }">
    </div>
    <span class="w-8 text-center text-white z-0">{{ serialNum }}</span>
    <span class="grow pl-2 text-white z-0">{{ durationDisplay }}</span>
    <span class="w-8 text-center font-bold"
      :class="isCorrect ? 'text-green-500' : 'text-red-700'">{{ resultDisplay }}</span>
  </div>
</template>

<style lang="scss">
.question-share-item {
  >.bar {
    width: calc(var(--ratio) * 100%);
  }
}
</style>
