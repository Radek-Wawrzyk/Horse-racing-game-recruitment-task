import { defineStore } from 'pinia';
import { useHorseGenerator } from '@/composables/useHorseGenerator';
import { useRaceSimulation } from '@/composables/useRaceSimulation';
import { useProgramGenerator } from '@/composables/useProgramGenerator';
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { RACE_ROUNDS_BREAK_INTERVAL } from '@/constants/Race';
import { raceStoreLogger } from '@/utils/logger';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

import type { RaceHorse } from '@/types/Race';
import type { RaceRound, RaceHorsePosition } from '@/types/Race';

export const useRaceStore = defineStore('race', () => {
  const { add } = useToast();
  const { t } = useI18n();
  const { generateRandomHorses } = useHorseGenerator();
  const { generateProgram: generateProgramFn } = useProgramGenerator();
  const {
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    stopSimulation,
    getRoundResults,
    positions,
    isFinished,
  } = useRaceSimulation();

  const horses = ref<RaceHorse[]>([]);
  const raceProgram = ref<RaceRound[]>([]);
  const isRacing = ref(false);
  const isPaused = ref(false);
  const currentRoundIndex = ref<number | null>(null);
  const activeRaceHorses = ref<RaceHorsePosition[]>([]);

  let nextRoundTimeoutId: ReturnType<typeof setTimeout> | null = null;

  const currentRound = computed(() => {
    if (currentRoundIndex.value === null) return null;
    return raceProgram.value[currentRoundIndex.value] || null;
  });

  const hasProgram = computed(() => raceProgram.value.length > 0);

  const isLastRound = computed(() => {
    if (currentRoundIndex.value === null) return false;
    return currentRoundIndex.value >= raceProgram.value.length - 1;
  });

  const clearNextRoundTimeout = () => {
    if (nextRoundTimeoutId !== null) {
      clearTimeout(nextRoundTimeoutId);
      nextRoundTimeoutId = null;
    }
  };

  const saveRoundResults = () => {
    if (currentRoundIndex.value === null || !currentRound.value) return;

    const currentRoundData = raceProgram.value[currentRoundIndex.value];
    if (currentRoundData && !currentRoundData.results) {
      const results = getRoundResults.value;
      currentRoundData.results = results;
      raceStoreLogger.info('Round results saved', { roundNumber: currentRoundData.roundNumber });
    }
  };

  const moveToNextRound = async () => {
    if (currentRoundIndex.value === null) return;

    if (isLastRound.value) {
      await nextTick();
      finishRace();
    } else {
      await nextTick();
      currentRoundIndex.value = currentRoundIndex.value + 1;
      startCurrentRound();
    }
  };

  const scheduleNextRound = (delay = RACE_ROUNDS_BREAK_INTERVAL) => {
    clearNextRoundTimeout();

    nextRoundTimeoutId = setTimeout(() => {
      if (isRacing.value && !isPaused.value) {
        if (isLastRound.value) {
          finishRace();
        } else {
          if (currentRoundIndex.value !== null) {
            currentRoundIndex.value = currentRoundIndex.value + 1;
            startCurrentRound();
          }
        }
      }
      nextRoundTimeoutId = null;
    }, delay);
  };

  const generateProgram = () => {
    raceProgram.value = generateProgramFn(horses.value);
  };

  const startCurrentRound = () => {
    raceStoreLogger.start('Starting Current Round');

    if (!currentRound.value) return;

    stopSimulation();
    startSimulation({
      distance: currentRound.value.distance,
      horses: currentRound.value.horses,
    });
  };

  const startRace = async () => {
    raceStoreLogger.info('Starting Race');

    if (!hasProgram.value) return;

    stopSimulation();
    clearNextRoundTimeout();

    isRacing.value = true;
    isPaused.value = false;
    currentRoundIndex.value = 0;

    await nextTick();

    if (currentRound.value) {
      startCurrentRound();
    }
  };

  const pauseRace = () => {
    raceStoreLogger.info('Pausing Race');
    isPaused.value = true;
    clearNextRoundTimeout();
  };

  const resumeRace = async () => {
    raceStoreLogger.info('Resuming Race');
    isPaused.value = false;

    // INFO: If the current round is finished and we were waiting for next round,
    // proceed to next round immediately
    if (isFinished.value && currentRound.value && currentRoundIndex.value !== null) {
      saveRoundResults();
      await moveToNextRound();
    }
  };

  const stopRace = () => {
    raceStoreLogger.info('Stopping Race');
    isRacing.value = false;
    isPaused.value = false;
    currentRoundIndex.value = null;
    clearNextRoundTimeout();
  };

  const finishRace = () => {
    raceStoreLogger.info('Finishing Race - All rounds completed');
    stopRace();
    stopSimulation();

    add({
      severity: 'success',
      summary: t('race.finish-race-summary'),
      detail: t('race.finish-race-detail'),
      life: 3000,
    });
  };

  const init = () => {
    raceStoreLogger.info('Init');
    horses.value = generateRandomHorses();
  };

  const cleanup = () => {
    stopSimulation();
    clearNextRoundTimeout();
    raceStoreLogger.info('Cleanup');
  };

  watch(
    () => isFinished.value,
    (isFinished) => {
      raceStoreLogger.info('Simulation Finished', { isFinished });

      if (isFinished && currentRound.value && currentRoundIndex.value !== null) {
        saveRoundResults();
        scheduleNextRound();
      }
    },
  );

  watch(
    () => isPaused.value,
    (paused) => {
      if (paused) {
        pauseSimulation();
      } else if (isRacing.value) {
        resumeSimulation();
      }
    },
  );

  watch(
    () => isRacing.value,
    (racing) => {
      if (!racing) stopSimulation();
    },
  );

  watch(
    () => currentRoundIndex.value,
    async (newIndex, oldIndex) => {
      if (newIndex === null || newIndex === oldIndex || !isRacing.value || isPaused.value) {
        return;
      }

      raceStoreLogger.info('Current Round Index Changed', { newIndex, oldIndex });
      await nextTick();

      if (currentRound.value) {
        startCurrentRound();
      }
    },
  );

  watch(
    () => positions.value,
    (positions) => {
      activeRaceHorses.value = positions;
    },
    { deep: true },
  );

  onMounted(() => {
    init();
  });

  return {
    horses,
    raceProgram,
    isRacing,
    isPaused,
    currentRoundIndex,
    currentRound,
    hasProgram,
    activeRaceHorses,

    generateProgram,
    startRace,
    pauseRace,
    resumeRace,
    stopRace,
    finishRace,
    init,
    cleanup,
  };
});
