// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Question } from '@/question';
import QuestionShareDisplay from './QuestionShareDisplay.vue';

function createQuestion(options: { duration?: number; wrongAnswers?: string[] } = {}) {
  const q = new Question('1 + 1 = ?', '2');
  q.start = new Date(0);
  q.end = new Date(options.duration ?? 1500);
  if (options.wrongAnswers) {
    options.wrongAnswers.forEach(a => q.wrongAnswers.add(a));
  }
  q.passed = !options.wrongAnswers || options.wrongAnswers.length === 0;
  return q;
}

const defaultDist = { min: 0, max: 3000, slow: 2000, fast: 1000 };

describe('QuestionShareDisplay', () => {
  it('shows cyan bar for correct fast question', () => {
    const q = createQuestion({ duration: 500 });
    const wrapper = mount(QuestionShareDisplay, {
      props: { question: q, num: 1, durationDistribution: defaultDist }
    });
    expect(wrapper.find('.qs-bar').classes()).toContain('bg-cyan-400');
    expect(wrapper.find('.qs-result').text()).toBe('✓');
  });

  it('shows green bar for correct medium-speed question', () => {
    const q = createQuestion({ duration: 1500 });
    const wrapper = mount(QuestionShareDisplay, {
      props: { question: q, num: 1, durationDistribution: defaultDist }
    });
    expect(wrapper.find('.qs-bar').classes()).toContain('bg-green-600');
  });

  it('shows orange bar for correct slow question', () => {
    const q = createQuestion({ duration: 2500 });
    const wrapper = mount(QuestionShareDisplay, {
      props: { question: q, num: 1, durationDistribution: defaultDist }
    });
    expect(wrapper.find('.qs-bar').classes()).toContain('bg-orange-600');
  });

  it('shows red bar and error count for wrong question', () => {
    const q = createQuestion({ duration: 1500, wrongAnswers: ['3'] });
    const wrapper = mount(QuestionShareDisplay, {
      props: { question: q, num: 1, durationDistribution: defaultDist }
    });
    expect(wrapper.find('.qs-bar').classes()).toContain('bg-red-500');
    expect(wrapper.find('.qs-result').text()).toBe('1');
  });

  it('displays serial number', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionShareDisplay, {
      props: { question: q, num: 5, durationDistribution: defaultDist }
    });
    expect(wrapper.find('.qs-num').text()).toBe('5');
  });

  it('displays formatted duration in seconds', () => {
    const q = createQuestion({ duration: 1234 });
    const wrapper = mount(QuestionShareDisplay, {
      props: { question: q, num: 1, durationDistribution: defaultDist }
    });
    expect(wrapper.find('.qs-duration').text()).toMatch(/1\.234s/);
  });
});
