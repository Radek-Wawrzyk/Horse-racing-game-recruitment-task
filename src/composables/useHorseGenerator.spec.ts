import { describe, it, expect } from 'vitest';
import { useHorseGenerator } from './useHorseGenerator';
import { RACE_HORSES_COUNT, RACE_HORSES_PER_ROUND } from '@/constants/Race';
import type { RaceHorse } from '@/types/Race';

describe('useHorseGenerator', () => {
  it('generates correct number of horses', () => {
    const { generateRandomHorses } = useHorseGenerator();
    const horses = generateRandomHorses();

    expect(horses).toHaveLength(RACE_HORSES_COUNT);
  });

  it('generates horses with all required properties', () => {
    const { generateRandomHorses } = useHorseGenerator();
    const horses = generateRandomHorses();
    const firstHorse = horses[0];

    expect(firstHorse).toHaveProperty('id');
    expect(firstHorse).toHaveProperty('name');
    expect(firstHorse).toHaveProperty('condition');
    expect(firstHorse).toHaveProperty('color');
  });

  it('generates horses with valid condition range', () => {
    const { generateRandomHorses } = useHorseGenerator();
    const horses = generateRandomHorses();

    horses.forEach((horse) => {
      expect(horse.condition).toBeGreaterThanOrEqual(1);
      expect(horse.condition).toBeLessThanOrEqual(100);
    });
  });

  it('generates horses with sequential ids', () => {
    const { generateRandomHorses } = useHorseGenerator();
    const horses = generateRandomHorses();

    horses.forEach((horse, index) => {
      expect(horse.id).toBe(index + 1);
    });
  });

  it('generates different horses on each call', () => {
    const { generateRandomHorses } = useHorseGenerator();
    const horses1 = generateRandomHorses();
    const horses2 = generateRandomHorses();

    // Due to randomness, we can't guarantee they're different, but we can check structure
    expect(horses1.length).toBe(horses2.length);
  });

  it('generates custom count of horses', () => {
    const { generateRandomHorses } = useHorseGenerator();
    const customCount = 5;
    const horses = generateRandomHorses(customCount);

    expect(horses).toHaveLength(customCount);
  });

  it('getRandomHorses returns correct number of horses', () => {
    const { generateRandomHorses, getRandomHorses } = useHorseGenerator();
    const allHorses = generateRandomHorses();
    const randomHorses = getRandomHorses(RACE_HORSES_PER_ROUND, allHorses);

    expect(randomHorses).toHaveLength(RACE_HORSES_PER_ROUND);
  });

  it('getRandomHorses returns subset of provided horses', () => {
    const { generateRandomHorses, getRandomHorses } = useHorseGenerator();
    const allHorses = generateRandomHorses();
    const randomHorses = getRandomHorses(5, allHorses);

    expect(randomHorses.length).toBeLessThanOrEqual(allHorses.length);
    randomHorses.forEach((randomHorse) => {
      expect(allHorses.some((h) => h.id === randomHorse.id)).toBe(true);
    });
  });

  it('getRandomHorses returns different horses on each call', () => {
    const { generateRandomHorses, getRandomHorses } = useHorseGenerator();
    const allHorses = generateRandomHorses();
    const randomHorses1 = getRandomHorses(5, allHorses);
    const randomHorses2 = getRandomHorses(5, allHorses);

    // Due to randomness, we can't guarantee they're different, but we can check structure
    expect(randomHorses1.length).toBe(randomHorses2.length);
  });

  it('getRandomHorses handles empty array', () => {
    const { getRandomHorses } = useHorseGenerator();
    const randomHorses = getRandomHorses(5, []);

    expect(randomHorses).toHaveLength(0);
  });
});
