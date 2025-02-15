import { Directive } from "vue";

declare global {
  interface HTMLElement {
    clickOutsideEvent: (...args: Event[]) => void;
  }
}
export const clickOutside: Directive<HTMLElement> = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      //TODO не бейте за as, быстро не смог разобраться, пошел дальше
      if (
        /** условие что не тыкнули по элементу или его потомкам внутри */
        !(el === event.target || el.contains(event.target as HTMLInputElement))
      ) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};
