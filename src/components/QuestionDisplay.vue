<script lang="ts" setup>
import type { Question } from '@/assets/question';

import Duration from './Duration.vue';

const props = defineProps<{
  question: Question,
  i: number
}>();

const
  number = props.i + 1,
  isCorrect = props.question.is_first_time_correct(),
  correctDisplay = isCorrect ? "✅" : "❌",
  problem = props.question.problem,
  duration = props.question.get_duration(),
  correctAnswer = props.question.correctAnswer,
  wrongAnswers = [...props.question.wrongAnswers];

</script>

<template lang="pug">
div.question.inline-grid.text-lg.border-2
  span.text-2xl.bg-blue-100 {{ number }}
  span.text-2xl(:class="isCorrect ? 'bg-green-100' : 'bg-red-100'") {{ correctDisplay }}
  span.break-keep.bg-cyan-100.px-1
    Duration(:duration="duration")
  span.bg-orange-100.px-1 {{ problem }}
  span.text-green-700.bg-green-100.px-1 {{ correctAnswer }}
  span.text-xs.text-red-700.bg-red-100.px-1
    span.block.w-full(v-for="wrongAnswer in wrongAnswers") {{ wrongAnswer }}
</template>

<style lang="scss">
.question {
  grid-template-areas:
    "number correct duration"
    "problem problem problem"
    "corAns corAns wrongAnswers";

  >span {
    @apply border-2 border-black -ml-0.5 -mt-0.5;

    &:nth-child(1) {
      grid-area: number;
      min-width: 1.5em;
    }

    &:nth-child(2) {
      grid-area: correct;
    }

    &:nth-child(3) {
      grid-area: duration;
    }

    &:nth-child(4) {
      grid-area: problem;
    }

    &:nth-child(5) {
      grid-area: corAns;
    }

    &:nth-child(6) {
      grid-area: wrongAnswers;
    }
  }
}
</style>