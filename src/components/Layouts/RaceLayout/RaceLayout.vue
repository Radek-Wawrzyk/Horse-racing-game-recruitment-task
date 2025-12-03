<script setup lang="ts">
import Card from 'primevue/card';
</script>

<template>
  <div class="race-layout">
    <header class="race-layout__header">
      <slot name="header" />
    </header>

    <div class="race-layout__content">
      <Card class="race-layout__sidebar race-layout__sidebar--left">
        <template #content>
          <slot name="left-sidebar" />
        </template>
      </Card>

      <div class="race-layout__main">
        <slot name="main" />
      </div>

      <Card class="race-layout__sidebar race-layout__sidebar--right">
        <template #content>
          <slot name="right-sidebar-right" />
        </template>
      </Card>
    </div>

    <footer class="race-layout__actions">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style lang="scss" scoped src="./RaceLayout.scss" />
