<template>
  <table class="table table-hover">
    <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Title</th>
      <th scope="col">Status</th>
      <th scope="col">Weight</th>
      <th scope="col">Created</th>
      <th scope="col" class="text-center actions-column">Action</th>
    </tr>
    </thead>
    <tbody>

    <tr
        v-for="note in notes"
        :key="note.id"
        :note="note"
        class="table-warning"
    >
      <th scope="row">{{ note.id }}</th>
      <td>{{ note.title }}</td>
      <td>{{ note.status }}</td>
      <td>{{ note.weight }}</td>
      <td>{{ note.created_at }}</td>
      <td class="d-flex justify-content-end">

        <!-- Кнопка редактирования -->
        <button
            class="btn btn-sm btn-warning me-2"
            title="Edit"
            @click="toUpdatePage(note)"
        >
          <i class="fa-solid fa-pen" style="color: #333;"></i>
        </button>

        <button
            class="btn btn-sm btn-warning"
            title="Delete"
            @click="$emit('remove', note)"
        >
          <i class="fa-solid fa-trash" style="color: #333;"></i>
        </button>

      </td>

    </tr>

    </tbody>
  </table>
</template>

<script>
import {useRouter} from "vue-router";
import {useNotes} from "@/hooks/notes/useNotes";

export default {
  name: "NoteTable",
  props: {
    notes: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const router = useRouter();

    const toUpdatePage = (note) => router.push(`/admin/notes/update/${note.id}`);

    return {
      toUpdatePage,
    }
  },
}
</script>


<style scoped>

</style>