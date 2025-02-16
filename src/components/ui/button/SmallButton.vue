<template>
  <button
      class="btn btn-sm small-action-btn"
      :type="type"
      :class="classCustom"
      :title="title"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "SmallButton",
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
.small-action-btn {
  background-color: var(--btn-action-background);
  color: var(--btn-action-color);
}
.small-action-btn:hover {
  background-color: var(--btn-action-hover-background);
  color: var(--btn-action-hover-color);
}
</style>