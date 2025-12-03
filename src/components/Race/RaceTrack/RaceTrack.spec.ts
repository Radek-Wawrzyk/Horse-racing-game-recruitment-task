import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import RaceTrack from './RaceTrack.vue';
import { setupTestEnv } from '@/__tests__/helpers';
import { useRaceStore } from '@/stores/useRaceStore';
import type { RaceRound } from '@/types/Race';

describe('RaceTrack', () => {
  beforeEach(() => {
    const { pinia } = setupTestEnv();
    setActivePinia(pinia);
  });

  it('renders the component', () => {
    const { pinia, i18n, tooltipDirective } = setupTestEnv();
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
      },
    });

    expect(wrapper.find('.race-track').exists()).toBe(true);
  });

  it('displays empty state when no current round', () => {
    const { pinia, i18n, tooltipDirective } = setupTestEnv();
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
      },
    });

    expect(wrapper.find('.race-track__empty').exists()).toBe(true);
    expect(wrapper.text()).toContain('race.generate-and-start');
  });

  it('displays track content when current round exists', async () => {
    const { pinia, i18n, tooltipDirective } = setupTestEnv();
    setActivePinia(pinia);
    
    // Mount with i18n first to provide context
    const tempWrapper = mount(RaceTrack, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
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
    store.currentRoundIndex = 0;
    tempWrapper.unmount();

    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
      },
    });

    expect(wrapper.find('.race-track__content').exists()).toBe(true);
    expect(wrapper.find('.race-track__lanes').exists()).toBe(true);
    expect(wrapper.find('.race-track__track-area').exists()).toBe(true);
  });

  it('displays finish label', () => {
    const { pinia, i18n, tooltipDirective } = setupTestEnv();
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
      },
    });

    expect(wrapper.find('.race-track__finish-label').exists()).toBe(true);
  });
});

