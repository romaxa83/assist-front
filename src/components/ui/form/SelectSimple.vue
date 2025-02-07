<template>

  <select
      class="form-select custom-simple-select"
      :value="modelValue"
      @change="onChange"
      aria-label="Select an option"
  >
    <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :selected="option.value === modelValue"
    >
      {{ option.label }}
    </option>
  </select>

</template>

<script>
export default {
  name: "SelectSimple",
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }){

    const onChange = (event) => {
      const selectedValue = event.target.value;
      emit("update:modelValue", selectedValue);
      emit("change", selectedValue);
    };

    return {
      onChange,
    }
  }
}
</script>

<style scoped>

</style>