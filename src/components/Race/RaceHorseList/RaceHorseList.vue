<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { useRaceStore } from '@/stores/useRaceStore';

const raceStore = useRaceStore();
</script>

<template>
  <div class="race-horse-list">
    <h2 class="race-horse-list__title">{{ $t('horses.list-title') }} (1-20)</h2>

    <DataTable :value="raceStore.horses" size="small">
      <Column field="name" header="Name" />
      <Column field="condition" header="Condition" />
      <Column field="color" header="Color">
        <template #body="slotProps">
          <div class="race-horse-list__color" :style="{ backgroundColor: slotProps.data.color }" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lang="scss" scoped src="./RaceHorseList.scss" />
