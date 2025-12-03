import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RaceLayout from './RaceLayout.vue';

describe('RaceLayout', () => {
  it('renders the component', () => {
    const wrapper = mount(RaceLayout);

    expect(wrapper.find('.race-layout').exists()).toBe(true);
  });

  it('renders header slot', () => {
    const wrapper = mount(RaceLayout, {
      slots: {
        header: '<div class="test-header">Test Header</div>',
      },
    });

    expect(wrapper.find('.test-header').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Header');
  });

  it('renders left sidebar slot', () => {
    const wrapper = mount(RaceLayout, {
      slots: {
        'left-sidebar': '<div class="test-left">Left Content</div>',
      },
    });

    expect(wrapper.find('.test-left').exists()).toBe(true);
    expect(wrapper.text()).toContain('Left Content');
  });

  it('renders main slot', () => {
    const wrapper = mount(RaceLayout, {
      slots: {
        main: '<div class="test-main">Main Content</div>',
      },
    });

    expect(wrapper.find('.test-main').exists()).toBe(true);
    expect(wrapper.text()).toContain('Main Content');
  });

  it('renders footer slot', () => {
    const wrapper = mount(RaceLayout, {
      slots: {
        footer: '<div class="test-footer">Footer Content</div>',
      },
    });

    expect(wrapper.find('.test-footer').exists()).toBe(true);
    expect(wrapper.text()).toContain('Footer Content');
  });

  it('displays left sidebar header prop', () => {
    const wrapper = mount(RaceLayout, {
      props: {
        leftSidebarHeader: 'Left Header',
      },
    });

    expect(wrapper.text()).toContain('Left Header');
  });

  it('displays right sidebar header prop', () => {
    const wrapper = mount(RaceLayout, {
      props: {
        rightSidebarHeader: 'Right Header',
      },
    });

    expect(wrapper.text()).toContain('Right Header');
  });
});

