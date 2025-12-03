<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRaceStore } from '@/stores/useRaceStore';
import type { Horse } from '@/types/Hourse';

const raceStore = useRaceStore();

const getHorsesWithPosition = (horses: Horse[]) => {
  return horses.map((horse, index) => ({
    ...horse,
    position: index + 1,
  }));
};
</script>

<template>
  <div class="program-results">
    <div class="program-results__column program-results__column--program">
      <h2 class="program-results__title">{{ $t('race.program-title') }}</h2>

      <div class="program-results__content">
        <div v-for="round in raceStore.raceProgram" :key="round.id" class="program-results__round">
          <h3 class="program-results__round-title">
            {{ round.roundNumber }}st {{ $t('race.lap') }} - {{ round.distance }}m
          </h3>

          <DataTable :value="getHorsesWithPosition(round.horses)" size="small" showGridlines>
            <Column field="position" header="Position" />
            <Column field="name" header="Name" />
          </DataTable>
        </div>
      </div>
    </div>

    <div class="program-results__column program-results__column--results">
      <h2 class="program-results__title">{{ $t('race.results-title') }}</h2>
      <div class="program-results__content">
        <div v-for="round in raceStore.raceProgram" :key="round.id" class="program-results__round">
          <h3 class="program-results__round-title">
            {{ round.roundNumber }}st {{ $t('race.lap') }} - {{ round.distance }}m
          </h3>

          <DataTable
            :value="round.results ? getHorsesWithPosition(round.results) : []"
            size="small"
            showGridlines
          >
            <Column field="position" header="Position" />
            <Column field="name" header="Name" />
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./ProgramResults.scss" />
