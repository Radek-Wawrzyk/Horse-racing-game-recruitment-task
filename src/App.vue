<script setup lang="ts">
import AppLayout from '@/components/App/AppLayout/AppLayout.vue';
import AppHeader from '@/components/App/AppHeader/AppHeader.vue';
</script>

<template>
  <div>
    <AppHeader />
    <AppLayout>
      <template #left-sidebar> horse list component </template>

      <template #main> game component </template>

      <template #right-sidebar-right> right sidebar component </template>
    </AppLayout>
  </div>
</template>

<style scoped></style>
