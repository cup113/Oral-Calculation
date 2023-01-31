<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import useStore from '@/store/index';
import type { Milliseconds } from '@/assets/question';

import Duration from './Duration.vue';
import QuestionDisplay from './QuestionDisplay.vue';

const
  router = useRouter();

const { questions, questionProvider } = useStore(); // These shouldn't be changed when reporting

if (questions.length === 0) {
  go_to_main_page();
}

const
  title: string = questionProvider.get_title(),
  generatedTime: Date = new Date(),
  generatedTimeDisplay = generatedTime.toLocaleString(),
  totalQuestions: number = questions.length,
  correctQuestions: number = questions.reduce(
    (pre, cur) => pre + (cur.is_first_time_correct() ? 1 : 0),
    0
  ),
  correctRate: number = correctQuestions / (totalQuestions || 1),
  correctRateDisplay: string = (correctRate * 100).toFixed(1) + "%",
  totalDuration: Milliseconds = questions.reduce(
    (pre, cur) => pre + cur.get_duration(),
    0
  ),
  avgDuration: Milliseconds = totalDuration / (totalQuestions || 1),
  wrongAnswers = questions.reduce(
    (pre, cur) => pre + cur.wrongAnswers.size,
    0
  );

function go_to_main_page() {
  return router.push("/");
}

</script>

<template lang="pug">
div.report.pt-2
  div.my-4
    div.text-2xl.my-2 成绩单 - {{ title }}
    div.report-item
      span 生成时间
      span {{ generatedTimeDisplay }}
    div.report-item
      span 正确率
      span {{ correctQuestions }} / {{ totalQuestions }} ({{ correctRateDisplay }})
    div.report-item
      span 错误次数
      span {{ wrongAnswers }}
    div.report-item
      span 用时
      span
        Duration.mx-1(:duration="totalDuration")
        | ( 题均
        Duration.mx-1(:duration="avgDuration")
        | )
  div.mt-4.mx-12.flex.flex-wrap.content-center.justify-center.items-center.gap-x-6.gap-y-2
    QuestionDisplay(
      v-for="(question, i) in questions"
      :key="i"
      :question="question"
      :i="i"
    )
</template>

<style lang="scss">
.report .report-item {
  @apply w-max mx-auto bg-gray-50 text-lg flex;

  >span {
    @apply inline-block border-2 border-black -ml-0.5 -mt-0.5;

    &:nth-child(1) {
      @apply w-24;
    }

    &:nth-child(2) {
      @apply w-64 text-blue-700;
    }
  }
}
</style>