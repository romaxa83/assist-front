<template>
    <div class="container">
      <div class="row g-5">
        <div class="col-md-8">
          <div>
            <notes-row/>
          </div>
        </div>
        <div class="col-md-4">
          <div class="position-sticky">
            <tags-row/>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
import Sidebar from "@/components/navbar/Sidebar.vue";
import TagsRow from "@/components/tags/TagsRow.vue";
import NotesRow from "@/components/notes/NotesRow.vue";

export default {
  name: "MainPage",
  components: {
    TagsRow,
    NotesRow,
    Sidebar
  },
}
</script>

<style scoped>

</style>