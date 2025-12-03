import { createConsola } from 'consola';

const logger = createConsola({
  level: import.meta.env.DEV ? 4 : 0,
  formatOptions: {
    date: true,
    colors: true,
  },
});

const raceStoreLogger = logger.withTag('race');

export { raceStoreLogger };
