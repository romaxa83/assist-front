<template>
  <main class="container">
    <div class="row g-5">

      <div class="col-md-9">
        <note-view :note="note"/>
      </div>

      <div class="col-md-3">
        <div class="position-sticky" style="top: 2rem;">
          <div class="p-4">
            <h4 class="fst-italic">Navigation</h4>
            <ol class="list-unstyled mb-0">
              <li
                  v-for="anchor in note.anchors"
                  :key="anchor.id"
              ><a :href="'#' + anchor.id">{{  anchor.content }}</a></li>
            </ol>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<script>

import {useBreadcrumbs} from "@/hooks/useBreadcrumbs";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import axios from "@/services/axios";
import 'highlight.js/styles/tokyo-night-dark.css';
import NoteView from "@/components/notes/view/NoteView.vue";

export default {
  name: "NotePage",
  components: {
    NoteView
  },
  setup() {
    const breadcrumbs = ref([
      { label: "Main", href: "/" },
    ]);
    useBreadcrumbs(breadcrumbs);

    const route = useRoute();
    const noteSlug = route.params.slug;

    const note = ref({});

    const loadNote = async () => {
      try {
        const response = await axios.get(`/api/notes/${noteSlug}`);
        note.value = response.data;

        // Обновляем хлебные крошки с учётом нового заголовка
        breadcrumbs.value = [
          ...breadcrumbs.value,
          { label: note.value.title, href: "" },
        ];

      } catch (error) {
        console.error("Ошибка при загрузке заметки:", error);
      }
    };

    // Загружаем заметку при монтировании компонента
    onMounted(loadNote);

    return {
      note
    };
  },
}
</script>

<style scoped>

</style>