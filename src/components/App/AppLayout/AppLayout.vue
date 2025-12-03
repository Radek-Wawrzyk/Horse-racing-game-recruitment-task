<script setup lang="ts">
import Card from 'primevue/card';
</script>

<template>
  <div class="app-layout container">
    <Card class="app-layout__sidebar app-layout__sidebar--left">
      <template #content>
        <slot name="left-sidebar" />
      </template>
    </Card>

    <Card class="app-layout__main">
      <template #content>
        <slot name="main" />
      </template>
    </Card>

    <Card class="app-layout__sidebar app-layout__sidebar--right">
      <template #content>
        <slot name="right-sidebar-right" />
      </template>
    </Card>
  </div>
</template>

<style lang="scss" scoped src="./AppLayout.scss" />
