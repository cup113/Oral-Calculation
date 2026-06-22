<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import domtoimage from 'dom-to-image-more';
import qrcode from 'qrcode-generator';

import useQuestionStore from '@/store/question';

import { useReportStats } from '@/report/useReportStats';

import Duration from '../assets/components/Duration.vue';
import QuestionDisplay from './report/QuestionDisplay.vue';
import QuestionShareDisplay from './report/QuestionShareDisplay.vue';

const router = useRouter();

const {
  questions,
  questionProvider,
  correctCnt,
  wrongAnswerCnt,
  accumulatedDuration,
} = useQuestionStore();

if (questions.length === 0) {
  go_to_main_page();
}

document.title = '口算练习 | 成绩单';

const
  title = questionProvider.get_title(),
  generatedTime = new Date(),
  generatedTimeDisplay = generatedTime.toLocaleString();

const stats = useReportStats(questions, correctCnt, accumulatedDuration);

const activeFilter = ref<'all' | 'correct' | 'wrong'>('all');

const filteredQuestions = computed(() => {
  if (activeFilter.value === 'all') return questions;
  return questions.filter(q =>
    activeFilter.value === 'correct'
      ? q.is_first_time_correct()
      : !q.is_first_time_correct()
  );
});

const showShareModal = ref(false);

function go_to_main_page() {
  router.push("/");
}

function open_share_modal() {
  showShareModal.value = true;
}

function close_share_modal() {
  showShareModal.value = false;
}

const shareCardRef = ref<HTMLElement | null>(null);
const isCapturing = ref(false);

async function save_share_card() {
  if (!shareCardRef.value) return;
  isCapturing.value = true;
  try {
    await new Promise(r => setTimeout(r, 200));
    const blob = await domtoimage.toBlob(shareCardRef.value, {
      bgcolor: '#ffffff',
    });
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `口算成绩_${generatedTime.getTime()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  } finally {
    isCapturing.value = false;
  }
}

// share card data (mirrors old ReportShare)
const
  correctRatioDisplay = stats.correctRatioDisplay.value,
  totalQuestions = stats.totalQuestions.value,
  avgDurationDisplay = stats.avgDurationDisplay.value,
  durationDistribution = stats.durationDistribution.value,
  qrImg = (() => {
    const qr = qrcode(0, 'M');
    qr.addData(`${location.protocol}//${location.host}${location.pathname}`);
    qr.make();
    return qr.createImgTag();
  })();

</script>

