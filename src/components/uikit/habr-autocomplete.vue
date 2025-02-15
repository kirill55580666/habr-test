<template>
  <div
    class="habr-autocomplete"
    v-click-outside="() => (isFocused = false)"
    role="combobox"
    :aria-expanded="isFocused && search"
    aria-owns="habr-autocomplete-list"
    @keydown.down="downHandler"
    @keydown.up="upHandler"
    @keydown.enter="enterHandler"
  >
    <div class="habr-autocomplete__container">
      <div
        v-if="selectedOptions.length"
        class="habr-autocomplete__options"
        role="list"
      >
        <slot name="selected-options">
          <div
            v-for="(option, index) in selectedOptions"
            :key="option"
            class="habr-autocomplete__option"
            role="listitem"
          >
            <span>{{ option }}</span>
            <span
              class="habr-autocomplete__close-icon"
              role="button"
              aria-label="Удалить выбранную опцию"
              @click.stop="deleteSelectedOption(index)"
            >
              x
            </span>
          </div>
        </slot>
      </div>
      <habr-input
        :class="[
          'habr-autocomplete__input',
          {
            'habr-autocomplete__input_hidden': isSelectedOptionsLimited,
            'habr-autocomplete__input_with-selected': selectedOptions.length,
          },
        ]"
        :model-value="search"
        :placeholder="placeholder"
        :validation="validation"
        role="textbox"
        aria-autocomplete="list"
        aria-controls="habr-autocomplete-list"
        :aria-activedescendant="`habr-autocomplete-item-${arrowCounter}`"
        @update:model-value="searchHandler"
        @focus="!isSelectedOptionsLimited && (isFocused = true)"
      />
    </div>
    <template v-if="isFocused">
      <div
        v-if="optionsLoading"
        class="habr-autocomplete__loader"
        role="status"
        aria-live="polite"
      >
        <habr-loader />
      </div>
      <div
        v-else-if="isNothingFoundedAtOptions"
        role="alert"
        aria-live="polite"
      >
        {{ nothingFoundText }}
      </div>
      <ul
        v-else-if="filteredOptions.length"
        class="habr-autocomplete__list"
        id="habr-autocomplete-list"
        role="listbox"
      >
        <li
          v-for="(option, index) in filteredOptions"
          :key="getOptionKey(option, index)"
          :class="[
            'habr-autocomplete__item',
            { 'habr-autocomplete__item_active': arrowCounter === index },
          ]"
          role="option"
          :id="'habr-autocomplete-item-' + index"
          :aria-selected="arrowCounter === index"
          @click.stop="addSelectedOption(option)"
        >
          <slot name="item" :option="option">
            {{ option[listingKey] }}
          </slot>
        </li>
      </ul>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, withDefaults, defineEmits, computed } from "vue";
import HabrInput from "@/components/uikit/habr-input.vue";
import { IValidation } from "@/utils/validations";
import { GetArrayItemType } from "@/types/get-array-item-type";
import debounce from "@/utils/debounce";
import HabrLoader from "@/components/uikit/habr-loader.vue";

const props = withDefaults(
  defineProps<{
    validation?: IValidation;
    placeholder?: string;
    uniqueKey: string;
    listingKey: string;
    options: Record<string, any>[];
    optionsLoading?: boolean;
    searchDebounceDelay?: number;
    nothingFoundText?: string;
    maxCountSelectedOption?: number;
  }>(),
  {
    searchDebounceDelay: 0,
    nothingFoundText: "Ничего не найдено",
    maxCountSelectedOption: 1,
  }
);

const emit = defineEmits<{
  search: [value: string];
}>();

//TODO в будущем (например для предзаполнения) надо прокидывать сверху через v-model
const selectedOptions = ref<string[]>([]);

/** перестраховываемся, если нет uniqueKey, то отдаем индекс */
const getOptionKey = (
  option: GetArrayItemType<typeof props.options>,
  index: number
) => option[props.uniqueKey] ?? index;

const search = ref("");
const searchHandler = (value: typeof search.value) => {
  search.value = value;
  debounceSearchEmit(value);
};
const debounceSearchEmit = debounce(
  (value: typeof search.value) => emit("search", value),
  props.searchDebounceDelay
);

const isFocused = ref(false);

/** Функциональность добавления/удаления опций */
const addSelectedOption = (value: GetArrayItemType<typeof props.options>) => {
  selectedOptions.value.push(value[props.listingKey]);

  if (isSelectedOptionsLimited.value) {
    isFocused.value = false;
  }
};
const deleteSelectedOption = (index: number) => {
  selectedOptions.value.splice(index, 1);
};
/** */

/** */
const arrowCounter = ref(-1);
const downHandler = () => {
  if (arrowCounter.value + 1 === filteredOptions.value.length) return;
  arrowCounter.value += 1;
};
const upHandler = () => {
  if (arrowCounter.value >= 0) {
    arrowCounter.value -= 1;
  }
};
const enterHandler = () => {
  addSelectedOption(filteredOptions.value[arrowCounter.value]);
};

/** */

const isNothingFoundedAtOptions = computed<boolean>(
  () => !filteredOptions.value.length && search.value !== ""
);
const filteredOptions = computed<typeof props.options>(() =>
  props.options.filter(
    (option) => !selectedOptions.value.includes(option[props.listingKey])
  )
);
const isSelectedOptionsLimited = computed<boolean>(
  () => selectedOptions.value.length === props.maxCountSelectedOption
);
</script>

<style scoped>
.habr-autocomplete__container {
  display: flex;
  border: 1px solid #676774;
  min-height: 55px;
}
/* Знаю что deep плохо( Проблема в красной ошибке когда отображается. Будь какой нибудь подключенный валидатор
   вытащил бы из его инстанса ошибку и уволок бы ее влево прямо в этом компоненте
   а в исходном инпуте бы не отображал ошибки
   были идее оставить автокомплит все таки как есть и ошибку прокидывать через телепорты из инпута сюда, но супер не надежно
   или из инпута логику по ошибки перекопировать сюда, но это вообще извращение) */
.habr-autocomplete__input :deep(.habr-input__input) {
  border: none;
}
.habr-autocomplete__input_with-selected {
  align-self: end;
}
.habr-autocomplete__loader {
  position: relative;
  min-height: 150px;
}
.habr-autocomplete__list {
  padding: 0;
  list-style-type: none;
  width: 100%;
  margin: 0;
}
.habr-autocomplete__item {
  cursor: pointer;
}
.habr-autocomplete__item:hover {
  background-color: var(--additional-color);
}
.habr-autocomplete__item_active {
  background-color: var(--additional-color);
}
.habr-autocomplete__options {
  display: flex;
  gap: 4px;
  color: white;
  padding: 5px;
  flex-wrap: wrap;
}
.habr-autocomplete__option {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #8ba9bc;
  cursor: pointer;
  padding: 5px;
}
.habr-autocomplete__close-icon {
  margin-left: 5px;
  cursor: pointer;
}
.habr-autocomplete__close-icon:hover {
  transform: scale(1.2);
}
.habr-autocomplete__input_hidden {
  display: none;
}
</style>
