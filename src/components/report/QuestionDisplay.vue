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
  <div class="q-item" :class="isCorrect ? 'q-correct' : 'q-wrong'">
    <div class="q-head">
      <span class="q-num">{{ number }}</span>
      <span class="q-dot" :class="isCorrect ? 'dot-correct' : 'dot-wrong'"></span>
    </div>
    <div class="q-body">
      <span class="q-problem">{{ problem }}</span>
      <div class="q-meta">
        <span class="q-answer q-answer-correct">{{ correctAnswer }}</span>
        <span class="q-sep">&middot;</span>
        <Duration :duration="duration" />
        <template v-if="wrongAnswers.length">
          <span class="q-sep">&middot;</span>
          <span class="q-wrong-list">
            ✘ {{ wrongAnswers.join(', ') }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.q-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  width: 100%;
}

.q-item.q-correct {
  border-left: 3px solid var(--c-success);
}

.q-item.q-wrong {
  border-left: 3px solid var(--c-error);
  background: var(--c-error-light);
}

.q-head {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 2rem;
  padding-top: 0.125rem;
}

.q-num {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--c-text-muted);
}

.q-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-correct {
  background: var(--c-success);
}

.dot-wrong {
  background: var(--c-error);
}

.q-body {
  flex: 1;
  min-width: 0;
}

.q-problem {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
  line-height: 1.4;
}

.q-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  color: var(--c-text-secondary);
}

.q-answer {
  font-weight: 600;
}

.q-answer-correct {
  color: var(--c-success);
}

.q-sep {
  color: var(--c-text-muted);
}

.q-wrong-list {
  color: var(--c-error);
}
</style>
