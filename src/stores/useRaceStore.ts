import { defineStore } from 'pinia';
import { useHorseGenerator } from '@/composables/useHorseGenerator';
import { useRaceSimulation } from '@/composables/useRaceSimulation';
import { ref, computed, watch, nextTick } from 'vue';
import type { Horse } from '@/types/Hourse';
import type { RaceRound, RaceHorsePosition } from '@/types/Race';
import { ROUND_COUNT, ROUND_DISTANCES, HOURSE_ROUND_COUNT } from '@/constants/Hourse';

export const useRaceStore = defineStore('race', () => {
  const { generateHorses, getRandomHorses } = useHorseGenerator();
  const simulation = useRaceSimulation();

  const horses = ref<Horse[]>(generateHorses());
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

  const generateHorsesAction = () => {
    horses.value = generateHorses();
  };

  const generateProgram = () => {
    if (horses.value.length === 0) {
      generateHorsesAction();
    }

    raceProgram.value = [];

    for (let i = 0; i < ROUND_COUNT; i++) {
      const distance = ROUND_DISTANCES[i];
      if (!distance) continue;

      const randomHorses = getRandomHorses(HOURSE_ROUND_COUNT, horses.value);

      raceProgram.value.push({
        id: i + 1,
        roundNumber: i + 1,
        distance,
        horses: randomHorses,
      });
    }
  };

  const startCurrentRound = () => {
    if (!currentRound.value) return;

    simulation.stopSimulation();
    simulation.startSimulation({
      distance: currentRound.value.distance,
      horses: currentRound.value.horses,
    });
  };

  watch(
    () => simulation.positions.value,
    (positions) => {
      activeRaceHorses.value = positions;
    },
    { deep: true },
  );

  watch(
    () => simulation.isFinished.value,
    (isFinished) => {
      if (isFinished && currentRound.value) {
        const results = simulation.getResults.value;
        if (currentRoundIndex.value !== null) {
          const currentRoundData = raceProgram.value[currentRoundIndex.value];
          if (currentRoundData) {
            currentRoundData.results = results;

            if (currentRoundIndex.value < raceProgram.value.length - 1) {
              nextRoundTimeoutId = setTimeout(() => {
                if (isRacing.value && !isPaused.value) {
                  currentRoundIndex.value = currentRoundIndex.value! + 1;
                  startCurrentRound();
                }
                nextRoundTimeoutId = null;
              }, 2000);
            } else {
              nextRoundTimeoutId = setTimeout(() => {
                if (isRacing.value && !isPaused.value) {
                  stopRace();
                  simulation.stopSimulation();
                }
                nextRoundTimeoutId = null;
              }, 2000);
            }
          }
        }
      }
    },
  );

  watch(
    () => isPaused.value,
    (paused) => {
      if (paused) {
        simulation.pauseSimulation();
      } else if (isRacing.value) {
        simulation.resumeSimulation();
      }
    },
  );

  watch(
    () => isRacing.value,
    (racing) => {
      if (!racing) {
        simulation.stopSimulation();
      }
    },
  );

  watch(
    () => currentRoundIndex.value,
    async (newIndex, oldIndex) => {
      if (newIndex !== null && newIndex !== oldIndex && isRacing.value && !isPaused.value) {
        await nextTick();

        if (currentRound.value) {
          startCurrentRound();
        }
      }
    },
  );

  const startRace = async () => {
    if (!hasProgram.value) return;

    simulation.stopSimulation();
    if (nextRoundTimeoutId !== null) {
      clearTimeout(nextRoundTimeoutId);
      nextRoundTimeoutId = null;
    }

    isRacing.value = true;
    isPaused.value = false;
    currentRoundIndex.value = 0;

    await nextTick();

    if (currentRound.value) {
      startCurrentRound();
    }
  };

  const pauseRace = () => {
    isPaused.value = true;
    if (nextRoundTimeoutId !== null) {
      clearTimeout(nextRoundTimeoutId);
      nextRoundTimeoutId = null;
    }
  };

  const resumeRace = async () => {
    isPaused.value = false;

    // INFO: If the current round is finished and we were waiting for next round,
    // proceed to next round immediately
    if (simulation.isFinished.value && currentRound.value && currentRoundIndex.value !== null) {
      const currentRoundData = raceProgram.value[currentRoundIndex.value];
      if (currentRoundData && !currentRoundData.results) {
        // INFO: Results not saved yet, save them first
        const results = simulation.getResults.value;
        currentRoundData.results = results;
      }

      if (currentRoundIndex.value < raceProgram.value.length - 1) {
        await nextTick();
        currentRoundIndex.value = currentRoundIndex.value + 1;
        startCurrentRound();
      } else {
        await nextTick();
        stopRace();
        simulation.stopSimulation();
      }
    }
  };

  const stopRace = () => {
    isRacing.value = false;
    isPaused.value = false;
    currentRoundIndex.value = null;
    if (nextRoundTimeoutId !== null) {
      clearTimeout(nextRoundTimeoutId);
      nextRoundTimeoutId = null;
    }
  };

  const init = () => {
    horses.value = generateHorses();
  };

  const cleanup = () => {
    simulation.stopSimulation();
    if (nextRoundTimeoutId !== null) {
      clearTimeout(nextRoundTimeoutId);
      nextRoundTimeoutId = null;
    }
  };

  return {
    horses,
    raceProgram,
    isRacing,
    isPaused,
    currentRoundIndex,
    currentRound,
    hasProgram,
    activeRaceHorses,

    generateHorses: generateHorsesAction,
    generateProgram,
    startRace,
    pauseRace,
    resumeRace,
    stopRace,
    init,
    cleanup,
  };
});
