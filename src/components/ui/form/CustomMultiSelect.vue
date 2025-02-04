<template>
  <div class="custom-select-container">
    <label :for="id" class="form-label">{{ label }}</label>
    <Multiselect
        :id="id"
        v-model="internalValue"
        mode="tags"
        :close-on-select="false"
        :searchable="searchable"
        :create-option="true"
        :options="options"
        :placeholder="placeholder"
        :track-by="trackBy"
        :max="maxTags"
    />
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";

export default {
  name: "CustomMultiSelect",
  components: { Multiselect },
  props: {
    modelValue: {
      type: Array, // Ваши текущие выбранные значения
      default: () => [],
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array, // Все доступные теги
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "Select or add an option",
    },
    trackBy: {
      type: String,
      default: "value", // Поле для поиска уникальности
    },
    maxTags: {
      type: Number,
      default: 10,
    },
    searchable: {
      type: Boolean,
      default: true, // Уведомление о доступности поиска
    },
  },
  emits: ["update:modelValue"], // Поддержка v-model
  computed: {
    // Реактивное значение для v-model
    internalValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        // Когда значение обновляется, уведомляем родительский компонент
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>

<style>

</style>