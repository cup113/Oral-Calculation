<script lang="ts" setup>
import { useRouter } from 'vue-router';
import qrcode from 'qrcode-generator'

import useQuestionStore from '@/store/question';
import QuestionNew from './report/QuestionShareDisplay.vue';

const router = useRouter();

const { questions, questionProvider, correctCnt, accumulatedDuration } = useQuestionStore();

function go_to_main_page() {
  router.push("/");
}

if (questions.length === 0) {
  go_to_main_page();
}

const
  title = questionProvider.get_title(),
  generatedDisplay = (new Date()).toLocaleString(),
  correctRatio = correctCnt / questions.length,
  correctRatioDisplay = `${(correctRatio * 100).toFixed(0)}%`,
  durationArray = (() => {
    let arr = questions.map(q => q.get_duration());
    arr.sort((a, b) => a - b);
    return arr;
  })(),
  avgDuration = (accumulatedDuration / questions.length / 1000).toFixed(3) + "s",
  [fastDuration, slowDuration] = (() => {
    if (durationArray.length < 5)
      return [durationArray[0] - 1, durationArray[durationArray.length - 1] + 1];
    let oneFifth = Math.floor(durationArray.length / 5);
    return [
      durationArray[oneFifth - 1],
      durationArray[durationArray.length - oneFifth]
    ];
  })(),
  durationDistribution = Object.freeze({
    min: durationArray[0],
    max: durationArray[durationArray.length - 1],
    fast: fastDuration,
    slow: slowDuration
  }),
  qrImg = (() => {
    const qr = qrcode(0, 'M');
    qr.addData(location.host + location.pathname);
    qr.make();
    return qr.createImgTag();
  })();

</script>

<template>
  <div class="report-share absolute w-full h-full bg-white overflow-y-auto">
    <div class="w-80 bg-gray-100 mx-auto px-2 py-1 my-2">
      <div class="report-card">
        <div class="text-gray-500 font-bold">口算练习 · {{ title }}</div>
        <div class="text-gray-400 text-sm">{{ generatedDisplay }}</div>
        <hr class="my-2">
        <div class="overview-line flex justify-between">
          <div class="text-left">
            <div :class="correctRatio > 0.84 ? 'text-green-800' : 'text-blue-700'">
              {{ correctRatioDisplay }}
            </div>
            <div>正确率</div>
          </div>
          <div class="text-center">
            <div>{{ questions.length }}</div>
            <div>题数</div>
          </div>
          <div class="text-right">
            <div>{{ avgDuration }}</div>
            <div>题均时长</div>
          </div>
        </div>
      </div>
      <div class="report-card">
        <div class="text-lg">题目详情</div>
        <div class="text-gray-500 flex gap-2 text-sm">
          <span class="w-8 text-center">编号</span>
          <span class="grow">用时</span>
          <span class="w-8 text-center">结果</span>
        </div>
        <QuestionNew v-for="(question, i) in questions" :key="`${i}-${question.problem}`"
          :question="question" :num="i + 1" :duration-distribution="durationDistribution">
        </QuestionNew>
      </div>
      <div class="report-card flex items-center justify-between">
        <div class="text-center text-gray-500">
          <div>速算练习</div>
          <div>Oral Calculation</div>
        </div>
        <div v-html="qrImg"></div>
      </div>
    </div>
    <div>
      <button class="btn bg-gray-600 my-4" type="button" @click="go_to_main_page">返回主页</button>
    </div>
  </div>
</template>

<style lang="scss">
.report-share {
  z-index: 1;

  .overview-line>div {
    >div:nth-child(1) {
      @apply text-2xl;
      font-family: fantasy, sans-serif;
    }

    >div:nth-child(2) {
      @apply text-sm text-gray-600;
    }
  }

  .report-card {
    @apply bg-white my-2 text-left px-2 py-2;
  }
}
</style>
