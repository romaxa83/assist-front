<template>
  <div class="container">
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </symbol>
      <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </symbol>
      <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </symbol>
    </svg>


    <div v-if="note.meta?.warning?.has">
      <div
          v-for="(reason, index) in note.meta.warning.reason"
          :key="index"
          class="custom-alert"
          role="alert"
      >
        <svg
            class="custom-alert-icon"
            width="24"
            height="24"
            role="img"
            aria-label="Danger"
            viewBox="0 0 16 16"
        >
        <path
            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
            fill="currentColor"
        />
        </svg>

        <span class="custom-alert-text">{{ reason }}</span>
        <button type="button" class="custom-alert-close" @click="closeAlert(index)" aria-label="Close">
          &times;
        </button>
      </div>
    </div>


    <div class="accordion pt-3" id="accordionPanelsPrivateNote">
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
            <!-- TEXT Block -->

            <div class="accordion pt-3" id="accordionPanelsTextBlock">
              <template v-for="(block, index) in note.text_blocks" :key="index">
                <div class="accordion-item">
                  <h2 class="accordion-header" :id="'panelsTextBlock-heading' + index">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        :data-bs-toggle="'collapse'"
                        :data-bs-target="'#panelsTextBlock-collapse' + index"
                        aria-expanded="false"
                        :aria-controls="'panelsTextBlock-collapse' + index"
                    >
                      Block {{ index + 1 }}
                    </button>
                    <span class="accordion-header_desc">type: <b>{{block.type}}</b> , language: <b>{{ block.language }}</b></span>
                  </h2>
                  <div
                      :id="'panelsTextBlock-collapse' + index"
                      class="accordion-collapse collapse"
                      :aria-labelledby="'panelsTextBlock-heading' + index"
                  >
                    <div class="accordion-body">
                      <!-- Рендеринг контента на основе типа блока -->
                      <div v-if="block.type === 'text'">
                        <!-- Применяем обработанную функцию -->
                        <pre>{{ addNewlineAfterTags(block.content) }}</pre>
                      </div>
                      <div v-else-if="block.type === 'quote'">
                        <!-- Применяем обработанную функцию -->
                        <pre>{{ addNewlineAfterTags(block.content) }}</pre>
                      </div>
                      <div v-else-if="block.type === 'code'">
                        <highlightjs
                            language="html"
                            :code="block.content"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>



            </div>
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
      { label: "Notes(private)", href: "/admin/notes" },
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
          { label: 'Update', href: `/admin/notes/update/${noteId}` },
          { label: note.value.title, href: "" },
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
        return addNewlineAfterTags(note.value.text); // Добавляем перенос строки

      }
      return ""; // Возвращаем пустую строку, пока данные не загрузились
    });

    const closeAlert = (index) => {
      note.value.meta.warning.reason.splice(index, 1);
      if (note.value.meta.warning.reason.length === 0) {
        note.value.meta.warning.has = false; // Если список пуст, убираем блок
      }
    };


    onMounted(loadNote);

    return {
      note,
      formattedText,
      closeAlert,
      addNewlineAfterTags

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

.accordion-header_desc {
  font-size: 14px; /* Размер текста */
  color: #6c757d; /* Светло-серый цвет текста */
  margin-left: 10px; /* Отступ от кнопки */
  margin-bottom: 20px; /* Отступ от кнопки */
  display: inline-block; /* Отображение в одну строку */
  font-style: italic; /* Курсивное начертание */
}



/* Кастомный стиль для алерта */
.custom-alert {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  border: 1px solid #ef9a9a; /* Цвет рамки */
  background-color: #ffcdd2; /* Светло-красный фон */
  color: #d32f2f; /* Цвет текста */
  border-radius: 5px; /* Скругление углов */
  position: relative;
  font-size: 16px;
}

/* Иконка предупреждения */
.custom-alert-icon {
  margin-right: 10px;
  fill: #d32f2f; /* Красный цвет иконки */
}

/* Текст внутри алерта */
.custom-alert-text {
  flex-grow: 1;
}

/* Кнопка закрытия */
.custom-alert-close {
  background: none; /* Убираем стандартный фоновый стиль */
  border: none; /* Убираем границу */
  color: #d32f2f; /* Цвет символа закрытия */
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 10px;
}

.custom-alert-close:hover {
  color: #b71c1c; /* Более тёмный оттенок при наведении */
}


</style>