<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import Message from 'vue-m-message';

import { QUESTION_CONTEXT } from '@/assets/question';
import useQuestionStore from '@/store/question';
import useSettingStore from '@/store/setting';

import Duration from './Duration.vue';

onMounted(() => {
  answerInput.value!.focus();
}); // This should be in the beginning of the program.

const
  router = useRouter(),
  route = useRoute();

const
  {
    reset_questions,
    update_question,
    answer_current_question,
    validate_params,
  } = useQuestionStore(),
  {
    currentQuestion,
    loaded,
    passedCnt,
    correctCnt,
    wrongAnswerCnt,
    passedRatio,
    accumulatedDuration,
  } = storeToRefs(useQuestionStore()),
  {
    categoryIdManager,
    quantityManager,
    paramsManager,
  } = useSettingStore(),
  { quantity } = storeToRefs(useSettingStore());

function manage_route_params() {
  let category = Reflect.get(route.params, "category") as string;
  let params = Reflect.get(route.params, "params") as string;
  let quantity = Reflect.get(route.params, "quantity") as string;
  categoryIdManager.set(category);
  paramsManager.set(params);
  quantityManager.set(quantity);
  if (loaded.value) {
    question_module_onload();
  } else {
    watch(loaded, newLoaded => {
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

reset_questions();
manage_route_params();

function start(): void {
  if (!loaded.value) {
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

function warn_loading(): void {
  Message.warning("加载中，请等待。");
}

function question_module_onload() {
  let validate_result = validate_params();
  if (validate_result.length > 0) {
    Message.error(`验证参数时出错: 当前模块${validate_result}`);
    go_back();
  } else {
    status.value = Status.Loaded;
    currentQuestion.value = QUESTION_CONTEXT.Question.new_loaded();
    Message.info("加载完成。点击“开始”答题。");
  }
}

function next_question(): void {
  update_question();
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
    isCorrect = answer_current_question(answer);
  if (isCorrect) {
    status.value = Status.Ready;
    if (passedCnt.value === quantity.value)
      end();
  }
}

</script>

<template>
  <div class="exercise pt-12">
    <button class="btn bg-gray-700 absolute left-6 top-4" type="button" @click="go_back">返回</button>
    <div class="progress mx-24 text-2xl">
      <div class="progress-bar text-green-400 bg-blue-600" :style="{ '--ratio': passedRatio }">
        {{ passedCnt }} / {{ quantity }}
      </div>
    </div>
    <div class="bg-gray-100 w-max mx-auto py-1 my-4">
      <div class="board-item">
        <span>正确题数 / 已答题目</span>
        <span>{{ correctCnt }} / {{ passedCnt }}</span>
      </div>
      <div class="board-item">
        <span>错误回答数</span>
        <span>{{ wrongAnswerCnt }}</span>
      </div>
      <div class="board-item">
        <span>累计用时</span>
        <span>
          <Duration :duration="accumulatedDuration"></Duration>
        </span>
      </div>
    </div>
    <form class="text-2xl" @submit.prevent="submit_question">
      <div>{{ currentQuestion.problem }}</div>
      <div class="px-2 py-2 flex flex-nowrap gap-1 lg:ml-24 lg:mr-12 sm:ml-12 sm:mr-2">
        <input class="answer text-center grow border break-keep" type="text" name="answer"
          autocomplete="off" placeholder="请在此处输入答案..." ref="answerInput">
        <button class="btn bg-blue-500 w-max" type="submit">提交</button>
      </div>
    </form>
    <button class="btn bg-green-700" type="button" @click="start" v-if="!started">开始</button>
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
