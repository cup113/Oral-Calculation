<script lang="ts" setup>
import { useRouter } from 'vue-router';

import useQuestionStore from '@/store/question';
import type { Milliseconds } from '@/assets/util';

import Duration from './Duration.vue';
import QuestionDisplay from './QuestionDisplay.vue';

const
  router = useRouter();

const {
  questions,
  questionProvider,
  correctCnt,
  accumulatedDuration,
  wrongAnswerCnt
} = useQuestionStore(); // These shouldn't be changed when reporting

if (questions.length === 0) {
  go_to_main_page();
}

const
  title: string = questionProvider.get_title(),
  generatedTime: Date = new Date(),
  generatedTimeDisplay = generatedTime.toLocaleString(),
  totalQuestions: number = questions.length,
  correctRate: number = correctCnt / (totalQuestions || 1),
  correctRateDisplay: string = (correctRate * 100).toFixed(1) + "%",
  avgDuration: Milliseconds = accumulatedDuration / (totalQuestions || 1);

function go_to_main_page() {
  router.push("/");
}

function go_to_share() {
  router.push("/report-share");
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
      span {{ correctCnt }} / {{ totalQuestions }} ({{ correctRateDisplay }})
    div.report-item
      span 错误次数
      span {{ wrongAnswerCnt }}
    div.report-item
      span 用时
      span
        Duration.mx-1(:duration="accumulatedDuration")
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
  div.mt-8
    button.btn.bg-gray-700.mr-4(type="button" @click="go_to_main_page") 返回主页
    button.btn.bg-green-500(type="button" @click="go_to_share") 分享
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