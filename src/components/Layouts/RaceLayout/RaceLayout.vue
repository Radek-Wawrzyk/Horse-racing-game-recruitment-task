<script setup lang="ts">
import Panel from 'primevue/panel';

defineProps<{
  leftSidebarHeader?: string;
  rightSidebarHeader?: string;
}>();
</script>

<template>
  <div class="race-layout">
    <header class="race-layout__header">
      <slot name="header" />
    </header>

    <div class="race-layout__content">
      <Panel class="race-layout__sidebar race-layout__sidebar--left" :header="leftSidebarHeader">
        <slot name="left-sidebar" />
      </Panel>

      <div class="race-layout__main">
        <slot name="main" />
      </div>

      <Panel class="race-layout__sidebar race-layout__sidebar--right" :header="rightSidebarHeader">
        <slot name="right-sidebar-right" />
      </Panel>
    </div>

    <footer class="race-layout__actions">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style lang="scss" scoped src="./RaceLayout.scss" />
