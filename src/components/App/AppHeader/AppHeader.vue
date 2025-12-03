<script setup lang="ts">
import Button from 'primevue/button';
import { useRaceStore } from '@/stores/useRaceStore';
import { useI18n } from 'vue-i18n';

const raceStore = useRaceStore();
const { t } = useI18n();

const onStartStopRace = () => {
  if (raceStore.isRacing) {
    if (raceStore.isPaused) {
      raceStore.resumeRace();
    } else {
      raceStore.pauseRace();
    }
  } else {
    raceStore.startRace();
  }
};
</script>

<template>
  <header class="app-header">
    <div class="container app-header__container">
      <div class="app-header__left">
        <h1 class="app-header__title">{{ t('common.app-name') }}</h1>
      </div>

      <div class="app-header__actions">
        <Button @click="raceStore.generateProgram" :disabled="raceStore.isRacing">
          {{ t('common.generate') }}
        </Button>

        <Button
          @click="onStartStopRace"
          severity="secondary"
          :loading="raceStore.isRacing"
          :disabled="!raceStore.hasProgram && !raceStore.isRacing"
        >
          <template v-if="raceStore.isRacing && !raceStore.isPaused">
            {{ t('common.pause') }}
            <i class="pi pi-spin pi-spinner"></i>
          </template>

          <template v-else-if="raceStore.isRacing && raceStore.isPaused">
            {{ t('common.start') }} <i class="pi pi-play"></i>
          </template>

          <template v-else>
            {{ t('common.start') }}
          </template>
        </Button>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped src="./AppHeader.scss" />
