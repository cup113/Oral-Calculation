// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('js-file-downloader', () => ({
  default: vi.fn().mockReturnValue(Promise.resolve()),
}));

const mockMistake = {
  problem: "3+5",
  correctAnswer: "8",
  time: "2024-01-01 12:00",
  duration: 1500,
  wrongAnswers: ["7", "9"],
};

beforeAll(() => {
  globalThis.URL.createObjectURL ??= vi.fn();
  globalThis.URL.revokeObjectURL ??= vi.fn();
});

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

async function mountMistakesCollection() {
  const { default: MistakesCollection } = await import('./MistakesCollection.vue');
  return mount(MistakesCollection, {
    global: { plugins: [createPinia()] },
  });
}

describe("MistakesCollection", () => {
  it("shows empty state when no mistakes", async () => {
    const wrapper = await mountMistakesCollection();
    expect(wrapper.text()).toContain("暂无错题记录");
  });

  it("renders mistake table when data exists", async () => {
    localStorage.setItem("OC_MistakesCount", "1");
    localStorage.setItem("OC_MistakesQuestions_1", JSON.stringify([mockMistake]));
    const wrapper = await mountMistakesCollection();
    expect(wrapper.text()).toContain("3+5");
    expect(wrapper.text()).toContain("8");
    expect(wrapper.text()).toContain("7,9");
  });

  it("renders action buttons", async () => {
    const wrapper = await mountMistakesCollection();
    expect(wrapper.text()).toContain("返回主页");
    expect(wrapper.text()).toContain("导出记录");
    expect(wrapper.text()).toContain("清空错题本");
  });

  it("export button triggers file downloader", async () => {
    localStorage.setItem("OC_MistakesCount", "1");
    localStorage.setItem("OC_MistakesQuestions_1", JSON.stringify([mockMistake]));
    const wrapper = await mountMistakesCollection();
    const buttons = wrapper.findAll('button');
    const exportBtn = buttons.find(b => b.text().includes("导出记录"));
    expect(exportBtn).toBeDefined();
    await exportBtn!.trigger('click');
    const JsFileDownloader = (await import('js-file-downloader')).default;
    expect(JsFileDownloader).toHaveBeenCalled();
  });
});
