<template>

  <div class="container">
    <!-- Header container page -->
    <div class="row g-3">
      <div class="d-flex justify-content-between align-items-center pb-1 mb-4 border-bottom">
        <h3 class="fst-italic">
          Notes
        </h3>

        <custom-button
            title="Create Note"
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
                v-model="search"
                :placeholder="'Search by title'"
            />
          </div>
          <div class="col-md-3">
            <select-simple
                v-model="selectedStatus"
                :options="optionsStatuses"
            />
          </div>
          <div class="col-md-3">
            <date-range
                v-model="selectedRange"
            />
          </div>
          <div class="col-md-2">
              <select-simple
                  v-model="selectedPerPage"
                  :options="optionsPerPage"
              />
          </div>
          <div class="col-md-1">
            <small-button
                title="Clear filter"
                @click="clearFilter"
            >
              <i class="fa fa-times"></i>
            </small-button>
          </div>
        </div>
        <!-- Table block -->
        <div class="row table_container">
          <note-table
              :notes="notes"
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
import DateRange from "@/components/ui/form/DateRange.vue";
import SmallButton from "@/components/ui/button/SmallButton.vue";

export default {
  name: "NotesPage",
  components: {
    SmallButton,
    DateRange,
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
      { label: 'Notes (public)', href: '/' },
      { label: 'Tags', href: '/admin/tags' },
      { label: 'Notes (private)', href: '/admin/notes' }
    ]);

    // дефолтное значение
    const selectedPerPage = ref(10);
    const selectedStatus = ref("");
    const selectedRange = ref([null, null]);
    const search = ref("");

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

    const clearFilter = () => {
      selectedStatus.value = "";
      search.value = "";
      selectedRange.value = [null, null];

      const { per_page } = route.query;
      router.push({query: {per_page: per_page || 10}});
    }

    const handlePageChange = async (url) => {

      if (!url) return; // Защита на случай передачи пустого URL

      const params = new URL(url).searchParams; // Извлекаем параметры из URL
      const page = params.get("page"); // Получаем номер страницы
      const perPage = selectedPerPage.value;
      const status = selectedStatus.value;
      const search = search.value;

      // Обновляем параметры в адресной строке
      router.push({
        query: {
          ...route.query, // Сохраняем текущие параметры
          page,
          per_page: perPage,
          status: status,
          search_title: search,
        },
      });

      // Выполняем запрос на сервер
      await fetching({ page, per_page: perPage });
    };


    onMounted(async () => {
      // Считываем параметры из URL
      const {
        per_page: perPageFromUrl,
        status: statusFromUrl,
        start_date,
        end_date,
        search_title,
      } = route.query;

      // Синхронизация параметров из URL с внутренними переменными
      selectedStatus.value = statusFromUrl || ""; // Если нет `statusFromUrl`, установить дефолтное значение
      selectedPerPage.value = Number(perPageFromUrl) || 10; // Если нет `per_page`, установить дефолтное значение
      search.value = search_title || "";

      // Устанавливаем значения из параметров URL
      if (start_date || end_date) {
        selectedRange.value = [
          start_date ? new Date(start_date) : null,
          end_date ? new Date(end_date) : null,
        ];
      }

      // Выполняем запрос с параметрами
      await fetching({
        per_page: selectedPerPage.value,
        status: selectedStatus.value,
        start_date,
        end_date,
        search_title,
      });
    });

    // отслеживаем изменения фильтров
    watch([
      selectedStatus,
      selectedPerPage,
      selectedRange,
      search
    ], async ([newStatus, newPerPage, newSelectedRange, newSearch]) => {

      const [startDate, endDate] = newSelectedRange

      // Формируем объект параметров
      const updatedParams = {
        ...route.query,
        page: 1, // Сбрасываем страницу
        per_page: newPerPage,
        start_date: startDate ? startDate.toISOString().split("T")[0] : undefined,
        end_date: endDate ? endDate.toISOString().split("T")[0] : undefined,
        search_title: newSearch ? newSearch : undefined,
      };

      console.log('updatedParams: ', updatedParams);

      // Удаляем ключи из параметров, если дата отсутствует
      if (!startDate) delete updatedParams.start_date;
      if (!endDate) delete updatedParams.end_date;
      if (!newSearch) delete updatedParams.search_title;

      // Удаляем параметр `status` из URL, если статус пустой
      if (newStatus) {
        updatedParams.status = newStatus;
      } else {
        delete updatedParams.status;
      }

      console.log('Clear updatedParams: ', updatedParams);

      // Используем сформированные параметры для обновления URL
      router.push({ query: updatedParams });

      // И для выполнения запроса
      await fetching(updatedParams);
    });

    return {
      notes,
      meta,
      toCreatePage,
      clearFilter,
      selectedPerPage,
      optionsPerPage,
      handlePageChange,
      selectedStatus,
      optionsStatuses,
      selectedRange,
      search
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