<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import useStore from '@/store/index';
import type { Milliseconds } from '@/assets/question';

import Duration from './Duration.vue';
import QuestionDisplay from './QuestionDisplay.vue';

const
  router = useRouter();

const { questions, questionProvider } = useStore(); // These shouldn't be changed when reporting

if (questions.length === 0) {
  go_to_main_page();
}

const
  title: string = questionProvider.get_title(),
  generatedTime: Date = new Date(),
  generatedTimeDisplay = generatedTime.toLocaleString(),
  totalQuestions: number = questions.length,
  correctQuestions: number = questions.reduce(
    (pre, cur) => pre + (cur.is_first_time_correct() ? 1 : 0),
    0
  ),
  correctRate: number = correctQuestions / (totalQuestions || 1),
  correctRateDisplay: string = (correctRate * 100).toFixed(1) + "%",
  totalDuration: Milliseconds = questions.reduce(
    (pre, cur) => pre + cur.get_duration(),
    0
  ),
  avgDuration: Milliseconds = totalDuration / (totalQuestions || 1),
  wrongAnswers = questions.reduce(
    (pre, cur) => pre + cur.wrongAnswers.size,
    0
  );

function go_to_main_page() {
  return router.push("/");
}

</script>

<template lang="pug">
div.report
  h2 成绩报告
  div.report-overview
    div.report-header {{ title }}
    div.report-item
      span 生成时间
      span {{ generatedTimeDisplay }}
    div.report-item
      span 正确率
      span {{ correctQuestions }} / {{ totalQuestions }} ({{ correctRateDisplay }})
    div.report-item
      span 错误次数
      span {{ wrongAnswers }}
    div.report-item
      span 用时
      span
        Duration(:duration="totalDuration")
        | (平均
        Duration(:duration="avgDuration")
        | )
  div.report-detail
    QuestionDisplay(
      v-for="(question, i) in questions"
      :key="i"
      :question="question"
      :i="i"
    )
</template>

<style lang="scss">
@import 'bootstrap/scss/_functions.scss';

@import 'bootstrap/scss/_variables.scss';
@import 'bootstrap/scss/_mixins.scss';

.report {
  >.report-overview {
    margin-bottom: 2em;
    font-size: 1.25em;

    >.report-header,
    >.report-item {
      width: max-content;
      margin: 0 auto;
    }

    >.report-header {
      font-size: 1.2em;
      margin-bottom: 0.5em;
    }

    >.report-item {
      background-color: $light;

      >span {
        display: inline-block;
        border: 2px solid black;
        margin: -2px -2px 0 0;

        &:nth-child(1) {
          width: 5em;
        }

        &:nth-child(2) {
          color: $primary;
          width: 15em;
        }
      }
    }

  }

  >.report-detail {
    margin: 0 5em;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-around;
    align-items: center;
    gap: 1.5em 0.5em;
  }
}
</style>