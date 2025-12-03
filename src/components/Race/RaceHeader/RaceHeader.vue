<script setup lang="ts">
import Button from 'primevue/button';

import { useRaceStore } from '@/stores/useRaceStore';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const raceStore = useRaceStore();
const { t } = useI18n();

const handleRaceControl = () => {
  if (!raceStore.isRacing) {
    raceStore.startRace();
    return;
  }

  if (raceStore.isPaused) {
    raceStore.resumeRace();
    return;
  }

  raceStore.pauseRace();
};

const raceControlLabel = computed(() => {
  if (raceStore.isRacing && !raceStore.isPaused) {
    return t('common.pause');
  }

  if (raceStore.isRacing && raceStore.isPaused) {
    return t('common.start');
  }

  return t('common.start');
});

const raceControlIcon = computed(() => {
  if (raceStore.isRacing && !raceStore.isPaused) {
    return 'pi pi-pause';
  }

  if (raceStore.isRacing && raceStore.isPaused) {
    return 'pi pi-play';
  }

  return 'pi pi-play';
});

const raceControlTooltip = computed(() => {
  if (!raceStore.hasProgram && !raceStore.isRacing) {
    return t('race.disable-tooltip');
  }

  return null;
});
</script>

<template>
  <header class="race-header">
    <div class="container race-header__container">
      <div class="race-header__left">
        <h1 class="race-header__title">{{ t('common.app-name') }}</h1>
      </div>

      <div class="race-header__actions">
        <Button @click="raceStore.generateProgram" :disabled="raceStore.isRacing">
          {{ t('common.generate') }}
        </Button>

        <Button
          class="race-header__control-button"
          @click="handleRaceControl"
          severity="secondary"
          icon-pos="right"
          :label="raceControlLabel"
          :icon="raceControlIcon"
          :disabled="!raceStore.hasProgram && !raceStore.isRacing"
          v-tooltip.bottom="raceControlTooltip"
        />

        <Button
          @click="raceStore.restartRace"
          severity="secondary"
          variant="outlined"
          icon="pi pi-refresh"
          :label="t('common.restart')"
          :disabled="!raceStore.hasProgram && !raceStore.isRacing"
        />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped src="./RaceHeader.scss" />
