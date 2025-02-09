<template>

  <div class="container">
    <!-- Header container page -->
    <div class="row g-3">
      <div class="d-flex justify-content-between align-items-center pb-1 mb-4 border-bottom">
        <h3 class="fst-italic">
          Notes
        </h3>

        <custom-button
            @click="toCreatePage"
        >
          Create
        </custom-button>
      </div>
    </div>

    <!-- Table -->
    <div class="row">
      <div class="container table_block_container">
        <!-- Filter block -->
        <div class="row py-3 table_filter_container">
          <div class="col-md-3">
            <input-simple
                :placeholder="'Filter id'"
            />
          </div>
          <div class="col-md-3">
            <select-simple
                v-model="selectedStatus"
                :options="optionsStatuses"
            />
          </div>
          <div class="col-md-3">

          </div>
          <div class="col-md-3">
            <div class="row justify-content-end">
              <!-- Select for perPage -->
              <div class="col-md-10">
                <select-simple
                    v-model="selectedPerPage"
                    :options="optionsPerPage"
                />
              </div>
              <!-- Clear filter -->
              <div class="col-md-2">
                <button
                    class="btn btn-sm btn-warning me-2"
                    title="Edit"
                >
                  <i class="fa-solid fa-pen" style="color: #333;"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Table block -->
        <div class="row table_container">
          <note-table
              :notes="notes"
              @remove="handleRemove"
          />
        </div>
        <!-- Pagination block -->
        <div class="row">
          <div class="table_pagination_container">
            <pagination
                v-if="meta && meta.links"
                :meta="meta"
                @change-page="handlePageChange"
            />
          </div>
        </div>
      </div>

    </div>

    <div class="row">

    </div>

  </div>
</template>

<script>

import {onMounted, ref, watch} from "vue";

import { computed } from "vue";
import { useStore } from "vuex";


import {useNotes} from "@/hooks/notes/useNotes";
import NoteTable from "@/components/notes/table/NoteTable.vue";
import InputSimple from "@/components/ui/form/InputSimple.vue";
import Breadcrumb from "@/components/ui/nav/Breadcrumb.vue";
import Pagination from "@/components/ui/nav/Pagination.vue";
import { useRouter, useRoute} from 'vue-router';
import {useBreadcrumbs} from "@/hooks/useBreadcrumbs";
import axios from "@/services/axios";
import SelectSimple from "@/components/ui/form/SelectSimple.vue";
import {useNoteSettings} from "@/hooks/settings/useNoteSettings";

export default {
  name: "NotesPage",
  components: {
    SelectSimple,
    Breadcrumb,
    NoteTable,
    Pagination,
    InputSimple
  },
  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    useBreadcrumbs([
      { label: 'Tags', href: '/admin/tags' },
      { label: 'Notes', href: '/admin/notes' }
    ]);

    // дефолтное значение
    const selectedPerPage = ref(10);
    const selectedStatus = ref("");

    // Получение статусов
    const { statuses: rawStatuses } = useNoteSettings();

    // Создаём computed, который объединяет дефолтное значение и статусы
    const optionsStatuses = computed(() => [
      { value: "", label: 'Filter by status' }, // Дефолтный элемент
      ...rawStatuses.value // Динамические статусы
    ]);

    // Получаем глобальные `optionsPerPage` из Vuex
    const optionsPerPage = computed(() =>
        store.getters["settings/getOptionsPerPage"]
    );

    const {notes, meta, fetching} = useNotes({
      'per_page': selectedPerPage.value
    });

    const toCreatePage = () => router.push('/admin/notes/create');

    const handleRemove = async (note) => {
      try {
        // Удаление заметки на сервере
        await axios.delete(`/api/notes/${note.id}`, {
          withAuth: true,
        });

        // Обновление списка заметок (удаление локально)
        notes.value = notes.value.filter((n) => n.id !== note.id);
      } catch (error) {
        console.error("Ошибка при удалении заметки:", error);
      }
    };

    const handlePageChange = async (url) => {

      if (!url) return; // Защита на случай передачи пустого URL

      const params = new URL(url).searchParams; // Извлекаем параметры из URL
      const page = params.get("page"); // Получаем номер страницы
      const perPage = selectedPerPage.value; // Учитываем текущий `per_page`
      const status = selectedStatus.value; // Учитываем текущий `per_page`

      // Обновляем параметры в адресной строке
      router.push({
        query: {
          ...route.query, // Сохраняем текущие параметры
          page,
          per_page: perPage, // Добавляем текущий per_page
          status: status, // Добавляем текущий per_page
        },
      });

      // Выполняем запрос на сервер
      await fetching({ page, per_page: perPage });
    };


    onMounted(async () => {
      // Считываем параметры из URL
      const { per_page: perPageFromUrl, status: statusFromUrl } = route.query;

      // Синхронизация параметров из URL с внутренними переменными
      selectedStatus.value = statusFromUrl || ""; // Если нет `statusFromUrl`, установить дефолтное значение
      selectedPerPage.value = Number(perPageFromUrl) || 10; // Если нет `per_page`, установить дефолтное значение

      // Выполняем запрос с параметрами
      await fetching({
        per_page: selectedPerPage.value,
        status: selectedStatus.value,
      });
    });

    watch([selectedStatus, selectedPerPage], async ([newStatus, newPerPage]) => {
      // Формируем объект параметров
      const updatedParams = {
        ...route.query,
        page: 1, // Сбрасываем страницу
        per_page: newPerPage,
      };

      // Удаляем параметр `status` из URL, если статус пустой
      if (newStatus) {
        updatedParams.status = newStatus;
      } else {
        delete updatedParams.status;
      }

      // Используем сформированные параметры для обновления URL
      router.push({ query: updatedParams });

      // И для выполнения запроса
      await fetching(updatedParams);
    });

    return {
      notes,
      meta,
      toCreatePage,
      handleRemove,
      selectedPerPage,
      optionsPerPage,
      handlePageChange,
      selectedStatus,
      optionsStatuses,
    }
  },
}
</script>

<style scoped>

/* Контейнер для пагинации таблицы */
.table_pagination_container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}

/* Контейнер для таблицы */
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>