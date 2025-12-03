<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { useRaceStore } from '@/stores/useRaceStore';

const raceStore = useRaceStore();
</script>

<template>
  <div class="race-horse-list">
    <DataTable :value="raceStore.horses" size="small">
      <Column field="name" :header="$t('race.name')" />
      <Column field="condition" :header="$t('race.condition')" />
      <Column field="color" :header="$t('race.color')">
        <template #body="slotProps">
          <div class="race-horse-list__color" :style="{ backgroundColor: slotProps.data.color }" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lang="scss" scoped src="./RaceHorseList.scss" />
