<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useRaceStore } from '@/stores/useRaceStore';

import RaceLayout from '@/components/Layouts/RaceLayout/RaceLayout.vue';
import RaceHeader from '@/components/Race/RaceHeader/RaceHeader.vue';
import RaceResults from '@/components/Race/RaceResults/RaceResults.vue';
import RaceHorseList from '@/components/Race/RaceHorseList/RaceHorseList.vue';
import RaceTrack from '@/components/Race/RaceTrack/RaceTrack.vue';

const raceStore = useRaceStore();

onUnmounted(() => {
  raceStore.cleanup();
});
</script>

<template>
  <RaceLayout>
    <template #header>
      <RaceHeader />
    </template>

    <template #left-sidebar>
      <RaceHorseList />
    </template>

    <template #main>
      <RaceTrack />
    </template>

    <template #right-sidebar-right>
      <RaceResults />
    </template>
  </RaceLayout>
</template>

<style scoped></style>
