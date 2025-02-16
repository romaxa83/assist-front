<template>
  <button
      class="btn custom-action-btn"
      :title="title"
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
    title: {
      type: String,
      default: ""
    },
    classCustom: {
      type: String,
      default: ""
    }
  }
}
</script>

<style scoped>
.custom-action-btn {
  background-color: var(--btn-action-background);
  color: var(--btn-action-color);
}
.custom-action-btn:hover {
  background-color: var(--btn-action-hover-background);
  color: var(--btn-action-hover-color);
}
</style>