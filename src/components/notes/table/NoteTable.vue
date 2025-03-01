<template>
  <table class="table table-hover">
    <thead>
    <tr>
      <th scope="col">
        ID
      </th>
      <th scope="col">Title</th>
      <th scope="col">Status</th>
      <th scope="col">Weight</th>
      <th scope="col">
        <sort-column
            field="created_at"
            :activeSort="{ field: 'created_at', desc: 'asc' }"
        >
          Created
        </sort-column>
      </th>
      <th scope="col" class="text-center actions-column">Action</th>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="note in notes"
        :key="note.id"
        class="table-warning"
    >
      <th scope="row">{{ note.id }}</th>
      <td>{{ note.title }}</td>
      <td>
<!--        <note-status :status="note.status"/>-->

        <div class="dropdown">
          <button
              class="btn btn-sm dropdown-toggle dropdownNoteStatusButton"
              type="button"
              id="dropdownNoteStatusButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
          >
            {{note.status.toUpperCase()}}
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownNoteStatusButton">
            <li
                v-for="statusOption in note.meta.statuses"
                :key="statusOption.value"
                @click="updateNoteStatus(note, statusOption)"
            >
              <a class="dropdown-item" href="#">{{ statusOption.label }}</a>
            </li>
          </ul>
        </div>
      </td>
      <td>{{ note.weight }}</td>
      <td>{{ note.created_at }}</td>
      <td class="text-end actions-column">
        <div class="d-flex flex-nowrap align-items-center">

          <small-button
              classCustom="me-2"
              @click="toNotePrivatePage(note)"
              title="Show details"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </small-button>

          <small-button
              classCustom="me-2"
              @click="toNotePage(note)"
              :disabled="!note.meta.actions.show.can"
              :tooltip="note.meta.actions.show.can ? '' : note.meta.actions.show.reason[0]"
              title="Show"
          >
            <i class="fa-solid fa-eye"></i>
          </small-button>

          <small-button
              classCustom="me-2"
              title="Edit"
              @click="toUpdatePage(note)"
              :disabled="!note.meta.actions.edit.can"
              :tooltip="note.meta.actions.edit.can ? '' : note.meta.actions.edit.reason[0]"
          >
            <i class="fa-solid fa-pen"></i>
          </small-button>

          <small-button
              title="Delete"
              @click="removeNote(note)"
              :disabled="!note.meta.actions.delete.can"
              :tooltip="note.meta.actions.delete.can ? '' : note.meta.actions.delete.reason[0]"
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

import { useRouter, useRoute } from "vue-router";
import axios from "@/services/axios";
import SortColumn from "@/components/ui/table/SortColumn.vue";
import SmallButton from "@/components/ui/button/SmallButton.vue";
import NoteStatus from "@/components/notes/table/NoteStatus.vue";


export default {
  name: "NoteTable",
  components: {
    NoteStatus,
    SmallButton,
    SortColumn
  },
  props: {
    notes: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();

    const toUpdatePage = (note) => router.push(`/admin/notes/update/${note.id}`);
    const toNotePage = (note) => router.push(`/notes/${note.slug}`);
    const toNotePrivatePage = (note) => router.push(`/admin/notes/${note.id}`);

    const removeNote = async (note) => {

      try {
        const res = await axios.delete(`api/private/notes/${note.id}`,{
          withAuth: true,
        });

        console.log('Remove note',res)

        router.push('/admin/notes');
      } catch (error) {
        console.error("Ошибка при remove:", error);
      }
    }

    // Метод для обновления статуса заметки
    const updateNoteStatus = async (note, status) => {

      try {
        await axios.post(`api/private/notes/${note.id}/set-status`,
            { status: status.value}, {withAuth: true,}
        );

        console.log(`Note ID: ${note.id} status updated to ${status}`);
        note.status = status.label; // Локальное обновление статуса для текущей заметки
      } catch (error) {
        console.error("Ошибка при обновлении статуса:", error);
      }
    };

    return {
      toUpdatePage,
      toNotePage,
      toNotePrivatePage,
      removeNote,
      updateNoteStatus
    }
  },
}
</script>

<style scoped>
/* Автоматически растягивать высоту action-колонки */
.actions-column {
  white-space: nowrap; /* Не позволяет содержимому колонки разваливаться на несколько строк */
  vertical-align: middle;
}

/* Дополнительно стилизуйте кнопки, если они добавляют пустоту */
.actions-column .btn {
  margin: 0; /* Убираем лишний отступ между кнопками */
}

.dropdownNoteStatusButton {
  background-color: var(--btn-action-background);
  color: var(--btn-action-color);
  border: none;
  padding: 0.5rem 0.5rem;
  font-size: 13px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdownNoteStatusButton:hover {
  background-color: var(--btn-action-hover-background);
  color: var(--btn-action-hover-color);
}

</style>
