import Message from 'vue-m-message';

import { defineStore, storeToRefs } from "pinia";
import { ref, computed, watch, reactive } from 'vue';

import type { Milliseconds } from '@/util';
import { QUESTION_CONTEXT, Question, QuestionModule, get_module, AnswerResult } from '@/question';
import LoadingQuestion from '@/question/loading';
import useSettingStore from './setting';
import useMistakesStore from './mistakes';

export default defineStore("question", () => {
  const {
    categoryId,
    params,
    quantity,
    avoidRepeat,
    generateAtOnce
  } = storeToRefs(useSettingStore());
  const { append_mistake } = useMistakesStore();

  const
    questions = reactive([] as Question[]),
    existProblems = ref(new Set() as Set<string>),
    questionModule = ref(LoadingQuestion as QuestionModule),
    loaded = computed(() => questionModule.value.id !== 'loading'),
    questionProvider = computed(() => questionModule.value.get_provider(QUESTION_CONTEXT, params.value)),
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

  /** Validate current parameters of current question module.
   * @returns An empty string if parameters are legal, otherwise a string with error information.
   */
  function validate_params(): string {
    const paramsConfig = questionModule.value.paramsConfig;
    if (paramsConfig.length !== params.value.length)
      return `应有${paramsConfig.length}个配置项，只得到了${params.value.length}个。`;
    for (let i = 0; i < paramsConfig.length; ++i) {
      const param = params.value[i], paramConfig = paramsConfig[i];
      switch (paramConfig.type) {
        case 'integer': {
          let paramNum = parseInt(param);
          if (!Number.isInteger(paramNum))
            return `配置项“${paramConfig.name}”传入参数时应为整数，但接受到“${param}”`;
          if (paramNum < paramConfig.min)
            return `配置项”${paramConfig.name}“传入参数时应为不小于${paramConfig.min}的数，但接受到“${param}”`;
          if (paramConfig.max !== undefined && paramNum > paramConfig.max)
            return `配置项”${paramConfig.name}“传入参数时应为不大于${paramConfig.max}的数，但接受到“${param}”`;
          break;
        }
        case 'select': {
          let paramNum = parseInt(param);
          if (!Number.isInteger(paramNum))
            return `配置项“${paramConfig.name}”传入参数时应为整数，但接受到“${param}”`;
          if (paramNum < 0)
            return `配置项”${paramConfig.name}“传入参数时应为不小于 0 的数，但接受到“${param}”`;
          if (paramNum >= paramConfig.choices.length)
            return `配置项”${paramConfig.name}“传入参数时应为不大于${paramConfig.choices.length}的数，但接受到“${param}”`;
          break;
        }
      }
    }
    if (questionModule.value.validate !== undefined) {
      let validate_result = questionModule.value.validate(params.value);
      if (validate_result.length > 0)
        return validate_result;
    }
    return "";
  }

  function reset_questions(fillAll?: boolean) {
    questions.splice(0, questions.length);
    existProblems.value.clear();
    passedCnt.value = 0;
    correctCnt.value = 0;
    wrongAnswerCnt.value = 0;
    currentQuestionDuration.value = 0;
    passedQuestionsDuration.value = 0;
    if (fillAll ?? generateAtOnce.value) {
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
    questions.push(get_question());
  }

  function update_question() {
    if (!generateAtOnce.value)
      add_question();
    currentQuestion.value = questions[passedCnt.value];
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
        else {
          append_mistake(currentQuestion.value);
        }
        return true;
      case AnswerResult.WrongEmpty:
        currentQuestionDuration.value = currentQuestion.value.get_elapsed();
        Message.warning("答案不应为空");
        return false;
      case AnswerResult.WrongAnswered:
        currentQuestionDuration.value = currentQuestion.value.get_elapsed();
        Message.error(`已经有过错误答案 ${answer}`);
        return false;
      case AnswerResult.WrongNew:
        currentQuestionDuration.value = currentQuestion.value.get_elapsed();
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
    validate_params,
    reset_questions,
    get_question,
    update_question,
    answer_current_question,
  }
});
