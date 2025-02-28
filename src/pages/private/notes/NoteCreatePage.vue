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
                  :error="errors.title && errors.title[0]"
                  @update:error="clearError('title')"

              />

              <!-- Селект для тегов -->
              <custom-multi-select
                  v-model="selectedTags"
                  :options="availableTags"
                  placeholder="Select tags"
                  label="Tags"
                  id="noteTags"
              />

              <tiptap-editor
                  v-model="text"
                  id="noteText"
                  label="Text"
              />

            </div>
            <custom-button
                @click="createNote"
            >
              Create
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

import {ref,  computed} from "vue";
import axios from "@/services/axios";
import {useRouter} from "vue-router";
import {useTags} from "@/hooks/tags/useTags";
import {useBreadcrumbs} from "@/hooks/useBreadcrumbs";
import TiptapEditor from "@/components/ui/form/TiptapEditor.vue";

export default {
  name: "NoteCreatePage",
  components: {TiptapEditor},
  setup(props, context) {
    useBreadcrumbs([
      { label: 'Tags', href: '/admin/tags' },
      { label: 'Notes (private)', href: '/admin/notes' },
      { label: 'Create Notes', href: '' }
    ]);

    const router = useRouter();

    const title = ref('');
    const text = ref('');
    const selectedTags = ref([]); // Выбранные теги

    const errors = ref({});

    const { tags } = useTags();

    // Преобразуем теги в формат { label, value }
    const availableTags = computed(() => {
      return tags.value.map(tag => ({
        label: tag.name, // Используем поле 'name' для отображения
        value: tag.id,   // Используем поле 'id' для уникальности
      }));
    });

    const createNote = async () => {

      try {
        const tags = selectedTags.value.map(tag => tag.value);

        await axios.post(`/api/private/notes`, {
          title: title.value,
          text: text.value,
          tags: selectedTags.value
        }, {
          withAuth: true,
        });

        await router.push('/admin/notes');
      } catch (error) {
        if (error.response && error.response.status === 422) {
          errors.value = error.response.data.errors || {};
          console.log('errors: ', errors);
        } else {
          // Обработка других ошибок (например, связь с сервером отсутствует)
          console.error("Ошибка при отправке запроса:", error);
        }
      }
    }

    // Удаление ошибки
    const clearError = (fieldName) => {
      if (errors.value[fieldName]) {
        delete errors.value[fieldName];
      }
    };

    return {
      title,
      text,
      createNote,
      errors,
      clearError,
      selectedTags,
      availableTags,
    }
  },


}
</script>

<style scoped>


</style>
