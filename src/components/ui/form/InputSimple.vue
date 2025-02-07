<template>
  <input
      :type="type"
      :value="modelValue"
      class="form-control"
      :required="required"
      :placeholder="placeholder"
      :title="title"
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
    required: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    }
  },
}
</script>

<style scoped>

</style>