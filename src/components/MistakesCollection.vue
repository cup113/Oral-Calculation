<script lang="ts" setup>
import { useRouter } from 'vue-router';
import Message from 'vue-m-message';
import JsFileDownloader from 'js-file-downloader';

import useMistakesStore from '@/store/mistakes';

document.title = '口算练习 | 错题本';

const router = useRouter();

const { get_mistakes, clear_mistakes } = useMistakesStore();

const mistakes = get_mistakes();

function go_to_main_page() {
  router.push("/");
}

function clear_all() {
  if (confirm("确认要清空错题本吗？这会丢失所有错题数据。")) {
    clear_mistakes();
    go_to_main_page();
  }
}

function export_all() {
  let fileUrl = URL.createObjectURL(new Blob([JSON.stringify(mistakes, undefined, 2)]));
  new JsFileDownloader({
    url: fileUrl,
    autoStart: true,
    contentType: "Application/json",
    filename: `oral-calculation-mistakes-${(new Date()).getTime()}.json`,
  }).then(() => {
    URL.revokeObjectURL(fileUrl);
  }, reason => {
    URL.revokeObjectURL(fileUrl);
    Message.warning("导出失败: " + (reason ?? "未知原因").toString());
  });
  Message.info("正在导出中……请等待……", {
    duration: 10000,
  });
}

</script>

<template>
  <div class="mistakes-page">
    <h1 class="mistakes-title">我的错题本</h1>

    <div class="mistakes-card" v-if="mistakes.length">
      <div class="mistakes-table-wrap">
        <table class="mistakes-table">
          <thead>
            <tr>
              <th>编号</th>
              <th class="hide-mobile">时间</th>
              <th>问题</th>
              <th>用时</th>
              <th>标答</th>
              <th>错误回答</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mistake, i) in mistakes" :key="i">
              <td>{{ i + 1 }}</td>
              <td class="hide-mobile">{{ mistake.time }}</td>
              <td class="mistake-problem">{{ mistake.problem }}</td>
              <td>{{ (mistake.duration / 1000).toFixed(3) }}秒</td>
              <td class="mistake-answer">{{ mistake.correctAnswer }}</td>
              <td class="mistake-wrong">{{ mistake.wrongAnswers.join(",") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mistakes-empty" v-else>
      <p>暂无错题记录</p>
    </div>

    <div class="mistakes-actions">
      <div class="mistakes-actions-left">
        <button class="btn-secondary" type="button" @click="go_to_main_page">返回主页</button>
        <button class="btn-primary" type="button" @click="export_all">导出记录</button>
        <span class="mistakes-hint" title="题数多时可能需要等待一段时间">ⓘ</span>
      </div>
      <button class="btn-danger" type="button" @click="clear_all">清空错题本</button>
    </div>
  </div>
</template>

<style>
.mistakes-page {
  width: 100%;
  max-width: 800px;
}

.mistakes-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--c-text);
}

.mistakes-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 1.25rem;
}

.mistakes-table-wrap {
  overflow-x: auto;
}

.mistakes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.mistakes-table th {
  padding: 0.625rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8125rem;
  color: var(--c-text-secondary);
  background: var(--c-bg);
  border-bottom: 1px solid var(--c-border);
  white-space: nowrap;
}

.mistakes-table td {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--c-border);
  color: var(--c-text);
}

.mistakes-table tbody tr:last-child td {
  border-bottom: none;
}

.mistakes-table tbody tr:hover {
  background: var(--c-bg);
}

.mistake-problem {
  font-weight: 600;
}

.mistake-answer {
  color: var(--c-success);
  font-weight: 600;
}

.mistake-wrong {
  color: var(--c-error);
  font-weight: 500;
}

.mistakes-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--c-text-muted);
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  margin-bottom: 1.25rem;
}

.mistakes-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.mistakes-actions-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mistakes-hint {
  font-size: 1.125rem;
  color: var(--c-text-muted);
  cursor: help;
}

.hide-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hide-mobile {
    display: table-cell;
  }
}
</style>
