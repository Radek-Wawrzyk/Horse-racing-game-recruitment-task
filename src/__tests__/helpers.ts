import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { vi } from 'vitest';

export const setupTestEnv = () => {
  const pinia = createPinia();
  setActivePinia(pinia);

  // INFO: Simple i18n mock that returns the key instead of translation
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {},
    },
    missingWarn: false,
    fallbackWarn: false,
  });

  // Override t function to return the key
  i18n.global.t = ((key: string) => key) as typeof i18n.global.t;

  // Mock tooltip directive
  const tooltipDirective = {
    mounted: vi.fn(),
    updated: vi.fn(),
    unmounted: vi.fn(),
  };

  return { pinia, i18n, tooltipDirective };
};
