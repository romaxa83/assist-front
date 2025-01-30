<template>
  <div class="p-4">
    <h4 class="fst-italic">Tags</h4>

    <tag-item
        v-for="tag in tags"
        :key="tag.id"
        :tag="tag"
    />
  </div>
</template>

<script>

import TagItem from '@/components/tags/TagItem.vue';
import {useTags} from "@/hooks/tags/useTags";

export default {
  name: "TagsRow",
  components: {
    TagItem,
  },
  data() {
    return {
      tags: [],
    }
  },
  setup(props, context) {
    const {tags} = useTags();

    return {
      tags
    }
  },
}
</script>


<style scoped>

</style>