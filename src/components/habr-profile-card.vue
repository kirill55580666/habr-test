<template>
  <div class="habr-profile-card">
    <img class="habr-profile-card__image" :src="image" alt="(x_x)" />
    <div class="habr-profile-card__content">
      <span class="habr-profile-card__name">{{ name }}</span>
      <span class="habr-profile-card__alias">{{ alias }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
defineProps<{ image: string; name: string; alias: string }>();
</script>

<style scoped>
.habr-profile-card {
  display: flex;
  padding: 5px;
}
.habr-profile-card__name {
  font-weight: bold;
}
.habr-profile-card__image {
  width: 70px;
  height: 70px;
}
.habr-profile-card__content {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}
</style>
