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

function mountInTable(component: typeof QuestionDisplay, props: Record<string, unknown>) {
  return mount({
    components: { QuestionDisplay },
    template: '<table><tbody><QuestionDisplay v-bind="props" /></tbody></table>',
    setup() {
      return { props };
    },
  });
}

describe('QuestionDisplay', () => {
  it('renders correct question with q-row-correct class', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionDisplay, {
      props: { question: q, i: 0 },
    });
    expect(wrapper.classes()).toContain('q-row-correct');
    expect(wrapper.classes()).not.toContain('q-row-wrong');
  });

  it('renders wrong question with q-row-wrong class and shows wrong answers', () => {
    const q = createQuestion({ wrongAnswers: ['3', '7'] });
    const wrapper = mount(QuestionDisplay, {
      props: { question: q, i: 0 },
    });
    expect(wrapper.classes()).toContain('q-row-wrong');
    expect(wrapper.text()).toContain('3, 7');
  });

  it('displays question number as i + 1', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionDisplay, {
      props: { question: q, i: 4 },
    });
    expect(wrapper.find('.q-col-num').text()).toBe('5');
  });

  it('displays the problem text', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionDisplay, {
      props: { question: q, i: 0 },
    });
    expect(wrapper.find('.q-col-problem').text()).toBe('1 + 1 = ?');
  });

  it('displays the correct answer', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionDisplay, {
      props: { question: q, i: 0 },
    });
    expect(wrapper.find('.q-answer-value').text()).toBe('2');
  });

  it('displays duration via Duration child component', () => {
    const q = createQuestion({ duration: 2500 });
    const wrapper = mount(QuestionDisplay, {
      props: { question: q, i: 0 },
    });
    expect(wrapper.text()).toContain('2.500');
  });

  it('shows dash for correct answer with no wrong answers', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionDisplay, {
      props: { question: q, i: 0 },
    });
    expect(wrapper.find('.q-no-answer').exists()).toBe(true);
  });

  it('shows checkmark for correct answer', () => {
    const q = createQuestion();
    const wrapper = mount(QuestionDisplay, {
      props: { question: q, i: 0 },
    });
    expect(wrapper.find('.q-status-ok').exists()).toBe(true);
  });

  it('shows cross for wrong answer', () => {
    const q = createQuestion({ wrongAnswers: ['3'] });
    const wrapper = mount(QuestionDisplay, {
      props: { question: q, i: 0 },
    });
    expect(wrapper.find('.q-status-ko').exists()).toBe(true);
  });
});
