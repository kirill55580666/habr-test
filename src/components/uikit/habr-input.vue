<template>
  <div class="habr-input">
    <input
      class="habr-input__input"
      v-model="model"
      :placeholder="placeholder"
      :class="{ 'habr-input__input_error': isShowError }"
      @focus="$emit('focus')"
      @blur="blurHandler"
    />
    <div v-if="isShowError" class="habr-input__error">
      {{ validation.validationText }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, defineModel, defineProps, defineEmits, ref } from "vue";
import { IValidation } from "@/utils/validations";

//TODO я бы в продакшне подключил какую нибудь библиотеку для валидации (у меня на проекте Vuelidate)
// все равно принял общее решение - передавать валидацию как регулярка,
// не захотелось заводить пропс minLength
// все что связано с валидацией не судите строго)
const props = defineProps<{ validation?: IValidation; placeholder?: string }>();
defineEmits(["focus"]);

const model = defineModel<string>({ default: "" });

const isAtLeastOnceFocused = ref(false);
const isShowError = computed<boolean>(
  () =>
    isAtLeastOnceFocused.value &&
    props.validation !== undefined &&
    !props.validation.validation.test(model.value)
);

const blurHandler = () => {
  if (!isAtLeastOnceFocused.value) {
    isAtLeastOnceFocused.value = true;
  }
};
</script>

<style scoped>
.habr-input {
}
.habr-input__input {
  width: 100%;
  height: 100%;
  padding: 5px;
}
.habr-input__input:focus {
  outline: none;
}
.habr-input__input_error {
  border: 1px solid var(--error-color);
}
.habr-input__error {
  text-align: left;
  font-size: 12px;
  color: var(--error-color);
}
</style>
