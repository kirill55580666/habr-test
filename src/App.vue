<template>
  <test-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TestView from "@/views/test-view/test-view.vue";

export default defineComponent({
  name: "App",
  components: {
    TestView,
  },
});
</script>

<style>
* {
  box-sizing: border-box;
}

:root {
  --error-color: #f23e3f;
  --additional-color: #118fe3;
}
</style>
