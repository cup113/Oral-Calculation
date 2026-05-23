// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';

vi.mock('vue-m-message', () => ({
  default: {
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const Home = { template: '<div />' };
const Exercise = { template: '<div />' };

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});

describe("Welcome", () => {
  it("renders title and category selector", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: Home },
        { path: '/welcome', component: Home },
        { path: '/exercise/:category/:params/:quantity', component: Exercise },
      ],
    });
    const { default: Welcome } = await import('./Welcome.vue');
    const wrapper = mount(Welcome, {
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain("口算练习");
    expect(wrapper.find('select').exists()).toBe(true);
  });

  it("shows warning when submitting without category", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: Home },
        { path: '/welcome', component: Home },
        { path: '/exercise/:category/:params/:quantity', component: Exercise },
      ],
    });
    const { default: Welcome } = await import('./Welcome.vue');
    const wrapper = mount(Welcome, {
      global: { plugins: [router] },
    });
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');
    const Message = (await import('vue-m-message')).default;
    expect(Message.warning).toHaveBeenCalledWith("请选择类别");
  });

  it("navigates to exercise on valid form submission", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: Home },
        { path: '/welcome', component: Home },
        { path: '/exercise/:category/:params/:quantity', component: Exercise },
      ],
    });
    const pushSpy = vi.spyOn(router, 'push');

    const { default: Welcome } = await import('./Welcome.vue');
    const wrapper = mount(Welcome, {
      global: { plugins: [router] },
    });

    // Select a category
    const select = wrapper.find('select');
    await select.setValue('add');

    // Set quantity
    const quantityInput = wrapper.find('input#quantity');
    await quantityInput.setValue('5');

    // Submit
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(pushSpy).toHaveBeenCalled();
    const url = pushSpy.mock.calls[0][0] as string;
    expect(url).toContain("/exercise/add/");
  });

  it("renders quick quantity buttons", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: Home },
        { path: '/welcome', component: Home },
        { path: '/exercise/:category/:params/:quantity', component: Exercise },
      ],
    });
    const { default: Welcome } = await import('./Welcome.vue');
    const wrapper = mount(Welcome, {
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain("5");
    expect(wrapper.text()).toContain("10");
    expect(wrapper.text()).toContain("20");
  });
});
