<template>
  <habr-autocomplete
    class="habr-suggest"
    :validation="validation"
    placeholder="Введите логин"
    :options="options"
    listing-key="alias"
    unique-key="name"
    :options-loading="isOptionsLoading"
    :search-debounce-delay="500"
    :max-count-selected-option="1"
    @search="fetchOptions"
  >
    <template #item="{ option }">
      <habr-profile-card
        class="habr-suggest__item"
        :image="option.avatar"
        :name="option.name"
        :alias="option.alias"
      />
    </template>
  </habr-autocomplete>
</template>
<script setup lang="ts">
import HabrAutocomplete from "@/components/uikit/habr-autocomplete.vue";
import HabrProfileCard from "@/components/habr-profile-card.vue";
import { charsLessThanValidation } from "@/utils/validations";
import { ref } from "vue";
import {
  ISuggestMention,
  suggestMention,
} from "@/infrastructure/suggest-mention";
import { suggestWithConcatenateAdapter } from "@/views/test-view/suggest-with-concatenate.adapter";

/**
 * для читаемости можно было бы вынести вызов прямо в пропс
 * :validation="charsLessThanValidation(3)",
 * но тогда бы при каждом перерисовке функция вызывалась бы по новой
 */
const validation = charsLessThanValidation(3);

const options = ref<ISuggestMention[]>([]);
const isOptionsLoading = ref(false);
const fetchOptions = async (search: string) => {
  try {
    isOptionsLoading.value = true;
    options.value = suggestWithConcatenateAdapter(await suggestMention(search));
  } catch (err) {
    options.value = [];
    console.error(err);
  } finally {
    isOptionsLoading.value = false;
  }
};
</script>
<style scoped>
.habr-suggest {
  width: 500px;
}
.habr-suggest__item {
  height: 80px;
}
.habr-suggest :deep(.habr-autocomplete__list) {
  max-height: 320px;
  overflow: scroll;
}
@media (max-width: 600px) {
  .habr-suggest {
    width: 300px;
  }
}
@media (max-width: 400px) {
  .habr-suggest {
    width: 200px;
  }
}
</style>
