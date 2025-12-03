import type { Horse } from '@/types/Hourse';
import { HORSE_COUNT, HOURSE_ROUND_COUNT } from '@/constants/Hourse';

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
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B500',
  '#FF85A2',
  '#5DADE2',
  '#58D68D',
  '#EC7063',
  '#AF7AC5',
  '#F39C12',
  '#3498DB',
  '#1ABC9C',
  '#E74C3C',
  '#9B59B6',
  '#F1C40F',
];

const useHorseGenerator = () => {
  const generateHorses = (count = HORSE_COUNT): Horse[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: HORSE_NAMES[index] || '',
      condition: Math.floor(Math.random() * 100) + 1,
      color: COLORS[index] || '',
    }));
  };

  const getRandomHorses = (count = HOURSE_ROUND_COUNT, horses: Horse[]): Horse[] => {
    return [...horses].sort(() => Math.random() - 0.5).slice(0, count);
  };

  return {
    generateHorses,
    getRandomHorses,
  };
};

export { useHorseGenerator };
