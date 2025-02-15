<template>
  <div class="test-view">
    <h1>ЭКРАН ТЕСТОВЫЙ</h1>
    <habr-suggest />
  </div>
</template>
<script setup lang="ts">
import HabrSuggest from "@/components/habr-suggest-profiles.vue";
</script>
<style scoped>
.test-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
