import { RACE_ROUNDS_COUNT, RACE_ROUNDS_DISTANCES, RACE_HORSES_PER_ROUND } from '@/constants/Race';
import { raceStoreLogger } from '@/utils/logger';
import { useHorseGenerator } from '@/composables/useHorseGenerator';

import type { RaceHorse } from '@/types/Race';
import type { RaceRound } from '@/types/Race';

export const useProgramGenerator = () => {
  const { getRandomHorses } = useHorseGenerator();

  const generateProgram = (horses: RaceHorse[]): RaceRound[] => {
    raceStoreLogger.start('Generating Program');
    const program: RaceRound[] = [];

    for (let i = 0; i < RACE_ROUNDS_COUNT; i++) {
      const distance = RACE_ROUNDS_DISTANCES[i];
      if (!distance) continue;

      const randomHorses = getRandomHorses(RACE_HORSES_PER_ROUND, horses);

      program.push({
        id: i + 1,
        roundNumber: i + 1,
        distance,
        horses: randomHorses,
      });
    }

    return program;
  };

  return {
    generateProgram,
  };
};
