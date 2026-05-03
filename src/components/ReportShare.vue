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
    qr.addData(`${location.protocol}//${location.host}${location.pathname}`);
    qr.make();
    return qr.createImgTag();
  })();

</script>

<template>
  <div class="share-page">
    <div class="share-card">
      <div class="share-header">
        <div class="share-title">口算练习 · {{ title }}</div>
        <div class="share-date">{{ generatedDisplay }}</div>
      </div>

      <div class="share-overview">
        <div class="share-overview-item">
          <div class="share-ov-value" :class="correctRatio > 0.84 ? 'text-green-600' : 'text-amber-600'">
            {{ correctRatioDisplay }}
          </div>
          <div class="share-ov-label">正确率</div>
        </div>
        <div class="share-overview-item">
          <div class="share-ov-value">{{ questions.length }}</div>
          <div class="share-ov-label">题数</div>
        </div>
        <div class="share-overview-item">
          <div class="share-ov-value">{{ avgDuration }}</div>
          <div class="share-ov-label">题均时长</div>
        </div>
      </div>
    </div>

    <div class="share-card">
      <div class="share-section-title">题目详情</div>
      <div class="share-list-header">
        <span class="w-8 text-center">#</span>
        <span class="flex-1">用时</span>
        <span class="w-8 text-center">结果</span>
      </div>
      <QuestionNew v-for="(question, i) in questions" :key="`${i}-${question.problem}`"
        :question="question" :num="i + 1" :duration-distribution="durationDistribution" />
    </div>

    <div class="share-card share-footer-card">
      <div class="share-brand">
        <div>速算练习</div>
        <div class="share-brand-en">Oral Calculation</div>
      </div>
      <div v-html="qrImg" class="share-qr"></div>
    </div>

    <div class="share-back">
      <button class="btn-secondary" type="button" @click="go_to_main_page">返回主页</button>
    </div>
  </div>
</template>

<style>
.share-page {
  width: 100%;
  max-width: 400px;
}

.share-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
}

.share-header {
  text-align: center;
  margin-bottom: 1rem;
}

.share-title {
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--c-text);
}

.share-date {
  font-size: 0.8125rem;
  color: var(--c-text-muted);
  margin-top: 0.25rem;
}

.share-overview {
  display: flex;
  justify-content: space-between;
}

.share-overview-item {
  text-align: center;
  flex: 1;
}

.share-ov-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: fantasy, sans-serif;
  color: var(--c-text);
}

.share-ov-label {
  font-size: 0.75rem;
  color: var(--c-text-muted);
  margin-top: 0.125rem;
}

.share-section-title {
  font-size: 1.0625rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--c-text);
}

.share-list-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0;
  font-size: 0.8125rem;
  color: var(--c-text-muted);
  border-bottom: 1px solid var(--c-border);
  margin-bottom: 0.25rem;
}

.share-footer-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.share-brand {
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--c-text-secondary);
}

.share-brand-en {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--c-text-muted);
}

.share-qr {
  :deep(img) {
    width: 64px;
    height: 64px;
  }
}

.share-back {
  text-align: center;
  margin-top: 0.5rem;
}
</style>
