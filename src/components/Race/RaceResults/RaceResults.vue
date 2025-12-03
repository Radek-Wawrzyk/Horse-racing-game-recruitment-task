<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRaceStore } from '@/stores/useRaceStore';
import type { RaceHorse } from '@/types/Race';

const raceStore = useRaceStore();

const getHorsesWithPosition = (horses: RaceHorse[]) => {
  return horses.map((horse, index) => ({
    ...horse,
    position: index + 1,
  }));
};

const getPositionDisplay = (position: number): string => {
  if (position === 1) return `${position}🥇`;
  if (position === 2) return `${position}🥈`;
  if (position === 3) return `${position}🥉`;

  return position.toString();
};
</script>

<template>
  <div class="race-results">
    <div class="race-results__column race-results__column--program">
      <h2 class="race-results__title">{{ $t('race.program-title') }}</h2>

      <div class="race-results__content">
        <div v-for="round in raceStore.raceProgram" :key="round.id" class="race-results__round">
          <h3 class="race-results__round-title">
            {{ round.roundNumber }}st {{ $t('race.lap') }} - {{ round.distance }}m
          </h3>

          <DataTable :value="getHorsesWithPosition(round.horses)" size="small">
            <Column field="position" :header="$t('race.lane-position')" />
            <Column field="name" :header="$t('race.name')" />
          </DataTable>
        </div>
      </div>
    </div>

    <div class="race-results__column race-results__column--results">
      <h2 class="race-results__title">{{ $t('race.results-title') }}</h2>
      <div class="race-results__content">
        <div v-for="round in raceStore.raceProgram" :key="round.id" class="race-results__round">
          <template v-if="round.results">
            <h3 class="race-results__round-title">
              {{ round.roundNumber }}st {{ $t('race.lap') }} - {{ round.distance }}m
            </h3>

            <DataTable
              :value="round.results ? getHorsesWithPosition(round.results) : []"
              size="small"
            >
              <Column field="position" :header="$t('race.position')">
                <template #body="{ data }">
                  <span class="race-results__position-display">{{
                    getPositionDisplay(data.position)
                  }}</span>
                </template>
              </Column>
              <Column field="name" :header="$t('race.name')" />
            </DataTable>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./RaceResults.scss" />
