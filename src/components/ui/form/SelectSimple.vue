<template>

  <div class="form-group">
    <label
        v-if="label"
        :for="id"
        class="form-label"
    >
      {{ label }}
    </label>

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


  </div>



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
    label: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
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