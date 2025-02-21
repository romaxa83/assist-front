<template>
  <div class="container">

    <div class="accordion" id="accordionPanelsPrivateNote">
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
          <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseOne"
          >
            View Note
          </button>
        </h2>
        <div id="panelsStayOpen-collapseOne"
             class="accordion-collapse collapse"
             aria-labelledby="panelsStayOpen-headingOne"
        >
          <div class="accordion-body">
            <!-- Public Show  -->
            <note-view :note="note"/>
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
          <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo">
            Raw HTML Tags (Edited)
          </button>
        </h2>
        <div id="panelsStayOpen-collapseTwo"
             class="accordion-collapse collapse"
             aria-labelledby="panelsStayOpen-headingTwo"
        >
          <div class="accordion-body">
          <!-- Отображение экранированного текста -->
            <pre v-if="formattedText">
              <highlightjs
                  language="html"
                  :code="formattedText"
              />
            </pre>
            <p v-else>Loading...</p>
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingThree">
          <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseThree"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseThree">
            Blocks
          </button>
        </h2>
        <div id="panelsStayOpen-collapseThree"
             class="accordion-collapse collapse"
             aria-labelledby="panelsStayOpen-headingThree"
        >
          <div class="accordion-body">
            <!-- Отображение экранированного текста -->
            <pre v-if="formattedText">
              <highlightjs
                  language="html"
                  :code="formattedText"
              />
            </pre>
            <p v-else>Loading...</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import {useBreadcrumbs} from "@/hooks/useBreadcrumbs";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref, computed} from "vue";
import axios from "@/services/axios";
import 'highlight.js/styles/tokyo-night-dark.css';
import TagsRowForNote from "@/components/tags/note/TagsRow.vue";
import NoteView from "@/components/notes/view/NoteView.vue";

export default {
  name: "NotePrivatePage",
  components: {
    NoteView,
    TagsRowForNote
  },
  setup(props) {
    const breadcrumbs = ref([
      { label: "Main", href: "/" },
    ]);
    useBreadcrumbs(breadcrumbs);

    const route = useRoute();
    const router = useRouter();       // Для перехода после обновления заметки
    const noteId = route.params.id;   // Получаем id из маршрута

    const note = ref({});

    const loadNote = async () => {
      try {
        const response = await axios.get(`/api/private/notes/${noteId}`,{withAuth: true});
        note.value = response.data;

        // Обновляем хлебные крошки с учётом нового заголовка
        breadcrumbs.value = [
          ...breadcrumbs.value,
          { label: note.value.title, href: `/admin/notes/update/${noteId}` },
          { label: "/", href: "" },
        ];

      } catch (error) {
        console.error("Ошибка при загрузке заметки:", error);
      }
    };

    // Функция для добавления переноса строки после закрытия тега
    const addNewlineAfterTags = (html) => {
      return html
          .replace(/>\s*</g, ">\n<") // Перенос между тегами без пробелов
          .replace(/([^>\n])<\/([a-zA-Z0-9]+)>/g, "$1\n</$2>"); // Добавляем перенос перед </tag>
    };


    // Экранирование HTML
    const formattedText = computed(() => {
      // Проверяем, что данные уже загружены
      if (note.value.text) {
        const escapedHtml = note.value.text
            .replace(/&/g, "&amp;") // Экранируем &
            .replace(/</g, "&lt;") // Экранируем <
            .replace(/>/g, "&gt;"); // Экранируем >


        return addNewlineAfterTags(note.value.text); // Добавляем перенос строки

      }
      return ""; // Возвращаем пустую строку, пока данные не загрузились
    });

    onMounted(loadNote);

    return {
      note,
      formattedText
    };
  },
}
</script>

<style scoped>

.accordion-item {
  border: 1px solid #ddd; /* Цвет границы аккордеона */
  border-radius: 5px; /* Скругление углов */
  margin-bottom: 10px; /* Отступ между элементами */
  overflow: hidden; /* Убираем лишние края */
}

.accordion-header {
  background-color: #f8f9fa; /* Лёгкий фон для заголовка */
  padding: 0; /* Убираем дефолтные отступы */
}

.accordion-button {
  background-color: #e9ecef; /* Цвет кнопки заголовка */
  color: #333; /* Цвет текста */
  font-weight: bold; /* Полужирный текст */
  transition: background-color 0.3s ease; /* Плавный переход */
}

.accordion-button:focus {
  box-shadow: none; /* Убираем выделение */
}

.accordion-button:hover {
  background-color: #dfe3e6; /* Цвет кнопки при наведении */
}

.accordion-collapse {
  background-color: #ffffff; /* Белый фон для содержимого */
}

.accordion-body {
  padding: 15px; /* Увеличенные отступы для содержимого */
  font-size: 14px; /* Удобный размер текста */
  color: #555; /* Цвет текста */
}


</style>