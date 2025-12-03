import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import RaceHorseList from './RaceHorseList.vue';
import { setupTestEnv } from '@/__tests__/helpers';
import { useRaceStore } from '@/stores/useRaceStore';
import type { RaceHorse } from '@/types/Race';

describe('RaceHorseList', () => {
  beforeEach(() => {
    const { pinia } = setupTestEnv();
    setActivePinia(pinia);
  });

  it('renders the component', () => {
    const { pinia, i18n } = setupTestEnv();
    const wrapper = mount(RaceHorseList, {
      global: {
        plugins: [pinia, i18n],
      },
    });

    expect(wrapper.find('.race-horse-list').exists()).toBe(true);
  });

  it('displays horses from store', () => {
    const { pinia, i18n } = setupTestEnv();
    setActivePinia(pinia);
    
    // Mount with i18n first to provide context
    const tempWrapper = mount(RaceHorseList, {
      global: {
        plugins: [pinia, i18n],
      },
    });
    
    const store = useRaceStore();

    const mockHorses: RaceHorse[] = [
      {
        id: 1,
        name: 'Thunder',
        condition: 80,
        color: '#E74C3C',
      },
      {
        id: 2,
        name: 'Lightning',
        condition: 90,
        color: '#3498DB',
      },
    ];

    store.horses = mockHorses;
    tempWrapper.unmount();

    const wrapper = mount(RaceHorseList, {
      global: {
        plugins: [pinia, i18n],
      },
    });

    expect(wrapper.text()).toContain('Thunder');
    expect(wrapper.text()).toContain('Lightning');
  });
});

