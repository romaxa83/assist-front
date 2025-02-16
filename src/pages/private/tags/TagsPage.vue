<template>

  <div class="container">

    <div class="row g-5">
      <div class="col-md-10">
        <div class="d-flex justify-content-between align-items-center pb-4 mb-4 border-bottom">
          <h3 class="fst-italic">
            Tags
          </h3>

          <!-- Create tag -->
          <custom-button
              data-bs-toggle="modal"
              data-bs-target="#createTagModal"
          >
            Create
          </custom-button>

          <!-- Modal Create -->
          <div
              class="modal fade"
              id="createTagModal"
              tabindex="-1"
              aria-labelledby="createTagModalLabel"
              aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="createTagModalLabel">
                    {{ isEditMode ? 'Edit Tag' : 'Create Tag' }}
                  </h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                  <div class="mb-3">
                    <custom-input
                        v-focus
                        v-model:modelValue="tag.name"
                        v-model:error="formErrors.name"
                        id="tagName"
                        label="Name"
                        type="text"
                    />
                  </div>

                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button
                      type="button"
                      class="btn btn-warning"
                      @click="sendTag"
                  >
                    {{ isEditMode ? 'Update' : 'Create' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Подтверждение удаления -->
          <div
              class="modal fade"
              id="deleteTagModal"
              tabindex="-1"
              aria-labelledby="deleteTagModalLabel"
              aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="deleteTagModalLabel">Удалить тег</h5>
                  <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  Вы уверены, что хотите удалить этот тег?
                </div>
                <div class="modal-footer">
                  <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                  >
                    Отмена
                  </button>
                  <button
                      type="button"
                      class="btn btn-danger"
                      @click="confirmDelete"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div>
          <tag-table
              :tags="tags"
              @remove="handleRemove"
              @edit="handlerEdit"
          />
        </div>

        <div class="row mb-2">

        </div>
      </div>
    </div>

  </div>
</template>

<script>

import {useTags} from "@/hooks/tags/useTags";
import TagItem from "@/components/tags/TagItem.vue";
import axios from "axios";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import TagTable from "@/components/tags/table/TagTable.vue";
import {useBreadcrumbs} from "@/hooks/useBreadcrumbs";

export default {
  name: "TagsPage",
  components: {
    TagTable,
    TagItem
  },
  data() {
    return {
      tags: [],
      tag: {
        name: '',
      },
      tagToDelete: null,

      // Флаг определения режима: создание/редактирование
      isEditMode: false,

      formErrors: {
        name: "",
      },
    }
  },

  mounted() {
    const modalElement = document.getElementById('createTagModal');

    // при открытие модалки устанавливаем фокус на первое поле
    modalElement.addEventListener('shown.bs.modal', this.setFocus);

    // Добавляем слушатель закрытия модального окна, для очистки полей
    modalElement.addEventListener("hide.bs.modal", this.resetForm);
  },
  beforeUnmount() {
    const modalElement = document.getElementById('createTagModal');

    if (modalElement) {
      modalElement.removeEventListener('shown.bs.modal', this.setFocus);
      modalElement.removeEventListener("hide.bs.modal", this.resetForm);
    }
  },

  methods: {

    handleRemove(tag) {
      this.tagToDelete = tag;

      // Открываем модальное окно удаления
      const modal = new bootstrap.Modal(document.getElementById('deleteTagModal'));
      modal.show();
    },
    handlerEdit(tag) {
      // Заполняем данные для редактирования
      this.tag.id = tag.id;
      this.tag.name = tag.name;

      // Включаем режим редактирования
      this.isEditMode = true;

      // Открываем модальное окно
      const modal = new bootstrap.Modal(document.getElementById('createTagModal'));
      modal.show();
    },

    async sendTag() {

      try {
        const token = localStorage.getItem('authToken');

        if(this.isEditMode){
          const response = await axios.put(
              `http://192.168.193.1/api/private/tags/${this.tag.id}`,
              this.tag,
              { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {
            // Обновляем тег в локальном списке tags
            const index = this.tags.findIndex(tag => tag.id === this.tag.id);
            if (index !== -1) {
              this.tags[index] = response.data; // Обновляем тег
            }
          }

        } else {
          const response = await axios.post(
              'http://192.168.193.1/private/api/tags',
              this.tag,
              {headers: {Authorization: `Bearer ${token}`,}}
          );

          if(response.status === 201){
            this.tags.push(response.data);
          }
        }

        // Закрываем модальное окно после выполнения
        const modal = bootstrap.Modal.getInstance(document.getElementById('createTagModal'));
        modal.hide();

        // Сбрасываем форму
        this.resetForm();

      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.formErrors.name = error.response.data.errors.name[0];
        } else {
          // Обработка других ошибок
          console.error('Ошибка при попытке входа:', error);
        }
      }
    },


    async confirmDelete() {

      if (!this.tagToDelete) return;

      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(
            `http://192.168.193.1/api/private/tags/${this.tagToDelete.id}`,
            {headers: {Authorization: `Bearer ${token}`,}}
        );

        if(response.status === 204){
          // Удаляем тег из списка tags
          this.tags = this.tags.filter(tag => tag.id !== this.tagToDelete.id);
          this.tagToDelete = null;
        }

        // Закрываем модальное окно после удаления
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('deleteTagModal')
        );
        modal.hide();

      } catch (error) {
        console.error('Ошибка при удалении тега:', error);
      }
    },

    clearError() {
      // Сбрасываем ошибку валидации для name
      this.formErrors.name = "";
    },

    setFocus() {
      const input = document.getElementById('tagName');
      if (input) {
        input.focus();
      }
    },

    resetForm() {
      // Сбрасываем поля формы
      this.tag = {
        id: null,
        name: '',
      };

      // Сбрасываем ошибку
      this.formErrors.name = '';

      // Отключаем режим редактирования
      this.isEditMode = false;
    },


  },
  setup(props, context) {
    useBreadcrumbs([
      { label: 'Notes (private)', href: '/admin/notes' },
      { label: 'Tags', href: '/admin/tags' }
    ]);

    const {tags} = useTags();

    return {
      tags
    }
  },
}
</script>

<style scoped>

</style>