<template>
  <article
      @click="toNotePage(note)"
      class="blog-post col-md-6"
      style="cursor: pointer"
  >
    <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
      <div class="col p-4 d-flex flex-column position-static">

        <tags-row-for-note
            :tags="note.tags"
            size="small"
        />

        <h5 class="mb-0">{{ note.title }}</h5>
        <div class="mb-1 text-muted">
          <i class="fa fa-calendar"></i>

          {{ note.created_at }}
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import {useRouter} from "vue-router";
import TagsRowForNote from "@/components/tags/note/TagsRow.vue";

export default {
  name: "NoteItem",
  components: {TagsRowForNote},
  props: {
    note: {
      type: Object,
      required: true,
    }
  },
  setup() {

    const router = useRouter();

    const toNotePage = (note) => {
      router.push(`/notes/${note.slug}`)
    }

    return {
      toNotePage
    }
  }
}
</script>

<style scoped>

</style>