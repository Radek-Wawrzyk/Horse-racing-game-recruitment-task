<script setup lang="ts">
import Button from 'primevue/button';
import { useRaceStore } from '@/stores/useRace';

const raceStore = useRaceStore();

const onStartStopRace = () => {
  console.log('onStartStopRace');
};
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <h1 class="app-header__title">Diceus Horse Game</h1>
    </div>

    <div class="app-header__right">
      <Button label="Click" @click="raceStore.init">
        {{ $t('common.generate') }}
      </Button>

      <Button label="Click" @click="onStartStopRace">
        {{ $t('common.pause') }}
      </Button>
    </div>
  </header>
</template>
