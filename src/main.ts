import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Tooltip from 'primevue/tooltip';

import './styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { i18n } from './i18n';

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
    },
  },
});

app.directive('tooltip', Tooltip);
app.mount('#app');
