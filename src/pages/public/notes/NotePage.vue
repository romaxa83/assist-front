<template>
  <main class="container">
    <div class="row g-5">

      <div class="col-md-9">
        <h1 class="pb-4 mb-4 fst-italic border-bottom">
          {{ note.title }}
        </h1>

        <article
            class="blog-post border-bottom"
            v-html="note.text"
        >
        </article>

      </div>

      <div class="col-md-3">
        <div class="position-sticky" style="top: 2rem;">
          <div class="p-4 mb-3 bg-light rounded">
            <h4 class="fst-italic">About</h4>
            <p class="mb-0">Customize this section to tell your visitors a little bit about your publication, writers, content, or something else entirely. Totally up to you.</p>
          </div>

          <div class="p-4">
            <h4 class="fst-italic">Archives</h4>
            <ol class="list-unstyled mb-0">
              <li><a href="#">March 2021</a></li>
              <li><a href="#">February 2021</a></li>
              <li><a href="#">January 2021</a></li>
              <li><a href="#">December 2020</a></li>
              <li><a href="#">November 2020</a></li>
              <li><a href="#">October 2020</a></li>
              <li><a href="#">September 2020</a></li>
              <li><a href="#">August 2020</a></li>
              <li><a href="#">July 2020</a></li>
              <li><a href="#">June 2020</a></li>
              <li><a href="#">May 2020</a></li>
              <li><a href="#">April 2020</a></li>
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
import {useTags} from "@/hooks/tags/useTags";
import axios from "@/services/axios";

export default {
  name: "NotePage",
  setup() {
    const route = useRoute(); // Используем для получения параметров маршрута (id)
    const router = useRouter(); // Для перехода после обновления заметки
    const noteId = route.params.id; // Получаем id из маршрута

    const note = ref({});

    const loadNote = async () => {
      try {
        const response = await axios.get(`/api/notes/${noteId}`);
        note.value = response.data;

      } catch (error) {
        console.error("Ошибка при загрузке заметки:", error);
      }
    };


    // Загружаем заметку при монтировании компонента
    onMounted(loadNote);
console.log('NOTE', note.value);
    return {
      note,
    };
  },
}
</script>


<style scoped>

</style>