<template>
  <div class="report-page">
    <div class="report-card">
      <h1 class="report-title">成绩单</h1>
      <p class="report-subtitle">{{ title }}</p>

      <p class="report-timestamp">{{ generatedTimeDisplay }}</p>

      <div class="report-grid">
        <div class="report-stat">
          <span class="report-stat-value report-stat-correct">{{ correctRatioDisplay }}</span>
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
            <Duration :duration="stats.avgDuration.value" />
          </span>
          <span class="report-stat-label">题均用时</span>
        </div>
      </div>
    </div>

    <div class="report-filter">
      <button
        v-for="tab in ([
          { key: 'all', label: '全部' },
          { key: 'correct', label: '正确' },
          { key: 'wrong', label: '错误' },
        ] as const)"
        :key="tab.key"
        class="filter-tab"
        :class="{ 'filter-tab-active': activeFilter === tab.key }"
        @click="activeFilter = tab.key"
      >{{ tab.label }}</button>
    </div>

    <div class="report-table-wrap">
      <table class="report-table">
        <thead>
          <tr>
            <th class="th-num">#</th>
            <th class="th-problem">题目</th>
            <th class="th-answer">你的作答</th>
            <th class="th-correct">正确答案</th>
            <th class="th-duration">用时</th>
            <th class="th-status">状态</th>
          </tr>
        </thead>
        <tbody>
          <QuestionDisplay
            v-for="(question, i) in filteredQuestions"
            :key="i"
            :question="question"
            :i="i"
          />
        </tbody>
      </table>
    </div>

    <div class="report-actions">
      <button class="btn-secondary" type="button" @click="go_to_main_page" data-umami-event="end-return">返回主页</button>
      <button class="btn-primary" type="button" @click="open_share_modal" data-umami-event="end-share">📷 截图分享</button>
    </div>

    <!-- Share Modal -->
    <Teleport to="body">
      <div v-if="showShareModal" class="share-overlay" @click.self="close_share_modal">
        <div class="share-modal">
          <div class="share-modal-scroll">
            <div ref="shareCardRef" class="share-card">
              <div class="share-header">
                <div class="share-title">口算练习 · {{ title }}</div>
                <div class="share-date">{{ generatedTimeDisplay }}</div>
              </div>

              <div class="share-overview">
                <div class="share-overview-item">
                  <div class="share-ov-value" :class="stats.correctRatio.value > 0.84 ? 'text-green-600' : 'text-amber-600'">
                    {{ correctRatioDisplay }}
                  </div>
                  <div class="share-ov-label">正确率</div>
                </div>
                <div class="share-overview-item">
                  <div class="share-ov-value">{{ totalQuestions }}</div>
                  <div class="share-ov-label">题数</div>
                </div>
                <div class="share-overview-item">
                  <div class="share-ov-value">{{ avgDurationDisplay }}</div>
                  <div class="share-ov-label">题均时长</div>
                </div>
              </div>

              <div class="share-section-title">题目详情</div>
              <div class="share-list-header">
                <span class="w-8 text-center">#</span>
                <span class="flex-1">用时</span>
                <span class="w-8 text-center">结果</span>
              </div>

              <QuestionShareDisplay
                v-for="(question, i) in questions"
                :key="`${i}-${question.problem}`"
                :question="question"
                :num="i + 1"
                :duration-distribution="durationDistribution"
              />

              <div class="share-footer-card">
                <div class="share-brand">
                  <div>速算练习</div>
                  <div class="share-brand-en">Oral Calculation</div>
                </div>
                <div v-html="qrImg" class="share-qr"></div>
              </div>
            </div>
          </div>

          <div class="share-modal-actions">
            <button
              class="btn-primary"
              type="button"
              :disabled="isCapturing"
              @click="save_share_card"
            >{{ isCapturing ? '生成中…' : '💾 保存图片' }}</button>
            <button class="btn-secondary" type="button" @click="close_share_modal">关闭</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
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

/* Filter tabs */
.report-filter {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.filter-tab {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: var(--c-surface);
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.filter-tab:hover {
  background: var(--c-bg);
  color: var(--c-text);
}

.filter-tab-active {
  background: var(--c-primary);
  color: white;
  border-color: var(--c-primary);
}

.filter-tab-active:hover {
  background: var(--c-primary-hover);
}

/* Question table */
.report-table-wrap {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.report-table th {
  padding: 0.5rem 0.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  color: var(--c-text-muted);
  background: var(--c-bg);
  border-bottom: 1px solid var(--c-border);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.th-num,
.th-status {
  text-align: center;
  width: 2rem;
}

.th-duration {
  white-space: nowrap;
}

.report-table td {
  border-bottom: 1px solid var(--c-border);
}

.report-table tbody tr:last-child td {
  border-bottom: none;
}

/* Action buttons */
.report-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

/* Share modal overlay */
.share-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.share-modal {
  background: var(--c-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 420px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.share-modal-scroll {
  overflow-y: auto;
  padding: 1.25rem;
}

.share-card {
  background: #ffffff;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 1.25rem;
}

.share-header {
  text-align: center;
  margin-bottom: 1rem;
}

.share-title {
  font-weight: 700;
  font-size: 1.125rem;
  color: #0f172a;
}

.share-date {
  font-size: 0.8125rem;
  color: #64748b;
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
  color: #0f172a;
}

.share-ov-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.125rem;
}

.share-section-title {
  font-size: 1.0625rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  margin-top: 1rem;
  color: #0f172a;
}

.share-list-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0;
  font-size: 0.8125rem;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 0.25rem;
}

.share-footer-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.share-brand {
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #64748b;
}

.share-brand-en {
  font-size: 0.75rem;
  font-weight: 400;
  color: #94a3b8;
}

.share-qr :deep(img) {
  width: 64px;
  height: 64px;
}

.share-modal-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--c-border);
  justify-content: center;
}
</style>
