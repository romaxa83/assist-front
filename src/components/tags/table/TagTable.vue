<template>
  <table class="table table-hover">
    <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Title</th>
      <th scope="col">Slug</th>
      <th scope="col">Weight</th>
      <th scope="col" class="text-center actions-column">Action</th>
    </tr>
    </thead>
    <tbody>

    <tr
        v-for="tag in tags"
        :key="tag.id"
        :tag="tag"
        class="table-warning"
    >
      <th scope="row">{{ tag.id }}</th>
      <td>{{ tag.name }}</td>
      <td>{{ tag.slug }}</td>
      <td>{{ tag.weight }}</td>
      <td class="d-flex justify-content-end">

        <button
            class="btn btn-sm btn-warning me-2"
            title="Edit"
            @click="$emit('edit', tag)"
        >
          <i class="fa-solid fa-pen" style="color: #333;"></i>
        </button>

        <button
            class="btn btn-sm btn-warning"
            title="Delete"
            @click="$emit('remove', tag)"
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
  name: "TagTable",
  props: {
    tags: {
      type: Array,
      required: true,
    },
  }
}
</script>


<style scoped>

</style>