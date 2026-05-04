// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Duration from './Duration.vue';

describe('Duration', () => {
  it('renders 1.500″ for 1500ms', () => {
    const wrapper = mount(Duration, { props: { duration: 1500 } });
    expect(wrapper.find('.dur-int').text()).toBe('1');
    expect(wrapper.find('.dur-frac').text()).toBe('.500');
  });

  it('renders 0.500″ for 500ms', () => {
    const wrapper = mount(Duration, { props: { duration: 500 } });
    expect(wrapper.find('.dur-int').text()).toBe('0');
    expect(wrapper.find('.dur-frac').text()).toBe('.500');
  });

  it('renders 3.000″ for 3000ms', () => {
    const wrapper = mount(Duration, { props: { duration: 3000 } });
    expect(wrapper.find('.dur-int').text()).toBe('3');
    expect(wrapper.find('.dur-frac').text()).toBe('.000');
  });

  it('pads fraction part with leading zeros', () => {
    const wrapper = mount(Duration, { props: { duration: 1234 } });
    expect(wrapper.find('.dur-int').text()).toBe('1');
    expect(wrapper.find('.dur-frac').text()).toBe('.234');
  });
});
