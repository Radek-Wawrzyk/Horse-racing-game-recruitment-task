interface RaceHorse {
  id: number;
  name: string;
  condition: number;
  color: string;
}

interface RaceRound {
  id: number;
  roundNumber: number;
  distance: number;
  horses: RaceHorse[];
  results?: RaceHorse[];
}

interface RaceHorsePosition {
  horse: RaceHorse;
  position: number;
  lane: number;
  progress: number;
  distance: number;
}

export type { RaceRound, RaceHorsePosition, RaceHorse };
