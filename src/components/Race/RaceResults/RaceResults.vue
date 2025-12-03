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
            <Column field="position" header="Position" />
            <Column field="name" header="Name" />
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
              <Column field="position" header="Position" />
              <Column field="name" header="Name" />
            </DataTable>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./RaceResults.scss" />
