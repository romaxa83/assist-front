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

import {useNotes} from "@/hooks/notes/public/useNotes";
import NoteItem from "@/components/notes/NoteItem.vue";

export default {
  name: "NotesRow",
  components: {
    NoteItem,
  },
  data() {
    return {
      notes: [],
    }
  },
  setup() {
    const {notes} = useNotes();

    return {
      notes
    }
  },
}
</script>


<style scoped>

</style>