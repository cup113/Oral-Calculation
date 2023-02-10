<script lang="ts" setup>
import { ref, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';

import useQuestionStore from '@/store/question';
import { empty_array } from '@/util';

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
  answers = questions.map((q, index) => {
    return `(${index + 1}) ${q.correctAnswer}`;
  }),
  colCnt = ref(2),
  printStatus = ref(PrintStatus.Ready),
  displaySource = computed(() => [problems, problems, answers][printStatus.value]),
  rows = computed(() => {
    let rows = empty_array(Math.floor(displaySource.value.length / colCnt.value)).map((_, index) => {
      return displaySource.value.slice(index * colCnt.value, (index + 1) * colCnt.value);
    });
    return rows;
  });

function print_problems() {
  printStatus.value = PrintStatus.OnPrintProblems;
  nextTick(() => window.print()); // to make sure template has been loaded.
}

function print_answers() {
  printStatus.value = PrintStatus.OnPrintAnswers;
  nextTick(() => window.print());
}

function change_cols(ev: Event) {
  let value = parseInt((ev.target as HTMLInputElement).value);
  if (Number.isInteger(value) || value >= 1)
    colCnt.value = value;
}

</script>

<template>
  <div class="questions-print">
    <div class="print-setting mt-4">
      <button class="btn bg-green-500 mr-2" @click="print_problems">打印题目</button>
      <button class="btn bg-green-500" @click="print_answers">打印答案</button>
      <span>
        <span>列数</span>
        <input
          type="number" min="1" step="1" placeholder="列数"
          class="border-black border-2 w-12"
          :value="colCnt" @change="change_cols">
      </span>
    </div>
    <table class="print-main">
      <thead>
        <tr>
          <th class="text-center text-2xl" :colspan="colCnt">
            <span>{{ title }}</span>
            <span v-if="printStatus === PrintStatus.OnPrintAnswers">
              &nbsp;- 答案
            </span>
          </th>
        </tr>
        <tr class="h-4"></tr>
      </thead>
      <tbody>
        <tr class="row" v-for="(row, i) in rows" :key="i">
          <td v-for="(problem, j) in row" :key="`${i}-${j}`">{{ problem }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.questions-print {
  @apply absolute w-full min-h-full bg-white overflow-auto;
  z-index: 1;

  .print-main {
    @apply mx-auto text-left overflow-hidden border-black border-2 print:border-0;
    width: 180mm;
    font-size: 5mm;
  }

  .row>td {
    @apply break-keep whitespace-nowrap overflow-visible px-4;
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
