<template>
  <table class="table table-hover">
    <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Title</th>
      <th scope="col">Slug</th>
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
      <td>{{ note.slug }}</td>
      <td class="d-flex justify-content-end">

        <!-- Кнопка редактирования -->
        <button
            class="btn btn-sm btn-warning me-2"
            title="Edit"
            @click="$emit('edit', note)"
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
export default {
  name: "NoteTable",
  props: {
    notes: {
      type: Array,
      required: true,
    },
  }
}
</script>


<style scoped>

</style>