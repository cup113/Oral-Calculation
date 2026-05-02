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
} = useQuestionStore();

if (questions.length === 0) {
  go_to_main_page();
}

document.title = '口算练习 | 成绩单';

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
  <div class="report-page">
    <div class="report-card">
      <h1 class="report-title">成绩单</h1>
      <p class="report-subtitle">{{ title }}</p>

      <p class="report-timestamp">{{ generatedTimeDisplay }}</p>

      <div class="report-grid">
        <div class="report-stat">
          <span class="report-stat-value report-stat-correct">{{ correctRateDisplay }}</span>
          <span class="report-stat-label">正确率</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-value">{{ correctCnt }} / {{ totalQuestions }}</span>
          <span class="report-stat-label">正确题数</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-value report-stat-error">{{ wrongAnswerCnt }}</span>
          <span class="report-stat-label">错误次数</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-value">
            <Duration :duration="accumulatedDuration" />
          </span>
          <span class="report-stat-label">总计用时</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-value">
            <Duration :duration="avgDuration" />
          </span>
          <span class="report-stat-label">题均用时</span>
        </div>
      </div>
    </div>

    <div class="report-questions">
      <QuestionDisplay v-for="(question, i) in questions" :key="i" :question="question" :i="i" />
    </div>

    <div class="report-actions">
      <button class="btn-secondary" type="button" @click="go_to_main_page">返回主页</button>
      <button class="btn-primary" type="button" @click="go_to_share">分享</button>
    </div>
  </div>
</template>

<style lang="scss">
.report-page {
  width: 100%;
  max-width: 640px;
}

.report-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
}

.report-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: var(--c-text);
}

.report-subtitle {
  text-align: center;
  font-size: 0.875rem;
  color: var(--c-text-secondary);
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
}

.report-timestamp {
  text-align: center;
  font-size: 0.8125rem;
  color: var(--c-text-muted);
  margin-bottom: 1rem;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.report-stat {
  text-align: center;
  padding: 0.75rem 0.5rem;
  background: var(--c-bg);
  border-radius: var(--radius-sm);
}

.report-stat-value {
  display: block;
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--c-text);
}

.report-stat-value.report-stat-correct {
  color: var(--c-success);
}

.report-stat-value.report-stat-error {
  color: var(--c-error);
}

.report-stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--c-text-muted);
  margin-top: 0.125rem;
}

.report-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.report-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}
</style>
