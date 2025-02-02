<template>
  <button
      :type="type"
      :class="classCustom"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "CustomButton",
  props: {
    type: {
      type: String,
      default: "button"
    },
    classCustom: {
      type: String,
      default: "btn btn-warning"
    }
  }
}
</script>

<style scoped>

</style>