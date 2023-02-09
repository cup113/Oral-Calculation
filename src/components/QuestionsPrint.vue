<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';

import useQuestionStore from '@/store/question';

const router = useRouter();

const { reset_questions, loaded, questionProvider } = useQuestionStore();
const questions = (() => {
  if (!loaded)
    router.back();
  reset_questions(true);
  return useQuestionStore().questions;
})();

const enum PrintStatus {
  Ready = 0,
  OnPrintProblems = 1,
  OnPrintAnswers = 2
}

const
  title = questionProvider.get_title(),
  problems = questions.map((q, index) => {
    let dashes = "_".repeat(Math.floor(q.correctAnswer.length * 2.5));
    let problemBase: string = `(${index + 1}) ${q.problem}`;
    if (q.problem.includes('?'))
      return problemBase.replace("?", dashes);
    else
      return problemBase + dashes;
  }),
  printStatus = ref(PrintStatus.Ready);

function print_problems() {
  printStatus.value = PrintStatus.OnPrintProblems;
  nextTick(() => window.print()); // to make sure template has been loaded.
}

function print_answers() {
  printStatus.value = PrintStatus.OnPrintAnswers;
  nextTick(() => window.print());
}

</script>

<template>
  <div class="questions-print absolute w-full h-full bg-white overflow-auto">
    <div class="print-setting mt-4">
      <span class="btn bg-green-500 mr-2" @click="print_problems">打印题目</span>
      <span class="btn bg-green-500" @click="print_answers">打印答案</span>
    </div>
    <div class="print-main" v-show="printStatus === PrintStatus.OnPrintProblems">
      <div class="text-2xl mt-2 mb-4">{{ title }}</div>
      <div class="print-col" style="--col-width: 33.3%;">
        <span v-for="(problem, i) in problems" :key="i">{{ problem }}</span>
      </div>
    </div>
    <div class="print-main" v-show="printStatus === PrintStatus.OnPrintAnswers">
      <div class="text-2xl mt-2 mb-4">{{ title }} - 答案</div>
      <div class="print-col" style="--col-width: 33.3%;">
        <span v-for="(question, i) in questions" :key="i">
          <span>({{ i + 1 }})</span>
          <span>{{ question.correctAnswer }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.questions-print {
  z-index: 1;

  .print-col {
    @apply mx-auto text-left;
    width: 180mm;
    font-size: 5mm;

    >span {
      @apply overflow-visible inline-block text-left break-keep whitespace-nowrap;
      width: var(--col-width);
    }
  }
}


@media print {
  @page {
    size: 210mm 297mm portrait;
    margin: 15mm;
  }

  .print-setting {
    display: none;
  }
}
</style>
