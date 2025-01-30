<template>
  <span class="badge rounded-pill bg-light text-dark me-2 mt-1 fs-6">
    {{tag.name}} ({{tag.weight}})
  </span>
</template>

<script>
export default {
  name: "TagItem",
  props: {
    tag: {
      type: Object,
      required: true,
    }
  }
}
</script>


<style scoped>

</style>