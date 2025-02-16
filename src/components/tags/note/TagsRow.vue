<template>
  <div class="d-flex flex-wrap gap-2 mb-3">
    <tag-item
        v-for="tag in tags"
        :key="tag.id"
        :tag="tag"
        :size="size"
    />
  </div>
</template>

<script>

import TagItem from '@/components/tags/note/TagItem.vue';

export default {
  name: "TagsRowForNote",
  components: {
    TagItem,
  },
  props: {
    tags: {
      type: Array,
      required: true,
    },
    size: {
      type: String,
      required: true, // Требуем обязательно указать размер ("small", "large" и т.д.)
      validator(value) {
        return ["small", "large"].includes(value); // Допустимые значения
      }
    }
  }
}
</script>


<style scoped>

</style>