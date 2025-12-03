<template>
  <div class="app-layout">
    <aside class="app-layout__sidebar app-layout__sidebar--left">
      <slot name="left-sidebar" />
    </aside>

    <main class="app-layout__main">
      <slot name="main" />
    </main>

    <aside class="app-layout__sidebar app-layout__sidebar--right">
      <slot name="right-sidebar-right" />
    </aside>
  </div>
</template>

<style lang="scss" scoped src="./AppLayout.scss" />
