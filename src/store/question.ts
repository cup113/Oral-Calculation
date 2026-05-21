import Message from 'vue-m-message';

import { defineStore } from "pinia";
import { ref, computed, watch, reactive } from 'vue';

import type { Milliseconds } from '@/util';
import { QUESTION_CONTEXT, Question, QuestionModule, get_module, AnswerResult } from '@/question';
import LoadingQuestion from '@/question/loading';
import useSettingStore from './setting';
import useMistakesStore from './mistakes';

interface Notify {
  success(msg: string): void
  error(msg: string): void
  warning(msg: string): void
}

export default defineStore("question", () => {
  const setting = useSettingStore();
  const { append_mistake } = useMistakesStore();

  const
    questions = reactive([] as Question[]),
    existProblems = ref(new Set() as Set<string>),
    questionModule = ref(LoadingQuestion as QuestionModule),
    loaded = computed(() => questionModule.value.id !== 'loading'),
    questionProvider = computed(() => questionModule.value.get_provider(QUESTION_CONTEXT, setting.params)),
    currentQuestion = ref(questionProvider.value.get_question()),
    passedCnt = ref(0),
    correctCnt = ref(0),
    wrongAnswerCnt = ref(0),
    passedQuestionsDuration = ref(0 as Milliseconds),
    currentQuestionDuration = ref(0 as Milliseconds),
    accumulatedDuration = computed(() => {
      return passedQuestionsDuration.value + currentQuestionDuration.value;
    }),
    passedRatio = computed(() => passedCnt.value / setting.quantity);

  const notify: Notify = {
    success: (msg) => Message.success(msg, { position: 'bottom-right' }),
    error: (msg) => Message.error(msg),
    warning: (msg) => Message.warning(msg),
  }
  watch(() => setting.categoryId, newCategoryId => {
    // CategoryId is set through `categoryManager` and is safe now.
    get_module(newCategoryId).then(
      m => questionModule.value = m.default,
      err => notify.error(`获取类别信息失败: ${err}`)
    );
  }, { immediate: true });

  function reset_questions() {
    questions.splice(0, questions.length);
    existProblems.value.clear();
    passedCnt.value = 0;
    correctCnt.value = 0;
    wrongAnswerCnt.value = 0;
    currentQuestionDuration.value = 0;
    passedQuestionsDuration.value = 0;
    for (let i = 0; i < setting.quantity; ++i)
      add_question();
  }

  function get_question(): Question {
    let question = questionProvider.value.get_question();
    if (setting.avoidRepeat) {
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
    questions.push(get_question());
  }

  function update_question() {
    currentQuestion.value = questions[passedCnt.value];
    currentQuestion.value.start = new Date();
    currentQuestion.value.end = new Date();
  }

  /**
   * @returns if the answer is correct
   */
  function answer_current_question(answer: string): boolean {
    switch (currentQuestion.value.try_answer(answer)) {
      case AnswerResult.Correct:
        passedQuestionsDuration.value += currentQuestion.value.get_duration();
        currentQuestionDuration.value = 0;
        notify.success(`答案 ${answer} 正确`);
        passedCnt.value += 1;
        if (currentQuestion.value.is_first_time_correct())
          correctCnt.value += 1;
        else {
          append_mistake(currentQuestion.value);
        }
        return true;
      case AnswerResult.WrongEmpty:
        currentQuestionDuration.value = currentQuestion.value.get_elapsed();
        notify.warning("答案不应为空");
        return false;
      case AnswerResult.WrongAnswered:
        currentQuestionDuration.value = currentQuestion.value.get_elapsed();
        notify.error(`已经有过错误答案 ${answer}`);
        return false;
      case AnswerResult.WrongNew:
        currentQuestionDuration.value = currentQuestion.value.get_elapsed();
        wrongAnswerCnt.value += 1;
        notify.error(`答案 ${answer} 错误`);
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
    update_question,
    answer_current_question,
    notify,
  }
});
