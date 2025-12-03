<script setup lang="ts">
import { useRaceStore } from '@/stores/useRaceStore';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const raceStore = useRaceStore();
const { t } = useI18n();

const currentRoundLabel = computed(() => {
  if (!raceStore.currentRound) return '';
  return `${raceStore.currentRound.roundNumber}st ${t('race.lap')} ${raceStore.currentRound.distance}m`;
});
</script>

<template>
  <div class="race-track">
    <div v-if="raceStore.currentRound" class="race-track__content">
      <div class="race-track__lanes">
        <div v-for="position in 10" :key="position" class="race-track__lane-number">
          {{ position }}
        </div>
      </div>

      <div class="race-track__track-area">
        <div
          v-tooltip.bottom="position.horse.name"
          v-for="position in raceStore.activeRaceHorses"
          :key="position.horse.id"
          class="race-track__horse"
          :style="{
            left: `${position.progress}%`,
            top: `${(position.lane - 1) * 10}%`,
          }"
        >
          <div class="race-track__horse-icon" :style="{ backgroundColor: position.horse.color }">
            🐴
          </div>
        </div>

        <div
          v-for="position in 10"
          :key="position"
          class="race-track__lane-line"
          :style="{ top: `${(position - 1) * 10}%` }"
        />
      </div>

      <div class="race-track__finish-line" />
    </div>

    <div v-else class="race-track__empty">
      <p>{{ t('race.generate-and-start') }}</p>
    </div>

    <div class="race-track__footer">
      <span class="race-track__lap-label">{{ currentRoundLabel }}</span>
      <span class="race-track__finish-label">FINISH</span>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./RaceTrack.scss" />
