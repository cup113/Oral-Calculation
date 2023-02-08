<script lang="ts" setup>
import { useRouter } from 'vue-router';

import useQuestionStore from '@/store/question';
import type { Milliseconds } from '@/util';

import Duration from '../assets/components/Duration.vue';
import QuestionDisplay from './report/QuestionDisplay.vue';

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

<template>
  <div class="report pt-2">
    <div class="my-4">
      <div class="text-2xl my-2">成绩单 - {{ title }}</div>
      <div class="report-item">
        <span>生成时间</span>
        <span>{{ generatedTimeDisplay }}</span>
      </div>
      <div class="report-item">
        <span>正确率</span>
        <span>{{ correctCnt }} / {{ totalQuestions }} ({{ correctRateDisplay }})</span>
      </div>
      <div class="report-item">
        <span>错误次数</span>
        <span>{{ wrongAnswerCnt }}</span>
      </div>
      <div class="report-item">
        <span>总计用时</span>
        <span><Duration class="ml-2" :duration="accumulatedDuration"></Duration></span>
      </div>
      <div class="report-item">
        <span>题均用时</span>
        <span><Duration class="ml-2" :duration="avgDuration"></Duration></span>
      </div>
    </div>
    <div
      class="mt-4 mx-12 flex flex-wrap content-center justify-center items-center gap-x-6 gap-y-2">
      <QuestionDisplay v-for="(question, i) in questions" :key="i" :question="question" :i="i">
      </QuestionDisplay>
    </div>
    <div class="mt-8">
      <button class="btn bg-gray-700 mr-4" type="button" @click="go_to_main_page">返回主页</button>
      <button class="btn bg-green-500" type="button" @click="go_to_share">分享</button>
    </div>
  </div>
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