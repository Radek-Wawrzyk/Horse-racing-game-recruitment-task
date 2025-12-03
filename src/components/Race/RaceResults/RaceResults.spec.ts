import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import RaceResults from './RaceResults.vue';
import { setupTestEnv } from '@/__tests__/helpers';
import { useRaceStore } from '@/stores/useRaceStore';
import type { RaceRound } from '@/types/Race';

describe('RaceResults', () => {
  beforeEach(() => {
    const { pinia } = setupTestEnv();
    setActivePinia(pinia);
  });

  it('renders the component', () => {
    const { pinia, i18n } = setupTestEnv();
    const wrapper = mount(RaceResults, {
      global: {
        plugins: [pinia, i18n],
      },
    });

    expect(wrapper.find('.race-results').exists()).toBe(true);
  });

  it('displays program and results columns', () => {
    const { pinia, i18n } = setupTestEnv();
    const wrapper = mount(RaceResults, {
      global: {
        plugins: [pinia, i18n],
      },
    });

    expect(wrapper.find('.race-results__column--program').exists()).toBe(true);
    expect(wrapper.find('.race-results__column--results').exists()).toBe(true);
  });

  it('displays race program when available', () => {
    const { pinia, i18n } = setupTestEnv();
    setActivePinia(pinia);
    
    // Mount with i18n first to provide context
    const tempWrapper = mount(RaceResults, {
      global: {
        plugins: [pinia, i18n],
      },
    });
    
    const store = useRaceStore();

    const mockRound: RaceRound = {
      id: 1,
      roundNumber: 1,
      distance: 1200,
      horses: [
        {
          id: 1,
          name: 'Thunder',
          condition: 80,
          color: '#E74C3C',
        },
      ],
    };

    store.raceProgram = [mockRound];
    tempWrapper.unmount();

    const wrapper = mount(RaceResults, {
      global: {
        plugins: [pinia, i18n],
      },
    });

    expect(wrapper.find('.race-results__round').exists()).toBe(true);
  });

  it('displays results when available', () => {
    const { pinia, i18n } = setupTestEnv();
    setActivePinia(pinia);
    
    // Mount with i18n first to provide context
    const tempWrapper = mount(RaceResults, {
      global: {
        plugins: [pinia, i18n],
      },
    });
    
    const store = useRaceStore();

    const mockRound: RaceRound = {
      id: 1,
      roundNumber: 1,
      distance: 1200,
      horses: [
        {
          id: 1,
          name: 'Thunder',
          condition: 80,
          color: '#E74C3C',
        },
      ],
      results: [
        {
          id: 1,
          name: 'Thunder',
          condition: 80,
          color: '#E74C3C',
        },
      ],
    };

    store.raceProgram = [mockRound];
    tempWrapper.unmount();

    const wrapper = mount(RaceResults, {
      global: {
        plugins: [pinia, i18n],
      },
    });

    expect(wrapper.text()).toContain('Thunder');
  });
});

