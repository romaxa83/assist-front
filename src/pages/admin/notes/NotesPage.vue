<template>

  <div class="container">

    <div class="row g-5">
      <div class="col-md-10">

        <div class="d-flex justify-content-between align-items-center pb-4 mb-4 border-bottom">
          <h3 class="fst-italic">
            Notes
          </h3>

          <!-- Create  -->
          <custom-button
              @click="toCreatePage"
          >
            Create
          </custom-button>

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
          <note-table
              :notes="notes"
          />
        </div>

        <div class="row mb-2">

        </div>
      </div>
    </div>

  </div>
</template>

<script>

import {useNotes} from "@/hooks/notes/useNotes";
import NoteTable from "@/components/notes/table/NoteTable.vue";
import { useRouter } from 'vue-router';
import Breadcrumb from "@/components/ui/nav/Breadcrumb.vue";
import {useBreadcrumbs} from "@/hooks/useBreadcrumbs";

export default {
  name: "NotesPage",
  components: {
    Breadcrumb,
    NoteTable,
  },
  setup(props, context) {
    useBreadcrumbs([
      { label: 'Tags', href: '/admin/tags' },
      { label: 'Notes', href: '/admin/notes' }
    ]);

    const router = useRouter();

    const {notes} = useNotes();

    const toCreatePage = () => router.push('/admin/notes/create');

    return {
      notes,
      toCreatePage,

    }
  },
}
</script>

<style scoped>

</style>