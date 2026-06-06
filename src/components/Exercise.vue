<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import Message from 'vue-m-message';

import { QUESTION_CONTEXT, validate_params } from '@/question';
import useQuestionStore from '@/store/question';
import useSettingStore from '@/store/setting';
import {
  ExerciseStatus,
  canSubmitAnswer,
  shouldWarnLoading,
  shouldSkipToNext,
  shouldStartFromSubmit,
  getStatusOnModuleLoad,
  getStatusOnStart,
  getStatusOnCorrectAnswer,
} from '@/exercise/exercise-machine';

import Duration from '../assets/components/Duration.vue';

const
  router = useRouter(),
  route = useRoute();

const
  question = useQuestionStore(),
  setting = useSettingStore();

function manage_route_params() {
  let category = Reflect.get(route.params, "category") as string;
  let params = Reflect.get(route.params, "params") as string;
  let quantity = Reflect.get(route.params, "quantity") as string;
  setting.categoryIdManager.set(category);
  setting.paramsManager.set(params);
  setting.quantityManager.set(quantity);
  if (question.loaded) {
    question_module_onload();
  } else {
    watch(() => question.loaded, newLoaded => {
      if (newLoaded)
        question_module_onload();
    });
  }
}

const
  status = ref(ExerciseStatus.Loading),
  started = computed(() => status.value !== ExerciseStatus.Loaded && status.value !== ExerciseStatus.Loading),
  answerInput = ref(null as HTMLInputElement | null);

const urlParamsHint = computed(() => `当前 URL 已包含题型参数（类别: ${route.params.category}, 参数: ${route.params.params}, 题数: ${route.params.quantity}），可收藏此页快速进入`);

watch(() => question.loaded, loaded => {
  if (loaded)
    document.title = `口算练习 | ${question.questionProvider.get_title()}`;
}, { immediate: true });

manage_route_params();

function start(): void {
  const next = getStatusOnStart(question.loaded);
  if (next === null) {
    warn_loading();
    return;
  }
  status.value = next;
  next_question();
}

function end(): void {
  status.value = ExerciseStatus.Ended;
  Message.success("题目全部完成，生成报告中……");
  setTimeout(() => {
    router.push("/report");
  }, 3000);
}

function go_back(): void {
  router.push("/");
}

function go_to_print_page(): void {
  router.push("/print-question");
}

function warn_loading(): void {
  Message.warning("加载中，请等待。");
}

function question_module_onload() {
  const validate_result = validate_params(
    question.questionModule.paramsConfig,
    setting.params,
    question.questionModule.validate,
  );
  const next = getStatusOnModuleLoad(validate_result);
  if (next === 'exit') {
    Message.error(`验证参数时出错: 当前模块${validate_result}`);
    go_back();
  } else {
    question.reset_questions();
    status.value = next;
    question.currentQuestion = QUESTION_CONTEXT.Question.new_loaded();
    Message.info("加载完成。点击“开始”答题。");
  }
}

function next_question(): void {
  question.update_question();
  status.value = ExerciseStatus.Answering;
  nextTick(() => {
    answerInput.value?.focus();
    if (answerInput.value) answerInput.value.value = "";
  });
}

