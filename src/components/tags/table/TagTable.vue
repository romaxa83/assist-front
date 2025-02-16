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
        <div class="d-flex flex-nowrap align-items-center">
          <small-button
              classCustom="me-2"
              title="Edit Tag"
              @click="$emit('edit', tag)"
          >
            <i class="fa-solid fa-pen"></i>
          </small-button>

          <small-button
              title="Delete Tag"
              @click="$emit('remove', tag)"
          >
            <i class="fa-solid fa-trash"></i>
          </small-button>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import SmallButton from "@/components/ui/button/SmallButton.vue";

export default {
  name: "TagTable",
  components: {SmallButton},
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