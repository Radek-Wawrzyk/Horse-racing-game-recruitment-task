import { defineStore } from 'pinia';

export const useRaceStore = defineStore('race', () => {
  const init = () => {
    console.log('init game');
  };

  return { init };
});
