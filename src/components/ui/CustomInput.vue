<template>
  <!-- Лейбл -->
  <div class="form-group">
    <label
        :for="id"
        class="form-label"
    >
      {{ label }}
    </label>

    <!-- Поле ввода -->
    <input
        :id="id"
        :type="type"
        :value="modelValue"
        class="form-control"
        :class="{ 'is-invalid': error }"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="clearError"
    >

    <!-- Блок ошибки -->
    <div
        v-if="error"
        class="invalid-feedback"
    >
      <span>{{ error }}</span>
    </div>
  </div>


</template>

<script>
export default {
  name: "CustomInput",
  props: {
    // Значение для v-model
    modelValue: {
      type: [String, Number],
      default: "",
    },
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      default: "",
    },
  },
  methods: {
    clearError() {
      // Уведомляем родительский компонент об изменении ошибки
      this.$emit("update:error", "");
    },
  },
}
</script>

<style scoped>

</style>