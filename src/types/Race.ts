import type { Horse } from './Hourse';

interface RaceRound {
  id: number;
  roundNumber: number;
  distance: number;
  horses: Horse[];
  results?: Horse[];
}

interface RaceHorsePosition {
  horse: Horse;
  position: number;
  lane: number;
  progress: number;
  distance: number;
}

export type { RaceRound, RaceHorsePosition };
