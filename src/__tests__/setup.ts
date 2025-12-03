import { vi } from 'vitest';

// Mock PrimeVue Toast before any imports
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
  }),
}));

