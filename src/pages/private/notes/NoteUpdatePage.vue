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

<!--              <custom-editor-->
<!--                  v-model="text"-->
<!--                  id="noteText"-->
<!--                  label="Text"-->
<!--              />-->

              <tiptap-editor
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

      </div>
      <div class="col-md-2">

        <div class="mb-3">
          <select-simple
              v-model="status"
              :options="allowedStatuses"
              label="Status"
              id="noteStatus"
              @update:modelValue="setStatus"
          />
        </div>


      </div>
    </div>

  </div>
</template>

<script>

import {ref, onMounted, computed, watch} from "vue";
import axios from "@/services/axios";
import { useRoute, useRouter} from "vue-router";
import {loadNote} from "@/hooks/notes/loadNote";
import {useTags} from "@/hooks/tags/useTags";
import {useBreadcrumbs} from "@/hooks/useBreadcrumbs";
import SelectSimple from "@/components/ui/form/SelectSimple.vue";
import TiptapEditor from "@/components/ui/form/TiptapEditor.vue";

export default {
  name: "NoteUpdatePage",
  components: {
    SelectSimple,
    TiptapEditor
  },
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
    const status = ref("");
    const allowedStatuses = ref([]);

    const { tags, tagsFormatForSelect:availableTags } = useTags();

    // Загрузка существующей заметки с сервера
    const loadNote = async () => {
      try {
        const response = await axios.get(`/api/notes/${noteId}`, {
          withAuth: true,
        });

        title.value = response.data.title;
        text.value = response.data.text;
        status.value = response.data.status;
        allowedStatuses.value = response.data.meta.statuses;
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

    const setStatus = async () => {
      try {
        await axios.post(`/api/notes/${noteId}/set-status`, {
          status: status.value,
        },{withAuth: true});
      } catch (error) {
        console.error("Ошибка при смене статуса:", error);
      }
    };

    onMounted(loadNote);

    return {
      title,
      text,
      updateNote,
      setStatus,
      selectedTags,
      availableTags,
      status,
      allowedStatuses,
    };
  },
}
</script>

<style scoped>


</style>
