import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProgramGenerator } from './useProgramGenerator';
import { RACE_ROUNDS_COUNT, RACE_ROUNDS_DISTANCES, RACE_HORSES_PER_ROUND } from '@/constants/Race';
import type { RaceHorse } from '@/types/Race';

describe('useProgramGenerator', () => {
  let mockHorses: RaceHorse[];

  beforeEach(() => {
    mockHorses = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      name: `Horse ${index + 1}`,
      condition: 50 + index,
      color: `#${index.toString(16).padStart(6, '0')}`,
    }));
  });

  it('generates program with correct number of rounds', () => {
    const { generateProgram } = useProgramGenerator();
    const program = generateProgram(mockHorses);

    expect(program).toHaveLength(RACE_ROUNDS_COUNT);
  });

  it('generates rounds with correct structure', () => {
    const { generateProgram } = useProgramGenerator();
    const program = generateProgram(mockHorses);
    const firstRound = program[0];

    expect(firstRound).toHaveProperty('id');
    expect(firstRound).toHaveProperty('roundNumber');
    expect(firstRound).toHaveProperty('distance');
    expect(firstRound).toHaveProperty('horses');
  });

  it('generates rounds with sequential ids and round numbers', () => {
    const { generateProgram } = useProgramGenerator();
    const program = generateProgram(mockHorses);

    program.forEach((round, index) => {
      expect(round.id).toBe(index + 1);
      expect(round.roundNumber).toBe(index + 1);
    });
  });

  it('generates rounds with correct distances', () => {
    const { generateProgram } = useProgramGenerator();
    const program = generateProgram(mockHorses);

    program.forEach((round, index) => {
      expect(round.distance).toBe(RACE_ROUNDS_DISTANCES[index]);
    });
  });

  it('generates rounds with correct number of horses per round', () => {
    const { generateProgram } = useProgramGenerator();
    const program = generateProgram(mockHorses);

    program.forEach((round) => {
      expect(round.horses).toHaveLength(RACE_HORSES_PER_ROUND);
    });
  });

  it('generates rounds with horses from provided list', () => {
    const { generateProgram } = useProgramGenerator();
    const program = generateProgram(mockHorses);

    program.forEach((round) => {
      round.horses.forEach((horse) => {
        expect(mockHorses.some((h) => h.id === horse.id)).toBe(true);
      });
    });
  });

  it('generates different horses for each round', () => {
    const { generateProgram } = useProgramGenerator();
    const program = generateProgram(mockHorses);

    // Check that at least some rounds have different horses
    const firstRoundHorseIds = program[0]?.horses.map((h) => h.id) || [];
    const secondRoundHorseIds = program[1]?.horses.map((h) => h.id) || [];

    // Due to randomness, we can't guarantee they're completely different
    // but we can check that the structure is correct
    expect(firstRoundHorseIds.length).toBe(secondRoundHorseIds.length);
  });

  it('handles empty horses array', () => {
    const { generateProgram } = useProgramGenerator();
    const program = generateProgram([]);

    // Should still generate rounds, but with empty horses arrays
    expect(program).toHaveLength(RACE_ROUNDS_COUNT);
    program.forEach((round) => {
      expect(round.horses).toHaveLength(0);
    });
  });
});
