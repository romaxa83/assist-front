<template>
  <div class="note-view">
    <h1 class="pb-4 mb-4 fst-italic border-bottom">
      {{ note.title }}
    </h1>

    <tags-row-for-note :tags="note.tags || []" size="large"/>

    <article class="blog-post border-bottom">
      <div
          v-for="(block, index) in note.text_blocks"
          :key="index"
      >
        <!-- Текстовые блоки -->
        <div
            v-if="block.type === 'text'"
            v-html="block.content"
            class="text-block"
        ></div>

        <!-- Блоки кода -->
        <div
            v-else-if="block.type === 'code'"
            class="code-block"
        >
          <div class="tooltip-container">
            <!-- Кнопка копирования -->
            <button
                class="copy-button"
                @click="copyToClipboard(block.content, index)"
                title="Скопировать"
            >
              <i class="fa-solid fa-copy"></i>
            </button>

            <!-- Tooltip-сообщение -->
            <span class="tooltip-message" v-if="copiedIndex === index">Copied</span>
          </div>

          <highlightjs
              :language="block.language"
              :code="block.content"
          />
        </div>
      </div>
    </article>
  </div>
</template>
<script>
import TagsRowForNote from "@/components/tags/note/TagsRow.vue";
import {ref} from "vue";

export default {
  name: "NoteView",
  props: {
      note: {
        type: Object,
        required: true,
      }
  },
  components: {TagsRowForNote},
  setup() {

    // Хранит индекс блока кода, где был клик
    const copiedIndex = ref(null);

    const copyToClipboard = (content, index) => {
      if (!navigator.clipboard) {
        // Старые браузеры (fallback)
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.position = 'fixed'; // Избегаем скролла
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand('copy'); // Копируем текст
        } catch (err) {
          console.error('Ошибка копирования: ', err);
        }
        document.body.removeChild(textarea); // Удаляем textarea
        return;
      }

      // Используем современный API для копирования
      navigator.clipboard.writeText(content).then(() => {
        copiedIndex.value = index; // Устанавливаем индекс скопированного блока

        // Скрываем tooltip спустя 2 секунды
        setTimeout(() => {
          copiedIndex.value = null;
        }, 2000);
      }).catch((err) => {
        console.error('Ошибка копирования:', err);
      });
    };

    return {
      copiedIndex,
      copyToClipboard,
    };
  }
}
</script>

<style scoped>
.code-block {
  position: relative; /* Устанавливаем контекст позиционирования для кнопки */
}

.copy-button {
  position: absolute; /* Позиционируется относительно .code-block */
  top: 10px; /* Отступ от верхнего края */
  right: 10px; /* Отступ от правого края */
  background: var(--btn-action-background); /* Цвет кнопки */
  color: var(--btn-action-color); /* Цвет текста / иконки */
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  z-index: 10; /* Для отображения над блоком */
}

.copy-button:hover {
  background: var(--btn-action-hover-background); /* Цвет кнопки при наведении */
  color: var(--btn-action-hover-color);
}

.tooltip-container {
  position: relative; /* Для правильного позиционирования подсказки */
}

.tooltip-message {
  position: absolute;
  top: -30px; /* Над кнопкой */
  right: 5px;
  background: var(--tooltip-background-color);
  color: var(--tooltip-color);
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 1;
  pointer-events: none;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.tooltip-message::after {
  content: '';
  position: absolute;
  bottom: -6px; /* Треугольник под tooltip */
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
}
</style>