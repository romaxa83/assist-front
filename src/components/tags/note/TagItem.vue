<template>
  <span
      :class="[
          'badge',
          'rounded-pill',
          'd-inline-block',
          'tag-item-for-note',
           sizeClass
      ]"
  >
    {{ tag.name }}
  </span>
</template>

<script>

import { computed } from "vue";


export default {
  name: "TagItemForNote",
  props: {
    tag: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      required: true, // Требуем обязательно указать размер ("small", "large" и т.д.)
      validator(value) {
        return ["small", "large"].includes(value); // Допустимые значения
      }
    }
  },
  setup(props) {
    // Вычисляем класс размера в зависимости от пропса size
    const sizeClass = computed(() =>
        props.size === "large" ? "tag-item-for-note-large" : "tag-item-for-note-small"
    );

    return {
      sizeClass,
    };
  },

}
</script>

<style scoped>
.tag-item-for-note {
  background-color: var(--tag-for-note-background-color);
  color: var(--tag-for-note-color);
}

/* Конкретные размеры */
.tag-item-for-note-small {
  font-size: 0.8rem; /* Маленький шрифт */
  padding: 0.2rem 0.6rem;
}

.tag-item-for-note-large {
  font-size: 1.2rem; /* Крупный шрифт */
  padding: 0.4rem 1rem;
}

</style>