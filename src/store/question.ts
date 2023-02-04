import Message from 'vue-m-message';

import { defineStore, storeToRefs } from "pinia";
import { ref, computed, watch } from 'vue';

import type { Milliseconds } from '@/assets/question/index';
import { DEP, Question, QuestionModule, get_module, AnswerResult } from '@/assets/question/index';
import LoadingQuestion from '@/assets/question/loading';
import useSettingStore from './setting';

export default defineStore("question", () => {
  const {
    categoryId,
    params,
    quantity,
    avoidRepeat,
    generateAtOnce
  } = storeToRefs(useSettingStore());

  const
    questions = ref([] as Question[]),
    existProblems = ref(new Set() as Set<string>),
    questionModule = ref(LoadingQuestion as QuestionModule),
    loaded = computed(() => questionModule.value !== LoadingQuestion),
    questionProvider = computed(() => questionModule.value.get_provider(DEP, params.value)),
    currentQuestion = ref(questionProvider.value.get_question()),
    passedCnt = ref(0),
    correctCnt = ref(0),
    wrongAnswerCnt = ref(0),
    passedQuestionsDuration = ref(0 as Milliseconds),
    currentQuestionDuration = ref(0 as Milliseconds),
    accumulatedDuration = computed(() => {
      return passedQuestionsDuration.value + currentQuestionDuration.value;
    }),
    passedRatio = computed(() => passedCnt.value / quantity.value);

  watch(categoryId, newCategoryId => {
    // CategoryId is set through `categoryManager` and is safe now.
    get_module(newCategoryId).then(
      m => questionModule.value = m.default,
      err => Message.error(`获取类别信息失败: ${err}`)
    );
  }, { immediate: true });

  function reset_questions() {
    questions.value.splice(0, questions.value.length);
    existProblems.value.clear();
    passedCnt.value = 0;
    correctCnt.value = 0;
    wrongAnswerCnt.value = 0;
    currentQuestionDuration.value = 0;
    passedQuestionsDuration.value = 0;
    if (generateAtOnce.value) {
      for (let i = 0; i < quantity.value; ++i)
        add_question();
    }
  }

  function get_question(): Question {
    let question = questionProvider.value.get_question();
    if (avoidRepeat.value) {
      const MAX_AVOID_REPEAT_TRIES = 100;
      for (let i = 0; i < MAX_AVOID_REPEAT_TRIES; ++i) {
        if (!existProblems.value.has(question.problem)) {
          existProblems.value.add(question.problem);
          break;
        }
        question = questionProvider.value.get_question();
      }
    }
    return question;
  }

  function add_question() {
    questions.value.push(get_question());
  }

  function update_question() {
    if (!generateAtOnce.value)
      add_question();
    currentQuestion.value = questions.value[passedCnt.value];
  }

  /**
   * @returns if the answer is correct
   */
  function answer_current_question(answer: string): boolean {
    switch (currentQuestion.value.try_answer(answer)) {
      case AnswerResult.Correct:
        passedQuestionsDuration.value += currentQuestion.value.get_duration();
        currentQuestionDuration.value = 0;
        Message.success(`答案 ${answer} 正确`, {
          position: 'bottom-right'
        });
        passedCnt.value += 1;
        if (currentQuestion.value.is_first_time_correct())
          correctCnt.value += 1;
        return true;
      case AnswerResult.WrongEmpty:
        currentQuestionDuration.value += currentQuestion.value.get_elapsed();
        Message.warning("答案不应为空");
        return false;
      case AnswerResult.WrongAnswered:
        currentQuestionDuration.value += currentQuestion.value.get_elapsed();
        Message.error(`已经有过错误答案 ${answer}`);
        return false;
      case AnswerResult.WrongNew:
        currentQuestionDuration.value += currentQuestion.value.get_elapsed();
        wrongAnswerCnt.value += 1;
        Message.error(`答案 ${answer} 错误`);
        return false;
    }
  }

  return {
    questions,
    currentQuestion,
    questionModule,
    loaded,
    questionProvider,
    passedCnt,
    correctCnt,
    wrongAnswerCnt,
    accumulatedDuration,
    passedRatio,
    reset_questions,
    get_question,
    add_question,
    update_question,
    answer_current_question,
  }
});
