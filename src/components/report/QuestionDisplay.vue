<script lang="ts" setup>
import type { Question } from '@/question';

import Duration from '../../assets/components/Duration.vue';

const props = defineProps<{
  question: Question,
  i: number
}>();

const
  number = props.i + 1,
  isCorrect = props.question.is_first_time_correct(),
  problem = props.question.problem,
  duration = props.question.get_duration(),
  correctAnswer = props.question.correctAnswer,
  wrongAnswers = [...props.question.wrongAnswers];

</script>

<template>
  <tr class="q-row" :class="isCorrect ? 'q-row-correct' : 'q-row-wrong'">
    <td class="q-col-num">{{ number }}</td>
    <td class="q-col-problem">{{ problem }}</td>
    <td class="q-col-answer">
      <template v-if="wrongAnswers.length">
        <span class="q-wrong-answers">{{ wrongAnswers.join(', ') }}</span>
      </template>
      <span v-else class="q-no-answer">&ndash;</span>
    </td>
    <td class="q-col-correct">
      <span class="q-answer-value">{{ correctAnswer }}</span>
    </td>
    <td class="q-col-duration">
      <Duration :duration="duration" />
    </td>
    <td class="q-col-status">
      <span v-if="isCorrect" class="q-status-ok" title="正确">&#10003;</span>
      <span v-else class="q-status-ko" title="错误">&#10007;</span>
    </td>
  </tr>
</template>

<style>
.q-row {
  transition: background-color 0.15s;
}

.q-row:hover {
  background-color: var(--c-bg);
}

.q-row-correct {
  background-color: var(--c-success-light);
}

.q-row-wrong {
  background-color: var(--c-error-light);
}

.q-col-num {
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--c-text-muted);
  padding: 0.5rem 0.25rem;
  white-space: nowrap;
  width: 2rem;
}

.q-col-problem {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--c-text);
  padding: 0.5rem 0.5rem;
}

.q-col-answer {
  font-size: 0.8125rem;
  padding: 0.5rem 0.5rem;
  white-space: nowrap;
}

.q-wrong-answers {
  color: var(--c-error);
  font-weight: 500;
}

.q-no-answer {
  color: var(--c-text-muted);
}

.q-col-correct {
  font-size: 0.875rem;
  padding: 0.5rem 0.5rem;
  white-space: nowrap;
}

.q-answer-value {
  color: var(--c-success);
  font-weight: 700;
}

.q-col-duration {
  font-size: 0.8125rem;
  padding: 0.5rem 0.5rem;
  white-space: nowrap;
  color: var(--c-text-secondary);
}

.q-col-status {
  text-align: center;
  padding: 0.5rem 0.25rem;
  width: 2rem;
}

.q-status-ok {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-success);
}

.q-status-ko {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-error);
}
</style>
