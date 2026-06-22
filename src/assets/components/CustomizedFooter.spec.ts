// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("CustomizedFooter", () => {
  it("renders version and license", async () => {
    const { default: CustomizedFooter } = await import('./CustomizedFooter.vue');
    const wrapper = mount(CustomizedFooter, {
      props: {
        remoteUrl: 'https://github.com/test/repo',
        version: '0.7.0',
        license: 'MIT',
        years: '2023-2026',
        detailed: true,
      },
    });
    expect(wrapper.text()).toContain("v0.7.0");
    expect(wrapper.text()).toContain("MIT");
  });

  it("renders footer links when detailed", async () => {
    const { default: CustomizedFooter } = await import('./CustomizedFooter.vue');
    const wrapper = mount(CustomizedFooter, {
      props: {
        remoteUrl: 'https://github.com/test/repo',
        version: '0.7.0',
        license: 'MIT',
        years: '2023-2026',
        detailed: true,
      },
    });
    expect(wrapper.text()).toContain("关于");
    expect(wrapper.text()).toContain("反馈");
    expect(wrapper.text()).toContain("源码");
    expect(wrapper.text()).toContain("说明");
    expect(wrapper.text()).toContain("更新");
  });

  it("toggles dark mode on button click", async () => {
    const { default: CustomizedFooter } = await import('./CustomizedFooter.vue');
    const wrapper = mount(CustomizedFooter, {
      props: {
        remoteUrl: 'https://github.com/test/repo',
        version: '0.7.0',
        license: 'MIT',
        years: '2023-2026',
        detailed: true,
      },
    });
    const toggleBtn = wrapper.find('button');
    await toggleBtn.trigger('click');
    expect(localStorage.getItem("OC_DarkMode")).toBe("true");
    await toggleBtn.trigger('click');
    expect(localStorage.getItem("OC_DarkMode")).toBe("false");
  });
});
