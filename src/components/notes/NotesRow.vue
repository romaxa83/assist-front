<template>
  <div class="row mb-2">
    <note-item
        v-for="note in notes"
        :key="note.id"
        :note="note"
    />
  </div>
</template>

<script>

import NoteItem from "@/components/notes/NoteItem.vue";

export default {
  name: "NotesRow",
  components: {
    NoteItem,
  },
  props: {
    notes: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped>

</style>