function submit_question(ev: Event): void {
  const s = status.value;
  if (canSubmitAnswer(s)) {
    // proceed to answer processing below
  } else if (shouldSkipToNext(s)) {
    next_question();
    return;
  } else if (shouldStartFromSubmit(s)) {
    start();
    return;
  } else if (shouldWarnLoading(s)) {
    warn_loading();
    return;
  } else {
    Message.info("请等待跳转");
    return;
  }
  window.umami?.track('answer-submit');
  const
    formData = new FormData(ev.target as HTMLFormElement),
    answer = (formData.get("answer") as string).trim(),
    isCorrect = question.answer_current_question(answer);
  if (isCorrect) {
    const isLast = question.passedCnt === setting.quantity;
    status.value = getStatusOnCorrectAnswer(isLast);
    if (isLast)
      end();
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && status.value === ExerciseStatus.Loaded) {
    e.preventDefault();
    start();
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="exercise-page">
    <div class="exercise-card">
      <div class="exercise-header">
        <button class="btn-ghost" type="button" @click="go_back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          返回
        </button>
        <span class="url-hint" :title="urlParamsHint">ⓘ</span>
      </div>

      <div class="exercise-progress-row">
        <div class="progress flex-1">
          <div class="progress-bar" :style="{ '--ratio': question.passedRatio }"></div>
        </div>
        <span class="progress-label">
          {{ question.passedCnt }} / {{ setting.quantity }}
        </span>
      </div>

      <div class="exercise-stats">
        <div class="stat-item">
          <span class="stat-value stat-correct">{{ question.correctCnt }}</span>
          <span class="stat-label">正确</span>
        </div>
        <div class="stat-item">
          <span class="stat-value stat-wrong">{{ question.wrongAnswerCnt }}</span>
          <span class="stat-label">错误</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">
            <Duration :duration="question.accumulatedDuration" />
          </span>
          <span class="stat-label">用时</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ question.passedCnt ? question.correctCnt + '/' + question.passedCnt : '-' }}</span>
          <span class="stat-label">正确/已答</span>
        </div>
      </div>

      <div class="exercise-question-area" v-if="started">
        <div class="question-text">{{ question.currentQuestion.problem }}</div>

        <form class="question-form" @submit.prevent="submit_question">
          <input class="answer-input" type="text" name="answer" autocomplete="off"
            placeholder="输入答案..." ref="answerInput">
          <button class="btn-primary" type="submit">提交</button>
        </form>

        <p class="question-hint">按 <kbd>Enter</kbd> 提交本题，再按一次进入下一题</p>
      </div>

      <div class="exercise-start-area" v-else>
        <div class="exercise-start-buttons">
          <button class="btn-primary" type="button" @click="start" data-umami-event="start-exercise">开始</button>
          <button class="btn-secondary" type="button" @click="go_to_print_page" data-umami-event="start-print">打印</button>
        </div>
        <p class="question-hint">按 <kbd>Enter</kbd> 开始答题，全程无需离开输入框</p>
      </div>
    </div>

  </div>
</template>

<style>
.exercise-page {
  width: 100%;
  max-width: 560px;
}

.exercise-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.exercise-header .btn-ghost {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.exercise-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  box-shadow: var(--shadow);
}

.exercise-progress-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.progress-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--c-text-secondary);
  white-space: nowrap;
}

.exercise-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 0.5rem 0.25rem;
  background: var(--c-bg);
  border-radius: var(--radius-sm);
}

.stat-value {
  display: block;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--c-text);
}

.stat-value.stat-correct {
  color: var(--c-success);
}

.stat-value.stat-wrong {
  color: var(--c-error);
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--c-text-muted);
  margin-top: 0.125rem;
}

.exercise-question-area {
  text-align: center;
}

.question-text {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding: 0.5rem;
  color: var(--c-text);
}

.question-form {
  display: flex;
  gap: 0.5rem;
  max-width: 100%;
}

.answer-input {
  flex: 1;
  min-width: 0;
  padding: 0.75rem 1rem;
  font-size: 1.125rem;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-surface);
  color: var(--c-text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  text-align: center;
}

.answer-input:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px var(--c-primary-light);
}

.question-hint {
  font-size: 0.8125rem;
  color: var(--c-text-muted);
  margin-top: 0.75rem;
}

.question-hint kbd {
  font-family: inherit;
  padding: 0.0625rem 0.375rem;
  border: 1px solid var(--c-border);
  border-radius: 3px;
  background: var(--c-bg);
  font-weight: 600;
}

.exercise-start-area {
  text-align: center;
  padding: 1rem 0;
}

.exercise-start-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

</style>
