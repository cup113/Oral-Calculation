<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import Message from 'vue-m-message';

import { CategoryId, DEP } from '@/assets/question';
import type { Milliseconds } from '@/assets/question';
import useStore from '@/store/index';

import Duration from './Duration.vue';

const
  { set_module, set_quantity } = useStore(),
  { questionProvider, questions, loaded, quantity } = storeToRefs(useStore());

const
  router = useRouter(),
  route = useRoute();

const enum Status {
  Loading,
  Loaded,
  Ready,
  Answering,
  Ended,
}

const
  query = validate_query(),
  currentQuestion = ref(questionProvider.value.get_question()),
  status = ref(Status.Loading),
  started = computed(() => status.value !== Status.Loaded && status.value !== Status.Loading),
  board = reactive({
    passed: 0, // passed questions count
    correct: 0, // passed at the first time
    wrongAnswers: 0,
    accDuration: 0 as Milliseconds, // ms
  }),
  ratio = computed(() => quantity.value === 0 ? 0 : (board.passed / quantity.value)),
  answerInput = ref(null as HTMLInputElement | null);

interface Param {
  category: CategoryId,
  params: string,
  quantity: number,
}

function validate_query(): Param {
  const category = Reflect.get(route.params, "category") as CategoryId;
  const params = Reflect.get(route.params, "params") as string;
  const quantity = Reflect.get(route.params, "quantity") as string;
  set_module(category, params).then(question_module_onload);
  return {
    category,
    params,
    quantity: parseInt(quantity),
  };
}

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
  Message.warning("加载中，请等待");
}

function question_module_onload() {
  status.value = Status.Loaded;
  currentQuestion.value = DEP.Question.new_loaded();
  Message.info("点击“开始”以开始答题");
}

function next_question(): void {
  currentQuestion.value = questionProvider.value.get_question();
  questions.value.push(currentQuestion.value);
  Message.info("请作答", {
    duration: 500,
    position: 'bottom-right'
  });
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
    isCorrect = answer == currentQuestion.value.correctAnswer;
  currentQuestion.value.end = new Date();
  board.accDuration += currentQuestion.value.get_duration();
  if (isCorrect) {
    status.value = Status.Ready;
    Message.success(`答案 ${answer} 正确`, {
      position: 'bottom-right'
    });
    board.passed += 1;
    if (currentQuestion.value.is_first_time_correct())
      board.correct += 1;
    if (board.passed === quantity.value)
      end();
  }
  else {
    if (answer.length === 0) {
      Message.warning("答案不应为空");
    } else if (currentQuestion.value.wrongAnswers.has(answer)) {
      Message.error(`已经有过错误答案 ${answer}`);
    } else {
      currentQuestion.value.wrongAnswers.add(answer);
      board.wrongAnswers += 1;
      Message.error(`答案 ${answer} 错误`);
    }
  }
}

questions.value.splice(0, questions.value.length);
set_quantity(query.quantity);

</script>

<template lang="pug">
div.exercise.pt-12
  button.btn.bg-gray-700.absolute.left-6.top-4(type="button" @click="go_back") 返回
  div.progress.mx-24.text-2xl
    div.progress-bar.text-green-400.bg-blue-600(:style="{ '--ratio': ratio }")
      | {{ board.passed }} / {{ quantity }}
  div.bg-gray-100.w-max.mx-auto.py-1.my-4
    div.board-item
      span 正确题数 / 已答题目
      span {{ board.correct }} / {{ board.passed }}
    div.board-item
      span 错误回答数
      span {{ board.wrongAnswers }}
    div.board-item
      span 累计用时
      span
        Duration(:duration="board.accDuration")
  form.text-2xl(@submit.prevent="submit_question")
    div {{ currentQuestion.problem }}
    div.px-2.py-2.flex.flex-nowrap.gap-1.ml-24.mr-12
      input.text-center.grow.border(ref="answerInput" type="text" name="answer" autocomplete="off")
      button.btn.bg-blue-500.w-max(type="submit") 提交
  button.btn.bg-green-700(type="button" @click="start" v-if="!started") 开始
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