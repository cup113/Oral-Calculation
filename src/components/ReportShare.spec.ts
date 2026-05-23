// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';

const mockQuestion = {
  problem: '3 + 5',
  correctAnswer: '8',
  get_duration: () => 1500,
  is_first_time_correct: () => true,
  wrongAnswers: { size: 0 },
  passed: true,
};

const mockQuestions = [mockQuestion, { ...mockQuestion, problem: '12 - 7', correctAnswer: '5', get_duration: () => 2500 }];

vi.mock('@/store/question', () => ({
  default: vi.fn(() => ({
    questions: mockQuestions,
    questionProvider: {
      get_title: () => '加法',
    },
    correctCnt: 2,
    accumulatedDuration: 4000,
  })),
}));

vi.mock('qrcode-generator', () => ({
  default: vi.fn(() => ({
    addData: vi.fn(),
    make: vi.fn(),
    createImgTag: () => '<img src="mock-qr" />',
  })),
}));

const Home = { template: '<div />' };

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("ReportShare", () => {
  it("renders share card with title and stats", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }, { path: '/welcome', component: Home }],
    });
    await router.push('/report-share');
    const { default: ReportShare } = await import('./ReportShare.vue');
    const wrapper = mount(ReportShare, {
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain("口算练习");
    expect(wrapper.text()).toContain("加法");
    expect(wrapper.text()).toContain("100%");
  });

  it("renders back button", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }, { path: '/welcome', component: Home }],
    });
    await router.push('/report-share');
    const { default: ReportShare } = await import('./ReportShare.vue');
    const wrapper = mount(ReportShare, {
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain("返回主页");
  });
});
