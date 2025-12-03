import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import App from '../App.vue';
import { setupTestEnv } from './helpers';

describe('App', () => {
  it('mounts renders properly', () => {
    const { pinia, i18n, tooltipDirective } = setupTestEnv();
    setActivePinia(pinia);
    
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, i18n],
        directives: {
          tooltip: tooltipDirective,
        },
      },
    });
    
    expect(wrapper.exists()).toBe(true);
  });
});
