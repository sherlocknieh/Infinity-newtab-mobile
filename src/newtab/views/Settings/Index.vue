<!--
  Settings root layout.

  Acts as a shell for all settings sub-pages. Renders a <RouterView> inside a
  slide-in panel so the sub-pages are layered on top of the new-tab content
  rather than replacing it entirely.
-->
<template>
  <div class="page-container bg-white flex flex-col">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
// No logic needed at the layout level – each sub-page manages itself.
</script>

<style scoped></style>
