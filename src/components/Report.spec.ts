// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { Question } from '@/question';
import useQuestionStore from '@/store/question';
import Report from './Report.vue';

const Home = { template: '<div />' };

function push_q(store: ReturnType<typeof useQuestionStore>, problem: string, answer: string) {
  store.questions.push(new Question(problem, answer));
}

describe('Report', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('displays correct rate, counts, and timings', () => {
    vi.useFakeTimers();
    const store = useQuestionStore();
    store.notify.success = vi.fn();
    store.notify.error = vi.fn();
    store.notify.warning = vi.fn();

    push_q(store, '1+1', '2');
    vi.setSystemTime(1000); store.update_question();
    vi.setSystemTime(2000); store.answer_current_question('2');

    push_q(store, '2+2', '4');
    vi.setSystemTime(3000); store.update_question();
    vi.setSystemTime(5000); store.answer_current_question('4');

    push_q(store, '3+3', '6');
    vi.setSystemTime(6000); store.update_question();
    vi.setSystemTime(6500); store.answer_current_question('7');
    vi.setSystemTime(7500); store.answer_current_question('6');

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }],
    });
    const wrapper = mount(Report, {
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('66.7%');
    expect(wrapper.text()).toContain('2 / 3');
    expect(wrapper.text()).toContain('4.500');
    expect(wrapper.text()).toContain('1.500');
    vi.useRealTimers();
  });

  it('renders a question row for each question', () => {
    vi.useFakeTimers();
    const store = useQuestionStore();
    store.notify.success = vi.fn();
    store.notify.error = vi.fn();
    store.notify.warning = vi.fn();

    push_q(store, '1+1', '2');
    vi.setSystemTime(1000); store.update_question();
    vi.setSystemTime(2000); store.answer_current_question('2');

    push_q(store, '2+2', '4');
    vi.setSystemTime(3000); store.update_question();
    vi.setSystemTime(3500); store.answer_current_question('4');

    push_q(store, '3+3', '6');
    vi.setSystemTime(4000); store.update_question();
    vi.setSystemTime(4500); store.answer_current_question('6');

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }],
    });
    const wrapper = mount(Report, {
      global: { plugins: [router] },
    });

    expect(wrapper.findAll('.q-row-correct')).toHaveLength(3);
    vi.useRealTimers();
  });

  it('renders title and subtitle', () => {
    vi.useFakeTimers();
    const store = useQuestionStore();
    store.notify.success = vi.fn();
    store.notify.error = vi.fn();
    store.notify.warning = vi.fn();

    push_q(store, '1+1', '2');
    vi.setSystemTime(1000); store.update_question();
    vi.setSystemTime(2000); store.answer_current_question('2');

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }],
    });
    const wrapper = mount(Report, {
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('成绩单');
    expect(wrapper.find('.report-subtitle').exists()).toBe(true);
    vi.useRealTimers();
  });

  it('renders action buttons', () => {
    vi.useFakeTimers();
    const store = useQuestionStore();
    store.notify.success = vi.fn();
    store.notify.error = vi.fn();
    store.notify.warning = vi.fn();

    push_q(store, '1+1', '2');
    vi.setSystemTime(1000); store.update_question();
    vi.setSystemTime(2000); store.answer_current_question('2');

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }],
    });
    const wrapper = mount(Report, {
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('返回主页');
    expect(wrapper.text()).toContain('截图分享');
    vi.useRealTimers();
  });

  it('renders filter tabs', () => {
    vi.useFakeTimers();
    const store = useQuestionStore();
    store.notify.success = vi.fn();
    store.notify.error = vi.fn();
    store.notify.warning = vi.fn();

    push_q(store, '1+1', '2');
    vi.setSystemTime(1000); store.update_question();
    vi.setSystemTime(2000); store.answer_current_question('2');

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }],
    });
    const wrapper = mount(Report, {
      global: { plugins: [router] },
    });

    const tabs = wrapper.findAll('.filter-tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0].text()).toBe('全部');
    expect(tabs[1].text()).toBe('正确');
    expect(tabs[2].text()).toBe('错误');
    vi.useRealTimers();
  });

  it('redirects to main page when questions are empty', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }],
    });
    const pushSpy = vi.spyOn(router, 'push');

    useQuestionStore();
    mount(Report, {
      global: { plugins: [router] },
    });

    expect(pushSpy).toHaveBeenCalledWith('/');
  });
});
