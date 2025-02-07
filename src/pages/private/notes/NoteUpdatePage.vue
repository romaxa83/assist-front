<template>

  <div class="container">

    <div class="row g-5">
      <div class="col-md-10">
        <div>
          <form>
            <div class="mb-3">
              <custom-input
                  v-focus
                  v-model:modelValue="title"
                  id="noteTitle"
                  label="Title"
                  type="text"

              />

              <custom-multi-select
                  v-model="selectedTags"
                  :options="availableTags"
                  placeholder="Select tags"
                  label="Tags"
                  id="noteTags"
              />

              <custom-editor
                  v-model="text"
                  id="noteText"
                  label="Text"
              />

            </div>
            <custom-button
                @click="updateNote"
            >
              Update
            </custom-button>
          </form>
        </div>

        <div class="row mb-2">

        </div>


      </div>
    </div>

  </div>
</template>

<script>

import {ref, onMounted, computed} from "vue";
import axios from "@/services/axios";
import { useRoute, useRouter} from "vue-router";
import {loadNote} from "@/hooks/notes/loadNote";
import {useTags} from "@/hooks/tags/useTags";
import {useBreadcrumbs} from "@/hooks/useBreadcrumbs";

export default {
  name: "NoteUpdatePage",
  setup() {

    useBreadcrumbs([
      { label: 'Tags', href: '/admin/tags' },
      { label: 'Notes', href: '/admin/notes' },
      { label: `Update Notes`, href: '' }
    ]);

    const route = useRoute(); // Используем для получения параметров маршрута (id)
    const router = useRouter(); // Для перехода после обновления заметки
    const noteId = route.params.id; // Получаем id из маршрута

    // Локальные состояния
    const title = ref("");
    const text = ref("");
    const selectedTags = ref([]);

    const { tags, tagsFormatForSelect:availableTags } = useTags();

    // Загрузка существующей заметки с сервера
    const loadNote = async () => {
      try {
        const response = await axios.get(`/api/notes/${noteId}`);
        title.value = response.data.title;
        text.value = response.data.text;
        selectedTags.value = response.data.tags.map(tag => (
          tag.id
        ));

      } catch (error) {
        console.error("Ошибка при загрузке заметки:", error);
      }
    };

    // Обновление заметки
    const updateNote = async () => {
      try {
        const tags = selectedTags.value;

        await axios.put(`/api/notes/${noteId}`, {
          title: title.value,
          text: text.value,
          tags: tags
        },{withAuth: true});
        router.push("/admin/notes");
      } catch (error) {
        console.error("Ошибка при обновлении заметки:", error);
      }
    };

    // Загружаем заметку при монтировании компонента
    onMounted(loadNote);

    return {
      title,
      text,
      updateNote,
      selectedTags,
      availableTags,
    };
  },
}
</script>

<style scoped>


</style>
