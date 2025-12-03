import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import RaceHeader from './RaceHeader.vue';
import { setupTestEnv } from '@/__tests__/helpers';
import { useRaceStore } from '@/stores/useRaceStore';

describe('RaceHeader', () => {
  beforeEach(() => {
    const { pinia } = setupTestEnv();
    setActivePinia(pinia);
  });

  it('renders the component', () => {
    const { pinia, i18n, tooltipDirective } = setupTestEnv();
    const wrapper = mount(RaceHeader, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
      },
    });

    expect(wrapper.find('.race-header').exists()).toBe(true);
    expect(wrapper.find('.race-header__title').exists()).toBe(true);
  });

  it('displays app name', () => {
    const { pinia, i18n, tooltipDirective } = setupTestEnv();
    const wrapper = mount(RaceHeader, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
      },
    });

    expect(wrapper.text()).toContain('common.app-name');
  });

  it('renders generate program button', () => {
    const { pinia, i18n, tooltipDirective } = setupTestEnv();
    const wrapper = mount(RaceHeader, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
      },
    });

    const generateButton = wrapper.find('button');
    expect(generateButton.exists()).toBe(true);
  });

  it('calls generateProgram when generate button is clicked', async () => {
    const { pinia, i18n, tooltipDirective } = setupTestEnv();
    setActivePinia(pinia);

    // Mount with i18n first to provide context
    const tempWrapper = mount(RaceHeader, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
      },
    });

    const store = useRaceStore();
    const generateProgramSpy = vi.spyOn(store, 'generateProgram');
    tempWrapper.unmount();

    const wrapper = mount(RaceHeader, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThan(0);

    if (buttons[0]) {
      await buttons[0].trigger('click');
    }

    expect(generateProgramSpy).toHaveBeenCalled();
  });
});
