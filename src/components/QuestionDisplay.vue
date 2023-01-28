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
  correctClass = isCorrect ? "correct" : "wrong",
  problem = props.question.problem,
  duration = props.question.get_duration(),
  correctAnswer = props.question.correctAnswer,
  wrongAnswersDisplay = [...props.question.wrongAnswers].join("\n");

</script>

<template lang="pug">
div.question
  span {{ number }}
  span(:class="correctClass") {{ correctDisplay }}
  span
    Duration(:duration="duration")
  span {{ problem }}
  span {{ correctAnswer }}
  span(v-text="wrongAnswersDisplay")
</template>

<style lang="scss">
@import 'bootstrap/scss/_functions.scss';

@import 'bootstrap/scss/_variables.scss';
@import 'bootstrap/scss/_mixins.scss';

.question {
  display: -ms-inline-grid;
  display: -moz-inline-grid;
  display: inline-grid;
  font-size: 1.25em;
  grid-template-areas:
    "number correct duration"
    "problem problem problem"
    "corAns corAns wrongAnswers";
  grid-template-columns: 3em 3em 8em;
  justify-content: center;
  align-content: center;
  border: 1px solid black;

  >span {
    border: 2px solid black;
    margin: -2px -2px 0 0;

    &:nth-child(1) {
      grid-area: number;
      font-size: 1.5em;
      background-color: $blue-100;
    }

    &:nth-child(2) {
      grid-area: correct;
      font-size: 1.5em;

      &.correct {
        background-color: $green-100;
      }

      &.wrong {
        background-color: $red-100;
      }
    }

    &:nth-child(3) {
      grid-area: duration;
      padding: 0.25em 0;
      background-color: $cyan-100;
    }

    &:nth-child(4) {
      grid-area: problem;
      background-color: $orange-100;
    }

    &:nth-child(5) {
      grid-area: corAns;
      color: $success;
      background-color: $green-100;
    }

    &:nth-child(6) {
      grid-area: wrongAnswers;
      color: $red;
      background-color: $red-100;
    }
  }
}
</style>