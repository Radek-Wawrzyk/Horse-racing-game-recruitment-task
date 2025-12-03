<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRaceStore } from '@/stores/useRaceStore';

import AppLayout from '@/components/App/AppLayout/AppLayout.vue';
import AppHeader from '@/components/App/AppHeader/AppHeader.vue';
import HorseList from '@/components/App/HorseList/HorseList.vue';
import RaceTrack from '@/components/App/RaceTrack/RaceTrack.vue';
import ProgramResults from '@/components/App/ProgramResults/ProgramResults.vue';

const raceStore = useRaceStore();

onMounted(() => {
  raceStore.init();
});

onUnmounted(() => {
  raceStore.cleanup();
});
</script>

<template>
  <div>
    <AppHeader />
    <AppLayout>
      <template #left-sidebar>
        <HorseList />
      </template>

      <template #main>
        <RaceTrack />
      </template>

      <template #right-sidebar-right>
        <ProgramResults />
      </template>
    </AppLayout>
  </div>
</template>

<style scoped></style>
