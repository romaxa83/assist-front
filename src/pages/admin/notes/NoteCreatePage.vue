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
              <custom-input
                  v-model:modelValue="text"
                  id="noteText"
                  label="Text"
                  type="textarea"
                  :error="errors.text && errors.text[0]"
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

import {ref} from "vue";
import CustomInput from "@/components/ui/CustomInput.vue";
import axios from "@/services/axios";
import {useRouter} from "vue-router";
import CustomButton from "@/components/ui/CustomButton.vue";

export default {
  name: "NoteCreatePage",
  components: {CustomButton, CustomInput},
  setup(props, context) {
    const router = useRouter();

    const title = ref('');
    const text = ref('');
    const errors = ref({});


    const createNote = async () => {

      try {
        await axios.post(`/api/notes`, {
          title: title.value,
          text: text.value,
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
      console.log(`Clearing error for ${fieldName}`);
      if (errors.value[fieldName]) {
        delete errors.value[fieldName];
      }
    };



    return {
      title,
      text,
      createNote,
      errors,
      clearError
    }
  },
}
</script>

<style scoped>

</style>
