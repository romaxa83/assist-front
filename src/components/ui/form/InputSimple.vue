<template>
  <input
      :type="type"
      :value="modelValue"
      class="form-control"
      :required="required"
      :placeholder="placeholder"
      :title="title"
      @change="onChange"
  >
</template>

<script>
export default {
  name: "InputSimple",
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    title: {
      type: String,
      default: "",
    },
    required: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    }
  },
  setup(props, { emit }){

    const onChange = (event) => {
      const value = event.target.value;
      emit("update:modelValue", value);
      emit("change", value);
    };

    return {
      onChange,
    }
  }
}
</script>

<style scoped>

</style>