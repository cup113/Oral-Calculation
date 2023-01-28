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
  { set_module } = useStore(),
  { questionProvider, questions, loaded } = storeToRefs(useStore());

questions.value.splice(0, questions.value.length);

const router = useRouter();
const route = useRoute();

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
    if (board.passed === query.quantity)
      end();
  }
  else {
    if (currentQuestion.value.wrongAnswers.has(answer)) {
      Message.error(`已经有过错误答案 ${answer}`, {
        position: 'bottom-right'
      });
    } else {
      currentQuestion.value.wrongAnswers.add(answer);
      board.wrongAnswers += 1;
      Message.error(`答案 ${answer} 错误`, {
        position: 'bottom-right'
      });
    }
  }
}

</script>

<template lang="pug">
div.exercise
  button.go-back.btn.btn-secondary(type="button" @click="go_back") 返回
  h2 练习
  div.board
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
  form(@submit.prevent="submit_question")
    div.problem {{ currentQuestion.problem }}
    div.answer
      input(ref="answerInput" type="text" name="answer" autocomplete="off")
      button.btn.btn-primary(type="submit") 提交
  button.btn.btn-success(type="button" @click="start" v-if="!started") 开始
</template>

<style lang="scss">
@import 'bootstrap/scss/_functions.scss';

@import 'bootstrap/scss/_variables.scss';
@import 'bootstrap/scss/_mixins.scss';

@import 'bootstrap/scss/_buttons.scss';

.exercise {
  .go-back {
    position: absolute;
    left: 1em;
    top: 1em;
  }

  .board-item {
    font-size: 1.2em;
    width: max-content;
    margin: 0 auto;
    background-color: $light;
    margin-bottom: 0.2em;
    padding: 0.1em 0;

    >span {
      display: inline-block;

      &:nth-child(1) {
        width: 16em;
      }

      &:nth-child(2) {
        width: 8em;
        color: $primary;
        font-weight: bold;
      }
    }
  }

  >form {
    margin-top: 1em;

    >.problem,
    >.answer {
      font-size: 2em;
      width: 100%;
    }

    >.problem {
      color: $primary;
    }

    >.answer {
      padding: 0.5em 2em;
      display: flex;
      flex-wrap: nowrap;
      column-gap: 0.25em;

      >input {
        flex-grow: 1;
        display: inline-block;
        text-align: center;
        word-break: break-all;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
    }
  }
}
</style>