<template>

  <div class="container">

    <div class="row g-5">
      <div class="col-md-10">
        <div class="d-flex justify-content-between align-items-center pb-4 mb-4 border-bottom">
          <h3 class="fst-italic">
            Create Note
          </h3>
        </div>

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

              <custom-editor
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
import CustomInput from "@/components/ui/CustomInput.vue";
import CustomEditor from "@/components/ui/CustomEditor.vue";
import CustomButton from "@/components/ui/CustomButton.vue";
import CustomMultiSelect from "@/components/ui/CustomMultiSelect.vue";
import axios from "@/services/axios";
import {useRouter} from "vue-router";
import {useTags} from "@/hooks/tags/useTags";

export default {
  name: "NoteCreatePage",
  components: {
    CustomMultiSelect,
    CustomButton,
    CustomInput,
    CustomEditor,
    CustomSelect: CustomMultiSelect,
  },
  setup(props, context) {
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

        await axios.post(`/api/notes`, {
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
