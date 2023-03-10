<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch, onMounted } from 'vue';
import Message from 'vue-m-message';

import { QUESTION_CONTEXT } from '@/question';
import useQuestionStore from '@/store/question';
import useSettingStore from '@/store/setting';

import Duration from '../assets/components/Duration.vue';

onMounted(() => {
  answerInput.value!.focus();
}); // This should be in the beginning of the program.

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

const enum Status {
  Loading,
  Loaded,
  Ready,
  Answering,
  Ended,
}

const
  status = ref(Status.Loading),
  started = computed(() => status.value !== Status.Loaded && status.value !== Status.Loading),
  answerInput = ref(null as HTMLInputElement | null);

question.reset_questions();
manage_route_params();

function start(): void {
  if (!question.loaded) {
    warn_loading();
    return;
  }
  status.value = Status.Ready;
  next_question();
}

function end(): void {
  status.value = Status.Ended;
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
  let validate_result = question.validate_params();
  if (validate_result.length > 0) {
    Message.error(`验证参数时出错: 当前模块${validate_result}`);
    go_back();
  } else {
    status.value = Status.Loaded;
    question.currentQuestion = QUESTION_CONTEXT.Question.new_loaded();
    Message.info("加载完成。点击“开始”答题。");
  }
}

function next_question(): void {
  question.update_question();
  answerInput.value!.focus();
  status.value = Status.Answering;
  answerInput.value!.value = "";
}

function submit_question(ev: Event): void {
  switch (status.value) {
    case Status.Answering:
      break;
    case Status.Ready:
      next_question();
      return;
    case Status.Loaded:
      start();
      return;
    case Status.Loading:
      warn_loading();
      return;
    case Status.Ended:
      Message.info("请等待跳转");
      return;
  }
  const
    formData = new FormData(ev.target as HTMLFormElement),
    answer = (formData.get("answer") as string).trim(),
    isCorrect = question.answer_current_question(answer);
  if (isCorrect) {
    status.value = Status.Ready;
    if (question.passedCnt === setting.quantity)
      end();
  }
}

</script>

<template>
  <div class="exercise pt-12">
    <button class="btn bg-gray-700 absolute left-6 top-4" type="button" @click="go_back">返回</button>
    <div class="progress mx-24 text-2xl">
      <div class="progress-bar text-green-400 bg-blue-600" :style="{ '--ratio': question.passedRatio }">
        {{ question.passedCnt }} / {{ setting.quantity }}
      </div>
    </div>
    <div class="bg-gray-100 w-max mx-auto py-1 my-4">
      <div class="board-item">
        <span>正确题数 / 已答题目</span>
        <span>{{ question.correctCnt }} / {{ question.passedCnt }}</span>
      </div>
      <div class="board-item">
        <span>错误回答数</span>
        <span>{{ question.wrongAnswerCnt }}</span>
      </div>
      <div class="board-item">
        <span>累计用时</span>
        <span>
          <Duration :duration="question.accumulatedDuration"></Duration>
        </span>
      </div>
    </div>
    <form class="text-2xl" @submit.prevent="submit_question">
      <div>{{ question.currentQuestion.problem }}</div>
      <div class="px-2 py-2 flex flex-nowrap gap-1 lg:ml-24 lg:mr-12 sm:ml-12 sm:mr-2">
        <input class="answer text-center grow border break-keep" type="text" name="answer"
          autocomplete="off" placeholder="请在此处输入答案..." ref="answerInput">
        <button class="btn bg-blue-500 w-max" type="submit">提交</button>
      </div>
    </form>
    <div v-if="!started">
      <button class="btn bg-green-700" type="button" @click="start">开始</button>
      <button class="btn bg-gray-500 ml-2" @click="go_to_print_page">打印</button>
    </div>
  </div>
</template>

<style lang="scss">
.exercise .board-item {
  @apply text-lg w-max mx-auto mt-1 px-1;

  >span {
    @apply inline-block;

    &:nth-child(1) {
      @apply w-64;
    }

    &:nth-child(2) {
      @apply w-32 text-blue-600 font-bold;
    }
  }
}
</style>
