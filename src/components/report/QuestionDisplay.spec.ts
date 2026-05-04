// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Question } from '@/question';
import QuestionDisplay from './QuestionDisplay.vue';

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

describe('QuestionDisplay', () => {
  it('renders correct question with q-correct class', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionDisplay, { props: { question: q, i: 0 } });
    expect(wrapper.classes()).toContain('q-correct');
    expect(wrapper.classes()).not.toContain('q-wrong');
  });

  it('renders wrong question with q-wrong class and shows wrong answers', () => {
    const q = createQuestion({ wrongAnswers: ['3', '7'] });
    const wrapper = mount(QuestionDisplay, { props: { question: q, i: 0 } });
    expect(wrapper.classes()).toContain('q-wrong');
    expect(wrapper.text()).toContain('✘');
    expect(wrapper.text()).toContain('3, 7');
  });

  it('displays question number as i + 1', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionDisplay, { props: { question: q, i: 4 } });
    expect(wrapper.find('.q-num').text()).toBe('5');
  });

  it('displays the problem text', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionDisplay, { props: { question: q, i: 0 } });
    expect(wrapper.find('.q-problem').text()).toBe('1 + 1 = ?');
  });

  it('displays the correct answer', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionDisplay, { props: { question: q, i: 0 } });
    expect(wrapper.find('.q-answer-correct').text()).toBe('2');
  });

  it('displays duration via Duration child component', () => {
    const q = createQuestion({ duration: 2500 });
    const wrapper = mount(QuestionDisplay, { props: { question: q, i: 0 } });
    expect(wrapper.text()).toContain('2.500');
  });
});
