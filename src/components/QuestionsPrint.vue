<script lang="ts" setup>
import { ref, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';

import useQuestionStore from '@/store/question';
import { formatProblems, formatAnswers, generatePrintId, chunkArray } from '@/util';

const router = useRouter();

document.title = '口算练习 | 打印';

const { reset_questions, loaded, questionProvider } = useQuestionStore();
const questions = (() => {
  if (!loaded)
    router.back();
  reset_questions();
  return useQuestionStore().questions;
})();

const enum PrintStatus {
  Ready = 0,
  OnPrintProblems = 1,
  OnPrintAnswers = 2
}

const
  title = questionProvider.get_title(),
  today = new Date().toLocaleDateString(),
  printId = generatePrintId(),
  showPrintId = ref(true),
  problems = formatProblems(questions),
  answers = formatAnswers(questions),
  colCnt = ref(2),
  printStatus = ref(PrintStatus.Ready),
  displaySource = computed(() => [problems, problems, answers][printStatus.value]),
  rows = computed(() => chunkArray(displaySource.value, colCnt.value));

function go_back() {
  router.push("/");
}

function print_problems() {
  printStatus.value = PrintStatus.OnPrintProblems;
  nextTick(() => window.print());
}

function print_answers() {
  printStatus.value = PrintStatus.OnPrintAnswers;
  nextTick(() => window.print());
}

function set_cols(val: number) {
  colCnt.value = val;
}

</script>

<template>
  <div class="print-page">
    <div class="print-toolbar">
      <div class="print-toolbar-group">
        <button class="btn-ghost" @click="go_back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          返回
        </button>
        <button class="btn-primary" @click="print_problems">打印题目</button>
        <button class="btn-primary" @click="print_answers">打印答案</button>
      </div>
      <div class="print-toolbar-group">
        <div class="print-cols-setting">
          <label class="print-cols-label">列数</label>
          <div class="quick-btns">
            <button type="button" class="quick-btn" :class="{ active: colCnt === 1 }" @click="set_cols(1)">1</button>
            <button type="button" class="quick-btn" :class="{ active: colCnt === 2 }" @click="set_cols(2)">2</button>
            <button type="button" class="quick-btn" :class="{ active: colCnt === 3 }" @click="set_cols(3)">3</button>
            <button type="button" class="quick-btn" :class="{ active: colCnt === 4 }" @click="set_cols(4)">4</button>
          </div>
        </div>
        <label class="toggle-switch print-id-toggle" :class="{ on: showPrintId }" @click="showPrintId = !showPrintId">
          <div class="toggle-track">
            <div class="toggle-thumb"></div>
          </div>
          <span class="toggle-label">编号</span>
        </label>
      </div>
    </div>
    <div class="print-tips">
      <p>Windows 可用 Microsoft Print to PDF 打印。若表格异常扩大请缩小列数。</p>
      <p>打印题目和答案可设置不同列数。</p>
    </div>
    <table class="print-table">
      <thead>
        <tr>
          <th class="print-table-title" :colspan="colCnt">
            <span>{{ title }}</span>
            <span v-if="printStatus === PrintStatus.OnPrintAnswers">&nbsp;- 答案</span>
            <div v-if="showPrintId" class="print-table-id">{{ today }} · {{ printId }}</div>
          </th>
        </tr>
        <tr class="print-table-spacer"></tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="i">
          <td v-for="(item, j) in row" :key="`${i}-${j}`" class="print-cell">{{ item }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.print-page {
  width: 100%;
  background: white;
}

.print-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.print-toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.print-toolbar-group .btn-ghost {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.print-cols-setting {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.print-cols-label {
  font-size: 0.875rem;
  color: var(--c-text-secondary);
}

.quick-btns {
  display: flex;
  gap: 0.25rem;
}

.quick-btn {
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-bg);
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1;
}

.quick-btn:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.quick-btn.active {
  border-color: var(--c-primary);
  background: var(--c-primary);
  color: #fff;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.toggle-track {
  position: relative;
  width: 2.25rem;
  height: 1.25rem;
  background: var(--c-border);
  border-radius: 0.625rem;
  transition: background 0.2s;
}

.toggle-thumb {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1rem;
  height: 1rem;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.toggle-switch.on .toggle-track {
  background: var(--c-primary);
}

.toggle-switch.on .toggle-track .toggle-thumb {
  transform: translateX(1rem);
}

.toggle-label {
  font-size: 0.8125rem;
  color: var(--c-text-secondary);
}

.print-tips {
  font-size: 0.8125rem;
  color: var(--c-text-muted);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.print-table {
  margin: 0 auto;
  border-collapse: collapse;
  width: 180mm;
  font-size: 5mm;
}

.print-table-title {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  padding-bottom: 0.5rem;
}

.print-table-id {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--c-text-muted);
  margin-top: 0.125rem;
}

.print-table-spacer {
  height: 0.5rem;
}

.print-cell {
  padding: 0.125rem 0.5rem;
  white-space: nowrap;
  overflow: visible;
}

@media print {
  @page {
    size: 210mm 297mm portrait;
    margin: 15mm;
  }

  .print-toolbar,
  .print-tips {
    display: none;
  }

  .print-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
  }
}
</style>
