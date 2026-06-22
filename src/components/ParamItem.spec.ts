// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import useSettingStore from '@/store/setting';

import type { ParamConfig } from '@/question';

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});

function integerConfig(overrides: Partial<ParamConfig> = {}): ParamConfig {
  return { key: 'digits', name: "位数", type: 'integer', min: 1, default: 2, ...overrides } as ParamConfig;
}

function selectConfig(overrides: Partial<ParamConfig> = {}): ParamConfig {
  return { key: 'mixedSetting', name: "加减法选项", type: 'select', choices: ["全部加减混合", "随机决定", "全部连加或连减"], default: 0, ...overrides } as ParamConfig;
}

function booleanConfig(overrides: Partial<ParamConfig> = {}): ParamConfig {
  return { key: 'allowNegative', name: "允许负数", type: 'boolean', default: 0, ...overrides } as ParamConfig;
}

describe("ParamItem", () => {
  describe("value fallback", () => {
    async function testDefault(key: string, config: ParamConfig) {
      const { default: ParamItem } = await import('./ParamItem.vue');
      const wrapper = mount(ParamItem, {
        props: { config, i: 0 },
      });
      return wrapper;
    }

    it("integer: renders default when default prop is undefined", async () => {
      const wrapper = await testDefault('digits', integerConfig());
      const input = wrapper.find('input[type="number"]');
      expect(input.exists()).toBe(true);
      expect((input.element as HTMLInputElement).value).toBe('2');
    });

    it("integer: renders default when default prop is empty string", async () => {
      const { default: ParamItem } = await import('./ParamItem.vue');
      const wrapper = mount(ParamItem, {
        props: { config: integerConfig(), i: 0, default: '' },
      });
      const input = wrapper.find('input[type="number"]');
      expect((input.element as HTMLInputElement).value).toBe('2');
    });

    it("integer: uses default prop value when provided", async () => {
      const { default: ParamItem } = await import('./ParamItem.vue');
      const wrapper = mount(ParamItem, {
        props: { config: integerConfig(), i: 0, default: '4' },
      });
      const input = wrapper.find('input[type="number"]');
      expect((input.element as HTMLInputElement).value).toBe('4');
    });

    it("select: renders default when default prop is undefined", async () => {
      const wrapper = await testDefault('mixedSetting', selectConfig());
      const select = wrapper.find('select');
      expect(select.exists()).toBe(true);
      expect((select.element as HTMLSelectElement).value).toBe('0');
    });

    it("select: renders default when default prop is empty string", async () => {
      const { default: ParamItem } = await import('./ParamItem.vue');
      const wrapper = mount(ParamItem, {
        props: { config: selectConfig(), i: 0, default: '' },
      });
      const select = wrapper.find('select');
      expect((select.element as HTMLSelectElement).value).toBe('0');
    });

    it('select: uses default prop value when provided', async () => {
      const { default: ParamItem } = await import('./ParamItem.vue');
      const wrapper = mount(ParamItem, {
        props: { config: selectConfig(), i: 0, default: '2' },
      });
      const select = wrapper.find('select');
      expect((select.element as HTMLSelectElement).value).toBe('2');
    });

    it("boolean: renders off when default prop is undefined", async () => {
      const wrapper = await testDefault('allowNegative', booleanConfig());
      const label = wrapper.find('.toggle-label');
      expect(label.text()).toBe('关闭');
    });

    it("boolean: renders off when default prop is empty string", async () => {
      const { default: ParamItem } = await import('./ParamItem.vue');
      const wrapper = mount(ParamItem, {
        props: { config: booleanConfig(), i: 0, default: '' },
      });
      const label = wrapper.find('.toggle-label');
      expect(label.text()).toBe('关闭');
    });

    it("boolean: renders on when default prop is '1'", async () => {
      const { default: ParamItem } = await import('./ParamItem.vue');
      const wrapper = mount(ParamItem, {
        props: { config: booleanConfig(), i: 0, default: '1' },
      });
      const label = wrapper.find('.toggle-label');
      expect(label.text()).toBe('开启');
    });
  });

  describe("select change persists value", () => {
    it("saves selected option to setting.params and localStorage", async () => {
      const { default: ParamItem } = await import('./ParamItem.vue');
      const store = useSettingStore();
      expect(store.params).toEqual([]);

      const wrapper = mount(ParamItem, {
        props: { config: selectConfig(), i: 2, default: '0' },
      });

      const select = wrapper.find('select');
      await select.setValue('1');

      expect(store.params[2]).toBe('1');
      expect(localStorage.getItem('OC_Params_add')).toBe(',,1');
    });
  });

  describe("boolean toggle persists value", () => {
    it("saves toggled value to setting.params and localStorage", async () => {
      const { default: ParamItem } = await import('./ParamItem.vue');
      const store = useSettingStore();

      const wrapper = mount(ParamItem, {
        props: { config: booleanConfig(), i: 3, default: '0' },
      });

      const toggle = wrapper.find('.toggle-switch');
      await toggle.trigger('click');

      expect(store.params[3]).toBe('1');
      expect(localStorage.getItem('OC_Params_add')).toBe(',,,1');
    });
  });

  describe("digit quick buttons persist value", () => {
    it("saves clicked digit to setting.params", async () => {
      const { default: ParamItem } = await import('./ParamItem.vue');
      const store = useSettingStore();

      const wrapper = mount(ParamItem, {
        props: { config: integerConfig(), i: 0, default: '2' },
      });

      const btn3 = wrapper.findAll('.quick-btn').filter(w => w.text() === '3');
      expect(btn3.length).toBeGreaterThan(0);
      await btn3[0].trigger('click');
      expect(store.params[0]).toBe('3');
    });
  });
});
