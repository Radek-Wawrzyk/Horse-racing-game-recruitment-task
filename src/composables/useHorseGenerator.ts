import type { RaceHorse } from '@/types/Race';
import { RACE_HORSES_COUNT, RACE_HORSES_PER_ROUND } from '@/constants/Race';

const HORSE_NAMES = [
  'Thunder',
  'Lightning',
  'Storm',
  'Shadow',
  'Blaze',
  'Spirit',
  'Midnight',
  'Champion',
  'Victory',
  'Phoenix',
  'Apollo',
  'Zeus',
  'Athena',
  'Hercules',
  'Pegasus',
  'Flash',
  'Rocket',
  'Comet',
  'Star',
  'Legend',
];

const COLORS = [
  '#E74C3C',
  '#3498DB',
  '#2ECC71',
  '#F39C12',
  '#9B59B6',
  '#1ABC9C',
  '#E67E22',
  '#34495E',
  '#E91E63',
  '#00BCD4',
  '#607D8B',
  '#8E44AD',
  '#27AE60',
  '#D35400',
  '#2C3E50',
  '#C0392B',
  '#16A085',
  '#7F8C8D',
  '#2980B9',
  '#212121',
];

const useHorseGenerator = () => {
  const generateRandomHorses = (count = RACE_HORSES_COUNT): RaceHorse[] => {
    // INFO: Shuffle names and colors to make each generation random
    const shuffledNames = [...HORSE_NAMES].sort(() => Math.random() - 0.5);
    const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);

    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: shuffledNames[index] || `Horse ${index + 1}`,
      condition: Math.floor(Math.random() * 100) + 1,
      color: shuffledColors[index] || '#000000',
    }));
  };

  const getRandomHorses = (count = RACE_HORSES_PER_ROUND, horses: RaceHorse[]): RaceHorse[] => {
    return [...horses].sort(() => Math.random() - 0.5).slice(0, count);
  };

  return {
    generateRandomHorses,
    getRandomHorses,
  };
};

export { useHorseGenerator };
