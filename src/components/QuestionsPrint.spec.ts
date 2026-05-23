// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { ref, computed } from 'vue';

const Home = { template: '<div />' };

const mockQuestions = [
  { problem: '3 + 5', correctAnswer: '8' },
  { problem: '12 - 7', correctAnswer: '5' },
];

vi.mock('@/store/question', () => ({
  default: vi.fn(() => ({
    reset_questions: vi.fn(),
    loaded: true,
    questionProvider: {
      get_title: () => '加法',
    },
    questions: mockQuestions,
  })),
}));

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("QuestionsPrint", () => {
  it("renders toolbar title and buttons", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }],
    });
    const { default: QuestionsPrint } = await import('./QuestionsPrint.vue');
    const wrapper = mount(QuestionsPrint, {
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain("打印题目");
    expect(wrapper.text()).toContain("打印答案");
    expect(wrapper.text()).toContain("返回");
  });

  it("renders problem table", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }],
    });
    const { default: QuestionsPrint } = await import('./QuestionsPrint.vue');
    const wrapper = mount(QuestionsPrint, {
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain("3 + 5");
    expect(wrapper.text()).toContain("12 - 7");
  });

  it("allows column count switching", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }],
    });
    const { default: QuestionsPrint } = await import('./QuestionsPrint.vue');
    const wrapper = mount(QuestionsPrint, {
      global: { plugins: [router] },
    });
    const buttons = wrapper.findAll('button');
    const col3Btn = buttons.find(b => b.text() === '3');
    expect(col3Btn).toBeDefined();
    await col3Btn!.trigger('click');
  });
});
